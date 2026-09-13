// src/components/ui/Accordion.js
'use client';
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export const Accordion = ({ items, allowMultiple = false }) => {
  const [openIndexes, setOpenIndexes] = useState({});

  const toggle = (index) => {
    setOpenIndexes(prev => ({
      ...(allowMultiple ? prev : {}), // Close others if not multiple
      [index]: !prev[index]
    }));
  };

  return (
    <div className="border rounded-lg divide-y divide-gray-200 bg-white">
      {items.map((item, i) => (
        <div key={i} className="group">
          <button
            onClick={() => toggle(i)}
            className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-50 transition-colors"
          >
            <span className="font-medium text-gray-900">{item.title}</span>
            <ChevronDown 
              className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${openIndexes[i] ? 'rotate-180' : ''}`} 
            />
          </button>
          <div 
            className={`overflow-hidden transition-all duration-300 ease-in-out ${openIndexes[i] ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
          >
            <div className="p-4 pt-0 text-gray-600 text-sm leading-relaxed">
              {item.content}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};