import { supabaseServer } from '@/lib/supabaseServer';
import Navbar from '@/components/Navbar';
import AdminOrderCard from '@/components/AdminOrderCard';

export default async function AdminOrdersPage() {
  const { data: { user } } = await supabaseServer.auth.getUser();

  if (!user) return <p>You must be logged in as admin.</p>;

  const { data: orders, error } = await supabaseServer
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return <p>Error fetching orders: {error.message}</p>;

  return (
    <div>
      <Navbar />
      <section className="max-w-4xl mx-auto p-4">
        <h2 className="text-2xl font-bold mb-4">All Orders (Admin)</h2>

        {orders?.length === 0 && <p>No orders yet.</p>}

        {orders?.map((order) => (
          <AdminOrderCard key={order.id} order={order} />
        ))}
      </section>
    </div>
  );
    }
