# Resend for Azion

This package provides a simple integration with the Resend API for sending emails, specifically designed to run on Azion's Edge Functions.

## Usage

To use this package, you need to have a Resend account and an API key. You can get one at [https://resend.com](https://resend.com).

### Environment Variables

Before running the application, you need to set the following environment variable:

- `RESEND_API_KEY`: Your Resend API key.

You can set this variable in a `.env` file in the root of the project.

### Installation

_Install dependencies_

```bash
pnpm install
```

### Running in Development

To run the application locally for development, use the following command:

```bash
pnpm dev
```

This will start a local server with hot-reloading.

### Building for Production

To build the application for production, use the following command:

```bash
pnpm build
```

This will create a production-ready build in the `azion` directory.

### Testing

To run the unit tests, use the following command:

```bash
pnpm test
```

## Deployment to Azion

To deploy this project to the Azion platform, you can use the Azion CLI. If you don't have it installed, you can find the installation instructions [here](https://www.azion.com/en/documentation/products/azion-cli/install/).

1. **Login to your Azion account:**

   ```bash
   azion login
   ```

2. **Deploy the application:**

   ```bash
   azion deploy
   ```

   This command will build and deploy your application to the Azion network.

3. **Set the `RESEND_API_KEY` as a secret:**

   You must set the `RESEND_API_KEY` as a secret in your Azion application. You can do this through the Azion Console or using the Azion CLI:

   ```bash
   azion create secret RESEND_API_KEY --value <your-api-key>
   ```

   Replace `<your-api-key>` with your actual Resend API key.

### Running on Azion

After the deployment is complete, you’ll receive a domain to access your Hono project on the Azion Platform.

Wait a few minutes so the propagation takes place, and then access your application using the provided domain, which should be similar to `https://xxxxxxx.map.azionedge.net`.
