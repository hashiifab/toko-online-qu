import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

const Cart = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState<CartItem[]>([]);

  // cart item
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) setItems(JSON.parse(savedCart));
  }, []);

  // update cart item
  const updateCart = (newItems: CartItem[]) => {
    setItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
  };

  const removeItem = (id: number) => updateCart(items.filter(item => item.id !== id));

  const updateQuantity = (id: number, qty: number) => {
    if (qty < 1) return;
    updateCart(items.map(item => item.id === id ? { ...item, quantity: qty } : item));
  };

  const totalPrice = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Toko Online Qu</h1>
          <button
            onClick={() => navigate('/cart')}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <ShoppingCart size={24} />
          </button>
        </div>
      </header>

      <div className="container mx-auto p-4">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
        >
          <ArrowLeft size={20} /> Back
        </button>

        {items.length === 0 ? (
          <div className="text-center py-48">
            <h2 className="text-3xl font-bold mb-4">Cart kosong</h2>
            <p className="text-gray-600 mb-6">Ayo mulai belanja!</p>
            <button
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
            >
              Belanja Sekarang
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* List Produk */}
            <div className="lg:col-span-2 space-y-6">
              {items.map(item => (
                <div key={item.id} className="flex flex-col sm:flex-row gap-4 p-4 border border-gray-200 shadow rounded-lg hover:shadow-md transition">
                  <img src={item.image} alt={item.name} className="w-full sm:w-32 h-32 object-cover rounded-lg" />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg font-semibold">{item.name}</h3>
                      <p className="text-blue-600 font-bold mt-1">
                        Rp {item.price.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="flex items-center justify-between mt-4 sm:mt-auto">
                      <div className="flex items-center border rounded-md">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100 disabled:opacity-50" disabled={item.quantity <= 1}>-</button>
                        <span className="px-4 py-1">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-1 hover:bg-gray-100">+</button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Ringkasan */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 p-6 rounded-lg shadow-md space-y-4">
                <h2 className="text-xl font-bold">Ringkasan Pesanan</h2>
                <div className="flex justify-between">
                  <span>Subtotal ({items.length} item)</span>
                  <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <div className="flex justify-between">
                  <span>Ongkos Kirim</span>
                  <span className="text-green-500">Gratis</span>
                </div>
                <div className="border-t pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
                <button 
              onClick={() => navigate('/checkout')}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition mt-4"
            >
              Lanjut ke Checkout
            </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
