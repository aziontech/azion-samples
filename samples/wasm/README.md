# WebAssembly (WASM) on Edge Functions

This sample demonstrates how to use WebAssembly (WASM) within an Azion Edge Function. WebAssembly enables high-performance execution of code written in languages like C, C++, Rust, or Go directly in your edge functions.

## What This Example Does

The [`wasm.js`](wasm.js) file contains an embedded WebAssembly module that implements a simple `increment` function. When a request is made:

1. The function checks for a `value` header in the request
2. If present, it parses the value as an integer
3. The WASM `increment` function adds 1 to the value
4. Returns a response with the incremented result

## How It Works

```javascript
// The WASM binary is embedded as a Uint8Array
const wasmCode = new Uint8Array([...]);

// Compile and instantiate the WebAssembly module
const wasmModule = new WebAssembly.Module(wasmCode);
const wasmInstance = new WebAssembly.Instance(wasmModule);

// Access the exported function
const increment = wasmInstance.exports.increment;
```

You can also load WASM modules dynamically via fetch:

```javascript
const wasmResponse = await fetch("https://your-domain.com/yourfile.wasm");
const wasmBuffer = await wasmResponse.arrayBuffer();
const wasmModule = new WebAssembly.Module(wasmBuffer);
```

## Prerequisites

- [Azion CLI](https://www.azion.com/en/documentation/products/azion-cli/overview/) installed and configured
- An Azion account

## Deployment Instructions

### 1. Clone the Repository

```bash
git clone git@github.com:aziontech/azion-samples.git
cd azion-samples/samples/wasm
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

Send a request with a `value` header to test the increment function:

```bash
curl -X GET "https://your-domain.map.azionedge.net/" -H "value: 42"
# for localhost
curl -X GET "http://localhost:3333/" -H "value: 42"
```

Expected response:

```
incrementing 42 we have 43
```

If no `value` header is provided, the function will increment 0:

```
incrementing 0 we have 1
```

## License

This project is licensed under the MIT License.
