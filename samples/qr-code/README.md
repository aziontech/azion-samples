# QR Code Generator on Edge Functions

This sample demonstrates how to create a QR Code generator application using Azion Edge Functions. The application serves an HTML page that dynamically generates QR codes based on user input.

## What This Example Does

The [`index.js`](index.js) file contains an Edge Function that serves an interactive HTML page. When accessed:

1. The function returns an HTML page with a form input
2. Users can type any text to convert into a QR code
3. The page uses the [qrcode-generator](https://www.npmjs.com/package/qrcode-generator) library (loaded from CDN) to generate QR codes
4. QR codes are displayed as images directly in the browser

## How It Works

```javascript
// The function serves an HTML page with embedded JavaScript
async function handleRequest(request) {
  var html = `<!DOCTYPE html>
  <html>
  ...
  <!-- QR code generation happens client-side -->
  <script>
    const qrCodeFactory = qrcode(typeNumber, errorCorrectionLevel);
    qrCodeFactory.addData(qrcodeField.value);
    qrCodeFactory.make();
    document.getElementById('placeHolder').innerHTML = qrCodeFactory.createImgTag(8);
  </script>
  </html>`;

  return new Response(html, {
    headers: { "content-type": "text/html;charset=UTF-8" }
  });
}
```

## Prerequisites

- [Azion CLI](https://www.azion.com/en/documentation/products/azion-cli/overview/) installed and configured
- An Azion account

## Deployment Instructions

### 1. Clone the Repository

```bash
git clone git@github.com:aziontech/azion-samples.git
cd azion-samples/samples/qr-code
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

Open your browser and navigate to your deployed domain (e.g., `https://your-domain.map.azionedge.net/`) or locally at `http://localhost:3333/`.

1. Enter any text in the input field
2. Press Enter or the form will automatically generate the QR code
3. The QR code will be displayed as an image below the input field

## Features

- **Client-side QR generation**: QR codes are generated in the browser using a lightweight JavaScript library
- **Responsive design**: The page is centered and works on various screen sizes
- **Dark theme**: Easy on the eyes with a dark background
- **No backend processing**: All QR generation happens client-side, reducing server load

## License

This project is licensed under the MIT License.
