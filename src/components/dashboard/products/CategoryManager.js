'use client';

import { useState, useEffect, useMemo } from 'react';
import { Loader2, Trash2, Edit, Package, TrendingUp, Check, ChevronLeft, Search } from 'lucide-react'; // Added Search import
import { supabase } from '@/lib/supabaseClient';
import { syncWebsiteDataClient } from '@/lib/websiteSync';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

function CategoryDialog({ isOpen, onClose, categoryToEdit, onSave, loading, websiteId }) {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [selectedProducts, setSelectedProducts] = useState(new Set());
    const [products, setProducts] = useState([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [productSearch, setProductSearch] = useState('');

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setName(categoryToEdit?.name || '');
            setSelectedProducts(new Set());
            if (!categoryToEdit) {
                fetchProducts();
            }
        }
    }, [isOpen, categoryToEdit]);

    const fetchProducts = async () => {
        setProductsLoading(true);
        const { data } = await supabase
            .from('products')
            .select('id, name, image_url, category_id')
            .eq('website_id', websiteId)
            .order('name');
        setProducts(data || []);
        setProductsLoading(false);
    };

    const handleNext = (e) => {
        e.preventDefault();
        if (categoryToEdit) {
            handleSubmit(); 
        } else {
            setStep(2);
        }
    };

    const handleSubmit = () => {
        onSave(name, Array.from(selectedProducts));
    };

    const toggleProduct = (id) => {
        const newSet = new Set(selectedProducts);
        if (newSet.has(id)) newSet.delete(id);
        else newSet.add(id);
        setSelectedProducts(newSet);
    };

    const filteredProducts = products.filter(p => 
        p.name.toLowerCase().includes(productSearch.toLowerCase())
    );

    return (
        <Dialog.Root open={isOpen} onOpenChange={onClose}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity" />
                <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] max-w-lg bg-white rounded-2xl shadow-2xl z-[70] focus:outline-none overflow-hidden font-sans flex flex-col max-h-[80vh]">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
                        <div className="flex items-center gap-2">
                            {step === 2 && (
                                <button onClick={() => setStep(1)} className="p-1 -ml-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100">
                                    <ChevronLeft size={20} />
                                </button>
                            )}
                            <Dialog.Title className="text-xl font-bold text-gray-900">
                                {categoryToEdit ? 'Edit Category' : (step === 1 ? 'Add Category' : 'Add Products')}
                            </Dialog.Title>
                        </div>
                        <Dialog.Close asChild>
                            <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                                <X size={20} />
                            </button>
                        </Dialog.Close>
                    </div>

                    {step === 1 ? (
                        <form id="cat-form" onSubmit={handleNext} className="p-6 space-y-4">
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
                        </form>
                    ) : (
                        <div className="flex-1 overflow-hidden flex flex-col">
                            <div className="p-4 border-b border-gray-100 bg-gray-50/50">
                                <div className="relative">
                                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        value={productSearch}
                                        onChange={(e) => setProductSearch(e.target.value)}
                                        placeholder="Search products..."
                                        className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-purple-500"
                                    />
                                </div>
                            </div>
                            <div className="flex-1 overflow-y-auto p-2">
                                {productsLoading ? (
                                    <div className="flex justify-center py-8"><Loader2 className="animate-spin text-purple-500" /></div>
                                ) : filteredProducts.length === 0 ? (
                                    <div className="text-center py-8 text-gray-400 text-sm">No products found.</div>
                                ) : (
                                    <div className="space-y-1">
                                        {filteredProducts.map(p => (
                                            <div 
                                                key={p.id} 
                                                onClick={() => toggleProduct(p.id)}
                                                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${selectedProducts.has(p.id) ? 'bg-purple-50 border border-purple-100' : 'hover:bg-gray-50 border border-transparent'}`}
                                            >
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${selectedProducts.has(p.id) ? 'bg-purple-600 border-purple-600' : 'border-gray-300 bg-white'}`}>
                                                    {selectedProducts.has(p.id) && <Check size={12} className="text-white" />}
                                                </div>
                                                <div className="h-8 w-8 rounded bg-gray-100 overflow-hidden shrink-0">
                                                    <img src={p.image_url} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <div className="text-sm font-medium text-gray-900 truncate">{p.name}</div>
                                                    {p.category_id && <div className="text-xs text-gray-400">Current: ID {p.category_id}</div>}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white shrink-0">
                        <button 
                            type="button" 
                            onClick={step === 1 ? onClose : () => setStep(1)}
                            className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                        >
                            {step === 1 ? 'Cancel' : 'Back'}
                        </button>
                        <button 
                            onClick={step === 1 ? handleNext : handleSubmit}
                            disabled={loading || !name.trim()}
                            className="px-8 py-2.5 rounded-xl bg-[#8A63D2] text-white font-bold hover:bg-[#7854bc] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-purple-200"
                        >
                            {loading && <Loader2 size={18} className="animate-spin" />}
                            {categoryToEdit ? 'Save Changes' : (step === 1 ? 'Next' : `Create & Add (${selectedProducts.size})`)}
                        </button>
                    </div>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

// Accepts props lifted from parent
export default function CategoryManager({ 
    categories, 
    onUpdate, 
    websiteId,
    searchTerm, // Lifted
    filter, // Lifted (populated/empty)
    sortBy, // Lifted (date/top)
    isAddOpen, // Lifted
    onAddClose // Lifted
}) {
  const [loading, setLoading] = useState(false);
  const [statsLoading, setStatsLoading] = useState(true);
  const [categoryStats, setCategoryStats] = useState({});
  
  const [categoryToEdit, setCategoryToEdit] = useState(null);

  // Fetch detailed stats
  useEffect(() => {
      if (!websiteId) return;
      const fetchStats = async () => {
          setStatsLoading(true);
          try {
              const { data: products } = await supabase
                  .from('products')
                  .select('id, name, image_url, category_id, price')
                  .eq('website_id', websiteId);

              if (!products) { setStatsLoading(false); return; }

              const { data: orderItems } = await supabase
                  .from('order_items')
                  .select('product_id, quantity');
              
              const productSales = {};
              (orderItems || []).forEach(item => {
                  productSales[item.product_id] = (productSales[item.product_id] || 0) + item.quantity;
              });

              const stats = {};
              categories.forEach(cat => {
                  const catProducts = products.filter(p => p.category_id === cat.id);
                  const count = catProducts.length;
                  let topProd = null;
                  let maxSales = -1;
                  let totalCatSales = 0;

                  catProducts.forEach(p => {
                      const sales = productSales[p.id] || 0;
                      totalCatSales += sales;
                      if (sales > maxSales) { maxSales = sales; topProd = p; }
                  });

                  stats[cat.id] = { count, topProduct: topProd, sales: totalCatSales };
              });

              setCategoryStats(stats);
          } catch (e) { console.error(e); } finally { setStatsLoading(false); }
      };
      fetchStats();
  }, [websiteId, categories]);

  const handleSave = async (name, productIds = []) => {
      if (!websiteId) return;
      setLoading(true);
      try {
          let catId = categoryToEdit?.id;

          if (categoryToEdit) {
              const { error } = await supabase
                  .from('categories')
                  .update({ name })
                  .eq('id', categoryToEdit.id);
              if(error) throw error;
          } else {
              const { data, error } = await supabase
                  .from('categories')
                  .insert({ name, website_id: websiteId })
                  .select()
                  .single();
              if(error) throw error;
              catId = data.id;
          }

          if (productIds.length > 0 && catId) {
              const { error: prodError } = await supabase
                  .from('products')
                  .update({ category_id: catId })
                  .in('id', productIds);
              if (prodError) throw prodError;
          }

          await syncWebsiteDataClient(websiteId);
          onUpdate();
          onAddClose();
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
      } catch(e) { alert(e.message); }
  };

  const processedCategories = useMemo(() => {
      let result = [...categories]; // Clone
      
      // Filter
      if (searchTerm) {
          result = result.filter(c => c.name.toLowerCase().includes(searchTerm.toLowerCase()));
      }
      if (filter === 'empty') {
          result = result.filter(c => (categoryStats[c.id]?.count || 0) === 0);
      } else if (filter === 'populated') {
          result = result.filter(c => (categoryStats[c.id]?.count || 0) > 0);
      }

      // Sort
      if (sortBy === 'top') {
          result.sort((a, b) => (categoryStats[b.id]?.sales || 0) - (categoryStats[a.id]?.sales || 0));
      } else if (sortBy === 'date') {
          // Use ID as proxy for date if created_at not available or reliably sequential
          result.sort((a, b) => b.id - a.id); 
      }

      return result;
  }, [categories, searchTerm, categoryStats, filter, sortBy]);

  // Handle Edit triggering (from within table)
  // We need to use the same Dialog but populate it
  // Since the dialog control is lifted, we need to handle "Edit Mode" locally or lift that too.
  // For simplicity, we can reuse the `isAddOpen` prop but we need to tell parent?
  // Actually, parent controls visibility. `categoryToEdit` is local.
  // When user clicks Edit, we set local `categoryToEdit` AND call `onAddClose()` then `onAddOpen()`?
  // No, `onAddClose` closes it. We need `setAddOpen(true)`. 
  // BETTER: `CategoryManager` should probably control the dialog visibility for *Edit*, 
  // but *Add* is controlled by parent.
  // OR: We just assume `isAddOpen` is for ADDING. Editing can use its own state or share.
  // Let's keep `categoryToEdit` local. But we need to open the dialog.
  // Solution: Pass a `triggerEdit` callback or just use a separate state for Edit Dialog?
  // User wants "Add Category" button in parent.
  // Let's use `isDialogOpen` locally for Edit, and `isAddOpen` prop for Add.
  // Combined: The Dialog component is rendered once.
  
  // Actually, simplest is to treat the prop `isAddOpen` as the source of truth for the "Add" flow.
  // For "Edit", we can have a local state `isEditOpen`.
  // AND render the Dialog if EITHER is true.
  
  const [isEditOpen, setIsEditOpen] = useState(false);

  const effectiveOpen = isAddOpen || isEditOpen;
  const closeEffective = () => {
      if (isAddOpen) onAddClose();
      if (isEditOpen) {
          setIsEditOpen(false);
          setCategoryToEdit(null);
      }
  };

  return (
    <div className="space-y-6">
      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto min-h-[400px]">
           <table className="w-full text-left border-collapse">
               <thead>
                   <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                       <th className="px-6 py-4 rounded-tl-2xl">Category Name</th>
                       <th className="px-6 py-4">Total Items</th>
                       <th className="hidden md:table-cell px-6 py-4">Top Product</th>
                       <th className="hidden md:table-cell px-6 py-4">Total Sales</th>
                       <th className="px-6 py-4 rounded-tr-2xl text-right">Action</th>
                   </tr>
               </thead>
               <tbody className="divide-y divide-gray-50">
                   {statsLoading ? (
                       [1,2,3].map(i => (
                           <tr key={i} className="animate-pulse">
                               <td className="px-6 py-4"><div className="h-6 w-32 bg-gray-100 rounded"></div></td>
                               <td className="px-6 py-4"><div className="h-6 w-16 bg-gray-100 rounded"></div></td>
                               <td className="hidden md:table-cell px-6 py-4"><div className="h-10 w-40 bg-gray-100 rounded"></div></td>
                               <td className="hidden md:table-cell px-6 py-4"><div className="h-6 w-20 bg-gray-100 rounded"></div></td>
                               <td className="px-6 py-4"></td>
                           </tr>
                       ))
                   ) : processedCategories.length === 0 ? (
                       <tr><td colSpan="5" className="p-8 text-center text-gray-400">No categories found.</td></tr>
                   ) : (
                       processedCategories.map(cat => {
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
                                   <td className="hidden md:table-cell px-6 py-4">
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
                                   <td className="hidden md:table-cell px-6 py-4">
                                       <div className="flex items-center gap-2">
                                           <TrendingUp size={16} className="text-green-500" />
                                           <span className="text-sm font-bold text-gray-900">{stat.sales} sold</span>
                                       </div>
                                   </td>
                                   <td className="px-6 py-4 text-right">
                                       <div className="flex items-center justify-end gap-2">
                                           <button 
                                               onClick={() => { setCategoryToEdit(cat); setIsEditOpen(true); }}
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
         isOpen={effectiveOpen} 
         onClose={closeEffective} 
         categoryToEdit={categoryToEdit} 
         onSave={handleSave}
         loading={loading}
         websiteId={websiteId}
      />
    </div>
  );
}
