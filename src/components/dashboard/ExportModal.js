"use client";
import React, { useState } from "react";
import { X, FileSpreadsheet, FileText, Download, Calendar, ArrowLeft, Layers } from "lucide-react";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { supabase } from "@/lib/supabaseClient";
import { subMonths, subYears, startOfMonth, startOfYear, isAfter } from "date-fns";

const REPORT_TYPES = [
  { id: "all", label: "Full Backup (All Data)", description: "Sales, Customers, Inventory, Analytics (Excel Only)" },
  { id: "sales", label: "Sales Report", description: "Order Date, Customer, Items, Total, Payment Mode, Status" },
  { id: "customers", label: "Customer List", description: "Name, WhatsApp, Total Orders, Last Order Date" },
  { id: "inventory", label: "Inventory Report", description: "Product Name, SKU/ID, Price, Stock, Category" },
  { id: "analytics", label: "Analytics Data", description: "Traffic, Events, Location, Timestamp (No IP)" },
];

const TIME_RANGES = [
  { id: "month", label: "This Month" },
  { id: "six_months", label: "Last 6 Months" },
  { id: "year", label: "Last Year" },
  { id: "all", label: "Full History" },
];

export default function ExportModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1); // 1: Format, 2: Details
  const [format, setFormat] = useState(null); // 'excel', 'pdf', 'csv'
  const [reportType, setReportType] = useState("all");
  const [timeRange, setTimeRange] = useState("month");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleFormatSelect = (fmt) => {
    setFormat(fmt);
    setStep(2);
    // Default to "All" if Excel, else "Sales" since PDF/CSV can't do multi-sheet easily
    if (fmt === "excel") setReportType("all");
    else setReportType("sales");
  };

  const handleBack = () => {
    setStep(1);
    setError(null);
  };

  const getStartDate = () => {
    const now = new Date();
    switch (timeRange) {
      case "month": return startOfMonth(now);
      case "six_months": return subMonths(now, 6);
      case "year": return subYears(now, 1);
      case "all": return new Date(0); // Epoch
      default: return subMonths(now, 1);
    }
  };

  const fetchDataset = async (type, websiteId, startDate) => {
      if (type === "sales") {
        let query = supabase
          .from("orders")
          .select("*, customers(*), order_items(*, products(name))")
          .eq("website_id", websiteId)
          .gte("created_at", startDate.toISOString())
          .order("created_at", { ascending: false });

        const { data: orders, error } = await query;
        if (error) throw error;

        return {
            data: orders.map(o => ({
                "Order Date": new Date(o.created_at).toLocaleDateString() + " " + new Date(o.created_at).toLocaleTimeString(),
                "Customer Name": o.customers?.name || "Guest",
                "Items": o.order_items.map(i => `${i.quantity}x ${i.products?.name || "Unknown"}`).join(", "),
                "Total Amount": o.total_amount,
                "Payment Mode": o.source === "pos" ? "Cash" : "COD",
                "Status": o.status
            })),
            columns: ["Order Date", "Customer Name", "Items", "Total Amount", "Payment Mode", "Status"]
        };
      } 
      else if (type === "customers") {
        let query = supabase
          .from("orders")
          .select("customer_id, created_at, total_amount, customers(name, shipping_address)")
          .eq("website_id", websiteId)
          .gte("created_at", startDate.toISOString());

        const { data: orders, error } = await query;
        if (error) throw error;

        const customerMap = {};
        orders.forEach(o => {
          if (!o.customer_id) return;
          if (!customerMap[o.customer_id]) {
            customerMap[o.customer_id] = {
              name: o.customers?.name || "Unknown",
              phone: o.customers?.shipping_address?.phone || "",
              orders: 0,
              lastOrder: o.created_at,
              totalSpent: 0
            };
          }
          customerMap[o.customer_id].orders += 1;
          customerMap[o.customer_id].totalSpent += Number(o.total_amount);
          if (new Date(o.created_at) > new Date(customerMap[o.customer_id].lastOrder)) {
            customerMap[o.customer_id].lastOrder = o.created_at;
          }
        });

        return {
            data: Object.values(customerMap).map(c => ({
                "Name": c.name,
                "WhatsApp Number": c.phone,
                "Total Orders": c.orders,
                "Last Order Date": new Date(c.lastOrder).toLocaleDateString(),
                "Total Spent": c.totalSpent
            })),
            columns: ["Name", "WhatsApp Number", "Total Orders", "Last Order Date", "Total Spent"]
        };
      }
      else if (type === "inventory") {
        let query = supabase
          .from("products")
          .select("*, categories(name)")
          .eq("website_id", websiteId);

        const { data: products, error } = await query;
        if (error) throw error;

        return {
            data: products.map(p => ({
                "Product Name": p.name,
                "SKU/ID": p.id,
                "Price": p.price,
                "Current Stock": p.stock,
                "Category": p.categories?.name || "Uncategorized"
            })),
            columns: ["Product Name", "SKU/ID", "Price", "Current Stock", "Category"]
        };
      }
      else if (type === "analytics") {
        let query = supabase
          .from("client_analytics")
          .select("*")
          .eq("website_id", websiteId)
          .gte("timestamp", startDate.toISOString())
          .order("timestamp", { ascending: false })
          .limit(5000);

        const { data: analytics, error } = await query;
        if (error) throw error;

        return {
            data: analytics.map(a => ({
                "Timestamp": new Date(a.timestamp).toLocaleString(),
                "Event": a.event_type || "Pageview",
                "Path": a.path,
                "Location": a.location ? `${a.location.city || ''}, ${a.location.country || ''}` : "Unknown",
                "User Agent": a.user_agent ? (a.user_agent.length > 50 ? a.user_agent.substring(0, 50) + "..." : a.user_agent) : "Unknown"
            })),
            columns: ["Timestamp", "Event", "Path", "Location", "User Agent"]
        };
      }
      return { data: [], columns: [] };
  };

  const handleDownload = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Not authenticated");

      const { data: website } = await supabase
        .from("websites")
        .select("id")
        .eq("user_id", user.id)
        .eq("is_published", true)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (!website) throw new Error("No website found");
      const startDate = getStartDate();
      const fileName = `BizVistar_Report_${timeRange}_${new Date().toISOString().slice(0,10)}`;

      // Handle "Full Backup" (Excel Only)
      if (reportType === "all") {
          if (format !== "excel") {
              setError("Full Backup is only available in Excel format.");
              setLoading(false);
              return;
          }

          const [sales, customers, inventory, analytics] = await Promise.all([
              fetchDataset("sales", website.id, startDate),
              fetchDataset("customers", website.id, startDate),
              fetchDataset("inventory", website.id, startDate),
              fetchDataset("analytics", website.id, startDate)
          ]);

          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(sales.data), "Sales");
          XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(customers.data), "Customers");
          XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(inventory.data), "Inventory");
          XLSX.utils.book_append_sheet(workbook, XLSX.utils.json_to_sheet(analytics.data), "Analytics");

          XLSX.writeFile(workbook, `${fileName}_FullBackup.xlsx`);
      } 
      else {
          // Single Report
          const result = await fetchDataset(reportType, website.id, startDate);
          if (!result || !result.data.length) {
            setError("No data found for selected range.");
            setLoading(false);
            return;
          }

          if (format === "excel" || format === "csv") {
            const worksheet = XLSX.utils.json_to_sheet(result.data);
            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "Report");
            
            if (format === "csv") XLSX.writeFile(workbook, `${fileName}.csv`);
            else XLSX.writeFile(workbook, `${fileName}.xlsx`);
          } 
          else if (format === "pdf") {
            const doc = new jsPDF();
            doc.text(`BizVistar Report: ${REPORT_TYPES.find(r => r.id === reportType)?.label}`, 14, 15);
            doc.text(`Period: ${TIME_RANGES.find(t => t.id === timeRange)?.label}`, 14, 22);
            
            const tableRows = result.data.map(row => result.columns.map(col => row[col]));
            
            autoTable(doc, {
              head: [result.columns],
              body: tableRows,
              startY: 30,
              styles: { fontSize: 8 },
              headStyles: { fillColor: [138, 99, 210] } // Purple
            });
            
            doc.save(`${fileName}.pdf`);
          }
      }

      onClose();
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to generate report");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50/50 px-6 py-4">
          <h3 className="text-lg font-bold text-gray-900 font-sans not-italic">
            {step === 1 ? "Export Data" : "Export Settings"}
          </h3>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-gray-100 text-gray-500 transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 ? (
            <div className="grid gap-4">
              <p className="text-sm text-gray-500 font-sans mb-2">Choose a format to export your data.</p>
              <button 
                onClick={() => handleFormatSelect("excel")}
                className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 hover:border-purple-200 hover:bg-purple-50 transition-all group text-left"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 text-green-600 group-hover:bg-white group-hover:shadow-sm">
                  <FileSpreadsheet size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 font-sans">Excel (.xlsx)</h4>
                  <p className="text-xs text-gray-500 font-sans">Best for analysis and full backups.</p>
                </div>
              </button>

              <button 
                onClick={() => handleFormatSelect("csv")}
                className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 hover:border-purple-200 hover:bg-purple-50 transition-all group text-left"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 text-blue-600 group-hover:bg-white group-hover:shadow-sm">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 font-sans">CSV (.csv)</h4>
                  <p className="text-xs text-gray-500 font-sans">Single report compatibility.</p>
                </div>
              </button>

              <button 
                onClick={() => handleFormatSelect("pdf")}
                className="flex items-center gap-4 rounded-xl border border-gray-200 p-4 hover:border-purple-200 hover:bg-purple-50 transition-all group text-left"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-red-100 text-red-600 group-hover:bg-white group-hover:shadow-sm">
                  <FileText size={24} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-900 font-sans">PDF (.pdf)</h4>
                  <p className="text-xs text-gray-500 font-sans">Best for printing single reports.</p>
                </div>
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {/* Report Type */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-900 font-sans block">Report Type</label>
                <div className="grid gap-2 max-h-[200px] overflow-y-auto pr-1 custom-scrollbar">
                  {REPORT_TYPES.map((type) => {
                      if (type.id === "all" && format !== "excel") return null;
                      
                      return (
                        <label 
                        key={type.id} 
                        className={`flex items-start gap-3 rounded-lg border p-3 cursor-pointer transition-all ${
                            reportType === type.id ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-gray-300"
                        }`}
                        >
                        <input 
                            type="radio" 
                            name="reportType" 
                            value={type.id} 
                            checked={reportType === type.id} 
                            onChange={(e) => setReportType(e.target.value)}
                            className="mt-1 h-4 w-4 text-purple-600 accent-purple-600"
                        />
                        <div>
                            <span className="block text-sm font-bold text-gray-900 font-sans flex items-center gap-2">
                                {type.label}
                                {type.id === "all" && <span className="text-[10px] bg-purple-100 text-purple-700 px-1.5 py-0.5 rounded font-bold uppercase">Pro</span>}
                            </span>
                            <span className="block text-xs text-gray-500 font-sans mt-0.5">{type.description}</span>
                        </div>
                        </label>
                      );
                  })}
                </div>
              </div>

              {/* Time Range */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-gray-900 font-sans block">Time Period</label>
                <select 
                  value={timeRange} 
                  onChange={(e) => setTimeRange(e.target.value)}
                  className="w-full rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-900 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                >
                  {TIME_RANGES.map(range => (
                    <option key={range.id} value={range.id}>{range.label}</option>
                  ))}
                </select>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-3 text-xs text-red-600">
                  {error}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-4">
          {step === 2 ? (
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-sm font-bold text-gray-600 hover:text-gray-900 font-sans"
            >
              <ArrowLeft size={16} />
              Back
            </button>
          ) : (
            <div /> // Spacer
          )}
          
          {step === 2 && (
            <button 
              onClick={handleDownload}
              disabled={loading}
              className="flex items-center gap-2 rounded-full bg-[#8A63D2] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-purple-200 hover:bg-[#7a54bf] disabled:opacity-50 transition-all font-sans"
            >
              {loading ? (
                <span>Generating...</span>
              ) : (
                <>
                  <Download size={16} />
                  Download Report
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
