'use client';

import { useState } from 'react';
import { Plus, X, Loader2, Trash2 } from 'lucide-react';
import { addCategory } from '@/app/actions/productActions';

export default function CategoryManager({ categories, onUpdate }) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return;

    setLoading(true);
    try {
      const res = await addCategory(newCategoryName);
      if (res.success) {
        setNewCategoryName('');
        onUpdate(); // Trigger refresh in parent
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
      <h2 className="text-lg font-bold text-gray-900 mb-4">Manage Categories</h2>

      {/* Add New */}
      <form onSubmit={handleAddCategory} className="flex gap-3 mb-8">
        <input
          type="text"
          value={newCategoryName}
          onChange={(e) => setNewCategoryName(e.target.value)}
          placeholder="New Category Name"
          className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8A63D2]/20"
        />
        <button
          type="submit"
          disabled={loading || !newCategoryName.trim()}
          className="px-6 py-2 bg-[#8A63D2] text-white rounded-lg font-medium hover:bg-[#7854bc] disabled:opacity-50 transition-colors flex items-center gap-2"
        >
          {loading ? <Loader2 size={16} className="animate-spin" /> : <Plus size={18} />}
          Add
        </button>
      </form>

      {/* List */}
      <div className="space-y-2">
        {categories.length === 0 ? (
          <p className="text-gray-500 italic text-center py-4">No categories found.</p>
        ) : (
          categories.map(cat => (
            <div key={cat.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100 group">
              <span className="font-medium text-gray-700">{cat.name}</span>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Delete not implemented in this cycle but UI placeholder */}
                <button className="p-1 text-gray-400 hover:text-red-500" title="Delete (Coming Soon)">
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
