'use client';

import { useState, useMemo } from 'react';
import {
  LayoutDashboard, Settings, Home, Store, Calendar, Tag, MessageCircle, Contact, Info,
  Paintbrush, // Changed from Palette
} from 'lucide-react';

// Import the new reusable controls
import {
  SectionTitle,
  EditorSelect,
  ColorSwatchButton,
  fontOptions,
  colorPalettes
} from './EditorControls.js';

// Import the new template-specific editors
// This is what was causing the "Module not found" error.
// We will create these files in the next steps.
import FlaraEditor from './templates/FlaraEditor.js';
import AvenixEditor from './templates/AvenixEditor.js';
import BlisslyEditor from './templates/BlisslyEditor.js';
import FlavornestEditor from './templates/FlavornestEditor.js';


// Reusable tab button
const MainTab = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 w-full py-4 px-2 font-medium ${
      isActive 
        ? 'border-b-2 border-blue-600 text-blue-600' 
        : 'text-gray-500 hover:text-gray-900 transition-colors'
    }`}
  >
    <Icon size={22} />
    <span className="text-xs font-medium uppercase tracking-wider">{label}</span>
  </button>
);

// Reusable button for navigation/shortcuts
const SidebarLink = ({ icon: Icon, label, isActive = false, onClick }) => (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-md font-medium text-sm text-left ${
        isActive 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
      }`}
    >
      <Icon size={18} /> {label}
    </button>
);


