'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { motion } from 'framer-motion';
import EditorTopNav from '@/components/editor/EditorTopNav';
import EditorSidebar from '@/components/editor/EditorSidebar';

// Import template data
import { businessData as auroraData } from '@/app/templates/aurora/data.js';

// --- Cursor Animation Component (Portal to Body) ---
const Cursor = ({ x, y, click }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
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
    </motion.div>,
    document.body
  );
};

export default function LandingEditor() {
  const templateName = 'aurora'; // CHANGED TO AURORA
  const mode = 'dashboard';
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
    return JSON.parse(JSON.stringify(auroraData || {}));
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
            // Sidebar is fixed 320px (80 of tailwind w-80).
            // Wait, w-80 is 20rem = 320px.
            // If the window is wide, sidebar is on the right?
            // In LandingEditor: lg:grid-cols-[1fr_auto]. Sidebar is second column.
            // So sidebar is on the right.
            const sidebarWidth = 320;
            const sidebarCenterX = w - (sidebarWidth / 2);

            // 1. Move to "Business Name" Input
            if (!isMounted.current) break;
            setActiveAccordion('global'); // Open global accordion
            await wait(500);

            if (isHoveredRef.current) { await wait(200); continue; }

            // Move to approx input Y position.
            // Global Settings is first. Business Name is usually the 3rd or 4th input.
            // Let's guess Y around 350px relative to viewport top.
            // The Editor is centered vertically on page? No, it's in Hero.
            // The cursor position is fixed relative to viewport.
            // The LandingEditor top position depends on scroll, but the user is likely at top.
            // Let's assume the user hasn't scrolled much.
            // Actually, we can use `getBoundingClientRect` of the sidebar container if we wanted perfection,
            // but fixed values are "good enough" for a demo if we assume standard desktop res.
            // Let's target the sidebar center X and Y=350.

            setCursorPos({ x: sidebarCenterX, y: 350 });
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
            // Theme tab is at top. approx Y=90 (since header is 65+50=115? No, Header is 65+50. Tabs are below header in sidebar?
            // EditorSidebar tabs are at top of sidebar. Sidebar is below top nav?
            // In LandingEditor layout: Column 1 is Nav + Preview. Column 2 is Sidebar.
            // Sidebar has height 100%.
            // Sidebar tabs are at top of sidebar component.
            // Sidebar starts at top of container.
            // Container top is... well, below the page header.
            // Let's assume standard desktop 1920x1080.
            // The cursor is independent.
            // Let's try to aim for top of sidebar.
            // Sidebar tabs: "Website", "Theme", "Settings".
            // Theme is middle tab.
            setCursorPos({ x: sidebarCenterX, y: 250 }); // Just a guess, 250 might be too low.
            // TopNav is inside col 1. Sidebar is col 2.
            // Sidebar has tabs at the very top.
            // The container `h-[800px]`.
            // The page has a header `NewHeader` (h-20 = 80px).
            // Hero section pt-20.
            // Editor starts somewhere around Y=180?
            // Sidebar tabs are at top of sidebar.
            // So Y ~ 200px.
            setCursorPos({ x: sidebarCenterX, y: 220 });

            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            setIsClicking(true);
            setActiveTab('theme');
            await wait(200);
            setIsClicking(false);

            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            // 3. Select a Palette (Elegant Botanics)
            // Palettes are a grid.
            // elegant-botanics is index 1 (2nd item).
            // Grid is col-2. So it's Top Right.
            // Y position: below "Color Palette" title.
            // Let's guess Y ~ 350.
            setCursorPos({ x: sidebarCenterX + 60, y: 350 });
            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            setIsClicking(true);
            // Update logic for Aurora (styleConfig is hardcoded? No, we wired up theme!)
            setBusinessData(prev => ({ ...prev, theme: { ...prev.theme, colorPalette: 'elegant-botanics' } }));
            await wait(200);
            setIsClicking(false);

            await wait(2500);

            if (isHoveredRef.current) { await wait(200); continue; }

            // 4. Back to Sage Green (Index 0, Top Left)
            setCursorPos({ x: sidebarCenterX - 60, y: 350 });
            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            setIsClicking(true);
            setBusinessData(prev => ({ ...prev, theme: { ...prev.theme, colorPalette: 'sage-green' } }));
            await wait(200);
            setIsClicking(false);

            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            // 5. Back to Website Tab
            setCursorPos({ x: sidebarCenterX - 80, y: 220 }); // Left tab
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
            isLandingMode={true} // <-- Enable Landing Mode
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
          isLandingMode={true} // <-- Enable Landing Mode
        />
      </div>
    </div>
  );
}
