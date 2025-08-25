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
  user: {
    id: string;
    email: string;
    name: string;
  };
}

const ProductCard = ({
  product,
  onClick,
}: {
  product: Product;
  onClick: (id: string) => void;
}) => {
  return (
    <div
      className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick(product.id)}
    >
      <div className="aspect-square overflow-hidden rounded-t-lg">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{product.description}</p>
        <p className="text-xl font-bold text-blue-600 mb-1">Rp {product.price.toLocaleString("id-ID")}</p>
        <p className="text-xs text-gray-500">Penjual: {product.user.name}</p>
      </div>
    </div>
  );
};

export default ProductCard;
