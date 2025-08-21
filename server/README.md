# Payment Integration with Xendit and NeonDB

This server provides payment integration with Xendit using NeonDB as the database.

## Quick Start

To install dependencies:
```sh
bun install
```

To run:
```sh
bun run dev
```

open http://localhost:3000

## Setup

1. **Environment Variables**
   Copy `.env.example` to `.env` and update the values:
   ```bash
   cp .env.example .env
   ```

2. **Database Setup**
   The database schema is already configured with Prisma:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Xendit Setup**
   - Get your API keys from [Xendit Dashboard](https://dashboard.xendit.co/)
   - Set `XENDIT_SECRET_KEY` in your `.env` file
   - Configure webhook endpoint: `https://yourdomain.com/api/webhooks/xendit`

## API Endpoints

### Create Payment
```http
POST /api/payments
Content-Type: application/json

{
  "product": "Nama Produk",
  "amount": 100000,
  "qty": 2
}
```

### Get Payment Status
```http
GET /api/payments/:invoiceId
```

### Get All Payments
```http
GET /api/payments
```

### Webhook Handler
```http
POST /api/webhooks/xendit
Content-Type: application/json

{
  "invoice_id": "toko-qu-1",
  "status": "PAID"
}
```

## Database Schema

### Payment Table
- `id`: Primary key (CUID)
- `status`: Enum (PENDING, PAID, EXPIRED)
- `invoice_url`: Xendit checkout URL
- `invoice_id`: Unique invoice identifier (format: toko-qu-{increment})
- `product`: Product name
- `amount`: Transaction amount
- `qty`: Quantity
- `created_at`: Creation timestamp
- `updated_at`: Last update timestamp

## Client Integration

### Flow Overview
1. **Before Payment**: Products remain in localStorage
2. **Payment Creation**: Client calls `/api/payments` to create invoice
3. **Redirect**: Client redirects to `invoice_url` for payment
4. **Webhook**: After payment, Xendit sends webhook to `/api/webhooks/xendit`
5. **Status Update**: Payment status updated in database
6. **LocalStorage Cleanup**: Client clears localStorage after successful payment

### Example Client Code
```typescript
// Create payment
const response = await fetch('/api/payments', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    product: 'Nama Produk',
    amount: 100000,
    qty: 2
  })
});

const { data } = await response.json();
// Redirect to Xendit checkout
window.location.href = data.invoice_url;
```

## Development

### Database Management
```bash
# View database
npx prisma studio

# Reset database
npx prisma migrate reset

# Generate new migration
npx prisma migrate dev --name your-migration-name
```
