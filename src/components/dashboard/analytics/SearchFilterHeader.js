"use client";
import React, { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, Filter } from 'lucide-react';

export default function SearchFilterHeader({ dateRange, setDateRange }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    const term = searchTerm.toLowerCase();

    // Map of search terms to element IDs
    const idMap = {
        'revenue': 'revenue-chart',
        'sales': 'overview-cards',
        'orders': 'overview-cards',
        'visitors': 'overview-cards',
        'target': 'monthly-target',
        'monthly': 'monthly-target',
        'categories': 'top-categories',
        'category': 'top-categories',
        'active': 'active-users',
        'users': 'active-users',
        'funnel': 'funnel-chart',
        'conversion': 'funnel-chart',
        'ai': 'ai-insights',
        'insights': 'ai-insights',
        'prediction': 'ai-insights'
    };

    let targetId = null;
    for (const [key, val] of Object.entries(idMap)) {
        if (term.includes(key) || key.includes(term)) {
            targetId = val;
            break;
        }
    }

    if (targetId) {
        const el = document.getElementById(targetId);
        if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });

            // Remove blink class if it exists
            el.classList.remove('blink-theme');

            // Force reflow
            void el.offsetWidth;

            // Add blink class
            el.classList.add('blink-theme');

            // Remove after animation completes
            setTimeout(() => {
                el.classList.remove('blink-theme');
            }, 2000);
        }
    }
  };

  const rangeLabels = {
    '7d': 'Last 7 Days',
    '30d': 'Last 30 Days',
    '90d': 'Last 90 Days',
    'year': 'This Year'
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full mb-6 mt-2">
      <div className="flex-shrink-0">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analytics</h1>
      </div>

      <div className="flex flex-row items-center gap-3 w-full sm:w-auto">
        {/* Search Bar */}
        <form onSubmit={handleSearch} className="relative flex-grow sm:flex-grow-0">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-[#8A63D2] focus:border-transparent text-sm transition-colors sm:w-64 md:w-80 shadow-inner"
            placeholder="Search active users, revenue..."
          />
        </form>

        {/* Filter Dropdown */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className="flex items-center justify-center gap-2 w-auto rounded-full border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
            >
               <div className="flex items-center gap-2 whitespace-nowrap">
                   <Filter size={16} className="text-[#8A63D2] hidden sm:block"/>
                   {rangeLabels[dateRange]}
               </div>
               <ChevronDown className="h-4 w-4 text-gray-500" />
            </button>
            {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 z-50 overflow-hidden">
                    {Object.keys(rangeLabels).map((key) => (
                        <button
                            key={key}
                            onClick={() => { setDateRange(key); setIsDropdownOpen(false); }}
                            className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                                dateRange === key ? 'text-[#8A63D2] font-medium bg-purple-50' : 'text-gray-700'
                            }`}
                        >
                            {rangeLabels[key]}
                        </button>
                    ))}
                </div>
            )}
        </div>
      </div>
      <style jsx global>{`
          @keyframes themeBlink {
              0% { box-shadow: 0 0 0 0 rgba(138, 99, 210, 0); }
              50% { box-shadow: 0 0 0 8px rgba(138, 99, 210, 0.4); border-color: #8A63D2; }
              100% { box-shadow: 0 0 0 0 rgba(138, 99, 210, 0); }
          }
          .blink-theme {
              animation: themeBlink 1.5s ease-out;
              transition: border-color 0.3s ease;
          }
      `}</style>
    </div>
  );
}
