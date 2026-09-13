'use client';

import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function AdminStatCard({ title, value, change, period, icon: Icon, accent = '#8A63D2' }) {
  const changeNum = parseFloat(change) || 0;
  const isPositive = changeNum > 0;
  const isNeutral = changeNum === 0;

  return (
    <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-shadow h-full flex flex-col justify-between">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          {Icon && (
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${accent}15` }}>
              <Icon size={18} style={{ color: accent }} />
            </div>
          )}
          <p className="text-sm font-medium text-gray-500">{title}</p>
        </div>
      </div>

      <div>
        <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
        {change !== undefined && (
          <div className="flex items-center gap-1.5">
            {isNeutral ? (
              <Minus size={14} className="text-gray-400" />
            ) : isPositive ? (
              <TrendingUp size={14} className="text-emerald-500" />
            ) : (
              <TrendingDown size={14} className="text-red-500" />
            )}
            <span className={`text-xs font-semibold ${isNeutral ? 'text-gray-400' : isPositive ? 'text-emerald-600' : 'text-red-600'}`}>
              {change}
            </span>
            {period && <span className="text-xs text-gray-400">{period}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
