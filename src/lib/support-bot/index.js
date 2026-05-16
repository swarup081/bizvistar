// Vista Chatbot — Main Engine
// Combines all intents, language detection, matching, and contextual suggestions.

import Fuse from 'fuse.js';
import { productIntents } from './intents/products';
import { orderIntents } from './intents/orders';
import { websiteIntents } from './intents/website';
import { billingIntents } from './intents/billing';
import { analyticsIntents } from './intents/analytics';
import { profileIntents } from './intents/profile';
import { onboardingIntents } from './intents/onboarding';
import { navigationIntents } from './intents/navigation';
import { generalIntents } from './intents/general';
import { offerIntents } from './intents/offers';
import { customerIntents } from './intents/customers';

// ═══════════════════════════════════════════════════════
//  COMBINE ALL INTENTS
// ═══════════════════════════════════════════════════════
const ALL_INTENTS = [
  ...productIntents,
  ...orderIntents,
  ...websiteIntents,
  ...billingIntents,
  ...analyticsIntents,
  ...profileIntents,
  ...onboardingIntents,
  ...navigationIntents,
  ...generalIntents,
  ...offerIntents,
  ...customerIntents,
];

// ═══════════════════════════════════════════════════════
//  FUSE.JS — Fuzzy matching engine
// ═══════════════════════════════════════════════════════
const fuse = new Fuse(ALL_INTENTS, {
  includeScore: true,
  threshold: 0.35, // Tighter matching for better accuracy
  keys: ['keywords'],
  minMatchCharLength: 2,
});

// ═══════════════════════════════════════════════════════
//  LANGUAGE DETECTION
// ═══════════════════════════════════════════════════════
const HINDI_MARKERS = [
  'kaise', 'karo', 'kya', 'hai', 'hain', 'mera', 'meri', 'mere', 'kitna', 'kitne', 'kitni',
  'dikhao', 'batao', 'kaha', 'kahan', 'chahiye', 'karna', 'karni', 'kare', 'badle', 'hatao',
  'daalo', 'lagao', 'banao', 'banana', 'bana', 'nahi', 'naya', 'nayi', 'purana', 'wala',
  'wali', 'abhi', 'pehle', 'baad', 'zyada', 'kam', 'accha', 'bura', 'theek', 'bhejo',
  'dena', 'lena', 'rakhna', 'nikalo', 'dekho', 'suno', 'bolo', 'samjhao', 'madad',
  'dhundho', 'kholo', 'band', 'shuru', 'khatam', 'hogaya', 'hogya', 'krna', 'krni',
  'bika', 'bikaa', 'aaya', 'aaye', 'gaya', 'gayi', 'raha', 'rahi', 'sakta', 'sakti',
  'chahte', 'chahti', 'mangta', 'de do', 'kar do', 'bta do', 'btao', 'hota', 'hoti',
];

export function detectLanguage(text) {
  if (!text) return 'en';
  const words = text.toLowerCase().split(/\s+/);
  let hindiCount = 0;
  words.forEach(word => {
    if (HINDI_MARKERS.includes(word)) hindiCount++;
  });
  // If ≥30% of words are Hindi markers, consider it Hindi/Hinglish
  return (hindiCount / words.length) >= 0.3 ? 'hi' : 'en';
}

// ═══════════════════════════════════════════════════════
//  WARM GREETINGS — Time-aware, human-feeling
// ═══════════════════════════════════════════════════════
function getWarmGreeting(ownerName) {
  const hour = new Date().getHours();
  const name = ownerName || '';
  const nameStr = name ? `, ${name}` : '';

  const morningGreetings = [
    `Good morning${nameStr}! ☀️ Hope your day's off to a great start. How can I help you today?`,
    `Morning${nameStr}! 🌅 Ready to make today awesome? What can I do for you?`,
    `Hey${nameStr}! Good morning! ☀️ How's your day going so far? I'm here to help!`,
  ];
  const afternoonGreetings = [
    `Good afternoon${nameStr}! 🌤️ How's your day going? Let me know if you need anything!`,
    `Hey${nameStr}! 👋 Hope you're having a productive afternoon. What can I help with?`,
    `Hi${nameStr}! 🌞 Afternoon check-in — need help with anything?`,
  ];
  const eveningGreetings = [
    `Good evening${nameStr}! 🌙 Hope you had a great day. What can I help with before you wrap up?`,
    `Hey${nameStr}! 🌆 Evening! How did the store do today? Need any help?`,
    `Hi${nameStr}! 🌙 Winding down? Let me know if there's anything I can help with!`,
  ];
  const generalGreetings = [
    `Hey${nameStr}! 👋 Great to see you! How can I help today?`,
    `Hi${nameStr}! 😊 What can I do for you?`,
    `Hello${nameStr}! 👋 I'm here to help — ask me anything!`,
  ];

  let pool;
  if (hour >= 5 && hour < 12) pool = morningGreetings;
  else if (hour >= 12 && hour < 17) pool = afternoonGreetings;
  else if (hour >= 17 && hour < 22) pool = eveningGreetings;
  else pool = generalGreetings;

  return pool[Math.floor(Math.random() * pool.length)];
}

