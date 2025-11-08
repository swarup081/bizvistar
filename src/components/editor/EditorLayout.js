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

  // --- NEW: Local Storage Key ---
  const editorDataKey = `editorData_${templateName}`;
  const cartDataKey = `${templateName}Cart`; // e.g., 'blisslyCart'

  // Get the default data, deep-copied
  const defaultData = useMemo(() => {
    return JSON.parse(JSON.stringify(templateDataMap[templateName] || {}));
  }, [templateName]);

  // --- FIX: Always initialize with defaultData to prevent hydration mismatch ---
  const [businessData, setBusinessData] = useState(defaultData);
  const [history, setHistory] = useState([defaultData]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // --- NEW: Load from localStorage *after* mount to prevent mismatch ---
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(editorDataKey);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // Set this as the *current* state and *history base*
        setBusinessData(parsedData); 
        setHistory([parsedData]);
        setHistoryIndex(0);
      } else {
        // If no saved data, ensure we are on default (for template switching)
        setBusinessData(defaultData);
        setHistory([defaultData]);
        setHistoryIndex(0);
      }
    } catch (error) {
      console.error("Failed to load saved data:", error);
      setBusinessData(defaultData);
      setHistory([defaultData]);
      setHistoryIndex(0);
    }
  }, [templateName, defaultData, editorDataKey]); // Rerun if template changes

  // Save any change to businessData to localStorage
  useEffect(() => {
    try {
      const dataToSave = JSON.stringify(businessData);
      localStorage.setItem(editorDataKey, dataToSave);
    } catch (error) {
      console.error("Failed to save data to localStorage:", error);
    }
  }, [businessData, editorDataKey]);

  
  const handleDataUpdate = (updaterFn) => {
    setBusinessData(prevData => {
      const newData = typeof updaterFn === 'function' ? updaterFn(prevData) : updaterFn;
      if (JSON.stringify(newData) === JSON.stringify(prevData)) {
        return prevData;
      }
      const newHistory = [...history.slice(0, historyIndex + 1), newData];
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      return newData;
    });
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1;
      setHistoryIndex(newIndex);
      setBusinessData(history[newIndex]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setBusinessData(history[newIndex]);
    }
  };

  const handleRestart = () => {
    // 1. Clear only the editor and cart data for this template
    localStorage.removeItem(editorDataKey);
    localStorage.removeItem(cartDataKey);
    
    // 2. Reset all editor state to the *default* data
    setBusinessData(defaultData);
    setHistory([defaultData]);
    setHistoryIndex(0);
    
    // 3. Force-send the fresh default data to the iframe
    sendDataToIframe(defaultData);
    
    // 4. Reset the iframe's page to the template's home page
    const homePage = defaultData.pages?.[0]?.path || `/templates/${templateName}`;
    handlePageChange(homePage);
  };

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
  }, [businessData]); // This triggers on user edit, undo, and redo

  // 4. Handle messages from the iframe
  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'IFRAME_READY') {
        sendDataToIframe(businessData); // Send current (potentially saved) data
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [businessData]); // Pass businessData to ensure sendDataToIframe has the latest state

  // 5. Handle page change request from TopNav OR Sidebar
  const [activePage, setActivePage] = useState(defaultData?.pages?.[0]?.path || `/templates/${templateName}`);
  const [previewUrl, setPreviewUrl] = useState(defaultData?.pages?.[0]?.path || `/templates/${templateName}`);
  
  // --- BUG FIX IS HERE ---
  const handlePageChange = (path) => {
    if (!path) return; // Do nothing if path is invalid
    
    const [basePath, anchorId] = path.split('#');
    setActivePage(path); // Update active state (e.g., /templates/flara#about)

    if (iframeRef.current) {
      // Get the iframe's current base path (ignoring any existing anchor)
      const currentBasePath = iframeRef.current.src.split('#')[0];

      // Check if the iframe's src *ends with* the new base path.
      // This is safer than .includes()
      if (currentBasePath.endsWith(basePath) && anchorId) {
        // We are already on the right page (e.g., /templates/flara),
        // and we just want to scroll to an anchor.
        // Send a direct scroll command instead of relying on router.push().
        iframeRef.current.contentWindow.postMessage({
          type: 'SCROLL_TO_SECTION',
          payload: { sectionId: anchorId }
        }, '*');
      } else if (!currentBasePath.endsWith(basePath)) {
        // We are on a different page (e.g., /templates/flara/shop)
        // and need to navigate back to the home page (or another page).
        // Reload the iframe to the new path (which includes the anchor).
        setPreviewUrl(path);
      } else if (currentBasePath.endsWith(basePath) && !anchorId) {
        // This handles clicking "Home" from the top nav when already on an anchor
        // It reloads the page without the anchor
        setPreviewUrl(basePath);
      }
    }
  };
  // --- END OF BUG FIX ---
  
  // This effect is necessary to reset the preview URL when the template changes
  useEffect(() => {
      const homePage = defaultData.pages?.[0]?.path || `/templates/${templateName}`;
      setActivePage(homePage);
      setPreviewUrl(homePage);
  }, [templateName, defaultData]);

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
            pages={businessData?.pages || []}
            onPageChange={handlePageChange}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
            onRestart={handleRestart}
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
          setBusinessData={handleDataUpdate} // <-- Pass the history-aware updater
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}