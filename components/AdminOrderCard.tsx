'use client';

import { useState } from 'react';

interface AdminOrderCardProps {
  order: {
    id: string;
    amount: number;
    status: 'pending' | 'paid' | 'cancelled';
    created_at: string;
  };
}

export default function AdminOrderCard({ order }: AdminOrderCardProps) {
  const [status, setStatus] = useState(order.status);
  const [loading, setLoading] = useState(false);

  const markAsPaid = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/orders/update/${order.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'paid' }),
      });
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setStatus('paid');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded mb-4 shadow-sm">
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Total:</strong> ₦{order.amount.toLocaleString()}</p>
      <p>
        <strong>Status:</strong>{' '}
        <span
          className={`font-bold ${
            status === 'paid'
              ? 'text-green-600'
              : status === 'pending'
              ? 'text-yellow-600'
              : 'text-red-600'
          }`}
        >
          {status}
        </span>
      </p>
      <p className="text-sm text-gray-500">
        Placed on {new Date(order.created_at).toLocaleString()}
      </p>

      {status !== 'paid' && (
        <button
          className="bg-green-600 text-white px-3 py-1 rounded mt-2"
          onClick={markAsPaid}
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Mark as Paid'}
        </button>
      )}
    </div>
  );
  }
