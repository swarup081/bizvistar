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

  // --- START: Undo/Redo State Management ---
  const [businessData, setBusinessData] = useState(initialData);
  const [history, setHistory] = useState([initialData]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // This function replaces the simple setBusinessData
  // It updates the state AND manages the history stack
  const handleDataUpdate = (updaterFn) => {
    setBusinessData(prevData => {
      // Get the new state, whether it's from a value or a function
      const newData = typeof updaterFn === 'function' ? updaterFn(prevData) : updaterFn;

      // If the new data is the same as the current data, do nothing
      // This prevents duplicate history entries
      if (JSON.stringify(newData) === JSON.stringify(prevData)) {
        return prevData;
      }

      // Clear the "redo" history by slicing
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
      // The useEffect below will send this to the iframe
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      const newIndex = historyIndex + 1;
      setHistoryIndex(newIndex);
      setBusinessData(history[newIndex]);
      // The useEffect below will send this to the iframe
    }
  };
  // --- END: Undo/Redo State Management ---


  // 1. Load initial data when templateName changes
  useEffect(() => {
    const data = JSON.parse(JSON.stringify(templateDataMap[templateName] || {}));
    if (data) {
      // Reset all state when template changes
      setBusinessData(data);
      setHistory([data]);
      setHistoryIndex(0);
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
  }, [businessData]); // This now triggers on direct set, undo, and redo

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
  const [activePage, setActivePage] = useState(initialData?.pages?.[0]?.path || `/templates/${templateName}`);
  const [previewUrl, setPreviewUrl] = useState(initialData?.pages?.[0]?.path || `/templates/${templateName}`);
  
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
            // --- Pass Undo/Redo props ---
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={historyIndex > 0}
            canRedo={historyIndex < history.length - 1}
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