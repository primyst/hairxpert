'use client';

import { useContext, useState } from 'react';
import { CartContext } from '@/context/CartContext';

interface ProductDetailProps {
  product: {
    id: string;
    name: string;
    price: number;
    is_active?: boolean;
  };
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addToCart } = useContext(CartContext);
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="max-w-xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
      <p className="text-gray-700 mb-4">₦{product.price.toLocaleString()}</p>

      <div className="flex gap-2 mb-4">
        <input
          type="number"
          min={1}
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          className="border w-20 text-center rounded"
        />
        <button
          className="bg-blue-600 text-white px-4 rounded"
          onClick={() => addToCart(product, quantity)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
