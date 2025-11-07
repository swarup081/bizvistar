'use client';

import {
  Home, Image as ImageIcon, ShoppingBag, LayoutDashboard, Pencil, FileText, Info
} from 'lucide-react';
import {
  AccordionItem,
  EditorInput,
  EditorTextArea,
  EditorImageUpload,
  EditorSelect,
  CategoryManager,
  ProductManager
} from '../EditorControls.js';

// This component is rendered by EditorSidebar.js
export default function FlavornestEditor(props) {
  const {
    businessData,
    handleDataChange,
    handleSyncedNameChange,
    toggleAccordion,
    activeAccordion,
    getSafe,
    productOptions,
    categoryOptions,
    homepageProductOptions,
    // Product/Category list handlers
    allCategories,
    allProducts,
    handleAddCategory,
    handleRemoveCategory,
    handleAddProduct,
    handleRemoveProduct
  } = props;

  const menuIDs = getSafe(businessData, 'menu.itemIDs', []);
  
  return (
    <section>
      {/* --- Global Settings --- */}
      <AccordionItem
        title="Global Settings"
        icon={Info}
        isOpen={activeAccordion === 'global'}
        onClick={() => toggleAccordion('global')}
      >
        <EditorInput
          label="Business Name"
          value={getSafe(businessData, 'name')}
          onChange={(e) => handleSyncedNameChange(e.target.value)}
          isRequired={true}
        />
        <EditorInput
          label="Logo Text"
          value={getSafe(businessData, 'logoText')}
          onChange={(e) => handleSyncedNameChange(e.target.value)}
          isRequired={true}
        />
        <EditorImageUpload
            label="Logo Image"
            value={getSafe(businessData, 'logo')}
            onChange={(e) => handleDataChange('logo', e.target.value)}
        />
        <EditorInput
          label="Contact Phone / WhatsApp"
          value={getSafe(businessData, 'whatsappNumber')}
          onChange={(e) => handleDataChange('whatsappNumber', e.target.value)}
        />
      </AccordionItem>
      
      {/* --- Flavornest Hero --- */}
      {businessData?.hero && (
        <AccordionItem
          title="Hero Section"
          icon={ImageIcon}
          isOpen={activeAccordion === 'hero'}
          onClick={() => toggleAccordion('hero')}
        >
          <EditorInput
            label="Title"
            value={getSafe(businessData, 'hero.title')}
            onChange={(e) => handleDataChange('hero.title', e.target.value)}
            isRequired={true}
          />
          <EditorTextArea
            label="Subtitle"
            value={getSafe(businessData, 'hero.subtitle')}
            onChange={(e) => handleDataChange('hero.subtitle', e.target.value)}
          />
          <EditorInput
            label="Button Text"
            value={getSafe(businessData, 'hero.cta')}
            onChange={(e) => handleDataChange('hero.cta', e.target.value)}
          />
        </AccordionItem>
      )}

      {/* --- Flavornest About --- */}
      {businessData?.about && (
        <AccordionItem
          title="About Section"
          icon={Home}
          isOpen={activeAccordion === 'about'}
          onClick={() => toggleAccordion('about')}
        >
          <EditorInput
            label="Title"
            value={getSafe(businessData, 'about.title')}
            onChange={(e) => handleDataChange('about.title', e.target.value)}
          />
           <EditorTextArea
            label="Text"
            value={getSafe(businessData, 'about.text')}
            onChange={(e) => handleDataChange('about.text', e.target.value)}
          />
        </AccordionItem>
      )}
      
      {/* --- Products & Categories --- */}
      <AccordionItem
        title="Products & Categories"
        icon={ShoppingBag}
        isOpen={activeAccordion === 'products'}
        onClick={() => toggleAccordion('products')}
      >
        <CategoryManager
          categories={allCategories}
          onAddCategory={(name) => handleAddCategory(name)}
          onRemoveCategory={(id) => handleRemoveCategory(id)}
          onDataChange={handleDataChange}
        />
        <ProductManager
          products={allProducts}
          categories={allCategories}
          onAddProduct={handleAddProduct}
          onRemoveProduct={(id) => handleRemoveProduct(id)}
          onDataChange={handleDataChange}
        />
      </AccordionItem>
      
      {/* --- Homepage Collections --- */}
      <AccordionItem
        title="Home Page Collections"
        icon={LayoutDashboard}
        isOpen={activeAccordion === 'collection'}
        onClick={() => toggleAccordion('collection')}
      >
        <p className="text-xs text-gray-500 mb-3">Select the products to feature on your homepage.</p>
        
        {businessData?.menu?.itemIDs && (
          <>
            <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">"Signature Menu" Section</h4>
             <EditorInput
                label="Section Title"
                value={getSafe(businessData, 'menu.title')}
                onChange={(e) => handleDataChange('menu.title', e.target.value)}
            />
            {menuIDs.map((id, index) => (
                <EditorSelect
                    key={`menu-${index}`}
                    label={`Menu Slot ${index + 1}`}
                    value={id}
                    onChange={(e) => handleDataChange(`menu.itemIDs.${index}`, Number(e.target.value))}
                    options={[...productOptions.filter(p => p.value === id), ...homepageProductOptions]}
                    placeholder="Select a product"
                />
            ))}
          </>
        )}
      </AccordionItem>
      
      {/* --- Flavornest Reviews --- */}
      {businessData?.reviews && (
        <AccordionItem
          title="Reviews Section"
          icon={Pencil}
          isOpen={activeAccordion === 'reviews'}
          onClick={() => toggleAccordion('reviews')}
        >
          <EditorInput
              label="Section Title"
              value={getSafe(businessData, 'reviews.title')}
              onChange={(e) => handleDataChange('reviews.title', e.target.value)}
          />
          
          <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">Review 1</h4>
          <EditorTextArea
              label="Review 1 Text"
              value={getSafe(businessData, 'reviews.items.0.text')}
              onChange={(e) => handleDataChange('reviews.items.0.text', e.target.value)}
          />
          <EditorInput
              label="Review 1 Author"
              value={getSafe(businessData, 'reviews.items.0.author')}
              onChange={(e) => handleDataChange('reviews.items.0.author', e.target.value)}
          />

          {/* Add more review controls as needed */}

        </AccordionItem>
      )}

      {/* --- Flavornest Footer --- */}
      <AccordionItem
        title="Footer"
        icon={FileText}
        isOpen={activeAccordion === 'footer'}
        onClick={() => toggleAccordion('footer')}
      >
          <EditorInput
              label="Footer Social Text"
              value={getSafe(businessData, 'footer.socialText')}
              onChange={(e) => handleDataChange('footer.socialText', e.target.value)}
          />
      </AccordionItem>
    </section>
  );
}