import { aiChatRequestHandler } from "@/handlers/aiChatHandler";
import { AuthMiddleware } from "@/middlewares/authMiddleware";
import { AuthData } from "@/types";
import { Hono } from "hono";

const app = new Hono<{ Variables: AuthData }>()

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

  const authMiddleware = new AuthMiddleware()

  const authentication = await authMiddleware.authenticate(c.req.raw)

  if (!authentication.success) {
    return new Response(JSON.stringify(authentication.error), { status: authentication.error?.status })
  }

  c.set('accountId', authentication.data.accountId)

  await next()
})

app.options('/*', async (c) => {
  return new Response(null, { status: 200 })
})

app.post('/ai/chat', async (c) => aiChatRequestHandler(c))

app.fire()

