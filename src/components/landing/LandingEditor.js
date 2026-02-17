'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import EditorTopNav from '@/components/editor/EditorTopNav';
import EditorSidebar from '@/components/editor/EditorSidebar';

// Import template data
import { businessData as flaraData } from '@/app/templates/flara/data.js';

// --- Cursor Animation Component ---
const Cursor = ({ x, y, click }) => (
  <motion.div
    className="fixed pointer-events-none z-[9999]"
    animate={{ x, y }}
    transition={{ type: "spring", stiffness: 500, damping: 28 }}
  >
    {/* Mac Cursor SVG */}
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-xl">
        <path d="M5.5 3.5L11.5 20.5L14.5 13.5L21.5 10.5L5.5 3.5Z" fill="black" stroke="white" strokeWidth="1.5" strokeLinejoin="round"/>
    </svg>

    {click && (
       <span className="absolute -top-3 -right-3 w-6 h-6 rounded-full bg-blue-500/30 animate-ping" />
    )}
  </motion.div>
);

export default function LandingEditor() {
  const templateName = 'flara';
  const mode = 'dashboard'; // Use 'dashboard' mode to match UI exactly
  const websiteId = 'demo';
  const siteSlug = 'demo';

  const [view, setView] = useState('desktop');
  const [activeTab, setActiveTab] = useState('website');
  const iframeRef = useRef(null);
  const [activeAccordion, setActiveAccordion] = useState('global');

  // Animation State
  const [cursorPos, setCursorPos] = useState({ x: 1200, y: 300 });
  const [isClicking, setIsClicking] = useState(false);
  const isMounted = useRef(true);

  // Interaction State
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);

  // State for dynamic scaling
  const [desktopScale, setDesktopScale] = useState(1);
  const [mobileScale, setMobileScale] = useState(1);
  const [isMobileViewport, setIsMobileViewport] = useState(false);
  const mainContainerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      const isMobile = window.innerWidth < 1024;
      setIsMobileViewport(isMobile);

      const container = mainContainerRef.current;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      if (view === 'desktop' && isMobile) {
        const scale = Math.min(1, (containerWidth - 40) / 1024);
        setDesktopScale(scale);
      } else {
        setDesktopScale(1);
      }

      if (view === 'mobile') {
        const availableHeight = containerHeight - 80;
        const scale = Math.min(1, availableHeight / 812);
        setMobileScale(scale);
      } else {
        setMobileScale(1);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [view]);

  const defaultData = useMemo(() => {
    return JSON.parse(JSON.stringify(flaraData || {}));
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
    if (iframeRef.current && iframeRef.current.contentWindow) {
        sendDataToIframe(businessData);
    }
    const handler = setTimeout(() => {
      sendDataToIframe(businessData);
    }, 250);
    return () => clearTimeout(handler);
  }, [businessData]);

  // --- Animation Logic ---
  useEffect(() => {
    isMounted.current = true;
    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    const sequence = async () => {
        await wait(1500); // Initial Wait

        while (isMounted.current) {
            if (isHoveredRef.current) {
               await wait(200);
               continue;
            }

            const w = window.innerWidth;
            const sidebarCenter = w - 160;

            // 1. Move to "Business Name" Input
            if (!isMounted.current) break;
            setActiveAccordion('global');
            await wait(500);

            if (isHoveredRef.current) { await wait(200); continue; }

            // Move to approx input Y position (Assuming sidebar is on right)
            setCursorPos({ x: sidebarCenter, y: 320 });
            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            // Click
            setIsClicking(true);
            await wait(200);
            setIsClicking(false);

            if (isHoveredRef.current) { await wait(200); continue; }

            // Type "Storify Demo"
            const targetName = "Storify Demo";
            for (let i = 0; i <= targetName.length; i++) {
                if (!isMounted.current) break;
                if (isHoveredRef.current) { await wait(200); i--; continue; } // Pause typing

                setBusinessData(prev => ({
                    ...prev,
                    name: targetName.substring(0, i),
                    logoText: targetName.substring(0, i)
                }));
                await wait(80);
            }

            await wait(1500);

            if (isHoveredRef.current) { await wait(200); continue; }

            // 2. Switch to Theme Tab
            if (!isMounted.current) break;
            setCursorPos({ x: sidebarCenter, y: 90 }); // Approx tab location
            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            setIsClicking(true);
            setActiveTab('theme');
            await wait(200);
            setIsClicking(false);

            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            // 3. Select a Palette (Elegant Botanics)
            setCursorPos({ x: w - 80, y: 250 }); // Approx
            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            setIsClicking(true);
            setBusinessData(prev => ({ ...prev, theme: { ...prev.theme, colorPalette: 'elegant-botanics' } }));
            await wait(200);
            setIsClicking(false);

            await wait(2500);

            if (isHoveredRef.current) { await wait(200); continue; }

            // 4. Back to Sage Green
            setCursorPos({ x: w - 240, y: 250 }); // Approx
            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            setIsClicking(true);
            setBusinessData(prev => ({ ...prev, theme: { ...prev.theme, colorPalette: 'sage-green' } }));
            await wait(200);
            setIsClicking(false);

            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            // 5. Back to Website Tab
            setCursorPos({ x: w - 260, y: 90 });
            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            setIsClicking(true);
            setActiveTab('website');
            await wait(200);
            setIsClicking(false);

            // Reset Text
            setBusinessData(prev => ({
                ...prev,
                name: defaultData.name,
                logoText: defaultData.logoText
            }));

            await wait(2000);
        }
    };
    sequence();
    return () => { isMounted.current = false; };
  }, [defaultData.logoText, defaultData.name]);


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
    if (newActiveId) {
      if (newActiveId === 'products') {
        const shopPage = businessData.pages.find(p => p.name.toLowerCase() === 'shop');
        if (shopPage) handlePageChange(shopPage.path);
      } else {
        const sectionIdMap = {
          hero: 'home', global: 'home', about: 'about', events: 'events', menu: 'menu',
          testimonials: 'testimonials', collection: 'collection', feature2: 'feature2',
          footer: 'contact', cta: 'cta', stats: 'stats', blog: 'blog', reviews: 'reviews', specialty: 'specialty',
        };
        const sectionId = sectionIdMap[id] || (id !== 'products' ? id : null);
        if (sectionId) {
          const homePage = businessData.pages.find(p => p.name.toLowerCase() === 'home');
          const homePath = homePage?.path || businessData.pages[0]?.path;
          handlePageChange(sectionId === 'home' ? homePath : `${homePath}#${sectionId}`);
        }
      }
    }
  };

  return (
    <div
      className="flex flex-col lg:grid lg:grid-cols-[1fr_auto] bg-gray-50 h-[800px] rounded-xl overflow-hidden shadow-2xl relative border border-gray-200"
      onMouseEnter={() => { isHoveredRef.current = true; setIsHovered(true); }}
      onMouseLeave={() => { isHoveredRef.current = false; setIsHovered(false); }}
    >

      {/* --- Cursor Overlay (Only visible when NOT hovered) --- */}
      {!isHovered && <Cursor x={cursorPos.x} y={cursorPos.y} click={isClicking} />}

      {/* Column 1: Main Content (Nav + Preview) */}
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
          />
        </div>

        <main ref={mainContainerRef} className={`flex-grow flex items-center justify-center overflow-hidden relative bg-[#F3F4F6] ${view === 'mobile' && isMobileViewport ? 'p-0' : 'p-4 lg:p-0'}`}>
          <div
            className={`transition-all duration-300 ease-in-out bg-white shadow-lg overflow-hidden flex-shrink-0 origin-center
              ${view === 'mobile' && !isMobileViewport ? 'rounded-3xl border border-gray-300' : ''}
              ${view === 'desktop' ? 'rounded-none lg:rounded-md' : ''}
            `}
            style={{
              width: view === 'desktop' ? (isMobileViewport ? '1024px' : '100%') : (isMobileViewport ? '100%' : '375px'),
              height: view === 'desktop' ? '100%' : (isMobileViewport ? '100%' : '812px'),
              transform: view === 'desktop' ? (isMobileViewport ? `scale(${desktopScale})` : 'none') : (isMobileViewport ? 'none' : `scale(${mobileScale})`),
              marginTop: '0',
              marginBottom: view === 'desktop' && isMobileViewport ? '100px' : '0',
            }}
          >
            {/* --- THIS IS THE KEY: Use an iframe pointing to the real template route --- */}
            {/* Since we modified layout.js, this iframe will now listen to postMessages from '/' */}
            <iframe
              ref={iframeRef}
              src={`/templates/${templateName}`} // Points to the actual route!
              title="Website Preview"
              className="w-full h-full border-0"
              key={templateName}
            />
          </div>
        </main>
      </div>

      {/* Column 2: Sidebar */}
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
        />
      </div>
    </div>
  );
}
