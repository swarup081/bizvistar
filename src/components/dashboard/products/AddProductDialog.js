'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X, UploadCloud, Loader2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { syncWebsiteDataClient } from '@/lib/websiteSync';

export default function AddProductDialog({ isOpen, onClose, onProductAdded, categories, websiteId, productToEdit }) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    stock: '', 
    isUnlimited: false,
    categoryId: '',
    description: '',
    imageUrl: '', 
  });

  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
         setFormData({
            name: productToEdit.name || '',
            price: productToEdit.price || '',
            stock: productToEdit.stock === -1 || productToEdit.stock === 'Unlimited' ? '0' : productToEdit.stock,
            isUnlimited: productToEdit.stock === -1 || productToEdit.stock === 'Unlimited',
            categoryId: productToEdit.category_id || (categories?.[0]?.id || ''),
            description: productToEdit.description || '',
            imageUrl: productToEdit.image_url || '',
         });
      } else {
         setFormData({
            name: '',
            price: '',
            stock: '0', 
            isUnlimited: false,
            categoryId: categories?.[0]?.id || '',
            description: '',
            imageUrl: '',
         });
      }
    }
  }, [isOpen, categories, productToEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === 'stock') {
        if (value.includes('-')) return; 
    }
    setFormData(prev => ({ 
        ...prev, 
        [name]: type === 'checkbox' ? checked : value 
    }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, imageUrl: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!websiteId) {
        alert("System Error: No Website ID found. Please reload.");
        setLoading(false);
        return;
    }

    try {
      // 1. Prepare Data
      let finalStock = parseInt(formData.stock);
      if (isNaN(finalStock)) finalStock = -1;
      if (formData.isUnlimited) finalStock = -1;
      if (finalStock < 0) finalStock = -1;

      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        category_id: (!formData.categoryId || formData.categoryId === 'uncategorized') ? null : parseInt(formData.categoryId),
        description: formData.description,
        image_url: formData.imageUrl,
        stock: finalStock,
        website_id: websiteId
      };

      // 2. Insert or Update Client Side
      if (productToEdit) {
          const { error } = await supabase
            .from('products')
            .update(payload)
            .eq('id', productToEdit.id);

          if (error) throw new Error(error.message);

      } else {
          const { error } = await supabase
            .from('products')
            .insert(payload);

          if (error) throw new Error(error.message);
      }

      // 3. Sync JSON
      await syncWebsiteDataClient(websiteId);

      onProductAdded();
      onClose();

    } catch (err) {
      console.error(err);
      alert('Failed to save product: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] transition-opacity" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[95vw] md:w-full max-w-lg h-[80vh] md:h-[600px] bg-white rounded-2xl shadow-2xl z-[70] flex flex-col focus:outline-none overflow-hidden font-sans">
          
          {/* Header */}
          <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white shrink-0 z-10">
            <Dialog.Title className="text-xl font-bold text-gray-900">
              {productToEdit ? 'Edit Product' : 'Add New Product'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col flex-1 h-full overflow-hidden">
            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative">
                <div className="space-y-6">
                    
                    {/* Image Upload */}
                    <div className="flex justify-center">
                        <div className="relative group w-32 h-32 rounded-2xl bg-gray-50/50 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-[#8A63D2] hover:bg-purple-50 transition-all cursor-pointer">
                            {formData.imageUrl ? (
                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                            <div className="flex flex-col items-center text-gray-400">
                                <UploadCloud size={24} />
                                <span className="text-xs mt-1">Upload</span>
                            </div>
                            )}
                            <input 
                            type="file" 
                            accept="image/*" 
                            className="absolute inset-0 opacity-0 cursor-pointer" 
                            onChange={handleImageUpload}
                            />
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">Product Name</label>
                        <input 
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g. Leather Pouch"
                        className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase">Price</label>
                            <input 
                            name="price"
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            placeholder="0.00"
                            className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                            />
                        </div>
                        
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-bold text-gray-500 uppercase">Stock</label>
                                <label className="flex items-center gap-1 cursor-pointer">
                                    <input 
                                    type="checkbox" 
                                    name="isUnlimited"
                                    checked={formData.isUnlimited}
                                    onChange={handleChange}
                                    className="w-3 h-3 text-[#8A63D2] rounded focus:ring-[#8A63D2]"
                                    />
                                    <span className="text-[10px] text-gray-500 font-medium">Unlimited</span>
                                </label>
                            </div>
                            {formData.isUnlimited ? (
                                <div className="w-full p-3 border border-gray-200 bg-gray-50 rounded-md text-gray-400 text-sm italic">
                                    Stock is unlimited
                                </div>
                            ) : (
                                <input 
                                name="stock"
                                type="number"
                                min="0"
                                value={formData.stock}
                                onChange={handleChange}
                                placeholder="Qty"
                                className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-purple-500 transition-all"
                                />
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">Category</label>
                        <select 
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-purple-500 transition-all bg-white"
                        >
                            <option value="">Select Category</option>
                            {categories.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-xs font-bold text-gray-500 uppercase">Description</label>
                        <textarea 
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={3}
                            placeholder="Product details..."
                            className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-purple-500 resize-none transition-all"
                        />
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-gray-100 flex justify-end gap-3 bg-white shrink-0 z-10">
              <button 
                type="button" 
                onClick={onClose}
                className="px-6 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-medium hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-8 py-2.5 rounded-xl bg-[#8A63D2] text-white font-bold hover:bg-[#7854bc] transition-colors disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-purple-200"
              >
                {loading ? <Loader2 size={18} className="animate-spin" /> : <Check size={18} />}
                {productToEdit ? 'Save Changes' : 'Add Product'}
              </button>
            </div>

          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
