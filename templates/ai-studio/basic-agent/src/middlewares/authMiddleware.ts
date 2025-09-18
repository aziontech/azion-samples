import { AuthData, AuthResponse, SSOResponse } from "../types";
import { defineProject, resolveAuthenticateParams } from '../helpers/utils';
/**
 * Authenticates the request according to the authentication mode. 
 * If the authentication mode is not set, it does nothing.
 * 
 * If the user is not authenticated, it returns a 401 response.
 * 
 * If the user is authenticated, it returns an AuthResponse object, with success set to true.
 * 
 * @param {Request} request - The request object.
 * @returns {Promise<AuthResponse>} A Promise that resolves to an AuthResponse object.
 */

export class AuthMiddleware {

  constructor(private shouldAuthenticate: boolean = true) {
  }

  /**
   * Authenticates the request according to the authentication mode.
   * 
   * @param {Request} request - The request object.
   * @returns {Promise<AuthResponse>} A Promise that resolves to an AuthResponse object.
   */
  async authenticate(request: Request): Promise<AuthResponse> {
    if (this.shouldAuthenticate) {
      return await this.validateUserData(request);
    }
    return { success: true, data: { accountId: '1234567890' } };
  }

  async validateUserData(request: Request): Promise<AuthResponse> {
    try {
      const url = request.url;
      const cookie = request.headers.get('cookie')?.includes('azsid') ? request.headers.get('cookie') : '';
      const token = request.headers.get('Authorization') || '';

      if (!cookie && !token) {
        console.log("No cookie or token provided.")
        return { success: false, error: { message: 'No cookie or token provided', status: 401 } };
      }

      const project = defineProject(url, undefined);

      const { urlAuthenticate, options } = resolveAuthenticateParams(project, cookie, token);

      const response = await fetch(urlAuthenticate, options);

      if (!response.ok) {
        console.log("Authentication failed.", response.status)
        return { success: false, error: { message: 'Authentication failed', status: response.status } };
      }

      const data = await response.json() as SSOResponse;

      if (!data.results.id) {
        console.log("No account information found!")
        return { success: false, error: { message: 'No account information found!', status: 401 } };
      }

      return { success: true, data: { accountId: data?.results?.id } };
    } catch (error) {
      return { success: false, error: { message: String(error), status: 401 } };
    }
  }

}