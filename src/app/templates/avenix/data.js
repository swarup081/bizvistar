// This object contains all the dynamic content AND theme for the site.

export const businessData = {
    // --- GENERAL BUSINESS INFO ---
    name: "NIXIV",
    logoText: "NIXIV",
    
    // --- THEME SECTION ---
    theme: {
        colorPalette: 'nixiv-minimal', 
        font: {
            heading: 'Cormorant Garamond', 
            body: 'DM Sans'              
        }
    },

    // --- NAVIGATION ---
    navigation: {
        main: [
            { href: "#shop", label: "SHOP" },
            { href: "#story", label: "OUR STORY" },
            { href: "#blogs", label: "BLOGS" },
        ],
        secondary: [
            { href: "#collection", label: "COLLECTION" },
            { href: "#contact", label: "CONTACT US" },
        ]
    },

    // --- PAGE SECTIONS ---
    
    // --- Heels Hero Section (from ...8.21.16...) ---
    heelsHero: {
        line1: "Keep your head",
        line2: "HEELS",
        line3: "& standards",
        bentText: "HIGH",
        buttonText: "VIEW TRENDS",
        image: "/avenix/pew-nguyen-Ib0H1MGt5yw-unsplash.jpg",
        accentColor: "#4F46E5", // text-indigo-600
        buttonColor: "#D3FB52"  // Lime green from screenshot
    },

    // --- About Section (from ...8.14.47...) ---
    about: {
        heading: "ABOUT NIXIV",
        subheading: {
            part1: "A fashion space where style meets comfort,",
            part2: "bringing timeless trends and modern looks for every mood and occasion."
        },
        inlineImages: [
            "/avenix/michael-austin-jgSAuqMmJUE-unsplash.jpg", 
            "/avenix/jason-briscoe-w2uvoJo_woE-unsplash.jpg", 
            "/avenix/stefan-stefancik-w_Mj-SsE1mI-unsplash.jpg"  
        ],
        statement: "Nixiv delivers fashion that fits your mood & moment",
        largeImage: "/avenix/micheile-henderson-FpPcoOAk5PI-unsplash.jpg" 
    },

    // --- Featured Products (from ...8.09.19...) ---
    featured: {
        sectionHeading: "OUR COLLECTIONS",
        title: "Featured Products",
        largeImage: "/avenix/mahdi-chaghari-TlwDP1sa1mQ-unsplash.jpg",
        items: [
            { 
                id: 1, 
                name: "CUBAN COLLAR SHIRT", 
                price: "55.00",
                image: "/avenix/tian-dayong-8UsQoiJLNNQ-unsplash.jpg"
            },
            { 
                id: 2, 
                name: "KNIT POLO SHIRT", 
                price: "65.00",
                image: "/avenix/ihor-rapita-Dy_WYJHrhO8-unsplash.jpg"
            },
        ]
    },

    // --- CTA Section (from ...8.09.04...) ---
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

    // --- Other Sections ---
    categories: [
        { name: "Outerwear", image: "https://placehold.co/600x800/ccc/666?text=Outerwear" },
        { name: "Dress", image: "https://placehold.co/600x800/ccc/666?text=Dress" },
        { name: "Tops", image: "https://placehold.co/600x800/ccc/666?text=Tops" },
    ], 

    brands: {
        heading: "Nixiv helps you dress with purpose and personality",
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

    newArrivals: {
        heading: "NEW ARRIVALS",
        title: "Latest Products",
        items: [
            { 
                id: 1, 
                name: "SLEEVELESS V-NECK TOP", 
                description: "Striped sleeveless top with V-neck and halter button detail.",
                image: "/avenix/md-ishak-raman-GdZMLxhqNhU-unsplash.jpg"
            },
            { 
                id: 2, 
                name: "CASUAL SPORTS CAP", 
                description: "Lightweight sporty cap for comfort and sun-ready style.",
                image: "/avenix/mediamodifier-F5i3PZXYkvY-unsplash.jpg"
            },
            { 
                id: 3, 
                name: "HOODED SWEATSHIRT", 
                description: "Everyday hoodie with a relaxed shape and cozy feel.",
                image: "/avenix/ihor-rapita-KkvbXU0teEM-unsplash.jpg"
            },
            { 
                id: 4, 
                name: "WIDE-LEG TROUSERS", 
                description: "Wide-leg pants with raw hems and a relaxed, easy fit.",
                image: "/avenix/everdrop-gmbh-cDOMVV5Eaxw-unsplash.jpg"
            },
        ]
    },

    stats: {
        title: "Nixiv in Numbers",
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

    // --- *** FOOTER DATA CHANGED *** ---
    footer: {
        logo: "NIXIV",
        description: "Designed by Nixar. Powered by Webflow",
        contact: {
            phone: "+(123) 456-7890",
            email: "info@example.com",
            address: "4517 Washington Ave. Manchester, Kentucky 39495"
        },
        links: {
            main: [
                { name: "About us", url: "#" },
                { name: "Categories", url: "#" },
                { name: "Blogs", url: "#" },
                { name: "Shop", url: "#" },
                { name: "Contact us", url: "#" },
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
        copyright: "© 2025 Νίχιν,",
        // --- THIS IS THE NEW DYNAMIC PART ---
        // Add your full URLs here.
        // Use "instagram", "facebook", "youtube", or "twitter" as the platform name.
        socials: [
            { platform: "instagram", url: "https://instagram.com/your-username" },
            { platform: "facebook", url: "https://facebook.com/your-page" },
            { platform: "youtube", url: "https://youtube.com/your-channel" },
            { platform: "twitter", url: "https://twitter.com/your-handle" },
        ]
    }
    // --- *** END OF CHANGE *** ---
};