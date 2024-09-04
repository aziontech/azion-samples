/*
This example depicts how you can enable the use of args by using `event.args.<ARG_CREATED>`.
When creating your Edge Function, add the following JSON in the Arguments tab:
{
    "value": "hello_world"
} 
*/

async function handleRequest(request, v) {
    return new Response(v, {
        headers: new Headers([
            ["X-Custom-Header", "something defined on JS"],
        ]),
        status: 200,
    });
}
addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request, event.args.value));
});