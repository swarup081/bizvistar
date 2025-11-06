'use client';

import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Palette, Settings, Home, Store, Calendar, Tag, MessageCircle, Contact, Plus, FileText, Info, Image as ImageIcon, ShoppingBag, Pencil, ChevronDown, CheckCircle, UploadCloud, Trash, Search, X, Columns
} from 'lucide-react';

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

// Reusable section title
const SectionTitle = ({ label }) => (
  <div className="flex items-center justify-between mt-6 mb-3">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </h3>
  </div>
);

// --- UPDATED: EditorInput ---
// This now uses the correct placeholder logic.
const EditorInput = ({ label, value, onChange, isRequired = false }) => {
    const [localValue, setLocalValue] = useState(""); // Local state for typing
    const [isFocused, setIsFocused] = useState(false);

    const onBlur = () => {
        setIsFocused(false);
        // Only update if localValue is not empty AND is different from the original value
        if (localValue.trim() !== "" && localValue.trim() !== value) {
            onChange({ target: { value: localValue } });
        }
        // Clear local value on blur
        setLocalValue("");
    };

    const onFocus = () => {
        setIsFocused(true);
        // Set local value to the real value when focusing
        // This allows editing the current text
        setLocalValue(value || ""); 
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
                type="text"
                value={isFocused ? localValue : ""} // Show local value only when focused
                onChange={(e) => setLocalValue(e.target.value)}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder={value || "Type here..."} // Show the *real* value as the placeholder
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
    );
};

// --- UPDATED: EditorTextArea ---
// Now uses the correct placeholder logic and removes resize handle.
const EditorTextArea = ({ label, value, onChange }) => {
    const [localValue, setLocalValue] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    const onBlur = () => {
        setIsFocused(false);
        if (localValue.trim() !== "" && localValue.trim() !== value) {
            onChange({ target: { value: localValue } });
        }
        setLocalValue("");
    };

    const onFocus = () => {
        setIsFocused(true);
        setLocalValue(value || "");
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <textarea
                value={isFocused ? localValue : ""}
                onChange={(e) => setLocalValue(e.target.value)}
                onFocus={onFocus}
                onBlur={onBlur}
                placeholder={value || ""}
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none" // <-- resize-none added
            />
        </div>
    );
};


// Custom Searchable Select Dropdown
const EditorSelect = ({ label, value, onChange, options = [], placeholder = "Select an option" }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    const selectedOption = options.find(option => option.value === value);
    const displayValue = selectedOption ? selectedOption.label : placeholder;

    const filteredOptions = options.filter(option => 
        option.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
                setSearchTerm("");
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (newValue) => {
        onChange({ target: { value: newValue } });
        setIsOpen(false);
        setSearchTerm("");
    };

    return (
        <div className="mb-4" ref={dropdownRef}>
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="relative">
                <button
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full px-3 py-2 text-sm bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent flex justify-between items-center"
                >
                    <span className={selectedOption ? "text-gray-900" : "text-gray-500"}>
                        {displayValue}
                    </span>
                    <ChevronDown size={16} className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} />
                </button>
                
                {isOpen && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-hidden flex flex-col">
                        <div className="p-2 border-b border-gray-200">
                            <div className="relative">
                                <Search size={16} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search..."
                                    className="w-full pl-8 pr-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                                />
                            </div>
                        </div>
                        
                        <ul className="overflow-y-auto flex-grow">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map(option => (
                                    <li
                                        key={option.value}
                                        onClick={() => handleSelect(option.value)}
                                        className={`px-3 py-2 text-sm cursor-pointer hover:bg-blue-50 hover:text-blue-600 ${option.value === value ? 'bg-blue-50 text-blue-600' : 'text-gray-900'}`}
                                    >
                                        {option.label}
                                    </li>
                                ))
                            ) : (
                                <li className="px-3 py-2 text-sm text-gray-500">No options found.</li>
                            )}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
};

// Image Upload Control
const EditorImageUpload = ({ label, value, onChange }) => {
    const inputId = `file-upload-${label.replace(/\s+/g, '-')}`;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                onChange({ target: { value: reader.result }});
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
            <div className="flex items-center gap-2">
                <div className="w-12 h-12 rounded border border-gray-300 bg-gray-100 flex-shrink-0 flex items-center justify-center">
                    {value ? (
                        <img src={value} alt="Preview" className="w-full h-full object-cover rounded" />
                    ) : (
                        <ImageIcon size={24} className="text-gray-400" />
                    )}
                </div>
                <label 
                    htmlFor={inputId} 
                    className="cursor-pointer flex-grow px-3 py-2 bg-white text-gray-700 text-sm font-medium rounded-md border border-gray-300 hover:bg-gray-50 text-center"
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
const AccordionItem = ({ title, icon: Icon, isOpen, onClick, children }) => {
    const displayIcon = <Icon size={18} className="text-gray-500" />;
        
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
                <ChevronDown 
                    size={18} 
                    className={`text-gray-400 transition-transform ${isOpen ? 'rotate-180' : 'rotate-0'}`} 
                />
            </button>
            {isOpen && (
                <div className="p-4 bg-gray-50 border-t border-gray-200">
                    {children}
                </div>
            )}
        </div>
    );
};


