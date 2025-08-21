import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveStatic } from "hono/bun";
import prisma from "./lib/prisma";
import { Invoice as XenditInvoiceClient } from "xendit-node";

const app = new Hono();
app.use("/*", cors());

// Serve static files from client build
app.use("/*", serveStatic({ root: "../client/dist" }));
app.use("/*", serveStatic({ root: "../client/dist/index.html" }));

const xenditInvoice = new XenditInvoiceClient({
  secretKey: process.env.XENDIT_SECRET_KEY || "",
});

// Struktur data untuk pembayaran
interface PaymentInput {
  product: string;
  amount: number;
  qty: number;
}

interface PaymentResponse {
  id: string;
  invoice_id: string;
  invoice_url: string;
  status: string;
  amount: number;
}

// Buat ID invoice baru (format: toko-qu-1, toko-qu-2, dst.)
async function makeInvoiceId(): Promise<string> {
  const lastPayment = await prisma.payment.findFirst({
    orderBy: { id: "desc" },
  });

  let nextNumber = 1;
  if (lastPayment && lastPayment.invoice_id) {
    const match = lastPayment.invoice_id.match(/toko-qu-(\d+)/);
    if (match && match[1]) {
      nextNumber = parseInt(match[1]) + 1;
    }
  }

  return `toko-qu-${nextNumber}`;
}

// Buat pembayaran baru
async function createPayment(input: PaymentInput): Promise<PaymentResponse> {
  const invoiceId = await makeInvoiceId();

  // Simpan pembayaran ke database
  const payment = await prisma.payment.create({
    data: {
      invoice_id: invoiceId,
      status: "PENDING",
      product: input.product,
      amount: input.amount,
      qty: input.qty,
    },
  });

  // Buat invoice di Xendit
  const invoice = await xenditInvoice.createInvoice({
    data: {
      externalId: invoiceId,
      amount: input.amount,
      description: `Pembelian ${input.product} (${input.qty} item)`,
      invoiceDuration: 86400, // 24 jam
      currency: "IDR",
      successRedirectUrl: `${
        process.env.CLIENT_URL || "http://localhost:3000"
      }/cart?status=success`,
      failureRedirectUrl: `${
        process.env.CLIENT_URL || "http://localhost:3000"
      }/cart?status=failed`,
    },
  });

  // Update URL invoice di database
  await prisma.payment.update({
    where: { id: payment.id },
    data: { invoice_url: invoice.invoiceUrl },
  });

  return {
    id: payment.id,
    invoice_id: payment.invoice_id,
    invoice_url: invoice.invoiceUrl,
    status: payment.status,
    amount: payment.amount,
  };
}

// Tangani webhook dari Xendit untuk update status pembayaran
async function handleWebhook(data: any): Promise<void> {
  const { external_id, status } = data;

  if (!external_id) {
    console.error("Tidak ada external_id di data webhook");
    return;
  }

  let paymentStatus: "PENDING" | "PAID" | "EXPIRED" = "PENDING";
  if (status === "PAID") {
    paymentStatus = "PAID";
  } else if (status === "EXPIRED") {
    paymentStatus = "EXPIRED";
  }

  await prisma.payment.update({
    where: { invoice_id: external_id },
    data: { status: paymentStatus },
  });
}

// endpoint Buat pembayaran baru
app.post("/api/payments", async (context) => {
  try {
    const { product, amount, qty } = await context.req.json();

    if (!product || !amount || !qty) {
      return context.json(
        { success: false, error: "Harus isi product, amount, dan qty" },
        400
      );
    }

    const payment = await createPayment({
      product,
      amount: parseFloat(amount),
      qty: parseInt(qty),
    });

    return context.json({ success: true, data: payment });
  } catch (error) {
    console.error("Gagal membuat pembayaran:", error);
    return context.json(
      { success: false, error: "Gagal membuat pembayaran" },
      500
    );
  }
});

// endpoint Tangani webhook Xendit
app.post("/api/webhooks/xendit", async (context) => {
  try {
    const callbackToken = context.req.header("x-callback-token");
    const webhookId = context.req.header("webhook-id");

    if (!callbackToken || !webhookId) {
      return context.json(
        {
          success: false,
          error: "Header x-callback-token atau webhook-id hilang",
        },
        400
      );
    }

    if (callbackToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
      return context.json({ success: false, error: "Token tidak valid" }, 401);
    }

    const data = await context.req.json();
    await handleWebhook(data);

    return context.json({
      success: true,
      message: "Webhook berhasil diproses",
    });
  } catch (error) {
    console.error("Gagal memproses webhook:", error);
    return context.json(
      { success: false, error: "Gagal memproses webhook" },
      500
    );
  }
});

//  Cari kota tujuan
app.get("/api/destination/search", async (context) => {
  try {
    const query = context.req.query("q");
    if (!query) {
      return context.json(
        { success: false, error: "Harus isi kata kunci pencarian" },
        400
      );
    }

    const response = await fetch(
      `https://api.lincah.id/api/destination/search?q=${encodeURIComponent(
        query
      )}`
    );
    const data: any = await response.json();
    return context.json(data);
  } catch (error) {
    console.error("Gagal mencari kota:", error);
    return context.json({ success: false, error: "Gagal mencari kota" }, 500);
  }
});

// Hitung ongkos kirim
app.post("/api/shipping/cost", async (context) => {
  try {
    const { origin_code, destination_code, weight, courier } =
      await context.req.json();

    if (!origin_code || !destination_code || !weight) {
      return context.json(
        {
          success: false,
          error: "Harus isi origin_code, destination_code, dan weight",
        },
        400
      );
    }

    const body = {
      origin_code,
      destination_code,
      weight: parseFloat(weight),
      ...(courier && { courier: courier.toLowerCase() }),
    };

    const response = await fetch("https://api.lincah.id/api/check/ongkir", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data: any = await response.json();
    return context.json(data);
  } catch (error) {
    console.error("Gagal menghitung ongkos kirim:", error);
    return context.json(
      { success: false, error: "Gagal menghitung ongkos kirim" },
      500
    );
  }
});

// Serve static files for everything else
app.use("*", serveStatic({ root: "./static" }));

app.get("*", async (c, next) => {
  return serveStatic({ root: "./static", path: "index.html" })(c, next);
});

const port = parseInt(process.env.PORT || "3000");

export default {
  port,
  fetch: app.fetch,
};

console.log(`🦫 Server berjalan di port ${port}`);
