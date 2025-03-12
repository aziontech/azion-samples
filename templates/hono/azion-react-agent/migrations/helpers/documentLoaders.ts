import { Document } from "langchain/document";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from '@langchain/community/document_loaders/fs/pdf';
import { BaseDocumentLoader } from "langchain/document_loaders/base";
import matter from "gray-matter";

/**
 * Loads documents from a folder.
 * @param {string} folderPath - The path to the folder containing the documents.
 * @param {string} jsonContentField - The field in the JSON file that contains the document page content. Defaults to "text".
 * @param {string[]} metadataFields - The fields in the JSON file that contain the document metadata. Defaults to all fields ["*"].
 * @returns {Promise<Document[]>} A promise that resolves to an array of documents.
 */
export async function getDocsFromFolder(
  //** Folder path */
  folderPath:string,
  //** JSON content field */
  jsonContentField:string = "text",
  //** Metadata fields */
  metadataFields:string[] = ["*"]
):Promise<Document[]>{
  const loader = new DirectoryLoader(
    folderPath,
    {
      ".json": (path) => new CustomJsonLoader(path, jsonContentField, metadataFields),
      ".txt": (path) => new TextLoader(path),
      ".md": (path) => new CustomMarkdownLoader(path, metadataFields),
      ".pdf": (path) => new PDFLoader(path),
    }
  );
  
  const docs = await loader.load();
  return docs
}
  
/**
 * CustomJsonLoader is a class that loads documents from a JSON file.
 * @param {string} filePathOrBlob - The path to the JSON file.
 * @param {string} contentField - The field in the JSON file that contains the document page content. Defaults to "text".
 * @param {string[]} metadataFields - The fields in the JSON file that contain the document metadata. Defaults to all fields ["*"].
 * @returns {Promise<Document[]>} A promise that resolves to an array of documents.
 */
class CustomJsonLoader extends BaseDocumentLoader {
  private filePathOrBlob: string;
  private contentField: string;
  private metadataFields: string[];

  constructor(filePathOrBlob: string, contentField: string, metadataFields: string[] = []) {
    super();
    this.filePathOrBlob = filePathOrBlob;
    this.contentField = contentField;
    this.metadataFields = metadataFields;
  }
  async load(): Promise<Document[]> {
    const { readFile } = await import("fs/promises");
    const documentsData = await readFile(this.filePathOrBlob, 'utf8');
    const documents = JSON.parse(documentsData);

    return documents.map((doc: any) => {
      const metadata: Record<string, any> = {};
      
      if (this.metadataFields.includes("*")) {
        // If "*" is present, include all fields from the document
        Object.keys(doc).forEach(key => {
          if (key !== this.contentField) {
            metadata[key] = doc[key];
          }
        });
      } else {
        // Otherwise only include specified metadata fields
        this.metadataFields.forEach(field => {
          if (doc[field] !== undefined) {
            metadata[field] = JSON.stringify(doc[field]);
          }
        });
      }

      return new Document({
        pageContent: doc[this.contentField] || '',
        metadata
      });
    });
  }
}

/**
 * CustomMarkdownLoader is a class that loads documents from a markdown file.
 * @param {string} filePathOrBlob - The path to the markdown file.
 * @param {string[]} metadataFields - The fields in the markdown file that contain the document metadata. Defaults to all fields ["*"].
 * @returns {Promise<Document[]>} A promise that resolves to an array of documents.
 */
class CustomMarkdownLoader extends BaseDocumentLoader {
  private filePathOrBlob: string;
  private metadataFields: string[];

  constructor(filePathOrBlob: string, metadataFields: string[] = []) {
    super();
    this.filePathOrBlob = filePathOrBlob;
    this.metadataFields = metadataFields;
  }

  async load(): Promise<Document[]> {
    const { readFile } = await import("fs/promises");

    const fileContent = await readFile(this.filePathOrBlob, 'utf8');
    const { data: frontmatter, content } = matter(fileContent);
    
    const metadata: Record<string, any> = {};
    
    if (this.metadataFields.includes("*")) {
      // If "*" is present, include all frontmatter fields
      Object.keys(frontmatter).forEach(key => {
        metadata[key] = JSON.stringify(frontmatter[key]);
      });
    } else {
      // Otherwise only include specified metadata fields
      this.metadataFields.forEach(field => {
        if (frontmatter[field] !== undefined) {
          metadata[field] = frontmatter[field];
        }
      });
    }

    return [
      new Document({
        pageContent: content.trim(),
        metadata
      })
    ];
  }
}