export default function EditorSidebar({ 
  activeTab, 
  onTabChange,
  businessData,
  setBusinessData,
  onPageChange 
}) {

  const [activeAccordion, setActiveAccordion] = useState('global');
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleDataChange = (path, value) => {
    setBusinessData(prev => {
        const keys = path.split('.');
        const newData = JSON.parse(JSON.stringify(prev));
        
        let current = newData;
        for (let i = 0; i < keys.length - 1; i++) {
            const key = keys[i];
            if (current[key] === undefined || current[key] === null) {
                current[key] = {};
            }
            current = current[key];
        }
        
        current[keys[keys.length - 1]] = value;
        return newData;
    });
  };

  const toggleAccordion = (id) => {
    const newActiveId = activeAccordion === id ? null : id;
    setActiveAccordion(newActiveId);

    if (newActiveId && businessData?.pages) {
        const homePage = businessData.pages.find(p => p.name.toLowerCase() === 'home');
        const homePath = homePage?.path || businessData.pages[0]?.path;
        let path = homePath;
        
        switch (newActiveId) {
            case 'products':
                const shopPage = businessData.pages.find(p => p.name.toLowerCase().includes('shop'));
                if (shopPage) path = shopPage.path;
                break;
            case 'about':
                if (businessData.aboutSectionId) path = `${homePath}#${businessData.aboutSectionId}`;
                break;
            case 'collection':
                 const collectionId = businessData.collectionSectionId || "collection";
                 path = `${homePath}#${collectionId}`;
                break;
            case 'feature2':
                if (businessData.feature2SectionId) path = `${homePath}#${businessData.feature2SectionId}`;
                break;
            case 'footer':
                if (businessData.footerSectionId) path = `${homePath}#${businessData.footerSectionId}`;
                break;
        }
        
        onPageChange(path);
    }
  };

  // --- Handlers for dynamic lists ---
  
  const handleAddCategory = () => {
      if (!newCategoryName) return;
      const newCategory = { id: `c${Date.now()}`, name: newCategoryName };
      const newCategories = [...(businessData.categories || []), newCategory];
      handleDataChange('categories', newCategories);
      setNewCategoryName("");
  };

  const handleRemoveCategory = (categoryId) => {
      const newCategories = businessData.categories.filter(c => c.id !== categoryId);
      handleDataChange('categories', newCategories);
      const newProducts = businessData.allProducts.map(p => {
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
          category: businessData.categories[0]?.id || "",
          image: "https://placehold.co/600x750/CCCCCC/909090?text=New+Product",
          description: "A description for your new product."
      };
      const newProducts = [...(businessData.allProducts || []), newProduct];
      handleDataChange('allProducts', newProducts);
  };
  
  const handleRemoveProduct = (productId) => {
      const newProducts = businessData.allProducts.filter(p => p.id !== productId);
      handleDataChange('allProducts', newProducts);
      handleDataChange('collection.itemIDs', (businessData.collection.itemIDs || []).filter(id => id !== productId));
      handleDataChange('bestSellers.itemIDs', (businessData.bestSellers.itemIDs || []).filter(id => id !== productId));
  };
  
  // --- Dynamic fields for Flara ---
  const phonePath = 'whatsappNumber';
  const phoneValue = businessData?.whatsappNumber || '';
  const aboutTitlePath = 'feature1.title';
  const aboutTitleValue = businessData?.feature1?.title || '';
  const aboutTextPath = 'feature1.text';
  const aboutTextValue = businessData?.feature1?.text || '';
  const aboutImagePath = 'feature1.image';
  const aboutImageValue = businessData?.feature1?.image || '';
  
  const allProducts = Array.isArray(businessData?.allProducts) ? businessData.allProducts : [];
  const allCategories = Array.isArray(businessData?.categories) ? businessData.categories : [];
  
  const productOptions = allProducts.map(p => ({ value: p.id, label: p.name }));
  const categoryOptions = allCategories.map(c => ({ value: c.id, label: c.name }));
  
  const collectionIDs = Array.isArray(businessData?.collection?.itemIDs) ? businessData.collection.itemIDs : [];
  const bestSellerIDs = Array.isArray(businessData?.bestSellers?.itemIDs) ? businessData.bestSellers.itemIDs : [];

  const bestSellerOptions = productOptions.filter(
      p => !collectionIDs.includes(p.value)
  );


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
          icon={Palette}
          label="Theme"
          isActive={activeTab === 'theme'} // <-- BUG FIX
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
        
        {/* WEBSITE Panel (NEW ACCORDION UI) */}
        {activeTab === 'website' && (
          <section>
            <AccordionItem
              title="Global Settings"
              icon={Info}
              isOpen={activeAccordion === 'global'}
              onClick={() => toggleAccordion('global')}
            >
              <EditorInput
                label="Announcement Bar"
                value={businessData?.announcementBar || ''}
                onChange={(e) => handleDataChange('announcementBar', e.target.value)}
              />
              <EditorInput
                label="Business Name"
                value={businessData?.name || ''}
                onChange={(e) => {
                    const newName = e.target.value;
                    setBusinessData(prev => {
                        const newData = JSON.parse(JSON.stringify(prev));
                        newData.name = newName;
                        newData.logoText = newName;
                        if (newData.footer?.copyright) {
                            const year = new Date().getFullYear();
                            newData.footer.copyright = `© ${year} ${newName}. All Rights Reserved`;
                        }
                        return newData;
                    });
                }}
                isRequired={true}
              />
              <EditorInput
                label="Logo Text"
                value={businessData?.logoText || ''}
                onChange={(e) => handleDataChange('logoText', e.target.value)}
                isRequired={true}
              />
              <EditorInput
                label="Contact Phone / WhatsApp"
                value={phoneValue}
                onChange={(e) => handleDataChange(phonePath, e.target.value)}
              />
            </AccordionItem>

            <AccordionItem
              title="Hero Section"
              icon={ImageIcon}
              isOpen={activeAccordion === 'hero'}
              onClick={() => toggleAccordion('hero')}
            >
              <EditorInput
                label="Title"
                value={businessData?.hero?.title || ''}
                onChange={(e) => handleDataChange('hero.title', e.target.value)}
                isRequired={true}
              />
              <EditorTextArea
                label="Subtitle"
                value={businessData?.hero?.subtitle || ''}
                onChange={(e) => handleDataChange('hero.subtitle', e.target.value)}
              />
              <EditorInput
                label="Button Text"
                value={businessData?.hero?.cta || ''}
                onChange={(e) => handleDataChange('hero.cta', e.target.value)}
              />
              <EditorImageUpload
                label="Hero Image"
                value={businessData?.hero?.image || ''}
                onChange={(e) => handleDataChange('hero.image', e.target.value)}
              />
            </AccordionItem>

            <AccordionItem
              title="About Section"
              icon={Home}
              isOpen={activeAccordion === 'about'}
              onClick={() => toggleAccordion('about')}
            >
              <EditorInput
                label="Title"
                value={aboutTitleValue}
                onChange={(e) => handleDataChange(aboutTitlePath, e.target.value)}
              />
               <EditorTextArea
                label="Text"
                value={aboutTextValue}
                onChange={(e) => handleDataChange(aboutTextPath, e.target.value)}
              />
              <EditorTextArea
                label="Sub-text"
                value={businessData?.feature1?.subtext || ''}
                onChange={(e) => handleDataChange('feature1.subtext', e.target.value)}
              />
               <EditorImageUpload
                label="About Image"
                value={aboutImageValue}
                onChange={(e) => handleDataChange(aboutImagePath, e.target.value)}
              />
            </AccordionItem>
            
             <AccordionItem
              title="Feature Section"
              icon={Columns}
              isOpen={activeAccordion === 'feature2'}
              onClick={() => toggleAccordion('feature2')}
            >
              <EditorInput
                label="Title"
                value={businessData?.feature2?.title || ''}
                onChange={(e) => handleDataChange('feature2.title', e.target.value)}
              />
               <EditorTextArea
                label="Text"
                value={businessData?.feature2?.text || ''}
                onChange={(e) => handleDataChange('feature2.text', e.target.value)}
              />
               <EditorTextArea
                label="Sub-text"
                value={businessData?.feature2?.subtext || ''}
                onChange={(e) => handleDataChange('feature2.subtext', e.target.value)}
              />
               <EditorImageUpload
                label="Image 1"
                value={businessData?.feature2?.image1 || ''}
                onChange={(e) => handleDataChange('feature2.image1', e.target.value)}
              />
              <EditorImageUpload
                label="Image 2"
                value={businessData?.feature2?.image2 || ''}
                onChange={(e) => handleDataChange('feature2.image2', e.target.value)}
              />
            </AccordionItem>

            <AccordionItem
              title="Products & Categories"
              icon={ShoppingBag}
              isOpen={activeAccordion === 'products'}
              onClick={() => toggleAccordion('products')}
            >
                {/* --- CATEGORY MANAGER --- */}
                <h4 className="text-base font-semibold text-gray-800 mb-2">Categories</h4>
                {allCategories.map((category, index) => (
                    <div key={category.id} className="flex items-end gap-2">
                        <EditorInput
                            label={`Category ${index + 1}`}
                            value={category.name}
                            onChange={(e) => handleDataChange(`categories.${index}.name`, e.target.value)}
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
                        className="flex-grow px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleAddCategory}
                        className="flex-shrink-0 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
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
                        />
                        <EditorInput
                            label={`Price`}
                            value={product.price}
                            onChange={(e) => handleDataChange(`allProducts.${index}.price`, Number(e.target.value) || 0)}
                        />
                        <EditorSelect
                            label="Category"
                            value={product.category}
                            onChange={(e) => handleDataChange(`allProducts.${index}.category`, e.target.value)}
                            options={categoryOptions}
                            placeholder="Select a category"
                        />
                        <EditorImageUpload
                            label={`Image`}
                            value={product.image}
                            onChange={(e) => handleDataChange(`allProducts.${index}.image`, e.target.value)}
                        />
                    </div>
                ))}
                <button
                    onClick={handleAddProduct}
                    className="w-full mt-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
                >
                    Add New Product
                </button>
            </AccordionItem>
            
            <AccordionItem
              title="Home Page Collections"
              icon={LayoutDashboard}
              isOpen={activeAccordion === 'collection'}
              onClick={() => toggleAccordion('collection')}
            >
                {/* --- COLLECTION MANAGER --- */}
                <h4 className="text-base font-semibold text-gray-800 mb-2">"Our Collection" Section</h4>
                <p className="text-xs text-gray-500 mb-3">Select the products to show on the homepage.</p>
                {collectionIDs.map((id, index) => (
                    <EditorSelect
                        key={index}
                        label={`Collection Slot ${index + 1}`}
                        value={id}
                        onChange={(e) => handleDataChange(`collection.itemIDs.${index}`, Number(e.target.value))}
                        options={productOptions} // Can select any product
                        placeholder="Select a product"
                    />
                ))}
                
                {/* --- BEST SELLER MANAGER --- */}
                <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">"Best Sellers" Section</h4>
                <p className="text-xs text-gray-500 mb-3">Select the products to show on the homepage.</p>
                {bestSellerIDs.map((id, index) => (
                    <EditorSelect
                        key={index}
                        label={`Best Seller Slot ${index + 1}`}
                        value={id}
                        onChange={(e) => handleDataChange(`bestSellers.itemIDs.${index}`, Number(e.target.value))}
                        options={bestSellerOptions} // <-- USES THE FILTERED LIST
                        placeholder="Select a product"
                    />
                ))}
            </AccordionItem>
            
            <AccordionItem
              title="Footer Links"
              icon={FileText}
              isOpen={activeAccordion === 'footer'}
              onClick={() => toggleAccordion('footer')}
            >
                <h4 className="text-base font-semibold text-gray-800 mb-2">"About" Links</h4>
                <EditorInput
                    label="Link 1 Title"
                    value={businessData?.footer?.links?.about[0]?.name || ''}
                    onChange={(e) => handleDataChange('footer.links.about.0.name', e.target.value)}
                />
                
                <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">"Categories" Links</h4>
                <EditorInput
                    label="Link 1 Title"
                    value={businessData?.footer?.links?.categories[0]?.name || ''}
                    onChange={(e) => handleDataChange('footer.links.categories.0.name', e.target.value)}
                />

                <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">"Get Help" Links</h4>
                <EditorInput
                    label="Link 1 Title"
                    value={businessData?.footer?.links?.getHelp[0]?.name || ''}
                    onChange={(e) => handleDataChange('footer.links.getHelp.0.name', e.target.value)}
                />
            </AccordionItem>

          </section>
        )}

        {/* THEME Panel */}
        {activeTab === 'theme' && (
          <div className="p-4">
            <SectionTitle label="Theme Settings" />
            <p className="text-gray-600 text-sm">Color palettes and font controls will go here.</p>
          </div>
        )}

        {/* SETTINGS Panel (With Refactored Shortcuts) */}
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