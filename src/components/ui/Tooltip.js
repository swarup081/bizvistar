// src/components/ui/Tooltip.js
'use client';
import { useState } from 'react';

export const Tooltip = ({ children, content, position = 'bottom' }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div 
      className="relative flex items-center"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {children}
      
      {isVisible && (
        <div className={`absolute z-50 w-max max-w-xs bg-gray-900 text-white text-xs px-2 py-1 rounded shadow-lg
          ${position === 'bottom' ? 'top-full mt-2 left-1/2 -translate-x-1/2' : ''}
          ${position === 'top' ? 'bottom-full mb-2 left-1/2 -translate-x-1/2' : ''}
          ${position === 'right' ? 'left-full ml-2 top-1/2 -translate-y-1/2' : ''}
        `}>
          {content}
          {/* Optional Arrow */}
          <div className={`absolute w-2 h-2 bg-gray-900 rotate-45
            ${position === 'bottom' ? '-top-1 left-1/2 -translate-x-1/2' : ''}
            ${position === 'top' ? '-bottom-1 left-1/2 -translate-x-1/2' : ''}
          `}/>
        </div>
      )}
    </div>
  );
};