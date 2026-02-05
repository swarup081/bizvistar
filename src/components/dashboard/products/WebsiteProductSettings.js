'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X, Check, Loader2, ArrowUp, ArrowDown, Trash2, Plus, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { syncWebsiteDataClient } from '@/lib/websiteSync';

export default function WebsiteProductSettings({ isOpen, onClose, websiteId }) {
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);

  // Data
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [websiteData, setWebsiteData] = useState(null);

  // Settings State
  const [settings, setSettings] = useState({
      mode: 'auto', // 'auto' | 'manual'
      manualItems: [], // Array of { type: 'product'|'category', id: 123, name: '' }
      prioritizedProducts: [] // Array of IDs
  });

  const [newItemType, setNewItemType] = useState('product');
  const [newItemId, setNewItemId] = useState('');

  useEffect(() => {
      if (isOpen && websiteId) {
          fetchData();
      }
  }, [isOpen, websiteId]);

  const fetchData = async () => {
      setDataLoading(true);
      try {
          const [webRes, prodRes, catRes] = await Promise.all([
              supabase.from('websites').select('website_data').eq('id', websiteId).single(),
              supabase.from('products').select('id, name, stock').eq('website_id', websiteId),
              supabase.from('categories').select('id, name').eq('website_id', websiteId)
          ]);

          if (prodRes.data) setProducts(prodRes.data);
          if (catRes.data) setCategories(catRes.data);

          if (webRes.data?.website_data) {
              setWebsiteData(webRes.data.website_data);
              const existing = webRes.data.website_data.landing_settings || {};
              setSettings({
                  mode: existing.mode || 'auto',
                  manualItems: existing.manualItems || [],
                  prioritizedProducts: existing.prioritizedProducts || []
              });
          }
      } catch (e) {
          console.error(e);
      } finally {
          setDataLoading(false);
      }
  };

  const handleSave = async () => {
      setLoading(true);
      try {
          // Merge with existing website_data
          const newWebsiteData = {
              ...websiteData,
              landing_settings: settings
          };

          const { error } = await supabase
              .from('websites')
              .update({ website_data: newWebsiteData })
              .eq('id', websiteId);

          if (error) throw error;

          await syncWebsiteDataClient(websiteId);
          onClose();
      } catch (e) {
          alert('Failed to save settings: ' + e.message);
      } finally {
          setLoading(false);
      }
  };

  const addManualItem = () => {
      if (!newItemId) return;

      let item = null;
      if (newItemType === 'product') {
          const p = products.find(x => x.id.toString() === newItemId);
          if (p) item = { type: 'product', id: p.id, name: p.name };
      } else {
          const c = categories.find(x => x.id.toString() === newItemId);
          if (c) item = { type: 'category', id: c.id, name: c.name };
      }

      if (item) {
          // Check if already exists
          if (settings.manualItems.find(x => x.type === item.type && x.id === item.id)) {
              alert('Item already added');
              return;
          }
          setSettings(prev => ({
              ...prev,
              manualItems: [...prev.manualItems, item]
          }));
          setNewItemId('');
      }
  };

  const removeManualItem = (index) => {
      const newItems = [...settings.manualItems];
      newItems.splice(index, 1);
      setSettings(prev => ({ ...prev, manualItems: newItems }));
  };

  const moveManualItem = (index, direction) => {
      const newItems = [...settings.manualItems];
      if (direction === 'up' && index > 0) {
          [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
      } else if (direction === 'down' && index < newItems.length - 1) {
          [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
      }
      setSettings(prev => ({ ...prev, manualItems: newItems }));
  };

  const togglePriorityProduct = (id) => {
      setSettings(prev => {
          const exists = prev.prioritizedProducts.includes(id);
          return {
              ...prev,
              prioritizedProducts: exists
                 ? prev.prioritizedProducts.filter(x => x !== id)
                 : [...prev.prioritizedProducts, id]
          };
      });
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:w-full max-w-lg h-[80vh] md:h-[700px] bg-white rounded-2xl shadow-2xl z-[70] flex flex-col focus:outline-none overflow-hidden font-sans">

          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0">
            <Dialog.Title className="text-xl font-bold text-gray-900">
              Website Customization
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar">
             {dataLoading ? (
                 <div className="flex justify-center py-10"><Loader2 className="animate-spin text-purple-600" /></div>
             ) : (
                 <div className="space-y-8">

                     {/* Mode Selection */}
                     <div className="space-y-3">
                         <h3 className="font-bold text-gray-900">Landing Page Strategy</h3>
                         <div className="grid grid-cols-2 gap-4">
                             <button
                                onClick={() => setSettings(s => ({ ...s, mode: 'auto' }))}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${settings.mode === 'auto' ? 'border-[#8A63D2] bg-purple-50' : 'border-gray-100 hover:border-purple-200'}`}
                             >
                                 <div className="font-bold text-gray-900 mb-1">Auto (Smart)</div>
                                 <p className="text-xs text-gray-500">Automatically shows best-selling categories and products. Handles out-of-stock items intelligently.</p>
                             </button>
                             <button
                                onClick={() => setSettings(s => ({ ...s, mode: 'manual' }))}
                                className={`p-4 rounded-xl border-2 text-left transition-all ${settings.mode === 'manual' ? 'border-[#8A63D2] bg-purple-50' : 'border-gray-100 hover:border-purple-200'}`}
                             >
                                 <div className="font-bold text-gray-900 mb-1">Manual</div>
                                 <p className="text-xs text-gray-500">You explicitly choose which products or categories appear on the landing page.</p>
                             </button>
                         </div>
                     </div>

                     {/* Manual Configuration */}
                     {settings.mode === 'manual' && (
                         <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                             <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-100 flex gap-2">
                                 <Info className="text-yellow-600 shrink-0" size={16} />
                                 <p className="text-xs text-yellow-700">Ensure you add enough items to fill the template slots (usually 3-4).</p>
                             </div>

                             <div className="flex gap-2">
                                 <select
                                    value={newItemType}
                                    onChange={e => { setNewItemType(e.target.value); setNewItemId(''); }}
                                    className="p-2 border border-gray-300 rounded-lg text-sm"
                                 >
                                     <option value="product">Product</option>
                                     <option value="category">Category</option>
                                 </select>
                                 <select
                                    value={newItemId}
                                    onChange={e => setNewItemId(e.target.value)}
                                    className="flex-1 p-2 border border-gray-300 rounded-lg text-sm"
                                 >
                                     <option value="">Select Item...</option>
                                     {newItemType === 'product' ? (
                                         products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)
                                     ) : (
                                         categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)
                                     )}
                                 </select>
                                 <button
                                    onClick={addManualItem}
                                    disabled={!newItemId}
                                    className="p-2 bg-black text-white rounded-lg hover:bg-gray-800 disabled:opacity-50"
                                 >
                                     <Plus size={18} />
                                 </button>
                             </div>

                             <div className="space-y-2 border rounded-xl overflow-hidden">
                                 {settings.manualItems.length === 0 ? (
                                     <div className="p-4 text-center text-gray-400 text-sm">No items added yet.</div>
                                 ) : (
                                     settings.manualItems.map((item, idx) => (
                                         <div key={`${item.type}-${item.id}`} className="flex items-center justify-between p-3 bg-white border-b border-gray-100 last:border-0">
                                             <div className="flex items-center gap-3">
                                                 <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${item.type === 'product' ? 'bg-blue-50 text-blue-600' : 'bg-green-50 text-green-600'}`}>
                                                     {item.type}
                                                 </span>
                                                 <span className="text-sm font-medium text-gray-900">{item.name}</span>
                                             </div>
                                             <div className="flex items-center gap-1">
                                                 <button onClick={() => moveManualItem(idx, 'up')} disabled={idx === 0} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"><ArrowUp size={14} /></button>
                                                 <button onClick={() => moveManualItem(idx, 'down')} disabled={idx === settings.manualItems.length - 1} className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"><ArrowDown size={14} /></button>
                                                 <button onClick={() => removeManualItem(idx)} className="p-1 text-red-400 hover:text-red-600 ml-2"><Trash2 size={14} /></button>
                                             </div>
                                         </div>
                                     ))
                                 )}
                             </div>
                         </div>
                     )}

                     {/* Auto Configuration */}
                     {settings.mode === 'auto' && (
                         <div className="space-y-4 animate-in fade-in slide-in-from-top-2">
                             <div className="space-y-2">
                                 <h4 className="font-bold text-gray-900 text-sm">Prioritize Products</h4>
                                 <p className="text-xs text-gray-500">Select products to force to the top of the list, even if they aren't the top sellers.</p>

                                 <div className="max-h-40 overflow-y-auto border border-gray-200 rounded-xl p-2 custom-scrollbar">
                                     {products.map(p => (
                                         <label key={p.id} className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                                             <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${settings.prioritizedProducts.includes(p.id) ? 'bg-[#8A63D2] border-[#8A63D2]' : 'border-gray-300'}`}>
                                                 {settings.prioritizedProducts.includes(p.id) && <Check size={12} className="text-white" />}
                                             </div>
                                             <input
                                                type="checkbox"
                                                className="hidden"
                                                checked={settings.prioritizedProducts.includes(p.id)}
                                                onChange={() => togglePriorityProduct(p.id)}
                                             />
                                             <span className="text-sm text-gray-700">{p.name}</span>
                                         </label>
                                     ))}
                                 </div>
                             </div>
                         </div>
                     )}
                 </div>
             )}
          </div>

          <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white shrink-0">
             <button onClick={onClose} className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors">Cancel</button>
             <button
                onClick={handleSave}
                disabled={loading}
                className="px-8 py-2.5 rounded-xl bg-[#8A63D2] text-white font-bold hover:bg-[#7854bc] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-purple-200"
            >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                Save Settings
             </button>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
