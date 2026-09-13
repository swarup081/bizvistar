'use client';

import { useState } from 'react';
import { Search, ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function AdminDataTable({ 
  columns, 
  data, 
  total, 
  page, 
  pageSize, 
  onPageChange, 
  onSearch, 
  searchPlaceholder = 'Search...',
  onRowClick,
  actions,
  emptyMessage = 'No data found',
  filterOptions,
  activeFilter,
  onFilterChange
}) {
  const [searchValue, setSearchValue] = useState('');
  const totalPages = Math.ceil(total / pageSize);

  const handleSearch = (val) => {
    setSearchValue(val);
    onSearch?.(val);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Search */}
          {onSearch && (
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchValue}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={searchPlaceholder}
                className="h-9 w-full sm:w-56 rounded-lg border border-gray-200 bg-white pl-9 pr-8 text-sm outline-none focus:border-[#8A63D2] focus:ring-1 focus:ring-[#8A63D2]"
              />
              {searchValue && (
                <button onClick={() => handleSearch('')} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          {/* Filters */}
          {filterOptions && (
            <div className="flex gap-1.5">
              {filterOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => onFilterChange?.(opt.value)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    activeFilter === opt.value
                      ? 'bg-[#8A63D2] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Pagination info */}
        <p className="text-xs text-gray-400 font-medium shrink-0">
          {total > 0 ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)} of ${total}` : '0 results'}
        </p>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 bg-gray-50/60">
              {columns.map((col) => (
                <th key={col.key} className={`px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider ${col.className || ''}`}>
                  {col.label}
                </th>
              ))}
              {actions && <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan={columns.length + (actions ? 1 : 0)} className="px-4 py-12 text-center text-sm text-gray-400">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((row, idx) => (
                <tr
                  key={row.id || idx}
                  onClick={() => onRowClick?.(row)}
                  className={`border-b border-gray-50 transition-colors ${onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}`}
                >
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 text-gray-700 ${col.className || ''}`}>
                      {col.render ? col.render(row[col.key], row) : row[col.key]}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="p-3 border-t border-gray-100 flex items-center justify-center gap-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          {[...Array(Math.min(totalPages, 5))].map((_, i) => {
            const pageNum = i + 1;
            return (
              <button
                key={pageNum}
                onClick={() => onPageChange(pageNum)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-colors ${
                  page === pageNum ? 'bg-[#8A63D2] text-white' : 'hover:bg-gray-100 text-gray-600'
                }`}
              >
                {pageNum}
              </button>
            );
          })}
          {totalPages > 5 && <span className="text-gray-400 text-xs">...</span>}
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-1.5 rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
