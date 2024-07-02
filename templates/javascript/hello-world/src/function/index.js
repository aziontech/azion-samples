/**
 * Handle Request
 * This is the input function where you can perform your implementation.
 * @param {Request} request https://developer.mozilla.org/en-US/docs/Web/API/Request
 * @param {*} args function args e.g args.my_secret
 * @returns {Response} https://developer.mozilla.org/en-US/docs/Web/API/Response
 */
async function handleRequest(request, args) {
  const message = `Hello World!`;

  return new Response(message, {
    headers: {
      "content-type": "text/plain;charset=UTF-8",
    },
    status: 200,
  });
}

export { handleRequest };
