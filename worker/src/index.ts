import { Hono } from 'hono';
import { cors } from 'hono/cors'

const app = new Hono()


app.use('*', cors({
  origin: '*', 
  allowMethods: ['GET', 'POST', 'OPTIONS'],
}))


app.get('/', (c) => c.text('Hello Hono!'));
app.post('/scan', async (c) => {
  const page = await c.req.json();
  return c.json({ scanned: true, title: page.title });
});

export default app;