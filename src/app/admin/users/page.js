"use client";

import React, { useState, useEffect, useCallback } from "react";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import { Eye, Edit3, X } from "lucide-react";
import { getAllUsers, adminUpdateSubscription, impersonateUser } from "@/app/actions/adminActions";
import toast from "react-hot-toast";

export default function AdminUsersPage() {
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [subModalOpen, setSubModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [subPlan, setSubPlan] = useState('');
  const pageSize = 20;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const result = await getAllUsers(page, pageSize, search);
    if (result.success) {
      setUsers(result.users);
      setTotal(result.total);
    }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleSearch = useCallback((val) => {
    setSearch(val);
    setPage(1);
  }, []);

  const handleImpersonate = async (userId) => {
    const loadingToast = toast.loading('Starting impersonation...');
    const result = await impersonateUser(userId);
    if (result.success) {
      toast.success('Impersonating user!', { id: loadingToast });
      window.location.href = '/dashboard';
    } else {
      toast.error(result.error || 'Failed to impersonate', { id: loadingToast });
    }
  };

  const handleUpdateSub = async (e) => {
    e.preventDefault();
    if (!selectedUser || !subPlan) return;
    
    const loadingToast = toast.loading('Updating subscription...');
    const result = await adminUpdateSubscription(selectedUser.id, subPlan);
    if (result.success) {
      toast.success('Subscription updated', { id: loadingToast });
      setSubModalOpen(false);
      fetchUsers();
    } else {
      toast.error(result.error || 'Update failed', { id: loadingToast });
    }
  };

  const columns = [
    { 
      key: 'full_name', 
      label: 'Name / Email',
      render: (val, row) => (
        <div>
          <div className="font-medium text-gray-900">{val || 'No name'}</div>
          <div className="text-xs text-gray-500">{row.email}</div>
        </div>
      )
    },
    {
      key: 'subscription',
      label: 'Plan',
      render: (val) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
          val?.plan !== 'None' ? 'bg-[#8A63D2]/10 text-[#8A63D2]' : 'bg-gray-100 text-gray-500'
        }`}>
          {val?.plan || 'None'}
        </span>
      )
    },
    {
      key: 'websiteCount',
      label: 'Websites',
      render: (val) => <span className="font-mono text-sm">{val}</span>
    },
    {
      key: 'subscription',
      label: 'Status',
      render: (val) => {
        const statusColors = {
          active: 'bg-emerald-50 text-emerald-700',
          trialing: 'bg-blue-50 text-blue-700',
          past_due: 'bg-amber-50 text-amber-700',
          none: 'bg-gray-100 text-gray-500',
        };
        const status = val?.status || 'none';
        return (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${statusColors[status] || statusColors.none}`}>
            {status}
          </span>
        );
      }
    },
    {
      key: 'created_at',
      label: 'Joined',
      render: (val) => <span className="text-gray-500 text-xs">{val ? new Date(val).toLocaleDateString('en-IN') : '—'}</span>
    },
  ];

  if (loading && users.length === 0) return <AdminSkeleton />;

  return (
    <div className="font-sans not-italic pb-8">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-[#111]">User Management</h1>
        <p className="mt-1 text-sm text-gray-500">View and manage all platform users</p>
      </div>

      <AdminDataTable
        columns={columns}
        data={users}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onSearch={handleSearch}
        searchPlaceholder="Search by name or email..."
        emptyMessage="No users found"
        actions={(row) => (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setSelectedUser(row);
                setSubModalOpen(true);
              }}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-[#8A63D2] transition-colors"
              title="Edit Subscription"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={() => handleImpersonate(row.id)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              title="Impersonate User"
            >
              <Eye size={16} />
            </button>
          </div>
        )}
      />

      {/* Subscription Edit Modal */}
      {subModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between p-5 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-900">Edit Subscription</h2>
              <button onClick={() => setSubModalOpen(false)} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateSub} className="p-5">
              <p className="text-sm text-gray-500 mb-4">
                Update subscription plan for <span className="font-semibold text-gray-900">{selectedUser?.email}</span>.
              </p>
              
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Plan ID</label>
                <input
                  type="text"
                  placeholder="e.g. plan_free, plan_pro"
                  value={subPlan}
                  onChange={(e) => setSubPlan(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#8A63D2] focus:border-[#8A63D2] outline-none transition-all text-sm"
                  required
                />
              </div>

              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSubModalOpen(false)}
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
