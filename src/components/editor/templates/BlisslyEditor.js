'use client';

import {
  Home, Image as ImageIcon, ShoppingBag, LayoutDashboard, Pencil, FileText, Info, Columns, Megaphone, Calendar
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
export default function BlisslyEditor(props) {
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

  const specialtyIDs = getSafe(businessData, 'specialty.itemIDs', []);
  
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
        <EditorInput
          label="Contact Phone / WhatsApp"
          value={getSafe(businessData, 'whatsappNumber')}
          onChange={(e) => handleDataChange('whatsappNumber', e.target.value)}
        />
        <EditorInput
          label="Header Button Text"
          value={getSafe(businessData, 'headerButton.text')}
          onChange={(e) => handleDataChange('headerButton.text', e.target.value)}
        />
      </AccordionItem>
      
      {/* --- Blissly Hero --- */}
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
          <EditorImageUpload
            label="Hero Image"
            value={getSafe(businessData, 'hero.image')}
            onChange={(e) => handleDataChange('hero.image', e.target.value)}
          />
        </AccordionItem>
      )}

      {/* --- Blissly Events --- */}
      {businessData?.events && (
        <AccordionItem
          title="Events Section"
          icon={Calendar}
          isOpen={activeAccordion === 'events'}
          onClick={() => toggleAccordion('events')}
        >
          <EditorInput
            label="Section Title"
            value={getSafe(businessData, 'events.title')}
            onChange={(e) => handleDataChange('events.title', e.target.value)}
          />
          <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">Event 1</h4>
          <EditorInput
              label="Event 1 Title"
              value={getSafe(businessData, 'events.items.0.title')}
              onChange={(e) => handleDataChange('events.items.0.title', e.target.value)}
          />
          <EditorTextArea
              label="Event 1 Text"
              value={getSafe(businessData, 'events.items.0.text')}
              onChange={(e) => handleDataChange('events.items.0.text', e.target.value)}
          />
          <EditorImageUpload
              label="Event 1 Image"
              value={getSafe(businessData, 'events.items.0.image')}
              onChange={(e) => handleDataChange('events.items.0.image', e.target.value)}
          />
          {/* Add more events as needed */}
        </AccordionItem>
      )}

      {/* --- Blissly About --- */}
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
           <EditorImageUpload
            label="About Image"
            value={getSafe(businessData, 'about.image')}
            onChange={(e) => handleDataChange('about.image', e.target.value)}
          />
          <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">Features</h4>
          <EditorInput
              label="Feature 1 Title"
              value={getSafe(businessData, 'about.features.0.title')}
              onChange={(e) => handleDataChange('about.features.0.title', e.target.value)}
          />
          <EditorTextArea
              label="Feature 1 Text"
              value={getSafe(businessData, 'about.features.0.text')}
              onChange={(e) => handleDataChange('about.features.0.text', e.target.value)}
          />
          {/* Add more features as needed */}
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
        
        {businessData?.specialty && (
          <>
            <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">"Our Specialty" Section</h4>
            <EditorInput
                label="Section Title"
                value={getSafe(businessData, 'specialty.title')}
                onChange={(e) => handleDataChange('specialty.title', e.target.value)}
            />
            {specialtyIDs.map((id, index) => (
                <EditorSelect
                    key={`spec-${index}`}
                    label={`Specialty Slot ${index + 1}`}
                    value={id}
                    onChange={(e) => handleDataChange(`specialty.itemIDs.${index}`, Number(e.target.value))}
                    options={[...productOptions.filter(p => p.value === id), ...homepageProductOptions]}
                    placeholder="Select a product"
                />
            ))}
          </>
        )}
      </AccordionItem>

      {/* --- Blissly CTA --- */}
      {businessData?.cta && (
         <AccordionItem
          title="CTA Section"
          icon={Megaphone}
          isOpen={activeAccordion === 'cta'}
          onClick={() => toggleAccordion('cta')}
        >
          <EditorInput
            label="Title"
            value={getSafe(businessData, 'cta.title')}
            onChange={(e) => handleDataChange('cta.title', e.target.value)}
          />
           <EditorTextArea
            label="Text"
            value={getSafe(businessData, 'cta.text')}
            onChange={(e) => handleDataChange('cta.text', e.target.value)}
          />
          <EditorInput
            label="Button Text"
            value={getSafe(businessData, 'cta.cta')}
            onChange={(e) => handleDataChange('cta.cta', e.target.value)}
          />
        </AccordionItem>
      )}

      {/* --- Blissly Footer --- */}
      <AccordionItem
        title="Footer"
        icon={FileText}
        isOpen={activeAccordion === 'footer'}
        onClick={() => toggleAccordion('footer')}
      >
          <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">Footer Content</h4>
          <EditorInput
              label="Promo Title"
              value={getSafe(businessData, 'footer.promoTitle')}
              onChange={(e) => handleDataChange('footer.promoTitle', e.target.value)}
          />
          <EditorInput
              label="Contact Phone"
              value={getSafe(businessData, 'footer.contact.phone')}
              onChange={(e) => handleDataChange('footer.contact.phone', e.target.value)}
          />
          <EditorInput
              label="Contact Email"
              value={getSafe(businessData, 'footer.contact.email')}
              onChange={(e) => handleDataChange('footer.contact.email', e.target.value)}
          />
           <EditorInput
              label="Location Title"
              value={getSafe(businessData, 'footer.location.title')}
              onChange={(e) => handleDataChange('footer.location.title', e.target.value)}
          />
          <EditorInput
              label="Location Address"
              value={getSafe(businessData, 'footer.location.address')}
              onChange={(e) => handleDataChange('footer.location.address', e.target.value)}
          />
          <EditorTextArea
              label="Opening Hours"
              value={getSafe(businessData, 'footer.location.hours')}
              onChange={(e) => handleDataChange('footer.location.hours', e.target.value)}
          />
      </AccordionItem>
    </section>
  );
}