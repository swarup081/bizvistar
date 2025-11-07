'use client';

import { useState } from 'react';
import {
  Monitor, Smartphone, ChevronDown, Rocket, CheckCircle
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

// --- UPDATED Tooltip Component ---
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


export default function EditorTopNav({ 
    templateName, 
    view, 
    onViewChange, 
    activePage, 
    pages, 
    onPageChange,
    // --- Added Undo/Redo props ---
    onUndo,
    onRedo,
    canUndo,
    canRedo
}) {
  const [isPageDropdownOpen, setIsPageDropdownOpen] = useState(false);
  
  const currentPageName = pages.find(p => p.path === activePage)?.name || 'Home';
  const siteUrl = `https://www.bizvistar.com/mysite/${templateName}`;

  const handlePageSelect = (path) => {
    onPageChange(path);
    setIsPageDropdownOpen(false);
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
            <NavButton>Hire a Professional</NavButton>
            <NavButton>Help</NavButton>
          </div>
        </div>

        {/* Right Side: Actions */}
        <div className="flex items-center gap-3">
          {/* --- Upgrade Button with Tooltip --- */}
          <Tooltip
            content={
              <div className="flex items-start gap-4">
                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-900 text-base mb-2">Upgrade to Premium and Get More!</h3>
                  <ul className="space-y-1.5 text-sm text-gray-700">
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-purple-600 flex-shrink-0" /> Get a FREE domain to connect to your site</li>
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-purple-600 flex-shrink-0" /> Remove BizVistar ads</li>
                    <li className="flex items-center gap-2"><CheckCircle size={16} className="text-purple-600 flex-shrink-0" /> Connect Google Analytics</li>
                  </ul>
                  <p className="text-xs text-gray-500 mt-4">To upgrade, start by saving your site</p>
                  <button className="mt-2 w-full bg-purple-100 text-purple-700 font-medium py-2 rounded-md text-sm hover:bg-purple-200">Save Site</button>
                </div>
                <div className="flex-shrink-0 bg-blue-100 text-blue-600 p-3 rounded-lg">
                  <Rocket size={32} />
                </div>
              </div>
            }
          >
            <button className="text-sm font-medium text-purple-600 px-3 py-2 rounded-md">
              Upgrade
            </button>
          </Tooltip>

          <div className="w-px h-5 bg-gray-300"></div> 
          <NavButton>
            Save
          </NavButton>

          {/* --- Preview Button with Tooltip --- */}
          <Tooltip
            title="Preview"
            description="See what your site looks like on desktop and mobile before you go live."
          >
            <button className="text-sm font-medium text-blue-500 px-3 py-2 rounded-md">
              Preview
            </button>
          </Tooltip>
          
          <button className="flex items-center gap-2 bg-blue-600 text-white text-sm font-medium px-6 py-2 rounded-4xl hover:bg-blue-700 transition-colors">
            Publish
          </button>
        </div>
      </div>

      {/* Second Bar */}
      <div className="w-full h-[50px] border-b border-gray-200 px-4 flex items-center">
        
        {/* Left: Page & Devices */}
        <div className="flex items-center gap-4">
          
          {/* --- Page Selector with Tooltip --- */}
          <Tooltip
            title="Switch page"
            description="See all the pages on your site and switch between them."
          >
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
              {/* Page Dropdown */}
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
          </Tooltip>


          <VerticalSeparator />

          {/* Device Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => onViewChange('desktop')}
              className={`p-2 rounded-md ${view === 'desktop' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 '}`}
            >
              <Monitor size={20} />
            </button>
            <button
              onClick={() => onViewChange('mobile')}
              className={`p-2 rounded-md ${view === 'mobile' ? 'bg-blue-100 text-blue-600' : 'text-gray-500 '}`}
            >
              <Smartphone size={20} />
            </button>
          </div>

          <VerticalSeparator />
        </div>

        {/* Center: URL Bar */}
        <div className="flex-grow min-w-0 mx-4">
          <div className="bg-gray-50 border border-gray-300 rounded-4xl px-3 py-2 text-sm text-gray-700 overflow-hidden text-ellipsis whitespace-nowrap">
            {siteUrl}
            <span className="text-purple-600 ml-2 font-medium">Connect Your Domain</span>
          </div>
        </div>

        {/* --- UPDATED: Right: Tools (Undo/Redo) --- */}
        <div className="flex items-center gap-2 text-gray-600">
          <VerticalSeparator />
          <button 
            onClick={onUndo}
            disabled={!canUndo}
            className="p-2 rounded-md text-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed"
            aria-label="Undo"
          >
            <IconUndo />
          </button>
          <button 
            onClick={onRedo}
            disabled={!canRedo}
            className="p-2 rounded-md text-gray-500 disabled:text-gray-300 disabled:cursor-not-allowed"
            aria-label="Redo"
          >
            <IconRedo />
          </button>
        </div>
      </div>
    </header>
  );
}