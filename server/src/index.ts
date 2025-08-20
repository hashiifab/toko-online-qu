import { Hono } from 'hono';
import { cors } from 'hono/cors';

const app = new Hono();
app.use('/*', cors());

// Destination search
app.get('/api/destination/search', async (c) => {
  const q = c.req.query('q');
  if (!q) return c.json({ success: false, error: 'q required' }, 400);

  const res = await fetch(`https://api.lincah.id/api/destination/search?q=${encodeURIComponent(q)}`);
  const data = await res.json() as any;
  return c.json(data);
});

// Shipping cost
app.post('/api/shipping/cost', async (c) => {
  const body = await c.req.json();
  const { origin_code, destination_code, weight, courier } = body;

  if (!origin_code || !destination_code || !weight) {
    return c.json({ success: false, error: 'Missing parameters' }, 400);
  }

  const requestBody: Record<string, any> = {
    origin_code,
    destination_code,
    weight: parseFloat(weight),
    ...(courier && { courier: courier.toLowerCase() }),
  };

  const res = await fetch('https://api.lincah.id/api/check/ongkir', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });
  const data = await res.json() as any;
  return c.json(data);
});

export default app;
