'use client';

import {
  Home, Image as ImageIcon, ShoppingBag, LayoutDashboard, Pencil, FileText, Info, Megaphone, TrendingUp
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
// It receives all the necessary props to function
export default function AvenixEditor(props) {
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

  const featuredIDs = getSafe(businessData, 'featured.itemIDs', []);
  const newArrivalsIDs = getSafe(businessData, 'newArrivals.itemIDs', []);

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

      {/* --- Avenix Hero --- */}
      {businessData?.heelsHero && (
        <AccordionItem
          title="Hero Section"
          icon={ImageIcon}
          isOpen={activeAccordion === 'hero'}
          onClick={() => toggleAccordion('hero')}
        >
          <EditorInput
            label="Line 1"
            value={getSafe(businessData, 'heelsHero.line1')}
            onChange={(e) => handleDataChange('heelsHero.line1', e.target.value)}
          />
          <EditorInput
            label="Line 2 (Accent)"
            value={getSafe(businessData, 'heelsHero.line2')}
            onChange={(e) => handleDataChange('heelsHero.line2', e.target.value)}
          />
          <EditorInput
            label="Line 3"
            value={getSafe(businessData, 'heelsHero.line3')}
            onChange={(e) => handleDataChange('heelsHero.line3', e.target.value)}
          />
          <EditorInput
            label="Bent Text (Accent)"
            value={getSafe(businessData, 'heelsHero.bentText')}
            onChange={(e) => handleDataChange('heelsHero.bentText', e.target.value)}
          />
          <EditorInput
            label="Button Text"
            value={getSafe(businessData, 'heelsHero.buttonText')}
            onChange={(e) => handleDataChange('heelsHero.buttonText', e.target.value)}
          />
          <EditorImageUpload
            label="Hero Image"
            value={getSafe(businessData, 'heelsHero.image')}
            onChange={(e) => handleDataChange('heelsHero.image', e.target.value)}
          />
        </AccordionItem>
      )}
      
      {/* --- Avenix About --- */}
      {businessData?.about && (
        <AccordionItem
          title="About Section"
          icon={Home}
          isOpen={activeAccordion === 'about'}
          onClick={() => toggleAccordion('about')}
        >
          <EditorInput
            label="Heading"
            value={getSafe(businessData, 'about.heading')}
            onChange={(e) => handleDataChange('about.heading', e.target.value)}
          />
           <EditorTextArea
            label="Subheading Part 1"
            value={getSafe(businessData, 'about.subheading.part1')}
            onChange={(e) => handleDataChange('about.subheading.part1', e.target.value)}
          />
          <EditorTextArea
            label="Subheading Part 2"
            value={getSafe(businessData, 'about.subheading.part2')}
            onChange={(e) => handleDataChange('about.subheading.part2', e.target.value)}
          />
          <EditorTextArea
            label="Statement"
            value={getSafe(businessData, 'about.statement')}
            onChange={(e) => handleDataChange('about.statement', e.target.value)}
          />
           <EditorImageUpload
            label="Large Image"
            value={getSafe(businessData, 'about.largeImage')}
            onChange={(e) => handleDataChange('about.largeImage', e.target.value)}
          />
          {/* Note: Inline images are complex to edit, skipping for now */}
        </AccordionItem>
      )}

      {/* --- Avenix CTA Section --- */}
      {businessData?.ctaSection && (
         <AccordionItem
          title="CTA Section"
          icon={Megaphone}
          isOpen={activeAccordion === 'cta'}
          onClick={() => toggleAccordion('cta')}
        >
          <EditorInput
            label="Title"
            value={getSafe(businessData, 'ctaSection.title')}
            onChange={(e) => handleDataChange('ctaSection.title', e.target.value)}
          />
           <EditorTextArea
            label="Text"
            value={getSafe(businessData, 'ctaSection.text')}
            onChange={(e) => handleDataChange('ctaSection.text', e.target.value)}
          />
          <EditorInput
            label="Button Text"
            value={getSafe(businessData, 'ctaSection.cta')}
            onChange={(e) => handleDataChange('ctaSection.cta', e.target.value)}
          />
           <EditorImageUpload
            label="Image"
            value={getSafe(businessData, 'ctaSection.image')}
            onChange={(e) => handleDataChange('ctaSection.image', e.target.value)}
          />
        </AccordionItem>
      )}

      {/* --- Avenix Stats Section --- */}
      {businessData?.stats && (
         <AccordionItem
          title="Stats Section"
          icon={TrendingUp}
          isOpen={activeAccordion === 'stats'}
          onClick={() => toggleAccordion('stats')}
        >
          <EditorInput
            label="Title"
            value={getSafe(businessData, 'stats.title')}
            onChange={(e) => handleDataChange('stats.title', e.target.value)}
          />
           <EditorTextArea
            label="Text"
            value={getSafe(businessData, 'stats.text')}
            onChange={(e) => handleDataChange('stats.text', e.target.value)}
          />
          <EditorInput
            label="Stat 1 Number"
            value={getSafe(businessData, 'stats.items.0.number')}
            onChange={(e) => handleDataChange('stats.items.0.number', e.target.value)}
          />
          <EditorInput
            label="Stat 1 Label"
            value={getSafe(businessData, 'stats.items.0.label')}
            onChange={(e) => handleDataChange('stats.items.0.label', e.target.value)}
          />
          <EditorInput
            label="Stat 2 Number"
            value={getSafe(businessData, 'stats.items.1.number')}
            onChange={(e) => handleDataChange('stats.items.1.number', e.target.value)}
          />
          <EditorInput
            label="Stat 2 Label"
            value={getSafe(businessData, 'stats.items.1.label')}
            onChange={(e) => handleDataChange('stats.items.1.label', e.target.value)}
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
        
        {/* --- AVENIX: featured --- */}
        {businessData?.featured && (
          <>
            <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">"Featured Products" Section</h4>
             <EditorInput
                label="Section Heading"
                value={getSafe(businessData, 'featured.sectionHeading')}
                onChange={(e) => handleDataChange('featured.sectionHeading', e.target.value)}
            />
             <EditorInput
                label="Section Title"
                value={getSafe(businessData, 'featured.title')}
                onChange={(e) => handleDataChange('featured.title', e.target.value)}
            />
            <EditorImageUpload
                label="Large Image"
                value={getSafe(businessData, 'featured.largeImage')}
                onChange={(e) => handleDataChange('featured.largeImage', e.target.value)}
            />
            {featuredIDs.map((id, index) => (
                <EditorSelect
                    key={`feat-${index}`}
                    label={`Featured Slot ${index + 1}`}
                    value={id}
                    onChange={(e) => handleDataChange(`featured.itemIDs.${index}`, Number(e.target.value))}
                    options={[...productOptions.filter(p => p.value === id), ...homepageProductOptions]}
                    placeholder="Select a product"
                />
            ))}
          </>
        )}

        {/* --- AVENIX: newArrivals --- */}
        {businessData?.newArrivals && (
          <>
            <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">"New Arrivals" Section</h4>
             <EditorInput
                label="Section Heading"
                value={getSafe(businessData, 'newArrivals.heading')}
                onChange={(e) => handleDataChange('newArrivals.heading', e.target.value)}
            />
             <EditorInput
                label="Section Title"
                value={getSafe(businessData, 'newArrivals.title')}
                onChange={(e) => handleDataChange('newArrivals.title', e.target.value)}
            />
            {newArrivalsIDs.map((id, index) => (
                <EditorSelect
                    key={`new-${index}`}
                    label={`New Arrival Slot ${index + 1}`}
                    value={id}
                    onChange={(e) => handleDataChange(`newArrivals.itemIDs.${index}`, Number(e.target.value))}
                    options={[...productOptions.filter(p => p.value === id), ...homepageProductOptions]}
                    placeholder="Select a product"
                />
            ))}
          </>
        )}
      </AccordionItem>

      {/* --- AVENIX BLOG SECTION (WITH IMAGE UPLOAD) --- */}
      {businessData?.blog && (
        <AccordionItem
          title="Blog Section"
          icon={Pencil}
          isOpen={activeAccordion === 'blog'}
          onClick={() => toggleAccordion('blog')}
        >
            <EditorInput
                label="Section Heading"
                value={getSafe(businessData, 'blog.heading')}
                onChange={(e) => handleDataChange('blog.heading', e.target.value)}
            />
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
            <EditorInput
                label="Post 1 Date"
                value={getSafe(businessData, 'blog.items.0.date')}
                onChange={(e) => handleDataChange('blog.items.0.date', e.target.value)}
            />
            <EditorInput
                label="Post 1 Category"
                value={getSafe(businessData, 'blog.items.0.category')}
                onChange={(e) => handleDataChange('blog.items.0.category', e.target.value)}
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
            <EditorInput
                label="Post 2 Date"
                value={getSafe(businessData, 'blog.items.1.date')}
                onChange={(e) => handleDataChange('blog.items.1.date', e.target.value)}
            />
            <EditorInput
                label="Post 2 Category"
                value={getSafe(businessData, 'blog.items.1.category')}
                onChange={(e) => handleDataChange('blog.items.1.category', e.target.value)}
            />
            <EditorImageUpload
                label="Post 2 Image"
                value={getSafe(businessData, 'blog.items.1.image')}
                onChange={(e) => handleDataChange('blog.items.1.image', e.target.value)}
            />
        </AccordionItem>
      )}
      
      {/* --- AVENIX FOOTER --- */}
      <AccordionItem
        title="Footer"
        icon={FileText}
        isOpen={activeAccordion === 'footer'}
        onClick={() => toggleAccordion('footer')}
      >
          <h4 className="text-base font-semibold text-gray-800 mb-2 mt-6">Footer Content</h4>
          <EditorInput
              label="Footer Description"
              value={getSafe(businessData, 'footer.description')}
              onChange={(e) => handleDataChange('footer.description', e.target.value)}
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
              label="Contact Address"
              value={getSafe(businessData, 'footer.contact.address')}
              onChange={(e) => handleDataChange('footer.contact.address', e.target.value)}
          />
           <EditorInput
              label="Subscribe Title"
              value={getSafe(businessData, 'footer.subscribe.title')}
              onChange={(e) => handleDataChange('footer.subscribe.title', e.target.value)}
          />
      </AccordionItem>
    </section>
  );
}