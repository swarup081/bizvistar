'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import {
  Monitor, Smartphone, ChevronDown, Info, Check, RotateCcw, AlertTriangle, FileText, Globe
} from 'lucide-react';
import Logo from '@/lib/logo/logoOfBizVistar';

// A simple reusable button component for the nav
const NavButton = ({ children, className = '', ...props }) => (
  <button
    className={`flex items-center gap-2 text-sm font-medium text-gray-700 px-3 py-2 rounded-md transition-colors ${className}`}
    {...props}
  >
    {children}
  </button>
);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
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

// --- Publish Confirmation Modal ---
const PublishConfirmationModal = ({ isOpen, onClose, onConfirm, isPublishing }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
       <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
         <div className="flex items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                <AlertTriangle className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4 text-left">
                <h3 className="text-lg font-bold text-gray-900 mb-1">Publish Website?</h3>
                <p className="text-sm text-gray-600 mb-4">
                    This action will <strong>overwrite your live website</strong> with the changes from this draft.
                    Your existing live content will be replaced.
                </p>
                <p className="text-sm text-gray-500">
                    Are you sure you want to proceed?
                </p>
            </div>
         </div>
         <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse gap-3">
            <button
                onClick={onConfirm}
                disabled={isPublishing}
                className="w-full inline-flex justify-center rounded-3xl border border-transparent shadow-sm px-4 py-2 bg-black text-white hover:bg-gray-800 disabled:opacity-50 text-base font-medium sm:w-auto sm:text-sm"
            >
                {isPublishing ? 'Publishing...' : 'Yes, Publish'}
            </button>
            <button
                onClick={onClose}
                disabled={isPublishing}
                className="mt-3 w-full inline-flex justify-center rounded-3xl border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 sm:mt-0 sm:w-auto sm:text-sm"
            >
                Cancel
            </button>
         </div>
       </div>
    </div>
  );
};

// --- Custom Alert Modal ---
const AlertModal = ({ isOpen, onClose, title, message }) => {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-sm p-6 text-center">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
            <p className="text-gray-600 mb-6">{message}</p>
            <button
                onClick={onClose}
                className="bg-black text-white px-6 py-2 rounded-full text-sm font-medium hover:bg-gray-800"
            >
                OK
            </button>
        </div>
      </div>
    );
}


