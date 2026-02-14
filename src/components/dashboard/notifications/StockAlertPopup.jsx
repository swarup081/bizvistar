'use client';

import * as Dialog from '@radix-ui/react-dialog';
import { X, AlertTriangle, Loader2, Check } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { syncWebsiteDataClient } from '@/lib/websiteSync';
import { markNotificationRead } from '@/app/actions/notificationActions';

export default function StockAlertPopup({ notification, isOpen, onClose }) {
  const [loading, setLoading] = useState(false);
  const [stock, setStock] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    if (notification && notification.data) {
        // Pre-fill with current stock from notification if available
        setStock(String(notification.data.current_stock || '0'));
    }
  }, [notification]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!notification || !notification.data || !notification.data.product_id) return;
    
    setLoading(true);
    setError(null);

    try {
        const newStock = parseInt(stock);
        if (isNaN(newStock) || newStock < 0) {
            throw new Error("Please enter a valid stock number.");
        }

        // 1. Update Product Stock in DB
        const { error: updateError } = await supabase
            .from('products')
            .update({ stock: newStock })
            .eq('id', notification.data.product_id);

        if (updateError) throw updateError;

        // 2. Sync Website Data
        await syncWebsiteDataClient(notification.website_id);

        // 3. Mark Notification as Read
        await markNotificationRead(notification.id);

        onClose(); // Close popup
    } catch (err) {
        console.error("Stock update error:", err);
        setError(err.message || "Failed to update stock.");
    } finally {
        setLoading(false);
    }
  };

  if (!notification) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] transition-opacity animate-in fade-in duration-200" />
        <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm bg-white rounded-2xl shadow-2xl z-[110] focus:outline-none overflow-hidden font-sans animate-in zoom-in-95 duration-200">
            
            {/* Header with Alert Icon */}
            <div className={`p-6 pb-2 text-center relative ${notification.type === 'out_of_stock' ? 'text-red-600' : 'text-orange-600'}`}>
                <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4 ${notification.type === 'out_of_stock' ? 'bg-red-100' : 'bg-orange-100'}`}>
                    <AlertTriangle size={24} />
                </div>
                <Dialog.Title className="text-lg font-bold text-gray-900 mb-1">
                    {notification.title}
                </Dialog.Title>
                <Dialog.Description className="text-sm text-gray-500">
                    {notification.message}
                </Dialog.Description>
                
                <Dialog.Close asChild>
                    <button className="absolute top-4 right-4 p-2 text-gray-400 hover:bg-gray-100 rounded-full transition-colors">
                        <X size={18} />
                    </button>
                </Dialog.Close>
            </div>

            {/* Form */}
            <form onSubmit={handleUpdate} className="p-6 pt-2">
                <div className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm text-gray-600">
                        <p className="font-medium text-gray-900 mb-1">Update Stock</p>
                        <p className="text-xs mb-2">Update the inventory count for <strong>{notification.data.product_name}</strong> immediately.</p>
                        
                        <div className="relative">
                            <input 
                                type="number" 
                                value={stock} 
                                onChange={(e) => setStock(e.target.value)} 
                                min="0"
                                className="w-full p-2 pr-12 border border-gray-300 rounded-md outline-none focus:border-[#8A63D2] focus:ring-1 focus:ring-[#8A63D2] transition-all font-medium text-gray-900"
                                placeholder="New Qty"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 font-medium">Qty</span>
                        </div>
                    </div>

                    {error && (
                        <p className="text-xs text-red-600 bg-red-50 p-2 rounded border border-red-100">{error}</p>
                    )}

                    <div className="flex gap-3">
                        <button 
                            type="button" 
                            onClick={onClose}
                            className="flex-1 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
                        >
                            Dismiss
                        </button>
                        <button 
                            type="submit" 
                            disabled={loading}
                            className={`flex-1 py-2.5 rounded-xl text-sm font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-70 ${notification.type === 'out_of_stock' ? 'bg-red-600 hover:bg-red-700 shadow-red-200' : 'bg-orange-500 hover:bg-orange-600 shadow-orange-200'}`}
                        >
                            {loading ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                            Update
                        </button>
                    </div>
                </div>
            </form>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
