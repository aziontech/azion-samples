import { aiChatRequestHandler } from "@/handlers/aiChatHandler";
import { authMiddleware } from "@/middlewares/authMiddleware";
import { Hono } from "hono";

const app = new Hono<{}>()

app.use('*', async (c, next) => {
  if (c.req.method !== 'OPTIONS' && c.req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  await next()
})

app.use('/*', async (c, next) => {
  if (c.req.method === 'OPTIONS') {
    await next()
    return
  }

  const authentication = await authMiddleware.authenticate(c.req.raw)

  if (!authentication.success) {
    return new Response(JSON.stringify(authentication.error), { status: authentication.error?.status })
  }

  await next()
})

app.options('/*', async (c) => {
  return new Response(null, { status: 200 })
})

app.post('/ai/chat', async (c) => aiChatRequestHandler(c))

app.fire()