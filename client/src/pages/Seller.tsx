import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authClient } from "../lib/auth-client";
import { Plus, Package, ShoppingBag } from "lucide-react";
import Header from "../components/Header";
import ProductList from "../components/pages/seller/ProductList";
import OrderList from "../components/pages/seller/OrderList";

interface ShippingOrigin {
  id: string;
  code: string;
  name: string;
  fullName: string;
}

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
  userId: string;
  shippingOriginId: string;
  shippingOriginName: string;
  shippingOrigin?: ShippingOrigin;
}

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

const Seller = () => {
  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    image: "",
    description: "",
    weight: "",
    length: "",
    width: "",
    height: "",
  });
  const [shippingOrigins, setShippingOrigins] = useState<ShippingOrigin[]>([]);
  const [sellerLocation, setSellerLocation] = useState<ShippingOrigin>({
    id: "",
    code: "",
    name: "",
    fullName: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const navigate = useNavigate();
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session?.user) {
      navigate("/");
    }
  }, [session, isPending, navigate]);

  useEffect(() => {
    if (session?.user) {
      fetchProducts();
      fetchSellerShippingOrigin();
      if (activeTab === "orders") {
        fetchOrders();
      }
    }
  }, [session, activeTab]);

  const fetchSellerShippingOrigin = async () => {
    const response = await fetch(
      "http://localhost:3000/api/user/shipping-origin",
      {
        credentials: "include",
      }
    );
    if (response.ok) {
      const data = await response.json();
      if (data.shippingOriginId && data.shippingOriginName) {
        setSellerLocation({
          id: data.shippingOriginId,
          code: "",
          name: data.shippingOriginName,
          fullName: data.shippingOriginName,
        });
        setSearchQuery(data.shippingOriginName);
      }
    }
  };

  useEffect(() => {
    if (!searchQuery.trim() || searchQuery === sellerLocation.fullName) {
      setShippingOrigins([]);
      return;
    }
    const timer = setTimeout(() => {
      fetchShippingOrigins(searchQuery);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, sellerLocation.fullName]);

  const fetchShippingOrigins = async (query: string = "") => {
    setIsSearching(true);
    if (query.length < 3) {
      setShippingOrigins([]);
      setIsSearching(false);
      return;
    }
    const response = await fetch(
      `http://localhost:3000/api/destination/search?q=${encodeURIComponent(query)}`
    );
    const data = await response.json();
    setShippingOrigins(data.data || []);
    setIsSearching(false);
  };

  const fetchProducts = async () => {
    const response = await fetch("/api/my-products", {
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      setProducts(data);
    }
    setLoading(false);
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    const response = await fetch("/api/seller/orders", {
      credentials: "include",
    });
    if (response.ok) {
      const data = await response.json();
      setOrders(data);
    }
    setOrdersLoading(false);
  };

  const updateSellerShippingOrigin = async () => {
    if (!sellerLocation.id) {
      alert("Please select a shipping location");
      return;
    }
    await fetch("http://localhost:3000/api/user/shipping-origin", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        shippingOriginId: sellerLocation.id,
        shippingOriginName: sellerLocation.fullName || sellerLocation.name,
        shippingOriginCode: sellerLocation.code,
      }),
    });
    alert("Lokasi pengiriman berhasil disimpan!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!session?.user?.id) {
      alert("Please login first");
      return;
    }
    if (!sellerLocation.id) {
      alert("Please set your shipping location first");
      return;
    }

    const length = parseFloat(formData.length);
    const width = parseFloat(formData.width);
    const height = parseFloat(formData.height);
    const volume = length * width * height;

    const productData = {
      name: formData.name,
      price: parseFloat(formData.price),
      image: formData.image,
      description: formData.description,
      weight: parseFloat(formData.weight),
      volume,
      length,
      width,
      height,
    };

    const url = editingProduct
      ? `/api/products/${editingProduct.id}`
      : "/api/products";
    const method = editingProduct ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(productData),
    });

    if (response.ok) {
      setShowForm(false);
      setEditingProduct(null);
      setFormData({
        name: "",
        price: "",
        image: "",
        description: "",
        weight: "",
        length: "",
        width: "",
        height: "",
      });
      setSearchQuery("");
      setShippingOrigins([]);
      fetchProducts();
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: product.price.toString(),
      image: product.image,
      description: product.description,
      weight: product.weight.toString(),
      length: product.length.toString(),
      width: product.width.toString(),
      height: product.height.toString(),
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) fetchProducts();
    }
  };

  if (isPending) {
    return (
      <div className="flex items-center justify-center h-screen">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={session?.user} />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h3 className="text-lg font-semibold mb-4">Seller Settings</h3>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Shipping Origin
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search your city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 text-sm"
                />
                {(isSearching ||
                  (searchQuery.length >= 3 &&
                    searchQuery !== sellerLocation.fullName)) && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
                    {isSearching ? (
                      <div className="p-3 text-sm text-gray-500">
                        Loading...
                      </div>
                    ) : shippingOrigins.length > 0 ? (
                      shippingOrigins.map((origin) => (
                        <div
                          key={origin.id}
                          className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                          onClick={() => {
                            setSellerLocation(origin);
                            setSearchQuery(origin.fullName);
                            setShippingOrigins([]);
                          }}
                        >
                          <div className="font-medium text-sm">
                            {origin.name}
                          </div>
                          <div className="text-xs text-gray-500">
                            {origin.fullName}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-3 text-sm text-gray-500">
                        No locations found
                      </div>
                    )}
                  </div>
                )}
              </div>
              {sellerLocation.id && (
                <div className="mt-2 flex items-center gap-2">
                  <p className="text-sm text-gray-600">
                    Current shipping location:{" "}
                    <span className="font-medium">
                      {sellerLocation.fullName}
                    </span>
                  </p>
                  <button
                    onClick={updateSellerShippingOrigin}
                    className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    Save Location
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab("products")}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "products"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <Package size={20} />
                  My Products
                </button>
                <button
                  onClick={() => setActiveTab("orders")}
                  className={`flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === "orders"
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                  }`}
                >
                  <ShoppingBag size={20} />
                  Order List
                </button>
              </nav>
            </div>
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                {activeTab === "products" ? "My Products" : "Order List"}
              </h2>
              <p className="text-gray-600">
                {activeTab === "products"
                  ? "Manage your product listings"
                  : "View and manage your orders"}
              </p>
            </div>
            {activeTab === "products" && (
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setShowForm(true);
                    setEditingProduct(null);
                    setFormData({
                      name: "",
                      price: "",
                      image: "",
                      description: "",
                      weight: "",
                      length: "",
                      width: "",
                      height: "",
                    });
                  }}
                  disabled={!sellerLocation.id}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                    sellerLocation.id
                      ? "bg-blue-600 text-white hover:bg-blue-700"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Plus size={20} />
                  Add New Product
                </button>
              </div>
            )}
          </div>
        </div>

        {showForm && (
          <div className="mb-8 bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-4">
              {editingProduct ? "Edit Product" : "Add New Product"}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price (Rp)
                </label>
                <div className="mt-1 relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-gray-500 sm:text-sm">Rp</span>
                  </div>
                  <input
                    type="number"
                    step="100"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    className="block w-full pl-12 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) =>
                    setFormData({ ...formData, image: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Weight (kg)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.weight}
                  onChange={(e) =>
                    setFormData({ ...formData, weight: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Dimensions (cm)
                </label>
                <div className="grid grid-cols-3 gap-2 mt-1">
                  <div>
                    <label className="block text-xs text-gray-500">
                      Length
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0"
                      value={formData.length}
                      onChange={(e) =>
                        setFormData({ ...formData, length: e.target.value })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">Width</label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0"
                      value={formData.width}
                      onChange={(e) =>
                        setFormData({ ...formData, width: e.target.value })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500">
                      Height
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      placeholder="0"
                      value={formData.height}
                      onChange={(e) =>
                        setFormData({ ...formData, height: e.target.value })
                      }
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingProduct ? "Update Product" : "Add Product"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingProduct(null);
                  }}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {activeTab === "products" ? (
          <>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading your products...</p>
              </div>
            ) : (
              <ProductList
                products={products}
                sellerLocationName={sellerLocation.name}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )}

            {!loading && products.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">
                  No products yet. Add your first product!
                </p>
              </div>
            )}
          </>
        ) : (
          <>
            {ordersLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading your orders...</p>
              </div>
            ) : (
              <OrderList orders={orders} />
            )}

            {!ordersLoading && orders.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No paid orders yet.</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default Seller;
