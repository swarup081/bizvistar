'use client';

// Define styles here so they are editable
const styleConfig = {
    colors: {
        primary: "#592E4F",       // Deep Plum/Violet (Headings, Footer, Buttons)
        secondary: "#9E5A85",     // Lighter Orchid/Mauve (Accents)
        background: "#FFF5F8",    // Very Pale Pink (Main Background)
        surface: "#FFFFFF",       // Pure White (Cards)
        textLight: "#7D5A6F",     // Muted Violet text
        footerBg: "#592E4F",      // Dark Footer background
        footerText: "#FFDDE6"     // Light Footer Text
    },
    fonts: {
        heading: "DM Serif Display", // Elegant Serif (Matches 'Sweet Delight')
        body: "Quicksand"            // Rounded Sans-serif (Matches body text)
    }
};

const categories = [
    { id: 'cakes', name: 'Custom Cakes' },
    { id: 'pastries', name: 'Baked Pastries' },
    { id: 'cookies', name: 'Homemade Cookies' },
    { id: 'breads', name: 'Artisan Breads' },
];

const allProducts = [
    { 
      id: 1, 
      name: "CHOCOLATE CROISSANT", 
      price: 6.50,
      category: 'pastries',
      description: "Buttery, flaky pastry filled with dark Belgian chocolate.",
      image: "https://images.unsplash.com/photo-1555507036-ab1f40388085?auto=format&fit=crop&q=80&w=800"
    },
    { 
      id: 2, 
      name: "LAVENDER LAYER CAKE", 
      price: 55.00,
      category: 'cakes',
      description: "Three layers of vanilla sponge soaked in lavender syrup with buttercream.",
      image: "https://images.unsplash.com/photo-1588195538326-c5f1f23fa438?auto=format&fit=crop&q=80&w=800"
    },
    { 
      id: 3, 
      name: "MACARON BOX", 
      price: 24.00,
      category: 'cookies',
      description: "A selection of 6 assorted French macarons.",
      image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&q=80&w=800"
    },
    { 
      id: 4, 
      name: "ARTISAN SOURDOUGH", 
      price: 12.00,
      category: 'breads',
      description: "Slow-fermented sourdough with a crispy crust.",
      image: "https://images.unsplash.com/photo-1585476644321-b976d9996596?auto=format&fit=crop&q=80&w=800"
    }
];

export const businessData = {
    // --- Global Configuration ---
    name: "Sweet Delight",
    logoText: "Sweet Delight",
    logoUrl: "",
    styleConfig: styleConfig,
    categories: categories,
    allProducts: allProducts,
    
    pages: [
      { name: 'Home', path: '/templates/frostify' },
      { name: 'Menu', path: '/templates/frostify/menu' },
      { name: 'Contact', path: '/templates/frostify#contact' }
    ],

    // IDs for Editor Focus
    heroSectionId: "hero",
    aboutSectionId: "about",
    specialtiesSectionId: "specialties",
    gallerySectionId: "gallery",
    faqSectionId: "faq",
    footerSectionId: "footer",

    hero: {
        badge: "Made with Love",
        title: "Homemade Goodness in Every Bite",
        subtitle: "Freshly baked with love, using the finest ingredients.",
        cta: "Explore Treats",
        // Image 1 (Macarons/Pastries - Left side)
        image1: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&q=80&w=800",
        // Image 2 (Cake - Right side)
        image2: "https://images.unsplash.com/photo-1558301211-0d8c8ddee6ec?auto=format&fit=crop&q=80&w=800"
    },

    about: {
        title: "Meet Johanna",
        text: "Johanna, the heart behind Sweet Delight, believes the best treats are made with love and the finest ingredients. With years of baking experience, she creates delicious homemade pastries that bring joy to every bite.",
        subtext: "Come visit and taste Johanna's creations—you'll love every bite!",
        image: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&q=80&w=800"
    },

    specialties: {
        title: "Our Specialties",
        items: [
            { title: "Baked Pastries", icon: "croissant" },
            { title: "Custom Cakes", icon: "cake" },
            { title: "Homemade Cookies", icon: "cookie" },
            { title: "Artisan Breads", icon: "bread" }
        ]
    },
    

    // Used for the gallery strip in the image
    gallery: {
        images: [
            "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&q=80&w=400", // Ice cream/dessert
            "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&q=80&w=400", // Cake
            "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=400", // Bread
            "https://images.unsplash.com/photo-1488477181946-6428a029177b?auto=format&fit=crop&q=80&w=400"  // Croissant
        ]
    },

    faq: {
        title: "Got Questions? We've Got Answers!",
        questions: [
            { q: "CAKE SIZES & PRICING", a: "We offer 6\", 8\", and 10\" cakes starting at $45." },
            { q: "FLAVOURS", a: "Our standard flavors are Vanilla, Chocolate, Red Velvet, and Lemon." },
            { q: "DO YOU MAKE CUSTOM CAKES?", a: "Yes! We specialize in custom designs for weddings and birthdays." },
            { q: "HOW MUCH NOTICE DO YOU NEED?", a: "We require at least 2 weeks notice for custom orders." },
            { q: "DO YOU OFFER GLUTEN-FREE?", a: "Yes, we have a selection of gluten-free cupcakes and cookies." }
        ]
    },

    footer: {
        contactTitle: "Contact us",
        copyright: "© 2026 by Sweet Delight. Built on BizVistar.",
        socials: [ "IG", "FB", "TK" ]
    }
};