'use client';

import Link from 'next/link';
import { useContext } from 'react';
import { CartContext } from '@/context/CartContext';

export default function Navbar() {
  const { cart } = useContext(CartContext);

  return (
    <nav className="bg-white shadow p-4 flex justify-between items-center">
      <Link href="/">
        <h1 className="text-xl font-bold">Primyst Store</h1>
      </Link>
      <div className="flex gap-4 items-center">
        <Link href="/cart" className="relative">
          <span>Cart</span>
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-3 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
              {cart.length}
            </span>
          )}
        </Link>
        <Link href="/auth/login" className="bg-blue-600 text-white px-3 py-1 rounded">
          Login
        </Link>
      </div>
    </nav>
  );
}
