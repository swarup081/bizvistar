'use client';

import { useState } from 'react';
import { Plus, X, Loader2, Trash2, Edit2, Check, Save } from 'lucide-react';
import { addCategory } from '@/app/actions/productActions';

export default function CategoryManager({ categories, onUpdate }) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setLoading(true);
    try {
      const res = await addCategory(newCategoryName);
      if (res.success) {
        setNewCategoryName('');
        onUpdate();
      } else {
        alert('Failed: ' + res.error);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-lg font-bold text-gray-900">Manage Categories</h2>
        <p className="text-sm text-gray-500 mt-1">Create categories to organize your products. Assign products to categories from the main list or edit product dialog.</p>
      </div>

      {/* Add New */}
      <form onSubmit={handleAddCategory} className="flex gap-3 mb-8">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New Category Name (e.g., Summer Collection)"
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A63D2]/20 text-sm"
        />
        <button
          type="submit"
          disabled={loading || !newCategoryName.trim()}
          className="px-6 py-2 bg-[#8A63D2] text-white rounded-lg font-medium hover:bg-[#7854bc] disabled:opacity-50 transition-colors flex items-center gap-2 text-sm"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={18} />}
          Add Category
        </button>
      </form>

      {/* List */}
      <div className="space-y-3">
        {categories.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-200">
             <p className="text-gray-500 italic">No categories found.</p>
             <p className="text-xs text-gray-400 mt-1">Add one above to get started.</p>
          </div>
        ) : (
          categories.map(cat => (
            <div key={cat.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-purple-50 flex items-center justify-center text-[#8A63D2] font-bold text-xs">
                    {cat.name.charAt(0).toUpperCase()}
                 </div>
                 <span className="font-medium text-gray-700">{cat.name}</span>
              </div>

              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Edit placeholder */}
                {/*
                <button className="p-2 text-gray-400 hover:text-blue-500 bg-gray-50 rounded-lg" title="Rename">
                   <Edit2 size={16} />
                </button>
                */}
                <button className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 rounded-lg hover:bg-red-50" title="Delete (Coming Soon)">
                   <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
