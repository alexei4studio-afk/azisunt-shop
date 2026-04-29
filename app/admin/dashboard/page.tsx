import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export default async function Dashboard() {
  // Get total products
  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  // Get low stock products (inStock = false)
  const { count: lowStockCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('inStock', false);

  // Get viral products
  const { count: viralCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('is_viral', true);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Total Produse</h3>
          <p className="text-2xl">{productsCount ?? 0}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Stoc Scăzut</h3>
          <p className="text-2xl">{lowStockCount ?? 0}</p>
        </div>
        <div className="p-4 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Produse Virale</h3>
          <p className="text-2xl">{viralCount ?? 0}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Activitate Recentă</h3>
        <p className="text-gray-500">Nu există activitate recentă de afișat.</p>
      </div>
    </div>
  );
}