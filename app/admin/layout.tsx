import { supabaseServer } from '@/lib/supabaseServer';
import { redirect } from 'next/navigation';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await supabaseServer.auth.getUser(); // decode session cookie or token
  const { data: profile } = await supabaseServer
    .from('profiles')
    .select('role')
    .eq('id', user.data.user?.id)
    .single();

  if (!profile || profile.role !== 'admin') redirect('/');

  return <div className="flex">{children}</div>;
}
