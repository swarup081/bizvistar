// src/components/ui/Badge.js
import React from 'react';
import { cn } from '@/lib/utils';

export const Badge = ({ children, variant = 'primary', className, size = 'md' }) => {
  const variants = {
    primary: "bg-black text-white", // Cart count
    secondary: "bg-gray-100 text-gray-800",
    outline: "border border-gray-900 text-gray-900", // "An Invitation" style
    accent: "bg-[#D4A373] text-white", // Aurora Gold
  };

  const sizes = {
    sm: "px-1.5 py-0.5 text-[10px]", // Tiny cart badge
    md: "px-2.5 py-0.5 text-xs",     // Category tag
    lg: "px-4 py-1 text-sm tracking-widest uppercase", // Hero tag
  };

  return (
    <span className={cn("inline-flex items-center justify-center font-bold rounded-full", variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};