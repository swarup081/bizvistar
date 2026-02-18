'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import EditorTopNav from '@/components/editor/EditorTopNav';
import EditorSidebar from '@/components/editor/EditorSidebar';

import { businessData as auroraData } from '@/app/templates/aurora/data.js';

// --- Cursor Animation Component ---
const Cursor = ({ x, y, click }) => {
  return (
    <motion.div
      className="absolute pointer-events-none z-[50]" 
      style={{ left: 0, top: 0 }} 
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
          <path d="M5.5 3.5L11.5 20.5L14.5 13.5L21.5 10.5L5.5 3.5Z" fill="black" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
      {click && (
         <span className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-blue-500/30 animate-ping" />
      )}
    </motion.div>
  );
};

export default function LandingEditor() {
  const templateName = 'aurora';
  const mode = 'dashboard';
  const websiteId = 'demo';
  const siteSlug = 'demo';
  
  const [view, setView] = useState('desktop'); 
  const [activeTab, setActiveTab] = useState('website');
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const [activeAccordion, setActiveAccordion] = useState('global');
  
  // Animation State
  const [cursorPos, setCursorPos] = useState({ x: -50, y: -50 });
  const [isClicking, setIsClicking] = useState(false);
  const isMounted = useRef(true);

  // Interaction State
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);

  // State for dynamic scaling
  const [scale, setScale] = useState(1);
  const [containerHeight, setContainerHeight] = useState(800); 
  const mainContainerRef = useRef(null);

  // --- RESIZE LOGIC ---
  useEffect(() => {
    const handleResize = () => {
      const container = mainContainerRef.current;
      if (!container) return;

      const cWidth = container.offsetWidth;
      const cHeight = container.offsetHeight;
      setContainerHeight(cHeight);

      const baseDesktopWidth = 1440; 
      const baseMobileWidth = 375;
      const baseMobileHeight = 812;

      if (view === 'desktop') {
        const newScale = Math.min(1, cWidth / baseDesktopWidth);
        setScale(newScale);
      } else {
        const availableHeight = cHeight - 40; 
        const heightScale = availableHeight / baseMobileHeight;
        setScale(Math.min(1, heightScale));
      }
    };
    
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [view]);

  // Initial Data
  const defaultData = useMemo(() => {
    const data = JSON.parse(JSON.stringify(auroraData || {}));
    // Force Initial State as per requirements
    data.name = "Avenix"; // Start as Avenix
    if (data.hero) {
        data.hero.title = "Desire Meets New Style";
    }
    // Ensure nested objects exist to prevent crashes
    if (!data.theme) data.theme = {};
    if (!data.theme.font) data.theme.font = {};
    return data;
  }, []);

  const [businessData, setBusinessData] = useState(defaultData);
  const [history, setHistory] = useState([defaultData]);
  const [historyIndex, setHistoryIndex] = useState(0);

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

  const handleUndo = () => {}; 
  const handleRedo = () => {};

  const handleRestart = () => {
    setBusinessData(defaultData);
    setHistory([defaultData]);
    setHistoryIndex(0);
    sendDataToIframe(defaultData);
    const homePage = defaultData.pages?.[0]?.path || `/templates/${templateName}`;
    handlePageChange(homePage);
  };

  const sendDataToIframe = (data) => {
    if (iframeRef.current && iframeRef.current.contentWindow && data) {
      iframeRef.current.contentWindow.postMessage({
        type: 'UPDATE_DATA',
        payload: data,
      }, '*');
    }
  };

  useEffect(() => {
    const handleMessage = (event) => {
      if (event.data.type === 'IFRAME_READY') {
        sendDataToIframe(businessData);
      }

      if (event.data.type === 'FOCUS_SECTION') {
        setActiveTab('website');
        setActiveAccordion(event.data.payload.accordionId);
      }
    };
    window.addEventListener('message', handleMessage);

    if (iframeRef.current && iframeRef.current.contentWindow) {
        sendDataToIframe(businessData);
    }
    const handler = setTimeout(() => {
      sendDataToIframe(businessData);
    }, 250); 
    return () => {
      clearTimeout(handler);
      window.removeEventListener('message', handleMessage);
    };
  }, [businessData]); 

  // --- Animation Logic ---
  useEffect(() => {
    isMounted.current = true;
    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    const sequence = async () => {
        await wait(1500); 

        while (isMounted.current) {
            if (isHoveredRef.current) { await wait(200); continue; }

            const container = containerRef.current;
            if (!container) { await wait(200); continue; }

            const w = container.offsetWidth;
            const h = container.offsetHeight;

            // Sidebar Calcs (Right Aligned, 320px)
            const sidebarWidth = 320;
            const sidebarLeftX = w - sidebarWidth; 
            const sidebarCenterX = sidebarLeftX + (sidebarWidth / 2);
            
            // --- STEP 1: Click "Business Name" in Preview (Triggers Hero Section) ---
            // Move cursor to Center Top of Iframe (approx logo position)
            // Container width / 2, and some top offset (e.g. 100px relative to container)
            const logoX = w / 2;
            const logoY = 100; // Approx header height in preview
            setCursorPos({ x: logoX, y: logoY });
            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }
            setIsClicking(true);
            setActiveAccordion('hero'); // Simulate the effect of clicking the editable logo
            await wait(200);
            setIsClicking(false);

            await wait(800);
            if (isHoveredRef.current) { await wait(200); continue; }

            // --- STEP 2: Edit Logo Text (Avenix -> Kohira) ---
            // First Input in Hero. Y ~ 180px.
            const nameInputY = 180;
            setCursorPos({ x: sidebarCenterX, y: nameInputY });
            await wait(800);

            if (isHoveredRef.current) { await wait(200); continue; }
            setIsClicking(true);
            await wait(200);
            setIsClicking(false);

            // Type "Kohira"
            const nameText = "Kohira";
            for (let i = 0; i <= nameText.length; i++) {
                if (!isMounted.current) break;
                if (isHoveredRef.current) { await wait(200); i--; continue; } 
                setBusinessData(prev => ({ ...prev, name: nameText.substring(0, i), logoText: nameText.substring(0, i) }));
                await wait(80);
            }

            await wait(1000);
            if (isHoveredRef.current) { await wait(200); continue; }

            // --- STEP 3: Edit Title ---
            // Second Input ("Title"). Y ~ 260px.
            const titleInputY = 260;
            setCursorPos({ x: sidebarCenterX, y: titleInputY });
            await wait(800);
            
            if (isHoveredRef.current) { await wait(200); continue; }
            setIsClicking(true);
            await wait(200);
            setIsClicking(false);

            // Type "Timeless Elegance, New Style"
            const newTitle = "Timeless Elegance, New Style";
            for (let i = 0; i <= newTitle.length; i++) {
                if (!isMounted.current) break;
                if (isHoveredRef.current) { await wait(200); i--; continue; } 
                setBusinessData(prev => ({
                    ...prev,
                    hero: { ...prev.hero, title: newTitle.substring(0, i) }
                }));
                await wait(60);
            }

            await wait(1000);
            if (isHoveredRef.current) { await wait(200); continue; }

            // --- STEP 4: Change Feature Image (Stats Box) ---
            // Y ~ 420px (Adjusted per visual estimation).
            const imageInputY = 420;
            setCursorPos({ x: sidebarCenterX, y: imageInputY });
            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }
            setIsClicking(true); 
            // Update imageArch1_b
            setBusinessData(prev => ({
                ...prev,
                hero: { 
                    ...prev.hero, 
                    imageArch1_b: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=500" 
                }
            }));
            await wait(200);
            setIsClicking(false);

            await wait(1000);
            if (isHoveredRef.current) { await wait(200); continue; }

            // --- STEP 5: Switch to Theme Tab ---
            const themeTabY = 30; 
            const themeTabX = sidebarCenterX; 
            setCursorPos({ x: themeTabX, y: themeTabY });
            await wait(800);

            if (isHoveredRef.current) { await wait(200); continue; }
            setIsClicking(true);
            setActiveTab('theme');
            await wait(200);
            setIsClicking(false);
            
            await wait(800);
            if (isHoveredRef.current) { await wait(200); continue; }

            // --- STEP 6: Palette (Strawberry Cream) ---
            // Bottom Right Palette. Y ~280.
            const strawberryX = w - 80;
            const strawberryY = 280;
            setCursorPos({ x: strawberryX, y: strawberryY }); 
            await wait(800);

            if (isHoveredRef.current) { await wait(200); continue; }
            setIsClicking(true);
            setBusinessData(prev => ({ ...prev, theme: { ...prev.theme, colorPalette: 'strawberry-cream' } }));
            await wait(200);
            setIsClicking(false);

            await wait(1000);
            if (isHoveredRef.current) { await wait(200); continue; }

            // --- STEP 7: Publish ---
            const publishX = (w - sidebarWidth) - 100;
            const publishY = 30;
            setCursorPos({ x: publishX, y: publishY });
            await wait(1000);
            
            if (isHoveredRef.current) { await wait(200); continue; }
            setIsClicking(true);
            await wait(200);
            setIsClicking(false);

            await wait(2000);
            
            // --- RESET ---
            setActiveTab('website');
            setActiveAccordion('global'); // Reset to initial state
            setBusinessData(defaultData); 
            await wait(1000);
        }
    };
    sequence();
    return () => { isMounted.current = false; };
  }, [scale]); 

  const [activePage, setActivePage] = useState(defaultData?.pages?.[0]?.path || `/templates/${templateName}`);
  const [previewUrl, setPreviewUrl] = useState(defaultData?.pages?.[0]?.path || `/templates/${templateName}`);
  
  const handlePageChange = (path) => {
    if (!path) return; 
    const [basePath, anchorId] = path.split('#');
    setActivePage(path); 

    if (iframeRef.current) {
      const currentBasePath = iframeRef.current.src.split('#')[0];
      if (currentBasePath.endsWith(basePath) && anchorId) {
        iframeRef.current.contentWindow.postMessage({
          type: 'SCROLL_TO_SECTION',
          payload: { sectionId: anchorId }
        }, '*');
      } else if (!currentBasePath.endsWith(basePath)) {
        setPreviewUrl(path);
      } else if (currentBasePath.endsWith(basePath) && !anchorId) {
        setPreviewUrl(basePath);
      }
    }
  };

  const handleAccordionToggle = (id) => {
    const newActiveId = activeAccordion === id ? null : id;
    setActiveAccordion(newActiveId);
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col lg:grid lg:grid-cols-[1fr_auto] bg-gray-50 h-[850px] rounded-xl overflow-hidden shadow-2xl relative border border-gray-200"
      onMouseEnter={() => { isHoveredRef.current = true; setIsHovered(true); }}
      onMouseLeave={() => {
          isHoveredRef.current = false;
          setIsHovered(false);
          // Reset UI state on leave
          setActiveTab('website');
          setActiveAccordion('global');
          setBusinessData(defaultData);
      }}
    >
      {!isHovered && <Cursor x={cursorPos.x} y={cursorPos.y} click={isClicking} />}

      <div className="flex flex-col overflow-hidden relative h-full">
        <div className={`flex-shrink-0 z-20 relative ${isHovered ? 'pointer-events-auto' : 'pointer-events-none'}`}>
          <EditorTopNav
            mode={mode}
            siteSlug={siteSlug}
            templateName={templateName}
            websiteId={websiteId} 
            saveStatus="Saved" 
            view={view}
            onViewChange={setView}
            activePage={activePage}
            pages={businessData?.pages || []}
            onPageChange={handlePageChange}
            onUndo={handleUndo}
            onRedo={handleRedo}
            canUndo={false}
            canRedo={false}
            onRestart={handleRestart}
            isLandingMode={true} 
          />
        </div>

        {/* Restore 420px Margin as requested */}
        <main ref={mainContainerRef} className={`flex-grow flex items-center justify-center overflow-hidden relative bg-[#F3F4F6] p-0`}>
          <div
            className={`transition-all duration-300 ease-in-out bg-white shadow-lg flex-shrink-0 origin-top
              ${view === 'mobile' ? 'rounded-3xl border border-gray-300' : ''} 
            `}
            style={{
              width: view === 'desktop' ? '1440px' : '375px', 
              height: view === 'desktop' ? `${containerHeight / scale}px` : '812px', 
              transform: `scale(${scale})`, 
              marginTop: view === 'desktop' ? '425px' : '40px', 
              overflow: 'hidden', 
            }}
          >
            <iframe
              ref={iframeRef}
              src={`/templates/${templateName}?isLanding=true`} 
              title="Website Preview"
              className="w-full h-full border-0 pointer-events-auto" 
              key={templateName} 
              style={{ overflow: 'hidden' }}
            />
          </div>
        </main>
      </div>

      <div className={`bg-white border-l border-gray-200 lg:overflow-y-auto lg:static lg:h-full lg:w-80 fixed bottom-0 left-0 w-full z-40 lg:z-auto ${isHovered ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <EditorSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          businessData={businessData}
          setBusinessData={handleDataUpdate} 
          onPageChange={handlePageChange}
          activeAccordion={activeAccordion}
          onAccordionToggle={handleAccordionToggle} 
          forceDesktop={true}
          isLandingMode={true}
          templateName={templateName}
        />
      </div>
    </div>
  );
}
