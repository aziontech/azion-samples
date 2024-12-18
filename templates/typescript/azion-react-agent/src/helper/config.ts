export const AZION_TOKEN = process.env.AZION_TOKEN;
export const TAVILY_API_KEY = process.env.TAVILY_API_KEY;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || 'text-embedding-3-small'
export const OPENAI_MODEL = process.env.OPENAI_MODEL || 'gpt-4o'

export const VECTOR_STORE_DB_NAME = process.env.VECTOR_STORE_DB_NAME || 'vectorstore'
export const VECTOR_STORE_TABLE_NAME = process.env.VECTOR_STORE_TABLE_NAME || 'azion_react_agent_vector_store'