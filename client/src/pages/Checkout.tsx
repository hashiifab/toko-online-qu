import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, ArrowLeft } from "lucide-react";
import { shippingOrigin } from "../data/mockProducts";

// Data barang di keranjang
interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  weight: number;
}

// Data pelanggan
interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

// Data pengiriman
interface ShippingInfo {
  address: string;
  courier: string;
  destinationId: string;
  destinationName: string;
}

// Data lokasi dari API
interface Location {
  id: string;
  code: string;
  name: string;
  fullName: string;
}

// Data layanan pengiriman
interface ShippingService {
  code: string;
  name: string;
  service: string;
  cost: number;
  etd: string;
}

// Tipe untuk respons API ongkos kirim
interface ApiShippingCost {
  value: number;
  etd: string;
}

interface ApiShippingCostItem {
  service: string;
  cost: ApiShippingCost;
}

interface ApiCourier {
  code: string;
  name: string;
  costs: ApiShippingCostItem[];
}

interface ApiResponse {
  data: ApiCourier[];
}

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
  });
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    address: "",
    courier: "",
    destinationId: "",
    destinationName: "",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingServices, setShippingServices] = useState<ShippingService[]>(
    []
  );
  const [selectedService, setSelectedService] =
    useState<ShippingService | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Ambil data keranjang dari localStorage
  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      setCartItems(JSON.parse(savedCart as string));
    } else {
      navigate("/cart");
    }
  }, [navigate]);

  // Update data pelanggan
  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo({ ...customerInfo, [e.target.name]: e.target.value });
  };

  // Cari kota tujuan
  const searchLocations = async (query: string) => {
    if (query.length < 3) {
      setSearchResults([]);
      return;
    }
    try {
      const response = await fetch(
        `/api/destination/search?q=${encodeURIComponent(query)}`
      );
      const data = await response.json();
      setSearchResults(data.data);
    } catch (error) {
      console.error("Error searching locations:", error);
      alert("Gagal mencari kota. Silakan coba lagi.");
    }
  };

  // Pilih kota
  const handleLocationSelect = (location: Location) => {
    setShippingInfo({
      ...shippingInfo,
      destinationId: location.code,
      destinationName: location.fullName,
      address: location.fullName,
      courier: "",
    });
    setSearchResults([]);
    setSearchQuery(location.fullName);
    setShippingServices([]);
    setShippingCost(0);
    setSelectedService(null);
  };

  // Hitung ongkos kirim
  const calculateShipping = async () => {
    setIsLoading(true); // Mulai loading
    try {
      const weight =
        cartItems.reduce(
          (total, item) => total + item.quantity * item.weight,
          0
        ) / 1000;
      const response = await fetch("/api/shipping/cost", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin_code: shippingOrigin.code,
          destination_code: shippingInfo.destinationId,
          weight,
          courier: shippingInfo.courier.toLowerCase() || undefined,
        }),
      });
      const data: ApiResponse = await response.json();
      const services = data.data.flatMap((courier: ApiCourier) =>
        courier.costs.map((cost: ApiShippingCostItem) => ({
          code: courier.code,
          name: courier.name,
          service: cost.service,
          cost: cost.cost.value,
          etd: cost.cost.etd,
        }))
      );
      setShippingServices(services);
      if (services.length > 0) {
        setSelectedService(services[0]);
        setShippingCost(services[0].cost);
      }
    } catch (error) {
      console.error("Error calculating shipping:", error);
      alert("Gagal menghitung ongkos kirim. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Delay pencarian kota
  useEffect(() => {
    const delayDebounce = setTimeout(() => searchLocations(searchQuery), 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Lanjut ke langkah berikutnya
  const handleNextStep = async (e?: React.FormEvent) => {
    if (e) e.preventDefault(); // Mencegah reload halaman saat submit form
    if (step === 2 && shippingServices.length === 0) {
      await calculateShipping();
      return;
    }
    setStep(step + 1);
  };

  // Kembali ke langkah sebelumnya
  const handlePrevStep = () => setStep(step - 1);

  // Proses pembayaran
  const handleSubmit = async () => {
    try {
      const totalAmount = calculateTotal();
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: cartItems
            .map((item) => `${item.name} x${item.quantity}`)
            .join(", "),
          amount: totalAmount,
          qty: cartItems.reduce((total, item) => total + item.quantity, 0),
        }),
      });
      const data = await response.json();
      if (data.success && data.data.invoice_url) {
        localStorage.removeItem("cart");
        window.location.href = data.data.invoice_url;
      } else {
        alert("Gagal membuat pembayaran. Silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      alert("Terjadi kesalahan saat membuat pembayaran.");
    }
  };

  // Hitung total harga
  const calculateTotal = () => {
    const subtotal = cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
    return subtotal + shippingCost;
  };

  // Formulir informasi pelanggan
  const CustomerInfoForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Informasi Pelanggan</h2>
      <form onSubmit={handleNextStep}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="Nama Depan"
            value={customerInfo.firstName}
            onChange={handleCustomerInfoChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="lastName"
            placeholder="Nama Belakang"
            value={customerInfo.lastName}
            onChange={handleCustomerInfoChange}
            className="w-full p-2 border rounded-md"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={customerInfo.email}
            onChange={handleCustomerInfoChange}
            className="w-full p-2 border rounded-md col-span-2"
            required
          />
          <input
            type="tel"
            name="phone"
            placeholder="Nomor Telepon"
            value={customerInfo.phone}
            onChange={handleCustomerInfoChange}
            className="w-full p-2 border rounded-md col-span-2"
            required
          />
        </div>
        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
          >
            Lanjut ke Alamat Pengiriman
          </button>
        </div>
      </form>
    </div>
  );

  // Formulir pengiriman
  const ShippingForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Alamat Pengiriman</h2>
      <div className="space-y-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Cari kota tujuan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border rounded-md"
          />
          {searchResults.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-white border rounded-md shadow-lg z-10 max-h-48 overflow-y-auto">
              {searchResults.map((location) => (
                <div
                  key={location.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  onClick={() => handleLocationSelect(location)}
                >
                  <div className="font-medium text-sm">{location.name}</div>
                  <div className="text-xs text-gray-500">
                    {location.fullName}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        {shippingServices.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Pilih Layanan Kurir</h3>
            <select
              value={
                selectedService
                  ? `${selectedService.code}|${selectedService.service}`
                  : ""
              }
              onChange={(e) => {
                const [code, service] = e.target.value.split("|");
                const selected = shippingServices.find(
                  (s) => s.code === code && s.service === service
                );
                if (selected) {
                  setSelectedService(selected);
                  setShippingCost(selected.cost);
                  setShippingInfo((prev) => ({
                    ...prev,
                    courier: selected.code,
                  }));
                } else {
                  setSelectedService(null);
                }
              }}
              className="w-full p-2 border rounded-md"
            >
              <option value="">Pilih Layanan</option>
              {shippingServices.map((service) => (
                <option
                  key={`${service.code}|${service.service}`}
                  value={`${service.code}|${service.service}`}
                >
                  {service.name} {service.service} - Rp{" "}
                  {service.cost.toLocaleString("id-ID")} ({service.etd} hari)
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div className="mt-6 flex justify-between">
        <button
          onClick={handlePrevStep}
          className="text-gray-600 px-6 py-2 rounded-md border hover:bg-gray-50"
          disabled={isLoading}
        >
          Kembali
        </button>
        <button
          onClick={handleNextStep}
          className={`bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 ${
            isLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={
            !shippingInfo.destinationId ||
            (shippingServices.length > 0 && !selectedService) ||
            isLoading
          }
        >
          {isLoading
            ? "loading..."
            : shippingServices.length > 0 && selectedService
            ? "Lanjut ke Konfirmasi"
            : "Cek Ongkir"}
        </button>
      </div>
    </div>
  );

  // Ringkasan pesanan
  const OrderSummary = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
      <div className="space-y-4">
        {cartItems.map((item) => (
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

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm mb-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Toko Online Qu</h1>
          <button
            onClick={() => navigate("/cart")}
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
          <ArrowLeft size={20} /> Back
        </button>
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            {[1, 2, 3].map((n) => (
              <div key={n} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step >= n
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-gray-300 text-gray-400"
                  }`}
                >
                  {n}
                </div>
                {n < 3 && (
                  <div
                    className={`w-12 h-0.5 ${
                      step >= n + 1 ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && CustomerInfoForm()}
            {step === 2 && ShippingForm()}
            {step === 3 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Pembayaran</h2>
                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="font-medium">Informasi Pelanggan</h3>
                    <p className="text-sm text-gray-600">
                      {customerInfo.firstName} {customerInfo.lastName} -{" "}
                      {customerInfo.email} - {customerInfo.phone}
                    </p>
                  </div>
                  <OrderSummary />
                </div>
                <div className="flex justify-between">
                  <button
                    onClick={handlePrevStep}
                    className="text-gray-600 px-6 py-2 rounded-md border hover:bg-gray-50"
                    disabled={isLoading}
                  >
                    Kembali
                  </button>
                  <button
                    onClick={async () => {
                      setIsLoading(true);
                      try {
                        await handleSubmit();
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                    className={`bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 ${
                      isLoading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? "loading..." : "Buat Pesanan"}
                  </button>
                </div>
              </div>
            )}
          </div>
          <div className="lg:col-span-1">{OrderSummary()}</div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
