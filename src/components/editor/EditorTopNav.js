'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Monitor, Smartphone, ChevronDown, Info
} from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex items-start">
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
            className="w-full inline-flex justify-center rounded-3xl border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 sm:ml-3 sm:w-auto sm:text-sm"
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
    templateName, 
    view, 
    onViewChange, 
    activePage, 
    pages, 
    onPageChange,
    onUndo,
    onRedo,
    canUndo,
    canRedo,
    onRestart // <-- NEW PROP
}) {
  const [isPageDropdownOpen, setIsPageDropdownOpen] = useState(false);
  
  // --- ADDED: State for modal ---
  const [isRestartModalOpen, setIsRestartModalOpen] = useState(false);
  
  const currentPageName = pages.find(p => p.path === activePage)?.name || 'Home';
  const siteUrl = `https://www.bizvistar.com/mysite/${templateName}`;

  const handlePageSelect = (path) => {
    onPageChange(path);
    setIsPageDropdownOpen(false);
  };

  // --- ADDED: Handler for restart ---
  const handleRestartConfirm = () => {
    onRestart(); // Call the function passed from EditorLayout
    setIsRestartModalOpen(false);
  };

  return (
    <header className="w-full bg-white shadow-sm">
      {/* Top-most Bar */}
      <div className="w-full h-[65px] border-b border-gray-200 px-4 flex items-center justify-between">
        {/* Left Side */}
        <div className="flex items-center gap-6">
          <div className="text-xl font-bold text-gray-900">
            BizVistar
          </div>
          <div className="flex items-center gap-2">
            <Tooltip
              title="Hire a Professional"
              description="Need help with design or content? Our experts are here to assist."
            >
              <NavButton>Hire a Professional</NavButton>
            </Tooltip>
            {/* "Help" button with no Tooltip */}
            <NavButton>Help</NavButton>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3">
          
          <Tooltip
            title="Reset Template"
            description="Reset all changes made to this template back to their original settings."
          >
            {/* --- UPDATED: onClick to open modal --- */}
            <button 
              onClick={() => setIsRestartModalOpen(true)}
              className="flex items-center gap-2 text-sm font-medium text-gray-700 px-3 py-2 rounded-md transition-colors"
            >
              Restart
            </button>
          </Tooltip>

          <div className="w-px h-5 bg-gray-300"></div> 
          
          <Tooltip
            title="Save"
            description="Your changes are saved automatically!"
          >
            <NavButton className="text-gray-400">
              Save
            </NavButton>
          </Tooltip>

          {/* --- THIS IS THE LINK TO THE PREVIEW PAGE --- */}
          <Tooltip
            title="Preview"
            description="See what your live site will look like to visitors."
          >
            <Link 
              href={`/preview/${templateName}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-medium text-blue-500 px-3 py-2 rounded-md transition-colors hover:bg-blue-50"
            >
              Preview
            </Link>
          </Tooltip>
          {/* --- END OF LINK --- */}
          
          <button className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-6 py-2 rounded-4xl hover:bg-blue-700 transition-colors">
            Publish
          </button>
        </div>
      </div>

      {/* Second Bar */}
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

      {/* --- ADDED: Render the modal --- */}
      <RestartConfirmationModal
        isOpen={isRestartModalOpen}
        onClose={() => setIsRestartModalOpen(false)}
        onConfirm={handleRestartConfirm}
      />
    </header>
  );
}