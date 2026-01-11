"use client";
import React, { useState, useMemo } from "react";
import { ShoppingBag, ChevronDown } from "lucide-react";
import { isAfter, subDays, startOfYear, startOfWeek, startOfMonth } from "date-fns";

export default function BestSellers({ orderItems = [] }) {
  const [timeFilter, setTimeFilter] = useState("month"); // week, month, year
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const labels = {
      week: "This Week",
      month: "This Month",
      year: "This Year"
  };

  const topProducts = useMemo(() => {
     const now = new Date();
     let startDate;

     if (timeFilter === "week") startDate = subDays(now, 7);
     else if (timeFilter === "month") startDate = subDays(now, 30);
     else startDate = startOfYear(now);

     // Aggregation
     const productMap = {}; // { id: { name, image, quantity, revenue } }

     orderItems.forEach(item => {
         const orderDate = new Date(item.orders?.created_at);
         if (isAfter(orderDate, startDate)) {
             const pid = item.product_id;
             const pName = item.products?.name || "Unknown Product";
             const pImage = item.products?.image_url;
             const qty = item.quantity || 0;
             const price = Number(item.price) || 0; // Or item.products.price? Usually order_item price is snapshot.

             if (!productMap[pid]) {
                 productMap[pid] = {
                     id: pid,
                     name: pName,
                     image: pImage,
                     quantity: 0,
                     revenue: 0
                 };
             }

             productMap[pid].quantity += qty;
             productMap[pid].revenue += (qty * price);
         }
     });

     // Convert to array and sort
     return Object.values(productMap)
         .sort((a, b) => b.quantity - a.quantity)
         .slice(0, 3);

  }, [orderItems, timeFilter]);

  const formatCurrency = (val) => {
      return new Intl.NumberFormat('en-IN', {
          style: 'currency',
          currency: 'INR',
          maximumFractionDigits: 0
      }).format(val);
  };

  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
         <h3 className="text-lg font-bold text-gray-900 font-sans not-italic">Best Sellers</h3>
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
      </div>

      <div className="flex flex-col gap-4">
        {topProducts.length > 0 ? topProducts.map((item) => (
          <div 
            key={item.id} 
            className="group flex items-center gap-4 p-2 rounded-xl transition-all duration-200 hover:bg-gray-50 hover:scale-[1.02] cursor-pointer"
          >
            {/* Image container with fallback */}
            <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-300">
              {item.image ? (
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-cover"
                    onError={(e) => { e.target.style.display='none'; e.target.nextSibling.style.display='block'; }}
                  />
              ) : null}
              <ShoppingBag className={`h-6 w-6 ${item.image ? 'hidden' : ''}`} />
            </div>
            
            <div className="flex flex-col gap-1 min-w-0 flex-1">
              <h4 className="text-sm not-italic font-bold text-gray-900 font-sans leading-tight truncate pr-2 group-hover:text-[#8A63D2] transition-colors">
                {item.name}
              </h4>
              <p className="text-xs font-medium text-gray-500 font-sans">
                {item.quantity} Units Sold <span className="text-gray-300 px-1">|</span> <span className="text-gray-900 font-bold">{formatCurrency(item.revenue)}</span>
              </p>
            </div>
          </div>
        )) : (
            <div className="text-center py-8 text-gray-400 text-sm">
                No sales in this period.
            </div>
        )}
      </div>
    </div>
  );
}
