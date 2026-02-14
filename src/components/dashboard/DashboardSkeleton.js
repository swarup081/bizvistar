import React from "react";

export default function DashboardSkeleton() {
  return (
    <div className="font-sans not-italic pb-8 animate-pulse">
      <div className="grid grid-cols-1 gap-4 md:gap-8 md:grid-cols-4">

        {/* Header */}
        <div className="col-span-1 md:col-span-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded-md"></div>
            <div className="h-4 w-64 bg-gray-200 rounded-md"></div>
          </div>
          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto">
             <div className="h-10 w-full md:w-64 bg-gray-200 rounded-full"></div>
             <div className="h-10 w-24 bg-gray-200 rounded-full"></div>
             <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
          </div>
        </div>

        {/* Metrics Cards */}
        <div className="col-span-1 md:col-span-4 grid grid-cols-3 gap-3 md:gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-gray-200 rounded-2xl w-full"></div>
            ))}
        </div>

        {/* Traffic & Best Sellers */}
        <div className="col-span-1 md:col-span-1 grid grid-cols-2 md:flex md:flex-col gap-3 md:gap-8">
             <div className="h-[250px] md:h-[400px] bg-gray-200 rounded-2xl"></div>
             <div className="h-[250px] md:h-full flex-1 bg-gray-200 rounded-2xl"></div>
        </div>

        {/* Recent Sales Table */}
        <div className="col-span-1 md:col-span-3 h-[500px] bg-gray-200 rounded-2xl"></div>

      </div>
    </div>
  );
}
