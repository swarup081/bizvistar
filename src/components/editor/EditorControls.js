'use client';

import { useState, useEffect, useRef } from 'react';
import {
  ImageIcon, ChevronDown, Search, Trash,
} from 'lucide-react';

// Reusable section title
export const SectionTitle = ({ label }) => (
  <div className="flex items-center justify-between mt-6 mb-3">
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
        {label}
      </h3>
  </div>
);

// --- UPDATED: EditorInput for "Instant Update" UI (updates on every keystroke) ---
export const EditorInput = ({ label, value, onChange, isRequired = false }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label} {isRequired && <span className="text-red-500">*</span>}
            </label>
            <input
                type="text"
                value={value || ''} // The box shows the *real* data
                onChange={onChange} // This updates the real data on every keystroke
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
        </div>
    );
};

// --- UPDATED: EditorTextArea for "Instant Update" UI (updates on every keystroke) ---
export const EditorTextArea = ({ label, value, onChange }) => {
    return (
        <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
            </label>
            <textarea
                value={value || ''} // The box shows the *real* data
                onChange={onChange} // This updates the real data on every keystroke
                rows={3}
                className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            />
        </div>
    );
};


// Custom Searchable Select Dropdown
export const EditorSelect = ({ label, value, onChange, options = [], placeholder = "Select an option" }) => {
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
export const EditorImageUpload = ({ label, value, onChange }) => {
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
export const AccordionItem = ({ title, icon: Icon, isOpen, onClick, children }) => {
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

// --- NEW: Color Swatch Button (from screenshot) ---
// This component is now simpler: no border, no name.
export const ColorSwatchButton = ({ palette, isSelected, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className={`block w-full text-left p-2 rounded-lg transition-all ${
      isSelected 
        ? 'bg-blue-50' // Selected state background
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
export const fontOptions = [
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
  { name: 'Sage Green', class: 'sage-green', colors: ['#F7F9F5', '#EBF2E8', '#A5D6A7', '#588157', '#344E41'] },
  { name: 'Elegant Botanics', class: 'elegant-botanics', colors: ['#FCFBF9', '#F4ECE8', '#B98B7F', '#8A9A8C', '#4B413E'] },
  { name: 'Avenix Minimal', class: 'avenix-minimal', colors: ['#F8F7F5', '#FFFFFF', '#D81B60', '#1A1A1A', '#000000'] },
  { name: 'Brewhaven Cream', class: 'brewhaven-cream', colors: ['#FBF9F3', '#F5EFE6', '#F5A623', '#8A6E63', '#4B3832'] },
  { name: 'Warm Bakery', class: 'warm-bakery', colors: ['#FFF8F2', '#F9EBE4', '#A14D2A', '#8D6E63', '#5D4037'] },
  { name: 'Dark Roast', class: 'dark-roast', colors: ['#F3EFE9', '#E4A757', '#3D2F28', '#211A16', '#000000'] },
  { name: 'Sky Blue', class: 'sky-blue', colors: ['#F0F9FF', '#E0F2FE', '#38bdf8', '#0284C7', '#075985'] },
  { name: 'Strawberry Cream', class: 'strawberry-cream', colors: ['#FFF7F9', '#FDE8EF', '#ec4899', '#D81B60', '#502D39'] },
];

// --- Category Manager ---
export const CategoryManager = ({ categories, onAddCategory, onRemoveCategory, onDataChange }) => {
  const [newCategoryName, setNewCategoryName] = useState("");

  const handleAdd = () => {
    if (newCategoryName.trim()) {
      onAddCategory(newCategoryName);
      setNewCategoryName("");
    }
  };

  return (
    <>
      <h4 className="text-base font-semibold text-gray-800 mb-2">Categories</h4>
      {categories.map((category, index) => (
          <div key={category.id} className="flex items-end gap-2">
              <EditorInput
                  label={`Category ${index + 1}`}
                  value={category.name}
                  onChange={(e) => onDataChange(`categories.${index}.name`, e.target.value)}
              />
              <button 
                  onClick={() => onRemoveCategory(category.id)}
                  className="mb-4 p-2 text-gray-400 hover:text-red-500"
                  aria-label="Remove Category"
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
              onClick={handleAdd}
              className="flex-shrink-0 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
          >
              Add
          </button>
      </div>
    </>
  );
};

// --- Product Manager ---
export const ProductManager = ({ products, categories, onAddProduct, onRemoveProduct, onDataChange }) => {
  const categoryOptions = categories.map(c => ({ value: c.id, label: c.name }));

  return (
    <>
      <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">All Products</h4>
      {products.map((product, index) => (
          <div key={product.id || index} className="p-3 border rounded-md mb-2 bg-white relative">
              <button 
                  onClick={() => onRemoveProduct(product.id)}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  aria-label="Remove Product"
              >
                  <Trash size={16} />
              </button>
              <EditorInput
                  label={`Product ${index + 1} Name`}
                  value={product.name}
                  onChange={(e) => onDataChange(`allProducts.${index}.name`, e.target.value)}
              />
              <EditorInput
                  label={`Price`}
                  value={product.price}
                  onChange={(e) => onDataChange(`allProducts.${index}.price`, Number(e.target.value) || 0)}
              />
              <EditorSelect
                  label="Category"
                  value={product.category}
                  onChange={(e) => onDataChange(`allProducts.${index}.category`, e.target.value)}
                  options={categoryOptions}
                  placeholder="Select a category"
              />
              <EditorImageUpload
                  label={`Image`}
                  value={product.image}
                  onChange={(e) => onDataChange(`allProducts.${index}.image`, e.target.value)}
              />
              <EditorTextArea
                  label={`Description`}
                  value={product.description}
                  onChange={(e) => onDataChange(`allProducts.${index}.description`, e.target.value)}
              />
          </div>
      ))}
      <button
          onClick={onAddProduct}
          className="w-full mt-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700"
      >
          Add New Product
      </button>
    </>
  );
};