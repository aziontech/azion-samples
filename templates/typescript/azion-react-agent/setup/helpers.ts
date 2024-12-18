import fs from 'fs';
import path from 'path';
import { Document } from "langchain/document";

/**
 * Get product documents from a JSON file.
 * @param {string} file_path - The path to the JSON file.
 * @returns {Document[]} An array of Document objects.
 */
export function getDocs(file_path:string):Document[]{
  // Read and parse products.json
  const documentsPath = path.join(__dirname, file_path);
  const documentsData = fs.readFileSync(documentsPath, 'utf8');
  const documents = JSON.parse(documentsData);

  // Create documents from json
  const productDocs = documents.map((document:any) => {
    // Combine non-empty values into page content
    const content = Object.entries(document)
        .filter(([key, value]) => value !== null && value !== '')
        .map(([key, value]) => `${key}: ${value}`)
        .join('. ');

    // Build metadata object dynamically from document keys
    const metadata = Object.entries(document).reduce((acc, [key, value]) => {
      acc[key] = value;
      return acc;
    }, {} as Record<string, any>);

    return new Document({
        pageContent: content,
        metadata
    });
  })
  return productDocs
}