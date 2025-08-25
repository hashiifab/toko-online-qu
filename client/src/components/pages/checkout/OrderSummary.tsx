interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  weight: number;
  shippingOriginCode: string;
}

interface OrderSummaryProps {
  cartItems: CartItem[];
  calculateTotal: () => number;
  shippingCost: number;
}

const OrderSummary = ({ cartItems, calculateTotal, shippingCost }: OrderSummaryProps) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
    <div className="space-y-4">
      {cartItems.map((item: CartItem) => (
        <div key={item.id} className="flex justify-between items-center">
          <div>
            <h3 className="font-medium">{item.name}</h3>
            <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
          </div>
          <p className="font-medium">
            Rp {(item.price * item.quantity).toLocaleString("id-ID")}
          </p>
        </div>
      ))}
      <div className="border-t pt-4">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p className="font-medium">
            Rp {(calculateTotal() - shippingCost).toLocaleString("id-ID")}
          </p>
        </div>
        <div className="flex justify-between mt-2">
          <p>Ongkos Kirim</p>
          <p className="font-medium">
            {shippingCost > 0
              ? `Rp ${shippingCost.toLocaleString("id-ID")}`
              : "-"}
          </p>
        </div>
        <div className="flex justify-between mt-4 text-lg font-semibold">
          <p>Total</p>
          <p>Rp {calculateTotal().toLocaleString("id-ID")}</p>
        </div>
      </div>
    </div>
  </div>
);

export default OrderSummary;