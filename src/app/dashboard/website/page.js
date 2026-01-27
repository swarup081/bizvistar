'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import EditorLayout from '@/components/editor/EditorLayout';
import Link from 'next/link';
import { ChevronDown, FileText, Check } from 'lucide-react';

function WebsiteDashboardContent() {
  const [loading, setLoading] = useState(true);
  const [editorData, setEditorData] = useState(null);
  const [error, setError] = useState(null);
  
  // State for Switcher
  const [drafts, setDrafts] = useState([]);
  const [isSwitcherOpen, setIsSwitcherOpen] = useState(false);
  const [liveSite, setLiveSite] = useState(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const draftIdParam = searchParams.get('draft_id');
  const siteIdParam = searchParams.get('site_id');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setError(null);
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();

        if (authError || !user) {
            setError("Please log in to view your website.");
            setLoading(false);
            return;
        }

        // 1. Fetch Live Site
        const { data: site } = await supabase
            .from('websites')
            .select('id, site_slug, template_id, website_data, draft_data, business_name, is_published, updated_at')
            .eq('user_id', user.id)
            .limit(1)
            .maybeSingle();
        setLiveSite(site);

        // 2. Fetch Drafts (For Switcher)
        const { data: draftsData } = await supabase
            .from('website_drafts')
            .select('id, name, template_id, updated_at')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });
        setDrafts(draftsData || []);

        // 3. Determine Context (What to show in Editor)
        let contextData = null;

        if (draftIdParam) {
            // Explicit Draft
            const { data: draft } = await supabase.from('website_drafts').select('*').eq('id', draftIdParam).single();
            if (draft) {
                contextData = {
                    id: draft.id,
                    data: draft.draft_data,
                    templateId: draft.template_id,
                    name: draft.name,
                    isDraft: true,
                    slug: null
                };
            }
        } else if (siteIdParam && site && site.id == siteIdParam) {
            // Explicit Live Site
             contextData = {
                id: site.id,
                data: site.draft_data || site.website_data,
                templateId: site.template_id,
                name: site.business_name || 'Live Site',
                isDraft: false,
                slug: site.site_slug
            };
        } else if (site) {
             // Default to Live Site if exists
             contextData = {
                id: site.id,
                data: site.draft_data || site.website_data,
                templateId: site.template_id,
                name: site.business_name || 'Live Site',
                isDraft: false,
                slug: site.site_slug
            };
        } else if (draftsData && draftsData.length > 0) {
            // Default to first draft if no live site
             const firstDraft = draftsData[0];
             const { data: fullDraft } = await supabase.from('website_drafts').select('*').eq('id', firstDraft.id).single();
             if (fullDraft) {
                 contextData = {
                    id: fullDraft.id,
                    data: fullDraft.draft_data,
                    templateId: fullDraft.template_id,
                    name: fullDraft.name,
                    isDraft: true,
                    slug: null
                };
             }
        }

        // 4. Resolve Template Name
        if (contextData) {
             let templateName = 'flara';
             if (contextData.templateId) {
                 const { data: t } = await supabase.from('templates').select('name').eq('id', contextData.templateId).maybeSingle();
                 if (t) templateName = t.name;
             }
             setEditorData({ ...contextData, templateName });
        } else {
             // No site, no drafts
             setError("No projects found.");
        }

      } catch (err) {
        console.error("Dashboard Fetch Error:", err);
        setError("Failed to load dashboard.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [draftIdParam, siteIdParam]);

  const handleSwitch = (type, id) => {
      const params = new URLSearchParams(window.location.search);
      if (type === 'draft') {
          params.set('draft_id', id);
          params.delete('site_id');
      } else {
          params.set('site_id', id);
          params.delete('draft_id');
      }
      router.push(`?${params.toString()}`);
      setIsSwitcherOpen(false);
  };

  if (loading) {
    return (
        <div className="flex items-center justify-center h-full min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
            <h2 className="text-xl font-semibold text-gray-800">{error}</h2>
            <Link href="/templates" className="px-6 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition">
                Create a Website
            </Link>
        </div>
    );
  }

  return (
    <div className="relative h-full flex flex-col">
        {/* Optional Dashboard-Specific Switcher Banner */}
        {/* We can rely on EditorTopNav for switching, but user asked for "banner like other draft website" */}
        {/* Let's add a small banner if there are multiple options */}
        {(drafts.length > 0 || liveSite) && (
            <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 flex items-center justify-between text-sm">
                <span className="text-gray-600">
                    Editing: <span className="font-semibold text-gray-900">{editorData.isDraft ? `Draft: ${editorData.name}` : `Live Site: ${editorData.name}`}</span>
                </span>

                <div className="relative">
                    <button
                        onClick={() => setIsSwitcherOpen(!isSwitcherOpen)}
                        className="flex items-center gap-1 text-purple-600 hover:text-purple-800 font-medium"
                    >
                        Switch Project <ChevronDown size={14} />
                    </button>
                    {isSwitcherOpen && (
                        <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded shadow-lg z-50">
                             {liveSite && (
                                <button
                                    onClick={() => handleSwitch('site', liveSite.id)}
                                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between ${!editorData.isDraft ? 'bg-blue-50' : ''}`}
                                >
                                    <span>{liveSite.business_name || 'Live Site'} <span className="text-xs text-green-600 ml-1">(Live)</span></span>
                                    {!editorData.isDraft && <Check size={14} />}
                                </button>
                             )}
                             {drafts.map(d => (
                                <button
                                    key={d.id}
                                    onClick={() => handleSwitch('draft', d.id)}
                                    className={`w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center justify-between ${editorData.isDraft && editorData.id === d.id ? 'bg-blue-50' : ''}`}
                                >
                                    <span>{d.name || 'Untitled Draft'} <span className="text-xs text-gray-500 ml-1">(Draft)</span></span>
                                    {editorData.isDraft && editorData.id === d.id && <Check size={14} />}
                                </button>
                             ))}
                             <div className="border-t border-gray-100 p-2">
                                <Link href="/templates" className="block text-center text-blue-600 hover:underline">+ Create New</Link>
                             </div>
                        </div>
                    )}
                </div>
            </div>
        )}

        <EditorLayout
            mode="dashboard"
            templateName={editorData.templateName}
            websiteId={!editorData.isDraft ? editorData.id : null}
            draftId={editorData.isDraft ? editorData.id : null}
            initialData={editorData.data}
            siteSlug={editorData.slug}
        />
    </div>
  );
}

export default function WebsiteDashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <WebsiteDashboardContent />
    </Suspense>
  );
}
