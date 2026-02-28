import { supabaseServer } from '@/lib/supabaseServer';
import ProductGrid from '@/components/ProductGrid';
import Navbar from '@/components/Navbar';

export default async function ProductsPage() {
  const { data: products } = await supabaseServer
    .from('products')
    .select('*')
    .eq('is_active', true);

  return (
    <div>
      <Navbar />
      <section className="p-4 max-w-6xl mx-auto">
        <h2 className="text-2xl font-bold mb-4">All Products</h2>
        <ProductGrid products={products || []} />
      </section>
    </div>
  );
}
