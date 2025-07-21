import { app } from "@/app";
import { fire } from "hono/service-worker";

fire(app, { env: { STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY! } });
