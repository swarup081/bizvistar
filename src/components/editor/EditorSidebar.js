'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import {
  LayoutDashboard,
  Settings,
  Home,
  Store,
  Calendar,
  Tag,
  MessageCircle,
  Contact,
  Plus,
  FileText,
  Info,
  Image as ImageIcon,
  ShoppingBag,
  Pencil,
  ChevronDown,
  ChevronLeft, // Added
  CheckCircle,
  UploadCloud,
  Trash,
  Search,
  X,
  Columns,
  Paintbrush, // Changed from Palette
  Check,
  TrendingUp, // Added for Stats
  Megaphone, // Added for CTA
  MessageSquare, // Added for Reviews/Testimonials
  Menu, // Added Menu Icon
} from 'lucide-react';

// Hook to detect mobile view
const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 1024);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
};

// Reusable tab button
const MainTab = ({ icon: Icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center gap-1 w-full py-4 px-2 font-medium ${
      isActive
        ? 'border-b-2 border-[#8A63D2] text-[#8A63D2]'
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
        ? 'bg-[#8A63D2]/10 text-[#8A63D2]'
        : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
    }`}
  >
    <Icon size={18} /> {label}
  </button>
);

// Reusable section title
const SectionTitle = ({ label }) => (
  <div className="flex items-center justify-between mt-6 mb-3">
    <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
      {label}
    </h3>
  </div>
);

// --- UPDATED: EditorInput for "Instant Update" UI (updates on every keystroke) ---
// --- ADDED onFocus PROP ---
const EditorInput = ({ label, value, onChange, isRequired = false, onFocus }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {isRequired && <span className="text-red-500">*</span>}
      </label>
      <input
        type="text"
        value={value || ''} // The box shows the *real* data
        onChange={onChange} // This updates the real data on every keystroke
        onFocus={onFocus} // <-- ADDED
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A63D2] focus:border-transparent"
      />
    </div>
  );
};

// --- UPDATED: EditorTextArea for "Instant Update" UI (updates on every keystroke) ---
// --- ADDED onFocus PROP ---
const EditorTextArea = ({ label, value, onChange, onFocus }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <textarea
        value={value || ''} // The box shows the *real* data
        onChange={onChange} // This updates the real data on every keystroke
        onFocus={onFocus} // <-- ADDED
        rows={3}
        className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A63D2] focus:border-transparent resize-none"
      />
    </div>
  );
};

// Custom Searchable Select Dropdown
// --- ADDED onFocus PROP ---
const EditorSelect = ({
  label,
  value,
  onChange,
  options = [],
  placeholder = 'Select an option',
  onFocus,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);

  const selectedOption = options.find((option) => option.value === value);
  const displayValue = selectedOption ? selectedOption.label : placeholder;

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (newValue) => {
    onChange({ target: { value: newValue } });
    setIsOpen(false);
    setSearchTerm('');
  };

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (onFocus) onFocus(); // <-- Trigger focus on open
  };

  return (
    <div className="mb-4" ref={dropdownRef}>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <button
          type="button"
          onClick={handleOpen} // <-- Use custom open handler
          className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A63D2] focus:border-transparent flex justify-between items-center"
        >
          <span className={selectedOption ? 'text-gray-900' : 'text-gray-500'}>
            {displayValue}
          </span>
          <ChevronDown
            size={16}
            className={`text-gray-400 transition-transform ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
          />
        </button>

        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden flex flex-col">
            <div className="p-2 border-b border-gray-200">
              <div className="relative">
                <Search
                  size={16}
                  className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search..."
                  className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#8A63D2]"
                />
              </div>
            </div>

            <ul className="overflow-y-auto flex-grow">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <li
                    key={option.value}
                    onClick={() => handleSelect(option.value)}
                    className={`px-3 py-2 text-sm cursor-pointer hover:bg-[#8A63D2]/10 hover:text-[#8A63D2] ${
                      option.value === value
                        ? 'bg-[#8A63D2]/10 text-[#8A63D2]'
                        : 'text-gray-900'
                    }`}
                  >
                    {option.label}
                  </li>
                ))
              ) : (
                <li className="px-3 py-2 text-sm text-gray-500">
                  No options found.
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

// Image Upload Control
// --- ADDED onFocus PROP ---
const EditorImageUpload = ({ label, value, onChange, onFocus }) => {
  const inputId = `file-upload-${label.replace(/\s+/g, '-')}`;

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ target: { value: reader.result } });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="flex items-center gap-2">
        <div className="w-12 h-12 rounded border border-gray-300 bg-gray-100 flex-shrink-0 flex items-center justify-center relative overflow-hidden">
          {value ? (
            <Image
              src={value}
              alt="Preview"
              className="object-cover rounded"
              fill
              sizes="48px"
            />
          ) : (
            <ImageIcon size={24} className="text-gray-400" />
          )}
        </div>
        <label
          htmlFor={inputId}
          className="cursor-pointer flex-grow px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 text-center"
          onClick={onFocus} // <-- ADDED
        >
          <span>Upload Image</span>
          <input
            id={inputId}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>
      </div>
    </div>
  );
};

// Generic List Editor
const EditorList = ({
  label,
  items = [],
  onUpdate,
  renderItem,
  onAdd,
  addButtonLabel = "Add Item"
}) => {
  const handleItemChange = (index, newItem) => {
    const newItems = [...items];
    newItems[index] = newItem;
    onUpdate(newItems);
  };

  const handleRemove = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdate(newItems);
  };

  return (
    <div className="mb-6">
      {label && <h4 className="text-base font-semibold text-gray-800 mb-2">{label}</h4>}
      <div className="space-y-3">
        {items.map((item, index) => (
            <div key={index} className="p-3 border rounded-md bg-white relative group">
                <button
                    onClick={() => handleRemove(index)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 z-10"
                >
                    <Trash size={16} />
                </button>
                {renderItem(item, index, (newItem) => handleItemChange(index, newItem))}
            </div>
        ))}
      </div>
      <button
        onClick={() => onUpdate([...items, onAdd()])}
        className="w-full mt-3 px-3 py-2 bg-[#8A63D2]/10 text-[#8A63D2] text-sm font-medium rounded-md hover:bg-[#8A63D2]/20 flex items-center justify-center gap-2"
      >
        <Plus size={16} /> {addButtonLabel}
      </button>
    </div>
  );
};

// Accordion UI
const AccordionItem = ({ title, icon: Icon, isOpen, onClick, children, isMobile, onCloseMobile }) => {
  const displayIcon = <Icon size={18} className="text-gray-500" />;

  // Mobile Drill Down Render
  if (isMobile && isOpen) {
      return (
          // We still render the trigger in the list (so it can be clicked to open), 
          // BUT the content renders in a portal-like overlay.
          // Wait, if it renders in the list, and the overlay covers the list, that's fine.
          // The return here replaces the list item in the DOM, so if we return full screen, 
          // the list item disappears and becomes full screen. That is one way.
          // OR we return a fragment: The list item + The overlay.
          // If we return just the overlay, the user loses context of the list (which is covered anyway).
          // But when they close, we need to return to the list.
          // React Re-render will handle that if isOpen becomes false.
          
          <div className="fixed inset-0 z-[80] bg-white flex flex-col animate-in slide-in-from-right duration-200">
              <div className="flex items-center gap-3 p-4 border-b bg-white shadow-sm shrink-0">
                  <button onClick={onCloseMobile} className="p-1 -ml-1">
                      <ChevronLeft className="text-gray-600" size={24} />
                  </button>
                  <div className="flex items-center gap-2">
                      <Icon size={20} className="text-[#8A63D2]" />
                      <span className="font-semibold text-lg text-gray-900">{title}</span>
                  </div>
              </div>
              <div className="flex-grow overflow-y-auto p-4 pb-24">
                  {children}
              </div>
          </div>
      );
  }

  return (
    <div className="border-b border-gray-200">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between p-4 text-left text-gray-800 hover:bg-gray-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          {displayIcon}
          <span className="font-medium">{title}</span>
        </div>
        {!isMobile && (
            <ChevronDown
            size={18}
            className={`text-gray-400 transition-transform ${
                isOpen ? 'rotate-180' : 'rotate-0'
            }`}
            />
        )}
      </button>
      {!isMobile && isOpen && (
        <div className="p-4 bg-[#8A63D2]/10 border-t border-gray-200">
          {children}
        </div>
      )}
    </div>
  );
};

// --- NEW: Color Swatch Button (from screenshot) ---
// This component is now simpler: no border, no name.
const ColorSwatchButton = ({ palette, isSelected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`block w-full text-left p-2 rounded-lg transition-all ${
      isSelected
        ? 'bg-[#8A63D2]/10' // Selected state background
        : 'bg-transparent hover:bg-gray-100' // Default and hover state
    }`}
  >
    {/* Grid of 5 swatches. */}
    <div className="grid grid-cols-5 h-12 w-full rounded-md overflow-hidden border border-gray-300">
      <div style={{ backgroundColor: palette.colors[0] }}></div>
      <div style={{ backgroundColor: palette.colors[1] }}></div>
      <div style={{ backgroundColor: palette.colors[2] }}></div>
      <div style={{ backgroundColor: palette.colors[3] }}></div>
      <div style={{ backgroundColor: palette.colors[4] }}></div>
    </div>
  </button>
);

// --- NEW: Font options (Must match names in layout.js) ---
const fontOptions = [
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Lora', label: 'Lora' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Playfair_Display', label: 'Playfair Display' },
  { value: 'Cormorant_Garamond', label: 'Cormorant Garamond' },
  { value: 'DM_Sans', label: 'DM Sans' },
  { value: 'Kalam', label: 'Kalam' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Inter', label: 'Inter' },
];

