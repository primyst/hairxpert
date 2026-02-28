'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { CartContext } from '@/context/CartContext';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    is_active?: boolean;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useContext(CartContext);

  return (
    <div className="border rounded-lg p-4 shadow-sm hover:shadow-md transition">
      <Link href={`/products/${product.id}`}>
        <h3 className="text-lg font-semibold mb-2">{product.name}</h3>
      </Link>
      <p className="text-gray-700 mb-2">₦{product.price.toLocaleString()}</p>

      {product.is_active === false ? (
        <span className="text-red-500 font-bold text-sm">Inactive</span>
      ) : (
        <button
          className="bg-blue-600 text-white w-full py-2 rounded mt-2"
          onClick={() => addToCart(product)}
        >
          Add to Cart
        </button>
      )}
    </div>
  );
          }
