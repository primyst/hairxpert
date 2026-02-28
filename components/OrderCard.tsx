'use client';

interface OrderCardProps {
  order: {
    id: string;
    amount: number;
    status: 'pending' | 'paid' | 'cancelled';
    created_at: string;
  };
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <div className="border p-4 rounded mb-4 shadow-sm">
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Total:</strong> ₦{order.amount.toLocaleString()}</p>
      <p>
        <strong>Status:</strong>{' '}
        <span
          className={`font-bold ${
            order.status === 'paid'
              ? 'text-green-600'
              : order.status === 'pending'
              ? 'text-yellow-600'
              : 'text-red-600'
          }`}
        >
          {order.status}
        </span>
      </p>
      <p className="text-sm text-gray-500">
        Placed on {new Date(order.created_at).toLocaleString()}
      </p>
    </div>
  );
}
