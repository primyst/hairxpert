'use client';

import { useContext } from 'react';
import { CartContext } from '@/context/CartContext';

interface CartItemProps {
  item: {
    id: string;
    name: string;
    price: number;
    quantity: number;
  };
}

export default function CartItem({ item }: CartItemProps) {
  const { updateQuantity, removeFromCart } = useContext(CartContext);

  return (
    <div className="flex justify-between items-center border-b py-2">
      <div>
        <p className="font-semibold">{item.name}</p>
        <p className="text-gray-700">₦{item.price.toLocaleString()}</p>
      </div>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min={1}
          value={item.quantity}
          onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
          className="border w-16 text-center p-1 rounded"
        />
        <button
          onClick={() => removeFromCart(item.id)}
          className="text-red-500 font-bold hover:text-red-700"
        >
          Remove
        </button>
      </div>
    </div>
  );
}
