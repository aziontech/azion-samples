import { Hono } from "hono";

const app = new Hono();
const TOKEN = process.env.PUPPETEER_BROWSERLESS_IO_KEY!;

app.get("/screenshot", async (c) => {
  const url = c.req.query("url");
  const headers = {
    "Cache-Control": "no-cache",
    "Content-Type": "application/json",
  };

  const response = await fetch(
    `https://production-sfo.browserless.io/screenshot?token=${TOKEN}`,
    {
      method: "POST",
      headers: headers,
      body: JSON.stringify({
        url: url || "https://www.example.com",
        options: {
          type: "png",
        },
      }),
    }
  );

  if (!response.ok) {
    const status = response.status;
    return c.html(await response.text(), status as any);
  }

  const arrayBuffer = await response.arrayBuffer();
  const imageBuffer = new Uint8Array(arrayBuffer);

  return c.body(imageBuffer, {
    status: 200,
    headers: {
      "Content-Type": "image/png",
    },
  });
});

export { app };
