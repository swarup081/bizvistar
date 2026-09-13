"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Copy, Check, ExternalLink, Power, Trash2, BarChart2, X } from "lucide-react";
import { getSharedTemplates, updateSharedTemplate, deactivateSharedTemplate } from "@/app/actions/sharedTemplateActions";
import { getSharedLinkAnalytics } from "@/app/actions/adminActions";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import toast from "react-hot-toast";

export default function AdminSharedLinksPage() {
  const [loading, setLoading] = useState(true);
  const [templates, setTemplates] = useState([]);
  const [copiedId, setCopiedId] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', action: null });
  const [actionLoading, setActionLoading] = useState(false);
  const [analyticsModal, setAnalyticsModal] = useState({ isOpen: false, data: null, loading: false });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    const result = await getSharedTemplates();
    if (result.success) setTemplates(result.templates);
    setLoading(false);
  };

  const handleCopy = (shareId) => {
    const url = `${window.location.origin}/claim/${shareId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(shareId);
    toast.success('Link copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleToggleActive = (template) => {
    const action = template.is_active ? 'deactivate' : 'activate';
    setConfirmDialog({
      isOpen: true,
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Shared Link?`,
      message: `Are you sure you want to ${action} the shared link for "${template.business_name || template.template_name}"? ${template.is_active ? 'Users will no longer be able to claim this template.' : 'Users will be able to claim this template again.'}`,
      action: async () => {
        setActionLoading(true);
        const result = await updateSharedTemplate(template.id, { isActive: !template.is_active });
        if (result.success) {
          toast.success(`Link ${action}d`);
          fetchData();
        } else {
          toast.error(result.error || 'Failed');
        }
        setActionLoading(false);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      }
    });
  };

  const handleViewAnalytics = async (shareId) => {
    setAnalyticsModal({ isOpen: true, data: null, loading: true });
    const res = await getSharedLinkAnalytics(shareId);
    if (res.success) {
      setAnalyticsModal({ isOpen: true, data: res, loading: false });
    } else {
      toast.error('Failed to load analytics');
      setAnalyticsModal({ isOpen: false, data: null, loading: false });
    }
  };

  const columns = [
    {
      key: 'share_id',
      label: 'Share ID',
      render: (val) => <code className="text-xs bg-gray-100 px-2 py-0.5 rounded font-mono text-gray-600">{val}</code>
    },
    {
      key: 'template_name',
      label: 'Template',
      render: (val) => <span className="font-medium text-gray-900 capitalize">{val}</span>
    },
    {
      key: 'business_name',
      label: 'Business',
      render: (val) => <span className="text-gray-600">{val || '—'}</span>
    },
    {
      key: 'claimed_count',
      label: 'Claims',
      render: (val) => <span className="font-mono font-bold text-[#8A63D2]">{val}</span>
    },
    {
      key: 'is_active',
      label: 'Status',
      render: (val) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
          val ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
        }`}>
          {val ? '● Active' : '○ Inactive'}
        </span>
      )
    },
    {
      key: 'created_at',
      label: 'Created',
      render: (val) => <span className="text-xs text-gray-500">{val ? new Date(val).toLocaleDateString('en-IN') : '—'}</span>
    },
  ];

  if (loading) return <AdminSkeleton />;

  return (
    <div className="font-sans not-italic pb-8">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-[#111]">Shared Links</h1>
        <p className="mt-1 text-sm text-gray-500">Manage shareable template links and track claims</p>
      </div>

      <AdminDataTable
        columns={columns}
        data={templates}
        total={templates.length}
        page={1}
        pageSize={100}
        onPageChange={() => {}}
        emptyMessage="No shared links created yet. Go to Templates to create one."
        actions={(row) => (
          <>
            <button
              onClick={() => handleViewAnalytics(row.share_id)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-[#8A63D2] transition-colors"
              title="View Analytics"
            >
              <BarChart2 size={15} />
            </button>
            <button
              onClick={() => handleCopy(row.share_id)}
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              title="Copy link"
            >
              {copiedId === row.share_id ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
            </button>
            <a
              href={`/claim/${row.share_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              title="Preview"
            >
              <ExternalLink size={15} />
            </a>
            <button
              onClick={() => handleToggleActive(row)}
              className={`p-1.5 rounded-lg transition-colors ${
                row.is_active ? 'hover:bg-red-50 text-red-400 hover:text-red-600' : 'hover:bg-emerald-50 text-emerald-400 hover:text-emerald-600'
              }`}
              title={row.is_active ? 'Deactivate' : 'Activate'}
            >
              <Power size={15} />
            </button>
          </>
        )}
      />

      <ConfirmDialog
        isOpen={confirmDialog.isOpen}
        onClose={() => setConfirmDialog({ ...confirmDialog, isOpen: false })}
        onConfirm={confirmDialog.action}
        title={confirmDialog.title}
        message={confirmDialog.message}
        confirmText="Yes, proceed"
        confirmColor="red"
        isLoading={actionLoading}
      />

      {/* Analytics Modal */}
      {analyticsModal.isOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[85vh]">
            <div className="flex items-center justify-between p-5 border-b border-gray-100 shrink-0">
              <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                <BarChart2 size={20} className="text-[#8A63D2]" />
                Link Analytics
              </h2>
              <button onClick={() => setAnalyticsModal({ isOpen: false, data: null, loading: false })} className="text-gray-400 hover:text-gray-600 p-1">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto flex-grow">
              {analyticsModal.loading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#8A63D2]"></div>
                </div>
              ) : analyticsModal.data ? (
                <div className="space-y-6">
                  {/* Overview Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Total Visits</p>
                      <p className="text-2xl font-bold text-gray-900">{analyticsModal.data.analytics.length}</p>
                    </div>
                    <div className="bg-[#8A63D2]/5 rounded-xl p-4 border border-[#8A63D2]/10">
                      <p className="text-xs font-semibold text-[#8A63D2] uppercase tracking-wider mb-1">Total Claims</p>
                      <p className="text-2xl font-bold text-[#8A63D2]">{analyticsModal.data.claims.length}</p>
                    </div>
                  </div>

                  {/* Claims List */}
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 text-sm">Successful Claims</h3>
                    {analyticsModal.data.claims.length > 0 ? (
                      <div className="border border-gray-100 rounded-xl overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-gray-50 border-b border-gray-100 text-left text-xs text-gray-500 font-semibold">
                              <th className="px-4 py-2 uppercase">User</th>
                              <th className="px-4 py-2 uppercase">Website ID</th>
                              <th className="px-4 py-2 uppercase">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-50">
                            {analyticsModal.data.claims.map((claim, idx) => (
                              <tr key={idx} className="hover:bg-gray-50/50">
                                <td className="px-4 py-2 text-gray-900 font-medium">{claim.user_email}</td>
                                <td className="px-4 py-2 font-mono text-xs text-gray-500">{claim.website_id}</td>
                                <td className="px-4 py-2 text-gray-500">{new Date(claim.created_at).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500 italic">No claims yet.</p>
                    )}
                  </div>
                </div>
              ) : (
                <p className="text-center text-red-500 py-4">Failed to load data.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