// --- NEW: Curated list of 8 color palettes (with 5 colors each) ---
export const colorPalettes = [
  {
    name: 'Sage Green',
    class: 'sage-green',
    colors: ['#F7F9F5', '#EBF2E8', '#A5D6A7', '#588157', '#344E41'],
  },
  {
    name: 'Elegant Botanics',
    class: 'elegant-botanics',
    colors: ['#FCFBF9', '#F4ECE8', '#B98B7F', '#8A9A8C', '#4B413E'],
  },
  {
    name: 'Avenix Minimal',
    class: 'avenix-minimal',
    colors: ['#F8F7F5', '#FFFFFF', '#D81B60', '#1A1A1A', '#000000'],
  },
  {
    name: 'Brewhaven Cream',
    class: 'brewhaven-cream',
    colors: ['#FBF9F3', '#F5EFE6', '#F5A623', '#8A6E63', '#4B4832'],
  },
  {
    name: 'Warm Bakery',
    class: 'warm-bakery',
    colors: ['#FFF8F2', '#F9EBE4', '#A14D2A', '#8D6E63', '#5D4037'],
  },
  {
    name: 'Dark Roast',
    class: 'dark-roast',
    colors: ['#F3EFE9', '#E4A757', '#3D2F28', '#211A16', '#000000'],
  },
  {
    name: 'Sky Blue',
    class: 'sky-blue',
    colors: ['#F0F9FF', '#E0F2FE', '#38bdf8', '#0284C7', '#075985'],
  },
  {
    name: 'Strawberry Cream',
    class: 'strawberry-cream',
    colors: ['#FFF7F9', '#FDE8EF', '#ec4899', '#D81B60', '#502D39'],
  },
];

