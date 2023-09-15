import { handleRequest } from "./function";

addEventListener("fetch", (event:any) => {
   event.respondWith(handleRequest(event.request, event.args))
})

