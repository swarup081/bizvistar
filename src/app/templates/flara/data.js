// This object contains all the dynamic content AND theme for the site.

export const businessData = {
    // --- GENERAL BUSINESS INFO ---
    name: "Candlea",
    logoText: "Candlea", // From screenshot
    whatsappNumber: "91123456789", 

    // --- THEME SECTION ---
    theme: {
        colorPalette: 'sage-green',
        font: {
            heading: 'Lora',
            body: 'Montserrat'
        }
    },

    // --- NAVIGATION ---
    navigation: [
        { href: "#home", label: "Home" },
        { href: "#shop", label: "Shop" },
        { href: "#blog", label: "Blog" },
        { href: "#contact", label: "Contact" },
    ],

    // --- PAGE SECTIONS (from screenshots) ---
    hero: {
        title: "Crafting moments of tranquility",
        subtitle: "Discover our collection of soothing candles, each one thoughtfully made to help you unwind.",
        cta: "Shop Now",
        image: "/flaraImage/hero_image.jpg" // From screenshot
    },
    
    infoBar: [
        "Ready to ignite a fresh experience?",
        "Handcrafted with love.",
        "Discover your new favorite scent."
    ],// Updated text

    feature1: {
        title: "Crafting warmth & serenity in every flame",
        text: "At Candlea, we believe in the power of scent to transform spaces and uplift moods. Our passion for crafting high-quality, eco-friendly candles drives everything we do.",
        subtext: "Whether you're looking to create a cozy atmosphere or find the perfect gift, our carefully curated collection offers something special for every moment. Join us in embracing the warmth, tranquility, and beauty that our candles bring to your home.",
        cta: "About Us",
        image: "/flaraImage/feature1_image.jpg"
    },
    
    collection: {
        title: "Our collection",
        items: [
            { id: 1, name: "Scented candles", image: "/flaraImage/collection1.jpg" },
            { id: 2, name: "Button Shirt", image: "/flaraImage/collection2.jpg" },
            { id: 3, name: "Cartridge", image: "/flaraImage/collection3.jpg" },
        ]
    },

    bestSellers: {
        title: "Our best seller",
        items: [
            { id: 1, name: 'Lightweight Granite Hat', price: 299, category: 'Button Shirt', image: '/flaraImage/bestSellers_id1.jpg' },
            { id: 2, name: 'Incredible Linen Shirt', price: 211, category: 'Cashmere', image: '/flaraImage/bestSellers_id2.jpg' },
            { id: 3, name: 'Practical Linen Shoes', price: 319, category: 'Cashmere', image: '/flaraImage/bestSellers_id3.jpg' },
            { id: 4, name: 'Fantastic Paper Pants', price: 119, category: 'Cashmere', image: '/flaraImage/bestSellers_id4.jpg' },
        ]
    },
    
    feature2: {
        title: "Embrace the serenity of peaceful scents",
        text: "Indulge in the serene and calming aromas that our candles offer, transforming your space into a peaceful haven. Let the gentle, soothing scents wash over you.",
        subtext: "Treat yourself to the soothing embrace of our peaceful scents, carefully crafted to transform your space into a sanctuary of calm and relaxation.",
        image1: "/flaraImage/feature2_image1.jpg", 
        image2: "/flaraImage/feature2_image2.jpg", 
    },

    // POINT 5: "features" array removed
    
    blog: {
        title: "Our blog",
        items: [
            { date: "NOV 19, 2024", title: "Nullam ullamcorper nisl quis ornare molestie", text: "Suspendisse posuere, diam in bibendum lobortis, turpis ipsum aliquam risus, sit amet...", image: "/flaraImage/blogImage1.jpg" },
            { date: "NOV 19, 2024", title: "Turpis at eleifend leo mi elit Aenean porta ac sed faucibus", text: "Turpis at eleifend leo mi elit Aenean porta ac sed faucibus. Nunc urna Morbi fringilla vitae...", image: "/flaraImage/blogImage2.jpg" },
            { date: "NOV 19, 2024", title: "Morbi condimentum molestie Nam enim odio sodales", text: "Sed mauris Pellentesque elit Aliquam at lacus interdum nascetur elit ipsum. Enim ipsum...", image: "/flaraImage/blogImage3.jpg" },
            { date: "NOV 19, 2024", title: "Urna pretium elit mauris cursus Curabitur at elit Vestibulum", text: "Mi vitae magnis Fusce laoreet nibh felis porttitor laoreet Vestibulum faucibus. At Nulla...", image: "/flaraImage/blogImage4.jpg" },
        ]
    },

    // --- FOOTER (from PDF Page 5) ---
    footer: {
        links: {
          about: [
            { name: "Our Story", url: "#" },
            { name: "Careers", url: "#" },
            { name: "Sustainability", url: "#" }
          ],
          categories: [
            { name: "Candles", url: "#" },
            { name: "Gift Sets", url: "#" }
          ],
          getHelp: [
            { name: "Contact Us", url: "#" },
            { name: "Shipping", url: "#" },
            { name: "Returns", url: "#" }
          ]
        },
        copyright: "© 2025 Candlea. All Rights Reserved"
      }
    };
