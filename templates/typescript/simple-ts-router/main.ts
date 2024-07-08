import { handleRequest } from "./src/function/index";
import type { CustomEvent } from "./src/types/event";


export default async function main(event: CustomEvent) {
  return handleRequest({ request: event.request, args: event.args });
}
