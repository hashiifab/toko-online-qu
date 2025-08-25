import { useNavigate, useLocation } from "react-router-dom";
import { ShoppingCart, Home } from "lucide-react";
import { authClient } from "../lib/auth-client";

const Header = ({
  isAuthPage,
  user,
}: {
  isAuthPage?: boolean;
  user?: { id: string; email: string; name?: string } | null;
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await authClient.signOut();
      console.log("User logged out");
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // true kalau kita lagi di halaman seller
  const isSellerPage = location.pathname.startsWith("/seller");

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Toko Online Qu</h1>
        <div className="flex items-center space-x-4">
          {user ? (
            <>
              <button
                onClick={() => navigate("/")}
                className="p-2 hover:bg-gray-100 rounded-full"
                title="Home"
              >
                <Home size={24} />
              </button>
              {/* Cart cuma muncul kalau bukan di seller page */}
              {!isSellerPage && (
                <button
                  onClick={() => navigate("/cart")}
                  className="p-2 hover:bg-gray-100 rounded-full"
                  title="Cart"
                >
                  <ShoppingCart size={24} />
                </button>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* Cart juga disembunyiin kalau di seller page */}
              {!isSellerPage && (
                <button
                  onClick={() => navigate("/cart")}
                  className="p-2 hover:bg-gray-100 rounded-full"
                >
                  <ShoppingCart size={24} />
                </button>
              )}
              {!isAuthPage && (
                <button
                  onClick={() => navigate("/auth/")}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Become a Seller
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
