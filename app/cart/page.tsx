import { supabaseServer } from '@/lib/supabaseServer';
import CartPageClient from '@/components/CartPageClient';

export default async function CartPage() {
  // Get current user session server-side
  const { data: { user } } = await supabaseServer.auth.getUser();

  return <CartPageClient user={user} />;
}
