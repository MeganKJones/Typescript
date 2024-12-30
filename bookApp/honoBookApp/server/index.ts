import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import bookRoutes from './books.ts'
import { serveStatic } from '@hono/node-server/serve-static'
import { cors } from 'hono/cors'

const app = new Hono()

app.use('*', serveStatic({ root: './client/public' }))
app.use('*', cors())

app.route("/", bookRoutes);


app.get('/', (c) => {
  return c.json({message: "hello!"})
})


const port = 3000
console.log(`Server is running on http://localhost:${port}`)

serve({
  fetch: app.fetch,
  port
})
