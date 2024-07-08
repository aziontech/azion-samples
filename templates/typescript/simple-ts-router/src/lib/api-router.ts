import { Router } from "itty-router";
import type { CustomEvent } from "../types/event";


export const ApiRouter = () => {
  const router = Router({ base: "/api" });
  router.get("/message", apiGetMessageHandler);

  return router;
};


const apiGetMessageHandler = async ({ request }: CustomEvent) => {
  const helloMessage = "Hello World! (from /api/message route)";

  return new Response(JSON.stringify({ message: helloMessage }), {
    headers: {
      "content-type": "application/json;charset=UTF-8",
    },
    status: 200,
  });
};
