import { useQuery } from "@aziontech/sql";
import { Document } from "@langchain/core/documents";
import { BaseRetriever, BaseRetrieverInput } from "@langchain/core/retrievers";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import type { EmbeddingsInterface } from "@langchain/core/embeddings";
import type { BaseChatModel } from "@langchain/core/language_models/chat_models";

export type AzionFilter = {
  operator: string;
  column: string;
  value: string;
};

export interface AzionRetrieverArgs extends BaseRetrieverInput {
  /** "similarity" = vector search only, "hybrid" = vector + full text search */
  searchType?: "similarity" | "hybrid";
  similarityK?: number;
  ftsK?: number;
  dbName?: string;
  vectorTable?: string;
  ftsTable?: string;
  /** Metadata keys to return with each document */
  metadataItems?: string[];
  filters?: AzionFilter[];
  /** true when metadata lives in separate columns instead of a single JSON column */
  expandedMetadata?: boolean;
  /** Chat model used to extract the entities for the FTS query */
  entityExtractor?: BaseChatModel;
  promptEntityExtractor?: string;
}

type Row = {
  id: number;
  content: string;
  metadata: Record<string, any>;
};

/**
 * Hybrid (vector + FTS) retriever for Azion Edge SQL, built on @aziontech/sql.
 * Drop-in replacement for AzionRetriever from @langchain/community, which
 * depends on the legacy `azion/sql` package.
 */
export class AzionRetriever extends BaseRetriever {
  static lc_name() {
    return "azionRetriever";
  }

  lc_namespace = ["langchain", "retrievers", "azion"];

  private readonly embeddings: EmbeddingsInterface;
  private readonly searchType: "similarity" | "hybrid";
  private readonly similarityK: number;
  private readonly ftsK: number;
  private readonly dbName: string;
  private readonly vectorTable: string;
  private readonly ftsTable: string;
  private readonly metadataItems?: string[];
  private readonly filters: AzionFilter[];
  private readonly expandedMetadata: boolean;
  private readonly entityExtractor?: BaseChatModel;
  private readonly promptEntityExtractor: string;

  constructor(embeddings: EmbeddingsInterface, args: AzionRetrieverArgs) {
    super(args);
    this.embeddings = embeddings;
    this.searchType = args.searchType ?? "similarity";
    this.similarityK = Math.max(1, args.similarityK ?? 1);
    this.ftsK = Math.max(1, args.ftsK ?? 1);
    this.dbName = args.dbName ?? "vectorstore";
    this.vectorTable = args.vectorTable ?? "vectors";
    this.ftsTable = args.ftsTable ?? "vectors_fts";
    this.metadataItems = args.metadataItems;
    this.filters = args.filters ?? [];
    this.expandedMetadata = args.expandedMetadata ?? false;
    this.entityExtractor = args.entityExtractor;
    this.promptEntityExtractor =
      args.promptEntityExtractor ??
      "Provide them as a space-separated string in lowercase, translated to English.";
  }

  async _getRelevantDocuments(query: string): Promise<Document[]> {
    const statements = await this.generateStatements(query);
    const { data, error } = await useQuery(this.dbName, statements);

    if (!data) {
      throw new Error(error?.message ?? "Edge SQL query failed");
    }

    const rows = this.mapRows(data.results);
    const selected =
      this.searchType === "hybrid" ? this.removeDuplicates(rows) : rows;

    return selected.map(
      (row) =>
        new Document({
          id: row.id.toString(),
          pageContent: row.content,
          metadata: row.metadata,
        }),
    );
  }

