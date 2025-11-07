'use client';

import {
  Home, Image as ImageIcon, ShoppingBag, LayoutDashboard, Pencil, FileText, Info, Columns
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
export default function FlaraEditor(props) {
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

  const collectionIDs = getSafe(businessData, 'collection.itemIDs', []);
  const bestSellerIDs = getSafe(businessData, 'bestSellers.itemIDs', []);
  
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
          label="Announcement Bar"
          value={getSafe(businessData, 'announcementBar')}
          onChange={(e) => handleDataChange('announcementBar', e.target.value)}
        />
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
      </AccordionItem>
      
      {/* --- Flara Hero --- */}
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

      {/* --- Flara About (feature1) --- */}
      {businessData?.feature1 && (
        <AccordionItem
          title="About Section (Feature 1)"
          icon={Home}
          isOpen={activeAccordion === 'about'}
          onClick={() => toggleAccordion('about')}
        >
          <EditorInput
            label="Title"
            value={getSafe(businessData, 'feature1.title')}
            onChange={(e) => handleDataChange('feature1.title', e.target.value)}
          />
           <EditorTextArea
            label="Text"
            value={getSafe(businessData, 'feature1.text')}
            onChange={(e) => handleDataChange('feature1.text', e.target.value)}
          />
          <EditorTextArea
            label="Sub-text"
            value={getSafe(businessData, 'feature1.subtext')}
            onChange={(e) => handleDataChange('feature1.subtext', e.target.value)}
          />
           <EditorImageUpload
            label="About Image"
            value={getSafe(businessData, 'feature1.image')}
            onChange={(e) => handleDataChange('feature1.image', e.target.value)}
          />
        </AccordionItem>
      )}
      
      {/* --- Flara Feature 2 --- */}
      {businessData?.feature2 && (
         <AccordionItem
          title="Feature Section 2"
          icon={Columns}
          isOpen={activeAccordion === 'feature2'}
          onClick={() => toggleAccordion('feature2')}
        >
          <EditorInput
            label="Title"
            value={getSafe(businessData, 'feature2.title')}
            onChange={(e) => handleDataChange('feature2.title', e.target.value)}
          />
           <EditorTextArea
            label="Text"
            value={getSafe(businessData, 'feature2.text')}
            onChange={(e) => handleDataChange('feature2.text', e.target.value)}
          />
           <EditorTextArea
            label="Sub-text"
            value={getSafe(businessData, 'feature2.subtext')}
            onChange={(e) => handleDataChange('feature2.subtext', e.target.value)}
          />
           <EditorImageUpload
            label="Image 1"
            value={getSafe(businessData, 'feature2.image1')}
            onChange={(e) => handleDataChange('feature2.image1', e.target.value)}
          />
          <EditorImageUpload
            label="Image 2"
            value={getSafe(businessData, 'feature2.image2')}
            onChange={(e) => handleDataChange('feature2.image2', e.target.value)}
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
        
        {businessData?.collection && (
          <>
            <h4 className="text-base font-semibold text-gray-800 mb-2">"Our Collection" Section</h4>
            {collectionIDs.map((id, index) => (
                <EditorSelect
                    key={`coll-${index}`}
                    label={`Collection Slot ${index + 1}`}
                    value={id}
                    onChange={(e) => handleDataChange(`collection.itemIDs.${index}`, Number(e.target.value))}
                    options={[...productOptions.filter(p => p.value === id), ...homepageProductOptions]} // Show current + available
                    placeholder="Select a product"
                />
            ))}
          </>
        )}
        
        {businessData?.bestSellers && (
          <>
            <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">"Best Sellers" Section</h4>
            {bestSellerIDs.map((id, index) => (
                <EditorSelect
                    key={`best-${index}`}
                    label={`Best Seller Slot ${index + 1}`}
                    value={id}
                    onChange={(e) => handleDataChange(`bestSellers.itemIDs.${index}`, Number(e.target.value))}
                    options={[...productOptions.filter(p => p.value === id), ...homepageProductOptions]}
                    placeholder="Select a product"
                />
            ))}
          </>
        )}
      </AccordionItem>

      {/* --- Flara Blog Section (FIXED with image uploads) --- */}
      {businessData?.blog && (
        <AccordionItem
          title="Blog Section"
          icon={Pencil}
          isOpen={activeAccordion === 'blog'}
          onClick={() => toggleAccordion('blog')}
        >
          <EditorInput
              label="Section Title"
              value={getSafe(businessData, 'blog.title')}
              onChange={(e) => handleDataChange('blog.title', e.target.value)}
          />
          
          <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">Blog Post 1</h4>
          <EditorInput
              label="Post 1 Title"
              value={getSafe(businessData, 'blog.items.0.title')}
              onChange={(e) => handleDataChange('blog.items.0.title', e.target.value)}
          />
          <EditorTextArea
              label="Post 1 Text"
              value={getSafe(businessData, 'blog.items.0.text')}
              onChange={(e) => handleDataChange('blog.items.0.text', e.target.value)}
          />
          <EditorInput
              label="Post 1 Date"
              value={getSafe(businessData, 'blog.items.0.date')}
              onChange={(e) => handleDataChange('blog.items.0.date', e.target.value)}
          />
          <EditorImageUpload
              label="Post 1 Image"
              value={getSafe(businessData, 'blog.items.0.image')}
              onChange={(e) => handleDataChange('blog.items.0.image', e.target.value)}
          />

          <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">Blog Post 2</h4>
          <EditorInput
              label="Post 2 Title"
              value={getSafe(businessData, 'blog.items.1.title')}
              onChange={(e) => handleDataChange('blog.items.1.title', e.target.value)}
          />
          <EditorTextArea
              label="Post 2 Text"
              value={getSafe(businessData, 'blog.items.1.text')}
              onChange={(e) => handleDataChange('blog.items.1.text', e.target.value)}
          />
           <EditorInput
              label="Post 2 Date"
              value={getSafe(businessData, 'blog.items.1.date')}
              onChange={(e) => handleDataChange('blog.items.1.date', e.target.value)}
          />
          <EditorImageUpload
              label="Post 2 Image"
              value={getSafe(businessData, 'blog.items.1.image')}
              onChange={(e) => handleDataChange('blog.items.1.image', e.target.value)}
          />
          
        </AccordionItem>
      )}
      
      {/* --- Flara Footer Links --- */}
      <AccordionItem
        title="Footer"
        icon={FileText}
        isOpen={activeAccordion === 'footer'}
        onClick={() => toggleAccordion('footer')}
      >
          <h4 className="text-base font-semibold text-gray-800 mb-2">"About" Links</h4>
          <EditorInput
              label="Link 1 Title"
              value={getSafe(businessData, 'footer.links.about.0.name')}
              onChange={(e) => handleDataChange('footer.links.about.0.name', e.target.value)}
          />
          
          <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">"Categories" Links</h4>
          <EditorInput
              label="Link 1 Title"
              value={getSafe(businessData, 'footer.links.categories.0.name')}
              onChange={(e) => handleDataChange('footer.links.categories.0.name', e.target.value)}
          />

          <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">"Get Help" Links</h4>
          <EditorInput
              label="Link 1 Title"
              value={getSafe(businessData, 'footer.links.getHelp.0.name')}
              onChange={(e) => handleDataChange('footer.links.getHelp.0.name', e.target.value)}
          />
      </AccordionItem>
    </section>
  );
}