"use client";

import React, { useState, useEffect } from "react";
import { Plus, Copy, Check, ExternalLink, Edit2, Link2 } from "lucide-react";
import { templates } from "@/lib/data/templates";
import { createSharedTemplate, getSharedTemplates } from "@/app/actions/sharedTemplateActions";
import SharedTemplateModal from "@/components/admin/SharedTemplateModal";
import AdminSkeleton from "@/components/admin/AdminSkeleton";
import toast from "react-hot-toast";

export default function AdminTemplatesPage() {
  const [loading, setLoading] = useState(true);
  const [sharedTemplates, setSharedTemplates] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    fetchSharedTemplates();
  }, []);

  const fetchSharedTemplates = async () => {
    setLoading(true);
    const result = await getSharedTemplates();
    if (result.success) setSharedTemplates(result.templates);
    setLoading(false);
  };

  const handleCreate = async (form) => {
    const result = await createSharedTemplate({
      templateName: form.templateName,
      businessName: form.businessName,
      tagline: form.tagline,
      theme: form.theme,
      customizations: {}
    });

    if (result.success) {
      toast.success('Shared template created!');
      setIsModalOpen(false);
      fetchSharedTemplates();
    } else {
      toast.error(result.error || 'Failed to create');
    }
  };

  const handleCopy = (shareId) => {
    const url = `${window.location.origin}/claim/${shareId}`;
    navigator.clipboard.writeText(url);
    setCopiedId(shareId);
    toast.success('Link copied!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (loading) return <AdminSkeleton />;

  return (
    <div className="font-sans not-italic pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-[#111]">Template Management</h1>
          <p className="mt-1 text-sm text-gray-500">Create shareable template links for users</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#8A63D2] hover:bg-[#7c59bd] text-white text-sm font-semibold rounded-lg shadow-sm transition-colors shrink-0"
        >
          <Plus size={18} />
          Create Shared Template
        </button>
      </div>

      {/* Available Templates Grid */}
      <div className="mb-10">
        <h2 className="text-base font-bold text-gray-900 mb-4">Available Templates ({templates.length})</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((template) => (
            <div key={template.title} className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow group">
              {/* Preview */}
              <div className="relative h-[160px] overflow-hidden bg-gray-50">
                <iframe
                  src={template.url}
                  className="w-[1280px] h-[720px] origin-top-left scale-[0.28] pointer-events-none"
                  title={template.title}
                />
              </div>
              <div className="p-4">
                <h3 className="font-bold text-gray-900 capitalize">{template.title}</h3>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">{template.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <button
                    onClick={() => {
                      setIsModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-[#8A63D2]/10 text-[#8A63D2] rounded-lg hover:bg-[#8A63D2]/20 transition-colors"
                    title="Quick Link (No editing)"
                  >
                    <Link2 size={12} />
                    Quick Link
                  </button>
                  <a
                    href={`/admin/editor/create/${template.title}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    title="Open in Full Editor"
                  >
                    <Edit2 size={12} />
                    Customize
                  </a>
                  <a
                    href={template.previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-colors hidden xl:flex"
                  >
                    <ExternalLink size={12} />
                    Preview
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shared Templates List */}
      {sharedTemplates.length > 0 && (
        <div>
          <h2 className="text-base font-bold text-gray-900 mb-4">Shared Links ({sharedTemplates.length})</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Template</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Business</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Claims</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                    <th className="px-4 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase">Created</th>
                    <th className="px-4 py-2.5 text-right text-xs font-semibold text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {sharedTemplates.map((st) => (
                    <tr key={st.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3">
                        <span className="font-medium text-gray-900 capitalize">{st.template_name}</span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">{st.business_name || '—'}</td>
                      <td className="px-4 py-3">
                        <span className="font-mono text-sm font-bold text-[#8A63D2]">{st.claimed_count}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                          st.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
                        }`}>
                          {st.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-gray-500">
                        {new Date(st.created_at).toLocaleDateString('en-IN')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleCopy(st.share_id)}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#8A63D2] transition-colors"
                            title="Copy link"
                          >
                            {copiedId === st.share_id ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
                          </button>
                          <a
                            href={`/admin/editor/edit/${st.share_id}`}
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-[#8A63D2] transition-colors"
                            title="Edit template design"
                          >
                            <Edit2 size={15} />
                          </a>
                          <a
                            href={`/claim/${st.share_id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                            title="Preview claim page"
                          >
                            <ExternalLink size={15} />
                          </a>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <SharedTemplateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreate}
      />
    </div>
  );
}
