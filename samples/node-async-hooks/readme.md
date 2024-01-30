# Node.js Async Hooks and Edge Functions

This is an example of using **Node.js Async Hooks**, specifically the **AsyncLocalStorage API**, to manage context within asynchronous operations inside an edge function.

## Code Overview

The code consists of several asynchronous functions (doSomething, doSomethingElse, handleRequest) that simulate different parts of a request handling process.

The AsyncLocalStorage instance, requestId, is used to store and retrieve a request-specific value (in this case, a request ID from headers) across these asynchronous operations.

Here's a brief description of the functions:

- logAsyncContext(state): logs the current request ID and a state message to the console.
- doSomething(): simulates an asynchronous operation and logs its context.
- doSomethingElse(): simulates another asynchronous operation and logs its context.
- handleRequest(request): handles an incoming request, retrieves the request ID from the headers, and runs a series of asynchronous operations within the context of this request ID.

The handleRequest function is registered as an event listener for fetch events, meaning it will be invoked for every incoming request.

## Usage

This code is designed to be run on Azion Edge Runtime. It demonstrates how to use AsyncLocalStorage to maintain context across asynchronous operations, which can be particularly useful in scenarios such as request handling in a web server, where you might need to keep track of request-specific data across multiple asynchronous operations.