// ═══════════════════════════════════════════════════════
//  EMPATHETIC INTERJECTIONS — Sprinkled between responses
// ═══════════════════════════════════════════════════════
const INTERJECTIONS = [
  "Great question! 😊 ",
  "Happy to help with that! ",
  "Good thinking! ",
  "Absolutely! ",
  "Sure thing! ",
  "Of course! ",
  "Let me help you with that! ",
  "I've got you covered! ",
  "",  // Sometimes no interjection (feels natural)
  "",
  "",
];

function getInterjection() {
  return INTERJECTIONS[Math.floor(Math.random() * INTERJECTIONS.length)];
}

// ═══════════════════════════════════════════════════════
//  CONTEXTUAL SUGGESTION MAP
// ═══════════════════════════════════════════════════════
const SUGGESTION_MAP = {
  products: [
    'How many products do I have?', 'Show low stock products', 'How to add a product?',
    'How to add categories?', 'How to add variants?', 'Product image tips',
    'What\'s the product limit?', 'How to edit a product?', 'Show out of stock items',
  ],
  orders: [
    'Show pending orders', 'How to ship an order?', 'How to add tracking?',
    'Export order data', 'Show today\'s orders', 'How to cancel an order?',
    'How many orders this month?', 'How to manage orders?',
  ],
  website: [
    'How to publish my site?', 'How to change template?', 'What is my site URL?',
    'How to change colors?', 'How to upload logo?', 'How to edit about section?',
    'SEO tips', 'Which template suits me?', 'Suggest a template for my business',
  ],
  billing: [
    'What is my current plan?', 'How much does it cost?', 'How to upgrade?',
    'How to pause subscription?', 'How does payment work?', 'How to set up UPI?',
  ],
  analytics: [
    'Show my sales this month', 'What are my top products?', 'How many visitors?',
    'Set monthly target', 'How to increase sales?', 'Export analytics data',
    'Show out of stock products', 'How to get more traffic?',
  ],
  profile: [
    'How to update my profile?', 'How to change password?', 'How to set delivery charges?',
    'How to update WhatsApp number?', 'How to change UPI?',
  ],
  onboarding: [
    'How to add my first product?', 'How to publish my website?', 'How to set up payments?',
    'How to share my store link?', 'Getting started checklist',
  ],
  navigation: [
    'Go to dashboard', 'Go to products', 'Go to orders', 'Go to analytics',
  ],
  general: [
    'What can you do?', 'How do I get started?', 'What is BizVistar?',
    'Contact support', 'Show my dashboard',
  ],
  offers: [
    'How to create an offer?', 'Show active offers', 'Offer types explained',
    'How to promote offers?',
  ],
  customers: [
    'How many customers do I have?', 'How to get more customers?', 'Show repeat customers',
    'Customer retention tips',
  ],
};

// Default suggestions for first load or no context
const DEFAULT_SUGGESTIONS = [
  'Show my sales', 'How to add a product?', 'Any pending orders?', 'Help me get started',
];

// Page-specific suggestions based on pathname
const PAGE_SUGGESTIONS = {
  '/dashboard': ['Show my sales', 'Any pending orders?', 'How many visitors?', 'Help me get started'],
  '/dashboard/website': ['Which template suits me?', 'How to publish?', 'How to change colors?', 'Suggest a template for my business'],
  '/dashboard/products': ['Add a product', 'Show low stock products', 'How to add categories?', 'How to add variants?'],
  '/dashboard/orders': ['Show pending orders', 'How to ship an order?', 'Show today\'s orders', 'How to cancel an order?'],
  '/dashboard/apps': ['Create an offer', 'Show active offers', 'How to promote offers?', 'What offer types are available?'],
  '/dashboard/profile': ['How to change my URL?', 'How to update WhatsApp?', 'How to set delivery charges?', 'How to change UPI?'],
};

