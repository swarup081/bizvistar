"use client";
import React, { useState } from "react";
import { ChevronDown, ArrowRight } from "lucide-react";
import { isAfter, subDays, startOfWeek, startOfMonth, startOfYear } from "date-fns";
import Link from "next/link";
import { useRouter } from "next/navigation";

const StatusBadge = ({ status }) => {
  const styles = {
    delivered: "bg-green-50 text-green-600 border border-green-100",
    shipped: "bg-blue-50 text-blue-600 border border-blue-100",
    paid: "bg-blue-50 text-blue-600 border border-blue-100", 
    pending: "bg-yellow-50 text-yellow-600 border border-yellow-100",
    canceled: "bg-red-50 text-red-600 border border-red-100",
  };
  
  const cleanStatus = status?.toLowerCase().trim() || "pending";
  const style = styles[cleanStatus] || "bg-gray-50 text-gray-600";

  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] md:text-xs font-bold capitalize whitespace-nowrap ${style}`}>
      {status}
    </span>
  );
};

export default function RecentSalesTable({ orders = [], isSearching = false }) {
  const [timeFilter, setTimeFilter] = useState("week"); // week, month, year
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const router = useRouter();

  // Filter Logic
  // If searching, ignore time filter to show matching results from history
  const filteredOrders = isSearching ? orders : orders.filter(order => {
    const date = new Date(order.created_at);
    const now = new Date();
    
    if (timeFilter === "week") {
        return isAfter(date, subDays(now, 7));
    } else if (timeFilter === "month") {
        return isAfter(date, subDays(now, 30));
    } else if (timeFilter === "year") {
        return isAfter(date, startOfYear(now));
    }
    return true;
  });

  const displayOrders = filteredOrders.slice(0, 5); // Limit to top 5

  const labels = {
      week: "This Week",
      month: "This Month",
      year: "This Year"
  };

  const formatCurrency = (val) => {
      return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
      }).format(val);
  };

  const handleManage = (orderId) => {
      router.push(`/dashboard/orders?id=${orderId}`);
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between shrink-0">
        <h3 className="text-lg font-bold text-gray-900 font-sans not-italic">
            {isSearching ? "Search Results" : "Recent Orders"}
        </h3>
        {!isSearching && (
            <div className="relative">
                <button 
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 font-sans"
                >
                    {labels[timeFilter]}
                    <ChevronDown className="h-4 w-4 text-gray-500" />
                </button>
                
                {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-32 bg-white rounded-xl shadow-lg border border-gray-100 z-20 overflow-hidden">
                        {Object.keys(labels).map(key => (
                            <button
                                key={key}
                                onClick={() => { setTimeFilter(key); setIsDropdownOpen(false); }}
                                className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 ${timeFilter === key ? 'text-purple-600 font-medium' : 'text-gray-700'}`}
                            >
                                {labels[key]}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        )}
      </div>

      {/* Internal Scrolling Wrapper (Hidden overflow, width auto to fit) */}
      <div className="flex-1 w-full overflow-hidden">
        <table className="w-full border-collapse text-left font-sans table-fixed">
          <thead className="bg-white">
            <tr className="border-b border-gray-100 text-xs font-bold uppercase text-gray-400 tracking-wider">
              <th className="hidden md:table-cell py-4 pl-2">Order ID</th>
              <th className="py-4 pl-2 md:pl-0 w-[30%] md:w-auto">Date & Time</th>
              <th className="py-4 w-[25%] md:w-auto">Customer</th>
              <th className="hidden md:table-cell py-4">Payment</th>
              <th className="py-4 w-[20%] md:w-auto">Status</th>
              <th className="hidden md:table-cell py-4">Amount</th>
              <th className="p-4 text-right w-[25%] md:w-auto">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayOrders.length > 0 ? displayOrders.map((row) => (
              <tr key={row.id} className="group border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors text-[11px] md:text-sm">
                <td className="hidden md:table-cell py-5 pl-2 font-bold text-gray-900 text-sm align-middle">#{row.id}</td>
                <td className="py-5 pl-2 md:pl-0 text-gray-500 font-medium align-middle">
                    <span className="block text-gray-900 md:text-gray-500">{new Date(row.created_at).toLocaleDateString()}</span>
                    <span className="block text-gray-400 md:hidden text-[10px]">{new Date(row.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </td>
                <td className="py-5 text-gray-900 font-medium align-middle">{row.customers?.name || "Guest"}</td>
                <td className="hidden md:table-cell py-5 text-sm font-medium text-gray-700 align-middle">{row.source === 'pos' ? 'Cash' : 'COD'}</td>
                <td className="py-5 align-middle">
                  <StatusBadge status={row.status} />
                </td>
                <td className="hidden md:table-cell py-5 text-sm font-bold text-gray-900 align-middle">{formatCurrency(row.total_amount)}</td>
                <td className="py-5 text-right align-middle">
                   <button 
                     onClick={() => handleManage(row.id)}
                     className="rounded-full border border-purple-200 bg-purple-50 px-3 py-1.5 md:px-4 text-[10px] md:text-xs font-bold text-purple-600 hover:bg-purple-500 hover:text-white transition-colors"
                   >
                     Manage
                   </button>
                </td>
              </tr>
            )) : (
                <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-400 text-sm">
                        {isSearching ? "No orders match your search." : "No orders found in this period."}
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* View All Button */}
      <div className="mt-4 pt-2 border-t border-gray-50 text-center">
          <Link href="/dashboard/orders" className="inline-flex items-center gap-2 text-sm font-bold text-purple-600 hover:text-purple-700 hover:underline">
              View All Orders
              <ArrowRight className="h-4 w-4" />
          </Link>
      </div>
    </div>
  );
}
