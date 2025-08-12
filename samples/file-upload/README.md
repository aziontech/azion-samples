# File Upload Example

This project demonstrates how to implement file upload functionality using edge functions. It provides sample code and best practices for handling file uploads efficiently and securely in a modern web application.

## Deployment Instructions

To deploy this project, follow these steps:

1. **Clone the repository:**

   ```bash
   git clone https://github.com/your-username/edge-functions-examples.git
   cd edge-functions-examples/packages/file-upload
   ```

2. **Install dependencies:**

   ```bash
   pnpm install
   ```

3. **Configure environment variables:**

   Copy `.env.example` to `.env` and update the values as needed.

4. **Running the project locally:**

   ```bash
   pnpm build
   ```

5. **Deploy to your edge platform:**

   Ensure you have the [Azion CLI](https://www.azion.com/en/documentation/products/azion-cli/overview/) installed and configured.

   ```bash
   azion deploy
   ```

   After the deployment is complete, you’ll receive a domain to access your Hono project on the Azion Platform.

   Wait a few minutes so the propagation takes place, and then access your application using the provided domain, which should be similar to `https://xxxxxxx.map.azionedge.net`.

> **Note:** Ensure to create a bucket before deploying the function. You can do this through the Azion Platform or using the Azion CLI.
