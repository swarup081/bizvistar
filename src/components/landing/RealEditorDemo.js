'use client';

import { useState, useEffect, useRef } from 'react';
import EditorTopNav from '@/components/editor/EditorTopNav';
import EditorSidebar from '@/components/editor/EditorSidebar';
import CandleaPage from '@/app/templates/flara/page';
import { businessData as initialData } from '@/app/templates/flara/data';
import { TemplateContext } from '@/app/templates/flara/templateContext';
import { CartProvider } from '@/app/templates/flara/cartContext'; // Use Real Provider
import { motion } from 'framer-motion';

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

export default function RealEditorDemo() {
  const [businessData, setBusinessData] = useState(initialData);
  const [activeTab, setActiveTab] = useState('website');
  const [activeAccordion, setActiveAccordion] = useState('global');
  const [view, setView] = useState('desktop');
  const [activePage, setActivePage] = useState('/'); // Dummy page path

  // Animation State
  const [cursorPos, setCursorPos] = useState({ x: 1200, y: 300 });
  const [isClicking, setIsClicking] = useState(false);
  const isMounted = useRef(true);

  // --- Animation Loop ---
  useEffect(() => {
    isMounted.current = true;

    const wait = (ms) => new Promise(r => setTimeout(r, ms));

    const sequence = async () => {
        // Initial delay
        await wait(1500);

        while (isMounted.current) {
            // Screen dimensions (assuming desktop for demo)
            // We use relative positions assuming a 1440px+ width or relative to window
            // Since we can't know the exact window size of the viewer, we use logic
            // based on the assumption that the Sidebar is on the RIGHT (320px width).

            const w = window.innerWidth;
            const sidebarCenter = w - 160;
            const sidebarLeft = w - 320;

            // 1. Move to "Business Name" Input (approx Y=300 in 'website' tab -> 'global' accordion)
            if (!isMounted.current) break;
            setActiveAccordion('global'); // Ensure open
            await wait(500);

            // Move to input
            setCursorPos({ x: sidebarCenter, y: 320 });
            await wait(1000);

            // Click
            setIsClicking(true);
            await wait(200);
            setIsClicking(false);

            // Type "Storify Demo"
            const targetName = "Storify Demo";
            for (let i = 0; i <= targetName.length; i++) {
                if (!isMounted.current) break;
                setBusinessData(prev => ({
                    ...prev,
                    name: targetName.substring(0, i),
                    logoText: targetName.substring(0, i)
                }));
                await wait(80);
            }

            await wait(1500);

            // 2. Switch to Theme Tab
            if (!isMounted.current) break;
            // Tab is at top of sidebar. Website=0, Theme=1.
            // Theme tab approx x = w - 160 (center), y = 80 (header height + tab height/2)
            // Actually Sidebar has tabs at top? Let's check EditorSidebar.
            // Yes, MainTab.

            setCursorPos({ x: sidebarCenter, y: 90 });
            await wait(1000);

            setIsClicking(true);
            setActiveTab('theme');
            await wait(200);
            setIsClicking(false);

            await wait(1000);

            // 3. Select a Palette
            // Palettes are in a grid.
            // Let's say we pick the 2nd one (Elegant Botanics).
            // Grid cols 2.
            // 1st row, 2nd col. x approx w - 80. y approx 250.

            setCursorPos({ x: w - 80, y: 250 });
            await wait(1000);

            setIsClicking(true);
            setBusinessData(prev => ({ ...prev, theme: { ...prev.theme, colorPalette: 'elegant-botanics' } }));
            await wait(200);
            setIsClicking(false);

            await wait(2500); // Admire

            // 4. Select another Palette (Strawberry Cream - last one?)
            // Or just go back to Sage Green (1st one).
            // 1st row, 1st col. x approx w - 240. y approx 250.

            setCursorPos({ x: w - 240, y: 250 });
            await wait(1000);

            setIsClicking(true);
            setBusinessData(prev => ({ ...prev, theme: { ...prev.theme, colorPalette: 'sage-green' } }));
            await wait(200);
            setIsClicking(false);

            await wait(1000);

            // 5. Go back to Website Tab
            setCursorPos({ x: w - 260, y: 90 }); // Left tab (Website)
            await wait(1000);

            setIsClicking(true);
            setActiveTab('website');
            await wait(200);
            setIsClicking(false);

            // Reset Text
            setBusinessData(prev => ({
                ...prev,
                name: initialData.name,
                logoText: initialData.logoText
            }));

            await wait(2000);
        }
    };

    sequence();

    return () => { isMounted.current = false; };
  }, []);

  // --- Theme Injection for Wrapper ---
  // We need to map the Flara theme logic manually since we aren't using the real Layout
  const themeClass = `theme-${businessData.theme.colorPalette}`;
  const getFontVar = (font) => `var(--font-${font.toLowerCase().replace(/[\s_]+/g, '-')})`;
  const styleVars = {
      '--font-heading': getFontVar(businessData.theme.font.heading),
      '--font-body': getFontVar(businessData.theme.font.body),
      // Add standard tailwind font vars if needed, but Flara uses these custom ones mostly
  };

  return (
    <div className="flex flex-col h-[800px] w-full bg-gray-100 overflow-hidden relative border border-gray-200 rounded-xl shadow-2xl">
      {/* --- Cursor Overlay --- */}
      <Cursor x={cursorPos.x} y={cursorPos.y} click={isClicking} />

      {/* --- Top Nav (Mocked to be static or minimal interactive) --- */}
      <div className="shrink-0 z-20 bg-white shadow-sm pointer-events-none">
         {/* We wrap in pointer-events-none to prevent user interfering with demo,
             or we can allow it. Let's let them click but overrides happen. */}
         <EditorTopNav
          mode="dashboard"
          siteSlug="demo"
          templateName="flara"
          saveStatus="Saved"
          view={view}
          onViewChange={setView}
          activePage={activePage}
          pages={[{ name: 'Home', path: '/' }]}
          onPageChange={() => {}}
          canUndo={false}
          canRedo={false}
        />
      </div>

      {/* --- Main Workspace --- */}
      <div className="flex-grow flex overflow-hidden relative">

        {/* --- Canvas (Center) --- */}
        <div className="flex-grow bg-gray-100 flex items-start justify-center overflow-hidden p-8 relative">

            {/* The "Device" Frame */}
            <div
                className={`bg-white shadow-lg transition-all duration-500 origin-top overflow-hidden
                    ${view === 'mobile'
                        ? 'w-[375px] h-[812px] rounded-[3rem] border-[8px] border-gray-900 ring-4 ring-gray-900/10'
                        : 'w-full h-full max-w-[1200px] rounded-lg border border-gray-200 shadow-sm'
                    }
                `}
            >
                {/* --- Content (Scaled / Scrolled) --- */}
                <div className={`w-full h-full overflow-y-auto custom-scrollbar ${themeClass}`} style={styleVars}>
                    <div className="bg-brand-bg text-brand-text font-sans min-h-full">
                         <TemplateContext.Provider value={{
                            businessData,
                            setBusinessData,
                            basePath: '#', // No navigation in demo
                            websiteId: 'demo'
                        }}>
                            <CartProvider>
                                 <CandleaPage />
                            </CartProvider>
                        </TemplateContext.Provider>
                    </div>
                </div>
            </div>
        </div>

        {/* --- Sidebar (Right) --- */}
        <div className="w-[320px] shrink-0 border-l border-gray-200 bg-white h-full z-10 flex flex-col pointer-events-none">
             {/* We use pointer-events-none so the user can't break the animation loop easily,
                 or we can allow it. The user said "animated left and right with very slow auto changing",
                 implying it's a passive demo. */}
             <EditorSidebar
                activeTab={activeTab}
                onTabChange={setActiveTab} // State driven by animation
                businessData={businessData}
                setBusinessData={setBusinessData}
                onPageChange={() => {}}
                activeAccordion={activeAccordion}
                onAccordionToggle={setActiveAccordion}
                forceDesktop={true}
             />
        </div>
      </div>
    </div>
  );
}
