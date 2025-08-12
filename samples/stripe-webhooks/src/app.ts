import { Context, Hono } from "hono";
import { HTTPException } from "hono/http-exception";
import Stripe from "stripe";

type Bindings = {
  STRIPE_SECRET_KEY: string;
};

type Variables = {
  stripeEvent: Stripe.Event;
};

// Initialize Hono app with proper types
export const app = new Hono<{
  Bindings: Bindings;
  Variables: Variables;
}>();

// Initialize Stripe with your secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2025-06-30.basil",
  typescript: true,
});

// Middleware to verify the webhook signature
const verifyStripeWebhook = async (c: Context, next: () => Promise<void>) => {
  try {
    const signature = c.req.header("stripe-signature");
    if (!signature) {
      throw new HTTPException(400, {
        message: "Missing stripe-signature header",
      });
    }

    const payload = await c.req.raw.text();

    // Verify the webhook signature
    const event = stripe.webhooks.constructEvent(
      payload,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET || ""
    );

    // Attach the event to the context for use in the route handler
    c.set("stripeEvent", event);
    await next();
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return c.json({ error: "Webhook verification failed" }, 400);
  }
};

// Webhook endpoint
app.post("/webhook", verifyStripeWebhook, async (c) => {
  const event = c.get("stripeEvent");

  try {
    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded": {
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        console.log("PaymentIntent was successful!", paymentIntent.id);
        // Handle successful payment
        break;
      }

      case "payment_method.attached": {
        const paymentMethod = event.data.object as Stripe.PaymentMethod;
        console.log("PaymentMethod was attached!", paymentMethod.id);
        break;
      }

      case "charge.succeeded": {
        const charge = event.data.object as Stripe.Charge;
        console.log("Charge was successful!", charge.id);
        break;
      }

      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return c.json({ received: true });
  } catch (err) {
    console.error("Error handling webhook:", err);
    return c.json({ error: "Webhook handler failed" }, 400);
  }
});

// Health check endpoint
app.get("/", (c) => {
  return c.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    service: "stripe-webhooks",
  });
});

// Error handling
app.onError((err: Error, c) => {
  console.error("Error:", err);
  return c.json({ error: "Internal Server Error" }, 500);
});

export default app;
