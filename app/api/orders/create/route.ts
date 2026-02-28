import { supabaseServer } from '@/lib/supabaseServer';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { user_id, cart, total } = await req.json();

    if (!cart || !cart.length) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 });
    }

    const { data: order, error } = await supabaseServer
      .from('orders')
      .insert([
        {
          user_id,
          amount: total,
          status: 'pending',
        },
      ])
      .select()
      .single();

    if (error || !order) {
      return NextResponse.json({ error: error?.message || 'Failed to create order' }, { status: 500 });
    }

    // Insert order items (optional if you have an order_items table)
    // await supabaseServer.from('order_items').insert(...)

    return NextResponse.json({ orderId: order.id });
  } catch (err) {
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 });
  }
}
