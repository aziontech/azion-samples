import { Router } from "itty-router";
import { indexHTML } from "./html/index";
import { CustomEvent } from "../types/event";

export const PageRouter = () => {
  const router = Router({ base: "/" });
  router.get("/", pageHomeHandler);

  return router;
};


const pageHomeHandler = async ({ request }: CustomEvent) => {
  const html = indexHTML();

  return new Response(html, {
    headers: {
      "content-type": "text/html;charset=UTF-8",
    },
    status: 200,
  });
};
