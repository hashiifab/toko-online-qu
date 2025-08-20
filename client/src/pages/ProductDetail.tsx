import { useParams, useNavigate } from "react-router-dom";
import { mockProducts } from "../data/mockProducts";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useState } from "react";
// import CartIcon from "../components/CartIcon";

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  weight: number;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const product = mockProducts.find((item) => item.id === Number(id));

  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      const existingCart = localStorage.getItem('cart');
      const cartItems: CartItem[] = existingCart ? JSON.parse(existingCart) : [];
      
      const existingItem = cartItems.find(item => item.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity: quantity,
          weight: product.weight
        });
      }
      
      localStorage.setItem('cart', JSON.stringify(cartItems));
      navigate('/cart');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
          className="mb-4 flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          <ArrowLeft size={20} />
          Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={product?.image}
              alt={product?.name}
              className="w-full rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold my-4">{product?.name}</h1>
            <div className="mb-4">
              <span className="text-3xl font-bold text-red-500">
                Rp {product?.price.toLocaleString("id-ID")}
              </span>
            </div>
            <p className="text-gray-700 mb-6">{product?.description}</p>

            <div className="flex items-center mb-6">
              <span className="mr-4">Jumlah</span>
              <div className="flex items-center border rounded-md">
                <button onClick={decreaseQuantity} className="px-3 py-1">
                  -
                </button>
                <span className="px-4 py-1">{quantity}</span>
                <button onClick={increaseQuantity} className="px-3 py-1">
                  +
                </button>
              </div>
              <span className="ml-4 text-gray-500">Stok: 20</span>
            </div>

            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
              >
                Tambah ke Keranjang
              </button>
              <button className="bg-yellow-500 text-white py-3 rounded-lg w-full hover:bg-yellow-600">
                Beli Sekarang
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
