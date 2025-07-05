import { Hono } from 'hono';

const app = new Hono();

app.get('/', (c) => c.text('Hello Hono!'));
app.post('/scan', async (c) => {
  const page = await c.req.json();
  return c.json({ scanned: true, title: page.title });
});

export default app;