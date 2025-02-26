import type { CustomEvent } from "./src/types";
import { handleChatRequest } from "./src/chat";
import { authenticate } from "./src/authenticate";

/**
 * @param {CustomEvent} event - The event object
 * @returns {Promise<Response>} A Promise that resolves to a Response object
 */
export default async function main(
  event: CustomEvent
): Promise<Response> {
  const { request } = event;
  
  if (request.method === 'POST'){
    return handlePostRequest(request)
  }
  
  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200 })
  } 
  
  return new Response('Method not allowed', { status: 405 });
}

async function handlePostRequest(
  request: Request
): Promise<Response> {
  const authResponse = await authenticate(request)

  if (authResponse instanceof Response) {
    return authResponse
  }

  return handleChatRequest(request)
}