export default function EditorSidebar({ 
  activeTab, 
  onTabChange,
  businessData,
  setBusinessData, // This is handleDataUpdate from layout
  onPageChange,
  templateName // <-- This prop is passed from EditorLayout
}) {

  const [activeAccordion, setActiveAccordion] = useState('global');

  const handleDataChange = (path, value) => {
    setBusinessData(prev => {
        const keys = path.split('.');
        const newData = JSON.parse(JSON.stringify(prev));
        
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (current[key] === undefined || current[key] === null) {
                // Check if the next key is a number, to create an array if needed
                if (isFinite(keys[i+1])) {
                    current[key] = [];
                } else {
                    current[key] = {};
                }
            }
            current = current[key];
        }
        
        current[keys[keys.length - 1]] = value;
        return newData;
    });
  };

  // --- NEW: Sync handler for Business Name and Logo Text ---
  const handleSyncedNameChange = (newValue) => {
    setBusinessData(prev => {
        const newData = JSON.parse(JSON.stringify(prev));
        
        // Sync both fields
        newData.name = newValue;
        newData.logoText = newValue; 

        // Also update copyright string intelligently
        if (newData.footer?.copyright) {
            const year = new Date().getFullYear();
            // Handle different copyright formats
            if (newData.footer.copyright.includes('All Rights Reserved')) {
              newData.footer.copyright = `© ${year} ${newValue}. All Rights Reserved`;
            } else if (newData.footer.copyright.endsWith(',')) {
              newData.footer.copyright = `© ${year} ${newValue},`;
            } else {
              newData.footer.copyright = `© ${year} ${newValue}.`;
            }
        }
        return newData;
    });
  };
  // --- END: Sync handler ---

  const toggleAccordion = (id) => {
    const newActiveId = activeAccordion === id ? null : id;
    setActiveAccordion(newActiveId);

    if (newActiveId && businessData?.pages) {
        const homePage = businessData.pages.find(p => p.name.toLowerCase() === 'home');
        const homePath = homePage?.path || businessData.pages[0]?.path;
        let path = homePath;
        
        // Logic to jump to sections on the homepage
        // This is a simplified example; you might need to make this more robust
        // based on your data structure.
        const sectionIdMap = {
            'about': businessData.aboutSectionId || businessData.feature1?.title || 'story', // Fallback
            'collection': businessData.collectionSectionId || businessData.collection?.title || 'collection',
            'feature2': businessData.feature2SectionId || businessData.feature2?.title,
            'footer': businessData.footerSectionId || 'contact',
            'products': businessData.bestSellersSectionId || businessData.collectionSectionId || 'shop',
            'hero': 'home', // Special case for hero
            'cta': 'cta-final', // Added for blissly/avenix
            'stats': 'stats', // Added for avenix
            'blog': 'blogs' // Added for avenix
        };

        const sectionId = sectionIdMap[newActiveId];

        if (sectionId && sectionId !== 'home') {
            path = `${homePath}#${sectionId}`;
        } else if (newActiveId === 'products') {
            // If 'products' is clicked, try to find a 'shop' page
            const shopPage = businessData.pages.find(p => p.name.toLowerCase().includes('shop'));
            if (shopPage) {
                path = shopPage.path;
            } else if (sectionId) {
                path = `${homePath}#${sectionId}`; // Fallback to homepage section
            }
        } else {
            path = homePath; // Default to home
        }
        
        onPageChange(path);
    }
  };

  // --- Handlers for dynamic lists ---
  
  const handleAddCategory = (newCategoryName) => {
      if (!newCategoryName) return;
      const newCategory = { id: `c${Date.now()}`, name: newCategoryName };
      const newCategories = [...(businessData.categories || []), newCategory];
      handleDataChange('categories', newCategories);
  };

  const handleRemoveCategory = (categoryId) => {
      const newCategories = (businessData.categories || []).filter(c => c.id !== categoryId);
      handleDataChange('categories', newCategories);
      // Also update products that used this category
      const newProducts = (businessData.allProducts || []).map(p => {
          if (p.category === categoryId) return { ...p, category: "" };
          return p;
      });
      handleDataChange('allProducts', newProducts);
  };
  
  const handleAddProduct = () => {
      const newProduct = {
          id: Date.now(),
          name: "New Product",
          price: 9.99,
          category: businessData.categories?.[0]?.id || "",
          image: "https://placehold.co/600x750/CCCCCC/909090?text=New+Product",
          description: "A description for your new product."
      };
      const newProducts = [...(businessData.allProducts || []), newProduct];
      handleDataChange('allProducts', newProducts);
  };
  
  const handleRemoveProduct = (productId) => {
      const newProducts = (businessData.allProducts || []).filter(p => p.id !== productId);
      handleDataChange('allProducts', newProducts);
      // Also remove from homepage collections if it's there
      handleDataChange('collection.itemIDs', (businessData.collection?.itemIDs || []).filter(id => id !== productId));
      handleDataChange('bestSellers.itemIDs', (businessData.bestSellers?.itemIDs || []).filter(id => id !== productId));
      handleDataChange('newArrivals.itemIDs', (businessData.newArrivals?.itemIDs || []).filter(id => id !== productId));
      handleDataChange('featured.itemIDs', (businessData.featured?.itemIDs || []).filter(id => id !== productId));
      handleDataChange('specialty.itemIDs', (businessData.specialty?.itemIDs || []).filter(id => id !== productId));
      handleDataChange('menu.itemIDs', (businessData.menu?.itemIDs || []).filter(id => id !== productId));
  };
  
  // --- Dynamic property access ---
  // This makes the sidebar more generic and less prone to errors if a property doesn't exist
  const getSafe = (obj, path, defaultValue = '') => {
    return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue), obj);
  }

  // Memoize derived lists to prevent unnecessary re-renders
  const allProducts = useMemo(() => Array.isArray(businessData?.allProducts) ? businessData.allProducts : [], [businessData?.allProducts]);
  const allCategories = useMemo(() => Array.isArray(businessData?.categories) ? businessData.categories : [], [businessData?.categories]);
  
  const productOptions = useMemo(() => allProducts.map(p => ({ value: p.id, label: p.name })), [allProducts]);
  const categoryOptions = useMemo(() => allCategories.map(c => ({ value: c.id, label: c.name })), [allCategories]);
  
  const homepageProductIDs = useMemo(() => [
    ...getSafe(businessData, 'collection.itemIDs', []), 
    ...getSafe(businessData, 'bestSellers.itemIDs', []), 
    ...getSafe(businessData, 'newArrivals.itemIDs', []), 
    ...getSafe(businessData, 'featured.itemIDs', []),
    ...getSafe(businessData, 'specialty.itemIDs', []),
    ...getSafe(businessData, 'menu.itemIDs', [])
  ], [businessData]);

  const homepageProductOptions = useMemo(() => productOptions.filter(
      p => !homepageProductIDs.includes(p.value)
  ), [productOptions, homepageProductIDs]);

  // --- Props bundle to pass to child editors ---
  const editorProps = {
    businessData,
    handleDataChange,
    handleSyncedNameChange,
    toggleAccordion,
    activeAccordion,
    getSafe,
    productOptions,
    categoryOptions,
    homepageProductOptions,
    allCategories,
    allProducts,
    handleAddCategory,
    handleRemoveCategory,
    handleAddProduct,
    handleRemoveProduct
  };

  // --- RENDER FUNCTION ---
  const renderTemplateEditor = () => {
    switch (templateName) {
      case 'flara':
        return <FlaraEditor {...editorProps} />;
      case 'avenix':
        return <AvenixEditor {...editorProps} />;
      case 'blissly':
        return <BlisslyEditor {...editorProps} />;
      case 'flavornest':
        return <FlavornestEditor {...editorProps} />;
      default:
        // This is the error you are seeing.
        // It's likely because you are on a template URL (like /editor/xyz)
        // that we haven't created an editor component for yet.
        return <p className="p-4 text-sm text-gray-500">No editor available for this template.</p>;
    }
  };

  return (
    <div className="w-80 flex flex-col h-full bg-white">
      {/* Main Tab Navigation */}
      <div className="flex items-center border-b border-gray-200">
        <MainTab
          icon={LayoutDashboard}
          label="Website"
          isActive={activeTab === 'website'}
          onClick={() => onTabChange('website')}
        />
        <MainTab
          icon={Paintbrush} // <-- ICON CHANGED HERE
          label="Theme"
          isActive={activeTab === 'theme'}
          onClick={() => onTabChange('theme')}
        />
        <MainTab
          icon={Settings}
          label="Settings"
          isActive={activeTab === 'settings'}
          onClick={() => onTabChange('settings')}
        />
      </div>

      {/* Conditional Content Area */}
      <div className="flex-grow overflow-y-auto">
        
        {/* --- WEBSITE Panel (NOW DYNAMIC) --- */}
        {activeTab === 'website' && renderTemplateEditor()}

        {/* --- THEME Panel (SHARED) --- */}
        {activeTab === 'theme' && (
          <div className="p-4">
            <SectionTitle label="Color Palette" />
            
            <div className="grid grid-cols-2 gap-3">
              {colorPalettes.map((palette) => (
                <ColorSwatchButton
                  key={palette.class}
                  palette={palette}
                  isSelected={getSafe(businessData, 'theme.colorPalette') === palette.class}
                  onClick={() => handleDataChange('theme.colorPalette', palette.class)}
                />
              ))}
            </div>

            <SectionTitle label="Fonts" />
            <EditorSelect
              label="Heading Font"
              value={getSafe(businessData, 'theme.font.heading')}
              onChange={(e) => handleDataChange('theme.font.heading', e.target.value)}
              options={fontOptions}
              placeholder="Select a heading font"
            />
            <EditorSelect
              label="Body Font"
              value={getSafe(businessData, 'theme.font.body')}
              onChange={(e) => handleDataChange('theme.font.body', e.target.value)}
              options={fontOptions}
              placeholder="Select a body font"
            />
          </div>
        )}
        {/* --- END OF THEME Panel --- */}


        {/* SETTINGS Panel (SHARED) */}
        {activeTab === 'settings' && (
          <div className="p-4">
            <section>
              <SectionTitle label="Site Settings" />
              <p className="text-gray-600 text-sm">SEO, Domain, and other settings will go here.</p>
            </section>
            
            <section>
              <SectionTitle label="Store Management" />
              <div className="space-y-1">
                <SidebarLink icon={Store} label="Manage Store" onClick={() => {}} />
                <SidebarLink icon={Calendar} label="Manage Appointments" onClick={() => {}} />
                <SidebarLink icon={Tag} label="Manage Promotions" onClick={() => {}} />
                <SidebarLink icon={MessageCircle} label="Manage Chat" onClick={() => {}} />
                <SidebarLink icon={Contact} label="Manage Contacts" onClick={() => {}} />
              </div>
            </section>
          </div>
        )}

      </div>
      
    </div>
  );
}