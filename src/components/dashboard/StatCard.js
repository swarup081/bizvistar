import React from "react";
import { ArrowUp } from "lucide-react";

export default function StatCard({ title, value, change, period, icon: Icon }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm flex flex-col justify-between h-[180px]">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50 text-gray-900 border border-gray-100">
          <Icon className="h-6 w-6" />
        </div>
        <span className="text-base font-bold text-gray-700 font-mona font-medium text-gray-400 not-italic">{title}</span>
      </div>
      <div>
        <h3 className="text-4xl font-mona font-medium text-gray-700 not-italic tracking-tight">{value}</h3>
        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="flex items-center font-bold text-[#4CAF50] font-sans">
            <ArrowUp className="mr-1 h-4 w-4" strokeWidth={3} />
            {change}
          </span>
          <span className="text-gray-400 font-medium font-sans">{period}</span>
        </div>
      </div>
    </div>
  );
}
