import { AuthService } from "../services/authService";

/**
 * Handles the authentication request. 
 * If the token is valid, it returns a 200 response with the JWT.
 * Otherwise, it returns a 401 response.
 * 
 * @param {Request} request - The request object.
 * @returns {Promise<Response>} A Promise that resolves to a Response object.
 */
export async function authRequestHandler(
    request: Request
): Promise<Response> {

    const authService = new AuthService()

    const isTokenValid = await authService.validateToken(request)

    if(!isTokenValid.success) {
      return new Response(JSON.stringify(isTokenValid.error), { status: 401 })
    }

    const jwt = await authService.signUser()

    return new Response(jwt, { status: 200 })
}