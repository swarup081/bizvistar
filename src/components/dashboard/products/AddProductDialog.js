'use client';

import * as Dialog from '@radix-ui/react-dialog';
import * as Select from '@radix-ui/react-select';
import { X, UploadCloud, Loader2, Check, ChevronDown, CheckCircle, Plus, Trash2, Palette, Ruler } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { syncWebsiteDataClient } from '@/lib/websiteSync';
import { notifyLowStock } from '@/app/actions/productStockActions';

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
    additionalImages: [], 
    variants: [], 
  });

  // Pre-defined variant types
  const VARIANT_TYPES = [
      { id: 'size', label: 'Size', icon: Ruler },
      { id: 'color', label: 'Color', icon: Palette },
      { id: 'other', label: 'Other', icon: Plus },
  ];

  useEffect(() => {
    if (isOpen) {
      if (productToEdit) {
         setFormData({
            name: productToEdit.name || '',
            price: productToEdit.price || '',
            stock: productToEdit.stock === -1 || productToEdit.stock === 'Unlimited' ? '0' : productToEdit.stock,
            isUnlimited: productToEdit.stock === -1 || productToEdit.stock === 'Unlimited',
            categoryId: productToEdit.category_id ? String(productToEdit.category_id) : (categories?.[0]?.id ? String(categories[0].id) : ''),
            description: productToEdit.description || '',
            imageUrl: productToEdit.image_url || '',
            additionalImages: productToEdit.additional_images || [],
            variants: productToEdit.variants || [],
         });
      } else {
         setFormData({
            name: '',
            price: '',
            stock: '0', 
            isUnlimited: false,
            categoryId: categories?.[0]?.id ? String(categories[0].id) : '',
            description: '',
            imageUrl: '',
            additionalImages: [],
            variants: [],
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

  const handleAdditionalImageUpload = (e) => {
      const files = Array.from(e.target.files);
      if (files.length + formData.additionalImages.length > 9) {
          alert("You can only add up to 9 additional images.");
          return;
      }
      
      files.forEach(file => {
          const reader = new FileReader();
          reader.onloadend = () => {
              setFormData(prev => {
                  if (prev.additionalImages.length >= 9) return prev;
                  return { ...prev, additionalImages: [...prev.additionalImages, reader.result] };
              });
          };
          reader.readAsDataURL(file);
      });
  };

  const removeAdditionalImage = (index) => {
      setFormData(prev => ({
          ...prev,
          additionalImages: prev.additionalImages.filter((_, i) => i !== index)
      }));
  };

  const addVariant = (type) => {
      let initialValues = '';
      let initialName = '';
      
      if (type === 'size') {
          initialName = 'Size';
          initialValues = 'S, M, L, XL'; // Default suggestion
      } else if (type === 'color') {
          initialName = 'Color';
          initialValues = '#000000:Black, #FFFFFF:White'; // Default suggestion
      } else {
          initialName = 'Custom';
      }

      setFormData(prev => ({
          ...prev,
          variants: [...prev.variants, { type: type, name: initialName, values: initialValues }]
      }));
  };

  const updateVariant = (index, field, value) => {
      const newVariants = [...formData.variants];
      newVariants[index][field] = value;
      setFormData(prev => ({ ...prev, variants: newVariants }));
  };

  const removeVariant = (index) => {
      setFormData(prev => ({
          ...prev,
          variants: prev.variants.filter((_, i) => i !== index)
      }));
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
      let finalStock = parseInt(formData.stock);
      if (isNaN(finalStock)) finalStock = -1;
      if (formData.isUnlimited) finalStock = -1;
      if (finalStock < 0) finalStock = -1;

      const cleanVariants = formData.variants.filter(v => v.name.trim() !== '' && v.values.trim() !== '');

      const payload = {
        name: formData.name,
        price: parseFloat(formData.price),
        category_id: (!formData.categoryId || formData.categoryId === 'uncategorized') ? null : parseInt(formData.categoryId),
        description: formData.description,
        image_url: formData.imageUrl,
        stock: finalStock,
        website_id: websiteId,
        additional_images: formData.additionalImages,
        variants: cleanVariants
      };

      let productId = productToEdit ? productToEdit.id : null;

      if (productToEdit) {
          const { error } = await supabase
            .from('products')
            .update(payload)
            .eq('id', productToEdit.id);

          if (error) throw new Error(error.message);

      } else {
          const { data, error } = await supabase
            .from('products')
            .insert(payload)
            .select('id')
            .single();

          if (error) throw new Error(error.message);
          if (data) productId = data.id;
      }

      await syncWebsiteDataClient(websiteId);

      // Trigger Notification if Low Stock via Server Action
      if (productId && finalStock !== -1 && finalStock <= 5) {
          await notifyLowStock(productId);
      }

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
            <div className="flex-1 overflow-y-auto p-6 md:p-8 custom-scrollbar relative">
                <div className="space-y-6">
                    
                    {/* Main Image */}
                    <div className="flex justify-center">
                        <div className="relative group w-32 h-32 rounded-2xl bg-gray-50/50 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden hover:border-[#8A63D2] hover:bg-purple-50 transition-all cursor-pointer">
                            {formData.imageUrl ? (
                            <img src={formData.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                            ) : (
                            <div className="flex flex-col items-center text-gray-400">
                                <UploadCloud size={24} />
                                <span className="text-xs mt-1">Main Image</span>
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

                    {/* Additional Images */}
                    <div className="space-y-2">
                        <label className="text-xs font-bold text-gray-500 uppercase">Additional Images (Max 9)</label>
                        <div className="grid grid-cols-5 gap-2">
                            {formData.additionalImages.map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                    <img src={img} alt="" className="w-full h-full object-cover" />
                                    <button 
                                        type="button" 
                                        onClick={() => removeAdditionalImage(idx)}
                                        className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={12} />
                                    </button>
                                </div>
                            ))}
                            {formData.additionalImages.length < 9 && (
                                <div className="relative aspect-square rounded-lg bg-gray-50 border border-dashed border-gray-300 flex items-center justify-center hover:bg-purple-50 hover:border-purple-300 transition-colors cursor-pointer">
                                    <Plus size={16} className="text-gray-400" />
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        multiple
                                        className="absolute inset-0 opacity-0 cursor-pointer" 
                                        onChange={handleAdditionalImageUpload}
                                    />
                                </div>
                            )}
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
                        <Select.Root 
                            value={String(formData.categoryId)} 
                            onValueChange={(val) => setFormData(prev => ({ ...prev, categoryId: val }))}
                        >
                            <Select.Trigger className="w-full p-3 border border-gray-300 rounded-md text-sm outline-none focus:ring-1 focus:ring-purple-500 transition-all bg-white flex justify-between items-center text-left">
                                <Select.Value placeholder="Select Category">
                                    {categories.find(c => String(c.id) === String(formData.categoryId))?.name || 'Select Category'}
                                </Select.Value>
                                <Select.Icon>
                                    <ChevronDown className="h-4 w-4 text-gray-400" />
                                </Select.Icon>
                            </Select.Trigger>
                            <Select.Portal>
                                <Select.Content className="overflow-hidden bg-white rounded-xl shadow-xl border border-gray-100 z-[80]">
                                    <Select.Viewport className="p-1">
                                        {categories.map((c) => (
                                            <Select.Item 
                                                key={c.id} 
                                                value={String(c.id)} 
                                                className="relative flex items-center px-8 py-2 text-sm text-gray-700 rounded-md select-none hover:bg-purple-50 hover:text-purple-700 cursor-pointer outline-none data-[highlighted]:bg-purple-50 data-[highlighted]:text-purple-700"
                                            >
                                                <Select.ItemText>{c.name}</Select.ItemText>
                                                <Select.ItemIndicator className="absolute left-2 inline-flex items-center">
                                                    <CheckCircle size={14} className="text-purple-600"/>
                                                </Select.ItemIndicator>
                                            </Select.Item>
                                        ))}
                                    </Select.Viewport>
                                </Select.Content>
                            </Select.Portal>
                        </Select.Root>
                    </div>

                    {/* Variants */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <label className="text-xs font-bold text-gray-500 uppercase">Variants</label>
                            
                            {/* Variant Type Selector */}
                            <div className="flex gap-2">
                                {VARIANT_TYPES.map(type => (
                                    <button 
                                        key={type.id}
                                        type="button" 
                                        onClick={() => addVariant(type.id)}
                                        className="text-xs bg-gray-100 px-2 py-1 rounded hover:bg-purple-50 hover:text-[#8A63D2] font-medium flex items-center gap-1 transition-colors"
                                    >
                                        <type.icon size={12} /> {type.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {formData.variants.length === 0 && (
                            <div className="text-center p-4 bg-gray-50 rounded-lg border border-dashed border-gray-200 text-gray-400 text-sm">
                                No variants added. Click buttons above to add Size, Color, etc.
                            </div>
                        )}

                        {formData.variants.map((variant, idx) => (
                            <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200 space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        {variant.type === 'size' && <Ruler size={14} className="text-gray-500"/>}
                                        {variant.type === 'color' && <Palette size={14} className="text-gray-500"/>}
                                        {variant.type === 'other' && <Plus size={14} className="text-gray-500"/>}
                                        <span className="text-sm font-bold text-gray-700">{variant.name}</span>
                                    </div>
                                    <button 
                                        type="button" 
                                        onClick={() => removeVariant(idx)}
                                        className="text-gray-400 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>

                                <div className="flex gap-2">
                                    <div className="w-1/3">
                                        <input 
                                            placeholder="Name" 
                                            className="w-full p-2 border border-gray-300 rounded-md text-xs outline-none focus:ring-1 focus:ring-purple-500"
                                            value={variant.name}
                                            onChange={(e) => updateVariant(idx, 'name', e.target.value)}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <input 
                                            placeholder={variant.type === 'color' ? "#HEX:Name, #HEX:Name" : "Values (comma separated)"} 
                                            className="w-full p-2 border border-gray-300 rounded-md text-xs outline-none focus:ring-1 focus:ring-purple-500"
                                            value={variant.values}
                                            onChange={(e) => updateVariant(idx, 'values', e.target.value)}
                                        />
                                        {variant.type === 'color' && (
                                            <p className="text-[10px] text-gray-400 mt-1">Format: #hex:Name (e.g. #ff0000:Red, #000000:Black)</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
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
