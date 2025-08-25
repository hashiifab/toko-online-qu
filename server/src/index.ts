import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";

import { auth } from "./lib/auth";
import productRoutes from "./product";
import xenditRoutes from "./xendit";
import lincahRoutes from "./lincah";
import sellerRoutes from "./seller";

const app = new Hono();

// Middleware CORS
app.use("/*", cors({
  origin: ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  allowHeaders: ["Content-Type", "Authorization", "Cookie"],
  allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
}));

// Static client build
app.use("/*", serveStatic({ root: "../client/dist" }));
app.use("/*", serveStatic({ root: "../client/dist/index.html" }));

// Auth
app.on(["POST", "GET"], "/api/auth/**", (c) => auth.handler(c.req.raw));

// Register routes
app.route("/api", productRoutes);
app.route("/api", xenditRoutes);
app.route("/api", lincahRoutes);
app.route("/api", sellerRoutes);

// Static fallback
app.use("*", serveStatic({ root: "./static" }));
app.get("*", async (c, next) => {
  return serveStatic({ root: "./static", path: "index.html" })(c, next);
});

const port = parseInt(process.env.PORT || "3000");
export default { port, fetch: app.fetch };

console.log(`🦫 Server berjalan di port ${port}`);
