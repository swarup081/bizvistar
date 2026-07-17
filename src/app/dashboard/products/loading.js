export default function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto space-y-6 pb-10 animate-pulse">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="h-8 w-40 bg-gray-200 rounded-lg mb-3"></div>
          <div className="h-5 w-56 bg-gray-100 rounded-lg"></div>
        </div>
        <div className="h-10 w-36 bg-gray-200 rounded-xl"></div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
            <div className="h-40 bg-gray-200"></div>
            <div className="p-4 space-y-3">
              <div className="h-5 w-3/4 bg-gray-200 rounded"></div>
              <div className="h-4 w-1/2 bg-gray-100 rounded"></div>
              <div className="h-6 w-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
