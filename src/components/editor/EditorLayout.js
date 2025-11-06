'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import EditorTopNav from './EditorTopNav';
import EditorSidebar from './EditorSidebar';

// Import all template data
import { businessData as flaraData } from '@/app/templates/flara/data.js';
import { businessData as avenixData } from '@/app/templates/avenix/data.js';
import { businessData as blisslyData } from '@/app/templates/blissly/data.js';
import { businessData as flavornestData } from '@/app/templates/flavornest/data.js';

const templateDataMap = {
  flara: flaraData,
  avenix: avenixData,
  blissly: blisslyData,
  flavornest: flavornestData,
  // Add other templates here as they are created
};

export default function EditorLayout({ templateName }) {
  const [view, setView] = useState('desktop');
  const [activeTab, setActiveTab] = useState('website');
  
  const iframeRef = useRef(null);
  
  const initialData = useMemo(() => {
    // Deep copy the initial data to prevent mutation
    return JSON.parse(JSON.stringify(templateDataMap[templateName] || {}));
  }, [templateName]);

  const [businessData, setBusinessData] = useState(initialData);
  const [activePage, setActivePage] = useState(initialData?.pages?.[0]?.path || `/templates/${templateName}`);
  const [previewUrl, setPreviewUrl] = useState(initialData?.pages?.[0]?.path || `/templates/${templateName}`);

  // 1. Load initial data when templateName changes
  useEffect(() => {
    const data = JSON.parse(JSON.stringify(templateDataMap[templateName] || {}));
    if (data) {
      setBusinessData(data);
      const homePage = data.pages?.[0]?.path || `/templates/${templateName}`;
      setActivePage(homePage);
      setPreviewUrl(homePage);
    }
  }, [templateName]);

  // 2. Send data to iframe
  const sendDataToIframe = (data) => {
    if (iframeRef.current && data) {
      iframeRef.current.contentWindow.postMessage({
        type: 'UPDATE_DATA',
        payload: data,
      }, '*');
    }
  };

  // 3. Post updated data whenever businessData state changes (debounced)
  useEffect(() => {
    const handler = setTimeout(() => {
      sendDataToIframe(businessData);
    }, 250); // 250ms debounce

    return () => clearTimeout(handler);
  }, [businessData]);

  // 4. Handle messages from the iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'IFRAME_READY') {
        sendDataToIframe(businessData); // Send initial data
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [businessData]); // Pass businessData to ensure sendDataToIframe has the latest state

  // 5. Handle page change request from TopNav OR Sidebar
  const handlePageChange = (path) => {
    if (!path) return; // Do nothing if path is invalid
    setActivePage(path); // Update active state
    if (iframeRef.current) {
      iframeRef.current.contentWindow.postMessage({
        type: 'CHANGE_PAGE',
        payload: { path }
      }, '*');
    }
  };

  return (
    <div className="grid grid-cols-[1fr_auto] h-screen bg-gray-50">
      
      {/* Column 1: Main Content (Nav + Preview) */}
      <div className="flex flex-col h-screen overflow-hidden">
        
        {/* Top Nav: Stays at the top of this column */}
        <div className="flex-shrink-0">
          <EditorTopNav
            templateName={templateName}
            view={view}
            onViewChange={setView}
            activePage={activePage}
            pages={businessData?.pages || []} // Pass pages to TopNav
            onPageChange={handlePageChange} // Pass page change handler
          />
        </div>

        {/* Main Preview Area */}
        <main className="flex-grow flex items-center justify-center overflow-auto ">
          <div
            className={`transition-all duration-300 ease-in-out bg-white shadow-lg rounded-xl overflow-hidden flex-shrink-0`}
            style={{
              width: view === 'desktop' ? '100%' : '375px',
              height: view ==='desktop' ? '100%' : '812px',
            }}
          >
            <iframe
              ref={iframeRef}
              src={previewUrl}
              title="Website Preview"
              className="w-full h-full border-0"
              key={templateName} // Add key to force re-render on template change
            />
          </div>
        </main>
      </div>

      {/* Column 2: Sidebar (Full Height) */}
      <div className="h-screen bg-white border-l border-gray-200 overflow-y-auto">
        <EditorSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          businessData={businessData}
          setBusinessData={setBusinessData}
          onPageChange={handlePageChange} // <-- PROP ADDED
        />
      </div>
    </div>
  );
}