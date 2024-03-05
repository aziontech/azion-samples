import { AsyncLocalStorage } from "node:async_hooks";

const requestId = new AsyncLocalStorage();

async function logAsyncContext(state) {
    console.log(`${requestId.getStore()} - ${state}`);
}

async function doSomething() {
    logAsyncContext("log from async function");
    doSomethingElse();
}

async function doSomethingElse() {
    logAsyncContext("log from another async function");
}

async function handleRequest(request) {
    const id = request.headers.get("X-Request-Id");

    return requestId.run(id, async () => {
        doSomething();
        logAsyncContext("log from yet another async function");
        requestId.exit(async () => {
            logAsyncContext("log from exit callback");
        });
        return new Response("ok");
    });
}

addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});