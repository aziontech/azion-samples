import { AuthResponse } from "../types";
/**
 * Authentication
 * 
 * If the user is authenticated, it returns an AuthResponse object, with success set to true.
 * 
 * @param {Request} request - The request object.
 * @returns {Promise<AuthResponse>} A Promise that resolves to an AuthResponse object.
 */

class AuthMiddleware {

  constructor(private shouldAuthenticate: boolean = true) {
  }

  /**
   * Authenticates the request.
   * 
   * @param {Request} request - The request object.
   * @returns {Promise<AuthResponse>} A Promise that resolves to an AuthResponse object.
   */
  async authenticate(request: Request): Promise<AuthResponse> {
    // insert your authenticate logic here
    return { success: true, data: { accountId: '0' } };
  }
}

export const authMiddleware = new AuthMiddleware();