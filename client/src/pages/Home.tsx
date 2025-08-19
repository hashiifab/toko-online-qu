import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
// import CartIcon from "../components/CartIcon";

import { mockProducts } from "../data/mockProducts";
import { ShoppingCart } from "lucide-react";

const Home = () => {
  const products = mockProducts;
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
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

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Our Products
          </h2>
          <p className="text-gray-600">explore</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <ProductCard
              key={item.id}
              product={item}
              onClick={() => navigate(`/product/${item.id}`)}
            />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;
