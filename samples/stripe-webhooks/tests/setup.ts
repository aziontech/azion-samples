// Mock environment variables
process.env.STRIPE_SECRET_KEY = 'test_secret_key';
process.env.STRIPE_WEBHOOK_SECRET = 'test_webhook_secret';

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => ({
    webhooks: {
      constructEvent: jest.fn().mockImplementation((payload, signature, secret) => {
        if (signature === 'valid_signature') {
          return {
            type: 'payment_intent.succeeded',
            data: {
              object: {
                id: 'test_payment_intent_id',
                amount: 1000,
                currency: 'usd',
                status: 'succeeded'
              }
            }
          };
        }
        throw new Error('Invalid signature');
      })
    }
  }));
});

