'use client';

import ProductCard from './ProductCard';

interface ProductGridProps {
  products: {
    id: string;
    name: string;
    price: number;
    is_active?: boolean;
  }[];
}

export default function ProductGrid({ products }: ProductGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
