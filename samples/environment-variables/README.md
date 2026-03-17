# Environment Variables in Edge Functions

This sample demonstrates how to work with **Environment Variables** in an Azion Cells Edge Function.

## What This Example Does

The [`functions/index.js`](functions/index.js) file contains an Edge Function that showcases how to use Environment Variables as a fallback for undefined JSON Arguments. When accessed:

1. The function first checks if a `message` argument was passed via JSON Args
2. If not, it falls back to the `HELLO_WORLD_EDGE_FUNCTION` environment variable using `Azion.env.get()`
3. If neither exists, it returns a default value

## How It Works

```javascript
async function handleRequest(args) {
  const body = args.message || Azion.env.get('HELLO_WORLD_EDGE_FUNCTION') || "Default value";

  return new Response(body, {
    headers: {
      "content-type": "text/plain"
    },
    status: 200
  });
}

addEventListener("fetch", event => {
  return event.respondWith(handleRequest(event.args))
});
```

### Key Concepts

- **Azion.env.get('VARIABLE_NAME')**: Retrieves the value of an environment variable. Returns `undefined` if the variable doesn't exist.
- **Fallback Pattern**: The example demonstrates a priority chain: JSON Args → Environment Variables → Default Value

## Prerequisites

- [Azion CLI](https://www.azion.com/en/documentation/products/azion-cli/overview/) installed and configured
- An Azion account

## Deployment Instructions

### 1. Clone the Repository

```bash
git clone git@github.com:aziontech/azion-samples.git
cd azion-samples/samples/environment-variables
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

## Setting Environment Variables

You can set environment variables using one of the following methods:

### Using the Azion API

```bash
curl -X POST https://api.azionapi.net/variables \
    -H 'Accept: application/json; version=3' \
    -H 'Authorization: token [YOUR_TOKEN]' \
    -H 'Content-Type: application/json' \
    -d '{
      "key": "HELLO_WORLD_EDGE_FUNCTION",
      "value": "Hello World using Environment Variables!"
    }'
```

### Using the Azion CLI

You can create environment variables directly from the command line:

```bash
azion create variables --key "KEY_NAME" --value "KEY VALUE" --secret false
```

For example:

```bash
azion create variables --key "HELLO_WORLD_EDGE_FUNCTION" --value "Hello World using Environment Variables!" --secret false
```

> **Note**: Set `--secret true` if you're storing sensitive information like API keys or passwords.

### Using `azion deploy` with `.env` file

If you have a `.env` file in your project directory, you can sync environment variables during deployment:

1. Create a `.env` file in your project root:
    ```bash
    HELLO_WORLD_EDGE_FUNCTION="Hello World using Environment Variables!"
    ```

2. Deploy with the `--sync` flag:
    ```bash
    azion deploy --local --sync
    ```

This will automatically upload all variables from your `.env` file to Azion during the deployment process.

## Testing the Function

### Without Environment Variable or JSON Args

```bash
curl https://your-domain.map.azionedge.net/
```

Returns: `Default value`

### With Environment Variable Set

After setting the `HELLO_WORLD_EDGE_FUNCTION` environment variable:

```bash
curl https://your-domain.map.azionedge.net/
```

Returns: `Hello World using Environment Variables!`

### Locally

```bash
curl http://localhost:3333/
```

## Checking Logs

To monitor the function execution in real-time, you can use the Azion CLI to tail the logs:

```bash
azion logs cells --function-id FUNC_ID --tail
```

Replace `FUNC_ID` with your function ID, which can be found in the [`azion/azion.json`](azion/azion.json) file under the `function` array (look for the `id` field).

Example:
```bash
azion logs cells --function-id 12345 --tail
```

## Use Cases

This pattern is particularly useful in scenarios such as:

- **Configuration Management**: Store configuration values that can be changed without modifying code
- **Feature Flags**: Toggle features on/off across multiple Edge Functions from a single place
- **Environment-specific Values**: Different values for development, staging, and production
- **Secrets Management**: Store API keys and secrets securely (combine with Azion's secrets management)
- **Shared Defaults**: Define a default value once and use it across multiple Edge Function Instances

## Priority Chain Example

This example showcases how to use Environment Variables as a fallback mechanism:

| Priority | Source | Example Value |
|----------|--------|---------------|
| 1st | JSON Args (message) | `"Hello World using JSON Args!"` |
| 2nd | Environment Variable | `"Hello World using Environment Variables!"` |
| 3rd | Default Value | `"Default value"` |

This allows you to:
- Define a generic value for multiple Edge Function Instances via Environment Variables
- Override specific instances with JSON Args when needed
- Quickly modify the generic value without changing the Edge Function's code
- Reuse the same default value across multiple Edge Functions

## For More Information

- [Azion Environment Variables Documentation](https://www.azion.com/en/documentation/products/edge-functions/environment-variables/)
- [Azion API Reference for Environment Variables](https://api.azion.com/#a9f1a8aa-bacc-48f0-8d4b-903a412790c4)

## License

This project is licensed under the MIT License.
