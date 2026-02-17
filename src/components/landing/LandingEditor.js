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
    // eslint-disable-next-line react-hooks/avoid-calling-set-state-in-effect
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <motion.div
      className="fixed pointer-events-none z-[99999]" // Increased z-index
      style={{ left: 0, top: 0 }} // Ensure fixed positioning works with x/y transform
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
  const templateName = 'aurora';
  const mode = 'dashboard';
  const websiteId = 'demo';
  const siteSlug = 'demo';

  const [view, setView] = useState('desktop');
  const [activeTab, setActiveTab] = useState('website');
  const iframeRef = useRef(null);
  const containerRef = useRef(null); // Ref for the main editor container
  const [activeAccordion, setActiveAccordion] = useState('global');

  // Animation State
  const [cursorPos, setCursorPos] = useState({ x: -100, y: -100 }); // Start off-screen
  const [isClicking, setIsClicking] = useState(false);
  const isMounted = useRef(true);

  // Interaction State
  const [isHovered, setIsHovered] = useState(false);
  const isHoveredRef = useRef(false);

  // State for dynamic scaling
  const [scale, setScale] = useState(1);
  const [containerHeight, setContainerHeight] = useState(800); // Default fallback
  const mainContainerRef = useRef(null);

  // --- UPDATED RESIZE LOGIC ---
  useEffect(() => {
    const handleResize = () => {
      const container = mainContainerRef.current;
      if (!container) return;

      const cWidth = container.offsetWidth;
      const cHeight = container.offsetHeight;
      setContainerHeight(cHeight);

      // Base width for desktop view (ensures it looks like a real desktop)
      const baseDesktopWidth = 1440;
      // Base dimensions for mobile (iPhone Xish)
      const baseMobileWidth = 375;
      const baseMobileHeight = 812;

      if (view === 'desktop') {
        // Calculate scale to fit the 1440px wide content into the available container width
        const newScale = Math.min(1, cWidth / baseDesktopWidth);
        setScale(newScale);
      } else {
        // Mobile View
        const availableHeight = cHeight - 40; // padding
        const heightScale = availableHeight / baseMobileHeight;
        setScale(Math.min(1, heightScale));
      }
    };

    handleResize(); // Initial call
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
            if (isHoveredRef.current) { await wait(200); continue; }

            // Get Editor Container Rect for Coordinate Mapping
            const containerRect = containerRef.current?.getBoundingClientRect();
            if (!containerRect) { await wait(200); continue; }

            // --- Helper to map virtual (1440x800) coordinates to screen ---
            // The simulation logic works in "virtual desktop" space.
            // We need to scale X/Y relative to the container's top-left.
            // BUT: The sidebar is fixed width (320px) on the right in the UI, but in the DOM structure it's a flex/grid item.
            // The visual representation in LandingEditor matches the grid.
            // So we can target relative to containerRect.

            // Note: The scale state affects the *preview* (iframe wrapper), not the Sidebar (which is separate div).
            // However, the Sidebar is rendered inside the container.
            // Wait, in LandingEditor JSX:
            // <div className="flex flex-col lg:grid lg:grid-cols-[1fr_auto] ...">
            //    <div>...Main (Preview)...</div>
            //    <div>...Sidebar...</div>
            // </div>
            // So Sidebar is NOT scaled. It is standard DOM.
            // Main content IS scaled.

            // Coordinate Strategy:
            // 1. Sidebar Elements: Target relative to container Right Edge.
            // 2. Preview Elements (Title): Target relative to container Left Edge + Scaled Position.

            const containerLeft = containerRect.left;
            const containerTop = containerRect.top;
            const containerRight = containerRect.right;
            // Sidebar is approx 320px from right.
            const sidebarX = containerRight - 160; // Center of sidebar

            // --- STEP 1: Move to Title (Desire Meets New Style) ---
            // Virtual Pos: x=350, y=350.
            // Screen Pos: left + (350 * scale), top + (350 * scale).
            // (Assuming preview is top-left aligned in its cell).
            // Note: EditorTopNav is above preview. Height approx 60px.
            const previewTopOffset = 60;

            const titleTargetX = containerLeft + (350 * scale);
            const titleTargetY = containerTop + previewTopOffset + (300 * scale);

            setCursorPos({ x: titleTargetX, y: titleTargetY });
            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            // Click Title
            setIsClicking(true);
            // Simulate Sidebar Open
            setActiveAccordion('hero');
            await wait(200);
            setIsClicking(false);

            await wait(800); // Wait for sidebar transition

            if (isHoveredRef.current) { await wait(200); continue; }

            // --- STEP 2: Move to Title Input in Sidebar ---
            // Sidebar is not scaled.
            // Input is near top of sidebar content (below tabs).
            // Tabs ~60px.
            const sidebarInputY = containerTop + 180;

            setCursorPos({ x: sidebarX, y: sidebarInputY });
            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            // Click Input
            setIsClicking(true);
            await wait(200);
            setIsClicking(false);

            // Type "Timeless Elegance"
            const targetTitle = "Timeless Elegance";
            for (let i = 0; i <= targetTitle.length; i++) {
                if (!isMounted.current) break;
                if (isHoveredRef.current) { await wait(200); i--; continue; }

                setBusinessData(prev => ({
                    ...prev,
                    hero: {
                        ...prev.hero,
                        titleLine1: targetTitle.substring(0, i),
                        title: targetTitle.substring(0, i) // Update both for compat
                    }
                }));
                await wait(80);
            }

            await wait(1000);
            if (isHoveredRef.current) { await wait(200); continue; }

            // --- STEP 3: Switch to Theme Tab ---
            const themeTabY = containerTop + 40; // Tabs area
            // "Theme" is the middle tab. Sidebar width 320.
            // Website | Theme | Settings
            // 0-106   | 107-213 | 214-320
            // Center of Theme is ~160px from sidebar left.
            // Sidebar Left = containerRight - 320.
            // So SidebarX (center) is correct.

            setCursorPos({ x: sidebarX, y: themeTabY });
            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            setIsClicking(true);
            setActiveTab('theme');
            await wait(200);
            setIsClicking(false);

            await wait(800);
            if (isHoveredRef.current) { await wait(200); continue; }

            // --- STEP 4: Select Strawberry Cream Palette ---
            // Palette Grid starts below "Color Palette" title.
            // Approx Y relative to containerTop.
            // Header ~60px + Title ~40px = 100px.
            // Grid is 4 rows. Strawberry Cream is last (Row 4, Col 2).
            // Row height ~50px. Y = 100 + (3*50) + 25 = 275.
            const strawberryY = containerTop + 280;
            // Col 2 center. Sidebar width 320. Col 2 is right half.
            // Center ~ containerRight - 80.
            const strawberryX = containerRight - 80;

            setCursorPos({ x: strawberryX, y: strawberryY });
            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            setIsClicking(true);
            setBusinessData(prev => ({ ...prev, theme: { ...prev.theme, colorPalette: 'strawberry-cream' } }));
            await wait(200);
            setIsClicking(false);

            await wait(1500);
            if (isHoveredRef.current) { await wait(200); continue; }

            // --- STEP 5: Change Font to Kalam ---
            // Font select is below palettes. Y approx 450.
            const fontSelectY = containerTop + 450;
            const fontSelectX = sidebarX; // Center

            setCursorPos({ x: fontSelectX, y: fontSelectY });
            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            // Open Dropdown
            setIsClicking(true);
            await wait(200);
            setIsClicking(false);

            await wait(500); // Wait for dropdown animation

            // Move to "Kalam" (Assuming it's in the list, down a bit)
            // Dropdown list height ~200px.
            // Kalam is towards end? Or sorted?
            // "Kalam" is index 7 in the list of 10.
            // Item height ~36px. 7 * 36 = 252px down.
            const kalamY = fontSelectY + 200;

            setCursorPos({ x: fontSelectX, y: kalamY });
            await wait(800);

            if (isHoveredRef.current) { await wait(200); continue; }

            // Select Kalam
            setIsClicking(true);
            setBusinessData(prev => ({ ...prev, theme: { ...prev.theme, font: { ...prev.theme.font, heading: 'Kalam' } } }));
            await wait(200);
            setIsClicking(false);

            // Close dropdown (click outside or it closes on select)
            // It closes on select usually.

            await wait(2000);
            if (isHoveredRef.current) { await wait(200); continue; }

            // --- RESET ---
            // Move back to Website Tab to restart cleanly?
            // Or just reset state.

            setActiveTab('website');
             setBusinessData(prev => ({
                ...prev,
                hero: {
                    ...prev.hero,
                    titleLine1: defaultData.hero?.titleLine1 || "Desire Meets",
                    title: defaultData.hero?.titleLine1 // Reset generic title too
                },
                theme: defaultData.theme
            }));

            await wait(1000);
        }
    };
    sequence();
    return () => { isMounted.current = false; };
  }, [defaultData.hero?.titleLine1, scale]); // Added scale dep


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
      ref={containerRef}
      className="flex flex-col lg:grid lg:grid-cols-[1fr_auto] bg-gray-50 h-[800px] rounded-xl overflow-hidden shadow-2xl relative border border-gray-200"
      onMouseEnter={() => { isHoveredRef.current = true; setIsHovered(true); }}
      onMouseLeave={() => { isHoveredRef.current = false; setIsHovered(false); }}
    >

      {/* --- Cursor Overlay --- */}
      {/* ALWAYS RENDER CURSOR IF NOT HOVERED, USING PORTAL. */}
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
            isLandingMode={true}
          />
        </div>

        <main ref={mainContainerRef} className={`flex-grow flex items-center justify-center overflow-hidden relative bg-[#F3F4F6] p-0`}>
          <div
            className={`transition-all duration-300 ease-in-out bg-white shadow-lg flex-shrink-0 origin-top
              ${view === 'mobile' ? 'rounded-3xl border border-gray-300' : ''}
            `}
            style={{
              width: view === 'desktop' ? '1440px' : '375px', // Fixed 1440px width for desktop to prevent squishing
              height: view === 'desktop' ? `${containerHeight / scale}px` : '812px', // Invert scale for height to fill container
              transform: `scale(${scale})`, // Use computed scale
              marginTop: view === 'desktop' ? '0' : '40px',
              overflow: 'hidden', // Prevent scrollbars
            }}
          >
            {/* --- Iframe --- */}
            <iframe
              ref={iframeRef}
              src={`/templates/${templateName}?isLanding=true`} // Added param
              title="Website Preview"
              className="w-full h-full border-0 pointer-events-auto" // Ensure iframe receives events if needed
              key={templateName}
              style={{ overflow: 'hidden' }}
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
          isLandingMode={true}
        />
      </div>
    </div>
  );
}
