import { Hono } from "hono";
import prisma from "./lib/prisma";
import { auth } from "./lib/auth";

const seller = new Hono();

// Middleware auth
const authMiddleware = async (c: any, next: any) => {
  try {
    const headers = new Headers();
    const cookieHeader = c.req.header("cookie");
    if (cookieHeader) headers.set("cookie", cookieHeader);

    const session = await auth.api.getSession({ headers });
    if (!session?.user) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    (c as any).user = session.user;
    await next();
  } catch (err) {
    console.error("Auth error:", err);
    return c.json({ error: "Auth failed" }, 500);
  }
};

// Create product
seller.post("/products", authMiddleware, async (c) => {
  const user = (c as any).user;
  const body = await c.req.json();

  const userData = await prisma.users.findUnique({
    where: { id: user.id },
    select: {
      shippingOriginId: true,
      shippingOriginName: true,
      shippingOriginCode: true,
    },
  });

  if (!userData?.shippingOriginId || !userData.shippingOriginName) {
    return c.json({ error: "Please set your shipping origin first" }, 400);
  }

  const product = await prisma.product.create({
    data: {
      ...body,
      userId: user.id,
      shippingOriginId: userData.shippingOriginId,
      shippingOriginName: userData.shippingOriginName,
      shippingOriginCode: userData.shippingOriginCode,
    },
    include: { user: true },
  });

  return c.json(product, 201);
});

// Update product (owner only)
seller.put("/products/:id", authMiddleware, async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json();
  const user = (c as any).user;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product || product.userId !== user.id) {
    return c.json({ error: "Not found or unauthorized" }, 404);
  }

  const updated = await prisma.product.update({
    where: { id },
    data: body,
    include: { user: true },
  });

  return c.json(updated);
});

// Delete product (owner only)
seller.delete("/products/:id", authMiddleware, async (c) => {
  const id = c.req.param("id");
  const user = (c as any).user;

  const product = await prisma.product.findUnique({ where: { id } });
  if (!product || product.userId !== user.id) {
    return c.json({ error: "Not found or unauthorized" }, 404);
  }

  await prisma.product.delete({ where: { id } });
  return c.json({ message: "Product deleted" });
});

// Get my products
seller.get("/my-products", authMiddleware, async (c) => {
  const user = (c as any).user;
  const products = await prisma.product.findMany({
    where: { userId: user.id },
    include: { user: true },
  });
  return c.json(products);
});

// Update shipping origin
seller.put("/user/shipping-origin", authMiddleware, async (c) => {
  const user = (c as any).user;
  const body = await c.req.json();

  if (!body.shippingOriginId || !body.shippingOriginName || !body.shippingOriginCode) {
    return c.json({ error: "shippingOriginId, shippingOriginName, and shippingOriginCode are required" }, 400);
  }

  const updatedUser = await prisma.users.update({
    where: { id: user.id },
    data: {
      shippingOriginId: body.shippingOriginId,
      shippingOriginName: body.shippingOriginName,
      shippingOriginCode: body.shippingOriginCode,
    },
  });

  return c.json(updatedUser);
});

// Get shipping origin
seller.get("/user/shipping-origin", authMiddleware, async (c) => {
  const user = (c as any).user;

  const data = await prisma.users.findUnique({
    where: { id: user.id },
    select: {
      shippingOriginId: true,
      shippingOriginName: true,
      shippingOriginCode: true,
    },
  });

  return c.json(data);
});

// Seller orders
seller.get("/seller/orders", authMiddleware, async (c) => {
  const user = (c as any).user;

  const orders = await prisma.payment.findMany({
    where: { sellerId: user.id, status: "PAID" },
    orderBy: { createdAt: "desc" },
  });

  return c.json(orders);
});

export default seller;
