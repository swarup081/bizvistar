import Fuse from 'fuse.js';

// Layer 1: The Silent Guard - Configuration
const intents = [
  // --- Pricing & Cost ---
  {
    id: 'pricing',
    keywords: ['price', 'cost', 'subscription', 'plan', 'money', 'fee', 'charge', 'expensive', 'discount', 'offer'],
    response: {
      text: "Our standard plan is ₹799/mo. However, as a Founding Member, you can get it for just ₹399/mo (50% OFF). This includes unlimited products and zero commission fees.",
      action: null
    }
  },

  // --- Account & Settings ---
  {
    id: 'password_reset',
    keywords: ['reset password', 'forgot password', 'change password', 'login issue', 'cant login', 'magic link'],
    response: {
      text: "If you're having trouble logging in, please check your email for the 'Magic Link' or use the reset password option.",
      action: {
        type: 'link',
        label: 'Reset Password',
        url: '/forgot-password' // Assuming this route exists or is standard
      }
    }
  },

  // --- Navigation: Dashboard ---
  {
    id: 'nav_dashboard',
    keywords: ['dashboard', 'home', 'main menu', 'overview', 'start'],
    response: {
      text: "You can find your main Dashboard here.",
      action: {
        type: 'navigate',
        label: 'Go to Dashboard',
        url: '/dashboard'
      }
    }
  },

  // --- Navigation: Orders ---
  {
    id: 'nav_orders',
    keywords: ['order', 'orders', 'sales', 'shipping', 'track order', 'new order'],
    response: {
      text: "Manage your orders and track shipments in the Orders section.",
      action: {
        type: 'navigate',
        label: 'Go to Orders',
        url: '/dashboard/orders'
      }
    }
  },

  // --- Navigation: Products ---
  {
    id: 'nav_products',
    keywords: ['product', 'products', 'item', 'items', 'inventory', 'stock', 'catalog', 'add product'],
    response: {
      text: "You can add, edit, and manage your inventory in the Products section.",
      action: {
        type: 'navigate',
        label: 'Go to Products',
        url: '/dashboard/products'
      }
    }
  },

   // --- Navigation: Website/Editor ---
   {
    id: 'nav_website',
    keywords: ['website', 'editor', 'design', 'template', 'change theme', 'edit site', 'preview'],
    response: {
      text: "Customize your website design and layout in the Website Editor.",
      action: {
        type: 'navigate',
        label: 'Go to Editor',
        url: '/dashboard/website'
      }
    }
  },

  // --- Navigation: Apps ---
  {
    id: 'nav_apps',
    keywords: ['apps', 'plugins', 'features', 'invoice', 'poster', 'shipping label'],
    response: {
      text: "Access extra tools like Quick Invoice and Offer Posters in the Apps section.",
      action: {
        type: 'navigate',
        label: 'Go to Apps',
        url: '/dashboard/apps'
      }
    }
  },

  // --- Navigation: Analytics ---
  {
    id: 'nav_analytics',
    keywords: ['analytics', 'stats', 'traffic', 'views', 'visitors', 'performance', 'charts', 'data'],
    response: {
      text: "Check your store's performance and visitor stats in Analytics.",
      action: {
        type: 'navigate',
        label: 'Go to Analytics',
        url: '/dashboard/analytics'
      }
    }
  }
];

// Fuse.js Options
const options = {
  includeScore: true,
  threshold: 0.4, // Lower threshold = stricter matching. 0.4 is a good balance.
  keys: ['keywords']
};

const fuse = new Fuse(intents, options);

/**
 * Layer 1 Logic: Find a matching intent locally.
 * Returns the response object or null if no match found.
 */
export function findLayer1Match(userText) {
  if (!userText) return null;

  const results = fuse.search(userText);

  if (results.length > 0) {
    // Return the best match
    return results[0].item.response;
  }

  return null;
}
