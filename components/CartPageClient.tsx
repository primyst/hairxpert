'use client';

import { useContext, useState } from 'react';
import { CartContext } from '@/context/CartContext';
import CartItem from './CartItem';
import Navbar from './Navbar';

interface CartPageClientProps {
  user: {
    id: string;
    email: string;
  } | null;
}

export default function CartPageClient({ user }: CartPageClientProps) {
  const { cart, total, clearCart } = useContext(CartContext);
  const [loading, setLoading] = useState(false);

  const handleCheckout = async () => {
    if (!user) {
      alert('You must be logged in to checkout');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id, cart, total }),
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error);

      // Redirect to Paystack payment URL returned from backend
      window.location.href = data.checkoutUrl;
    } catch (err: any) {
      alert(err.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <Navbar />
      <section className="max-w-2xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Your Cart</h2>

        {cart.length === 0 && <p>Your cart is empty</p>}

        {cart.map((item) => (
          <CartItem key={item.id} item={item} />
        ))}

        {cart.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between mt-4 font-bold gap-2">
            <p>Total: ₦{total.toLocaleString()}</p>
            <div className="flex gap-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded"
                onClick={clearCart}
              >
                Clear Cart
              </button>
              <button
                className="bg-green-600 text-white px-4 py-2 rounded"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? 'Processing...' : 'Checkout'}
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
