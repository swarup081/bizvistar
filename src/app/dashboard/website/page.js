'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import EditorLayout from '@/components/editor/EditorLayout';
import Link from 'next/link';

function WebsiteDashboardContent() {
  const [loading, setLoading] = useState(true);
  const [website, setWebsite] = useState(null);
  const [error, setError] = useState(null);
  
  const searchParams = useSearchParams();
  const slugParam = searchParams.get('slug');

  useEffect(() => {
    async function fetchUserWebsite() {
      try {
        // 1. Get current user
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            // If no user, maybe redirect to login? But for now just show error.
            setError("Please log in to view your website.");
            setLoading(false);
            return;
        }

        // 2. Fetch website for this user
        let query = supabase
          .from('websites')
          .select('id, site_slug, template_id, website_data, draft_data')
          .eq('user_id', user.id);

        if (slugParam) {
           query = query.eq('site_slug', slugParam).single();
        } else {
           // Default: Most recent published site
           query = query
              .eq('is_published', true)
              .order('created_at', { ascending: false })
              .limit(1)
              .maybeSingle();
        }

        const { data: site, error: dbError } = await query;

        if (dbError) {
             console.error('Error fetching website:', JSON.stringify(dbError, null, 2));
             setError("Failed to load website.");
        } else if (site) {
             let templateName = 'flara'; // Default

             if (site.template_id) {
                 // Fetch template name
                 const { data: templateData, error: templateError } = await supabase
                    .from('templates')
                    .select('name')
                    .eq('id', site.template_id)
                    .maybeSingle();
                 
                 if (templateData) {
                     templateName = templateData.name;
                 }
             }

             // --- INJECT REAL PRODUCTS & CATEGORIES ---
             const [ { data: realProducts }, { data: realCategories } ] = await Promise.all([
                 supabase
                    .from('products')
                    .select('*')
                    .eq('website_id', site.id)
                    .order('id', { ascending: false }),
                 supabase
                    .from('categories')
                    .select('*')
                    .eq('website_id', site.id)
                    .order('name')
             ]);

             const rawData = site.draft_data || site.website_data || {};
             const finalData = { ...rawData };
             
             // Overwrite with real DB data to remove demo data
             finalData.allProducts = realProducts || [];
             finalData.allCategories = realCategories || [];

             setWebsite({
                 id: site.id,
                 slug: site.site_slug,
                 templateName: templateName,
                 data: finalData
             });
        } else {
            setError("You haven't created a website yet.");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("An unexpected error occurred.");
      } finally {
        setLoading(false);
      }
    }

    fetchUserWebsite();
  }, [slugParam]); // Added slugParam dependency

  if (loading) {
    return (
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_auto] h-full w-full bg-gray-50 overflow-hidden">
        {/* Column 1: Main Content Skeleton (Nav + Preview) */}
        <div className="flex flex-col overflow-hidden relative h-full">
          {/* Topbar Skeleton (Two rows to match EditorTopNav) */}
          <div className="flex-shrink-0 z-20 relative">
             <header className="w-full bg-white shadow-sm">
                <div className="w-full h-[65px] border-b border-gray-200 px-4 flex items-center justify-between">
                    <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                    <div className="flex gap-3 hidden lg:flex">
                        <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                </div>
                <div className="w-full h-[50px] border-b border-gray-200 px-4 flex items-center">
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                </div>
             </header>
          </div>
          {/* Iframe Area Skeleton */}
          <main className="flex-grow flex items-center justify-center overflow-hidden relative bg-[#F3F4F6] p-4 lg:p-0">
             <div className="w-full h-full lg:w-[1024px] lg:h-[100%] bg-white rounded-3xl lg:rounded-md shadow-lg border border-gray-300 flex items-center justify-center animate-pulse transition-all duration-300">
                 <div className="flex flex-col items-center gap-4 text-gray-400">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-600 rounded-full animate-spin"></div>
                    <p className="text-sm font-medium">Loading Editor...</p>
                 </div>
             </div>
          </main>
        </div>

        {/* Column 2: Sidebar Skeleton */}
        <aside className="w-full lg:w-[380px] bg-white border-l border-gray-200 h-[50vh] lg:h-full flex flex-col z-30 shrink-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
          <div className="h-16 border-b border-gray-200 flex items-center px-6">
             <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="p-6 space-y-4">
             <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse"></div>
             <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse"></div>
             <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse"></div>
             <div className="h-32 w-full bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
        </aside>
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
            <h2 className="text-xl font-semibold text-gray-800">{error}</h2>
            <Link href="/templates" className="px-6 py-2 bg-brand-600 text-white rounded-full hover:bg-[#7554b3] transition">
                Create a Website
            </Link>
        </div>
    );
  }

  return (
    <EditorLayout 
        mode="dashboard"
        templateName={website.templateName}
        websiteId={website.id}
        initialData={website.data}
        siteSlug={website.slug}
    />
  );
}

export default function WebsiteDashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-600"></div>
      </div>
    }>
      <WebsiteDashboardContent />
    </Suspense>
  );
}
