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
  const templateName = 'aurora';
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
  const [scale, setScale] = useState(1);
  const mainContainerRef = useRef(null);

  // --- UPDATED RESIZE LOGIC ---
  useEffect(() => {
    const handleResize = () => {
      const container = mainContainerRef.current;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      // Base width for desktop view (ensures it looks like a real desktop)
      const baseDesktopWidth = 1440;
      // Base dimensions for mobile (iPhone Xish)
      const baseMobileWidth = 375;
      const baseMobileHeight = 812;

      if (view === 'desktop') {
        // Calculate scale to fit the 1440px wide content into the available container width
        // We add some padding/margin logic if needed, but fitting width is key.
        // If container > 1440, we might cap it or let it grow.
        // But for "squished" issue, the container is likely smaller (e.g. 1000px).
        // So scale = 1000 / 1440 = 0.69
        const newScale = Math.min(1, containerWidth / baseDesktopWidth);
        setScale(newScale);
      } else {
        // Mobile View
        const availableHeight = containerHeight - 40; // padding
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
            if (isHoveredRef.current) {
               await wait(200);
               continue;
            }

            const w = window.innerWidth;
            const sidebarWidth = 320;
            const sidebarCenterX = w - (sidebarWidth / 2);

            // 1. Move to "Hero Section" (Updated from Business Name)
            // Hero is usually the 2nd item if Global is hidden?
            // If Global is hidden, Hero is 1st.
            if (!isMounted.current) break;
            setActiveAccordion('hero');
            await wait(500);

            if (isHoveredRef.current) { await wait(200); continue; }

            // Move to "Hero Title" input (approx Y=300)
            setCursorPos({ x: sidebarCenterX, y: 300 });
            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            // Click
            setIsClicking(true);
            await wait(200);
            setIsClicking(false);

            if (isHoveredRef.current) { await wait(200); continue; }

            // Type "Timeless Elegance" (Replacing "Desire Meets New Style" logic visually)
            // Note: We are simulating typing by updating state directly
            const targetTitle = "Timeless Elegance";
            for (let i = 0; i <= targetTitle.length; i++) {
                if (!isMounted.current) break;
                if (isHoveredRef.current) { await wait(200); i--; continue; }

                // For Aurora Hero Title (It has titleLine1 and titleLine2, but simplified for demo)
                // Let's just update titleLine1 for visual effect
                setBusinessData(prev => ({
                    ...prev,
                    hero: { ...prev.hero, titleLine1: targetTitle.substring(0, i) }
                }));
                await wait(80);
            }

            await wait(1500);

            if (isHoveredRef.current) { await wait(200); continue; }

            // 2. Switch to Theme Tab
            if (!isMounted.current) break;
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
            setCursorPos({ x: sidebarCenterX + 60, y: 350 });
            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            setIsClicking(true);
            setBusinessData(prev => ({ ...prev, theme: { ...prev.theme, colorPalette: 'elegant-botanics' } }));
            await wait(200);
            setIsClicking(false);

            await wait(2500);

            if (isHoveredRef.current) { await wait(200); continue; }

            // 4. Back to Sage Green
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
            setCursorPos({ x: sidebarCenterX - 80, y: 220 });
            await wait(1000);

            if (isHoveredRef.current) { await wait(200); continue; }

            setIsClicking(true);
            setActiveTab('website');
            await wait(200);
            setIsClicking(false);

            // Reset Text
            setBusinessData(prev => ({
                ...prev,
                hero: { ...prev.hero, titleLine1: defaultData.hero?.titleLine1 || "Desire Meets" }
            }));

            await wait(2000);
        }
    };
    sequence();
    return () => { isMounted.current = false; };
  }, [defaultData.hero?.titleLine1]); // Dependency updated


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

      {/* --- Cursor Overlay --- */}
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
              height: view === 'desktop' ? '100%' : '812px',
              transform: `scale(${scale})`, // Use computed scale
              marginTop: view === 'desktop' ? '0' : '40px',
              overflow: 'hidden', // Prevent scrollbars
            }}
          >
            {/* --- Iframe --- */}
            <iframe
              ref={iframeRef}
              src={`/templates/${templateName}`}
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
