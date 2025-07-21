import { Hono } from 'hono';
import Stripe from 'stripe';
import { app } from './app';

// Define the types from app.ts since they're not exported
type Bindings = {
  STRIPE_SECRET_KEY: string;
};

type Variables = {
  stripeEvent: Stripe.Event;
};

// Create a test client with proper types
type TestClient = {
  request: (method: string, path: string, options?: {
    headers?: Record<string, string>;
    body?: any;
  }) => Promise<{
    status: number;
    body: any;
    headers: Record<string, string>;
  }>;
  get: (path: string, options?: any) => ReturnType<TestClient['request']>;
  post: (path: string, options?: any) => ReturnType<TestClient['request']>;
};

const createTestClient = (app: Hono<{ Bindings: Bindings; Variables: Variables }>): TestClient => {
  return {
    request: async (method, path, options = {}) => {
      const req = new Request(`http://localhost${path}`, {
        method,
        headers: options.headers || {},
        body: options.body ? JSON.stringify(options.body) : undefined,
      });

      const res = await app.fetch(req);
      const body = await res.json().catch(() => ({}));

      const headers: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        headers[key] = value;
      });

      return {
        status: res.status,
        body,
        headers,
      };
    },
    get: function(path, options) {
      return this.request('GET', path, options);
    },
    post: function(path, options) {
      return this.request('POST', path, options);
    },
  };
};

describe('Stripe Webhooks', () => {
  describe('GET /', () => {
    it('should return health check status', async () => {
      const client = createTestClient(app);
      const response = await client.get('/');

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'ok');
      expect(response.body).toHaveProperty('service', 'stripe-webhooks');
      expect(response.body).toHaveProperty('timestamp');
    });
  });

  describe('POST /webhook', () => {
    it('should return 400 if stripe-signature header is missing', async () => {
      const client = createTestClient(app);
      const response = await client.post('/webhook');

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Webhook verification failed');
    });

    it('should return 400 for invalid signature', async () => {
      const client = createTestClient(app);
      const response = await client.post('/webhook', {
        headers: { 'stripe-signature': 'invalid_signature' },
        body: {}
      });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Webhook verification failed');
    });

    it('should handle payment_intent.succeeded event', async () => {
      const mockEvent = {
        id: 'evt_test',
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: 'pi_test',
            amount: 1000,
            currency: 'usd',
            status: 'succeeded'
          }
        }
      };

      // Mock Stripe's constructEvent
      const mockConstructEvent = (Stripe as unknown as ReturnType<typeof jest.fn>).mock.results[0].value.webhooks.constructEvent as jest.Mock;
      mockConstructEvent.mockImplementationOnce(() => mockEvent);

      const client = createTestClient(app);
      const response = await client.post('/webhook', {
        headers: { 'stripe-signature': 'valid_signature' },
        body: mockEvent
      });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ received: true });
    });
  });
});
