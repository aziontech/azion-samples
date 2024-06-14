import { handleRequest } from "./src/function/index.js";

function main(event) {
    return handleRequest(event?.request, event?.args);
}

export default main;