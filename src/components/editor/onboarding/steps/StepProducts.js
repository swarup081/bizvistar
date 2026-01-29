'use client';

import { useState } from 'react';
import { Plus, Trash, Image as ImageIcon, X, ShoppingBag } from 'lucide-react';
import Image from 'next/image';

export default function StepProducts({ products, onAddProduct, onRemoveProduct }) {
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    image: null
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!newProduct.name || !newProduct.price) return;
    onAddProduct({ ...newProduct, id: Date.now() }); // temporary ID
    setNewProduct({ name: '', price: '', description: '', image: null });
    setIsAdding(false);
  };

  const isLimitReached = products.length >= 10;

  return (
    <div className="space-y-4 h-full flex flex-col animate-in fade-in slide-in-from-right-4 duration-300">
       <div className="text-center mb-2">
        <h2 className="text-2xl font-bold text-gray-900">Add your first products</h2>
        <p className="text-gray-500 text-sm mt-1">Start your catalog. You can add more later.</p>
      </div>

      {/* Product List */}
      <div className="flex-grow overflow-y-auto min-h-[200px] max-h-[300px] space-y-3 pr-1">
        {products.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-40 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-400">
             <ShoppingBag size={32} className="mb-2 opacity-50" />
             <p className="text-sm">No products added yet.</p>
          </div>
        ) : (
          products.map((p, i) => (
            <div key={p.id || i} className="flex items-center gap-3 p-3 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 rounded-lg bg-gray-100 flex-shrink-0 relative overflow-hidden">
                {p.image ? (
                   <Image src={p.image} alt="" fill className="object-cover" />
                ) : (
                   <div className="w-full h-full flex items-center justify-center text-gray-300">
                     <ImageIcon size={16} />
                   </div>
                )}
              </div>
              <div className="flex-grow min-w-0">
                <h4 className="font-medium text-gray-900 text-sm truncate">{p.name}</h4>
                <p className="text-gray-500 text-xs">₹{p.price}</p>
              </div>
              <button
                onClick={() => onRemoveProduct(p.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
              >
                <Trash size={16} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Add Button / Limit Message */}
      {isLimitReached ? (
        <div className="p-3 bg-amber-50 text-amber-700 text-xs rounded-lg text-center font-medium border border-amber-100">
           Limit reached for Quick Setup. Add unlimited products from Dashboard.
        </div>
      ) : (
        !isAdding && (
            <button
                onClick={() => setIsAdding(true)}
                className="w-full py-3 border-2 border-dashed border-[#8A63D2]/30 text-[#8A63D2] font-medium rounded-xl hover:bg-purple-50 transition-colors flex items-center justify-center gap-2"
            >
                <Plus size={18} /> Add Product
            </button>
        )
      )}

      {/* Add Form (Overlay/Inline) */}
      {isAdding && (
        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 animate-in zoom-in-95 duration-200">
            <div className="flex justify-between items-center mb-3">
                <h4 className="font-semibold text-gray-800 text-sm">New Product</h4>
                <button onClick={() => setIsAdding(false)} className="text-gray-400 hover:text-gray-600">
                    <X size={16} />
                </button>
            </div>

            <div className="space-y-3">
                <div className="flex gap-3">
                     {/* Image Input */}
                     <label className="w-20 h-20 bg-white border border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-100 flex-shrink-0 relative overflow-hidden">
                        {newProduct.image ? (
                            <Image src={newProduct.image} alt="" fill className="object-cover" />
                        ) : (
                            <div className="text-center">
                                <ImageIcon size={18} className="mx-auto text-gray-400" />
                                <span className="text-[10px] text-gray-500 block mt-1">Photo</span>
                            </div>
                        )}
                        <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                     </label>

                     <div className="flex-grow space-y-3">
                        <input
                            placeholder="Product Name"
                            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#8A63D2]/20 outline-none"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                        />
                        <input
                            placeholder="Price (₹)"
                            type="number"
                            className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#8A63D2]/20 outline-none"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                        />
                     </div>
                </div>

                <textarea
                     placeholder="Short Description (Optional)"
                     rows={2}
                     className="w-full px-3 py-2 text-sm border rounded-lg focus:ring-2 focus:ring-[#8A63D2]/20 outline-none resize-none"
                     value={newProduct.description}
                     onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                />

                <button
                    onClick={handleSave}
                    disabled={!newProduct.name || !newProduct.price}
                    className="w-full py-2 bg-[#8A63D2] text-white rounded-lg text-sm font-medium hover:bg-[#7854bc] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Save Product
                </button>
            </div>
        </div>
      )}
    </div>
  );
}
