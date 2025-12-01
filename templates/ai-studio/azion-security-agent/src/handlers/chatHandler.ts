import {
  validateRequestBody, 
} from "../helpers/utils";
import { v4 as uuidv4 } from 'uuid';
import { GraphService } from "../services/graphService";
import { generateChatGraph } from "../services/ai/graph";


/**
 * Handles the chat request. Validates the request body and runs the graph service.
 * 
 * 
 * @param {Request} request - The request object.
 * @returns {Promise<Response>} A Promise that resolves to a Response object.
 */
export async function chatRequestHandler(
    request: Request
): Promise<Response> {
    const args = {
      session_id: uuidv4(),
    }   
  
    const { parsedBody, error } = await validateRequestBody(request);
  
    if (error) {
      console.error("Error parsing body: ", error)
      return new Response(JSON.stringify(error), { status: 400 })
    }
  
    const { messages, stream, session_id } = parsedBody;
  
    if (session_id) {
      args.session_id = session_id
    }
    const graph = await generateChatGraph()
    const graphService = new GraphService(messages, args, stream, graph)

    const response = await graphService.run()
    
    if (response.success) {
      return new Response(response.data, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream'
        }
      });
    }

    return new Response(JSON.stringify(response.error), { 
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    })
}
