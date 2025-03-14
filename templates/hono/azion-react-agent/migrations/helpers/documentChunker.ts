import { RecursiveCharacterTextSplitter, CharacterTextSplitter } from "langchain/text_splitter"
import { Document } from "langchain/document"

/**
 * DocumentChunker is a class that splits documents into chunks
 * @param {string} chunkStrategy - The strategy to use for chunking. Can be "recursive" or "character"
 * @param {number} chunkSize - The size of each chunk
 * @param {number} chunkOverlap - The overlap between chunks
 * @param {string} separator - The separator to use for chunking. If undefined, the separator will not be used
 */
export class DocumentChunker {
    private chunkStrategy: "recursive" | "character"
    private chunkSize: number
    private chunkOverlap: number
    private textSplitter: RecursiveCharacterTextSplitter | CharacterTextSplitter
    private separator: string | undefined

  constructor(
    chunkStrategy: "recursive" | "character",
    chunkSize: number,
    chunkOverlap: number,
    separator: string | undefined = undefined

  ) {
    this.chunkStrategy = chunkStrategy
    this.chunkSize = chunkSize
    this.chunkOverlap = chunkOverlap
    this.separator = separator
    this.textSplitter = chunkStrategy === "recursive" ? 
                    new RecursiveCharacterTextSplitter({ chunkSize, chunkOverlap, separators: [this.separator ?? ""] }) 
                    : new CharacterTextSplitter({ chunkSize, chunkOverlap, separator: this.separator ?? "" })
  }

  /**
   * Chunks an array of documents
   * @param {Document[]} documents - The documents to chunk
   * @returns {Promise<Document[]>} A promise that resolves to an array of documents
   */
  async chunkDocuments(documents: Document[]): Promise<Document[]> {
    return this.textSplitter.splitDocuments(documents)
  }
}