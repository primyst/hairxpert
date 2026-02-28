import { supabaseServer } from '@/lib/supabaseServer';
import Navbar from '@/components/Navbar';
import OrderCard from '@/components/OrderCard';

export default async function OrdersPage() {
  const { data: { user } } = await supabaseServer.auth.getUser();

  if (!user) return <p>You must be logged in to view your orders.</p>;

  const { data: orders } = await supabaseServer
    .from('orders')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div>
      <Navbar />
      <section className="max-w-3xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">Your Orders</h2>

        {orders?.length === 0 && <p>You have no orders yet.</p>}

        {orders?.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </section>
    </div>
  );
}
