export const AZION_TOKEN = process.env.AZION_TOKEN;
export const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
export const EMBEDDING_MODEL = 'text-embedding-3-small'
export const OPENAI_MODEL = 'gpt-4o'

export const VECTOR_STORE_DB_NAME = process.env.VECTOR_STORE_DB_NAME || 'vectorstore'
export const VECTOR_STORE_TABLE_NAME = 'vectors'
export const MESSAGE_STORE_DB_NAME = process.env.MESSAGE_STORE_DB_NAME || 'messagestore'
export const MESSAGE_STORE_TABLE_NAME = 'messages'

export const SYSTEM_PROMPT = "You are a helpful assistant."

export const AUTHENTICATION_TYPE = process.env.AUTHENTICATION_TYPE
export const AUTHENTICATION_TOKEN = process.env.AUTHENTICATION_TOKEN
export const CLERK_PUBLISHABLE_KEY = process.env.CLERK_PUBLISHABLE_KEY
export const CLERK_SECRET_KEY = process.env.CLERK_SECRET_KEY
