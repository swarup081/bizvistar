'use client';

import { X, TrendingUp, Package, Tag, DollarSign, Calendar } from 'lucide-react';
import * as Dialog from '@radix-ui/react-dialog';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export default function ProductDrawer({ product, isOpen, onClose }) {
  if (!product) return null;

  // Check if we have any real data (non-zero)
  const hasAnalyticsData = product.analytics.some(d => d.value > 0);

  return (
    <Dialog.Root open={isOpen} onOpenChange={onClose}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 transition-opacity" />
        <Dialog.Content 
          className="fixed top-0 right-0 h-[100dvh] w-[450px] max-w-[90vw] bg-white/95 backdrop-blur-md shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l border-white/20 flex flex-col focus:outline-none"
          style={{ animation: 'slideIn 0.3s ease-out' }}
        >
          {/* Header */}
          <div className="flex-none bg-white/50 border-b border-gray-100 px-6 py-4 flex items-center justify-between z-10">
            <div>
                 <Dialog.Title className="text-lg font-bold text-gray-900">Product Details</Dialog.Title>
                 <p className="text-xs text-gray-500 font-mono mt-1">ID: {product.id}</p>
            </div>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-500 transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            
            {/* Product Header Info */}
            <div className="flex flex-col items-center text-center">
              <div className="h-40 w-40 rounded-2xl bg-gray-50 border border-gray-100 p-1 mb-5 shadow-sm">
                <img 
                  src={product.image_url || 'https://via.placeholder.com/150'} 
                  alt={product.name} 
                  className="h-full w-full object-cover rounded-xl"
                />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.name}</h2>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 uppercase tracking-wide">
                {product.categoryName}
              </span>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
               <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1 hover:border-gray-200 transition-colors">
                 <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                   <DollarSign size={14} /> Price
                 </div>
                 <div className="text-xl font-bold text-gray-900">${Number(product.price).toFixed(2)}</div>
               </div>
               <div className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-1 hover:border-gray-200 transition-colors">
                 <div className="flex items-center gap-2 text-gray-500 text-xs uppercase tracking-wider font-semibold">
                   <Package size={14} /> Stock
                 </div>
                 <div className="text-xl font-bold text-gray-900">
                    {product.stock === 'Unlimited' ? '∞ Unlimited' : product.stock}
                 </div>
                 <div className={`text-xs font-medium ${
                   product.stockStatus === 'Out Of Stock' ? 'text-red-600' :
                   product.stockStatus === 'Low Stock' ? 'text-orange-600' : 
                   product.stockStatus === 'Unlimited' ? 'text-purple-600' : 'text-green-600'
                 }`}>
                   {product.stockStatus}
                 </div>
               </div>
            </div>

            {/* Analytics Section - Only show if data exists or placeholder msg */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                  <TrendingUp size={18} className="text-[#8A63D2]" />
                  Sales Performance
                </h3>
                <span className="text-xs text-gray-500">Last 7 Days</span>
              </div>
              
              <div className="h-48 w-full bg-white rounded-xl border border-gray-100 p-4 shadow-sm flex items-center justify-center relative">
                {hasAnalyticsData ? (
                    <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={product.analytics}>
                        <defs>
                        <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8A63D2" stopOpacity={0.1}/>
                            <stop offset="95%" stopColor="#8A63D2" stopOpacity={0}/>
                        </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis 
                        dataKey="date" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{fontSize: 10, fill: '#999'}} 
                        tickFormatter={(val) => val.slice(5)} // Show MM-DD
                        />
                        <Tooltip 
                        contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                        />
                        <Area 
                        type="monotone" 
                        dataKey="value" 
                        stroke="#8A63D2" 
                        fillOpacity={1} 
                        fill="url(#colorValue)" 
                        strokeWidth={2}
                        />
                    </AreaChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="text-center text-gray-400 text-sm">
                        <p>No sales data recorded yet.</p>
                    </div>
                )}
              </div>
            </div>

            {/* Description */}
            <div className="space-y-3 pb-6">
              <h3 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Description</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                {product.description || 'No description available for this product.'}
              </p>
            </div>

          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
