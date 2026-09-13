// src/components/ui/QuantityCounter.js
import React from 'react';
import { Minus, Plus } from 'lucide-react';

export const QuantityCounter = ({ value, onIncrease, onDecrease, className, size = 'md' }) => {
  const sizes = {
    sm: "h-8 text-xs",
    md: "h-10 text-sm",
    lg: "h-12 text-base",
  };

  return (
    <div className={`flex items-center border border-gray-300 rounded-md overflow-hidden ${className}`}>
      <button 
        type="button"
        onClick={onDecrease}
        className={`px-3 hover:bg-gray-100 transition-colors flex items-center justify-center ${sizes[size]}`}
        disabled={value <= 1}
      >
        <Minus size={size === 'sm' ? 12 : 16} />
      </button>
      
      <span className={`px-2 min-w-[3ch] text-center font-medium ${sizes[size]} flex items-center justify-center border-x border-gray-100`}>
        {value}
      </span>

      <button 
        type="button"
        onClick={onIncrease}
        className={`px-3 hover:bg-gray-100 transition-colors flex items-center justify-center ${sizes[size]}`}
      >
        <Plus size={size === 'sm' ? 12 : 16} />
      </button>
    </div>
  );
};