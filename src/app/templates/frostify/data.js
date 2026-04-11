'use client';

// Define styles here so they are editable
const styleConfig = {
    colors: {
        primary: "#592E4F",       // Deep Plum/Violet
        secondary: "#9E5A85",     // Lighter Orchid/Mauve
        background: "#FFF5F8",    // Very Pale Pink
        surface: "#FFFFFF",       // Pure White
        textLight: "#7D5A6F",     // Muted Violet text
        footerBg: "#592E4F",      // Dark Footer background
        footerText: "#FFDDE6"     // Light Footer Text
    },
    fonts: {
        heading: "DM Serif Display", 
        body: "Quicksand"            
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
      price: 185.00,
      category: 'pastries',
      description: "Buttery, flaky pastry filled with rich dark Belgian chocolate.",
      image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893617/bizvistar/frostify/mae-mu-m9pzwmxm2rk-unsplash.jpg"
    },
    { 
      id: 2, 
      name: "LAVENDER LAYER CAKE", 
      price: 1650.00,
      category: 'cakes',
      description: "Three layers of vanilla sponge soaked in lavender syrup with buttercream frosting.",
      image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893598/bizvistar/frostify/junior-reis--72q2VOq90Q-unsplash.jpg"
    },
    { 
      id: 3, 
      name: "MACARON BOX", 
      price: 850.00,
      category: 'cookies',
      description: "A curated selection of 6 assorted French macarons in seasonal flavours.",
      image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893611/bizvistar/frostify/macaronfrostify.avif"
    },
    { 
      id: 4, 
      name: "ARTISAN SOURDOUGH", 
      price: 350.00,
      category: 'breads',
      description: "Slow-fermented sourdough with a crispy crust and chewy interior.",
      image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893608/bizvistar/frostify/kobby-mendez-q54Oxq44MZs-unsplash.jpg"
    },
    { 
        id: 5, 
        name: "BERRY TART", 
        price: 295.00,
        category: 'pastries',
        description: "Fresh seasonal berries atop a smooth vanilla custard in a buttery crust.",
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893584/bizvistar/frostify/cupcakefrostify.avif" 
    },
    { 
        id: 6, 
        name: "Chocolate Cake", 
        price: 1450.00,
        category: 'cakes',
        description: "Dense, fudgy chocolate cake with a rich ganache glaze — pure indulgence.",
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893583/bizvistar/frostify/chcocakefrostify.avif" 
    },
    { 
        id: 7, 
        name: "SOURDOUGH LOAF", 
        price: 299.00,
        category: 'breads',
        description: "Freshly baked sourdough loaf with a deep, tangy flavour.",
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893603/bizvistar/frostify/katie-rosario-QNyRp21hb5I-unsplash.jpg" 
    },
    { 
        id: 8, 
        name: "BUTTER CAKE", 
        price: 225.00, 
        category: 'pastries',
        description: "Classic French butter cake — golden, moist, and irresistibly rich.",
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893618/bizvistar/frostify/paulina-kaminska-M9xYLiRnH_k-unsplash.jpg" 
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
      { name: 'Home', path: '' },
      { name: 'Menu', path: '/shop' },
      { name: 'Contact', path: '#contact' }
    ],

    // IDs for Editor Focus
    heroSectionId: "hero",
    aboutSectionId: "about",
    specialtiesSectionId: "specialties",
    gallerySectionId: "gallery",
    faqSectionId: "faq",
    footerSectionId: "footer",
    testimonialsSectionId: "testimonials",

    hero: {
        badge: "Made with Love",
        title: "Handcrafted Goodness in Every Detail",
        subtitle: "Freshly crafted with love, using the finest materials and ingredients sourced from trusted partners.",
        cta: "Explore Specialties",
        image1: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893582/bizvistar/frostify/cakeheroimage.avif",
        image2: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893624/bizvistar/frostify/sincerely-media-z10eH_RA6ZQ-unsplash.jpg"
    },

    about: {
        title: "Meet Our Founder",
        text: "Our founder believes the best products are made with love, patience, and the finest ingredients. With years of experience and a deep passion for quality, we create items that bring joy to every moment.",
        subtext: "Come visit and experience our creations — you'll fall in love instantly!",
        image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_800/v1775893588/bizvistar/frostify/frostifybaleryface.png"
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
    
    gallery: {
        title: "Fresh from the Oven",
        // Store IDs here, mirroring how Aurora/Flara work for consistency in EditorSidebar
        items: [5, 6, 4, 1] 
    },

    faq: {
        title: "Got Questions? We've Got Answers!",
        questions: [
            { q: "CAKE SIZES & PRICING", a: "We offer 6\", 8\", and 10\" cakes starting at ₹1,200." },
            { q: "FLAVOURS", a: "Our standard flavours are Vanilla, Chocolate, Red Velvet, Butterscotch, and Pineapple." },
            { q: "DO YOU MAKE CUSTOM CAKES?", a: "Yes! We specialise in custom designs for weddings, birthdays, and festive occasions." },
            { q: "HOW MUCH NOTICE DO YOU NEED?", a: "We require at least 2 days' notice for custom orders. Same-day available for select items." },
            { q: "DO YOU OFFER EGGLESS OPTIONS?", a: "Absolutely! We have a wide range of eggless cakes, cookies, and pastries." }
        ]
    },

    testimonials: {
        title: "Client Love",
        items: [
            {
                text: "The quality here is the best I've ever experienced! Perfectly crafted, and absolutely divine.",
                author: "Meera S.",
                image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_400/v1775911466/bizvistar/frostify/testimonial_avatar_1.jpg"
            },
            {
                text: "Ordered a custom piece for my daughter and it was breathtaking. It was even better than expected!",
                author: "Arjun D.",
                image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_400/v1775911468/bizvistar/frostify/testimonial_avatar_2.jpg"
            },
            {
                text: "My go-to spot for everyday essentials. The warmth of this business is unmatched — feels like family.",
                author: "Kavya R.",
                image: "https://res.cloudinary.com/drg4lzk9s/image/upload/f_auto,q_auto,w_400/v1775911469/bizvistar/frostify/testimonial_avatar_3.jpg"
            }
        ]
    },

    footer: {
        contactTitle: "Contact us",
        copyright: "© 2026 Sweet Delight. Built on Bizvistar.",
        socials: [ 
            { platform: "IG", url: "#" }, 
            { platform: "FB", url: "#" }, 
            { platform: "TK", url: "#" } 
        ],
        openingHours: {
            monFri: "Monday – Friday: 8:00 AM – 8:00 PM",
            sat: "Saturday: 9:00 AM – 9:00 PM",
            sun: "Sunday: 10:00 AM – 6:00 PM"
        },
        contact: {
            phone: "+91 98765 12345",
            email: "orders@sweetdelight.in"
        }
    }
};