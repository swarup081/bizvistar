// src/components/ui/Input.js
import React from 'react';
import { Search, ChevronDown, Upload } from 'lucide-react';

// Standard Text Input
export const Input = ({ label, error, className = '', ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <input
      className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : ''} ${className}`}
      {...props}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

// Text Area
export const TextArea = ({ label, rows = 3, className = '', ...props }) => (
  <div className="mb-4">
    {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
    <textarea
      rows={rows}
      className={`w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${className}`}
      {...props}
    />
  </div>
);

// Searchable Select (Dropdown)
export const Select = ({ label, options = [], value, onChange, placeholder = "Select..." }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [search, setSearch] = React.useState("");
  const ref = React.useRef(null);

  const filtered = options.filter(opt => opt.label.toLowerCase().includes(search.toLowerCase()));
  const selectedLabel = options.find(opt => opt.value === value)?.label || placeholder;

  return (
    <div className="mb-4 relative" ref={ref}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md flex justify-between items-center focus:ring-2 focus:ring-blue-500"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>{selectedLabel}</span>
        <ChevronDown size={16} className="text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-gray-200">
            <div className="relative">
              <Search size={14} className="absolute left-2 top-2 text-gray-400"/>
              <input 
                autoFocus
                placeholder="Search..." 
                className="w-full pl-8 pr-2 py-1 text-xs border border-gray-200 rounded"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>
          <ul className="overflow-y-auto">
            {filtered.map(opt => (
              <li 
                key={opt.value} 
                className="px-3 py-2 text-sm hover:bg-blue-50 cursor-pointer text-gray-700 hover:text-blue-600"
                onClick={() => { onChange(opt.value); setIsOpen(false); setSearch(""); }}
              >
                {opt.label}
              </li>
            ))}
            {filtered.length === 0 && <li className="p-3 text-xs text-gray-400">No results found</li>}
          </ul>
        </div>
      )}
    </div>
  );
};