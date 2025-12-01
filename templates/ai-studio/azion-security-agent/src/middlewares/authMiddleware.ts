import { ClerkClient, createClerkClient } from '@clerk/backend';
import { verify, JWTPayload } from 'azion/jwt';
import { AuthResponse } from "../types";
import { CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, AZION_TOKEN, AUTHENTICATION_TYPE } from '../helpers/constants';

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

  /**
   * @property {ClerkClient} clerkClient - The clerk client
   * @property {string | undefined} authMode - The authentication mode
   */
  private clerkClient: ClerkClient
  private authMode: string | undefined

  constructor() {
    this.authMode = AUTHENTICATION_TYPE
    this.clerkClient = createClerkClient({
      secretKey: CLERK_SECRET_KEY,
      publishableKey: CLERK_PUBLISHABLE_KEY,
    });
  }

  /**
   * Authenticates the request according to the authentication mode.
   * 
   * @param {Request} request - The request object.
   * @returns {Promise<AuthResponse>} A Promise that resolves to an AuthResponse object.
   */
  async authenticate(request: Request): Promise<AuthResponse> {
    switch (this.authMode) {
      case 'clerk':
        return this.authenticateWithClerk(request);
      case 'basic':
        return this.authenticateWithToken(request);
      default:
        return { success: true };
    }
   }

  /**
   * Authenticates the request with Clerk.
   * 
   * @param {Request} request - The request object.
   * @returns {Promise<AuthResponse>} A Promise that resolves to an AuthResponse object.
   */
  async authenticateWithClerk(
    request: Request
  ): Promise<AuthResponse> {
    try {

      if (!request.headers.get('cookie') && !request.headers.get('authorization')) {
        return { success: false, error: 'Unauthorized: No authentication provided' };
      }

      const data = await this.clerkClient.authenticateRequest(request)
  
      if (!data.isSignedIn) {
        return { success: false, error: 'Unauthorized: Invalid session' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Authentication failed: ' + error };
    }
  }

  /**
   * Authenticates the request with a basic token.
   * 
   * @param {Request} request - The request object.
   * @returns {Promise<AuthResponse>} A Promise that resolves to an AuthResponse object.
   */
  async authenticateWithToken(
    request: Request
  ): Promise<AuthResponse> {
    try {
      const copilotJWT = request.headers.get('Authorization')?.split(' ')[1]

      if (!copilotJWT) {
      return { success: false, error: 'Unauthorized: No authorization provided' };
      }

      const payload = await this.verifyJWT(copilotJWT);

      if (!payload) {
      return { success: false, error: 'Unauthorized: Invalid authorization' };
      }

      return { success: true };
    } catch (error) {
      return { success: false, error: 'Unauthorized: Error verifying authorization' };
    }
    }


  /**
   * Verifies the JWT token.
   * 
   * @param {string} jwt - The JWT token.
   * @returns {Promise<JWTPayload>} A Promise that resolves to a JWTPayload object.
   */
  async  verifyJWT(
    jwt: string
  ): Promise<JWTPayload> {
    const publicKey = AZION_TOKEN;
  
    if (!publicKey) { throw new Error('Invalid key')}
  
    return await verify(jwt, publicKey);
  }
}