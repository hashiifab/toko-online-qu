import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Header from "../components/Header";
import OrderSummary from "../components/pages/checkout/OrderSummary";
import ShippingForm from "../components/pages/checkout/ShippingForm";
import CustomerInfoForm from "../components/pages/checkout/CustomerInfoForm";

// Data barang di keranjang
interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  weight: number;
  shippingOriginCode: string;
  shippingOriginName: string;
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
  originCode: string;
}

// Data grup pengiriman berdasarkan origin
interface ShippingGroup {
  originCode: string;
  originName: string;
  items: CartItem[];
  totalWeight: number;
  services: ShippingService[];
  selectedService?: ShippingService;
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

// Tipe untuk respons API produk
interface ProductResponse {
  id: string;
  name: string;
  price: number;
  image: string;
  weight: number;
  shippingOriginCode: string;
  shippingOriginName: string;
  userId: string;
}

// Tipe untuk respons API pembayaran
interface PaymentResponse {
  success: boolean;
  data: {
    invoice_url: string;
  };
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
  const [shippingGroups, setShippingGroups] = useState<ShippingGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Ambil data keranjang dari localStorage dan update dengan data terbaru dari API
  useEffect(() => {
    const loadCartItems = async () => {
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        const cartData = JSON.parse(savedCart as string);
        console.log("Raw cart data:", cartData);
        
        // Periksa apakah ada item yang tidak memiliki shippingOriginCode, shippingOriginName, atau weight yang tidak valid
        const itemsNeedingUpdate = cartData.filter((item: CartItem) => 
          !item.shippingOriginCode || !item.shippingOriginName || !item.weight || item.weight <= 0
        );
        
        if (itemsNeedingUpdate.length > 0) {
          console.log("Items needing update:", itemsNeedingUpdate);
          
          // Ambil data terbaru dari API untuk semua item yang perlu update
          const updatedItems = await Promise.all(
            cartData.map(async (item: CartItem) => {
              if (!item.shippingOriginCode || !item.shippingOriginName || !item.weight || item.weight <= 0) {
                try {
                  const response = await fetch(`/api/products/${item.id}`);
                  if (response.ok) {
                    const productData: ProductResponse = await response.json();
                    console.log(`Updated product data for ${item.name}:`, productData);
                    return {
                      ...item,
                      shippingOriginCode: productData.shippingOriginCode || "JKT",
                      shippingOriginName: productData.shippingOriginName || "Unknown City",
                      weight: productData.weight || 0.1
                    };
                  }
                } catch (error) {
                  console.error(`Failed to fetch product ${item.id}:`, error);
                }
              }
              return item;
            })
          );
          
          // Update localStorage dengan data terbaru
          localStorage.setItem("cart", JSON.stringify(updatedItems));
          setCartItems(updatedItems);
        } else {
          setCartItems(cartData);
        }
      } else {
        navigate("/cart");
      }
    };
    
    loadCartItems();
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

  // Kelompokkan item berdasarkan origin code
  const groupItemsByOrigin = (): ShippingGroup[] => {
    const groups: { [key: string]: ShippingGroup } = {};
    
    console.log("Cart items for grouping:", cartItems);
    
    cartItems.forEach(item => {
      const originCode = item.shippingOriginCode || "JKT";
      console.log(`Item ${item.name} has origin code: ${originCode}, name: ${item.shippingOriginName}, weight: ${item.weight}kg, quantity: ${item.quantity}`);
      
      if (!groups[originCode]) {
        groups[originCode] = {
          originCode,
          originName: item.shippingOriginName || "Unknown City",
          items: [],
          totalWeight: 0,
          services: []
        };
      }
      groups[originCode].items.push(item);
      
      const itemWeight = typeof item.weight === 'number' ? item.weight : 0;
      groups[originCode].totalWeight += item.quantity * itemWeight;
      
      console.log(`Added ${item.name} to group ${originCode}. Group total weight: ${groups[originCode].totalWeight}kg`);
    });
    
    console.log("Final grouped items:", groups);
    
    const validGroups = Object.values(groups).filter(group => {
      if (group.totalWeight <= 0) {
        console.warn(`Group ${group.originCode} has invalid weight: ${group.totalWeight}kg`);
        return false;
      }
      return true;
    });
    
    console.log("Valid groups after filtering:", validGroups);
    return validGroups;
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
    setShippingGroups([]);
    setShippingCost(0);
  };

  // Hitung ongkos kirim untuk semua grup origin
  const calculateShipping = async () => {
    setIsLoading(true);
    try {
      const groups = groupItemsByOrigin();
      console.log("Shipping groups:", groups);
      
      if (groups.length === 0) {
        throw new Error("Tidak ada produk untuk dihitung ongkirnya");
      }
      
      const updatedGroups: ShippingGroup[] = [];
      const failedOrigins: string[] = [];

      for (const group of groups) {
        try {
          const weightInKg = group.totalWeight;
          console.log(`Calculating shipping for origin ${group.originCode}, weight: ${weightInKg}kg`);
          
          const finalWeight = Math.max(weightInKg, 0.1);
          
          const payload = {
            origin_code: group.originCode,
            destination_code: shippingInfo.destinationId,
            weight: finalWeight,
          };
          
          console.log("Shipping payload:", payload);
          
          const response = await fetch("/api/shipping/cost", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          
          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Shipping API error for ${group.originCode}:`, errorText);
            failedOrigins.push(`${group.originCode} (${response.status})`);
            continue;
          }
          
          const data: ApiResponse = await response.json();
          console.log(`Shipping response for ${group.originCode}:`, data);
          
          if (!data.data || data.data.length === 0) {
            console.warn(`No shipping services available for origin ${group.originCode}`);
            failedOrigins.push(`${group.originCode} (no services)`);
            continue;
          }
          
          const services = data.data.flatMap((courier: ApiCourier) =>
            courier.costs.map((cost: ApiShippingCostItem) => ({
              code: courier.code,
              name: courier.name,
              service: cost.service,
              cost: cost.cost.value,
              etd: cost.cost.etd,
              originCode: group.originCode,
            }))
          );

          services.sort((a, b) => a.cost - b.cost);

          updatedGroups.push({
            ...group,
            services,
            selectedService: undefined
          });
        } catch (originError) {
          console.error(`Error calculating shipping for origin ${group.originCode}:`, originError);
          failedOrigins.push(`${group.originCode} (error)`);
        }
      }

      if (updatedGroups.length === 0) {
        throw new Error(`Gagal menghitung ongkir untuk semua origin: ${failedOrigins.join(", ")}`);
      }

      if (failedOrigins.length > 0) {
        console.warn(`Some origins failed: ${failedOrigins.join(", ")}`);
        alert(`Peringatan: Gagal menghitung ongkir untuk origin: ${failedOrigins.join(", ")}. Melanjutkan dengan origin yang berhasil.`);
      }

      setShippingGroups(updatedGroups);
      setShippingCost(0);
    } catch (error) {
      console.error("Error calculating shipping:", error);
      alert(`Gagal menghitung ongkos kirim: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle shipping service selection
  const handleShippingServiceSelect = (originCode: string, service: ShippingService) => {
    const updatedGroups = shippingGroups.map(group => {
      if (group.originCode === originCode) {
        return { ...group, selectedService: service };
      }
      return group;
    });
    
    setShippingGroups(updatedGroups);
    
    const totalCost = updatedGroups.reduce((total, group) => {
      return total + (group.selectedService?.cost || 0);
    }, 0);
    
    setShippingCost(totalCost);
  };

  // Check if all shipping services are selected
  const allShippingServicesSelected = () => {
    return shippingGroups.length > 0 && shippingGroups.every(group => group.selectedService);
  };

  // Delay pencarian kota
  useEffect(() => {
    const delayDebounce = setTimeout(() => searchLocations(searchQuery), 500);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Lanjut ke langkah berikutnya
  const handleNextStep = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (step === 2 && shippingGroups.length === 0) {
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
      
      const firstItem = cartItems[0];
      let sellerId: string | null = null;
      const productId = firstItem?.id;
      
      if (firstItem) {
        try {
          const productResponse = await fetch(`/api/products/${firstItem.id}`);
          if (productResponse.ok) {
            const productData: ProductResponse = await productResponse.json();
            sellerId = productData.userId;
          }
        } catch (error) {
          console.error('Error fetching product data:', error);
        }
      }
      
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: cartItems
            .map((item) => `${item.name} x${item.quantity}`)
            .join(", "),
          amount: totalAmount,
          qty: cartItems.reduce((total, item) => total + item.quantity, 0),
          productId: productId,
          sellerId: sellerId,
          buyerName: `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
          buyerEmail: customerInfo.email,
          buyerPhone: customerInfo.phone,
          shippingAddress: shippingInfo.address,
        }),
      });
      const data: PaymentResponse = await response.json();
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
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
            {step === 1 && (
              <CustomerInfoForm 
                customerInfo={customerInfo}
                handleCustomerInfoChange={handleCustomerInfoChange}
                handleNextStep={handleNextStep}
              />
            )}
            {step === 2 && (
              <ShippingForm
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                searchResults={searchResults}
                shippingInfo={shippingInfo}
                handleLocationSelect={handleLocationSelect}
                shippingGroups={shippingGroups}
                handleShippingServiceSelect={handleShippingServiceSelect}
                isLoading={isLoading}
                handlePrevStep={handlePrevStep}
                handleNextStep={handleNextStep}
                shippingCost={shippingCost}
                allShippingServicesSelected={allShippingServicesSelected}
              />
            )}
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
                  <OrderSummary 
                    cartItems={cartItems}
                    calculateTotal={calculateTotal}
                    shippingCost={shippingCost}
                  />
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
          <div className="lg:col-span-1">
            <OrderSummary 
              cartItems={cartItems}
              calculateTotal={calculateTotal}
              shippingCost={shippingCost}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;