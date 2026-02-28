import { supabaseServer } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Optional: Verify Paystack signature from headers
    // const signature = req.headers.get('x-paystack-signature');
    // TODO: verify signature using your Paystack secret key

    const event = body.event;
    const data = body.data;

    if (event === 'charge.success' && data.status === 'success') {
      const orderId = data.reference; // this should match the order_id you sent during checkout

      // Update order status to 'paid'
      const { error } = await supabaseServer
        .from('orders')
        .update({ status: 'paid' })
        .eq('id', orderId);

      if (error) {
        console.error('Failed to update order status:', error);
        return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
      }

      console.log(`Order ${orderId} marked as paid.`);
      return NextResponse.json({ status: 'success' });
    }

    // Other events can be handled here (optional)
    return NextResponse.json({ status: 'ignored' });
  } catch (err: any) {
    console.error('Webhook error:', err);
    return NextResponse.json({ status: 'error', message: err.message }, { status: 500 });
  }
}
