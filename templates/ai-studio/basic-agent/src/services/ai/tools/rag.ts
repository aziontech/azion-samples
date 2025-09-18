import config from '@/helpers/constants';
import { DynamicStructuredTool } from '@langchain/core/tools';
import { OpenAIEmbeddings } from '@langchain/openai';
import { useQuery, type AzionEnvironment } from 'azion/sql';
import { z } from 'zod';

// Read Edge SQL token from environment (.env), not hardcoded
const EDGE_SQL_TOKEN = process.env.AZION_TOKEN || '';
if (!EDGE_SQL_TOKEN) {
  console.warn('[RAG] EDGE_SQL_TOKEN is not set. Please configure it in your environment (.env).');
}
const DEVELOPMENT = process.env.DEVELOPMENT || false;

// Resolve AI Studio base URL from environment (supports both hyphen and underscore var names)
const AI_STUDIO_BASE_URL = process.env['AI-STUDIO-URL'] || process.env.AI_STUDIO_URL;

// Helper to sanitize user input for SQL LIKE/MATCH
function sanitize(input: string): string {
  return (input || '').replace(/'/g, "''").trim();
}

type SourceFilter = { filter: 'include' | 'exclude'; values: string };

async function generateQueryEmbeddings(query: string, embeddingModel?: string): Promise<number[]> {
  const embeddingsModel = new OpenAIEmbeddings({
    model: embeddingModel || 'text-embedding-3-small',
    verbose: false,
    apiKey: process.env.EDGE_AI_TOKEN,
    // Route embedding calls through Azion Edge AI endpoint
    configuration: {
      baseURL: 'https://swjkwqi8lj.map.azionedge.net'
    }
  } as any);
  const embedding = await embeddingsModel.embedQuery(query);
  return embedding;
}

function buildKbFilter(kbIdsCsv?: string): string {
  if (!kbIdsCsv) return '';
  return kbIdsCsv.includes(',')
    ? `d.kb_id IN ('${kbIdsCsv.replace(/\s*,\s*/g, "','")}') AND `
    : `d.kb_id = '${sanitize(kbIdsCsv)}' AND `;
}

function buildSourceFilter(sourceFilter?: SourceFilter[]): string {
  if (!sourceFilter || sourceFilter.length === 0) return '';
  let filterString = '';
  for (const filter of sourceFilter) {
    const v = sanitize(filter.values);
    if (filter.filter === 'include') {
      filterString += `d.source_uri LIKE '%${v}%' AND `;
    } else {
      filterString += `d.source_uri NOT LIKE '%${v}%' AND `;
    }
  }
  return filterString;
}

async function buildVectorQuery(
  query: string,
  docsAmount: number,
  chunkTable: string,
  documentTable: string,
  kbFilter: string,
  sourceFilter: string,
  embeddingModel?: string
): Promise<string> {
  const embedded = await generateQueryEmbeddings(query, embeddingModel);
  const vec = `[${embedded}]`;
  // Compose optional filters (kb/source) + similarity threshold
  const filters = `${kbFilter}${sourceFilter}`.trim();
  const similarityClause = `(1 - vector_distance_cos(c.embedding, vector('${vec}'))) > 0.2`;
  const whereClause = filters
    ? `${filters}${similarityClause}`
    : similarityClause;
  const q = `SELECT d.name AS title,
                    c.content AS content,
                    d.source_uri AS source,
                    1 - vector_distance_cos(c.embedding, vector('${vec}')) AS similarity,
                    'similarity' AS search_type
             FROM ${chunkTable} c
             JOIN ${documentTable} d ON d.document_id = c.document_id
             WHERE ${whereClause}
             ORDER BY vector_distance_cos(c.embedding, vector('${vec}')) ASC
             LIMIT ${2 * docsAmount};`;
  return q;
}

function buildFtsQuery(
  query: string,
  docsAmount: number,
  ftsTable: string,
  chunkTable: string,
  documentTable: string,
  kbFilter: string,
  sourceFilter: string
): string {
  const sanitizedQuery = query
    .replace(/['",.\/\\;:!?]/g, '')
    .trim()
    .split(/\s+/)
    .filter((w) => w.length > 0);

  const parts: string[] = [];
  if (sanitizedQuery.length > 1) {
    parts.push(`"${sanitizedQuery.join(' ')}"`);
    // Conservative NEAR usage for compatibility: term1 NEAR term2 [NEAR term3 ...]
    parts.push(`${sanitizedQuery.join(' NEAR ')}`);
    parts.push(sanitizedQuery.map((w) => `${w}*`).join(' AND '));
  } else {
    parts.push(`"${sanitizedQuery[0]}" OR ${sanitizedQuery[0]}*`);
  }
  const finalQuery = parts.join(' OR ');

  const q = `SELECT 
                d.name AS title,
                c.content AS content,
                d.source_uri AS source,
                NULL as similarity,
                'fts' AS search_type
              FROM ${ftsTable} f
              JOIN ${chunkTable} c ON c.chunk_id = f.rowid
              JOIN ${documentTable} d ON d.document_id = c.document_id
              WHERE ${kbFilter}${sourceFilter}${ftsTable} MATCH '${sanitize(finalQuery)}'
              LIMIT ${2 * docsAmount}`;
  console.log(q)
  return q;
}

function mapDbResults(data: any): any[] {
  console.log("MAPING DB RESULTS")
  const bestDocs = new Map<string, any>();
  const results = data?.results || [];
  for (const statementResult of results) {
    const { columns, rows } = statementResult;
    if (!columns || !rows) continue;
    for (const row of rows) {
      const obj: any = {};
      columns.forEach((col: string, idx: number) => {
        obj[col] = row[idx];
      });
      const key = JSON.stringify([obj.source]);
      if (!bestDocs.has(key) || (typeof obj.similarity === 'number' && obj.similarity > bestDocs.get(key).similarity)) {
        bestDocs.set(key, obj);
      }
    }
  }
  return Array.from(bestDocs.values()).sort((a, b) => (b.similarity ?? 0) - (a.similarity ?? 0));
}

async function executeHybridSearch(
  query: string,
  docsAmount: number,
  collection?: string,
  sourceFilter?: SourceFilter[],
  fieldsToUseOnRerank?: string[],
  overrides?: { dbName?: string; embeddingModel?: string }
): Promise<any[]> {
  const dbName = overrides?.dbName || (config as any).DBNAME;
  console.log('[RAG] Hybrid search DB name:', dbName);
  const chunkTable = 'chunk';
  const ftsTable = 'chunk_fts';
  const documentTable = 'document';
  console.log('[RAG] Tables:', { chunkTable, ftsTable, documentTable });

  const kbFilter = buildKbFilter(collection);
  const sourceFilterString = buildSourceFilter(sourceFilter);

  // Try to build vector query; if embeddings fail, continue with FTS-only
  let vectorQuery: string | undefined = undefined;
  try {
    vectorQuery = await buildVectorQuery(query, docsAmount, chunkTable, documentTable, kbFilter, sourceFilterString, overrides?.embeddingModel);
  } catch (e) {
    console.warn('[RAG] Vector embeddings failed, continuing with FTS-only:', e);
  }
  const queryFts = buildFtsQuery(query, docsAmount, ftsTable, chunkTable, documentTable, kbFilter, sourceFilterString);

  // Force token for Edge SQL
  const prevApiKey = process.env.AZION_API_KEY;
  const prevToken = process.env.AZION_TOKEN;
  if (DEVELOPMENT === 'true') {
    process.env.AZION_API_KEY = EDGE_SQL_TOKEN;
  }
  try {
    const envVar = process.env.AZION_ENV;
    const env: AzionEnvironment | undefined =
      envVar === 'production' || envVar === 'staging' || envVar === 'development' ? envVar : undefined;
    const queries = vectorQuery ? [queryFts, vectorQuery] : [queryFts];
    const { data, error } = await useQuery(dbName, queries, { env });
    if (error) {
      console.error('[RAG] Hybrid search error:', JSON.stringify(error));
      return [];
    }
    console.log("\n\n\n\n\n\n")
    const mappedDocuments = mapDbResults(data)
    console.log('[RAG] Hybrid search results:', { mappedDocuments });
    const rerankedDocuments = await rerankDocuments(query, mappedDocuments, fieldsToUseOnRerank)
    return rerankedDocuments.slice(0, docsAmount)
  } finally {
    if (prevApiKey !== undefined) process.env.AZION_API_KEY = prevApiKey; else delete process.env.AZION_API_KEY;
    if (prevToken !== undefined) process.env.AZION_TOKEN = prevToken; else delete process.env.AZION_TOKEN;
  }
}

export function getRagTools(ragConfigs?: Array<{ name?: string; description?: string; type?: string; active?: boolean; kb?: Array<{ kb_id?: string; name?: string; edgesql_db_id?: string; embedding_model?: string }> }>) {
  const configs = Array.isArray(ragConfigs) && ragConfigs.length > 0
    ? ragConfigs
    : [{ name: 'SearchAzionDocs', description: "Search Azion docs (default)", type: 'RAG', active: true }];

  const tools = configs.map((cfg) => {
    const toolName = cfg.name || 'SearchAzionDocs';
    const baseDesc = cfg.description || "This tool provides information and assistance related to Azion's edge computing platform.";
    const toolDesc = `${baseDesc} Default: queries ALL configured KBs unless 'collection' explicitly restricts it.`;
    const kbCollections = (cfg.kb || []).map(k => k.kb_id).filter(Boolean).join(',');
    // Prefer kb.name as DB name, fallback to edgesql_db_id
    const dbOverride = (cfg.kb || [])[0]?.name || (cfg.kb || [])[0]?.edgesql_db_id;
    const embedModel = (cfg.kb || [])[0]?.embedding_model;

    return new DynamicStructuredTool({
      name: toolName,
      description: toolDesc,
      schema: z.object({
        query: z.string().describe('Query to search documents. Usually a keyword or short phrase.'),
        docsAmount: z.number().min(1).max(10).default(5).optional(),
        collection: z
          .string()
          .optional()
          .describe("KB ids to filter (document.kb_id). Accepts a single kb_id or a comma-separated list. Omit this field to query ALL configured KBs. If KBs span multiple databases, the search will fan-out per DB and results will be merged."),
        sourceFilter: z
          .array(
            z.object({
              filter: z.enum(['include', 'exclude']),
              values: z.string().describe('Substring to match against document.source_uri'),
            })
          )
          .optional()
          .describe('Optional list of include/exclude filters over the source field'),
      }),
      func: async ({ query, docsAmount, collection, sourceFilter }: { query: string; docsAmount?: number; collection?: string; sourceFilter?: SourceFilter[] }) => {
        try {
          const max = Math.min(Math.max(docsAmount ?? 5, 1), 10);
          const qPrev = (query || '').slice(0, 120);

          // Resolve effective KBs
          const requestedKeysRaw = (collection || '')
            .split(',')
            .map(s => s.trim())
            .filter(Boolean);
          const requestedKeys = requestedKeysRaw.map(s => s.toLowerCase());
          const availableKbs = (cfg.kb || []).filter(k => k?.kb_id);
          const intersection = availableKbs.filter(k => {
            const id = (k.kb_id || '').toLowerCase();
            const nm = (k.name || '').toLowerCase();
            return requestedKeys.includes(id) || (nm && requestedKeys.includes(nm));
          });
          // Only restrict when there is an actual intersection; otherwise default to ALL configured KBs
          const effectiveKbList = (requestedKeys.length > 0 && intersection.length > 0)
            ? intersection
            : availableKbs;

          // Group KBs by DB so we can query multiple Edge SQL databases
          type KbGroup = { dbName: string; kbIds: string[]; kbNames: string[]; embeddingModel?: string };
          const groupsMap = new Map<string, KbGroup>();
          for (const kb of effectiveKbList) {
            // Prefer KB name for DB selection per requirement, fall back to edgesql_db_id, then tool-level override
            const dbName = (kb.name || kb.edgesql_db_id || dbOverride || '').trim();
            if (!dbName) continue;
            const g = groupsMap.get(dbName) || { dbName, kbIds: [], kbNames: [], embeddingModel: kb.embedding_model || embedModel };
            g.kbIds.push(kb.kb_id!);
            if (kb.name) g.kbNames.push(kb.name);
            if (!g.embeddingModel && kb.embedding_model) g.embeddingModel = kb.embedding_model;
            groupsMap.set(dbName, g);
          }

          console.log('[RAG] Executing rag_search_docs', {
            docsAmount: max,
            collection: (requestedKeysRaw.length > 0 ? requestedKeysRaw.join(',') : (kbCollections || null)) || null,
            sourceFilter: sourceFilter || null,
            queryPreview: qPrev,
            queryLength: query?.length || 0,
            requestedKeys: requestedKeysRaw,
            effectiveKbIds: effectiveKbList.map(k => k.kb_id),
            groups: Array.from(groupsMap.values()).map(g => ({ dbName: g.dbName, kbIds: g.kbIds, kbNames: g.kbNames, embeddingModel: g.embeddingModel })),
          });

          // If multiple DB groups, fan-out and merge
          let aggregated: any[] = [];
          if (groupsMap.size > 0) {
            // Run per-DB searches SEQUENTIALLY to avoid env var mutation races inside executeHybridSearch
            const groupList = Array.from(groupsMap.values());
            console.log('[RAG] Fan-out across DB groups (sequential):', groupList.map(g => g.dbName));
            for (const g of groupList) {
              const groupCollectionCsv = g.kbIds.join(',');
              console.log(`[RAG] Querying DB group '${g.dbName}' (by KB name) for KBs names [${g.kbNames.join(', ')}] and ids [${groupCollectionCsv}]`);
              try {
                // Do NOT pass collection to avoid filtering by document.kb_id; search the entire DB
                const res = await executeHybridSearch(query, max, undefined, sourceFilter, undefined, {
                  dbName: g.dbName,
                  embeddingModel: g.embeddingModel,
                });
                const enriched = (res || []).map((r: any) => ({ ...r, db: g.dbName, kb_ids: g.kbIds, kb_names: g.kbNames }));
                aggregated.push(...enriched);
                console.log(`[RAG] '${g.dbName}' returned`, enriched.length, 'docs');
              } catch (e) {
                console.error('[RAG] DB group failed:', g.dbName, e);
              }
            }
          }
          console.log('[RAG] Aggregated results count:', aggregated.length);
          if (aggregated.length === 0) {
            return 'No documents found for the provided query.';
          }
          const final = await rerankDocuments(query, aggregated, undefined);
          return JSON.stringify(final.slice(0, max));

          // Fallback: single-DB behavior (also ignore doc.kb_id filter; search entire DB)
          const results = await executeHybridSearch(query, max, undefined, sourceFilter, undefined, {
            dbName: dbOverride,
            embeddingModel: embedModel,
          });
          if (!results || results.length === 0) {
            console.log('[RAG] No documents found');
            return 'No documents found for the provided query.';
          }
          return JSON.stringify(results);
        } catch (err) {
          console.error('[RAG] Error executing search:', err);
          return `Error executing RAG search: ${String(err)}`;
        }
      },
    });
  });

  return tools;
}

export async function rerankDocuments(
  query: string,
  documents: any[],
  fieldsToUse?: string[]
) {
  try {
    const reranker = new EdgeAiModel("baai-bge-reranker-v2-m3");

    const fields = fieldsToUse && fieldsToUse.length > 0
      ? fieldsToUse
      : ["title", "content", "source"];

    const documentList = documents.map((document) =>
      fields
        .map(field => (document[field] ?? ""))
        .filter(Boolean)
        .join(" ")
    );

    const rerankerInput = {
      query,
      documents: documentList
    }

    const data = await reranker.execute(rerankerInput)

    // Add relevance scores to original documents
    const documentsWithScores = documents.map((doc, index) => ({
      ...doc,
      relevance_score: data.results[index]?.relevance_score || 0
    }));

    // Sort documents by relevance_score in descending order
    return documentsWithScores.sort((a, b) => b.relevance_score - a.relevance_score);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`Error reranking documents with status: ${error.stack}`)
    } else {
      console.error(`Unknown error reranking documents with status: ${JSON.stringify(error)}`)
    }
    return documents
  }
}

class EdgeAiModel {
  model: string;
  EdgeAI: any;

  /**
   * Constructor for EdgeAiModel
   * @param model The model to use
   */
  constructor(model: string) {
    this.model = model
    this.EdgeAI = (globalThis as any).Azion?.AI
  }

  /**
   * Executes the model
   * @param input The input to the model
   * @returns The result of the model
   */
  async execute(input: any): Promise<any> {
    if (!this.EdgeAI) {
      console.log(`EdgeAI not found. Calling ${this.model} with external API.`)
      return this.executeExternalAPI(input)
    }
    console.log(`Calling ${this.model} with internal API.`)
    return this.executeInternalAPI(input)
  }

  /**
   * Executes the model with internal API, using Azion.AI.run
   * @param input The input to the model
   * @returns The result of the model
   */
  async executeInternalAPI(input: any) {
    try {
      const response = await this.EdgeAI.run(this.model, input)

      return response
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error calling internal API with status: ${error.stack}`)
      } else {
        console.error(`Unknown error calling internal API with status: ${JSON.stringify(error)}`)
      }
      console.log(`Fallback - calling ${this.model} with external API.`)
      return this.executeExternalAPI(input)
    }
  }

  /**
   * Executes the model with external API, using fetch
   * @param input The input to the model
   * @returns The result of the model
   */
  async executeExternalAPI(input: any) {
    try {

      const body = JSON.stringify({
        model: this.model,
        ...input
      })

      const response = await fetch('https://swjkwqi8lj.map.azionedge.net/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.EDGE_AI_TOKEN}`
        },
        body
      })

      const data = await response.json()

      return data
    } catch (error) {
      if (error instanceof Error) {
        console.error(`Error calling external API with status: ${error.stack}`)
      } else {
        console.error(`Unknown error calling external API with status: ${JSON.stringify(error)}`)
      }
      throw error
    }
  }
}