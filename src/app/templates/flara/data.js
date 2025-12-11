// --- NEW DYNAMIC CATEGORIES ---
// Define all your categories in one place.
const categories = [
  { id: 'c1', name: 'Scented Candles' },
  { id: 'c2', name: 'Button Shirts' },
  { id: 'c3', name: 'Cashmere' },
];

// --- NEW MASTER PRODUCT LIST ---
// Products now use a category ID from the list above.
const allProducts = [
  { id: 1, name: 'Lightweight Granite Hat', price: 299, category: 'c2', image: '/flaraImage/bestSellers_id1.jpg', description: 'A stylish and lightweight hat perfect for sunny days. Made from 100% breathable cotton.' },
  { id: 2, name: 'Incredible Linen Shirt', price: 211, category: 'c3', image: '/flaraImage/bestSellers_id2.jpg', description: 'Experience ultimate comfort with this 100% linen shirt, perfect for a relaxed yet elegant look.' },
  { id: 3, name: 'Practical Linen Shoes', price: 319, category: 'c4', image: '/flaraImage/bestSellers_id3.jpg', description: 'Breathable, comfortable, and stylish. These linen shoes are your perfect everyday companion.' },
  { id: 4, name: 'Fantastic Paper Pants', price: 119, category: 'c3', image: '/flaraImage/bestSellers_id4.jpg', description: 'Lightweight and flowy, these pants are designed for maximum comfort and style.' },
  { id: 5, name: 'Soothing Lavender Candle', price: 499, category: 'c1', image: '/flaraImage/collection1.jpg', description: 'Unwind with the calming scent of pure lavender. Hand-poured with soy wax.' },
  { id: 6, name: 'Ocean Breeze Candle', price: 499, category: 'c1', image: '/flaraImage/feature2_image1.jpg', description: 'Bring the fresh scent of the ocean into your home. A clean and invigorating aroma.' },
  { id: 7, name: 'Warm Vanilla Candle', price: 499, category: 'c1', image: '/flaraImage/feature2_image2.jpg', description: 'A cozy and comforting aroma of sweet vanilla bean and warm spices.' },
  { id: 8, name: 'Classic Button Shirt', price: 350, category: 'c2', image: '/flaraImage/collection2.jpg', description: 'A timeless classic. This crisp cotton button-down shirt is a wardrobe essential.' }
];

export const businessData = {
    // --- GENERAL BUSINESS INFO ---
    name: "Candlea",
    logoText: "Candlea",
    whatsappNumber: "91123456789", 
    announcementBar: "Free shipping on all order of ₹899 or more", // <-- ADDED
    
    // --- Section IDs for Editor Navigation ---
    aboutSectionId: "about", 
    collectionSectionId: "collection", // <-- ADDED
    bestSellersSectionId: "shop",     // <-- ADDED
    feature2SectionId: "feature2",    // <-- ADDED
    blogSectionId: "blog", 
    footerSectionId: "contact", 
    
    // --- NEW: Master Lists ---
    categories: categories,
    allProducts: allProducts,

    // --- NEW: Page Definitions ---
    pages: [
      { name: 'Home', path: '/templates/flara' },
      { name: 'Shop', path: '/templates/flara/shop' },
      { name: 'Product (Example)', path: '/templates/flara/product/1' },
      { name: 'Checkout', path: '/templates/flara/checkout' }
    ],

    // --- THEME SECTION ---
    theme: {
        colorPalette: 'sage-green',
        font: {
            heading: 'poppins',
            body: 'Montserrat'
        }
    },

    // --- NAVIGATION (LINKS UPDATED) ---
    navigation: [
        { href: "/templates/flara", label: "Home" },
        { href: "/templates/flara/shop", label: "Shop" },
    ],

    // --- PAGE SECTIONS ---
    hero: {
        title: "Crafting moments of tranquility",
        subtitle: "Discover our collection of soothing candles, each one thoughtfully made to help you unwind.",
        cta: "Shop Now",
        image: "/flaraImage/hero_image.jpg"
    },
    
    infoBar: [
        "Ready to ignite a fresh experience?",
        "Handcrafted with love.",
        "Discover your new favorite scent."
    ],

    feature1: {
        title: "Crafting warmth & serenity in every flame",
        text: "At Candlea, we believe in the power of scent to transform spaces and uplift moods. Our passion for crafting high-quality, eco-friendly candles drives everything we do.",
        subtext: "Whether you're looking to create a cozy atmosphere or find the perfect gift, our carefully curated collection offers something special for every moment. Join us in embracing the warmth, tranquility, and beauty that our candles bring to your home.",
        cta: "About Us",
        image: "/flaraImage/feature1_image.jpg"
    },
    
    collection: {
        title: "Our collection",
        itemIDs: [5, 8, 3] 
    },

    bestSellers: {
        title: "Our best seller",
        itemIDs: [1, 2, 3, 4] 
    },
    
    // --- RE-ADDED THIS SECTION ---
    feature2: {
        title: "Embrace the serenity of peaceful scents",
        text: "Indulge in the serene and calming aromas that our candles offer, transforming your space into a peaceful haven. Let the gentle, soothing scents wash over you.",
        subtext: "Treat yourself to the soothing embrace of our peaceful scents, carefully crafted to transform your space into a sanctuary of calm and relaxation.",
        image1: "/flaraImage/feature2_image1.jpg", 
        image2: "/flaraImage/feature2_image2.jpg", 
    },
    
    blog: {
        title: "Our blog",
        items: [
            { date: "NOV 19, 2024", title: "Nullam ullamcorper nisl quis ornare molestie", text: "Suspendisse posuere, diam in bibendum lobortis, turpis ipsum aliquam risus, sit amet...", image: "/flaraImage/blogImage1.jpg" },
            { date: "NOV 19, 2024", title: "Turpis at eleifend leo mi elit Aenean porta ac sed faucibus", text: "Turpis at eleifend leo mi elit Aenean porta ac sed faucibus. Nunc urna Morbi fringilla vitae...", image: "/flaraImage/blogImage2.jpg" },
            { date: "NOV 19, 2024", title: "Morbi condimentum molestie Nam enim odio sodales", text: "Sed mauris Pellentesque elit Aliquam at lacus interdum nascetur elit ipsum. Enim ipsum...", image: "/flaraImage/blogImage3.jpg" },
            { date: "NOV 19, 2024", title: "Urna pretium elit mauris cursus Curabitur at elit Vestibulum", text: "Mi vitae magnis Fusce laoreet nibh felis porttitor laoreet Vestibulum faucibus. At Nulla...", image: "/flaraImage/blogImage4.jpg" },
        ]
    },

    // --- FOOTER ---
    footer: {
        links: {
          about: [
            { name: "Our Story", url: "#" },
            { name: "Careers", url: "#" },
            { name: "Sustainability", url: "#" }
          ],
          categories: [
            { name: "Candles", url: "/templates/flara/shop" },
            { name: "Apparel", url: "/templates/flara/shop" }
          ],
          getHelp: [
            { name: "Contact Us", url: "#" },
            { name: "Shipping", url: "#" },
            { name: "Returns", url: "#" }
          ]
        },
        copyright: "© 2026 Candlea. All Rights Reserved"
      }
    };