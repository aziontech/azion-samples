async function handleRequest(request) {
    if (request.body) {
        let requestForm = await request.formData();

        // Now you can take some action using the request form data...

        // Like adding some fields, for example
        requestForm.append("new-field-1", "1");
        requestForm.append("new-field-2", "2");
        requestForm.append("new-field-3", "3");

        return new Response(requestForm);
    }

    return new Response("No request body was sent");
}
addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});