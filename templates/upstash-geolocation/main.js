import { handleRequest } from "./src/function/index.js";

return await handleRequest(event?.request, event?.args);

// async function handleEvent(event) {
//   __HANDLER__;
// }

// addEventListener("fetch", (event) => {
//   event.respondWith(handleEvent(event));
// });
