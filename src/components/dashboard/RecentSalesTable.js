"use client";
import React from "react";
import { ChevronDown } from "lucide-react";

// Updated data as per request
const ordersData = [
  {
    id: "#1042",
    date: "10 Oct, 4:20 PM",
    customer: "Ankit Sharma",
    payment: "  COD",
    status: "Pending",
    amount: "₹1,250",
  },
  {
    id: "#1043",
    date: "10 Oct, 4:25 PM",
    customer: "Priya Singh",
    payment: " UPI",
    status: "Delivered",
    amount: "₹3,400",
  },
  {
    id: "#1044",
    date: "11 Oct, 10:00 AM",
    customer: "Rahul Verma",
    payment: " COD",
    status: "Shipped",
    amount: "₹950",
  },
  {
    id: "#1045",
    date: "11 Oct, 11:30 AM",
    customer: "Sneha Gupta",
    payment: "UPI",
    status: "Pending",
    amount: "₹2,100",
  },
  {
    id: "#1046",
    date: "11 Oct, 1:15 PM",
    customer: "Amit Kumar",
    payment: " UPI",
    status: "Cancelled",
    amount: "₹500",
  },
];

const StatusBadge = ({ status }) => {
  const styles = {
    Delivered: "bg-green-50 text-green-600 border border-green-100",
    Shipped: "bg-blue-50 text-blue-600 border border-blue-100",
    Pending: "bg-yellow-50 text-yellow-600 border border-yellow-100",
    Cancelled: "bg-red-50 text-red-600 border border-red-100",
  };
  
  // Clean status string to match keys (remove emoji if present in data, though data above is clean)
  const cleanStatus = status.trim();
  const style = styles[cleanStatus] || "bg-gray-50 text-gray-600";

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${style}`}>
      {status}
    </span>
  );
};

export default function RecentSalesTable() {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm h-full flex flex-col">
      <div className="mb-6 flex items-center justify-between shrink-0">
        <h3 className="text-lg font-bold text-gray-900 font-sans not-italic">Recent Orders</h3>
        <div className="relative">
             <button className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 font-sans">
                This Week
                <ChevronDown className="h-4 w-4 text-gray-500" />
             </button>
        </div>
      </div>

      {/* Internal Scrolling Wrapper */}
      <div className="flex-1 overflow-y-auto min-h-[300px] max-h-[500px] pr-2 custom-scrollbar">
        <table className="w-full border-collapse text-left font-sans">
          <thead className="sticky top-0 bg-white z-10">
            <tr className="border-b border-gray-100 text-xs font-bold uppercase text-gray-400 tracking-wider">
              <th className="py-4 pl-2">Order ID</th>
              <th className="py-4">Date</th>
              <th className="py-4">Customer</th>
              <th className="py-4">Payment</th>
              <th className="py-4">Status</th>
              <th className="py-4">Amount</th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {ordersData.map((row) => (
              <tr key={row.id} className="group border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                <td className="py-5 pl-2 font-bold text-gray-900 text-sm">{row.id}</td>
                <td className="py-5 text-sm text-gray-500 font-medium">{row.date}</td>
                <td className="py-5 text-sm text-gray-900 font-medium">{row.customer}</td>
                <td className="py-5 text-sm font-medium text-gray-700">{row.payment}</td>
                <td className="py-5 ">
                  <StatusBadge status={row.status} />
                </td>
                <td className="py-5 text-sm font-bold text-gray-900">{row.amount}</td>
                <td className="py-5  text-right">
                   <button className="rounded-full border border-purple-200 bg-purple-50 px-4 py-1.5 text-xs font-bold text-purple-600 hover:bg-purple-500 hover:text-white transition-colors">
                     Manage
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
