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
  const hasInteractedRef = useRef(false); 

  // State for dynamic scaling
  const [scale, setScale] = useState(1);
  const [containerHeight, setContainerHeight] = useState(800); 
  const mainContainerRef = useRef(null);

  const [isMobileViewport, setIsMobileViewport] = useState(false);

  // --- RESIZE LOGIC ---
  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      setIsMobileViewport(isMobile);

      // Auto-switch view based on viewport for the Landing demo
      if (isMobile && view !== 'mobile') {
        setView('mobile');
      } else if (!isMobile && view !== 'desktop') {
        setView('desktop');
      }

      const container = mainContainerRef.current;
      if (!container) return;

      const cWidth = container.offsetWidth;
      const cHeight = container.offsetHeight;
      setContainerHeight(cHeight);

      const baseDesktopWidth = 1440; 

      if (!isMobile) {
        // Desktop scaling logic
        const newScale = Math.min(1, cWidth / baseDesktopWidth);
        setScale(newScale);
      } else {
        // Mobile viewport: we don't scale the iframe container itself, it takes full width/height
        setScale(1);
      }
    };
    
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [view]);

  // Initial Data
  const defaultData = useMemo(() => {
    const data = JSON.parse(JSON.stringify(auroraData || {}));
    data.name = "Avenix"; 
    if (data.hero) {
        data.hero.title = "Desire Meets New Style";
    }
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
        // Initial start delay
        await wait(1500); 

        while (isMounted.current) {
            
            // --- 1. Global Interaction Check ---
            if (isHoveredRef.current) {
                hasInteractedRef.current = true;
                await wait(200);
                continue; 
            }

            // --- 2. Post-Interaction Reset Logic (The 30s Law) ---
            if (hasInteractedRef.current) {
                let interrupted = false;
                for (let i = 0; i < 30; i++) {
                    if (isHoveredRef.current) { interrupted = true; break; }
                    await wait(1000);
                }

                if (interrupted) {
                    continue; 
                }

                // RESET EVERYTHING
                hasInteractedRef.current = false;
                setActiveTab('website');
                setActiveAccordion('global');
                setBusinessData(defaultData);
                setCursorPos({ x: -50, y: -50 }); 
                
                await wait(1000); 
                // Restart loop from step 1
            }

            // --- 3. Animation Steps ---
            const container = containerRef.current;
            if (!container) { await wait(200); continue; }

            const w = container.offsetWidth;
            const h = container.offsetHeight;
            const isMobile = window.innerWidth < 1024;

            let logoX, logoY, sidebarInputX, nameInputY, titleInputY, imageInputY, themeTabX, themeTabY, strawberryX, strawberryY, publishX, publishY;

            if (isMobile) {
                // Mobile layout coordinates
                logoX = w / 2;
                logoY = 120;

                // Bottom sheet sidebar coordinates
                sidebarInputX = w / 2;
                nameInputY = h - 250;
                titleInputY = h - 180;
                imageInputY = h - 100;

                themeTabX = w / 2;
                themeTabY = h - 350; // Approximating tab height on mobile
                strawberryX = w / 2;
                strawberryY = h - 200;

                publishX = w - 50;
                publishY = 30;
            } else {
                // Desktop layout coordinates
                const sidebarWidth = 320;
                const sidebarLeftX = w - sidebarWidth;
                sidebarInputX = sidebarLeftX + 100;
                const sidebarCenterX = sidebarLeftX + (sidebarWidth / 2);

                logoX = w / 2 - 180;
                logoY = 100 + 20;

                nameInputY = 180;
                titleInputY = 260;
                imageInputY = 420;

                themeTabY = 30;
                themeTabX = sidebarCenterX;

                strawberryX = w - 80;
                strawberryY = 280;

                publishX = (w - sidebarWidth) - 100;
                publishY = 30;
            }

            // Helper to break execution if user hovers
            const checkInterrupt = () => {
                if (isHoveredRef.current) {
                    hasInteractedRef.current = true;
                    return true;
                }
                return false;
            };

            // STEP 1: Click "Business Name" in Preview
            if (checkInterrupt()) continue;
            
            setCursorPos({ x: logoX, y: logoY });
            
            await wait(1000);
            if (checkInterrupt()) continue;

            setIsClicking(true);
            setActiveAccordion('hero'); 
            await wait(200);
            setIsClicking(false);

            await wait(800);
            if (checkInterrupt()) continue;

            // STEP 2: Edit Logo Text
            setCursorPos({ x: sidebarInputX, y: nameInputY });
            await wait(800);

            if (checkInterrupt()) continue;
            setIsClicking(true);
            await wait(200);
            setIsClicking(false);

            const nameText = "Kohira";
            for (let i = 0; i <= nameText.length; i++) {
                if (!isMounted.current) break;
                if (checkInterrupt()) { i = nameText.length + 1; break; } 
                setBusinessData(prev => ({ ...prev, name: nameText.substring(0, i), logoText: nameText.substring(0, i) }));
                await wait(80);
            }
            if (checkInterrupt()) continue;

            await wait(1000);
            if (checkInterrupt()) continue;

            // STEP 3: Edit Title
            setCursorPos({ x: isMobile ? sidebarInputX : sidebarInputX - 60, y: titleInputY });
            await wait(800);
            
            if (checkInterrupt()) continue;
            setIsClicking(true);
            await wait(200);
            setIsClicking(false);

            const newTitle = "Timeless Elegance, New Style"; 
            for (let i = 0; i <= newTitle.length; i++) {
                if (!isMounted.current) break;
                if (checkInterrupt()) { i = newTitle.length + 1; break; }
                setBusinessData(prev => ({
                    ...prev,
                    hero: { ...prev.hero, title: newTitle.substring(0, i) }
                }));
                await wait(60);
            }
            if (checkInterrupt()) continue;

            await wait(1000);
            if (checkInterrupt()) continue;

            // STEP 4: Change Feature Image
            setCursorPos({ x: sidebarInputX, y: imageInputY });
            await wait(1000);

            if (checkInterrupt()) continue;
            setIsClicking(true); 
            setBusinessData(prev => ({
                ...prev,
                hero: { 
                    ...prev.hero, 
                    imageArch1_b: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=500" 
                }
            }));
            await wait(200);
            setIsClicking(false);

            await wait(2500); 
            if (checkInterrupt()) continue;

            // STEP 5: Switch to Theme Tab
            setCursorPos({ x: themeTabX, y: themeTabY });
            await wait(800);

            if (checkInterrupt()) continue;
            setIsClicking(true);
            setActiveTab('theme');
            await wait(200);
            setIsClicking(false);
            
            await wait(800);
            if (checkInterrupt()) continue;

            // STEP 6: Palette
            setCursorPos({ x: strawberryX, y: strawberryY }); 
            await wait(800);

            if (checkInterrupt()) continue;
            setIsClicking(true);
            setBusinessData(prev => ({ ...prev, theme: { ...prev.theme, colorPalette: 'strawberry-cream' } }));
            await wait(200);
            setIsClicking(false);

            await wait(1000);
            if (checkInterrupt()) continue;

            // STEP 7: Publish
            setCursorPos({ x: publishX, y: publishY });
            await wait(1000);
            
            if (checkInterrupt()) continue;
            setIsClicking(true);
            await wait(200);
            setIsClicking(false);

            await wait(2000);
            
            // End of Sequence - Soft Reset
            if (checkInterrupt()) continue;
            
            setActiveTab('website');
            setActiveAccordion('global'); 
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
      className={`flex flex-col lg:grid lg:grid-cols-[1fr_auto] bg-gray-50 rounded-xl overflow-hidden shadow-2xl relative border border-gray-200 ${isMobileViewport ? 'h-[70vh]' : 'h-[850px]'}`}
      onMouseEnter={() => { 
        isHoveredRef.current = true; 
        setIsHovered(true); 
      }}
      onMouseLeave={() => { 
          isHoveredRef.current = false; 
          setIsHovered(false);
      }}
      onTouchStart={() => {
        isHoveredRef.current = true;
        setIsHovered(true);
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

        <main ref={mainContainerRef} className={`flex-grow flex items-center justify-center overflow-hidden relative bg-[#F3F4F6] ${isMobileViewport ? 'p-0 pb-20' : 'px-4 pb-10'}`}>
          <div
            className={`transition-all duration-300 ease-in-out bg-white shadow-lg overflow-hidden flex-shrink-0 origin-top
              ${view === 'mobile' && !isMobileViewport ? 'rounded-3xl border border-gray-300' : ''}
              ${view === 'desktop' ? 'rounded-none lg:rounded-md' : ''}
            `}
            style={{
              width: isMobileViewport ? '100%' : (view === 'desktop' ? '1440px' : '375px'),
              height: isMobileViewport ? '100%' : (view === 'desktop' ? `${containerHeight / scale}px` : '812px'),
              transform: isMobileViewport ? 'none' : `scale(${scale})`,
              marginTop: isMobileViewport ? '0' : (view === 'desktop' ? '465px' : '40px'),
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

      <div className={`bg-white border-t lg:border-t-0 lg:border-l border-gray-200 lg:overflow-y-auto lg:static lg:h-full lg:w-80 fixed bottom-0 left-0 w-full z-40 lg:z-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:shadow-none ${isHovered ? 'pointer-events-auto' : 'pointer-events-none'}`}>
        <EditorSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          businessData={businessData}
          setBusinessData={handleDataUpdate} 
          onPageChange={handlePageChange}
          activeAccordion={activeAccordion}
          onAccordionToggle={handleAccordionToggle} 
          forceDesktop={false}
          isLandingMode={true}
          templateName={templateName}
        />
      </div>
    </div>
  );
}