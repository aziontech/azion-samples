
async function handleBodyAsBlob(request) {
    if (request.body) {
        let requestBlob = await request.blob();
        // Now you can take some action using the request blob...

        // For example, turn it into a text and return it to the user
        let respBody = await requestBlob.text();
        
        return new Response(respBody);
    }

    return new Response("No request body was sent");
}

async function handleBodyAsImage(request) {
    if (request.body) {
        let requestBlob = await request.blob();
        
        // Get the content type from the request to preserve it in the response
        const contentType = request.headers.get("Content-Type") || "application/octet-stream";
        
        // Return the image as a blob with the appropriate content type
        return new Response(requestBlob, {
            headers: {
                "Content-Type": contentType,
                "Content-Length": requestBlob.size.toString()
            }
        });
    }

    return new Response("No request body was sent");
}

async function handleBodyAsFormData(request) {
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

async function handleBodyAsStream(request) {
    if (request.body) {
        let respBody = "";

        let reader = request.body.getReader();
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            respBody += new TextDecoder("utf-8").decode(value);
        }

        // Now you can take some action using read data...
        console.log(respBody);

        return new Response(respBody);
    }

    return new Response("No request body was sent");
}

async function handleAsText(request) {
    if (request.body) {
        let respBody = await request.text();
      
        // Now you can take some action using your text data...
        console.log(respBody);

        return new Response(respBody);
    }
  
    return new Response("No request body was sent");
}

async function handleBodyAsJSON(request) {
    if (request.body) {
        let jsonData = await request.json();

        // Now you can take some action using your JSON data...
        console.log(jsonData);

        // For example, add a new field and return the modified JSON
        jsonData.received = true;
        jsonData.timestamp = new Date().toISOString();

        return new Response(JSON.stringify(jsonData), {
            headers: { "Content-Type": "application/json" }
        });
    }

    return new Response("No request body was sent");
}

async function handleRequest(request) {
    const contentType = request.headers.get("Content-Type") || "";

    try {
        // Route to the appropriate handler based on Content-Type header
        if (contentType.includes("application/json")) {
            return handleBodyAsJSON(request);
        } else if (contentType.includes("multipart/form-data") || contentType.includes("application/x-www-form-urlencoded")) {
            return handleBodyAsFormData(request);
        } else if (contentType.includes("text/plain")) {
            return handleAsText(request);
        } else if (contentType.includes("image/")) {
            // Handle image content types (image/png, image/jpeg, image/gif, image/webp, etc.)
            return handleBodyAsImage(request);
        } else if (contentType.includes("application/octet-stream") || contentType.includes("blob")) {
            return handleBodyAsBlob(request);
        } else if (request.body) {
            // Default to stream handler for unknown content types
            return handleBodyAsStream(request);
        }

        return new Response("No request body was sent");
    } catch (error) {
        return new Response(`Error processing request: ${error.message}`, { status: 400 });
    }
}

addEventListener("fetch", (event) => {
    event.respondWith(handleRequest(event.request));
});