export default function EditorTopNav({ 
    mode,
    siteSlug,
    templateName, 
    websiteId,
    draftId,
    saveStatus,
    view, 
    onViewChange, 
    activePage, 
    pages, 
    onPageChange,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    onRestart
}) {
  const [isPageDropdownOpen, setIsPageDropdownOpen] = useState(false);
  const [isDraftDropdownOpen, setIsDraftDropdownOpen] = useState(false);
  const [isRestartModalOpen, setIsRestartModalOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);

  const [alertState, setAlertState] = useState({ isOpen: false, title: '', message: '' });

  // State for Draft Switcher
  const [availableDrafts, setAvailableDrafts] = useState([]);
  const [liveSiteInfo, setLiveSiteInfo] = useState(null);

  const router = useRouter();
  
  const currentPageName = pages.find(p => p.path === activePage)?.name || 'Home';
  
  const displaySlug = siteSlug || 'your-site-slug';
  const siteUrl = `${displaySlug}.bizvistaar.com`;

  // Fetch drafts for the switcher
  useEffect(() => {
    async function fetchDrafts() {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        // Fetch Live Site
        const { data: live } = await supabase
            .from('websites')
            .select('id, business_name, updated_at')
            .eq('user_id', user.id)
            .limit(1)
            .maybeSingle();
        setLiveSiteInfo(live);

        // Fetch Drafts
        const { data: drafts } = await supabase
            .from('website_drafts')
            .select('id, name, updated_at')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false });
        setAvailableDrafts(drafts || []);
    }
    fetchDrafts();
  }, []);

  const handlePageSelect = (path) => {
    onPageChange(path);
    setIsPageDropdownOpen(false);
  };

  const handleDraftSelect = (type, id) => {
      // Navigate to selected draft/live
      const params = new URLSearchParams(window.location.search);
      if (type === 'live') {
          params.set('site_id', id);
          params.delete('draft_id');
      } else {
          params.set('draft_id', id);
          params.delete('site_id');
      }
      router.push(`?${params.toString()}`);
      setIsDraftDropdownOpen(false);
  };

  const handleRestartConfirm = () => {
    onRestart();
    setIsRestartModalOpen(false);
  };

  const onPublishClick = async () => {
      // Check 'is_published' status FIRST (as per new requirement)
      // "check for ispublish if true directly or else redirect to the checkout page"
      try {
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) {
              router.push('/sign-in');
              return;
          }

          // Check if user has a published site in 'websites' table
          const { data: website } = await supabase
              .from('websites')
              .select('is_published')
              .eq('user_id', user.id)
              .eq('is_published', true)
              .limit(1)
              .maybeSingle();

          // Also check subscription as a secondary validation?
          // The requirement specifically mentions "ispublish if true directly".
          // But technically if subscription expired, we might want to block?
          // However, assuming 'is_published' implies they paid and are active OR we rely on middleware/backend checks.
          // Let's stick to the requirement: "if true directly or else redirect to checkout"

          if (website && website.is_published) {
              setIsPublishModalOpen(true);
          } else {
              // Redirect to Pricing/Checkout if not published
              router.push(`/pricing?site_id=${websiteId || ''}&draft_id=${draftId || ''}`);
          }

      } catch (err) {
          console.error("Publish check failed", err);
          setAlertState({ isOpen: true, title: 'Error', message: 'Could not verify status.' });
      }
  };

  const handlePublishConfirm = async () => {
    if (isPublishing) return;
    setIsPublishing(true);
    try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
            router.push('/sign-in');
            return;
        }

        const payload = {};
        if (draftId) payload.draftId = draftId;
        else if (websiteId) payload.websiteId = websiteId;
        else {
             setAlertState({ isOpen: true, title: 'Error', message: 'No content to publish.' });
             setIsPublishing(false);
             setIsPublishModalOpen(false);
             return;
        }

        const { error } = await supabase.functions.invoke('publish-website', {
            headers: {
                'Authorization': `Bearer ${session.access_token}`
            },
            body: payload
        });

        if (error) {
             console.error('Publish error:', error);
             setAlertState({ isOpen: true, title: 'Publish Failed', message: 'An error occurred while publishing. Please try again.' });
        } else {
             setIsPublishModalOpen(false);
             setAlertState({ isOpen: true, title: 'Success!', message: 'Your website has been published successfully.' });
        }

    } catch (err) {
        console.error('Publish unexpected error:', err);
        setAlertState({ isOpen: true, title: 'Error', message: 'An unexpected error occurred.' });
    } finally {
        setIsPublishing(false);
    }
  };

  return (
    <header className="w-full bg-white shadow-sm">
      {/* Top-most Bar */}
      <div className="w-full h-[65px] border-b border-gray-200 px-4 flex items-center justify-between">
        {/* Left Side: Draft Switcher (Replacing Logo/Text) */}
        <div className="flex items-center gap-6">
          {mode === 'dashboard' ? (
             <div className="relative">
                 <button
                    onClick={() => setIsDraftDropdownOpen(!isDraftDropdownOpen)}
                    className="flex items-center gap-2 text-xl font-bold text-gray-900 hover:text-gray-700 transition"
                 >
                    {websiteId ? 'Live Website' : 'Draft Editor'}
                    <ChevronDown size={18} />
                 </button>
                 {isDraftDropdownOpen && (
                     <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden">
                        <div className="p-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                            Switch Project
                        </div>
                        <div className="max-h-[300px] overflow-y-auto">
                            {/* Live Site Option */}
                            {liveSiteInfo && (
                                <button
                                    onClick={() => handleDraftSelect('live', liveSiteInfo.id)}
                                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-100 ${websiteId === liveSiteInfo.id ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-green-600">
                                        <Globe size={16} />
                                    </div>
                                    <div className="truncate">
                                        <div className="font-medium text-gray-900 truncate">{liveSiteInfo.business_name || 'Live Site'}</div>
                                        <div className="text-xs text-green-600 font-medium">Published</div>
                                    </div>
                                    {websiteId === liveSiteInfo.id && <Check size={16} className="ml-auto text-blue-600" />}
                                </button>
                            )}

                            {/* Drafts Options */}
                            {availableDrafts.map(draft => (
                                <button
                                    key={draft.id}
                                    onClick={() => handleDraftSelect('draft', draft.id)}
                                    className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-gray-50 border-b border-gray-100 last:border-0 ${draftId === draft.id ? 'bg-blue-50' : ''}`}
                                >
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600">
                                        <FileText size={16} />
                                    </div>
                                    <div className="truncate">
                                        <div className="font-medium text-gray-900 truncate">{draft.name || 'Untitled Draft'}</div>
                                        <div className="text-xs text-gray-500">Last edited: {new Date(draft.updated_at).toLocaleDateString()}</div>
                                    </div>
                                    {draftId === draft.id && <Check size={16} className="ml-auto text-blue-600" />}
                                </button>
                            ))}
                            {availableDrafts.length === 0 && !liveSiteInfo && (
                                <div className="p-4 text-center text-sm text-gray-500">No projects found.</div>
                            )}
                        </div>
                        <div className="p-2 bg-gray-50 border-t border-gray-200">
                            <Link href="/templates" className="flex items-center justify-center w-full py-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                                + Create New
                            </Link>
                        </div>
                     </div>
                 )}
             </div>
          ) : (
            <>
              <Link href="/">
                <Logo className="text-3xl cursor-pointer" />
              </Link>
              <div className="flex items-center gap-2">
                 {/* Public mode (not dashboard editor) */}
              </div>
            </>
          )}
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3">
          
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

          <div className="w-px h-5 bg-gray-300"></div> 
          
          {/* --- SAVE STATUS --- */}
          <div
            className={`flex items-center gap-2 text-sm font-medium px-3 py-2 rounded-md ${
              saveStatus === 'Saved' ? 'text-gray-400' : 'text-blue-600'
            }`}
          >
            {saveStatus === 'Saved' && <Check size={16} />}
            {saveStatus === 'Saving...' && (
              <svg className="animate-spin h-4 w-4 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
            )}
            {saveStatus}
          </div>

          <Tooltip
            title="Preview"
            description="See what your live site will look like to visitors."
          >
            <Link 
              href={`/preview/site/${siteSlug || 'draft'}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-purple-600 px-3 py-2 rounded-full transition-colors hover:bg-purple-50"
            >
              Preview
            </Link>
          </Tooltip>
          
          {/* Publish Button with Logic */}
          <button
            onClick={onPublishClick}
            disabled={isPublishing}
            className="flex items-center gap-2 bg-black text-white text-sm font-medium px-6 py-2 rounded-4xl  transition-colors disabled:opacity-50"
          >
            Publish
          </button>

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
                onClick={() => setIsPageDropdownOpen(prev => !prev)}
                className="flex items-center gap-1 font-medium text-gray-900"
              >
                {currentPageName}
                <ChevronDown size={16} />
              </button>
            </div>
            {isPageDropdownOpen && (
              <div className="absolute top-full mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-10">
                {pages.map(page => (
                  <button
                    key={page.path}
                    onClick={() => handlePageSelect(page.path)}
                    className={`w-full text-left px-3 py-2 text-sm ${activePage === page.path ? 'bg-blue-50 text-blue-600' : 'text-gray-700'} hover:bg-gray-100`}
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
                className={`p-2 rounded-md ${view === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 '}`}
              >
                <Monitor size={20} />
              </button>
            </Tooltip>
            <Tooltip title="Mobile View" description="See how your site looks on a phone.">
              <button
                onClick={() => onViewChange('mobile')}
                className={`p-2 rounded-md ${view === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 '}`}
              >
                <Smartphone size={20} />
              </button>
            </Tooltip>
          </div>
          <VerticalSeparator />
        </div>
        {/* Center: URL Bar with Tooltip */}
        <div className="flex-grow min-w-0 mx-4">
          <Tooltip
            title="Your Site Address"
            description="This is your temporary website URL. Click 'Connect Your Domain' to use a custom address."
          >
            <div className="bg-gray-50 border border-gray-300 rounded-4xl px-3 py-2 text-sm text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap cursor-pointer">
              {siteUrl}
              <span className="text-purple-600 ml-2 font-medium">Connect Your Domain</span>
            </div>
          </Tooltip>
        </div>
        {/* Right: Tools (Undo/Redo) with conditional Tooltips */}
        <div className="flex items-center gap-2 text-gray-600">
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
      </div>

      <RestartConfirmationModal
        isOpen={isRestartModalOpen}
        onClose={() => setIsRestartModalOpen(false)}
        onConfirm={handleRestartConfirm}
      />

      <PublishConfirmationModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onConfirm={handlePublishConfirm}
        isPublishing={isPublishing}
      />

      <AlertModal
        isOpen={alertState.isOpen}
        title={alertState.title}
        message={alertState.message}
        onClose={() => setAlertState({ ...alertState, isOpen: false })}
      />

    </header>
  );
}
