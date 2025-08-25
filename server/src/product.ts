import { Hono } from "hono";
import prisma from "./lib/prisma";

const app = new Hono();

// Get all products (public)
app.get("/products", async (c) => {
  const products = await prisma.product.findMany({
    include: { user: true },
  });
  return c.json(products);
});

// Get single product (public)
app.get("/products/:id", async (c) => {
  const id = c.req.param("id");
  const product = await prisma.product.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!product) {
    return c.json({ error: "Product not found" }, 404);
  }

  return c.json(product);
});

export default app;
