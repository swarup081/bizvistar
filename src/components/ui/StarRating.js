// src/components/ui/StarRating.js
import { Star } from 'lucide-react';

export const StarRating = ({ rating = 5, max = 5, size = 16, className }) => {
  return (
    <div className={`flex gap-1 text-yellow-500 ${className}`}>
      {[...Array(max)].map((_, i) => (
        <Star 
          key={i} 
          size={size} 
          fill={i < rating ? "currentColor" : "none"} 
          strokeWidth={i < rating ? 0 : 1.5}
          className={i < rating ? "text-yellow-500" : "text-gray-300"}
        />
      ))}
    </div>
  );
};