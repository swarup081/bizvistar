// src/components/ui/EmptyState.js
import { ShoppingBag } from 'lucide-react';

export const EmptyState = ({ 
  icon: Icon = ShoppingBag, 
  title = "No items found", 
  description = "Start adding items to your collection.", 
  action 
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center px-4">
      <div className="bg-gray-50 p-4 rounded-full mb-4">
        <Icon className="w-8 h-8 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-1">{title}</h3>
      <p className="text-gray-500 max-w-sm mb-6 text-sm">{description}</p>
      {action}
    </div>
  );
};