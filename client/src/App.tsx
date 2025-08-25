import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ProductDetail from "./pages/ProductDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import AuthPage from "./pages/auth/AuthPage";
import Seller from "./pages/Seller"; // Import Seller component
import HomePage from "./pages/HomePage";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/checkout" element={<Checkout />} />
      <Route path="/auth/:pathname?" element={<AuthPage />} />
      <Route path="/seller" element={<Seller />} /> {/* Add route for Seller page */}
      <Route path="/homepage" element={<HomePage />} />
    </Routes>
  );
}

export default App;
