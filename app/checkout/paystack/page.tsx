'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';

export default function PaystackCheckoutPage() {
  const params = useSearchParams();
  const order_id = params.get('order_id');

  useEffect(() => {
    if (!order_id) return;

    // Replace with your Paystack payment link API call
    const paystackUrl = `https://checkout.paystack.com/YOUR_PUBLIC_KEY?reference=${order_id}&amount=...`;
    window.location.href = paystackUrl;
  }, [order_id]);

  return <p>Redirecting to Paystack...</p>;
}
