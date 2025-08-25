interface Location {
  id: string;
  code: string;
  name: string;
  fullName: string;
}

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

interface ShippingService {
  code: string;
  name: string;
  service: string;
  cost: number;
  etd: string;
  originCode: string;
}

interface ShippingGroup {
  originCode: string;
  originName: string;
  items: CartItem[];
  totalWeight: number;
  services: ShippingService[];
  selectedService?: ShippingService;
}

interface ShippingInfo {
  address: string;
  courier: string;
  destinationId: string;
  destinationName: string;
}

interface ShippingFormProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  searchResults: Location[];
  shippingInfo: ShippingInfo;
  handleLocationSelect: (location: Location) => void;
  shippingGroups: ShippingGroup[];
  handleShippingServiceSelect: (originCode: string, service: ShippingService) => void;
  isLoading: boolean;
  handlePrevStep: () => void;
  handleNextStep: (e?: React.FormEvent) => void;
  shippingCost: number;
  allShippingServicesSelected: () => boolean;
}

const ShippingForm = ({
  searchQuery,
  setSearchQuery,
  searchResults,
  shippingInfo,
  handleLocationSelect,
  shippingGroups,
  handleShippingServiceSelect,
  isLoading,
  handlePrevStep,
  handleNextStep,
  shippingCost,
  allShippingServicesSelected,
}: ShippingFormProps) => {
  // Format angka berat biar lebih bersih
  const formatWeight = (weight: number) => {
  return parseFloat(weight.toFixed(2)).toString();
};


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Alamat Pengiriman</h2>
      <div className="space-y-4">
        {/* Input pencarian lokasi */}
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
              {searchResults.map((location: Location) => (
                <div
                  key={location.id}
                  className="p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                  onClick={() => handleLocationSelect(location)}
                >
                  <div className="font-medium text-sm">{location.name}</div>
                  <div className="text-xs text-gray-500">{location.fullName}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Detail pengiriman */}
        {shippingGroups.length > 0 && (
          <div className="border-t pt-4">
            <h3 className="text-lg font-semibold mb-2">Detail Pengiriman</h3>
            <div className="space-y-4">
              {shippingGroups.map((group: ShippingGroup, index: number) => (
                <div key={group.originCode} className="border rounded-md p-3 bg-gray-50">
                  <h4 className="font-medium text-sm mb-2">
                    Pengiriman {index + 1} - Dikirim dari {group.originName || "Kota Tidak Diketahui"}
                  </h4>
                  <div className="text-xs text-gray-600 mb-2">
                    Items: {group.items.map((item: CartItem) => item.name).join(", ")}
                  </div>
                  <div className="text-xs text-gray-600 mb-2">
                    Total Berat: {formatWeight(group.totalWeight)} kg
                  </div>

                  {/* Pilihan jasa ekspedisi */}
                  {group.services.length > 0 && (
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Pilih Layanan Pengiriman:
                      </label>
                      <select
                        value={group.selectedService ? `${group.selectedService.code}-${group.selectedService.service}` : ""}
                        onChange={(e) => {
                          if (e.target.value) {
                            const [code, service] = e.target.value.split("-");
                            const selectedService = group.services.find(
                              (s: ShippingService) => s.code === code && s.service === service
                            );
                            if (selectedService) handleShippingServiceSelect(group.originCode, selectedService);
                          }
                        }}
                        className="w-full p-2 border rounded-md text-sm"
                        required
                      >
                        <option value="">-- Pilih Layanan Pengiriman --</option>
                        {group.services.map((service: ShippingService, idx: number) => (
                          <option key={idx} value={`${service.code}-${service.service}`}>
                            {service.name} {service.service} - Rp {service.cost.toLocaleString("id-ID")} ({service.etd} hari)
                          </option>
                        ))}
                      </select>
                      {group.selectedService && (
                        <div className="text-sm text-green-600 font-medium">
                          ✓ Dipilih: {group.selectedService.name} {group.selectedService.service} - Rp{" "}
                          {group.selectedService.cost.toLocaleString("id-ID")} ({group.selectedService.etd} hari)
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Total ongkir */}
            <div className="mt-4 p-3 bg-blue-50 rounded-md">
              <div className="font-medium text-blue-800">
                Total Ongkos Kirim: Rp {shippingCost.toLocaleString("id-ID")}
              </div>
              <div className="text-sm text-blue-600">
                {allShippingServicesSelected()
                  ? "✓ Layanan pengiriman telah dipilih"
                  : "Silakan pilih layanan pengiriman untuk semua kota asal"}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tombol navigasi */}
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
            isLoading ||
            (shippingGroups.length > 0 && !allShippingServicesSelected())
          }
        >
          {isLoading ? "loading..." : shippingGroups.length > 0 ? "Lanjut ke Konfirmasi" : "Cek Ongkir"}
        </button>
      </div>
    </div>
  );
};

export default ShippingForm;