/**
 * Get suggestions based on the current page (pathname).
 * Returns page-specific suggestions or null if no match.
 */
export function getPageSuggestions(pathname) {
  if (!pathname) return null;
  // Try exact match first
  if (PAGE_SUGGESTIONS[pathname]) return PAGE_SUGGESTIONS[pathname];
  // Try prefix match (e.g., /dashboard/products/123 → /dashboard/products)
  const keys = Object.keys(PAGE_SUGGESTIONS).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (pathname.startsWith(key)) return PAGE_SUGGESTIONS[key];
  }
  return null;
}

/**
 * Get contextual suggestions based on the matched intent category.
 * Picks from related categories to create a "flow" experience.
 */
export function getContextualSuggestions(matchedCategory, followUp) {
  // If the intent has specific followUp questions, use those first
  if (followUp && followUp.length > 0) {
    // Pad with related category suggestions if followUp is short
    if (followUp.length >= 3) return followUp.slice(0, 4);
    
    const relatedCats = getRelatedCategories(matchedCategory);
    const relatedSuggs = [];
    relatedCats.forEach(cat => {
      const pool = SUGGESTION_MAP[cat] || [];
      if (pool.length > 0) {
        relatedSuggs.push(pool[Math.floor(Math.random() * pool.length)]);
      }
    });
    return [...followUp, ...relatedSuggs].slice(0, 4);
  }

  // Fallback: pick from matched category + related categories
  const primaryPool = SUGGESTION_MAP[matchedCategory] || [];
  const relatedCats = getRelatedCategories(matchedCategory);
  const relatedPool = [];
  relatedCats.forEach(cat => {
    const pool = SUGGESTION_MAP[cat] || [];
    relatedPool.push(...pool);
  });

  // Pick 2 from primary, 2 from related
  const shuffled = arr => arr.sort(() => 0.5 - Math.random());
  const primary = shuffled([...primaryPool]).slice(0, 2);
  const related = shuffled([...relatedPool]).slice(0, 2);
  return [...primary, ...related];
}

/**
 * Get related categories for suggestion flow continuity
 */
function getRelatedCategories(category) {
  const relations = {
    products: ['orders', 'analytics', 'offers'],
    orders: ['products', 'analytics', 'customers'],
    website: ['products', 'onboarding', 'billing'],
    billing: ['website', 'profile', 'general'],
    analytics: ['products', 'orders', 'customers'],
    profile: ['billing', 'website', 'general'],
    onboarding: ['products', 'website', 'general'],
    navigation: ['general', 'products', 'orders'],
    general: ['onboarding', 'products', 'analytics'],
    offers: ['products', 'analytics', 'customers'],
    customers: ['orders', 'analytics', 'offers'],
  };
  return relations[category] || ['general', 'products'];
}

// ═══════════════════════════════════════════════════════
//  DATA QUERY PATTERN DETECTION
// ═══════════════════════════════════════════════════════
const DATA_QUERY_PATTERNS = [
  { pattern: /\b(sales|revenue|kamai|bikri|kamaya|bika|earning)\b/i, handler: 'getChatSalesData' },
  { pattern: /\b(how many products|product count|kitne product|total products|total items)\b/i, handler: 'getChatProductData' },
  { pattern: /\b(how many orders|order count|kitne order|total orders|pending orders)\b/i, handler: 'getChatOrderData' },
  { pattern: /\b(low stock|out of stock|stock kam|stock alert|stock khatam|stock warning)\b/i, handler: 'getChatStockAlerts' },
  { pattern: /\b(my plan|current plan|subscription|mera plan|konsa plan)\b/i, handler: 'getChatSubscriptionData' },
  { pattern: /\b(my website|site status|website url|meri site|mera website|site link)\b/i, handler: 'getChatWebsiteStatus' },
  { pattern: /\b(top products|best seller|sabse zyada|top selling|best performer)\b/i, handler: 'getChatTopProducts' },
  { pattern: /\b(how many customers|customer count|kitne customer|total customer)\b/i, handler: 'getChatCustomerData' },
  { pattern: /\b(active offer|running offer|current offer|live offer|mere offer)\b/i, handler: 'getChatOffersData' },
  { pattern: /\b(notification|alert|unread)\b/i, handler: 'getChatNotifications' },
  { pattern: /\b(visitor|traffic|page view|kitne log|kitne visitor|views kitne)\b/i, handler: 'getChatVisitorData' },
];

