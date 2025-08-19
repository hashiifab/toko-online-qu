interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  description: string;
}

const ProductCard = ({
  product,
  onClick,
}: {
  product: Product;
  onClick: (id: number) => void;
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
        <p className="text-xl font-bold text-blue-600">Rp {product?.price.toLocaleString("id-ID")}</p>
      </div>
    </div>
  );
};

export default ProductCard;
