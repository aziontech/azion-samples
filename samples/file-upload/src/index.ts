import { app } from "@/app";
import { fire } from "hono/service-worker";

fire(app);
