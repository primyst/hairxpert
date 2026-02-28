'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminCreateProduct() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState<number>(0);

  const handleCreate = async () => {
    const res = await fetch('/api/products/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, price }),
    });

    if (res.ok) router.push('/admin/products');
    else alert('Failed to create product');
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <input
        className="border p-2 w-full mb-2"
        placeholder="Product name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <input
        className="border p-2 w-full mb-2"
        type="number"
        placeholder="Price"
        value={price}
        onChange={e => setPrice(Number(e.target.value))}
      />
      <button className="bg-green-600 text-white p-2 w-full" onClick={handleCreate}>
        Create
      </button>
    </div>
  );
}