export default function EditorSidebar({
  activeTab,
  onTabChange,
  businessData,
  setBusinessData, // This is handleDataUpdate from layout
  onPageChange,
  // --- ACCEPT NEW PROPS ---
  activeAccordion,
  onAccordionToggle,
  forceDesktop = false, // --- ADDED ---
  isLandingMode = false // <-- NEW PROP
}) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const isMobileHook = useIsMobile();
  const isMobile = forceDesktop ? false : isMobileHook;

  // Watch for external accordion changes (e.g. from iframe click) to auto-expand sheet on mobile
  // ONLY if it is a NEW interaction (activeAccordion changes to something not null)
  // We don't want it to open just because we resized to mobile.
  useEffect(() => {
    if (activeAccordion && isMobile) {
      setIsMobileExpanded(true);
      // We assume if a section is focused, we want the 'website' tab
      onTabChange('website');
    }
  }, [activeAccordion]); // Removed isMobile from deps to prevent auto-opening on resize

  const handleMobileTabChange = (tab) => {
    if (activeTab === tab && isMobileExpanded) {
        // Toggle off if clicking same tab? No, usually stays open.
        // Let's keep it open.
    }
    onTabChange(tab);
    setIsMobileExpanded(true);
  };

  const handleDataChange = (path, value) => {
    setBusinessData((prev) => {
      const keys = path.split('.');
      const newData = JSON.parse(JSON.stringify(prev));

      let current = newData;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = keys[i];
        if (current[key] === undefined || current[key] === null) {
          // Check if the next key is a number, to create an array if needed
          if (isFinite(keys[i + 1])) {
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
    setBusinessData((prev) => {
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

  // --- USE PROPS ---
  const toggleAccordion = (id) => {
    onAccordionToggle(id);
  };
  
  const handleSectionFocus = (id) => {
    if (!id || !businessData?.pages) return;

    const homePage = businessData.pages.find(
      (p) => p.name.toLowerCase() === 'home'
    );
    const homePath = homePage?.path || businessData.pages[0]?.path;
    let path = homePath;

    const sectionIdMap = {
      hero: 'home', 
      global: 'home',
      about: businessData.aboutSectionId || 'about',
      events: businessData.eventsSectionId || 'events',
      menu: businessData.menuSectionId || 'menu',
      testimonials: businessData.testimonialsSectionId || 'testimonials',
      collection:
        businessData.collectionSectionId ||
        businessData.bestSellersSectionId ||
        'collection',
      feature2: businessData.feature2SectionId || 'feature2',
      footer: businessData.footerSectionId || 'contact',
      products: 
        businessData.bestSellersSectionId || 
        businessData.collectionSectionId ||
        'shop',
      cta: businessData.ctaSectionId || 'cta',
      stats: businessData.statsSectionId || 'stats',
      blog: businessData.blogSectionId || 'blog',
      reviews: businessData.reviewsSectionId || 'reviews',
      specialty: businessData.specialtySectionId || 'specialty',
    };
    
    const sectionId = sectionIdMap[id];

    if (id === 'products') {
      const shopPage = businessData.pages.find(
        (p) => p.name.toLowerCase() === 'shop'
      );
      if (shopPage) {
        onPageChange(shopPage.path);
      }
    } else if (sectionId && sectionId !== 'home') {
      path = `${homePath}#${sectionId}`;
      onPageChange(path);
    } else if (sectionId === 'home') {
      onPageChange(homePath);
    }
  };
  // --- END OF REFACTOR ---


  // --- Handlers for dynamic lists ---

  const handleAddCategory = () => {
    if (!newCategoryName) return;
    const newCategory = { id: `c${Date.now()}`, name: newCategoryName };
    const newCategories = [...(businessData.categories || []), newCategory];
    handleDataChange('categories', newCategories);
    setNewCategoryName('');
  };

  const handleRemoveCategory = (categoryId) => {
    const newCategories = (businessData.categories || []).filter(
      (c) => c.id !== categoryId
    );
    handleDataChange('categories', newCategories);
    // Also update products that used this category
    const newProducts = (businessData.allProducts || []).map((p) => {
      if (p.category === categoryId) return { ...p, category: '' };
      return p;
    });
    handleDataChange('allProducts', newProducts);
  };

  const handleAddProduct = () => {
    const newProduct = {
      id: Date.now(),
      name: 'New Product',
      price: 9.99,
      category: businessData.categories?.[0]?.id || '',
      image: 'https://placehold.co/600x750/CCCCCC/909090?text=New+Product',
      description: 'A description for your new product.',
    };
    const newProducts = [...(businessData.allProducts || []), newProduct];
    handleDataChange('allProducts', newProducts);
  };

  const handleRemoveProduct = (productId) => {
    const newProducts = (businessData.allProducts || []).filter(
      (p) => p.id !== productId
    );
    handleDataChange('allProducts', newProducts);
    // Also remove from homepage collections if it's there
    handleDataChange(
      'collection.itemIDs',
      (businessData.collection?.itemIDs || []).filter((id) => id !== productId)
    );
    handleDataChange(
      'bestSellers.itemIDs',
      (businessData.bestSellers?.itemIDs || []).filter((id) => id !== productId)
    );
    handleDataChange(
      'newArrivals.itemIDs',
      (businessData.newArrivals?.itemIDs || []).filter((id) => id !== productId)
    );
    handleDataChange(
      'featured.itemIDs',
      (businessData.featured?.itemIDs || []).filter((id) => id !== productId)
    );
    handleDataChange(
      'specialty.itemIDs',
      (businessData.specialty?.itemIDs || []).filter((id) => id !== productId)
    );
    handleDataChange(
      'menu.itemIDs',
      (businessData.menu?.itemIDs || []).filter((id) => id !== productId)
    );
  };

  // --- Dynamic property access ---
  // This makes the sidebar more generic and less prone to errors if a property doesn't exist
  const getSafe = (obj, path, defaultValue = '') => {
    return path
      .split('.')
      .reduce(
        (acc, key) => (acc && acc[key] !== undefined ? acc[key] : defaultValue),
        obj
      );
  };

  const allProducts = Array.isArray(businessData?.allProducts)
    ? businessData.allProducts
    : [];
  const allCategories = Array.isArray(businessData?.categories)
    ? businessData.categories
    : [];

  const productOptions = allProducts.map((p) => ({ value: p.id, label: p.name }));
  const categoryOptions = allCategories.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const collectionIDs = getSafe(businessData, 'collection.itemIDs', []);
  const collectionsIDs = getSafe(businessData, 'collections.itemIDs', []); // Aurora plural
  const bestSellerIDs = getSafe(businessData, 'bestSellers.itemIDs', []);
  const newArrivalsIDs = getSafe(businessData, 'newArrivals.itemIDs', []);
  const featuredIDs = getSafe(businessData, 'featured.itemIDs', []);
  const specialtyIDs = getSafe(businessData, 'specialty.itemIDs', []);
  const menuIDs = getSafe(businessData, 'menu.itemIDs', []);

  // Create a combined list of all product IDs used on the homepage
  const homepageProductIDs = [
    ...collectionIDs,
    ...collectionsIDs,
    ...bestSellerIDs,
    ...newArrivalsIDs,
    ...featuredIDs,
    ...specialtyIDs,
    ...menuIDs,
  ];

  // Options for homepage sections should not include products already selected in *any* homepage section
  const homepageProductOptions = productOptions.filter(
    (p) => !homepageProductIDs.includes(p.value)
  );

  // Helper to render content (shared between Desktop and Mobile)
  const renderPanelContent = () => (
    <>
        {/* WEBSITE Panel */}
        {activeTab === 'website' && (
          <section>
            <AccordionItem
              title="Global Settings"
              icon={Info}
              isOpen={activeAccordion === 'global'}
              onClick={() => toggleAccordion('global')}
              isMobile={isMobile}
              onCloseMobile={() => toggleAccordion(null)}
            >
                {/* --- THIS IS THE FIX: FLARA INFO BAR EDIT --- */}
                {businessData?.infoBar !== undefined && (
                  <>
                    <EditorInput
                      label="Info Bar Text 1"
                      value={getSafe(businessData, 'infoBar.0')}
                      onChange={(e) =>
                        handleDataChange('infoBar.0', e.target.value)
                      }
                      onFocus={() => handleSectionFocus('global')}
                    />
                    <EditorInput
                      label="Info Bar Text 2"
                      value={getSafe(businessData, 'infoBar.1')}
                      onChange={(e) =>
                        handleDataChange('infoBar.1', e.target.value)
                      }
                      onFocus={() => handleSectionFocus('global')}
                    />
                    <EditorInput
                      label="Info Bar Text 3"
                      value={getSafe(businessData, 'infoBar.2')}
                      onChange={(e) =>
                        handleDataChange('infoBar.2', e.target.value)
                      }
                      onFocus={() => handleSectionFocus('global')}
                    />
                  </>
                )}
                {/* --- END FLARA INFO BAR --- */}
                {businessData?.announcementBar !== undefined && (
                  <EditorInput
                    label="Announcement Bar"
                    value={getSafe(businessData, 'announcementBar')}
                    onChange={(e) =>
                      handleDataChange('announcementBar', e.target.value)
                    }
                    onFocus={() => handleSectionFocus('global')}
                  />
                )}
                <EditorInput
                  label="Business Name"
                  value={getSafe(businessData, 'name')}
                  onChange={(e) => handleSyncedNameChange(e.target.value)}
                  onFocus={() => handleSectionFocus('global')}
                  isRequired={true}
                />
                <EditorInput
                  label="Logo Text"
                  value={getSafe(businessData, 'logoText')}
                  onChange={(e) => handleSyncedNameChange(e.target.value)}
                  onFocus={() => handleSectionFocus('global')}
                  isRequired={true}
                />
                <EditorInput
                  label="Contact Phone / WhatsApp"
                  value={getSafe(businessData, 'whatsappNumber')}
                  onChange={(e) =>
                    handleDataChange('whatsappNumber', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('global')}
                />
              </AccordionItem>

            {/* --- GENERIC HERO (for flara, blissly, flavornest, aurora, frostify) --- */}
            {businessData?.hero && (
              <AccordionItem
                title="Hero Section"
                icon={ImageIcon}
                isOpen={activeAccordion === 'hero'}
                onClick={() => toggleAccordion('hero')}
                isMobile={isMobile}
                onCloseMobile={() => toggleAccordion(null)}
              >
                {/* Frostify Specific Fields */}
                {businessData.hero.badge !== undefined && (
                  <EditorInput
                    label="Badge"
                    value={getSafe(businessData, 'hero.badge')}
                    onChange={(e) => handleDataChange('hero.badge', e.target.value)}
                    onFocus={() => handleSectionFocus('hero')}
                  />
                )}

                {/* Aurora Specific Fields */}
                {businessData.hero.titleLine1 !== undefined && (
                   <>
                      <EditorInput
                        label="Title Line 1"
                        value={getSafe(businessData, 'hero.titleLine1')}
                        onChange={(e) => handleDataChange('hero.titleLine1', e.target.value)}
                        onFocus={() => handleSectionFocus('hero')}
                      />
                       <EditorInput
                        label="Title Line 2"
                        value={getSafe(businessData, 'hero.titleLine2')}
                        onChange={(e) => handleDataChange('hero.titleLine2', e.target.value)}
                        onFocus={() => handleSectionFocus('hero')}
                      />
                      {/* Aurora Images */}
                      <EditorImageUpload
                        label="Main Image"
                        value={getSafe(businessData, 'hero.imageArch1')}
                        onChange={(e) => handleDataChange('hero.imageArch1', e.target.value)}
                        onFocus={() => handleSectionFocus('hero')}
                      />
                      <EditorImageUpload
                        label="Secondary Image (Stats)"
                        value={getSafe(businessData, 'hero.imageArch1_b')}
                        onChange={(e) => handleDataChange('hero.imageArch1_b', e.target.value)}
                        onFocus={() => handleSectionFocus('hero')}
                      />
                      <EditorImageUpload
                        label="Detail Image (Arch)"
                        value={getSafe(businessData, 'hero.imageSmallArch')}
                        onChange={(e) => handleDataChange('hero.imageSmallArch', e.target.value)}
                        onFocus={() => handleSectionFocus('hero')}
                      />
                   </>
                )}
                
                {/* Generic Title (if not Aurora) */}
                {businessData.hero.title !== undefined && (
                  <EditorInput
                    label="Title"
                    value={getSafe(businessData, 'hero.title')}
                    onChange={(e) => handleDataChange('hero.title', e.target.value)}
                    onFocus={() => handleSectionFocus('hero')}
                    isRequired={true}
                  />
                )}

                <EditorTextArea
                  label="Subtitle"
                  value={getSafe(businessData, 'hero.subtitle')}
                  onChange={(e) =>
                    handleDataChange('hero.subtitle', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('hero')}
                />
                <EditorInput
                  label="Button Text"
                  value={getSafe(businessData, 'hero.cta')}
                  onChange={(e) => handleDataChange('hero.cta', e.target.value)}
                  onFocus={() => handleSectionFocus('hero')}
                />
                {/* Generic Image (Primary) - Frostify uses image1, others use image */}
                {(businessData.hero.image !== undefined || businessData.hero.image1 !== undefined) && (
                  <EditorImageUpload
                    label="Hero Image 1"
                    value={getSafe(businessData, businessData.hero.image ? 'hero.image' : 'hero.image1')}
                    onChange={(e) =>
                      handleDataChange(businessData.hero.image ? 'hero.image' : 'hero.image1', e.target.value)
                    }
                    onFocus={() => handleSectionFocus('hero')}
                  />
                )}
                {/* Frostify Image 2 */}
                {businessData.hero.image2 !== undefined && (
                  <EditorImageUpload
                    label="Hero Image 2"
                    value={getSafe(businessData, 'hero.image2')}
                    onChange={(e) =>
                      handleDataChange('hero.image2', e.target.value)
                    }
                    onFocus={() => handleSectionFocus('hero')}
                  />
                )}
              </AccordionItem>
            )}

            {/* --- AVENIX HERO --- */}
            {businessData?.heelsHero && (
              <AccordionItem
                title="Hero Section"
                icon={ImageIcon}
                isOpen={activeAccordion === 'hero'}
                onClick={() => toggleAccordion('hero')}
                isMobile={isMobile}
                onCloseMobile={() => toggleAccordion(null)}
              >
                <EditorInput
                  label="Line 1"
                  value={getSafe(businessData, 'heelsHero.line1')}
                  onChange={(e) =>
                    handleDataChange('heelsHero.line1', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('hero')}
                />
                <EditorInput
                  label="Line 2 (Accent)"
                  value={getSafe(businessData, 'heelsHero.line2')}
                  onChange={(e) =>
                    handleDataChange('heelsHero.line2', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('hero')}
                />
                <EditorInput
                  label="Line 3"
                  value={getSafe(businessData, 'heelsHero.line3')}
                  onChange={(e) =>
                    handleDataChange('heelsHero.line3', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('hero')}
                />
                <EditorInput
                  label="Bent Text (Accent)"
                  value={getSafe(businessData, 'heelsHero.bentText')}
                  onChange={(e) =>
                    handleDataChange('heelsHero.bentText', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('hero')}
                />
                <EditorInput
                  label="Button Text"
                  value={getSafe(businessData, 'heelsHero.buttonText')}
                  onChange={(e) =>
                    handleDataChange('heelsHero.buttonText', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('hero')}
                />
                <EditorImageUpload
                  label="Hero Image"
                  value={getSafe(businessData, 'heelsHero.image')}
                  onChange={(e) =>
                    handleDataChange('heelsHero.image', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('hero')}
                />
              </AccordionItem>
            )}

            {/* --- FLARA ABOUT (feature1) --- */}
            {businessData?.feature1 && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="About Section (Feature 1)"
                  icon={Home}
                  isOpen={activeAccordion === 'about'}
                  onClick={() => toggleAccordion('about')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                  <EditorInput
                    label="Title"
                    value={getSafe(businessData, 'feature1.title')}
                    onChange={(e) =>
                      handleDataChange('feature1.title', e.target.value)
                    }
                    onFocus={() => handleSectionFocus('about')}
                  />
                  <EditorTextArea
                    label="Text"
                    value={getSafe(businessData, 'feature1.text')}
                    onChange={(e) =>
                      handleDataChange('feature1.text', e.target.value)
                    }
                    onFocus={() => handleSectionFocus('about')}
                  />
                  <EditorTextArea
                    label="Sub-text"
                    value={getSafe(businessData, 'feature1.subtext')}
                    onChange={(e) =>
                      handleDataChange('feature1.subtext', e.target.value)
                    }
                    onFocus={() => handleSectionFocus('about')}
                  />
                  <EditorImageUpload
                    label="About Image"
                    value={getSafe(businessData, 'feature1.image')}
                    onChange={(e) =>
                      handleDataChange('feature1.image', e.target.value)
                    }
                    onFocus={() => handleSectionFocus('about')}
                  />
                </AccordionItem>
              </div>
            )}

            {/* --- FROSTIFY SPECIALTIES --- */}
            {businessData?.specialties?.items && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="Specialties"
                  icon={CheckCircle}
                  isOpen={activeAccordion === 'specialties'}
                  onClick={() => toggleAccordion('specialties')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                  <EditorInput
                      label="Title"
                      value={getSafe(businessData, 'specialties.title')}
                      onChange={(e) => handleDataChange('specialties.title', e.target.value)}
                      onFocus={() => handleSectionFocus('specialties')}
                  />
                  <EditorList
                    items={businessData.specialties.items}
                    onUpdate={(newItems) => handleDataChange('specialties.items', newItems)}
                    onAdd={() => ({ title: 'New Specialty', icon: 'cake' })}
                    addButtonLabel="Add Specialty"
                    renderItem={(item, index, onChange) => (
                      <>
                        <EditorInput
                          label="Title"
                          value={item.title}
                          onChange={(e) => onChange({ ...item, title: e.target.value })}
                          onFocus={() => handleSectionFocus('specialties')}
                        />
                        <EditorInput
                          label="Icon Name"
                          value={item.icon}
                          onChange={(e) => onChange({ ...item, icon: e.target.value })}
                          onFocus={() => handleSectionFocus('specialties')}
                        />
                      </>
                    )}
                  />
                </AccordionItem>
              </div>
            )}

            {/* --- FROSTIFY GALLERY --- */}
            {businessData?.gallery && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="Gallery"
                  icon={ImageIcon}
                  isOpen={activeAccordion === 'gallery'}
                  onClick={() => toggleAccordion('gallery')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                  <EditorInput
                      label="Title"
                      value={getSafe(businessData, 'gallery.title')}
                      onChange={(e) => handleDataChange('gallery.title', e.target.value)}
                      onFocus={() => handleSectionFocus('gallery')}
                  />
                   <EditorList
                    items={businessData.gallery.items || []}
                    onUpdate={(newItems) => handleDataChange('gallery.items', newItems)}
                    onAdd={() => allProducts[0]?.id || 1}
                    addButtonLabel="Add Product to Gallery"
                    renderItem={(item, index, onChange) => (
                        <EditorSelect
                          label={`Product ${index + 1}`}
                          value={typeof item === 'object' ? item.id : item}
                          onChange={(e) => onChange(Number(e.target.value))}
                          options={productOptions}
                          placeholder="Select a product"
                          onFocus={() => handleSectionFocus('gallery')}
                      />
                    )}
                  />
                </AccordionItem>
              </div>
            )}

            {/* --- FROSTIFY TESTIMONIALS --- */}
            {businessData?.testimonials?.items && businessData.testimonials.items[0]?.image && (
               <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="Testimonials"
                  icon={MessageSquare}
                  isOpen={activeAccordion === 'testimonials'}
                  onClick={() => toggleAccordion('testimonials')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                  <EditorInput
                      label="Section Title"
                      value={getSafe(businessData, 'testimonials.title')}
                      onChange={(e) => handleDataChange('testimonials.title', e.target.value)}
                      onFocus={() => handleSectionFocus('testimonials')}
                  />
                  <EditorList
                    items={businessData.testimonials.items}
                    onUpdate={(newItems) => handleDataChange('testimonials.items', newItems)}
                    onAdd={() => ({ text: 'Delicious!', author: 'Happy Customer', image: 'https://placehold.co/100x100' })}
                    addButtonLabel="Add Testimonial"
                    renderItem={(item, index, onChange) => (
                      <>
                        <EditorTextArea
                          label="Text"
                          value={item.text}
                          onChange={(e) => onChange({ ...item, text: e.target.value })}
                          onFocus={() => handleSectionFocus('testimonials')}
                        />
                        <EditorInput
                          label="Author"
                          value={item.author}
                          onChange={(e) => onChange({ ...item, author: e.target.value })}
                          onFocus={() => handleSectionFocus('testimonials')}
                        />
                        <EditorImageUpload
                          label="Author Image"
                          value={item.image}
                          onChange={(e) => onChange({ ...item, image: e.target.value })}
                          onFocus={() => handleSectionFocus('testimonials')}
                        />
                      </>
                    )}
                  />
                </AccordionItem>
              </div>
             )}
            
            {/* --- AVENIX ABOUT --- */}
            {businessData?.about?.subheading && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="About Section"
                  icon={Home}
                  isOpen={activeAccordion === 'about'}
                  onClick={() => toggleAccordion('about')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                <EditorInput
                  label="Heading"
                  value={getSafe(businessData, 'about.heading')}
                  onChange={(e) =>
                    handleDataChange('about.heading', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('about')}
                />
                <EditorTextArea
                  label="Subheading Part 1"
                  value={getSafe(businessData, 'about.subheading.part1')}
                  onChange={(e) =>
                    handleDataChange('about.subheading.part1', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('about')}
                />
                <EditorTextArea
                  label="Subheading Part 2"
                  value={getSafe(businessData, 'about.subheading.part2')}
                  onChange={(e) =>
                    handleDataChange('about.subheading.part2', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('about')}
                />
                <EditorTextArea
                  label="Statement"
                  value={getSafe(businessData, 'about.statement')}
                  onChange={(e) =>
                    handleDataChange('about.statement', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('about')}
                />
                <EditorImageUpload
                  label="Large Image"
                  value={getSafe(businessData, 'about.largeImage')}
                  onChange={(e) =>
                    handleDataChange('about.largeImage', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('about')}
                />
              </AccordionItem>
              </div>
            )}

            {/* --- BLISSLY ABOUT --- */}
            {businessData?.about?.features && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="About Section"
                  icon={Home}
                  isOpen={activeAccordion === 'about'}
                  onClick={() => toggleAccordion('about')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                <EditorInput
                  label="Title"
                  value={getSafe(businessData, 'about.title')}
                  onChange={(e) =>
                    handleDataChange('about.title', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('about')}
                />
                <EditorTextArea
                  label="Text"
                  value={getSafe(businessData, 'about.text')}
                  onChange={(e) =>
                    handleDataChange('about.text', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('about')}
                />
                <EditorImageUpload
                  label="Image"
                  value={getSafe(businessData, 'about.image')}
                  onChange={(e) =>
                    handleDataChange('about.image', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('about')}
                />
                <EditorInput
                  label="Feature 1 Title"
                  value={getSafe(businessData, 'about.features.0.title')}
                  onChange={(e) =>
                    handleDataChange('about.features.0.title', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('about')}
                />
                <EditorTextArea
                  label="Feature 1 Text"
                  value={getSafe(businessData, 'about.features.0.text')}
                  onChange={(e) =>
                    handleDataChange('about.features.0.text', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('about')}
                />
                <EditorInput
                  label="Feature 2 Title"
                  value={getSafe(businessData, 'about.features.1.title')}
                  onChange={(e) =>
                    handleDataChange('about.features.1.title', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('about')}
                />
                <EditorTextArea
                  label="Feature 2 Text"
                  value={getSafe(businessData, 'about.features.1.text')}
                  onChange={(e) =>
                    handleDataChange('about.features.1.text', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('about')}
                />
              </AccordionItem>
              </div>
            )}

            {/* --- FLAVORNEST (SIMPLE) ABOUT --- */}
            {businessData?.about &&
              !businessData?.about?.subheading &&
              !businessData?.about?.features && (
                <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                  <AccordionItem
                    title="About Section"
                    icon={Home}
                    isOpen={activeAccordion === 'about'}
                    onClick={() => toggleAccordion('about')}
                    isMobile={isMobile}
                    onCloseMobile={() => toggleAccordion(null)}
                  >
                  <EditorInput
                    label="Title"
                    value={getSafe(businessData, 'about.title')}
                    onChange={(e) =>
                      handleDataChange('about.title', e.target.value)
                    }
                    onFocus={() => handleSectionFocus('about')}
                  />
                  <EditorTextArea
                    label="Text"
                    value={getSafe(businessData, 'about.text')}
                    onChange={(e) =>
                      handleDataChange('about.text', e.target.value)
                    }
                    onFocus={() => handleSectionFocus('about')}
                  />
                  {businessData.about.image !== undefined && (
                      <EditorImageUpload
                        label="Image"
                        value={getSafe(businessData, 'about.image')}
                        onChange={(e) =>
                          handleDataChange('about.image', e.target.value)
                        }
                        onFocus={() => handleSectionFocus('about')}
                      />
                  )}
                   {businessData.about.subtext !== undefined && (
                      <EditorTextArea
                        label="Subtext"
                        value={getSafe(businessData, 'about.subtext')}
                        onChange={(e) =>
                          handleDataChange('about.subtext', e.target.value)
                        }
                        onFocus={() => handleSectionFocus('about')}
                      />
                  )}
                </AccordionItem>
              </div>
              )}

            {/* --- AURORA FEATURES --- */}
            {businessData?.features && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="Features"
                  icon={CheckCircle}
                  isOpen={activeAccordion === 'features'}
                  onClick={() => toggleAccordion('features')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                  <EditorList
                    items={businessData.features}
                    onUpdate={(newItems) => handleDataChange('features', newItems)}
                    onAdd={() => ({ title: 'New Feature', text: 'Description', icon: 'star' })}
                    addButtonLabel="Add Feature"
                    renderItem={(item, index, onChange) => (
                      <>
                        <EditorInput
                          label="Title"
                          value={item.title}
                          onChange={(e) => onChange({ ...item, title: e.target.value })}
                          onFocus={() => handleSectionFocus('features')}
                        />
                        <EditorTextArea
                          label="Text"
                          value={item.text}
                          onChange={(e) => onChange({ ...item, text: e.target.value })}
                          onFocus={() => handleSectionFocus('features')}
                        />
                        <EditorInput
                          label="Icon Name"
                          value={item.icon}
                          onChange={(e) => onChange({ ...item, icon: e.target.value })}
                          onFocus={() => handleSectionFocus('features')}
                        />
                      </>
                    )}
                  />
                </AccordionItem>
              </div>
            )}

            {/* --- AURORA COLLECTIONS (Plural) --- */}
            {businessData?.collections && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="Collections"
                  icon={LayoutDashboard}
                  isOpen={activeAccordion === 'collection'}
                  onClick={() => toggleAccordion('collection')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                  <EditorInput
                    label="Title"
                    value={getSafe(businessData, 'collections.title')}
                    onChange={(e) => handleDataChange('collections.title', e.target.value)}
                    onFocus={() => handleSectionFocus('collection')}
                  />
                  <EditorTextArea
                    label="Subtitle"
                    value={getSafe(businessData, 'collections.subtitle')}
                    onChange={(e) => handleDataChange('collections.subtitle', e.target.value)}
                    onFocus={() => handleSectionFocus('collection')}
                  />
                  {(collectionsIDs || []).map((id, index) => (
                      <EditorSelect
                          key={`col-${index}`}
                          label={`Collection Slot ${index + 1}`}
                          value={id}
                          onChange={(e) => handleDataChange(`collections.itemIDs.${index}`, Number(e.target.value))}
                          options={[
                            ...productOptions.filter(p => p.value === id),
                            ...homepageProductOptions
                          ]}
                          placeholder="Select a product"
                          onFocus={() => handleSectionFocus('collection')}
                      />
                  ))}
                </AccordionItem>
              </div>
            )}

            {/* --- AURORA TESTIMONIALS --- */}
            {businessData?.testimonials?.items && businessData.testimonials.items[0]?.location && (
               <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="Testimonials"
                  icon={MessageSquare}
                  isOpen={activeAccordion === 'testimonials'}
                  onClick={() => toggleAccordion('testimonials')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                  <EditorInput
                      label="Section Title"
                      value={getSafe(businessData, 'testimonials.title')}
                      onChange={(e) => handleDataChange('testimonials.title', e.target.value)}
                      onFocus={() => handleSectionFocus('testimonials')}
                  />
                  <EditorList
                    items={businessData.testimonials.items}
                    onUpdate={(newItems) => handleDataChange('testimonials.items', newItems)}
                    onAdd={() => ({ quote: 'Great service!', author: 'Happy Customer', location: 'City, Country' })}
                    addButtonLabel="Add Testimonial"
                    renderItem={(item, index, onChange) => (
                      <>
                        <EditorTextArea
                          label="Quote"
                          value={item.quote}
                          onChange={(e) => onChange({ ...item, quote: e.target.value })}
                          onFocus={() => handleSectionFocus('testimonials')}
                        />
                        <EditorInput
                          label="Author"
                          value={item.author}
                          onChange={(e) => onChange({ ...item, author: e.target.value })}
                          onFocus={() => handleSectionFocus('testimonials')}
                        />
                        <EditorInput
                          label="Location"
                          value={item.location}
                          onChange={(e) => onChange({ ...item, location: e.target.value })}
                          onFocus={() => handleSectionFocus('testimonials')}
                        />
                      </>
                    )}
                  />
                </AccordionItem>
              </div>
             )}

            {/* --- AURORA FAQ --- */}
            {businessData?.faq?.questions && (
               <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="FAQ"
                  icon={MessageCircle}
                  isOpen={activeAccordion === 'faq'}
                  onClick={() => toggleAccordion('faq')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                  <EditorInput
                      label="Title"
                      value={getSafe(businessData, 'faq.title')}
                      onChange={(e) => handleDataChange('faq.title', e.target.value)}
                      onFocus={() => handleSectionFocus('faq')}
                  />
                  {businessData.faq.subtitle !== undefined && (
                      <EditorTextArea
                          label="Subtitle"
                          value={getSafe(businessData, 'faq.subtitle')}
                          onChange={(e) => handleDataChange('faq.subtitle', e.target.value)}
                          onFocus={() => handleSectionFocus('faq')}
                      />
                  )}
                  <EditorList
                    items={businessData.faq.questions}
                    onUpdate={(newItems) => handleDataChange('faq.questions', newItems)}
                    onAdd={() => ({ q: 'New Question?', a: 'Answer here.' })}
                    addButtonLabel="Add Question"
                    renderItem={(item, index, onChange) => (
                      <>
                        <EditorInput
                          label="Question"
                          value={item.q}
                          onChange={(e) => onChange({ ...item, q: e.target.value })}
                          onFocus={() => handleSectionFocus('faq')}
                        />
                        <EditorTextArea
                          label="Answer"
                          value={item.a}
                          onChange={(e) => onChange({ ...item, a: e.target.value })}
                          onFocus={() => handleSectionFocus('faq')}
                        />
                      </>
                    )}
                  />
                </AccordionItem>
              </div>
            )}

            {/* --- AURORA NEWSLETTER CTA --- */}
            {businessData?.newsletterCta && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="Newsletter"
                  icon={Megaphone}
                  isOpen={activeAccordion === 'cta'}
                  onClick={() => toggleAccordion('cta')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                  <EditorInput
                      label="Title"
                      value={getSafe(businessData, 'newsletterCta.title')}
                      onChange={(e) => handleDataChange('newsletterCta.title', e.target.value)}
                      onFocus={() => handleSectionFocus('cta')}
                  />
                  <EditorTextArea
                      label="Text"
                      value={getSafe(businessData, 'newsletterCta.text')}
                      onChange={(e) => handleDataChange('newsletterCta.text', e.target.value)}
                      onFocus={() => handleSectionFocus('cta')}
                  />
                  <EditorInput
                      label="Placeholder"
                      value={getSafe(businessData, 'newsletterCta.placeholder')}
                      onChange={(e) => handleDataChange('newsletterCta.placeholder', e.target.value)}
                      onFocus={() => handleSectionFocus('cta')}
                  />
                  <EditorInput
                      label="Button Text"
                      value={getSafe(businessData, 'newsletterCta.buttonText')}
                      onChange={(e) => handleDataChange('newsletterCta.buttonText', e.target.value)}
                      onFocus={() => handleSectionFocus('cta')}
                  />
                </AccordionItem>
              </div>
            )}

            {/* --- AURORA INSTAGRAM --- */}
            {businessData?.instagram && (
               <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="Instagram Feed"
                  icon={ImageIcon}
                  isOpen={activeAccordion === 'instagram'}
                  onClick={() => toggleAccordion('instagram')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                  <EditorInput
                      label="Title"
                      value={getSafe(businessData, 'instagram.title')}
                      onChange={(e) => handleDataChange('instagram.title', e.target.value)}
                      onFocus={() => handleSectionFocus('instagram')}
                  />
                  <EditorInput
                      label="Handle"
                      value={getSafe(businessData, 'instagram.handle')}
                      onChange={(e) => handleDataChange('instagram.handle', e.target.value)}
                      onFocus={() => handleSectionFocus('instagram')}
                  />
                  <h4 className="text-sm font-medium text-gray-700 mt-4 mb-2">Images</h4>
                  {(businessData.instagram.images || []).map((img, index) => (
                      <EditorImageUpload
                          key={index}
                          label={`Image ${index + 1}`}
                          value={img}
                          onChange={(e) => handleDataChange(`instagram.images.${index}`, e.target.value)}
                          onFocus={() => handleSectionFocus('instagram')}
                      />
                  ))}
                </AccordionItem>
              </div>
            )}

            {/* --- BLISSLY EVENTS --- */}
            {businessData?.events?.items && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="Events Section"
                  icon={Calendar}
                  isOpen={activeAccordion === 'events'}
                  onClick={() => toggleAccordion('events')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                <EditorInput
                  label="Section Title"
                  value={getSafe(businessData, 'events.title')}
                  onChange={(e) =>
                    handleDataChange('events.title', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('events')}
                />
                <EditorImageUpload
                  label="Event 1 Image"
                  value={getSafe(businessData, 'events.items.0.image')}
                  onChange={(e) =>
                    handleDataChange('events.items.0.image', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('events')}
                />
                <EditorInput
                  label="Event 1 Title"
                  value={getSafe(businessData, 'events.items.0.title')}
                  onChange={(e) =>
                    handleDataChange('events.items.0.title', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('events')}
                />
                <EditorTextArea
                  label="Event 1 Text"
                  value={getSafe(businessData, 'events.items.0.text')}
                  onChange={(e) =>
                    handleDataChange('events.items.0.text', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('events')}
                />
              </AccordionItem>
              </div>
            )}
            
            {/* --- BLISSLY MENU SECTION --- */}
            {businessData?.menu && businessData.menu.badge && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="Homepage Menu"
                  icon={Menu}
                  isOpen={activeAccordion === 'menu'}
                  onClick={() => toggleAccordion('menu')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                <EditorInput
                  label="Badge Text"
                  value={getSafe(businessData, 'menu.badge')}
                  onChange={(e) => handleDataChange('menu.badge', e.target.value)}
                  onFocus={() => handleSectionFocus('menu')}
                />
                <EditorInput
                  label="Section Title"
                  value={getSafe(businessData, 'menu.title')}
                  onChange={(e) => handleDataChange('menu.title', e.target.value)}
                  onFocus={() => handleSectionFocus('menu')}
                />
                <EditorTextArea
                  label="Section Description"
                  value={getSafe(businessData, 'menu.description')}
                  onChange={(e) => handleDataChange('menu.description', e.target.value)}
                  onFocus={() => handleSectionFocus('menu')}
                />
                <EditorInput
                  label="Button Text (CTA)"
                  value={getSafe(businessData, 'menu.cta')}
                  onChange={(e) => handleDataChange('menu.cta', e.target.value)}
                  onFocus={() => handleSectionFocus('menu')}
                />
                
                <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">
                  Menu Items (Display)
                </h4>
                <p className="text-xs text-gray-500 mb-3">
                  This list is for display on the homepage only.
                </p>

                {/* Iterate over the first 4 menu items for editing */}
                {[0, 1, 2, 3].map((index) => (
                  <div key={index} className="p-3 border rounded-md mb-2 bg-white">
                    <EditorInput
                      label={`Item ${index + 1} Name`}
                      value={getSafe(businessData, `menu.items.${index}.name`)}
                      onChange={(e) => handleDataChange(`menu.items.${index}.name`, e.target.value)}
                      onFocus={() => handleSectionFocus('menu')}
                    />
                    <EditorInput
                      label={`Item ${index + 1} Price`}
                      value={getSafe(businessData, `menu.items.${index}.price`)}
                      onChange={(e) => handleDataChange(`menu.items.${index}.price`, e.target.value)}
                      onFocus={() => handleSectionFocus('menu')}
                    />
                    <EditorTextArea
                      label={`Item ${index + 1} Description`}
                      value={getSafe(businessData, `menu.items.${index}.description`)}
                      onChange={(e) => handleDataChange(`menu.items.${index}.description`, e.target.value)}
                      onFocus={() => handleSectionFocus('menu')}
                    />
                  </div>
                ))}
              </AccordionItem>
              </div>
            )}
            {/* --- END BLISSLY MENU SECTION --- */}


            {/* --- FLARA FEATURE 2 --- */}
            {businessData?.feature2 && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="Feature Section 2"
                  icon={Columns}
                  isOpen={activeAccordion === 'feature2'}
                  onClick={() => toggleAccordion('feature2')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                <EditorInput
                  label="Title"
                  value={getSafe(businessData, 'feature2.title')}
                  onChange={(e) =>
                    handleDataChange('feature2.title', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('feature2')}
                />
                 <EditorTextArea
                  label="Text"
                  value={getSafe(businessData, 'feature2.text')}
                  onChange={(e) =>
                    handleDataChange('feature2.text', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('feature2')}
                />
                 <EditorTextArea
                  label="Sub-text"
                  value={getSafe(businessData, 'feature2.subtext')}
                  onChange={(e) =>
                    handleDataChange('feature2.subtext', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('feature2')}
                />
                 <EditorImageUpload
                  label="Image 1"
                  value={getSafe(businessData, 'feature2.image1')}
                  onChange={(e) =>
                    handleDataChange('feature2.image1', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('feature2')}
                />
                <EditorImageUpload
                  label="Image 2"
                  value={getSafe(businessData, 'feature2.image2')}
                  onChange={(e) =>
                    handleDataChange('feature2.image2', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('feature2')}
                />
              </AccordionItem>
              </div>
            )}
            
            {/* --- AVENIX CTA SECTION --- */}
            {businessData?.ctaSection && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="CTA Section"
                  icon={Megaphone}
                  isOpen={activeAccordion === 'cta'}
                  onClick={() => toggleAccordion('cta')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                <EditorInput
                  label="Title"
                  value={getSafe(businessData, 'ctaSection.title')}
                  onChange={(e) =>
                    handleDataChange('ctaSection.title', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('cta')}
                />
                <EditorTextArea
                  label="Text"
                  value={getSafe(businessData, 'ctaSection.text')}
                  onChange={(e) =>
                    handleDataChange('ctaSection.text', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('cta')}
                />
                <EditorInput
                  label="Button Text"
                  value={getSafe(businessData, 'ctaSection.cta')}
                  onChange={(e) =>
                    handleDataChange('ctaSection.cta', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('cta')}
                />
                <EditorImageUpload
                  label="Image"
                  value={getSafe(businessData, 'ctaSection.image')}
                  onChange={(e) =>
                    handleDataChange('ctaSection.image', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('cta')}
                />
              </AccordionItem>
              </div>
            )}

            {/* --- BLISSLY CTA SECTION --- */}
            {businessData?.cta && !businessData?.ctaSection && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="CTA Section"
                  icon={Megaphone}
                  isOpen={activeAccordion === 'cta'}
                  onClick={() => toggleAccordion('cta')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                <EditorInput
                  label="Title"
                  value={getSafe(businessData, 'cta.title')}
                  onChange={(e) =>
                    handleDataChange('cta.title', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('cta')}
                />
                <EditorTextArea
                  label="Text"
                  value={getSafe(businessData, 'cta.text')}
                  onChange={(e) =>
                    handleDataChange('cta.text', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('cta')}
                />
                <EditorInput
                  label="Button Text"
                  value={getSafe(businessData, 'cta.cta')}
                  onChange={(e) => handleDataChange('cta.cta', e.target.value)}
                  onFocus={() => handleSectionFocus('cta')}
                />
              </AccordionItem>
              </div>
            )}

            {/* --- AVENIX STATS SECTION --- */}
            {businessData?.stats && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="Stats Section"
                  icon={TrendingUp}
                  isOpen={activeAccordion === 'stats'}
                  onClick={() => toggleAccordion('stats')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                <EditorInput
                  label="Title"
                  value={getSafe(businessData, 'stats.title')}
                  onChange={(e) =>
                    handleDataChange('stats.title', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('stats')}
                />
                <EditorTextArea
                  label="Text"
                  value={getSafe(businessData, 'stats.text')}
                  onChange={(e) =>
                    handleDataChange('stats.text', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('stats')}
                />
                <EditorInput
                  label="Stat 1 Number"
                  value={getSafe(businessData, 'stats.items.0.number')}
                  onChange={(e) =>
                    handleDataChange('stats.items.0.number', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('stats')}
                />
                <EditorInput
                  label="Stat 1 Label"
                  value={getSafe(businessData, 'stats.items.0.label')}
                  onChange={(e) =>
                    handleDataChange('stats.items.0.label', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('stats')}
                />
                <EditorInput
                  label="Stat 2 Number"
                  value={getSafe(businessData, 'stats.items.1.number')}
                  onChange={(e) =>
                    handleDataChange('stats.items.1.number', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('stats')}
                />
                <EditorInput
                  label="Stat 2 Label"
                  value={getSafe(businessData, 'stats.items.1.label')}
                  onChange={(e) =>
                    handleDataChange('stats.items.1.label', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('stats')}
                />
              </AccordionItem>
              </div>
            )}

            {/* --- BLISSLY TESTIMONIALS --- */}
            {businessData?.testimonials?.items && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="Testimonials Section"
                  icon={MessageSquare}
                  isOpen={activeAccordion === 'testimonials'}
                  onClick={() => toggleAccordion('testimonials')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                <EditorTextArea
                  label="Testimonial 1 Quote"
                  value={getSafe(businessData, 'testimonials.items.0.quote')}
                  onChange={(e) =>
                    handleDataChange(
                      'testimonials.items.0.quote',
                      e.target.value
                    )
                  }
                  onFocus={() => handleSectionFocus('testimonials')}
                />
                <EditorInput
                  label="Testimonial 1 Name"
                  value={getSafe(businessData, 'testimonials.items.0.name')}
                  onChange={(e) =>
                    handleDataChange(
                      'testimonials.items.0.name',
                      e.target.value
                    )
                  }
                  onFocus={() => handleSectionFocus('testimonials')}
                />
                <EditorInput
                  label="Testimonial 1 Title"
                  value={getSafe(businessData, 'testimonials.items.0.title')}
                  onChange={(e) =>
                    handleDataChange(
                      'testimonials.items.0.title',
                      e.target.value
                    )
                  }
                  onFocus={() => handleSectionFocus('testimonials')}
                />
              </AccordionItem>
              </div>
            )}

            {/* --- FLAVORNEST REVIEWS --- */}
            {businessData?.reviews?.items && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="Reviews Section"
                  icon={MessageSquare}
                  isOpen={activeAccordion === 'reviews'}
                  onClick={() => toggleAccordion('reviews')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                <EditorInput
                  label="Section Title"
                  value={getSafe(businessData, 'reviews.title')}
                  onChange={(e) =>
                    handleDataChange('reviews.title', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('reviews')}
                />
                <EditorTextArea
                  label="Review 1 Text"
                  value={getSafe(businessData, 'reviews.items.0.text')}
                  onChange={(e) =>
                    handleDataChange('reviews.items.0.text', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('reviews')}
                />
                <EditorInput
                  label="Review 1 Author"
                  value={getSafe(businessData, 'reviews.items.0.author')}
                  onChange={(e) =>
                    handleDataChange('reviews.items.0.author', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('reviews')}
                />
              </AccordionItem>
              </div>
            )}

            <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
              <AccordionItem
                title="Products & Categories"
                icon={ShoppingBag}
                isOpen={activeAccordion === 'products'}
                onClick={() => toggleAccordion('products')}
                isMobile={isMobile}
                onCloseMobile={() => toggleAccordion(null)}
              >
                {/* --- CATEGORY MANAGER --- */}
                <h4 className="text-base font-semibold text-gray-800 mb-2">Categories</h4>
                {allCategories.map((category, index) => (
                    <div key={category.id} className="flex items-end gap-2">
                        <EditorInput
                            label={`Category ${index + 1}`}
                            value={category.name}
                            onChange={(e) => handleDataChange(`categories.${index}.name`, e.target.value)}
                            onFocus={() => handleSectionFocus('products')}
                        />
                        <button 
                            onClick={() => handleRemoveCategory(category.id)}
                            className="mb-4 p-2 text-gray-400 hover:text-red-500"
                        >
                            <Trash size={16} />
                        </button>
                    </div>
                ))}
                <div className="flex gap-2 mb-6">
                    <input
                        type="text"
                        placeholder="New category name..."
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        onFocus={() => handleSectionFocus('products')}
                        className="flex-grow px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#8A63D2]"
                    />
                    <button
                        onClick={handleAddCategory}
                        className="flex-shrink-0 px-3 py-2 bg-[#8A63D2] text-white text-sm font-medium rounded-md hover:bg-[#7c59bd]"
                    >
                        Add
                    </button>
                </div>
                
                {/* --- PRODUCT MANAGER --- */}
                <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">All Products</h4>
                {allProducts.map((product, index) => (
                    <div key={product.id || index} className="p-3 border rounded-md mb-2 bg-white relative">
                        <button 
                            onClick={() => handleRemoveProduct(product.id)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                        >
                            <Trash size={16} />
                        </button>
                        <EditorInput
                            label={`Product ${index + 1} Name`}
                            value={product.name}
                            onChange={(e) => handleDataChange(`allProducts.${index}.name`, e.target.value)}
                            onFocus={() => handleSectionFocus('products')}
                        />
                        <EditorInput
                            label={`Price`}
                            value={product.price}
                            onChange={(e) => handleDataChange(`allProducts.${index}.price`, Number(e.target.value) || 0)}
                            onFocus={() => handleSectionFocus('products')}
                        />
                        <EditorSelect
                            label="Category"
                            value={product.category}
                            onChange={(e) => handleDataChange(`allProducts.${index}.category`, e.target.value)}
                            options={categoryOptions}
                            placeholder="Select a category"
                            onFocus={() => handleSectionFocus('products')}
                        />
                        <EditorImageUpload
                            label={`Image`}
                            value={product.image}
                            onChange={(e) => handleDataChange(`allProducts.${index}.image`, e.target.value)}
                            onFocus={() => handleSectionFocus('products')}
                        />
                    </div>
                ))}
                <button
                    onClick={handleAddProduct}
                    className="w-full mt-2 px-3 py-2 bg-[#8A63D2] text-white text-sm font-medium rounded-md hover:bg-[#7c59bd]"
                >
                    Add New Product
                </button>
            </AccordionItem>
            </div>
            
            {/* --- GENERIC HOMEPAGE COLLECTION MANAGER --- */}
            {(homepageProductIDs.length > 0 || businessData?.menu?.itemIDs) && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="Home Page Collections"
                  icon={LayoutDashboard}
                  isOpen={activeAccordion === 'collection'}
                  onClick={() => toggleAccordion('collection')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                <p className="text-xs text-gray-500 mb-3">
                  Select the products to feature on your homepage.
                </p>

                {/* --- FLARA: collection --- */}
                {businessData?.collection && (
                  <>
                    <h4 className="text-base font-semibold text-gray-800 mb-2">
                      "Our Collection" Section
                    </h4>
                    {collectionIDs.map((id, index) => (
                      <EditorSelect
                          key={`coll-${index}`}
                          label={`Collection Slot ${index + 1}`}
                          value={id}
                          onChange={(e) => handleDataChange(`collection.itemIDs.${index}`, Number(e.target.value))}
                          options={[
                            ...productOptions.filter(p => p.value === id), 
                            ...homepageProductOptions
                          ]} // Show current + available
                          placeholder="Select a product"
                          onFocus={() => handleSectionFocus('collection')}
                      />
                    ))}
                  </>
                )}

                {/* --- FLARA: bestSellers --- */}
                {businessData?.bestSellers && (
                  <>
                    <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">
                      "Best Sellers" Section
                    </h4>
                    {bestSellerIDs.map((id, index) => (
                      <EditorSelect
                          key={`best-${index}`}
                          label={`Best Seller Slot ${index + 1}`}
                          value={id}
                          onChange={(e) => handleDataChange(`bestSellers.itemIDs.${index}`, Number(e.target.value))}
                          options={[
                            ...productOptions.filter(p => p.value === id), 
                            ...homepageProductOptions
                          ]}
                          placeholder="Select a product"
                          onFocus={() => handleSectionFocus('products')}
                      />
                    ))}
                  </>
                )}
                
                {/* --- AVENIX: newArrivals --- */}
                {businessData?.newArrivals && (
                  <>
                    <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">
                      "New Arrivals" Section
                    </h4>
                    <EditorInput
                      label="Section Heading"
                      value={getSafe(businessData, 'newArrivals.heading')}
                      onChange={(e) => handleDataChange('newArrivals.heading', e.target.value)}
                      onFocus={() => handleSectionFocus('products')}
                    />
                    <EditorInput
                      label="Section Title"
                      value={getSafe(businessData, 'newArrivals.title')}
                      onChange={(e) => handleDataChange('newArrivals.title', e.target.value)}
                      onFocus={() => handleSectionFocus('products')}
                    />
                    {newArrivalsIDs.map((id, index) => (
                      <EditorSelect
                          key={`new-${index}`}
                          label={`New Arrival Slot ${index + 1}`}
                          value={id}
                          onChange={(e) => handleDataChange(`newArrivals.itemIDs.${index}`, Number(e.target.value))}
                          options={[
                            ...productOptions.filter(p => p.value === id), 
                            ...homepageProductOptions
                          ]}
                          placeholder="Select a product"
                          onFocus={() => handleSectionFocus('products')}
                      />
                    ))}
                  </>
                )}
                
                {/* --- AVENIX: featured --- */}
                {businessData?.featured && (
                  <>
                    <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">
                      "Featured Products" Section
                    </h4>
                     <EditorInput
                      label="Section Heading"
                      value={getSafe(businessData, 'featured.sectionHeading')}
                      onChange={(e) => handleDataChange('featured.sectionHeading', e.target.value)}
                      onFocus={() => handleSectionFocus('collection')}
                    />
                    <EditorInput
                      label="Section Title"
                      value={getSafe(businessData, 'featured.title')}
                      onChange={(e) => handleDataChange('featured.title', e.target.value)}
                      onFocus={() => handleSectionFocus('collection')}
                    />
                    <EditorImageUpload
                      label="Large Image"
                      value={getSafe(businessData, 'featured.largeImage')}
                      onChange={(e) => handleDataChange('featured.largeImage', e.target.value)}
                      onFocus={() => handleSectionFocus('collection')}
                    />
                    {featuredIDs.map((id, index) => (
                      <EditorSelect
                          key={`feat-${index}`}
                          label={`Featured Slot ${index + 1}`}
                          value={id}
                          onChange={(e) => handleDataChange(`featured.itemIDs.${index}`, Number(e.target.value))}
                          options={[
                            ...productOptions.filter(p => p.value === id), 
                            ...homepageProductOptions
                          ]}
                          placeholder="Select a product"
                          onFocus={() => handleSectionFocus('collection')}
                      />
                    ))}
                  </>
                )}

                {/* --- BLISSLY: specialty --- */}
                {businessData?.specialty && (
                  <>
                    <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">
                      "Our Specialty" Section
                    </h4>
                    <EditorInput
                      label="Section Title"
                      value={getSafe(businessData, 'specialty.title')}
                      onChange={(e) =>
                        handleDataChange('specialty.title', e.target.value)
                      }
                      onFocus={() => handleSectionFocus('specialty')}
                    />
                    {specialtyIDs.map((id, index) => (
                      <EditorSelect
                        key={`spec-${index}`}
                        label={`Specialty Slot ${index + 1}`}
                        value={id}
                        onChange={(e) =>
                          handleDataChange(
                            `specialty.itemIDs.${index}`,
                            Number(e.target.value)
                          )
                        }
                        options={[
                          ...productOptions.filter((p) => p.value === id),
                          ...homepageProductOptions,
                        ]}
                        placeholder="Select a product"
                        onFocus={() => handleSectionFocus('specialty')}
                      />
                    ))}
                  </>
                )}

                {/* --- FLAVORNEST: menu --- */}
                {businessData?.menu?.itemIDs && (
                  <>
                    <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">
                      "Signature Menu" Section
                    </h4>
                    <EditorInput
                      label="Section Title"
                      value={getSafe(businessData, 'menu.title')}
                      onChange={(e) =>
                        handleDataChange('menu.title', e.target.value)
                      }
                      onFocus={() => handleSectionFocus('menu')}
                    />
                    {menuIDs.map((id, index) => (
                      <EditorSelect
                        key={`menu-${index}`}
                        label={`Menu Slot ${index + 1}`}
                        value={id}
                        onChange={(e) =>
                          handleDataChange(
                            `menu.itemIDs.${index}`,
                            Number(e.target.value)
                          )
                        }
                        options={[
                          ...productOptions.filter((p) => p.value === id),
                          ...homepageProductOptions,
                        ]}
                        placeholder="Select a product"
                        onFocus={() => handleSectionFocus('menu')}
                      />
                    ))}
                  </>
                )}
              </AccordionItem>
              </div>
            )}
            
            {/* --- THIS IS THE FIX: AVENIX BLOG --- */}
            {businessData?.blog?.heading && businessData?.blog?.items?.[0]?.category && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="Blog Section (Avenix)"
                  icon={Pencil}
                  isOpen={activeAccordion === 'blog'}
                  onClick={() => toggleAccordion('blog')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                <EditorInput
                  label="Section Heading"
                  value={getSafe(businessData, 'blog.heading')}
                  onChange={(e) =>
                    handleDataChange('blog.heading', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('blog')}
                />
                <EditorInput
                  label="Section Title"
                  value={getSafe(businessData, 'blog.title')}
                  onChange={(e) =>
                    handleDataChange('blog.title', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('blog')}
                />
                
                {/* Post 1 */}
                <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">
                  Blog Post 1
                </h4>
                <div className="p-3 border rounded-md mb-2 bg-white">
                  <EditorInput
                    label="Post 1 Title"
                    value={getSafe(businessData, 'blog.items.0.title')}
                    onChange={(e) => handleDataChange('blog.items.0.title', e.target.value)}
                    onFocus={() => handleSectionFocus('blog')}
                  />
                  <EditorInput
                    label="Post 1 Date"
                    value={getSafe(businessData, 'blog.items.0.date')}
                    onChange={(e) => handleDataChange('blog.items.0.date', e.target.value)}
                    onFocus={() => handleSectionFocus('blog')}
                  />
                  <EditorInput
                    label="Post 1 Category"
                    value={getSafe(businessData, 'blog.items.0.category')}
                    onChange={(e) => handleDataChange('blog.items.0.category', e.target.value)}
                    onFocus={() => handleSectionFocus('blog')}
                  />
                  <EditorImageUpload
                    label="Post 1 Image"
                    value={getSafe(businessData, 'blog.items.0.image')}
                    onChange={(e) => handleDataChange('blog.items.0.image', e.target.value)}
                    onFocus={() => handleSectionFocus('blog')}
                  />
                </div>
                
                {/* Post 2 */}
                <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">
                  Blog Post 2
                </h4>
                <div className="p-3 border rounded-md mb-2 bg-white">
                  <EditorInput
                    label="Post 2 Title"
                    value={getSafe(businessData, 'blog.items.1.title')}
                    onChange={(e) => handleDataChange('blog.items.1.title', e.target.value)}
                    onFocus={() => handleSectionFocus('blog')}
                  />
                  <EditorInput
                    label="Post 2 Date"
                    value={getSafe(businessData, 'blog.items.1.date')}
                    onChange={(e) => handleDataChange('blog.items.1.date', e.target.value)}
                    onFocus={() => handleSectionFocus('blog')}
                  />
                  <EditorInput
                    label="Post 2 Category"
                    value={getSafe(businessData, 'blog.items.1.category')}
                    onChange={(e) => handleDataChange('blog.items.1.category', e.target.value)}
                    onFocus={() => handleSectionFocus('blog')}
                  />
                  <EditorImageUpload
                    label="Post 2 Image"
                    value={getSafe(businessData, 'blog.items.1.image')}
                    onChange={(e) => handleDataChange('blog.items.1.image', e.target.value)}
                    onFocus={() => handleSectionFocus('blog')}
                  />
                </div>
              </AccordionItem>
              </div>
            )}
            
            {/* --- THIS IS THE FIX: FLARA BLOG --- */}
            {businessData?.blog?.title && businessData?.blog?.items?.[0]?.text && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="Blog Section (Flara)"
                  icon={Pencil}
                  isOpen={activeAccordion === 'blog'}
                  onClick={() => toggleAccordion('blog')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                <EditorInput
                  label="Section Title"
                  value={getSafe(businessData, 'blog.title')}
                  onChange={(e) =>
                    handleDataChange('blog.title', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('blog')}
                />

                {[0, 1, 2, 3].map((index) => (
                  <div key={index}>
                    <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">
                      Blog Post {index + 1}
                    </h4>
                    <div className="p-3 border rounded-md mb-2 bg-white">
                      <EditorInput
                        label={`Post ${index + 1} Date`}
                        value={getSafe(businessData, `blog.items.${index}.date`)}
                        onChange={(e) => handleDataChange(`blog.items.${index}.date`, e.target.value)}
                        onFocus={() => handleSectionFocus('blog')}
                      />
                      <EditorInput
                        label={`Post ${index + 1} Title`}
                        value={getSafe(businessData, `blog.items.${index}.title`)}
                        onChange={(e) => handleDataChange(`blog.items.${index}.title`, e.target.value)}
                        onFocus={() => handleSectionFocus('blog')}
                      />
                      <EditorTextArea
                        label={`Post ${index + 1} Text`}
                        value={getSafe(businessData, `blog.items.${index}.text`)}
                        onChange={(e) => handleDataChange(`blog.items.${index}.text`, e.target.value)}
                        onFocus={() => handleSectionFocus('blog')}
                      />
                      <EditorImageUpload
                        label={`Post ${index + 1} Image`}
                        value={getSafe(businessData, `blog.items.${index}.image`)}
                        onChange={(e) => handleDataChange(`blog.items.${index}.image`, e.target.value)}
                        onFocus={() => handleSectionFocus('blog')}
                      />
                    </div>
                  </div>
                ))}
              </AccordionItem>
              </div>
            )}
            {/* --- END OF BLOG FIX --- */}


            {/* --- FLARA FOOTER --- */}
            {businessData?.footer?.links?.about && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="Footer"
                  icon={FileText}
                  isOpen={activeAccordion === 'footer'}
                  onClick={() => toggleAccordion('footer')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                <h4 className="text-base font-semibold text-gray-800 mb-2">
                  "About" Links
                </h4>
                <EditorInput
                  label="Link 1 Title"
                  value={getSafe(businessData, 'footer.links.about.0.name')}
                  onChange={(e) =>
                    handleDataChange(
                      'footer.links.about.0.name',
                      e.target.value
                    )
                  }
                  onFocus={() => handleSectionFocus('footer')}
                />

                <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">
                  "Categories" Links
                </h4>
                <EditorInput
                  label="Link 1 Title"
                  value={getSafe(
                    businessData,
                    'footer.links.categories.0.name'
                  )}
                  onChange={(e) =>
                    handleDataChange(
                      'footer.links.categories.0.name',
                      e.target.value
                    )
                  }
                  onFocus={() => handleSectionFocus('footer')}
                />

                <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">
                  "Get Help" Links
                </h4>
                <EditorInput
                  label="Link 1 Title"
                  value={getSafe(businessData, 'footer.links.getHelp.0.name')}
                  onChange={(e) =>
                    handleDataChange(
                      'footer.links.getHelp.0.name',
                      e.target.value
                    )
                  }
                  onFocus={() => handleSectionFocus('footer')}
                />
              </AccordionItem>
              </div>
            )}

            {/* --- AVENIX FOOTER --- */}
            {businessData?.footer?.description && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="Footer"
                  icon={FileText}
                  isOpen={activeAccordion === 'footer'}
                  onClick={() => toggleAccordion('footer')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">
                  Footer Content
                </h4>
                <EditorInput
                  label="Footer Description"
                  value={getSafe(businessData, 'footer.description')}
                  onChange={(e) =>
                    handleDataChange('footer.description', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('footer')}
                />
                <EditorInput
                  label="Contact Phone"
                  value={getSafe(businessData, 'footer.contact.phone')}
                  onChange={(e) =>
                    handleDataChange('footer.contact.phone', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('footer')}
                />
                <EditorInput
                  label="Contact Email"
                  value={getSafe(businessData, 'footer.contact.email')}
                  onChange={(e) =>
                    handleDataChange('footer.contact.email', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('footer')}
                />
                <EditorInput
                  label="Contact Address"
                  value={getSafe(businessData, 'footer.contact.address')}
                  onChange={(e) =>
                    handleDataChange('footer.contact.address', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('footer')}
                />
                <EditorInput
                  label="Subscribe Title"
                  value={getSafe(businessData, 'footer.subscribe.title')}
                  onChange={(e) =>
                    handleDataChange('footer.subscribe.title', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('footer')}
                />
              </AccordionItem>
              </div>
            )}

            {/* --- BLISSLY FOOTER --- */}
            {businessData?.footer?.promoTitle && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="Footer"
                  icon={FileText}
                  isOpen={activeAccordion === 'footer'}
                  onClick={() => toggleAccordion('footer')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                <EditorInput
                  label="Promo Title"
                  value={getSafe(businessData, 'footer.promoTitle')}
                  onChange={(e) =>
                    handleDataChange('footer.promoTitle', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('footer')}
                />
                <EditorInput
                  label="Contact Phone"
                  value={getSafe(businessData, 'footer.contact.phone')}
                  onChange={(e) =>
                    handleDataChange('footer.contact.phone', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('footer')}
                />
                <EditorInput
                  label="Contact Email"
                  value={getSafe(businessData, 'footer.contact.email')}
                  onChange={(e) =>
                    handleDataChange('footer.contact.email', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('footer')}
                />
                <EditorInput
                  label="Page Link 1"
                  value={getSafe(businessData, 'footer.links.pages.0.name')}
                  onChange={(e) =>
                    handleDataChange(
                      'footer.links.pages.0.name',
                      e.target.value
                    )
                  }
                  onFocus={() => handleSectionFocus('footer')}
                />
                <EditorInput
                  label="Utility Link 1"
                  value={getSafe(businessData, 'footer.links.utility.0.name')}
                  onChange={(e) =>
                    handleDataChange(
                      'footer.links.utility.0.name',
                      e.target.value
                    )
                  }
                  onFocus={() => handleSectionFocus('footer')}
                />
                <EditorInput
                  label="Location Title"
                  value={getSafe(businessData, 'footer.location.title')}
                  onChange={(e) =>
                    handleDataChange('footer.location.title', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('footer')}
                />
                <EditorTextArea
                  label="Location Address"
                  value={getSafe(businessData, 'footer.location.address')}
                  onChange={(e) =>
                    handleDataChange(
                      'footer.location.address',
                      e.target.value
                    )
                  }
                  onFocus={() => handleSectionFocus('footer')}
                />
                <EditorTextArea
                  label="Opening Hours"
                  value={getSafe(businessData, 'footer.location.hours')}
                  onChange={(e) =>
                    handleDataChange('footer.location.hours', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('footer')}
                />
              </AccordionItem>
              </div>
            )}

            {/* --- FLAVORNEST FOOTER --- */}
            {businessData?.footer?.madeBy && (
              <div title={isLandingMode ? "Just a demo" : ""} className={isLandingMode ? "opacity-50 pointer-events-none" : ""}>
                <AccordionItem
                  title="Footer"
                  icon={FileText}
                  isOpen={activeAccordion === 'footer'}
                  onClick={() => toggleAccordion('footer')}
                  isMobile={isMobile}
                  onCloseMobile={() => toggleAccordion(null)}
                >
                <EditorInput
                  label="Made By Text"
                  value={getSafe(businessData, 'footer.madeBy')}
                  onChange={(e) =>
                    handleDataChange('footer.madeBy', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('footer')}
                />
                <EditorInput
                  label="Social Text"
                  value={getSafe(businessData, 'footer.socialText')}
                  onChange={(e) =>
                    handleDataChange('footer.socialText', e.target.value)
                  }
                  onFocus={() => handleSectionFocus('footer')}
                />
                <p className="text-xs text-gray-500 mt-4">
                  Copyright is updated automatically with your business name.
                </p>
              </AccordionItem>
              </div>
            )}
          </section>
        )}

        {/* --- THEME Panel (UI UPDATED) --- */}
        {activeTab === 'theme' && (
          <div className="p-4">
            <SectionTitle label="Color Palette" />

            {/* --- NEW: Two-column grid for swatches --- */}
            <div className="grid grid-cols-2 gap-3">
              {colorPalettes.map((palette) => (
                <ColorSwatchButton
                  key={palette.class}
                  palette={palette}
                  isSelected={
                    getSafe(businessData, 'theme.colorPalette') ===
                    palette.class
                  }
                  onClick={() =>
                    handleDataChange('theme.colorPalette', palette.class)
                  }
                />
              ))}
            </div>
            {/* --- End of new grid --- */}

            <SectionTitle label="Fonts" />
            <EditorSelect
              label="Heading Font"
              value={getSafe(businessData, 'theme.font.heading')}
              onChange={(e) =>
                handleDataChange('theme.font.heading', e.target.value)
              }
              options={fontOptions}
              placeholder="Select a heading font"
            />
            <EditorSelect
              label="Body Font"
              value={getSafe(businessData, 'theme.font.body')}
              onChange={(e) =>
                handleDataChange('theme.font.body', e.target.value)
              }
              options={fontOptions}
              placeholder="Select a body font"
            />
          </div>
        )}
        {/* --- END OF THEME Panel --- */}

        {/* SETTINGS Panel (With Refactored Shortcuts) */}
        {activeTab === 'settings' && (
          <div className="p-4">
            <section>
              <SectionTitle label="Site Settings" />
              <p className="text-gray-600 text-sm">
                SEO, Domain, and other settings will go here.
              </p>
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
    </>
  );

  return (
    <div className={`flex flex-col h-full bg-white ${isMobile ? 'w-full' : 'w-80'}`}>
      
      {/* Desktop Tabs (Top) */}
      {!isMobile && (
        <div className="flex items-center border-b border-gray-200">
            <MainTab
            icon={LayoutDashboard}
            label="Website"
            isActive={activeTab === 'website'}
            onClick={() => onTabChange('website')}
            />
            <MainTab
            icon={Paintbrush}
            label="Theme"
            isActive={activeTab === 'theme'}
            onClick={() => onTabChange('theme')}
            />
            {!isLandingMode && (
              <MainTab
              icon={Settings}
              label="Settings"
              isActive={activeTab === 'settings'}
              onClick={() => onTabChange('settings')}
              />
            )}
        </div>
      )}

      {/* Content Area */}
      <div className={`flex-grow overflow-y-auto ${isMobile ? 'pb-[70px]' : ''}`}>
           {/* Mobile Content Wrapper - Animate Slide Up */}
           {isMobile && (
              <div className={`fixed bottom-[60px] left-0 w-full bg-white rounded-t-xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 z-50 flex flex-col border-t border-gray-200
                  ${isMobileExpanded ? 'h-[85vh] translate-y-0' : 'h-0 translate-y-full overflow-hidden'}
              `}>
                  {/* Header for Sheet */}
                  <div className="flex items-center justify-between p-4 border-b">
                      <h3 className="font-semibold text-lg capitalize">{activeTab}</h3>
                      <button onClick={() => setIsMobileExpanded(false)}>
                          <X size={24} />
                      </button>
                  </div>
                  
                  {/* Scrollable Content */}
                  <div className="flex-grow overflow-y-auto p-4">
                      {renderPanelContent()}
                  </div>
              </div>
           )}

           {/* Desktop Content - Render normally */}
           {!isMobile && (
              <div className="flex-grow overflow-y-auto pb-40">
                 {renderPanelContent()}
              </div>
           )}
      </div>

      {/* Mobile Tabs (Bottom) */}
      {isMobile && (
         <div className="flex items-center justify-around border-t border-gray-200 h-[60px] bg-white fixed bottom-0 w-full z-[70]">
            <MainTab
            icon={LayoutDashboard}
            label="Website"
            isActive={activeTab === 'website'}
            onClick={() => handleMobileTabChange('website')}
            />
            <MainTab
            icon={Paintbrush}
            label="Theme"
            isActive={activeTab === 'theme'}
            onClick={() => handleMobileTabChange('theme')}
            />
            <MainTab
            icon={Settings}
            label="Settings"
            isActive={activeTab === 'settings'}
            onClick={() => handleMobileTabChange('settings')}
            />
         </div>
      )}
      
    </div>
  );
}