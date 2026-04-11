'use client';
// --- DYNAMIC CATEGORIES ---
// Define all your categories in one place.
const categories = [
    { id: 'c1', name: 'Shirts' },
    { id: 'c2', name: 'Tops' },
    { id: 'c5', name: 'Outerwear' },
  ];
  
  // --- MASTER PRODUCT LIST ---
  // Products now use a category ID from the list above.
  const allProducts = [
    { 
      id: 1, 
      name: "CUBAN COLLAR ", 
      price: 1899.00,
      category: 'c1',
      description: "A classic Cuban collar shirt with a relaxed fit, perfect for any casual occasion. Made from 100% breathable linen.",
      image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893428/bizvistar/avenix/tian-dayong-8UsQoiJLNNQ-unsplash.jpg"
    },
    { 
      id: 2, 
      name: "KNIT POLO SHIRT", 
      price: 1499.00,
      category: 'c1',
      description: "A sophisticated knit polo that bridges the gap between casual and smart. Crafted from a soft cotton blend.",
      image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893391/bizvistar/avenix/ihor-rapita-Dy_WYJHrhO8-unsplash.jpg"
    },
    { 
      id: 3, 
      name: "SLEEVELESS V-NECK TOP", 
      price: 1299.00,
      category: 'c2',
      description: "Striped sleeveless top with V-neck and halter button detail. A versatile piece for a modern wardrobe.",
      image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893407/bizvistar/avenix/md-ishak-raman-GdZMLxhqNhU-unsplash.jpg"
    },
    { 
      id: 4, 
      name: "CASUAL SPORTS CAP", 
      price: 799.00,
      category: 'c5',
      description: "Lightweight sporty cap for comfort and sun-ready style. Features an adjustable back strap.",
      image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893411/bizvistar/avenix/mediamodifier-F5i3PZXYkvY-unsplash.jpg"
    },
    { 
      id: 5, 
      name: "HOODED SWEATSHIRT", 
      price: 2499.00,
      category: 'c5',
      description: "Everyday hoodie with a relaxed shape and cozy feel. Made from premium heavyweight cotton.",
      image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893396/bizvistar/avenix/ihor-rapita-KkvbXU0teEM-unsplash.jpg"
    },
    { 
      id: 6, 
      name: "WIDE-LEG TROUSERS", 
      price: 2199.00,
      category: 'c5',
      description: "Wide-leg pants with raw hems and a relaxed, easy fit. A statement piece for any outfit.",
      image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893381/bizvistar/avenix/everdrop-gmbh-cDOMVV5Eaxw-unsplash.jpg"
    },
  ];
  
  export const businessData = {
      // --- GENERAL BUSINESS INFO ---
      name: "AVENIX",
      logoText: "Avenix",
  
      // --- NEW: Master Lists ---
      categories: categories,
      allProducts: allProducts,

      // --- NEW: Page Definitions ---
      pages: [
        { name: 'Home', path: '' },
        { name: 'Shop', path: '/shop' },
        { name: 'Product (Example)', path: '/product/1' },
        { name: 'Checkout', path: '/checkout' }
      ],

      // --- ADDED SECTION IDs FOR EDITOR NAVIGATION ---
      aboutSectionId: "story",
      collectionSectionId: "collection",
      ctaSectionId: "cta",
      statsSectionId: "stats",
      blogSectionId: "blogs",
      footerSectionId: "contact",
      bestSellersSectionId: "shop", // This ID is on the "New Arrivals" section
      // --- END OF ADDED SECTION ---
      
      // --- THEME SECTION ---
      theme: {
          colorPalette: 'avenix-minimal', 
          font: {
              heading: 'Cormorant Garamond', 
              body: 'DM Sans'              
          }
      },
  
      // --- NAVIGATION (Links Updated) ---
      navigation: {
          main: [
              { href: "/shop", label: "SHOP" },
              { href: "#story", label: "OUR STORY" },
              { href: "#blogs", label: "BLOGS" },
          ],
          secondary: [
              { href: "/shop", label: "COLLECTION" },
              { href: "#contact", label: "CONTACT US" },
          ]
      },
  
      // --- PAGE SECTIONS ---
      
      // --- Heels Hero Section ---
      heelsHero: {
          line1: "Keep your style,",
          line2: "fresh,",
          line3: "bold &",
          bentText: "trendy",
          buttonText: "VIEW TRENDS",
          image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893422/bizvistar/avenix/pew-nguyen-Ib0H1MGt5yw-unsplash.jpg",
          accentColor: "var(--color-brand-accent)", 
          buttonColor: "var(--color-brand-secondary)"
      },
  
      // --- About Section ---
      about: {
          heading: "ABOUT AVENIX",
          subheading: {
              part1: "Born with a commitment to quality, we blend heritage craft with modern confidence",
              part2: "bringing timeless designs and bold new looks for every mood, moment, and lifestyle."
          },
          inlineImages: [
              "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_400/v1775893415/bizvistar/avenix/michael-austin-jgSAuqMmJUE-unsplash.jpg", 
              "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_400/v1775893404/bizvistar/avenix/jason-briscoe-w2uvoJo_woE-unsplash.jpg", 
              "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_400/v1775893426/bizvistar/avenix/stefan-stefancik-w_Mj-SsE1mI-unsplash.jpg"  
          ],
          statement: "Delivering fashion that fits your vibe, your community & your story",
          largeImage: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893418/bizvistar/avenix/micheile-henderson-FpPcoOAk5PI-unsplash.jpg" 
      },
  
      // --- UPDATED to reference product IDs ---
      featured: {
          sectionHeading: "OUR COLLECTIONS",
          title: "Featured Products",
          largeImage: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893405/bizvistar/avenix/mahdi-chaghari-TlwDP1sa1mQ-unsplash.jpg",
          itemIDs: [1, 2] // References products 1 and 2 from allProducts
      },
  
      // --- CTA Section ---
      ctaSection: {
          title: "Explore fashion that fits your mood and moment",
          text: "From casual comfort to elegant evenings, our collection is designed to match your mood, uplift your confidence, and celebrate your individuality — all at prices that make sense.",
          cta: "Explore Collection",
          image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893370/bizvistar/avenix/dao-vi-t-hoang-YgScHOUdfGM-unsplash.jpg",
          icons: [
              { image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_200/v1775893385/bizvistar/avenix/icon_shirt.png" }, 
              { image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_200/v1775893383/bizvistar/avenix/icon_dress.png" }, 
              { image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_200/v1775893384/bizvistar/avenix/icon_outer.png" }  
          ]
      },
  

      brands: {
          heading: "Avenix helps you dress with purpose and personality",
          text: "We partner with trusted makers across India to bring you fashion that combines quality, style, and authenticity.",
          logos: [] 
      },
  
      features: [
          {
              title: "Designed for Everyone",
              text: "Designed to inspire confidence, our fashion suits every occasion — from bustling city streets to relaxed weekend getaways."
          },
          {
              title: "Crafted with Purpose",
              text: "Each piece reflects quality craftsmanship and conscious design, made to move with you through every chapter of your day.",
              cta: "Explore Collection"
          }
      ],
  
      // --- UPDATED to reference product IDs ---
      newArrivals: {
          heading: "NEW ARRIVALS",
          title: "Latest Products",
          itemIDs: [3, 4, 5, 6] // References products from allProducts
      },
  
      stats: {
          title: "Avenix in Numbers",
          text: "Our numbers reflect a growing community across India that values fashion, comfort, and confidence.",
          items: [
              { number: "85k+", label: "Happy Customers" },
              { number: "54+", label: "New Styles Monthly" },
          ],
          cta: "Explore More →"
      },
  
      blog: {
          heading: "OUR BLOGS",
          title: "Latest Articles",
          items: [
              {
                  title: "How one good outerwear piece can elevate your entire look",
                  date: "March 15, 2026",
                  category: "Essentials",
                  image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893357/bizvistar/avenix/alyssa-strohmann-TS--uNw-JqE-unsplash.jpg"
              },
              {
                  title: "Simple tricks to elevate your essentials into standout fits",
                  date: "March 10, 2026",
                  category: "Style Hacks",
                  image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893374/bizvistar/avenix/ed-us-kleCw7s_t0s-unsplash.jpg"
              }
          ]
      },
  
      // --- FOOTER DATA ---
      footer: {
          logo: "AVENIX",
          description: "Fashion rooted in Indian culture, styled for the world.",
          contact: {
              phone: "+91 98765 43210",
              email: "hello@avenix.in",
              address: "12, MG Road, Indiranagar, Bengaluru, Karnataka 560038"
          },
          links: {
              main: [
                  { name: "About us", url: "#story" },
                  { name: "Categories", url: "/shop" },
                  { name: "Blogs", url: "#blogs" },
                  { name: "Shop", url: "/shop" },
                  { name: "Contact us", url: "#contact" },
              ],
              utility: [
                  { name: "Shipping Policy", url: "#" },
                  { name: "Refund & Returns", url: "#" },
                  { name: "Style Guide", url: "#" },
                  { name: "Privacy Policy", url: "#" },
                  { name: "Terms & Conditions", url: "#" },
              ]
          },
          subscribe: {
              title: "Stay updated with new arrivals",
              cta: "GET UPDATES"
          },
          copyright: "© 2026 Avenix. All Rights Reserved.",
          socials: [
              { platform: "instagram", url: "https://instagram.com" },
              { platform: "facebook", url: "https://facebook.com" },
              { platform: "youtube", url: "https://youtube.com" },
              { platform: "twitter", url: "https://twitter.com" },
          ]
      }
  };