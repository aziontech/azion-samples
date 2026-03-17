# Node.js Async Hooks and Edge Functions

This sample demonstrates how to use **Node.js Async Hooks**, specifically the **AsyncLocalStorage API**, to manage context within asynchronous operations inside an Azion Edge Function.

## What This Example Does

The [`index.js`](index.js) file contains an Edge Function that demonstrates how to use `AsyncLocalStorage` to maintain request-specific context across asynchronous operations. When accessed:

1. The function retrieves a request ID from the `X-Request-Id` header
2. It stores this ID in an AsyncLocalStorage instance
3. Multiple async functions can access this ID without explicit parameter passing
4. All logs are tagged with the request ID for tracing purposes

## How It Works

```javascript
import { AsyncLocalStorage } from "node:async_hooks";

const requestId = new AsyncLocalStorage();

async function logAsyncContext(state) {
    console.log(`${requestId.getStore()} - ${state}`);
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
```

### Key Functions

- **logAsyncContext(state)**: Logs the current request ID and a state message to the console
- **doSomething()**: Simulates an asynchronous operation and logs its context
- **doSomethingElse()**: Simulates another asynchronous operation and logs its context
- **handleRequest(request)**: Handles incoming requests, retrieves the request ID from headers, and runs async operations within the context

## Prerequisites

- [Azion CLI](https://www.azion.com/en/documentation/products/azion-cli/overview/) installed and configured
- An Azion account

## Deployment Instructions

### 1. Clone the Repository

```bash
git clone git@github.com:aziontech/azion-samples.git
cd azion-samples/samples/node-async-hooks
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Configure Azion Token

Set your Azion Personal Token for authentication:

```bash
azion -t AZION_TOKEN
```

### 4. Link the Project

```bash
azion link
# follow the instructions and select javascript preset
```

### 5. Run Locally (Development)

```bash
azion dev
# or with debug output
azion dev --debug
```

### 6. Deploy to Azion

```bash
# for remote deployment:
azion deploy
# for a local deployment:
azion deploy --local
```

After deployment completes, you'll receive a domain to access your function, similar to `https://xxxxxxx.map.azionedge.net`.

Wait a few minutes for DNS propagation, then access your application using the provided domain.

## Testing the Function

You can test the function using curl with a custom request ID header:

```bash
curl -H "X-Request-Id: my-request-123" https://your-domain.map.azionedge.net/
```

Or locally:

```bash
curl -H "X-Request-Id: my-request-123" http://localhost:3333/
```

The function will return "ok" and you can check the logs to see the request ID being propagated through the async operations.

## Checking Logs

To monitor the function execution in real-time, you can use the Azion CLI to tail the logs:

```bash
azion logs cells --function-id FUNC_ID --tail
```

Replace `FUNC_ID` with your function ID, which can be found in the [`azion/azion.json`](azion/azion.json) file under the `function` array (look for the `id` field).

Example:
```bash
azion logs cells --function-id 51642 --tail
```

This will stream the function logs in real-time, allowing you to see the request ID being propagated through the async operations as described in this sample.

## Use Cases

This pattern is particularly useful in scenarios such as:

- **Request Tracing**: Maintaining request IDs across async operations for distributed tracing
- **User Context**: Keeping track of user information throughout request processing
- **Logging**: Adding consistent context information to all log messages
- **Performance Monitoring**: Tracking timing and metrics across async boundaries

## License

This project is licensed under the MIT License.
