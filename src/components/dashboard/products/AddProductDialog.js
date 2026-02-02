'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X, UploadCloud, Loader2 } from 'lucide-react';
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
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity" />
        <Dialog.Content className="fixed top-[50%] left-[50%] max-h-[85vh] w-[90vw] max-w-[500px] translate-x-[-50%] translate-y-[-50%] rounded-[20px] bg-white/95 backdrop-blur-md border border-white/20 p-6 shadow-2xl focus:outline-none z-50 overflow-y-auto">
          
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-bold text-gray-900">
              {productToEdit ? 'Edit Product' : 'Add New Product'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button className="text-gray-400 hover:text-gray-600 rounded-full p-1 hover:bg-gray-100 transition-colors">
                <X size={20} />
              </button>
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div className="flex justify-center mb-6">
              <div className="relative group w-32 h-32 rounded-2xl bg-gray-50/50 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-blue-500 transition-colors cursor-pointer">
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

            <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Product Name</label>
                <input 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="e.g. Leather Pouch"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-700">Price</label>
                <input 
                  name="price"
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  placeholder="0.00"
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                />
              </div>
              
              <div className="space-y-2">
                 <div className="flex items-center justify-between">
                     <label className="text-sm font-medium text-gray-700">Stock</label>
                     <label className="flex items-center gap-1 cursor-pointer">
                        <input 
                           type="checkbox" 
                           name="isUnlimited"
                           checked={formData.isUnlimited}
                           onChange={handleChange}
                           className="w-3 h-3 text-[#8A63D2] rounded focus:ring-[#8A63D2]"
                        />
                        <span className="text-xs text-gray-500">Unlimited</span>
                     </label>
                 </div>
                 {formData.isUnlimited ? (
                     <div className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-gray-50/50 text-gray-500 text-sm italic">
                         Stock is unlimited
                     </div>
                 ) : (
                    <input 
                    name="stock"
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={handleChange}
                    placeholder="Enter stock..."
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
                    />
                 )}
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <select 
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm transition-all"
              >
                <option value="">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-medium text-gray-700">Description</label>
              <textarea 
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Product details..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 bg-white/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm resize-none transition-all"
              />
            </div>

            <div className="pt-4 flex justify-end gap-3">
              <button 
                type="button" 
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-2 rounded-lg bg-[#8A63D2] text-white text-sm font-medium hover:bg-[#7854bc] transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {loading && <Loader2 size={16} className="animate-spin" />}
                {productToEdit ? 'Save Changes' : 'Add Product'}
              </button>
            </div>

          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
