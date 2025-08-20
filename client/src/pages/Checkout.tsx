import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface ShippingInfo {
  address: string;
  city: string;
  postalCode: string;
  courier: string;
}

const Checkout = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<number>(1);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [shippingInfo, setShippingInfo] = useState<ShippingInfo>({
    address: '',
    city: '',
    postalCode: '',
    courier: 'JNE'
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    } else {
      navigate('/cart');
    }
  }, [navigate]);

  const courierOptions = [
    { id: 'JNE', name: 'JNE Regular', price: 0 },
    { id: 'JNT', name: 'J&T Express', price: 0 },
    { id: 'TIKI', name: 'TIKI', price: 0 },
    { id: 'POS', name: 'POS Indonesia', price: 0 }
  ];

  const handleCustomerInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomerInfo({
      ...customerInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleShippingInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setShippingInfo({
      ...shippingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleNextStep = () => {
    if (step === 1) {
      if (!customerInfo.firstName || !customerInfo.lastName || !customerInfo.email || !customerInfo.phone) {
        alert('Mohon lengkapi semua informasi pelanggan');
        return;
      }
    }
    if (step === 2) {
      if (!shippingInfo.address || !shippingInfo.city || !shippingInfo.postalCode) {
        alert('Mohon lengkapi semua informasi pengiriman');
        return;
      }
    }
    setStep(step + 1);
  };

  const handlePrevStep = () => setStep(step - 1);

  const handleSubmit = () => {
    localStorage.removeItem('cart');
    alert('Pesanan berhasil dibuat!');
    navigate('/');
  };

  const calculateTotal = () => cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  const calculateItemCount = () => cartItems.reduce((total, item) => total + item.quantity, 0);

  const CustomerInfoForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Informasi Pelanggan</h2>
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
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={customerInfo.email}
          onChange={handleCustomerInfoChange}
          className="w-full p-2 border rounded-md col-span-1 sm:col-span-2"
          required
        />
        <input
          type="tel"
          name="phone"
          placeholder="Nomor Telepon"
          value={customerInfo.phone}
          onChange={handleCustomerInfoChange}
          className="w-full p-2 border rounded-md col-span-1 sm:col-span-2"
          required
        />
      </div>
      <div className="mt-6 flex justify-end">
        <button
          onClick={handleNextStep}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Lanjut ke Alamat Pengiriman
        </button>
      </div>
    </div>
  );

  const ShippingForm = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Alamat Pengiriman</h2>
      <div className="space-y-4">
        <input
          type="text"
          name="address"
          placeholder="Alamat Lengkap"
          value={shippingInfo.address}
          onChange={handleShippingInfoChange}
          className="w-full p-2 border rounded-md"
          required
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="city"
            placeholder="Kota"
            value={shippingInfo.city}
            onChange={handleShippingInfoChange}
            className="w-full p-2 border rounded-md"
            required
          />
          <input
            type="text"
            name="postalCode"
            placeholder="Kode Pos"
            value={shippingInfo.postalCode}
            onChange={handleShippingInfoChange}
            className="w-full p-2 border rounded-md"
            required
          />
        </div>
        <select
          name="courier"
          value={shippingInfo.courier}
          onChange={handleShippingInfoChange}
          className="w-full p-2 border rounded-md"
        >
          {courierOptions.map(courier => (
            <option key={courier.id} value={courier.id}>
              {courier.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-6 flex justify-between">
        <button
          onClick={handlePrevStep}
          className="text-gray-600 px-6 py-2 rounded-md border hover:bg-gray-50"
        >
          Kembali
        </button>
        <button
          onClick={handleNextStep}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition"
        >
          Lanjut ke Konfirmasi
        </button>
      </div>
    </div>
  );

  const OrderSummary = () => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Ringkasan Pesanan</h2>
      <div className="space-y-4">
        {cartItems.map(item => (
          <div key={item.id} className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">{item.name}</h3>
              <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
            </div>
            <p className="font-medium">Rp {item.price.toLocaleString('id-ID')}</p>
          </div>
        ))}
        <div className="border-t pt-4">
          <div className="flex justify-between">
            <p>Subtotal ({calculateItemCount()} item)</p>
            <p className="font-medium">Rp {calculateTotal().toLocaleString('id-ID')}</p>
          </div>
          <div className="flex justify-between mt-2">
            <p>Ongkos Kirim</p>
            <p className="text-green-600 font-medium">Gratis</p>
          </div>
          <div className="flex justify-between mt-4 text-lg font-semibold">
            <p>Total</p>
            <p>Rp {calculateTotal().toLocaleString('id-ID')}</p>
          </div>
        </div>
      </div>
    </div>
  );

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
        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center">
            {[1, 2, 3].map(n => (
              <div key={n} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                    step >= n
                      ? 'border-blue-600 bg-blue-600 text-white'
                      : 'border-gray-300 text-gray-400'
                  }`}
                >
                  {n}
                </div>
                {n < 3 && (
                  <div
                    className={`w-12 h-0.5 ${
                      step >= n + 1 ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-6">
            {step === 1 && CustomerInfoForm()}
            {step === 2 && ShippingForm()}
            {step === 3 && (
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Pembayaran</h2>
                <p className="text-gray-600 mb-4">
                  Silakan konfirmasi pesanan Anda sebelum melanjutkan.
                </p>

                <div className="space-y-4 mb-6">
                  <div>
                    <h3 className="font-medium">Informasi Pelanggan</h3>
                    <p className="text-sm text-gray-600">
                      {customerInfo.firstName} {customerInfo.lastName}
                      <br />
                      {customerInfo.email}
                      <br />
                      {customerInfo.phone}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Alamat Pengiriman</h3>
                    <p className="text-sm text-gray-600">
                      {shippingInfo.address}
                      <br />
                      {shippingInfo.city}, {shippingInfo.postalCode}
                      <br />
                      Kurir: {shippingInfo.courier}
                    </p>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    onClick={handlePrevStep}
                    className="text-gray-600 px-6 py-2 rounded-md border hover:bg-gray-50"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition"
                  >
                    Buat Pesanan
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
