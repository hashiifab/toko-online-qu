interface CustomerInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

interface CustomerInfoFormProps {
  customerInfo: CustomerInfo;
  handleCustomerInfoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNextStep: (e?: React.FormEvent) => void;
}

const CustomerInfoForm = ({ customerInfo, handleCustomerInfoChange, handleNextStep }: CustomerInfoFormProps) => (
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

export default CustomerInfoForm;