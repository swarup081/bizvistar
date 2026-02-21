'use client';

import { useState, useEffect, useCallback } from 'react';
import { Plus, Trash2, Edit2, X, AlertCircle, Package, UploadCloud, Loader2, Check, ChevronRight } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { saveOnboardingStep2Product, deleteOnboardingProduct } from '@/app/actions/onboardingActions';

export default function ProductsStep({ websiteId, onNext, loading: parentLoading, onDataUpdate }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProduct, setEditingProduct] = useState(null); // Product object or 'new'
  const [form, setForm] = useState({ name: '', price: '', stock: '', image: '' });
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchProducts = useCallback(async () => {
    try {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('website_id', websiteId)
            .order('created_at', { ascending: false });

        if (error) throw error;
        setProducts(data || []);
    } catch (err) {
        console.error(err);
    } finally {
        setLoading(false);
    }
  }, [websiteId]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleEdit = (product) => {
    setEditingProduct(product);
    setForm({
        name: product.name,
        price: product.price,
        stock: product.stock === -1 ? '' : product.stock,
        image: product.image_url || ''
    });
    setError(null);
  };

  const handleAdd = () => {
      if (products.length >= 10) return;
      setEditingProduct('new');
      setForm({ name: '', price: '', stock: '', image: '' });
      setError(null);
  };

  const handleDelete = async (id) => {
      if (!confirm("Delete this product?")) return;
      const res = await deleteOnboardingProduct(websiteId, id);
      if (res.success) {
          fetchProducts();
          if (onDataUpdate) onDataUpdate(res.businessData);
      } else {
          alert(res.error);
      }
  };

  const handleSave = async (e) => {
      e.preventDefault();
      setSaving(true);
      setError(null);

      const payload = {
          id: editingProduct === 'new' ? undefined : editingProduct.id,
          name: form.name,
          price: form.price,
          stock: form.stock === '' ? -1 : form.stock, // Default to unlimited if empty
          image: form.image
      };

      const res = await saveOnboardingStep2Product(websiteId, payload);

      if (res.success) {
          setEditingProduct(null);
          fetchProducts();
          if (onDataUpdate) onDataUpdate(res.businessData);
      } else {
          setError(res.error);
      }
      setSaving(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const isLimitReached = products.length >= 10;

  // Render Overlay Form (Styled like AddProductDialog content)
  if (editingProduct) {
      return (
          <div className="flex flex-col h-full animate-in fade-in zoom-in-95 duration-200">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-100">
                  <h3 className="font-bold text-lg text-gray-900">{editingProduct === 'new' ? 'Add Product' : 'Edit Product'}</h3>
                  <button onClick={() => setEditingProduct(null)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                      <X size={20} />
                  </button>
              </div>

              <form onSubmit={handleSave} className="flex-grow space-y-6 overflow-y-auto px-1 custom-scrollbar">
                  {error && (
                      <div className="p-3 bg-red-50 text-red-600 text-xs rounded-lg flex items-center gap-2 border border-red-100">
                          <AlertCircle size={14} /> {error}
                      </div>
                  )}

                  {/* Image Upload */}
                  <div className="flex justify-center">
                      <div className="relative group w-32 h-32 rounded-2xl bg-gray-50 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-[#8A63D2] hover:bg-purple-50 transition-all cursor-pointer">
                          {form.image ? (
                              <img src={form.image} className="w-full h-full object-cover" />
                          ) : (
                              <div className="flex flex-col items-center text-gray-400">
                                  <UploadCloud size={24} />
                                  <span className="text-xs mt-1 font-medium">Add Image</span>
                              </div>
                          )}
                          <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                  </div>

                  {/* Fields */}
                  <div className="space-y-4">
                      <div className="space-y-1.5">
                          <label className="text-xs font-bold text-gray-500 uppercase">Product Name</label>
                          <input
                            value={form.name}
                            onChange={e => setForm({...form, name: e.target.value})}
                            required
                            placeholder="e.g. Classic Watch"
                            className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                          />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                              <label className="text-xs font-bold text-gray-500 uppercase">Price (₹)</label>
                              <input
                                type="number"
                                value={form.price}
                                onChange={e => setForm({...form, price: e.target.value})}
                                required
                                placeholder="0.00"
                                className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                              />
                          </div>
                          <div className="space-y-1.5">
                              <label className="text-xs font-bold text-gray-500 uppercase">Stock</label>
                              <input
                                type="number"
                                placeholder="Unlimited"
                                value={form.stock}
                                onChange={e => setForm({...form, stock: e.target.value})}
                                className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                              />
                          </div>
                      </div>
                  </div>

                  <div className="pt-4 flex justify-end gap-3 border-t border-gray-100 mt-auto">
                      <button
                        type="button"
                        onClick={() => setEditingProduct(null)}
                        className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={saving}
                        className="px-8 py-2.5 bg-[#8A63D2] text-white font-bold rounded-xl hover:bg-[#7854bc] transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-purple-200"
                      >
                          {saving ? <Loader2 size={18} className="animate-spin" /> : (editingProduct === 'new' ? 'Add Product' : 'Save Changes')}
                      </button>
                  </div>
              </form>
          </div>
      );
  }

  // Render List
  return (
    <div className="flex flex-col h-full">
      <div className="text-center mb-6 shrink-0">
        <h2 className="text-2xl font-bold text-gray-900">Add Your Products</h2>
        <p className="text-gray-500 mt-2 text-sm">Add up to 10 products to get started.</p>

        {isLimitReached && (
            <div className="mt-3 p-2.5 bg-amber-50 text-amber-800 text-xs font-medium rounded-lg inline-flex items-center gap-2 border border-amber-100">
                <AlertCircle size={14} className="shrink-0" />
                <span>Limit reached (10/10). Manage more in Dashboard later.</span>
            </div>
        )}
      </div>

      {/* Product Grid */}
      <div className="flex-grow overflow-y-auto pr-1 mb-4 custom-scrollbar min-h-[250px]">
          {loading ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
                  <Loader2 size={24} className="animate-spin" />
                  <span className="text-sm">Loading products...</span>
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {products.map(p => (
                    <div key={p.id} className="p-3 border border-gray-200 rounded-xl flex gap-3 items-center group bg-white hover:border-[#8A63D2] transition-all shadow-sm hover:shadow-md">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 shrink-0 overflow-hidden border border-gray-100">
                            {p.image_url ? (
                                <img src={p.image_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-300">
                                    <Package size={20} />
                                </div>
                            )}
                        </div>
                        <div className="flex-grow min-w-0">
                            <h4 className="font-bold text-sm text-gray-900 truncate">{p.name}</h4>
                            <p className="text-xs font-medium text-gray-500">₹{p.price}</p>
                        </div>
                        <div className="flex flex-col gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => handleEdit(p)} className="p-1.5 text-gray-400 hover:text-[#8A63D2] hover:bg-purple-50 rounded-md transition-colors">
                                <Edit2 size={14} />
                            </button>
                            <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors">
                                <Trash2 size={14} />
                            </button>
                        </div>
                    </div>
                ))}

                {/* Add Button Card */}
                {!isLimitReached && (
                    <button
                        onClick={handleAdd}
                        className="p-3 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-[#8A63D2] hover:text-[#8A63D2] hover:bg-purple-50 transition-all min-h-[80px] group"
                    >
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#8A63D2] group-hover:text-white transition-colors">
                            <Plus size={16} />
                        </div>
                        <span className="text-xs font-bold">Add New</span>
                    </button>
                )}
              </div>
          )}
      </div>

      <div className="pt-4 border-t border-gray-100 shrink-0 flex justify-end">
          <button
            onClick={() => onNext()}
            disabled={parentLoading || loading}
            className="px-8 py-2.5 bg-[#8A63D2] text-white font-bold rounded-xl hover:bg-[#7854bc] transition-all disabled:opacity-50 shadow-lg shadow-purple-200 flex items-center gap-2"
          >
            Continue {products.length > 0 ? `(${products.length})` : ''} <ChevronRight size={18} />
          </button>
      </div>
    </div>
  );
}
