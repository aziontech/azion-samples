import { createClerkClient } from '@clerk/backend';
import { sign, verify, JWTPayload } from 'azion/jwt';
import { AUTHENTICATION_TYPE, AUTHENTICATION_TOKEN, CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY, AZION_TOKEN } from './helper/config';
import { UserData } from './types';

/**
 * Authenticate the request
 * @param {Request} request - The request object
 * @returns {Promise<Response | void>} A Promise that resolves to a Response object or void if the request is authenticated
 */
async function authenticate(
  request: Request
): Promise<Response | void> {

  if (AUTHENTICATION_TYPE === 'clerk') {
    return await authenticateWithClerk(request);
  }
  
  if (AUTHENTICATION_TYPE === 'basic' && request.url.includes('/auth')) {
    return await validateToken(request);
  }

  if (AUTHENTICATION_TYPE === 'basic') {
    return await authenticateWithToken(request);
  }

  return
}

/**
 * Authenticate the request
 * @param {Request} request - The request object
 * @returns {Promise<Response | void>} A Promise that resolves to a Response object or void if the request is authenticated
 */
async function authenticateWithClerk(
  request: Request
): Promise<Response | void> {
  try {

    const clerkClient = createClerkClient({
      secretKey: CLERK_SECRET_KEY,
      publishableKey: CLERK_PUBLISHABLE_KEY,
    });

    const data = await clerkClient.authenticateRequest(request)

    if (!data.isSignedIn) {
      return new Response('Unauthorized: Invalid session', { status: 401 });
    }

  } catch (error) {
    console.error('Authentication error:', error);
    return new Response('Authentication failed: ' + error, { status: 401 });
  }
}

async function authenticateWithToken(
    request: Request
): Promise<Response | void> {
  try {
    const copilotJWT = request.headers.get('Authorization')?.split(' ')[1]

    if (!copilotJWT) {
      return new Response('Unauthorized: No authorization provided', { status: 401 });
    }

    const payload = await verifyJWT(copilotJWT);

    if (!payload) {
      return new Response('Unauthorized: Invalid authorization', { status: 401 });
    }

    console.log("User verified", payload)

    return;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return new Response('Unauthorized: Error verifying authorization', { status: 401 });
  }
}

/**
 * Validate the token
 * @param {Request} request - The request object
 * @returns {Promise<Response | void>} A Promise that resolves to a Response object or void if the token is invalid
 */
export async function validateToken(
  request: Request
): Promise<Response | void> {
  const password = request.headers.get('Authorization')?.split(' ')[1]

  if (!password || password !== AUTHENTICATION_TOKEN) {
    return new Response('Unauthorized: Invalid token', { status: 401 });
  }

  return generateJWT()
}

/**
 * Generate a JWT
 * @returns {Response} The response object with the JWT
 */
async function generateJWT(): Promise<Response> {
  // Generate a random email for the user
  const userData = { email: `user${Math.random().toString(36).substring(2)}@example.com` };
  const token = await signUser(userData, 60);
  return new Response(token, { status: 200 });
}

/**
 * Sign the user
 * @param {any} userData - The user data
 * @param {number} duration - The duration of the token in minutes
 * @returns {Promise<string>} A Promise that resolves to the token
 */
async function signUser(
  userData: UserData,
  duration: number
): Promise<string> {
  try {
    const privateKey = AZION_TOKEN

    if (!privateKey) { throw new Error('Invalid key')}

    const payload = { userId: userData.email, exp: Math.floor(Date.now() / 1000) + duration*60 };

    return await sign(payload, privateKey);
  } catch (error) {
    console.error("Error signing user:", error);
    throw error;
  }
}

/**
 * Verify the user
 * @param {string} jwt - The JWT value
 * @returns {Promise<any>} A Promise that resolves to the user data
 */
async function verifyJWT(
  jwt: string
): Promise<JWTPayload> {
  const publicKey = AZION_TOKEN;

  if (!publicKey) { throw new Error('Invalid key')}

  return await verify(jwt, publicKey);
}

export { authenticate };