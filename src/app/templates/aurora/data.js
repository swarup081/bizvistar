'use client';

const categories = [
    { id: 'rings', name: 'Rings' },
    { id: 'necklaces', name: 'Necklaces' },
    { id: 'bracelets', name: 'Bracelets' },
    { id: 'earrings', name: 'Earrings' },
];

const allProducts = [
    { 
      id: 1, 
      name: "SOLITAIRE DIAMOND RING", 
      price: 1250.00,
      category: 'rings',
      description: "A timeless solitaire diamond ring set in 18k white gold.",
      image: "https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&q=80&w=800"
    },
    { 
      id: 2, 
      name: "EMERALD CUT NECKLACE", 
      price: 890.00,
      category: 'necklaces',
      description: "Stunning emerald cut pendant suspended from a delicate gold chain.",
      image: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?auto=format&fit=crop&q=80&w=800"
    },
    { 
      id: 3, 
      name: "GOLD CUFF BRACELET", 
      price: 450.00,
      category: 'bracelets',
      description: "Handcrafted gold cuff bracelet with intricate detailing.",
      image: "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&q=80&w=800"
    },
    { 
      id: 4, 
      name: "PEARL DROP EARRINGS", 
      price: 299.00,
      category: 'earrings',
      description: "Classic pearl drop earrings that add a touch of sophistication.",
      image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=800"
    },
    { 
        id: 5, 
        name: "RUBY STATEMENT RING", 
        price: 1450.00,
        category: 'rings',
        description: "A bold ruby centerpiece surrounded by crushed diamonds.",
        image: "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&q=80&w=800"
    },
    { 
        id: 6, 
        name: "SAPPHIRE NECKLACE", 
        price: 1890.00,
        category: 'necklaces',
        description: "Deep blue sapphire pendant.",
        image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800"
    },
];

