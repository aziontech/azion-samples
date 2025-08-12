# Stripe Webhook Handler

A TypeScript-based webhook handler for processing Stripe events on the edge. This project is designed to be deployed on Azion's edge network for high performance and low latency.

## Features

- 🔒 Secure webhook signature verification
- 🚀 Built with Hono.js for edge compatibility
- 📝 TypeScript support with proper type definitions
- 🔄 Handles multiple Stripe event types
- 🛡️ Error handling and logging

## Prerequisites

- Node.js 16+
- pnpm (recommended) or npm/yarn
- Stripe account with API keys

## Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. Copy the example environment file and update with your Stripe credentials:

   ```bash
   cp .env.example .env
   ```

4. Update the `.env` file with your Stripe API keys and webhook secret.

## Configuration

You'll need to set the following environment variables:

- `STRIPE_SECRET_KEY`: Your Stripe secret key (starts with `sk_test_` or `sk_live_`)
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook secret (starts with `whsec_`)

## Available Scripts

- `pnpm dev`: Start the development server
- `pnpm build`: Build the project for production
- `pnpm start`: Start the production server

## Webhook Endpoint

The main webhook endpoint is available at `POST /webhook`. This endpoint:

- Verifies the Stripe signature
- Handles different event types
- Returns appropriate responses

### Supported Events

- `payment_intent.succeeded`: When a payment intent succeeds
- `payment_method.attached`: When a payment method is attached
- `charge.succeeded`: When a charge is successful

## Testing with Stripe CLI

1. Install the [Stripe CLI](https://stripe.com/docs/stripe-cli)
2. Log in to your Stripe account
3. Forward webhooks to your local server:

   ```bash
   stripe listen --forward-to localhost:3000/webhook
   ```

4. Trigger test events:

   ```bash
   stripe trigger payment_intent.succeeded
   ```

## Deployment

This project is configured to be deployed on Azion's edge network. Follow these steps:

1. Build the project:

   ```bash
   pnpm build
   ```

2. Deploy using Azion's CLI or dashboard
3. Set up your webhook URL in the Stripe Dashboard

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `STRIPE_SECRET_KEY` | Your Stripe secret key | Yes |
| `STRIPE_WEBHOOK_SECRET` | Your Stripe webhook signing secret | Yes |
| `PORT` | Port to run the server on (default: 3000) | No |

## Error Handling

- Invalid or missing signatures return a 400 status
- Unhandled errors return a 500 status
- All errors are logged to the console

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

_Build Command_: To run the application build command

```bash

npx edge-functions@latest build

```

_Run local DEV_: To run the application locally with Vulcan

```bash

npx edge-functions@latest dev

```
