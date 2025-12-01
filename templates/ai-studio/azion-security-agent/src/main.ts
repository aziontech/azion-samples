import { Hono } from "hono";
import { chatRequestHandler } from "@/handlers/chatHandler";
import { authRequestHandler } from "@/handlers/authHandler";
import { AuthMiddleware } from "@/middlewares/authMiddleware";

const app = new Hono()

app.use('*', async (c, next) => {
    if (c.req.method !== 'OPTIONS' && c.req.method !== 'POST') {
        return new Response('Method not allowed', { status: 405 })
    }

    await next()
})

app.use('/*', async (c, next) => {
    if (c.req.path === '/auth' || c.req.method === 'OPTIONS') {
      await next()
      return
    }

    const authMiddleware = new AuthMiddleware()

    const authentication = await authMiddleware.authenticate(c.req.raw)

    if (!authentication.success) {
      return new Response(JSON.stringify(authentication.error), { status: 401 })
    }
    await next()
})

app.options('/*', async (c) => {
  return new Response(null, { status: 200 })
})

app.post('/auth', async (c) => authRequestHandler(c.req.raw))
app.post('/chat/completions', async (c) => chatRequestHandler(c.req.raw))

app.fire()