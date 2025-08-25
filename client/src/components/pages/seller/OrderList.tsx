interface Order {
  id: string;
  status: string;
  invoice_url?: string;
  invoice_id: string;
  product: string;
  productId?: string;
  amount: number;
  qty: number;
  buyerName?: string;
  buyerEmail?: string;
  buyerPhone?: string;
  shippingAddress?: string;
  createdAt: string;
  updatedAt: string;
}

type Props = {
  orders: Order[];
};

export default function OrderList({ orders }: Props) {
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <div key={order.id} className="bg-white rounded-lg shadow p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Order #{order.invoice_id}</h3>
              <p className="text-sm text-gray-500">
                {new Date(order.createdAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
            <div className="text-right">
              <span
                className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  order.status === 'PAID'
                    ? 'bg-green-100 text-green-800'
                    : order.status === 'PENDING'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {order.status}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Product Details</h4>
              <p className="text-sm text-gray-600">Product: {order.product}</p>
              <p className="text-sm text-gray-600">Quantity: {order.qty}</p>
              <p className="text-sm font-semibold text-blue-600">
                Total: Rp {order.amount.toLocaleString("id-ID")}
              </p>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Buyer Information</h4>
              {order.buyerName && <p className="text-sm text-gray-600">Name: {order.buyerName}</p>}
              {order.buyerEmail && <p className="text-sm text-gray-600">Email: {order.buyerEmail}</p>}
              {order.buyerPhone && <p className="text-sm text-gray-600">Phone: {order.buyerPhone}</p>}
              {order.shippingAddress && (
                <p className="text-sm text-gray-600">Address: {order.shippingAddress}</p>
              )}
            </div>
          </div>

          {order.invoice_url && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <a
                href={order.invoice_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                View Invoice
              </a>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
