import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import Header from "../components/Header";

interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  weight: number;
  volume: number;
  length: number;
  width: number;
  height: number;
  shippingOriginCode: string;
  userId: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  weight: number;
  shippingOriginCode: string;
}

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:3000/api/products/${id}`);
        if (response.ok) {
          const data = await response.json();
          setProduct(data);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProduct();
  }, [id]);

  const increaseQuantity = () => {
    setQuantity((q) => q + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((q) => Math.max(1, q - 1));
  };

  const handleAddToCart = () => {
    if (product) {
      const existingCart = localStorage.getItem("cart");
      const cartItems: CartItem[] = existingCart
        ? JSON.parse(existingCart)
        : [];

      const existingItem = cartItems.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        cartItems.push({
          id: product.id,
          name: product.name,
          price: product.price,
          image: product.image,
          quantity,
          weight: product.weight,
          shippingOriginCode: product.shippingOriginCode,
        });
      }

      localStorage.setItem("cart", JSON.stringify(cartItems));
      navigate("/cart");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto p-4">
          <p className="text-center py-8">Loading product...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto p-4">
          <p className="text-center py-8">Product not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
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
              src={product.image}
              alt={product.name}
              className="w-full rounded-lg"
            />
          </div>
          <div>
            <h1 className="text-4xl font-bold my-4">{product.name}</h1>
            <div className="mb-4">
              <span className="text-3xl font-bold text-red-500">
                Rp {product.price.toLocaleString("id-ID")}
              </span>
            </div>
            <p className="text-gray-700 mb-6">{product.description}</p>

            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <strong>Seller:</strong> {product.user.name} ({product.user.email})
              </p>
              <p className="text-sm text-gray-600">
                <strong>Weight:</strong> {product.weight} kg
              </p>
              <p className="text-sm text-gray-600">
                <strong>Dimensions:</strong> {product.length} × {product.width} × {product.height} cm
              </p>
              <p className="text-sm text-gray-600">
                <strong>Volume:</strong> {product.volume} L
              </p>
            </div>

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
