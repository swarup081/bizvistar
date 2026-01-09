"use client";
import React from 'react';
import { Globe } from 'lucide-react';

export default function TopPages({ pages }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
      <h3 className="text-lg font-bold text-gray-900 mb-6 font-sans">Most Visited Pages</h3>
      <div className="flex flex-col gap-4">
        {pages.length === 0 ? (
          <p className="text-gray-400 text-sm text-center py-4">No traffic data yet.</p>
        ) : (
          pages.map((page, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 rounded-xl hover:bg-gray-50 transition-colors">
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
                  <Globe size={18} />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-900 font-sans truncate max-w-[200px]" title={page.path}>
                    {page.path}
                  </p>
                  <p className="text-xs text-gray-500 font-sans">Rank #{idx + 1}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold text-gray-900 font-sans">{page.views} Views</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
