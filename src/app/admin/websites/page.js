"use client";

import React, { useState, useEffect, useCallback } from "react";
import { getAllWebsites, adminTogglePublish, adminDeleteWebsite } from "@/app/actions/adminActions";
import AdminDataTable from "@/components/admin/AdminDataTable";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { Eye, Power, Trash2, ExternalLink } from "lucide-react";
import toast from 'react-hot-toast';

export default function AdminWebsitesPage() {
  const [loading, setLoading] = useState(true);
  const [websites, setWebsites] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const pageSize = 20;

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', message: '', action: null, color: 'red' });
  const [actionLoading, setActionLoading] = useState(false);

  const fetchWebsites = useCallback(async () => {
    setLoading(true);
    const result = await getAllWebsites(page, pageSize, search, filter);
    if (result.success) {
      setWebsites(result.websites);
      setTotal(result.total);
    }
    setLoading(false);
  }, [page, search, filter]);

  useEffect(() => { fetchWebsites(); }, [fetchWebsites]);

  const handleSearch = useCallback((val) => { setSearch(val); setPage(1); }, []);

  const handleTogglePublish = (website) => {
    const action = website.is_published ? 'unpublish' : 'publish';
    setConfirmDialog({
      isOpen: true,
      title: `${action.charAt(0).toUpperCase() + action.slice(1)} Website?`,
      message: `Are you sure you want to ${action} "${website.businessName}" (${website.site_slug})? ${website.is_published ? 'The site will go offline immediately.' : 'The site will be accessible publicly.'}`,
      color: website.is_published ? 'red' : 'green',
      action: async () => {
        setActionLoading(true);
        const result = await adminTogglePublish(website.id);
        if (result.success) {
          toast.success(`Website ${action}ed successfully`);
          fetchWebsites();
        } else {
          toast.error(result.error || 'Failed to update website');
        }
        setActionLoading(false);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      }
    });
  };

  const handleDelete = (website) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Unpublish Website?',
      message: `This will take "${website.businessName}" (${website.site_slug}) offline. The data will be preserved but the site will not be accessible. This action can be undone by publishing again.`,
      color: 'red',
      action: async () => {
        setActionLoading(true);
        const result = await adminDeleteWebsite(website.id);
        if (result.success) {
          toast.success('Website unpublished successfully');
          fetchWebsites();
        } else {
          toast.error(result.error || 'Failed');
        }
        setActionLoading(false);
        setConfirmDialog({ ...confirmDialog, isOpen: false });
      }
    });
  };

  const columns = [
    {
      key: 'businessName',
      label: 'Website',
      render: (val, row) => (
        <div>
          <p className="font-medium text-gray-900">{val}</p>
          <p className="text-xs text-gray-400 font-mono">{row.site_slug}</p>
        </div>
      )
    },
    {
      key: 'templateName',
      label: 'Template',
      render: (val) => <span className="text-xs bg-gray-100 px-2 py-0.5 rounded-full text-gray-600 font-medium">{val}</span>
    },
    {
      key: 'is_published',
      label: 'Status',
      render: (val) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
          val ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-gray-100 text-gray-500 border border-gray-200'
        }`}>
          {val ? '● Live' : '○ Draft'}
        </span>
      )
    },
    {
      key: 'updated_at',
      label: 'Last Updated',
      render: (val) => <span className="text-xs text-gray-500">{val ? new Date(val).toLocaleDateString('en-IN') : '—'}</span>
    },
  ];

  const filterOptions = [
    { label: 'All', value: 'all' },
    { label: 'Published', value: 'published' },
    { label: 'Draft', value: 'draft' },
  ];

  if (loading && websites.length === 0) return <AdminSkeleton />;

  return (
    <div className="font-sans not-italic pb-8">
      <div className="mb-6">
        <h1 className="text-xl md:text-2xl font-bold text-[#111]">Website Management</h1>
        <p className="mt-1 text-sm text-gray-500">View, publish, and manage all user websites</p>
      </div>

      <AdminDataTable
        columns={columns}
        data={websites}
        total={total}
        page={page}
        pageSize={pageSize}
        onPageChange={setPage}
        onSearch={handleSearch}
        searchPlaceholder="Search by slug..."
        emptyMessage="No websites found"
        filterOptions={filterOptions}
        activeFilter={filter}
        onFilterChange={(val) => { setFilter(val); setPage(1); }}
        actions={(row) => (
          <>
            {row.is_published && row.site_slug && (
              <a
                href={`https://${row.site_slug}.bizvistar.in`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                title="Visit live site"
              >
                <ExternalLink size={15} />
              </a>
            )}
            <button
              onClick={() => handleTogglePublish(row)}
              className={`p-1.5 rounded-lg transition-colors ${
                row.is_published
                  ? 'hover:bg-red-50 text-red-400 hover:text-red-600'
                  : 'hover:bg-emerald-50 text-emerald-400 hover:text-emerald-600'
              }`}
              title={row.is_published ? 'Unpublish' : 'Publish'}
            >
              <Power size={15} />
            </button>
            <button
              onClick={() => handleDelete(row)}
              className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-600 transition-colors"
              title="Take offline"
            >
              <Trash2 size={15} />
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
        confirmColor={confirmDialog.color}
        isLoading={actionLoading}
      />
    </div>
  );
}
