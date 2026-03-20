'use client';
export const runtime = 'edge';

import { useParams } from 'next/navigation';
import EditorLayout from '@/components/editor/EditorLayout';

export default function EditorPage() {
  const params = useParams();
  const { templateName } = params;

  if (!templateName) {
    return (
      <div className="flex flex-col lg:grid lg:grid-cols-[1fr_auto] h-screen w-full bg-gray-50 overflow-hidden">
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
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-[#8A63D2] rounded-full animate-spin"></div>
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

  return (
    <EditorLayout templateName={templateName} />
  );
}