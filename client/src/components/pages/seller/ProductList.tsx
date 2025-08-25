import { Edit, Trash2 } from "lucide-react";

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

type Props = {
  products: Product[];
  sellerLocationName: string;
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
};

export default function ProductList({
  products,
  onEdit,
  onDelete,
}: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <div key={product.id} className="bg-white rounded-lg shadow p-4">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-48 object-cover rounded-md mb-4"
          />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
          <p className="text-gray-600 text-sm mb-2">{product.description}</p>
          <p className="text-xl font-bold text-blue-600 mb-2">
            Rp {product.price.toLocaleString("id-ID")}
          </p>
          <p className="text-sm text-gray-500">
            Weight: {product.weight}kg | Dimensions: {product.length}×{product.width}×{product.height}cm
          </p>
          
          <div className="mt-4 flex gap-2">
            <button
              onClick={() => onEdit(product)}
              className="flex items-center gap-2 px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
              <Edit size={16} />
              Edit
            </button>
            <button
              onClick={() => onDelete(product.id)}
              className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
            >
              <Trash2 size={16} />
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
