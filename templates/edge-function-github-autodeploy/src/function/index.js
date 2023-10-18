import { isFriday } from "date-fns";

/**
 * Handle Request
 * This is the input function where you can perform your implementation.
 * @param {Request} request
 * @param {*} args
 * @returns
 */
async function handleRequest(request, args) {
  /**
   * In this template we are using the library https://www.npmjs.com/package/date-fns to
   * check based on the date if today is Friday.
   */
  const message = isFriday(new Date()) ? "Yes, today is Friday! 😛" : "Oh no, today is not Friday! 😢";

  return new Response(message, { status: 200 });
}

export { handleRequest };
