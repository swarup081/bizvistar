'use client';

import { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation'; // Import useSearchParams
import EditorTopNav from './EditorTopNav';
import EditorSidebar from './EditorSidebar';
import WizardModal from './onboarding/WizardModal';
import { getOnboardingStatus } from '@/app/actions/onboardingActions';
import { supabase } from '@/lib/supabaseClient'; // Import your client

// Import all template data
import { businessData as flaraData } from '@/app/templates/flara/data.js';
import { businessData as avenixData } from '@/app/templates/avenix/data.js';
import { businessData as blisslyData } from '@/app/templates/blissly/data.js';
import { businessData as flavornestData } from '@/app/templates/flavornest/data.js';
import { businessData as auroraData } from '@/app/templates/aurora/data.js';
import { businessData as frostifyData } from '@/app/templates/frostify/data.js';

const templateDataMap = {
  flara: flaraData,
  avenix: avenixData,
  blissly: blisslyData,
  flavornest: flavornestData,
  aurora: auroraData,
  frostify: frostifyData,
  // Add other templates here as they are created
};

// Main component updated to read site_id
export default function EditorLayout({ templateName, mode, websiteId: propWebsiteId, initialData, siteSlug }) {
  // Initialize view state lazily to match window width on client
  // Default to 'desktop' for SSR safety, then update in effect
  const [view, setView] = useState('desktop'); 
  const [activeTab, setActiveTab] = useState('website');
  const iframeRef = useRef(null);
  const [activeAccordion, setActiveAccordion] = useState('global');

  // Detect default view on mount
  useEffect(() => {
    if (window.innerWidth < 1024) {
      setView('mobile');
    }
  }, []);
  
  // Get websiteId from URL query or prop
  const searchParams = useSearchParams();
  const websiteId = propWebsiteId || searchParams.get('site_id');
  
  const [isOnboardingOpen, setIsOnboardingOpen] = useState(false);
  const [onboardingInitialData, setOnboardingInitialData] = useState({});

  useEffect(() => {
    const checkOnboarding = async () => {
        if (!websiteId) return;
        const status = await getOnboardingStatus(websiteId);
        if (status && !status.isCompleted && !status.error) {
            setIsOnboardingOpen(true);
            setOnboardingInitialData({
                ...status.data,
                websiteData: status.websiteData // Pass current website data too
            });
        }
    };
    // Delay slightly to ensure UI is ready? Not strictly needed but good for UX
    const timer = setTimeout(checkOnboarding, 500);
    return () => clearTimeout(timer);
  }, [websiteId]);

  const [saveStatus, setSaveStatus] = useState('Saved'); // To show save status
  const debounceTimer = useRef(null); // For debouncing save

  const editorDataKey = `editorData_${templateName}_${websiteId || 'new'}`;
  const cartDataKey = `${templateName}Cart`; 
  
  // State for dynamic scaling
  const [desktopScale, setDesktopScale] = useState(1);
  const [mobileScale, setMobileScale] = useState(1);
  const [isMobileViewport, setIsMobileViewport] = useState(false); // Safe SSR State
  const mainContainerRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      // Safe check for mobile viewport
      const isMobile = window.innerWidth < 1024;
      setIsMobileViewport(isMobile);

      const container = mainContainerRef.current;
      if (!container) return;

      const containerWidth = container.offsetWidth;
      const containerHeight = container.offsetHeight;

      // 1. Desktop View Scaling (on Mobile)
      if (view === 'desktop' && isMobile) {
        // Scale 1024px to fit within the container width (minus padding)
        const scale = Math.min(1, (containerWidth - 40) / 1024);
        setDesktopScale(scale);
      } else {
        setDesktopScale(1);
      }

      // 2. Mobile View Scaling (on Desktop/Laptop)
      if (view === 'mobile') {
        // Scale 812px height to fit within container height (minus vertical padding)
        // We want some breathing room (e.g. 40px top + 40px bottom = 80px)
        const availableHeight = containerHeight - 80;
        const scale = Math.min(1, availableHeight / 812);
        setMobileScale(scale);
      } else {
        setMobileScale(1);
      }
    };

    // Run on mount
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [view]);

  const defaultData = useMemo(() => {
    return JSON.parse(JSON.stringify(templateDataMap[templateName] || {}));
  }, [templateName]);

  const [businessData, setBusinessData] = useState(() => {
     // Priority: initialData (from DB) > defaultData
     let data = initialData || defaultData;
     
     // Inject storeName from Get Started if available and we are starting fresh (using defaultData)
     if (!initialData && typeof window !== 'undefined') {
         const storedName = localStorage.getItem('storeName');
         if (storedName && storedName !== 'My New Site') {
             data = {
                 ...data,
                 name: storedName,
                 logoText: storedName,
                 // Update footer copyright if it exists
                 footer: data.footer ? {
                     ...data.footer,
                     copyright: data.footer.copyright 
                        ? data.footer.copyright.replace(/202[0-9] [A-Za-z]+,/, `202${new Date().getFullYear().toString().slice(-1)} ${storedName},`) 
                        : `© ${new Date().getFullYear()} ${storedName},`
                 } : undefined
             };
         }
     }
     return data;
  });
  
  const [history, setHistory] = useState([initialData || defaultData]);
  const [historyIndex, setHistoryIndex] = useState(0);

  // Load data
  useEffect(() => {
    try {
      // We prioritize localStorage to keep unsaved changes
      const savedData = localStorage.getItem(editorDataKey);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setBusinessData(parsedData); 
        setHistory([parsedData]);
        setHistoryIndex(0);
      } else if (initialData) {
         // If we have initialData passed prop (e.g. from Dashboard), use it.
         setBusinessData(initialData);
         setHistory([initialData]);
         setHistoryIndex(0);
      } else {
        // If no local data and no initialData, use default
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
  }, [templateName, websiteId, defaultData, editorDataKey]); 

// Auto-save logic
useEffect(() => {
  // 1. Save to localStorage immediately
  try {
    const dataToSave = JSON.stringify(businessData);
    localStorage.setItem(editorDataKey, dataToSave);
    setSaveStatus('Saving...');
  } catch (error) {
    console.error("Failed to save data to localStorage:", error);
  }

  // 2. Debounce saving to Supabase
  if (debounceTimer.current) {
    clearTimeout(debounceTimer.current);
  }

  debounceTimer.current = setTimeout(async () => {
    if (websiteId) {
      
      // --- ADD THIS LINE ---
      const { data: { session } } = await supabase.auth.getSession();
      
      // Call the 'save-website' Supabase function
      const { error } = await supabase.functions.invoke('save-website', {
        
        // --- ADD THIS 'headers' OBJECT ---
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        // --- END OF ADDITIONS ---
        
        body: { websiteId, websiteData: businessData },
      });

      if (error) {
        setSaveStatus('Error');
        console.error('Error saving to Supabase:', error);
      } else {
        setSaveStatus('Saved');
      }
    } else {
      setSaveStatus('Saved (Local)');
    }
  }, 1500); // Save 1.5 seconds after last change

  return () => clearTimeout(debounceTimer.current);

}, [businessData, editorDataKey, websiteId]);
  
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
    localStorage.removeItem(editorDataKey);
    localStorage.removeItem(cartDataKey);
    setBusinessData(defaultData);
    setHistory([defaultData]);
    setHistoryIndex(0);
    sendDataToIframe(defaultData);
    const homePage = defaultData.pages?.[0]?.path || `/templates/${templateName}`;
    handlePageChange(homePage);
  };

  const sendDataToIframe = (data) => {
    if (iframeRef.current && data) {
      iframeRef.current.contentWindow.postMessage({
        type: 'UPDATE_DATA',
        payload: data,
      }, '*');
    }
  };

  // Send data to iframe immediately on initial load and when businessData changes (debounced)
  useEffect(() => {
    // Immediate send if it's the first load or if needed
    if (iframeRef.current && iframeRef.current.contentWindow) {
        sendDataToIframe(businessData);
    }
    
    const handler = setTimeout(() => {
      sendDataToIframe(businessData);
    }, 250); 

    return () => clearTimeout(handler);
  }, [businessData]); 

  // Listen for messages from iframe
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
    return () => window.removeEventListener('message', handleMessage);
  }, [businessData]); 

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
  
  useEffect(() => {
      const homePage = defaultData.pages?.[0]?.path || `/templates/${templateName}`;
      setActivePage(homePage);
      setPreviewUrl(homePage);
  }, [templateName, defaultData]);

  const handleAccordionToggle = (id) => {
    const newActiveId = activeAccordion === id ? null : id;
    setActiveAccordion(newActiveId);

    if (newActiveId) {
      if (newActiveId === 'products') {
        const shopPage = businessData.pages.find(
          (p) => p.name.toLowerCase() === 'shop'
        );
        if (shopPage) {
          handlePageChange(shopPage.path);
        }
      } else {
        const sectionIdMap = {
          hero: 'home',
          global: 'home',
          about: businessData.aboutSectionId || 'about',
          events: businessData.eventsSectionId || 'events',
          menu: businessData.menuSectionId || 'menu',
          testimonials: businessData.testimonialsSectionId || 'testimonials',
          collection: businessData.collectionSectionId || 'collection',
          feature2: businessData.feature2SectionId || 'feature2',
          footer: businessData.footerSectionId || 'contact',
          cta: businessData.ctaSectionId || 'cta',
          stats: businessData.statsSectionId || 'stats',
          blog: businessData.blogSectionId || 'blog',
          reviews: businessData.reviewsSectionId || 'reviews',
          specialty: businessData.specialtySectionId || 'specialty',
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
    <div className={`flex flex-col lg:grid lg:grid-cols-[1fr_auto] bg-gray-50 ${mode === 'dashboard' ? 'h-full' : 'h-screen'}`}>
      
      {/* Column 1: Main Content (Nav + Preview) */}
      <div className={`flex flex-col overflow-hidden relative ${mode === 'dashboard' ? 'h-full' : 'h-screen'}`}>
        
        <div className="flex-shrink-0 z-20 relative">
          <EditorTopNav
            mode={mode}
            siteSlug={siteSlug}
            templateName={templateName}
            websiteId={websiteId} // Pass websiteId to the nav
            saveStatus={saveStatus} // Pass saveStatus to the nav
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

        <main ref={mainContainerRef} className={`flex-grow flex items-center justify-center overflow-hidden relative bg-[#F3F4F6] ${view === 'mobile' && isMobileViewport ? 'p-0' : 'p-4 lg:p-0'}`}>
          <div
            className={`transition-all duration-300 ease-in-out bg-white shadow-lg overflow-hidden flex-shrink-0 origin-center
              ${view === 'mobile' && !isMobileViewport ? 'rounded-3xl border border-gray-300' : ''} 
              ${view === 'desktop' ? 'rounded-none lg:rounded-md' : ''}
            `}
            style={{
              // Logic for Width
              width: view === 'desktop' 
                ? (isMobileViewport ? '1024px' : '100%') // Fixed on mobile, Fluid on Desktop
                : (isMobileViewport ? '100%' : '375px'), // 100% on actual mobile, Fixed on Desktop
              
              // Logic for Height
              height: view === 'desktop'
                ? '100%' // Desktop takes full height
                : (isMobileViewport ? '100%' : '812px'), // 100% on actual mobile, Fixed on Desktop
              
              // Scaling Logic
              transform: view === 'desktop'
                 ? (isMobileViewport ? `scale(${desktopScale})` : 'none') 
                 : (isMobileViewport ? 'none' : `scale(${mobileScale})`), // No scale on actual mobile

              // Margins
              marginTop: '0', 
              marginBottom: view === 'desktop' && isMobileViewport ? '100px' : '0',
            }}
          >
            <iframe
              ref={iframeRef}
              src={previewUrl}
              title="Website Preview"
              className="w-full h-full border-0"
              key={templateName} 
            />
          </div>
        </main>
      </div>

      {/* Column 2: Sidebar (Full Height / Mobile Bottom) */}
      <div className={`bg-white border-l border-gray-200 lg:overflow-y-auto lg:static lg:h-full lg:w-80 fixed bottom-0 left-0 w-full z-40 lg:z-auto shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] lg:shadow-none`}>
        <EditorSidebar 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          businessData={businessData}
          setBusinessData={handleDataUpdate} 
          onPageChange={handlePageChange}
          
          activeAccordion={activeAccordion}
          onAccordionToggle={handleAccordionToggle} 
          templateName={templateName}
        />
      </div>

      {isOnboardingOpen && (
          <WizardModal
              isOpen={isOnboardingOpen}
              onClose={() => setIsOnboardingOpen(false)}
              initialData={onboardingInitialData}
              websiteId={websiteId}
              onDataUpdate={handleDataUpdate}
          />
      )}
    </div>
  );
}