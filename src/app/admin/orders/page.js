"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getAllOrders, adminUpdateOrderStatus } from "@/app/actions/adminActions";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import { Edit3, X } from "lucide-react";
import toast from "react-hot-toast";

export default function AdminOrdersPage() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const pageSize = 20;

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const result = await getAllOrders(page, pageSize, search, statusFilter);
    if (result.success) {
      setOrders(result.orders);
      setTotal(result.total);
    }
    setLoading(false);
  }, [page, search, statusFilter]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const handleSearch = useCallback((val) => { setSearch(val); setPage(1); }, []);

  const formatCurrency = (val) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(val);

  const columns = [
    {
      key: 'id',
      label: 'Order ID',
      render: (val) => <span className="font-mono text-xs text-gray-600">#{val}</span>
    },
    {
      key: 'customer',
      label: 'Customer',
      render: (val, row) => (
        <div>
          <p className="font-medium text-gray-900 text-sm">Customer: {val?.name || 'Unknown'}</p>
          {val?.email && <p className="text-xs text-gray-400">{val.email}</p>}
          {row.website && (
            <div className="mt-1 pt-1 border-t border-gray-100">
              <p className="text-xs text-gray-500">Shop: {row.website.site_slug}</p>
              <p className="text-xs text-gray-400">Owner: {row.website.owner_email}</p>
            </div>
          )}
        </div>
      )
    },
    {
      key: 'total_amount',
      label: 'Amount',
      render: (val) => <span className="font-semibold text-gray-900">{formatCurrency(val)}</span>
    },
    {
      key: 'status',
      label: 'Status',
      render: (val) => {
        const colors = {
          paid: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          pending: 'bg-amber-50 text-amber-700 border-amber-200',
          canceled: 'bg-red-50 text-red-700 border-red-200',
          completed: 'bg-blue-50 text-blue-700 border-blue-200',
        };
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold border ${colors[val] || 'bg-gray-50 text-gray-700 border-gray-200'}`}>
            {val}
          </span>
        );
      }
    },
    {
      key: 'created_at',
      label: 'Date',
      render: (val) => (
        <span className="text-xs text-gray-500">
          {val ? new Date(val).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}
        </span>
      )
    },
  ];

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Paid', value: 'paid' },
    { label: 'Pending', value: 'pending' },
    { label: 'Canceled', value: 'canceled' },
  ];

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder || !newStatus) return;

    const loadingToast = toast.loading('Updating order status...');
    const result = await adminUpdateOrderStatus(selectedOrder.id, newStatus);
    
    if (result.success) {
      toast.success('Status updated', { id: loadingToast });
      setStatusModalOpen(false);
      fetchOrders();
    } else {
      toast.error(result.error || 'Update failed', { id: loadingToast });
    }
  };

  if (loading && orders.length === 0) return <AdminSkeleton />;

  return (
    <div className="font-sans not-italic pb-8">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-[#111]">Order Management</h1>
        <p className="mt-1 text-sm text-gray-500">View all orders across the platform</p>
      </div>

      <AdminDataTable
        columns={columns}
        data={orders}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onSearch={handleSearch}
        searchPlaceholder="Search orders..."
        emptyMessage="No orders found"
        filterOptions={filterOptions}
        activeFilter={statusFilter}
        onFilterChange={(val) => { setStatusFilter(val); setPage(1); }}
        actions={(row) => (
          <div className="flex items-center justify-end gap-2">
            <button
              onClick={() => {
                setSelectedOrder(row);
                setNewStatus(row.status || 'pending');
                setStatusModalOpen(true);
              }}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-[#8A63D2] transition-colors"
              title="Edit Status"
            >
              <Edit3 size={16} />
            </button>
          </div>
        )}
      />

      {/* Status Edit Modal */}
      {statusModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Update Order Status</h2>
              <button onClick={() => setStatusModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateStatus} className="p-5">
              <p className="text-sm text-gray-500 mb-4">
                Update status for Order <span className="font-semibold text-gray-900">#{selectedOrder?.id?.slice(0, 8)}...</span>
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8A63D2] focus:border-[#8A63D2] outline-none transition-all text-sm bg-white"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                  <option value="completed">Completed</option>
                  <option value="canceled">Canceled</option>
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setStatusModalOpen(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium bg-[#8A63D2] text-white rounded-lg hover:bg-[#7e57c2] transition-colors"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
