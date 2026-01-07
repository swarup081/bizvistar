"use client";
import React from 'react';
import { ShoppingBag } from 'lucide-react';

export default function TopProducts({ products }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6 font-sans">Top Selling Products</h3>
      <div className="flex flex-col gap-4">
        {products.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">No sales data yet.</p>
        ) : (
          products.map((product, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                  <ShoppingBag size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 font-sans">{product.name}</p>
                  <p className="text-xs text-gray-500 font-sans">Rank #{idx + 1}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 font-sans">{product.sales} Units</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
