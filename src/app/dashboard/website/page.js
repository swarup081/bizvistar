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
           // Default: Most recent
           query = query.order('updated_at', { ascending: false }).limit(1).maybeSingle();
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

             setWebsite({
                 id: site.id,
                 slug: site.site_slug,
                 templateName: templateName,
                 data: site.draft_data || site.website_data
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
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    }>
      <WebsiteDashboardContent />
    </Suspense>
  );
}
