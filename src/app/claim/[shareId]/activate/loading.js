export default function Loading() {
  return (
    <div className="min-h-screen bg-[#F5F7FD] flex flex-col items-center justify-center p-4">
      <div className="flex flex-col items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-[#8A63D2]/10 flex items-center justify-center">
          <div className="w-10 h-10 border-4 border-[#8A63D2] border-t-transparent rounded-full animate-spin" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Setting Up Your Website</h1>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      </div>
    </div>
  );
}
