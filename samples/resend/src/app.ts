import { Hono } from "hono";

const app = new Hono();

const RESEND_API_KEY = process.env.RESEND_API_KEY!;
const EMAIL_TO = "bruno.andrade@azion.com";

app.get("/", async (c) => {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: "onboarding@resend.dev",
      to: EMAIL_TO,
      subject: "hello world",
      html: "<strong>it works!</strong>",
    }),
  });

  const data: any = await res.json();

  return c.json(data);
});

export default app;
