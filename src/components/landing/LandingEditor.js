'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
// Removed createPortal since we want absolute positioning within the relative container
import { motion } from 'framer-motion';
import EditorTopNav from '@/components/editor/EditorTopNav';
import EditorSidebar from '@/components/editor/EditorSidebar';

// Import template data
import { businessData as auroraData } from '@/app/templates/aurora/data.js';

// --- Cursor Animation Component (Absolute within Container) ---
const Cursor = ({ x, y, click }) => {
  return (
    <motion.div
      className="absolute pointer-events-none z-[50]"
      style={{ left: 0, top: 0 }}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }} // Slightly softer
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

  // --- Animation Logic (Coordinate Recalibration) ---
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

            // Coordinates relative to CONTAINER (top-left is 0,0)
            // Sidebar is fixed width 320px on the RIGHT side.
            // Wait, looking at JSX below:
            // `lg:grid-cols-[1fr_auto]` means Preview is Left, Sidebar is Right (Auto).
            // Sidebar width `lg:w-80` (320px).

            const sidebarWidth = 320;
            const sidebarLeftX = w - sidebarWidth; // X coordinate where sidebar starts
            const sidebarCenterX = sidebarLeftX + (sidebarWidth / 2);

            // --- STEP 1: Click "Hero Section" Accordion ---
            // Accordion list starts below Tabs. Tabs height ~60px.
            // "Global Settings" is 1st. "Hero Section" is 2nd.
            // Accordion Item height ~50px.
            // Target Y: ~60 + 50 + 25 = 135px.

            const heroAccordionY = 135;

            setCursorPos({ x: sidebarCenterX, y: heroAccordionY });
            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            setIsClicking(true);
            setActiveAccordion('hero'); // Open Hero
            await wait(200);
            setIsClicking(false);

            await wait(800); // Wait for open animation
            if (isHoveredRef.current) { await wait(200); continue; }

            // --- STEP 2: Click "Title" Input ---
            // Input is inside accordion.
            // 1st input is usually Title/Line1.
            // Y position shifts down. Let's say ~180px.

            const titleInputY = 220; // Adjusted down for opened accordion content

            setCursorPos({ x: sidebarCenterX, y: titleInputY });
            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

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
                        title: targetTitle.substring(0, i)
                    }
                }));
                await wait(80);
            }

            await wait(1000);
            if (isHoveredRef.current) { await wait(200); continue; }

            // --- STEP 3: Switch to Theme Tab ---
            // Tabs are at top of Sidebar.
            // Website | Theme | Settings
            // Theme is middle.

            const themeTabY = 30; // Center of tab bar (height 60)
            const themeTabX = sidebarCenterX;

            setCursorPos({ x: themeTabX, y: themeTabY });
            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            setIsClicking(true);
            setActiveTab('theme');
            await wait(200);
            setIsClicking(false);

            await wait(800);
            if (isHoveredRef.current) { await wait(200); continue; }

            // --- STEP 4: Select Strawberry Cream Palette ---
            // Palettes are a grid.
            // Strawberry Cream is the last one (bottom right).
            // Grid starts below title.
            // Y approx 250px.
            // X approx sidebarRight - 60px.

            const strawberryX = w - 80;
            const strawberryY = 280;

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
            // Font dropdowns are below palettes.
            // Heading Font Select Y approx 450.

            const fontSelectY = 450;
            const fontSelectX = sidebarCenterX;

            setCursorPos({ x: fontSelectX, y: fontSelectY });
            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            // Click to Open Dropdown
            setIsClicking(true);
            await wait(200);
            setIsClicking(false);

            await wait(500);

            // Move down to "Kalam" in the list
            // Dropdown overlay appears.
            // Y + 200px.

            const kalamY = fontSelectY + 200;

            setCursorPos({ x: fontSelectX, y: kalamY });
            await wait(800);

            if (isHoveredRef.current) { await wait(200); continue; }

            // Select Kalam
            setIsClicking(true);
            setBusinessData(prev => ({ ...prev, theme: { ...prev.theme, font: { ...prev.theme.font, heading: 'Kalam' } } }));
            await wait(200);
            setIsClicking(false);

            await wait(2000);
            if (isHoveredRef.current) { await wait(200); continue; }

            // --- STEP 6: Publish (Top Right) ---
            // Publish button is in EditorTopNav (Top Bar).
            // Position: Top Right of MAIN PREVIEW area (Column 1).
            // Column 1 Width = w - 320.
            // Button is ~100px from right of Col 1.
            // Y ~ 30px (Center of Nav).

            const publishX = (w - sidebarWidth) - 100;
            const publishY = 30;

            setCursorPos({ x: publishX, y: publishY });
            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            setIsClicking(true);
            // Flash success?
            await wait(200);
            setIsClicking(false);

            await wait(2000);
            if (isHoveredRef.current) { await wait(200); continue; }


            // --- RESET ---
            setActiveTab('website');
            setActiveAccordion('global'); // Reset accordion
             setBusinessData(prev => ({
                ...prev,
                hero: {
                    ...prev.hero,
                    titleLine1: defaultData.hero?.titleLine1 || "Desire Meets",
                    title: defaultData.hero?.titleLine1
                },
                theme: defaultData.theme
            }));

            await wait(1000);
        }
    };
    sequence();
    return () => { isMounted.current = false; };
  }, [defaultData.hero?.titleLine1, scale]);


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
      onMouseLeave={() => { isHoveredRef.current = false; setIsHovered(false); }}
    >

      {/* --- Cursor Overlay (ABSOLUTE within this RELATIVE container) --- */}
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
              width: view === 'desktop' ? '1440px' : '375px',
              height: view === 'desktop' ? `${containerHeight / scale}px` : '812px',
              transform: `scale(${scale})`,
              marginTop: view === 'desktop' ? '0' : '40px',
              overflow: 'hidden',
            }}
          >
            {/* --- Iframe --- */}
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
