import { sign } from 'azion/jwt';
import { AuthResponse } from "../types";
import { AZION_TOKEN , AUTHENTICATION_TOKEN} from '../helpers/constants';

/**
 * AuthService
 * 
 * Service to provide methods to authenticate users. 
 * 
 * @class
 */
export class AuthService {

  /**
   * @property {string} signKey - The sign key
   * @property {number} tokenDuration - The token duration
   */
  private signKey?: string
  private tokenDuration: number

  /**
   * Constructor for the AuthService class
   * 
   * @param {number} tokenDuration - The token duration in minutes. Default is 60
   */
  constructor(
    tokenDuration: number = 60
  ) {
    this.signKey = AZION_TOKEN
    this.tokenDuration = tokenDuration
  }

  /**
   * Validates the token.
   * 
   * @param {Request} request - The request object.
   * @returns {Promise<AuthResponse>} A Promise that resolves to an AuthResponse object.
   */
  async validateToken(
    request: Request
  ): Promise<AuthResponse> {
    const password = request.headers.get('Authorization')?.split(' ')[1]
  
    if (!password || password !== AUTHENTICATION_TOKEN) {
      return { success: false, error: 'Unauthorized: Invalid token' };
    }
  
    return { success: true };
  }

  /**
   * Signs the user.
   * 
   * @returns {Promise<string>} A Promise that resolves to a string.
   */
  async signUser(
  ): Promise<string> {
    try {
  
      const userData = { email: `user${Math.random().toString(36).substring(2)}@example.com` };
  
      if (!this.signKey) { throw new Error('Invalid key')}
  
      const payload = { userId: userData.email, exp: Math.floor(Date.now() / 1000) + this.tokenDuration*60 };
  
      return await sign(payload, this.signKey);
    } catch (error) {
      console.error("Error signing user:", error);
      throw error;
    }
  }

}