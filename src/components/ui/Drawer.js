// src/components/ui/Drawer.js
'use client';
import { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

export const Drawer = ({ isOpen, onClose, title, children, position = 'right' }) => {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = 'unset';
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-50 transition-opacity",
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )} 
        onClick={onClose}
      />

      {/* Panel */}
      <div className={cn(
        "fixed top-0 bottom-0 z-50 w-full max-w-md bg-white shadow-2xl transition-transform duration-300 ease-in-out p-6 flex flex-col",
        position === 'right' ? "right-0" : "left-0",
        isOpen ? "translate-x-0" : (position === 'right' ? "translate-x-full" : "-translate-x-full")
      )}>
        <div className="flex items-center justify-between mb-6 border-b pb-4">
          <h2 className="text-xl font-serif font-bold">{title}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full">
            <X size={20} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </>
  );
};