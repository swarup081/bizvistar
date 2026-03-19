'use client';
export const runtime = 'edge';

import { useParams } from 'next/navigation';
import EditorLayout from '@/components/editor/EditorLayout';

export default function EditorPage() {
  const params = useParams();
  const { templateName } = params;

  if (!templateName) {
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

  return (
    <EditorLayout templateName={templateName} />
  );
}