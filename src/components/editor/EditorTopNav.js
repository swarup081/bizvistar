'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import {
  Monitor, Smartphone, ChevronDown, Info, Check, RotateCcw, Save
} from 'lucide-react';
import Logo from '@/lib/logo/logoOfBizVistar';
import AIContentModal from './AIContentModal';
import { generateAIContent } from '@/app/actions/onboardingActions';

// A simple reusable button component for the nav
const NavButton = ({ children, className = '', ...props }) => (
  <button
    className={`flex items-center gap-2 text-sm font-medium text-gray-700 px-3 py-2 rounded-md transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

// ... (IconUndo, IconRedo, VerticalSeparator, Tooltip components remain the same) ...

// --- Custom SVG Icons ---
const IconUndo = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
  </svg>
);

const IconRedo = () => (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3" />
  </svg>
);
// --- End Custom Icons ---

const VerticalSeparator = () => (
  <div className="w-px h-[50px] bg-gray-300"></div>
);

// --- Tooltip Component ---
const Tooltip = ({ children, title, description, content }) => {
  const [isVisible, setIsVisible] = useState(false);

  // Use custom 'content' prop if provided, otherwise build from title/description
  const tooltipContent = content ? (
    content
  ) : (
    <>
      <h3 className="font-semibold text-gray-900 text-base mb-1">{title}</h3>
      <p className="text-gray-600 text-sm">{description}</p>
    </>
  );

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
    >
      {/* The trigger element */}
      {children}
      
      {/* The tooltip popup */}
      {isVisible && (
        <div 
          className="absolute top-full left-1/2 -translate-x-1/2 mt-3 z-20 w-72 bg-white p-4 rounded-lg shadow-xl ring-1 ring-gray-900/5"
        >
          {/* Arrow (pointing up) */}
          <svg 
            className="absolute bottom-full left-1/2 -translate-x-1/2 w-4 h-4 text-white"
            // This drop shadow makes the arrow blend with the box shadow
            style={{ filter: 'drop-shadow(0 -1px 1px rgb(0 0 0 / 0.05))' }}
            viewBox="0 0 16 8" 
            fill="currentColor"
          >
             <path d="M0 8 L8 0 L16 8" />
          </svg>
          
          {tooltipContent}
        </div>
      )}
    </div>
  );
};
// --- End Tooltip Component ---

// --- Restart Confirmation Modal (Professional UI) ---
const RestartConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-start">
          {/* Icon */}
          <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
            <RotateCcw className="h-6 w-6 text-red-600" aria-hidden="true" />
          </div>
          <div className="ml-4 text-left">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Reset Template?
            </h3>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                Are you sure? This will reset all customizations for this template back to their defaults. Your startup info (like business name) will not be affected.
              </p>
            </div>
          </div>
        </div>
        <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            className="w-full inline-flex justify-center rounded-3xl border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 sm:ml-3 sm:w-auto sm:text-sm"
            onClick={onConfirm}
          >
            Yes, Reset
          </button>
          <button
            type="button"
            className="mt-3 w-full inline-flex justify-center rounded-3xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
// --- End Restart Modal ---


export default function EditorTopNav({ 
    mode, // 'dashboard' or undefined/null
    siteSlug, // Passed from DB
    templateName, 
    websiteId, // <-- NEW PROP
    saveStatus, // <-- NEW PROP
    view, 
    onViewChange, 
    activePage, 
    pages, 
    onPageChange,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    onRestart,
    isLandingMode = false, // <-- NEW PROP
    setBusinessData, // <-- ADDED for AI Update
    onPublish // <-- ADDED
}) {
  const [isPageDropdownOpen, setIsPageDropdownOpen] = useState(false);
  const [isRestartModalOpen, setIsRestartModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false); // AI Modal State

  const router = useRouter();
  
  const currentPageName = pages.find(p => p.path === activePage)?.name || 'Home';
  
  // Use DB slug if in dashboard/available, else default placeholder
  const displaySlug = siteSlug || 'your-site-slug';
  const siteUrl = `${displaySlug}.bizvistaar.com`;

  const handlePageSelect = (path) => {
    onPageChange(path);
    setIsPageDropdownOpen(false);
  };

  const handleRestartConfirm = () => {
    if (isLandingMode) return; // Disable in Landing Mode
    onRestart();
    setIsRestartModalOpen(false);
  };

  const handlePublish = async () => {
    if (isLandingMode) return; // Disable in Landing Mode

    if (isPublishing) return;
    setIsPublishing(true);
    try {
        const { success, error } = await onPublish();

        if (success) {
            alert('Website published successfully!');
        } else {
            if (error === 'PAYMENT_REQUIRED') {
                router.push(`/pricing?site_id=${websiteId}`);
            } else {
                console.error('Publish error:', error);
                alert('Failed to publish. Please try again.');
            }
        }
    } catch (error) {
        console.error('Publish error:', error);
        alert('An error occurred.');
    } finally {
        setIsPublishing(false);
    }
  };

  // Helper to intercept clicks in Landing Mode
  const onLandingDummyClick = (e) => {
    if (isLandingMode) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  // --- AI Generation Handler ---
  const handleAIGenerate = async (description) => {
      if (!setBusinessData) return;
      
      const { success, data, error } = await generateAIContent(description, templateName);
      if (success) {
          setBusinessData(data);
      } else {
          throw new Error(error); // Modal will catch this
      }
  };

  return (
    <header className="w-full bg-white shadow-sm">
      {/* Top-most Bar */}
      <div className="w-full h-[65px] border-b border-gray-200 px-4 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-6">
          {mode !== 'dashboard' ? (
            <>
              <Link href="/">
                <Logo className="text-3xl cursor-pointer" />
              </Link>
              {/* Hide "Hire" on mobile (< lg) */}
              <div className="hidden lg:flex items-center gap-2">
                <Tooltip
                  title="Hire a Professional"
                  description="Need help with design or content? Our experts are here to assist."
                >
                  <NavButton>Hire a Professional</NavButton>
                </Tooltip>
                
                {/* AI Button (Replaces Help) - Desktop Only if mode != dashboard */}
                {mode !== 'dashboard' && (
                    <Tooltip title="AI Writer" description="Rewrite your website content instantly.">
                        <button 
                            onClick={() => setIsAIModalOpen(true)}
                            className="flex items-center gap-2 text-sm font-medium text-[#8A63D2] px-3 py-2 rounded-full transition-colors hover:bg-purple-50 "
                        >
                            <img src="/aiicon.png" alt="AI" className="w-5 h-5 object-contain" />
                            AI Writer
                        </button>
                    </Tooltip>
                )}
              </div>
            </>
          ) : (
             !isLandingMode && (
                <span className="text-xl font-bold text-gray-900 hidden lg:inline">
                   Website Editor
                </span>
             )
          )}
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3">
          
          {isLandingMode ? (
            <Tooltip title="Just a demo" description=" Unlock full potential in the editor">
              <button 
                onClick={onLandingDummyClick}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 px-3 py-2 rounded-md transition-colors cursor-default"
              >
                Reset 
              </button>
            </Tooltip>
          ) : (
            <Tooltip
              title="Reset "
              description="Reset all theme customizations back to defaults."
            >
              <button 
                onClick={() => setIsRestartModalOpen(true)}
                className="flex items-center gap-2 text-sm font-medium text-gray-700 px-3 py-2 rounded-md transition-colors"
              >
                Reset 
              </button>
            </Tooltip>
          )}

          <div className="hidden lg:block w-px h-5 bg-gray-300"></div> 
          
          {/* --- SAVE STATUS (Desktop) --- */}
          <div
            className={`hidden lg:flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md ${
              saveStatus === 'Saved' ? 'text-gray-400' : 'text-[#8A63D2]'
            }`}
          >
            {saveStatus === 'Saved' && <Check size={16} />}
            {saveStatus === 'Saving...' && (
              <svg className="animate-spin h-4 w-4 text-[#8A63D2]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            )}
            {saveStatus}
          </div>

          {/* --- MOBILE ONLY: AI BUTTON --- */}
          {mode !== 'dashboard' && (
             <button
               onClick={() => setIsAIModalOpen(true)}
               className="lg:hidden flex items-center justify-center p-2 rounded-full hover:bg-purple-50 transition-colors"
             >
                <img src="/aiicon.png" alt="AI" className="w-6 h-6 object-contain" />
             </button>
          )}

          {/* --- MOBILE ONLY: SAVE BUTTON (Manual) --- */}
          <button
               className="lg:hidden flex items-center gap-2 text-sm font-medium text-gray-700 px-3 py-2 rounded-md transition-colors"
               // It doesn't actually trigger save (since auto-save handles it), but shows status visually
               disabled={true} 
           >
              {saveStatus === 'Saving...' ? (
                   <Loader2 size={20} className="animate-spin text-[#8A63D2]" />
              ) : (
                  <span className="text-gray-600 font-bold text-xs">{saveStatus === 'Saved' ? 'Saved' : 'Save'}</span>
              )}
           </button>

          {isLandingMode ? (
            <Tooltip title="Just a demo" description="Unlock full potential in the editor">
              <Link 
                href="#"
                onClick={onLandingDummyClick}
                className="hidden lg:flex items-center gap-2 text-sm font-medium text-purple-600 px-3 py-2 rounded-full transition-colors cursor-default hover:bg-transparent"
              >
                Preview
              </Link>
            </Tooltip>
          ) : (
            // Hide Preview on Mobile
            <Tooltip
              title="Preview"
              description="See what your live site will look like to visitors."
            >
              <Link 
                href={`/preview/site/${siteSlug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden lg:flex items-center gap-2 text-sm font-medium text-purple-600 px-3 py-2 rounded-full transition-colors hover:bg-purple-50"
              >
                Preview
              </Link>
            </Tooltip>
          )}
          
          {/* --- PUBLISH BUTTON --- */}
          {isLandingMode ? (
             <Tooltip title="Just a demo" description="Unlock full potential in the editor">
                <button
                  onClick={onLandingDummyClick}
                  className="flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-2 rounded-4xl transition-colors cursor-default hover:bg-black"
                >
                  Publish
                </button>
             </Tooltip>
          ) : (
            mode === 'dashboard' ? (
                <button
                  onClick={handlePublish}
                  disabled={isPublishing}
                  className="flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-2 rounded-4xl transition-colors disabled:opacity-50"
                >
                  {isPublishing ? 'Publishing...' : 'Publish'}
                </button>
            ) : (
                <Link
                  href={`/pricing?site_id=${websiteId}`} 
                  className="flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-2 rounded-4xl transition-colors"
                >
                  Publish
                </Link>
            )
          )}

        </div>
      </div>

      {/* ... (Second Bar remains unchanged) ... */}
      <div className="w-full h-[50px] border-b border-gray-200 px-4 flex items-center">
        {/* Left: Page & Devices */}
        <div className="flex items-center gap-4">
          <div className="relative">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Page:</span>
              <button 
                onClick={() => !isLandingMode && setIsPageDropdownOpen(prev => !prev)}
                className={`flex items-center gap-1 font-medium text-gray-900 ${isLandingMode ? 'cursor-default' : ''}`}
              >
                {currentPageName}
                <ChevronDown size={16} />
              </button>
            </div>
            {!isLandingMode && isPageDropdownOpen && (
              <div className="absolute top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {pages.map(page => (
                  <button
                    key={page.path}
                    onClick={() => handlePageSelect(page.path)}
                    className={`w-full text-left px-3 py-2 text-sm ${activePage === page.path ? 'bg-[#8A63D2]/10 text-[#8A63D2]' : 'text-gray-700'} hover:bg-gray-100`}
                  >
                    {page.name}
                  </button>
                ))}
              </div>
            )}
          </div>
          <VerticalSeparator />
          <div className="flex items-center gap-2">
            <Tooltip title="Desktop View" description="See how your site looks on a computer.">
              <button
                onClick={() => onViewChange('desktop')}
                className={`p-2 rounded-md ${view === 'desktop' ? 'bg-[#8A63D2]/20 text-[#8A63D2]' : 'text-gray-500 '}`}
              >
                <Monitor size={20} />
              </button>
            </Tooltip>
            <Tooltip title="Mobile View" description="See how your site looks on a phone.">
              <button
                onClick={() => onViewChange('mobile')}
                className={`p-2 rounded-md ${view === 'mobile' ? 'bg-[#8A63D2]/20 text-[#8A63D2]' : 'text-gray-500 '}`}
              >
                <Smartphone size={20} />
              </button>
            </Tooltip>
          </div>
          <VerticalSeparator />
        </div>
        {/* Center: URL Bar with Tooltip (Hidden on Mobile) */}
        <div className="hidden lg:block flex-grow min-w-0 mx-4">
          <Tooltip
            title="Your Site Address"
            description="This is your temporary website URL. Click 'Connect Your Domain' to use a custom address."
          >
            <div className={`bg-gray-50 border border-gray-300 rounded-4xl px-3 py-2 text-sm text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap ${isLandingMode ? 'cursor-default' : 'cursor-pointer'}`}>
              {siteUrl}
              {!isLandingMode && <span className="text-purple-600 ml-2 font-medium">Connect Your Domain</span>}
            </div>
          </Tooltip>
        </div>
        {/* Right: Tools (Undo/Redo) with conditional Tooltips (Hidden on Mobile) */}
        <div className="hidden lg:flex items-center gap-2 text-gray-600">
          <VerticalSeparator />
          {canUndo ? (
            <Tooltip title="Undo" description="Undo your last action.">
              <button 
                onClick={onUndo}
                className="p-2 rounded-md text-gray-500"
                aria-label="Undo"
              >
                <IconUndo />
              </button>
            </Tooltip>
          ) : (
            <button 
              disabled
              className="p-2 rounded-md text-gray-300 "
              aria-label="Undo (disabled)"
            >
              <IconUndo />
            </button>
          )}
          {canRedo ? (
            <Tooltip title="Redo" description="Redo an action you undid.">
              <button 
                onClick={onRedo}
                className="p-2 rounded-md text-gray-500"
                aria-label="Redo"
              >
                <IconRedo />
              </button>
            </Tooltip>
          ) : (
             <button 
              disabled
              className="p-2 rounded-md text-gray-300 "
              aria-label="Redo (disabled)"
            >
              <IconRedo />
            </button>
          )}
        </div>
        
        {/* Mobile: Space Filler if needed */}
         <div className="flex lg:hidden items-center gap-3 pl-5 mx-auto">
            {/* The previous Save Status was here, but we moved it to top bar */}
         </div>
      </div>

      <RestartConfirmationModal
        isOpen={isRestartModalOpen}
        onClose={() => setIsRestartModalOpen(false)}
        onConfirm={handleRestartConfirm}
      />
      
      <AIContentModal
        isOpen={isAIModalOpen}
        onClose={() => setIsAIModalOpen(false)}
        onGenerate={handleAIGenerate}
      />
    </header>
  );
}

// Helper Loader for Save Button
const Loader2 = ({ size, className }) => (
    <svg className={`animate-spin ${className}`} width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M21 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);