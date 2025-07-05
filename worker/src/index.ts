import { Hono } from 'hono';
import { cors } from 'hono/cors'
import { PageInfo } from './types/index.js'
import { Scanner } from './scanner/index.js'

const app = new Hono()


app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
}))


app.get('/', (c) => c.text('Hello from smtdfc team!'));
app.post('/scan/fullscan', async (c) => {
  try {
    const pageInfo = (await c.req.json()) as PageInfo;
    const scanner = new Scanner();
    const result = await scanner.scan(pageInfo);
    return c.json({
      status: "success",
      result
    });
  } catch (e: any) {
    return c.json({
      status: "error",
    });
  }
});

export default app;