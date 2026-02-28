import { supabaseServer } from '@/lib/supabaseServer';
import ProductCard from '@/components/ProductCard';
import Navbar from '@/components/Navbar';

export default async function HomePage() {
  const { data: products } = await supabaseServer
    .from('products')
    .select('*')
    .eq('is_active', true);

  return (
    <div>
      <Navbar />

      {/* Hero Section */}
      <section className="bg-blue-100 p-8 text-center">
        <h2 className="text-3xl font-bold mb-2">Welcome to Primyst Store</h2>
        <p className="text-gray-700">Browse our products and add to your cart easily!</p>
      </section>

      {/* Product Grid */}
      <section className="p-4 max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
        {products?.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </section>
    </div>
  );
}
