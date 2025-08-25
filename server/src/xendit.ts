import { Hono } from "hono";
import prisma from "./lib/prisma";
import { Invoice as XenditInvoiceClient } from "xendit-node";

const xenditInvoice = new XenditInvoiceClient({
  secretKey: process.env.XENDIT_SECRET_KEY || "",
});

const xendit = new Hono();

// Buat ID invoice
async function makeInvoiceId(): Promise<string> {
  const lastPayment = await prisma.payment.findFirst({
    orderBy: { id: "desc" },
  });

  let nextNumber = 1;
  if (lastPayment?.invoice_id) {
    const match = lastPayment.invoice_id.match(/toko-qu-(\d+)/);
    if (match && match[1]) {
      nextNumber = parseInt(match[1], 10) + 1;
    }
  }

  return `toko-qu-${nextNumber}`;
}

// Buat payment
xendit.post("/payments", async (c) => {
  try {
    const body = await c.req.json();
    const {
      product,
      amount,
      qty,
      productId,
      sellerId,
      buyerName,
      buyerEmail,
      buyerPhone,
      shippingAddress,
    } = body;

    if (!product || !amount || !qty) {
      return c.json(
        { success: false, error: "Harus isi product, amount, qty" },
        400
      );
    }

    const invoiceId = await makeInvoiceId();

    const payment = await prisma.payment.create({
      data: {
        invoice_id: invoiceId,
        status: "PENDING",
        product,
        amount,
        qty,
        productId,
        sellerId,
        buyerName,
        buyerEmail,
        buyerPhone,
        shippingAddress,
      },
    });

    const invoice = await xenditInvoice.createInvoice({
      data: {
        externalId: invoiceId,
        amount,
        description: `Pembelian ${product} (${qty} item)`,
        invoiceDuration: 86400,
        currency: "IDR",
        successRedirectUrl: `${process.env.CLIENT_URL || "http://localhost:3000"}/cart?status=success`,
        failureRedirectUrl: `${process.env.CLIENT_URL || "http://localhost:3000"}/cart?status=failed`,
      },
    });

    await prisma.payment.update({
      where: { id: payment.id },
      data: { invoice_url: invoice.invoiceUrl },
    });

    return c.json({
      success: true,
      data: { ...payment, invoice_url: invoice.invoiceUrl },
    });
  } catch (e) {
    console.error(e);
    return c.json({ success: false, error: "Gagal membuat pembayaran" }, 500);
  }
});

// Webhook Xendit
xendit.post("/webhooks/xendit", async (c) => {
  try {
    const callbackToken = c.req.header("x-callback-token");
    if (callbackToken !== process.env.XENDIT_WEBHOOK_TOKEN) {
      return c.json({ success: false, error: "Token tidak valid" }, 401);
    }

    const data = await c.req.json();
    const { external_id, status } = data;

    let paymentStatus: "PENDING" | "PAID" | "EXPIRED" = "PENDING";
    if (status === "PAID") paymentStatus = "PAID";
    if (status === "EXPIRED") paymentStatus = "EXPIRED";

    await prisma.payment.update({
      where: { invoice_id: external_id },
      data: { status: paymentStatus },
    });

    return c.json({ success: true });
  } catch (e) {
    console.error(e);
    return c.json({ success: false, error: "Webhook gagal diproses" }, 500);
  }
});

export default xendit;
