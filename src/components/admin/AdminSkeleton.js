'use client';

export default function AdminSkeleton() {
  return (
    <div className="animate-pulse space-y-8">
      {/* Header skeleton */}
      <div className="flex justify-between items-end">
        <div className="space-y-2">
          <div className="h-7 w-64 bg-gray-200 rounded-lg" />
          <div className="h-4 w-48 bg-gray-100 rounded" />
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-full" />
      </div>

      {/* Stat cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 h-[120px]">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-gray-100 rounded-xl" />
              <div className="h-3 w-16 bg-gray-100 rounded" />
            </div>
            <div className="h-6 w-24 bg-gray-200 rounded mb-2" />
            <div className="h-3 w-16 bg-gray-100 rounded" />
          </div>
        ))}
      </div>

      {/* Table skeleton */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <div className="h-5 w-40 bg-gray-200 rounded" />
        </div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-4 py-3 border-b border-gray-50 flex items-center gap-4">
            <div className="h-4 w-20 bg-gray-100 rounded" />
            <div className="h-4 w-32 bg-gray-100 rounded" />
            <div className="h-4 w-24 bg-gray-100 rounded" />
            <div className="h-4 w-16 bg-gray-100 rounded ml-auto" />
          </div>
        ))}
      </div>
    </div>
  );
}
