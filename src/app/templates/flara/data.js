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
  { id: 1, name: 'Lightweight Granite Hat', price: 299, category: 'c2', image: 'https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893462/bizvistar/flaraImage/bestSellers_id1.jpg', description: 'A stylish and lightweight hat woven from natural fibres, perfect for sunny Indian afternoons.' },
  { id: 2, name: 'Incredible Linen Shirt', price: 699, category: 'c3', image: 'https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893464/bizvistar/flaraImage/bestSellers_id2.jpg', description: 'Experience ultimate comfort with this 100% linen shirt — breathable, elegant, and made for Indian summers.' },
  { id: 3, name: 'Practical Linen Shoes', price: 1199, category: 'c4', image: 'https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893465/bizvistar/flaraImage/bestSellers_id3.jpg', description: 'Breathable, comfortable, and effortlessly stylish. Your perfect everyday companion for long city walks.' },
  { id: 4, name: 'Fantastic Paper Pants', price: 599, category: 'c3', image: 'https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893468/bizvistar/flaraImage/bestSellers_id4.jpg', description: 'Lightweight and flowy pants designed for maximum comfort and style on the go.' },
  { id: 5, name: 'Soothing Lavender Candle', price: 499, category: 'c1', image: 'https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893491/bizvistar/flaraImage/collection1.jpg', description: 'Unwind with the calming scent of pure lavender. Hand-poured with soy wax and cotton wicks.' },
  { id: 6, name: 'Ocean Breeze Candle', price: 499, category: 'c1', image: 'https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893507/bizvistar/flaraImage/feature2_image1.jpg', description: 'Bring the fresh aroma of the ocean coast into your home. Clean, invigorating, and uplifting.' },
  { id: 7, name: 'Warm Vanilla Candle', price: 499, category: 'c1', image: 'https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893510/bizvistar/flaraImage/feature2_image2.jpg', description: 'A cozy and comforting aroma of sweet vanilla bean and warm Indian spices.' },
  { id: 8, name: 'Classic Button Shirt', price: 899, category: 'c2', image: 'https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893493/bizvistar/flaraImage/collection2.jpg', description: 'A timeless wardrobe essential — crisp, breathable, and effortlessly versatile.' }
];

export const businessData = {
    // --- GENERAL BUSINESS INFO ---
    name: "Candlea",
    logoText: "Candlea",
    whatsappNumber: "91123456789", 
    announcementBar: "Free shipping on all orders of ₹899 or more", // <-- ADDED
    
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
      { name: 'Home', path: '' },
      { name: 'Shop', path: '/shop' },
      { name: 'Product (Example)', path: '/product/1' },
      { name: 'Checkout', path: '/checkout' }
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
        { href: "", label: "Home" },
        { href: "/shop", label: "Shop" },
    ],

    // --- PAGE SECTIONS ---
    hero: {
        title: "Crafting moments of tranquility",
        subtitle: "Discover our carefully crafted collection, each thoughtfully made to help you unwind, relax, and embrace serenity in your everyday life.",
        cta: "Shop Now",
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893519/bizvistar/flaraImage/hero_image.jpg"
    },
    
    infoBar: [
        "Ready to ignite a fresh experience?",
        "Handcrafted with love in India.",
        "Discover your new favourite scent."
    ],

    feature1: {
        title: "Crafting warmth & serenity in every detail",
        text: "We believe in the power of quality products to transform spaces and uplift moods. Our passion for crafting high-quality, eco-friendly items drives everything we do — from sourcing the best natural materials to hand-finishing every batch.",
        subtext: "Whether you're looking to create a cozy atmosphere at home, find the perfect gift, or simply unwind after a long day, our carefully curated collection offers something special for every moment.",
        cta: "About Us",
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893498/bizvistar/flaraImage/feature1_image.jpg"
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
        title: "Embrace the serenity of peaceful experiences",
        text: "Indulge in the serene and calming experience our products offer — each item is crafted to transform your space into a peaceful sanctuary of calm and joy.",
        subtext: "Treat yourself to the soothing embrace of our products inspired by nature, carefully curated to bring balance and relaxation to your everyday life.",
        image1: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893507/bizvistar/flaraImage/feature2_image1.jpg", 
        image2: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893510/bizvistar/flaraImage/feature2_image2.jpg", 
    },
    
    blog: {
        title: "Our blog",
        items: [
            { date: "MAR 15, 2026", title: "5 ways scented candles can transform your evening ritual", text: "From unwinding after a long day to setting the mood for a cozy dinner at home, discover how candles can elevate your daily routine...", image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893473/bizvistar/flaraImage/blogImage1.jpg" },
            { date: "MAR 10, 2026", title: "The art of choosing the perfect candle for every room in your home", text: "Not all candles are created equal. Learn how to match fragrances to spaces — from energizing citrus for the kitchen to calming lavender for the bedroom...", image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893476/bizvistar/flaraImage/blogImage2.jpg" },
            { date: "FEB 28, 2026", title: "Why soy wax candles are better for you and the environment", text: "Soy wax burns cleaner, lasts longer, and is 100% biodegradable. Here's why making the switch to soy is the smartest choice for conscious living...", image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893479/bizvistar/flaraImage/blogImage3.jpg" },
            { date: "FEB 20, 2026", title: "Gifting candles: A thoughtful present for every occasion", text: "Whether it's Diwali, a housewarming, or a birthday — a beautifully packaged candle is always the perfect gift. Here's our guide to gifting scents...", image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893485/bizvistar/flaraImage/blogImage4.jpg" },
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
            { name: "Candles", url: "/shop" },
            { name: "Apparel", url: "/shop" }
          ],
          getHelp: [
            { name: "Contact Us", url: "#" },
            { name: "Shipping", url: "#" },
            { name: "Returns", url: "#" }
          ]
        },
        copyright: "© 2026 Candlea. All Rights Reserved."
      }
    };