  private async generateStatements(query: string): Promise<string[]> {
    const embeddedQuery = await this.embeddings.embedQuery(query);
    const metadata = this.generateMetadata();
    const filters = this.generateFilters();
    const rowsNumber =
      this.searchType === "hybrid"
        ? this.similarityK + this.ftsK
        : this.similarityK;

    const similarityQuery = `
      SELECT id, content, ${metadata.replace("hybrid", "similarity")}
      FROM ${this.vectorTable}
      WHERE ${filters} rowid IN vector_top_k('${this.vectorTable}_idx', vector('[${embeddedQuery}]'), ${rowsNumber})
    `;

    if (this.searchType === "similarity") {
      return [similarityQuery];
    }

    const queryEntities = await this.extractEntities(query);
    const ftsQuery = `
      SELECT id, content, ${metadata.replace("hybrid", "fts")}
      FROM ${this.ftsTable}
      WHERE ${filters} ${this.ftsTable} MATCH '${queryEntities.replace(/'/g, "''")}'
      ORDER BY rank
      LIMIT ${rowsNumber}
    `;

    return [similarityQuery, ftsQuery];
  }

  private generateFilters(): string {
    if (this.filters.length === 0) return "";

    return (
      this.filters
        .map(({ operator, column, value }) => {
          const columnRef = this.expandedMetadata
            ? this.sanitize(column)
            : `metadata->>'$.${this.sanitize(column)}'`;
          if (["IN", "NOT IN"].includes(operator.toUpperCase())) {
            return `${columnRef} ${operator} (${this.sanitize(value)})`;
          }
          return `${columnRef} ${operator} '${this.sanitize(value)}'`;
        })
        .join(" AND ") + " AND "
    );
  }

  private generateMetadata(): string {
    if (!this.metadataItems) {
      return `json_object('searchtype', '${this.searchType}') as metadata`;
    }
    if (this.expandedMetadata) {
      return `json_object('searchtype','${this.searchType}',${this.metadataItems
        .map((item) => `'${this.sanitize(item)}', ${this.sanitize(item)}`)
        .join(", ")}) as metadata`;
    }
    return `json_patch(json_object(${this.metadataItems
      .map(
        (item) =>
          `'${this.sanitize(item)}', metadata->>'$.${this.sanitize(item)}'`,
      )
      .join(", ")}), '{"searchtype":"${this.searchType}"}') as metadata`;
  }

  private async extractEntities(query: string): Promise<string> {
    if (!this.entityExtractor) {
      return this.toFtsQuery(query);
    }
    const response = await this.entityExtractor.invoke([
      new SystemMessage(this.promptEntityExtractor),
      new HumanMessage(query),
    ]);
    return this.toFtsQuery(response.content.toString());
  }

  private toFtsQuery(query: string): string {
    return query
      .replace(/[^a-záàâãéèêíïóôõöúçñA-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ0-9\s]/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ")
      .join(" OR ");
  }

  private mapRows(
    results: Array<{ rows?: any[]; columns?: string[] }> | undefined,
  ): Row[] {
    if (!results) return [];
    return results.flatMap((result) => {
      if (!result.rows || !result.columns) return [];
      return result.rows.map((row) => ({
        id: Number(row[0]),
        content: String(row[1]),
        metadata: JSON.parse(String(row[2])),
      }));
    });
  }

  private removeDuplicates(rows: Row[]): Row[] {
    const unique: Row[] = [];
    const seen = new Set<number>();
    let similarityCount = 0;
    let ftsCount = 0;
    const maxItems = this.similarityK + this.ftsK;

    for (const row of rows) {
      if (seen.has(row.id)) continue;
      if (
        row.metadata.searchtype === "similarity" &&
        similarityCount < this.similarityK
      ) {
        seen.add(row.id);
        unique.push(row);
        similarityCount++;
      } else if (row.metadata.searchtype === "fts" && ftsCount < this.ftsK) {
        seen.add(row.id);
        unique.push(row);
        ftsCount++;
      }
      if (similarityCount + ftsCount === maxItems) break;
    }
    return unique;
  }

  private sanitize(item?: string): string {
    return item ? item.replace(/[^a-zA-Z0-9\s]/g, "") : "";
  }
}
