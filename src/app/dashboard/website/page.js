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
      <div className="flex h-screen w-full bg-gray-50 overflow-hidden">
        {/* Sidebar Skeleton */}
        <div className="w-[380px] h-full bg-white border-r border-gray-200 p-6 flex flex-col gap-6 shrink-0">
          <div className="h-8 w-3/4 bg-gray-200 rounded animate-pulse"></div>
          <div className="space-y-4">
             <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse"></div>
             <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse"></div>
             <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse"></div>
             <div className="h-12 w-full bg-gray-100 rounded-lg animate-pulse"></div>
          </div>
        </div>
        {/* Main Content Skeleton */}
        <div className="flex-1 flex flex-col">
          {/* Topbar Skeleton */}
          <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shrink-0">
             <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
             <div className="flex gap-3">
                 <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
                 <div className="h-8 w-24 bg-gray-200 rounded-full animate-pulse"></div>
             </div>
          </div>
          {/* Iframe Area Skeleton */}
          <div className="flex-1 p-6 flex items-center justify-center">
             <div className="w-full max-w-4xl h-full max-h-[800px] bg-white rounded-xl shadow-sm border border-gray-200 animate-pulse flex items-center justify-center">
                 <div className="flex flex-col items-center gap-4 text-gray-400">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-brand-600 rounded-full animate-spin"></div>
                    <p className="text-sm font-medium">Loading Editor...</p>
                 </div>
             </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
        <div className="flex flex-col items-center justify-center h-full min-h-[400px] gap-4">
            <h2 className="text-xl font-semibold text-gray-800">{error}</h2>
            <Link href="/templates" className="px-6 py-2 bg-brand-600 text-white rounded-full hover:bg-brand-700 transition">
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
