// src/components/ui/CartItem.js
import { Trash2 } from 'lucide-react';
import { QuantityCounter } from './QuantityCounter';

export const CartItem = ({ image, title, price, quantity, onIncrease, onDecrease, onRemove }) => {
  return (
    <div className="flex gap-4 py-4 border-b border-gray-100 last:border-0">
      <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
        <img src={image} alt={title} className="h-full w-full object-cover" />
      </div>

      <div className="flex flex-1 flex-col">
        <div>
          <div className="flex justify-between text-base font-medium text-gray-900">
            <h3 className="line-clamp-1"><a href="#">{title}</a></h3>
            <p className="ml-4">${(price * quantity).toFixed(2)}</p>
          </div>
          <p className="mt-1 text-sm text-gray-500">${price} each</p>
        </div>
        <div className="flex flex-1 items-end justify-between text-sm">
          <QuantityCounter value={quantity} onIncrease={onIncrease} onDecrease={onDecrease} size="sm" />
          <button type="button" onClick={onRemove} className="font-medium text-red-600 hover:text-red-500 flex items-center gap-1">
            <Trash2 size={14} /> Remove
          </button>
        </div>
      </div>
    </div>
  );
};