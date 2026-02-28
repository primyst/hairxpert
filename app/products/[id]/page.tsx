import ProductDetail from '@/components/ProductDetail';
import { supabaseServer } from '@/lib/supabaseServer';

interface ProductPageProps {
  params: { id: string };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { data: product } = await supabaseServer
    .from('products')
    .select('*')
    .eq('id', params.id)
    .single();

  return product ? <ProductDetail product={product} /> : <p>Product not found</p>;
}