export const businessData = {
    name: "Aurora",
    logoText: "Aurora",
    categories: categories,
    allProducts: allProducts,
    
    pages: [
      { name: 'Home', path: '/templates/diamondbd' },
      { name: 'Shop', path: '/templates/diamondbd/shop' },
      { name: 'Checkout', path: '/templates/diamondbd/checkout' }
    ],

    // IDs for Editor Focus
    heroSectionId: "hero",
    aboutSectionId: "story",
    collectionSectionId: "collection",
    featuresSectionId: "features",
    testimonialsSectionId: "testimonials",
    instagramSectionId: "instagram",
    faqSectionId: "faq",
    blogSectionId: "blog",
    ctaSectionId: "cta", // NEW ID
    footerSectionId: "footer",

    navigation: {
        main: [
            { href: "/templates/diamondbd", label: "HOME" },
            { href: "/templates/diamondbd/shop", label: "COLLECTION" },
            { href: "/templates/diamondbd#story", label: "ABOUT" },
            { href: "/templates/diamondbd#blog", label: "BLOG" },
            { href: "#", label: "PAGES" },
        ],
        secondary: []
    },

    hero: {
        titleLine1: "Choose jewelry with",
        titleLine2: "heart & feelings",
        subtitle: "Welcome to a realm of timeless beauty and unparalleled craftsmanship. At DiamondBD, we invite you to adorn yourself in the finest expressions of luxury.",
        cta: "EXPLORE COLLECTIONS",
        // Large Arch Slideshow Images
        imageArch1: "/aurora/kamran-abdullayev-WQ-f4ux5xX0-unsplash.jpg",
        imageArch1_b: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=1000", 
        // Small Arch Image (Detail Shot)
        imageSmallArch: "/aurora/jasmin-chew-UBeNYvk6ED0-unsplash.jpg"
    },

    features: [
        {
            title: "FAST SHIPPING",
            text: "Express delivery worldwide.",
            icon: "fast_shipping"
        },
        {
            title: "FLEXIBLE PAYMENT",
            text: "Multiple secure payment options.",
            icon: "card"
        },
        {
            title: "CERTIFIED DIAMONDS", 
            text: "All gems are GIA certified authentic.",
            icon: "certified" 
        },
        {
            title: "ETHICAL SOURCING",
            text: "Conflict-free, sustainable stones.",
            icon: "ecology"
        }
    ],

    about: {
        title: "The Diamondbd Legacy",
        text: "Established in 1920, DiamondBD began as a humble atelier in the heart of the artisan district. For over a century, we have remained true to our founding principles: uncompromising quality, artistic innovation, and a deep respect for the gemstones we work with.",
        image: "https://images.unsplash.com/photo-1531995811006-35cb42e1a022?auto=format&fit=crop&q=80&w=1000",
        cta: "LEARN MORE"
    },

    collections: {
        title: "Curated Collections",
        subtitle: "Indulge in the opulence of handcrafted necklaces, bracelets, earrings, and rings, each a masterpiece in its own right.",
        itemIDs: [1, 2, 3]
    },

    testimonials: {
        title: "Client Experiences",
        items: [
            {
                quote: "The attention to detail is simply extraordinary. I've never felt more special wearing a piece of jewelry.",
                author: "Victoria Sterling",
                location: "London, UK"
            },
            {
                quote: "A good chain in Bangladesh for having diamond jewellery. Staffs are quite friendly and helpful. It is big showroom.",
                author: "Connie H. Tengan",
                location: "Dhaka, Bangladesh"
            }
        ]
    },

    // NEW CTA SECTION DATA
    newsletterCta: {
        title: "Unlock Exclusive Access",
        text: "Sign up to receive invitations to private viewings, early access to new collections, and expert advice on building your jewelry heirloom.",
        placeholder: "Enter your email address",
        buttonText: "SUBSCRIBE NOW"
    },

    instagram: {
        title: "@diamondbd_official",
        handle: "Follow our journey",
        images: [
            "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1608042314453-ae338d80c427?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1598560976315-1823d92f6e21?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&q=80&w=400",
            "https://images.unsplash.com/photo-1586104139863-795a12398cb0?auto=format&fit=crop&q=80&w=400"
        ]
    },

    faq: {
        title: "Frequently Asked Questions",
        subtitle: "Embark on a journey of knowledge as we address the most common queries about our exquisite jewelry collection.",
        questions: [
            { q: "Designed To Match Your Lifestyle?", a: "Yes, our pieces are crafted for daily wear." },
            { q: "Diamond Jewelry Shopping?", a: "We offer certified diamond jewelry with warranties." },
            { q: "Gold Jewelry Shopping at Diamond BD", a: "Our gold collection is 100% pure 18k and 22k gold." },
            { q: "Can I re-size my Ring?", a: "Yes, we offer complimentary resizing within 30 days." },
            { q: "What if I don't know the ring size?", a: "Visit our store or use our online guide." }
        ]
    },

    blog: {
        title: "The Journal",
        items: [
            {
                title: "Eid Special Collection Sale 2024",
                date: "JAN 19, 2024",
                author: "Sajib Hossain",
                image: "https://images.unsplash.com/photo-1584302179602-e4c3d3fd629d?auto=format&fit=crop&q=80&w=800"
            },
            {
                title: "How To Measure Ring Size at Home",
                date: "JAN 4, 2024",
                author: "Mufrat Nir",
                image: "https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&q=80&w=800"
            },
            {
                title: "Investing in Timeless Beauty",
                date: "JAN 3, 2024",
                author: "Nila Akter",
                image: "https://images.unsplash.com/photo-1576158187530-98191b0816d3?auto=format&fit=crop&q=80&w=800"
            }
        ]
    },

    footer: {
        logo: "DIAMONDBD",
        description: "A legacy of brilliance, crafted for eternity.",
        subscribe: {
            title: "Be the first to know our diamondbd news",
            cta: "SUBMIT"
        },
        copyright: "© 2024 DiamondBD. All rights reserved.",
        links: {
            main: [
                { name: "Home", url: "/templates/diamondbd" },
                { name: "About", url: "/templates/diamondbd#story" },
                { name: "Shop", url: "/templates/diamondbd/shop" },
                { name: "Blog", url: "/templates/diamondbd#blog" }
            ],
            utility: [
                { name: "Terms & Conditions", url: "#" },
                { name: "Privacy Policy", url: "#" },
                { name: "Cookie Policy", url: "#" }
            ]
        }
    }
};