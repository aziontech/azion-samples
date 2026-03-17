# Process Request Body on Edge Functions

This sample demonstrates how to process different types of request bodies within an Azion Edge Function. The function automatically detects the Content-Type header and routes the request to the appropriate handler.

## What This Example Does

The [`functions/index.js`](functions/index.js) file contains multiple handlers for processing request bodies in different formats:

1. **JSON** (`application/json`) - Parses JSON data, modifies it, and returns the result
2. **Form Data** (`multipart/form-data` or `application/x-www-form-urlencoded`) - Processes form submissions
3. **Text** (`text/plain`) - Handles plain text bodies
4. **Blob** (`application/octet-stream` or `blob`) - Processes binary data
5. **Stream** - Default handler for unknown content types that reads the body as a stream

## How It Works

```javascript
async function handleRequest(request) {
    const contentType = request.headers.get("Content-Type") || "";

    // Route to the appropriate handler based on Content-Type header
    if (contentType.includes("application/json")) {
        return handleBodyAsJSON(request);
    } else if (contentType.includes("multipart/form-data")) {
        return handleBodyAsFormData(request);
    }
    // ... other handlers
}
```

## Prerequisites

- [Azion CLI](https://www.azion.com/en/documentation/products/azion-cli/overview/) installed and configured
- An Azion account

## Deployment Instructions

### 1. Clone the Repository

```bash
git clone git@github.com:aziontech/azion-samples.git
cd azion-samples/samples/process-request-body
```

### 2. Install Dependencies

```bash
npm install
# or
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

Below are curl examples for testing each content type handler. Replace `https://your-domain.map.azionedge.net/` with your actual domain after deployment.

### Test JSON Processing

Sends JSON data that gets parsed, modified (adding `received` and `timestamp` fields), and returned.

**Production:**
```bash
curl -X POST "https://your-domain.map.azionedge.net/" \
  -H "Content-Type: application/json" \
  -d '{"name": "test", "value": 42}'
```

**Localhost:**
```bash
curl -X POST "http://localhost:3333/" \
  -H "Content-Type: application/json" \
  -d '{"name": "test", "value": 42}'
```

**Expected response:**
```json
{"name": "test", "value": 42, "received": true, "timestamp": "2024-01-01T12:00:00.000Z"}
```

---

### Test Form Data Processing (URL-encoded)

Sends URL-encoded form data. The function adds three new fields (`new-field-1`, `new-field-2`, `new-field-3`) and returns the modified form.

**Production:**
```bash
curl -X POST "https://your-domain.map.azionedge.net/" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "field1=value1&field2=value2"
```

**Localhost:**
```bash
curl -X POST "http://localhost:3333/" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "field1=value1&field2=value2"
```

**Expected response:**
The response will contain the original fields plus the three new fields added by the function.

---

### Test Form Data Processing (Multipart)

Sends multipart form data, useful for file uploads. The function processes the form and adds additional fields.

**Production:**
```bash
curl -X POST "https://your-domain.map.azionedge.net/" \
  -F "username=johndoe" \
  -F "email=john@example.com"
```

**Localhost:**
```bash
curl -X POST "http://localhost:3333/" \
  -F "username=johndoe" \
  -F "email=john@example.com"
```

**With file upload:**
```bash
curl -X POST "http://localhost:3333/" \
  -F "description=My document" \
  -F "file=@/path/to/your-file.txt"
```

**Expected response:**
The response will contain the submitted form data plus three new fields added by the function.

---

### Test Text Processing

Sends plain text that gets echoed back.

**Production:**
```bash
curl -X POST "https://your-domain.map.azionedge.net/" \
  -H "Content-Type: text/plain" \
  -d "Hello, World!"
```

**Localhost:**
```bash
curl -X POST "http://localhost:3333/" \
  -H "Content-Type: text/plain" \
  -d 'Hello, World!'
```

**Expected response:**
```
Hello, World!
```

---

### Test Blob/Binary Processing

Sends binary data (e.g., an image). The function reads it as a blob and returns information about the binary data received.

**Production:**
```bash
curl -X POST "https://your-domain.map.azionedge.net/" \
  -H "Content-Type: image/png" \
  --data-binary "@/path/to/your-image.png"
```

**Localhost:**
```bash
curl -X POST "http://localhost:3333/" \
  -H "Content-Type: image/png" \
  --data-binary "@/path/to/your-image.png" -o out.png
```

**Expected response:**
The response will contain information about the received binary data, including the size in bytes:
```json
{"received": true, "size": 12345, "type": "image/png"}
```

---

### Test Stream Processing (Unknown Content-Type)

When no recognized Content-Type is provided but a body is present, the function processes it as a stream.

**Production:**
```bash
curl -X POST "https://your-domain.map.azionedge.net/" \
  -H "Content-Type: application/custom" \
  -d "Some custom data"
```

**Localhost:**
```bash
curl -X POST "http://localhost:3333/" \
  -H "Content-Type: application/custom" \
  -d "Some custom data"
```

**Expected response:**
```
Some custom data
```

---

### Test No Body

When no body is sent, the function returns a message indicating no body was received.

```bash
curl -X GET "http://localhost:3333/"
```

**Expected response:**
```
No request body was sent
```

## License

This project is licensed under the MIT License.