/**
 * Detect if the user's message is a data query that needs server-side data.
 * Returns the handler name or null.
 */
export function detectDataQuery(text) {
  if (!text) return null;
  for (const { pattern, handler } of DATA_QUERY_PATTERNS) {
    if (pattern.test(text)) return handler;
  }
  return null;
}

// ═══════════════════════════════════════════════════════
//  ACTION PATTERN DETECTION (update, change, set)
// ═══════════════════════════════════════════════════════
const ACTION_PATTERNS = [
  // "change price of [product] to [amount]" / "set price of [product] to [amount]"
  { pattern: /(?:change|update|set|badle)\s+(?:price|rate|daam)\s+(?:of\s+)?(.+?)\s+(?:to|ko|=)\s*₹?\s*(\d+(?:\.\d+)?)/i, handler: 'chatUpdateProductPrice', type: 'update_price' },
  // "[product] ka price [amount] karo"
  { pattern: /(.+?)\s+(?:ka|ki)\s+(?:price|rate|daam)\s+₹?\s*(\d+(?:\.\d+)?)\s*(?:karo|kro|kar do|set karo|rakh do)/i, handler: 'chatUpdateProductPrice', type: 'update_price' },
  // "change stock of [product] to [amount]"
  { pattern: /(?:change|update|set|badle)\s+(?:stock|inventory)\s+(?:of\s+)?(.+?)\s+(?:to|ko|=)\s*(\d+)/i, handler: 'chatUpdateProductStock', type: 'update_stock' },
  // "mark order #[id] as [status]"
  { pattern: /(?:mark|set|change)\s+order\s*#?\s*(\d+)\s+(?:as|to|status)\s+(pending|paid|shipped|delivered|cancel(?:ed)?)/i, handler: 'chatUpdateOrderStatus', type: 'update_order' },
];

export function detectActionQuery(text) {
  if (!text) return null;
  for (const { pattern, handler, type } of ACTION_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      return { handler, type, params: match.slice(1), originalText: text };
    }
  }
  return null;
}

// ═══════════════════════════════════════════════════════
//  ESCALATION DETECTION
// ═══════════════════════════════════════════════════════
const ESCALATION_PATTERNS = [
  /\b(refund|paisa wapas|money back)\b/i,
  /\b(bug|crash|error|not working|broken|kaam nahi)\b/i,
  /\b(payment fail|payment issue|paisa kata|charged but)\b/i,
  /\b(angry|frustrated|worst|terrible|bekaar|ghatiya)\b/i,
  /\b(talk to human|real person|customer care|support team|kisi se baat)\b/i,
  /\b(complaint|shikayat)\b/i,
];

export function shouldEscalate(text) {
  if (!text) return false;
  return ESCALATION_PATTERNS.some(p => p.test(text));
}

// ═══════════════════════════════════════════════════════
//  MAIN MATCH FUNCTION
// ═══════════════════════════════════════════════════════
/**
 * Find a matching intent for the user's message.
 * Returns: { response, category, followUp, isGreeting } or null
 */
export function findMatch(userText, ownerName) {
  if (!userText) return null;

  const results = fuse.search(userText);

  if (results.length > 0 && results[0].score < 0.4) {
    const match = results[0].item;
    let responseText = match.response.text;

    // Handle greeting placeholder
    if (responseText === '__GREETING__') {
      responseText = getWarmGreeting(ownerName);
    } else {
      // Add occasional empathetic interjection
      const interjection = getInterjection();
      if (interjection && !responseText.startsWith('Let me')) {
        responseText = interjection + responseText;
      }
    }

    return {
      response: {
        text: responseText,
        action: match.response.action,
      },
      category: match.category,
      followUp: match.followUp || [],
      isGreeting: responseText !== match.response.text && match.response.text === '__GREETING__',
    };
  }

  return null;
}

// ═══════════════════════════════════════════════════════
//  INITIAL GREETING FOR EMPTY STATE
// ═══════════════════════════════════════════════════════
export function getInitialGreeting(ownerName) {
  return getWarmGreeting(ownerName);
}

export { DEFAULT_SUGGESTIONS };
