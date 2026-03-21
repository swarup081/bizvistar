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
             <header className="w-full bg-white shadow-sm relative">
                {/* Row 1: Logo & Actions */}
                <div className="w-full h-[65px] border-b border-gray-200 px-4 flex items-center justify-between">
                    {/* Left: Logo and Dashboard Link */}
                    <div className="flex items-center gap-4">
                       <div className="h-8 w-8 bg-gray-200 rounded-md animate-pulse"></div>
                       <div className="hidden lg:block h-6 w-24 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    {/* Center: Device toggles (desktop) */}
                    <div className="hidden lg:flex items-center gap-2">
                       <div className="h-8 w-8 bg-gray-200 rounded-md animate-pulse"></div>
                       <div className="h-8 w-8 bg-gray-200 rounded-md animate-pulse"></div>
                    </div>
                    {/* Right: Actions */}
                    <div className="flex gap-2">
                        <div className="h-8 w-8 lg:w-20 bg-gray-200 rounded-full animate-pulse"></div>
                        <div className="h-8 w-8 lg:w-24 bg-gray-200 rounded-full animate-pulse"></div>
                    </div>
                </div>
                {/* Row 2: Page Selector */}
                <div className="w-full h-[50px] border-b border-gray-200 px-4 flex items-center">
                    <div className="h-6 w-12 bg-gray-200 rounded animate-pulse mr-2"></div>
                    <div className="h-8 w-32 bg-gray-200 rounded-md animate-pulse"></div>
                </div>

                {/* Progress Bar (Animated) */}
                <div className="absolute bottom-0 left-0 h-[2px] bg-[#8A63D2] w-full animate-[progress_3s_ease-out_forwards]" style={{ transformOrigin: 'left' }}></div>
                <style dangerouslySetInnerHTML={{__html: `
                  @keyframes progress {
                    0% { transform: scaleX(0); opacity: 1; }
                    40% { transform: scaleX(0.4); opacity: 1; }
                    80% { transform: scaleX(0.8); opacity: 1; }
                    100% { transform: scaleX(0.95); opacity: 1; }
                  }
                `}} />
             </header>
          </div>

          {/* Iframe Area Skeleton (Video) */}
          <main className="flex-grow flex items-center justify-center overflow-hidden relative bg-[#F3F4F6] p-4 lg:p-0">
             <div className="w-full h-full lg:w-[1024px] lg:h-[100%] bg-white rounded-3xl lg:rounded-md shadow-lg border border-gray-300 flex items-center justify-center overflow-hidden relative">
                 <video
                    src="/loadingofeditorBackgroundRemover.mp4"
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-48 h-48 md:w-64 md:h-64 object-contain opacity-80"
                 />
             </div>
          </main>
        </div>

        {/* Column 2: Sidebar Skeleton (Hidden on mobile) */}
        <aside className="hidden lg:flex w-[380px] bg-white border-l border-gray-200 h-full flex-col z-30 shrink-0 shadow-[-4px_0_15px_-3px_rgba(0,0,0,0.05)]">
          {/* Sidebar Tabs */}
          <div className="h-[65px] border-b border-gray-200 flex items-center justify-around px-2">
             <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"></div>
             <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"></div>
             <div className="h-10 w-24 bg-gray-200 rounded-md animate-pulse"></div>
          </div>
          {/* Sidebar Content Items */}
          <div className="p-6 space-y-4">
             <div className="h-14 w-full bg-gray-100 rounded-xl animate-pulse"></div>
             <div className="h-14 w-full bg-gray-100 rounded-xl animate-pulse"></div>
             <div className="h-14 w-full bg-gray-100 rounded-xl animate-pulse"></div>
             <div className="h-40 w-full bg-gray-100 rounded-xl animate-pulse mt-8"></div>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <EditorLayout templateName={templateName} />
  );
}