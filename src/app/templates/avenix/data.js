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
      price: 55.00,
      category: 'c1',
      description: "A classic Cuban collar shirt with a relaxed fit, perfect for any casual occasion. Made from 100% breathable linen.",
      image: "/avenix/tian-dayong-8UsQoiJLNNQ-unsplash.jpg"
    },
    { 
      id: 2, 
      name: "KNIT POLO SHIRT", 
      price: 65.00,
      category: 'c1',
      description: "A sophisticated knit polo that bridges the gap between casual and smart. Crafted from a soft cotton blend.",
      image: "/avenix/ihor-rapita-Dy_WYJHrhO8-unsplash.jpg"
    },
    { 
      id: 3, 
      name: "SLEEVELESS V-NECK TOP", 
      price: 45.00,
      category: 'c2',
      description: "Striped sleeveless top with V-neck and halter button detail. A versatile piece for a modern wardrobe.",
      image: "/avenix/md-ishak-raman-GdZMLxhqNhU-unsplash.jpg"
    },
    { 
      id: 4, 
      name: "CASUAL SPORTS CAP", 
      price: 25.00,
      category: 'c5',
      description: "Lightweight sporty cap for comfort and sun-ready style. Features an adjustable back strap.",
      image: "/avenix/mediamodifier-F5i3PZXYkvY-unsplash.jpg"
    },
    { 
      id: 5, 
      name: "HOODED SWEATSHIRT", 
      price: 75.00,
      category: 'c5',
      description: "Everyday hoodie with a relaxed shape and cozy feel. Made from premium heavyweight cotton.",
      image: "/avenix/ihor-rapita-KkvbXU0teEM-unsplash.jpg"
    },
    { 
      id: 6, 
      name: "WIDE-LEG TROUSERS", 
      price: 80.00,
      category: 'c3',
      description: "Wide-leg pants with raw hems and a relaxed, easy fit. A statement piece for any outfit.",
      image: "/avenix/everdrop-gmbh-cDOMVV5Eaxw-unsplash.jpg"
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
        { name: 'Home', path: '/templates/avenix' },
        { name: 'Shop', path: '/templates/avenix/shop' },
        { name: 'Product (Example)', path: '/templates/avenix/product/1' },
        { name: 'Checkout', path: '/templates/avenix/checkout' }
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
              { href: "/templates/avenix/shop", label: "SHOP" },
              { href: "/templates/avenix#story", label: "OUR STORY" },
              { href: "/templates/avenix#blogs", label: "BLOGS" },
          ],
          secondary: [
              { href: "/templates/avenix/shop", label: "COLLECTION" },
              { href: "/templates/avenix#contact", label: "CONTACT US" },
          ]
      },
  
      // --- PAGE SECTIONS ---
      
      // --- Heels Hero Section ---
      heelsHero: {
          line1: "Keep your thread,",
          line2: "tight",
          line3: "tough &",
          bentText: "trendy",
          buttonText: "VIEW TRENDS",
          image: "/avenix/pew-nguyen-Ib0H1MGt5yw-unsplash.jpg",
          accentColor: "var(--color-brand-accent)", 
          buttonColor: "var(--color-brand-secondary)"
      },
  
      // --- About Section ---
      about: {
          heading: "ABOUT AVENIX",
          subheading: {
              part1: "A fashion space where style meets comfort,",
              part2: "bringing timeless trends and modern looks for every mood and occasion."
          },
          inlineImages: [
              "/avenix/michael-austin-jgSAuqMmJUE-unsplash.jpg", 
              "/avenix/jason-briscoe-w2uvoJo_woE-unsplash.jpg", 
              "/avenix/stefan-stefancik-w_Mj-SsE1mI-unsplash.jpg"  
          ],
          statement: "Avenix delivers fashion that fits your mood & moment",
          largeImage: "/avenix/micheile-henderson-FpPcoOAk5PI-unsplash.jpg" 
      },
  
      // --- UPDATED to reference product IDs ---
      featured: {
          sectionHeading: "OUR COLLECTIONS",
          title: "Featured Products",
          largeImage: "/avenix/mahdi-chaghari-TlwDP1sa1mQ-unsplash.jpg",
          itemIDs: [1, 2] // References products 1 and 2 from allProducts
      },
  
      // --- CTA Section ---
      ctaSection: {
          title: "Expolre fashion that fits your mood and moment",
          text: "From casual comfort to elegant evenings, our collection is designed to match your mood, uplift your confidence, and celebrate your individuality.",
          cta: "Explore Collection",
          image: "/avenix/dao-vi-t-hoang-YgScHOUdfGM-unsplash.jpg",
          icons: [
              { image: "/avenix/icon_shirt.png" }, 
              { image: "/avenix/icon_dress.png" }, 
              { image: "/avenix/icon_outer.png" }  
          ]
      },
  

      brands: {
          heading: "Avenix helps you dress with purpose and personality",
          text: "We collaborate with trusted brands to bring you fashion that combines quality, style, and authenticity.",
          logos: [] 
      },
  
      features: [
          {
              title: "Designed for Everyone",
              text: "Designed to inspire confidence, our fashion suits every occasion, every style, and everyone."
          },
          {
              title: "Crafted with Purpose",
              text: "Crafted with purpose, each design reflects quality, care, and style for every mood and moment.",
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
          text: "Our numbers reflect a growing global community that values fashion, comfort, and confidence.",
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
                  date: "August 7, 2025",
                  category: "Essentials",
                  image: "/avenix/alyssa-strohmann-TS--uNw-JqE-unsplash.jpg"
              },
              {
                  title: "Simple tricks to elevate your essentials into standout fits",
                  date: "August 5, 2025",
                  category: "Style Hacks",
                  image: "/avenix/ed-us-kleCw7s_t0s-unsplash.jpg"
              }
          ]
      },
  
      // --- FOOTER DATA ---
      footer: {
          logo: "AVENIX",
          description: "Designed by Nixar. Powered by Webflow",
          contact: {
              phone: "+(123) 456-7890",
              email: "info@example.com",
              address: "4517 Washington Ave. Manchester, Kentucky 39495"
          },
          links: {
              main: [
                  { name: "About us", url: "/templates/avenix#story" },
                  { name: "Categories", url: "/templates/avenix/shop" },
                  { name: "Blogs", url: "/templates/avenix#blogs" },
                  { name: "Shop", url: "/templates/avenix/shop" },
                  { name: "Contact us", url: "/templates/avenix#contact" },
              ],
              utility: [
                  { name: "Licensing", url: "#" },
                  { name: "Changelog", url: "#" },
                  { name: "Style Guide", url: "#" },
                  { name: "Return Policy", url: "#" },
                  { name: "Privacy Policy", url: "#" },
                  { name: "Terms & Conditions", url: "#" },
              ]
          },
          subscribe: {
              title: "Stay updated with new arrivals",
              cta: "GET UPDATES"
          },
          copyright: "© 2026 Avenix,",
          socials: [
              { platform: "instagram", url: "https://instagram.com" },
              { platform: "facebook", url: "https://facebook.com" },
              { platform: "youtube", url: "https://youtube.com" },
              { platform: "twitter", url: "https://twitter.com" },
          ]
      }
  };