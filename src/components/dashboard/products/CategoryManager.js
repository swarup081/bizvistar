'use client';

import { useState, useEffect, useMemo } from 'react';
import { Plus, Loader2, Trash2, Edit, MoreVertical, Search, Package, TrendingUp } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { syncWebsiteDataClient } from '@/lib/websiteSync';
import * as Dialog from '@radix-ui/react-dialog';
import { X, Check } from 'lucide-react';

function CategoryDialog({ isOpen, onClose, categoryToEdit, onSave, loading }) {
    const [name, setName] = useState('');

    useEffect(() => {
        if (isOpen) {
            setName(categoryToEdit?.name || '');
        }
    }, [isOpen, categoryToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(name);
    };

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-md bg-white rounded-2xl shadow-2xl z-[70] focus:outline-none overflow-hidden font-sans">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white">
                        <Dialog.Title className="text-xl font-bold text-gray-900">
                            {categoryToEdit ? 'Edit Category' : 'Add Category'}
                        </Dialog.Title>
                        <Dialog.Close asChild>
                            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                                <X size={20} />
                            </button>
                        </Dialog.Close>
                    </div>
                    <form onSubmit={handleSubmit}>
                        <div className="p-6 space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase">Category Name</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="e.g. Summer Collection"
                                    required
                                    className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                                    autoFocus
                                />
                            </div>
                        </div>
                        <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white">
                            <button
                                type="button"
                                onClick={onClose}
                                className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading || !name.trim()}
                                className="px-8 py-2.5 rounded-xl bg-[#8A63D2] text-white font-bold hover:bg-[#7854bc] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-purple-200"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                                {categoryToEdit ? 'Save Changes' : 'Add Category'}
                            </button>
                        </div>
                    </form>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export default function CategoryManager({ categories, onUpdate, websiteId }) {
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [categoryStats, setCategoryStats] = useState({}); // { catId: { count: 10, topProduct: {...}, sales: 500 } }

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [categoryToEdit, setCategoryToEdit] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Fetch detailed stats
  useEffect(() => {
      if (!websiteId) return;
      const fetchStats = async () => {
          setStatsLoading(true);
          try {
              // Fetch products
              const { data: products } = await supabase
                  .from('products')
                  .select('id, name, image_url, category_id, price')
                  .eq('website_id', websiteId);

              if (!products) {
                   setStatsLoading(false);
                   return;
              }

              // Fetch Sales
              const { data: orderItems } = await supabase
                  .from('order_items')
                  .select('product_id, quantity');

              // Aggregate sales per product
              const productSales = {};
              (orderItems || []).forEach(item => {
                  productSales[item.product_id] = (productSales[item.product_id] || 0) + item.quantity;
              });

              // Aggregate per category
              const stats = {};
              categories.forEach(cat => {
                  const catProducts = products.filter(p => p.category_id === cat.id);
                  const count = catProducts.length;

                  // Find top product
                  let topProd = null;
                  let maxSales = -1;
                  let totalCatSales = 0;

                  catProducts.forEach(p => {
                      const sales = productSales[p.id] || 0;
                      totalCatSales += sales;
                      if (sales > maxSales) {
                          maxSales = sales;
                          topProd = p;
                      }
                  });

                  stats[cat.id] = {
                      count,
                      topProduct: topProd,
                      sales: totalCatSales
                  };
              });

              setCategoryStats(stats);
          } catch (e) {
              console.error(e);
          } finally {
              setStatsLoading(false);
          }
      };

      fetchStats();
  }, [websiteId, categories]);

  const handleSave = async (name) => {
      if (!websiteId) return;
      setLoading(true);
      try {
          if (categoryToEdit) {
              const { error } = await supabase
                  .from('categories')
                  .update({ name })
                  .eq('id', categoryToEdit.id);
              if(error) throw error;
          } else {
              const { error } = await supabase
                  .from('categories')
                  .insert({ name, website_id: websiteId });
              if(error) throw error;
          }

          await syncWebsiteDataClient(websiteId);
          onUpdate();
          setIsDialogOpen(false);
          setCategoryToEdit(null);
      } catch (err) {
          alert('Error: ' + err.message);
      } finally {
          setLoading(false);
      }
  };

  const handleDelete = async (id) => {
      if (!confirm('Are you sure? Products in this category will be uncategorized.')) return;
      try {
          const { error } = await supabase.from('categories').delete().eq('id', id);
          if (error) throw error;
          await syncWebsiteDataClient(websiteId);
          onUpdate();
      } catch(e) {
          alert(e.message);
      }
  };

  const filteredCategories = useMemo(() => {
      if (!searchTerm) return categories;
      return categories.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [categories, searchTerm]);

  return (
    <div className="space-y-6">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-purple p-2 rounded-full border border-gray-100 shadow-sm">
         <div className="relative w-full md:w-96">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
                type="text"
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 text-sm bg-purple-50 border-none rounded-full focus:ring-2 focus:ring-[#8A63D2]/20 focus:outline-none"
            />
         </div>
         <button
             onClick={() => { setCategoryToEdit(null); setIsDialogOpen(true); }}
             className="px-4 py-2 bg-[#8A63D2] text-white rounded-full font-medium text-sm hover:bg-[#7854bc] transition-colors shadow-sm flex items-center gap-2"
         >
             <Plus size={18} />
             Add Category
         </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
           <table className="w-full text-left border-collapse">
               <thead>
                   <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                       <th className="px-6 py-4 rounded-tl-2xl">Category Name</th>
                       <th className="px-6 py-4">Total Items</th>
                       <th className="px-6 py-4">Top Product</th>
                       <th className="px-6 py-4">Total Sales</th>
                       <th className="px-6 py-4 rounded-tr-2xl text-right">Action</th>
                   </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                   {statsLoading ? (
                       [1,2,3].map(i => (
                           <tr key={i} className="animate-pulse">
                               <td className="px-6 py-4"><div className="h-6 w-32 bg-gray-100 rounded"></div></td>
                               <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-100 rounded"></div></td>
                               <td className="px-6 py-4"><div className="h-10 w-40 bg-gray-100 rounded"></div></td>
                               <td className="px-6 py-4"><div className="h-6 w-20 bg-gray-100 rounded"></div></td>
                               <td className="px-6 py-4"></td>
                           </tr>
                       ))
                   ) : filteredCategories.length === 0 ? (
                       <tr><td colSpan="5" className="p-8 text-center text-gray-400">No categories found.</td></tr>
                   ) : (
                       filteredCategories.map(cat => {
                           const stat = categoryStats[cat.id] || { count: 0, topProduct: null, sales: 0 };
                           return (
                               <tr key={cat.id} className="hover:bg-gray-50/50 transition-colors group">
                                   <td className="px-6 py-4">
                                       <div className="font-medium text-gray-900">{cat.name}</div>
                                       <div className="text-xs text-gray-400">ID: {cat.id}</div>
                                   </td>
                                   <td className="px-6 py-4">
                                       <div className="flex items-center gap-2">
                                           <Package size={16} className="text-gray-400" />
                                           <span className="text-sm font-medium text-gray-700">{stat.count} items</span>
                                       </div>
                                   </td>
                                   <td className="px-6 py-4">
                                       {stat.topProduct ? (
                                           <div className="flex items-center gap-3">
                                               <div className="h-10 w-10 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden shrink-0">
                                                   <img src={stat.topProduct.image_url || 'https://via.placeholder.com/40'} alt="" className="h-full w-full object-cover" />
                                               </div>
                                               <div className="min-w-0">
                                                   <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">{stat.topProduct.name}</div>
                                                   <div className="text-xs text-gray-500">Best Seller</div>
                                               </div>
                                           </div>
                                       ) : (
                                           <span className="text-xs text-gray-400 italic">No products</span>
                                       )}
                                   </td>
                                   <td className="px-6 py-4">
                                       <div className="flex items-center gap-2">
                                           <TrendingUp size={16} className="text-green-500" />
                                           <span className="text-sm font-bold text-gray-900">{stat.sales} sold</span>
                                       </div>
                                   </td>
                                   <td className="px-6 py-4 text-right">
                                       <div className="flex items-center justify-end gap-2">
                                           <button
                                               onClick={() => { setCategoryToEdit(cat); setIsDialogOpen(true); }}
                                               className="p-2 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                                           >
                                               <Edit size={16} />
                                           </button>
                                           <button
                                               onClick={() => handleDelete(cat.id)}
                                               className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                           >
                                               <Trash2 size={16} />
                                           </button>
                                       </div>
                                   </td>
                               </tr>
                           );
                       })
                   )}
               </tbody>
           </table>
        </div>
      </div>

      <CategoryDialog
         isOpen={isDialogOpen}
         onClose={() => setIsDialogOpen(false)}
         categoryToEdit={categoryToEdit}
         onSave={handleSave}
         loading={loading}
      />
    </div>
  );
}
