export default function DashboardLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-10 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded-lg mb-3"></div>
          <div className="h-5 w-72 bg-gray-100 rounded-lg"></div>
        </div>
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-50 rounded-2xl p-5 border border-gray-100">
            <div className="h-4 w-20 bg-gray-200 rounded mb-3"></div>
            <div className="h-8 w-28 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 h-64"></div>
        <div className="bg-gray-50 rounded-2xl p-6 border border-gray-100 h-64"></div>
      </div>
    </div>
  );
}
