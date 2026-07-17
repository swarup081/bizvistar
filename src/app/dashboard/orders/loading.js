export default function OrdersLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="h-8 w-32 bg-gray-200 rounded-lg mb-3"></div>
          <div className="h-5 w-56 bg-gray-100 rounded-lg"></div>
        </div>
      </div>

      {/* Table-like skeleton */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
        <div className="h-12 bg-gray-200 border-b border-gray-100"></div>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-4 border-b border-gray-100 last:border-0">
            <div className="h-5 w-20 bg-gray-200 rounded"></div>
            <div className="h-5 w-32 bg-gray-200 rounded flex-1"></div>
            <div className="h-5 w-20 bg-gray-200 rounded"></div>
            <div className="h-5 w-16 bg-gray-100 rounded"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
