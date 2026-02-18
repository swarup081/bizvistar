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

// Accordion UI
const AccordionItem = ({ title, icon: Icon, isOpen, onClick, children, isMobile, onCloseMobile }) => {
  const displayIcon = <Icon size={18} className="text-gray-500" />;

  if (isMobile && isOpen) {
      return (
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
    <div className="grid grid-cols-5 h-12 w-full rounded-md overflow-hidden border border-gray-300">
      <div style={{ backgroundColor: palette.colors[0] }}></div>
      <div style={{ backgroundColor: palette.colors[1] }}></div>
      <div style={{ backgroundColor: palette.colors[2] }}></div>
      <div style={{ backgroundColor: palette.colors[3] }}></div>
      <div style={{ backgroundColor: palette.colors[4] }}></div>
    </div>
  </button>
);

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
  setBusinessData,
  onPageChange,
  activeAccordion,
  onAccordionToggle,
  forceDesktop = false,
  isLandingMode = false
}) {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const isMobileHook = useIsMobile();
  const isMobile = forceDesktop ? false : isMobileHook;

  useEffect(() => {
    if (activeAccordion && isMobile) {
      setIsMobileExpanded(true);
      onTabChange('website');
    }
  }, [activeAccordion]);

  const handleMobileTabChange = (tab) => {
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

  const handleSyncedNameChange = (newValue) => {
    setBusinessData((prev) => {
      const newData = JSON.parse(JSON.stringify(prev));
      newData.name = newValue;
      newData.logoText = newValue;
      if (newData.footer?.copyright) {
        const year = new Date().getFullYear();
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
  const bestSellerIDs = getSafe(businessData, 'bestSellers.itemIDs', []);
  const newArrivalsIDs = getSafe(businessData, 'newArrivals.itemIDs', []);
  const featuredIDs = getSafe(businessData, 'featured.itemIDs', []);
  const specialtyIDs = getSafe(businessData, 'specialty.itemIDs', []);
  const menuIDs = getSafe(businessData, 'menu.itemIDs', []);

  const homepageProductIDs = [
    ...collectionIDs,
    ...bestSellerIDs,
    ...newArrivalsIDs,
    ...featuredIDs,
    ...specialtyIDs,
    ...menuIDs,
  ];

  const homepageProductOptions = productOptions.filter(
    (p) => !homepageProductIDs.includes(p.value)
  );

  const renderPanelContent = () => (
    <>
        {activeTab === 'website' && (
          <section>
            {!isLandingMode && (
              <AccordionItem
                title="Global Settings"
                icon={Info}
                isOpen={activeAccordion === 'global'}
                onClick={() => toggleAccordion('global')}
                isMobile={isMobile}
                onCloseMobile={() => toggleAccordion(null)}
              >
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
            )}

            {businessData?.hero && (
              <AccordionItem
                title="Hero Section"
                icon={ImageIcon}
                isOpen={activeAccordion === 'hero'}
                onClick={() => toggleAccordion('hero')}
                isMobile={isMobile}
                onCloseMobile={() => toggleAccordion(null)}
              >
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
                   </>
                )}

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
                {businessData?.hero?.image !== undefined && (
                  <EditorImageUpload
                    label="Hero Image"
                    value={getSafe(businessData, 'hero.image')}
                    onChange={(e) =>
                      handleDataChange('hero.image', e.target.value)
                    }
                    onFocus={() => handleSectionFocus('hero')}
                  />
                )}

                {/* --- ADDED FOR AURORA SIMULATION (STATS IMAGE) --- */}
                {businessData?.hero?.imageArch1_b !== undefined && (
                   <EditorImageUpload
                    label="Feature Image (Stats Box)"
                    value={getSafe(businessData, 'hero.imageArch1_b')}
                    onChange={(e) => handleDataChange('hero.imageArch1_b', e.target.value)}
                    onFocus={() => handleSectionFocus('hero')}
                  />
                )}
                {/* --------------------------------------- */}

                {/* --- Add Other Aurora Images if needed --- */}
                {businessData?.hero?.imageArch1 !== undefined && (
                   <EditorImageUpload
                    label="Main Arch Image"
                    value={getSafe(businessData, 'hero.imageArch1')}
                    onChange={(e) => handleDataChange('hero.imageArch1', e.target.value)}
                    onFocus={() => handleSectionFocus('hero')}
                  />
                )}
                {businessData?.hero?.imageSmallArch !== undefined && (
                   <EditorImageUpload
                    label="Small Detail Image"
                    value={getSafe(businessData, 'hero.imageSmallArch')}
                    onChange={(e) => handleDataChange('hero.imageSmallArch', e.target.value)}
                    onFocus={() => handleSectionFocus('hero')}
                  />
                )}

              </AccordionItem>
            )}

            {/* Other Sections (Heels, Feature1, etc...) - Keeping structure mostly same */}
            {businessData?.heelsHero && (
              <AccordionItem
                title="Hero Section"
                icon={ImageIcon}
                isOpen={activeAccordion === 'hero'}
                onClick={() => toggleAccordion('hero')}
                isMobile={isMobile}
                onCloseMobile={() => toggleAccordion(null)}
              >
                {/* ... fields ... */}
                <EditorInput
                  label="Line 1"
                  value={getSafe(businessData, 'heelsHero.line1')}
                  onChange={(e) => handleDataChange('heelsHero.line1', e.target.value)}
                  onFocus={() => handleSectionFocus('hero')}
                />
                {/* ... more fields ... */}
              </AccordionItem>
            )}
            
            {/* ... Rest of components ... */}
            
          </section>
        )}

        {/* ... Theme and Settings Panels ... */}
        {activeTab === 'theme' && (
          <div className="p-4">
            <SectionTitle label="Color Palette" />
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
        {/* ... */}
    </>
  );

  return (
    <div className={`flex flex-col h-full bg-white ${isMobile ? 'w-full' : 'w-80'}`}>
      
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

      <div className={`flex-grow overflow-y-auto ${isMobile ? 'pb-[70px]' : ''}`}>
           {isMobile && (
              <div className={`fixed bottom-[60px] left-0 w-full bg-white rounded-t-xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] transition-transform duration-300 z-50 flex flex-col border-t border-gray-200
                  ${isMobileExpanded ? 'h-[85vh] translate-y-0' : 'h-0 translate-y-full overflow-hidden'}
              `}>
                  <div className="flex items-center justify-between p-4 border-b">
                      <h3 className="font-semibold text-lg capitalize">{activeTab}</h3>
                      <button onClick={() => setIsMobileExpanded(false)}>
                          <X size={24} />
                      </button>
                  </div>
                  <div className="flex-grow overflow-y-auto p-4">
                      {renderPanelContent()}
                  </div>
              </div>
           )}

           {!isMobile && (
              <div className="flex-grow overflow-y-auto pb-40">
                 {renderPanelContent()}
              </div>
           )}
      </div>

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
