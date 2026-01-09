import Fuse from 'fuse.js';

// Layer 1: The Silent Guard - Configuration
// Detailed "Maps" for the user to navigate the app without API calls.
const intents = [
  // --- Products: Edit ---
  {
    id: 'edit_product',
    keywords: ['edit product', 'change product', 'update product', 'modify item', 'how to edit', 'edit price', 'edit stock', 'edit image'],
    response: {
      text: "To edit a product: \n1. Go to **Products**.\n2. Find the product you want to change.\n3. Click the **3 dots** (More Options) button next to it.\n4. Select **Edit** from the dropdown menu.",
      action: {
        type: 'navigate',
        label: 'Go to Products',
        url: '/dashboard/products'
      }
    }
  },

  // --- Products: Add ---
  {
    id: 'add_product',
    keywords: ['add product', 'create product', 'new product', 'upload item', 'sell new item', 'how to add', 'add inventory'],
    response: {
      text: "To add a new product: \n1. Go to **Products**.\n2. Click the **Add Product** button in the top right corner.\n3. Fill in the details and save.",
      action: {
        type: 'navigate',
        label: 'Go to Products',
        url: '/dashboard/products'
      }
    }
  },

  // --- Products: Delete ---
  {
    id: 'delete_product',
    keywords: ['delete product', 'remove product', 'trash item', 'remove item', 'how to delete'],
    response: {
      text: "To delete a product: \n1. Go to **Products**.\n2. Click the **3 dots** next to the product.\n3. Select **Delete**. \n*Note: This cannot be undone.*",
      action: {
        type: 'navigate',
        label: 'Go to Products',
        url: '/dashboard/products'
      }
    }
  },

  // --- Orders: Manage / Status ---
  {
    id: 'manage_order',
    keywords: ['manage order', 'ship order', 'track order', 'change status', 'mark delivered', 'mark paid', 'order details', 'view order'],
    response: {
      text: "To manage an order (ship, track, or update status): \n1. Go to **Orders**.\n2. Find the order you want to update.\n3. Click the **Manage** button on the right side of the row.\n4. A popup will appear where you can update status or add logistics.",
      action: {
        type: 'navigate',
        label: 'Go to Orders',
        url: '/dashboard/orders'
      }
    }
  },

  // --- FAQ: Custom Colors ---
  {
    id: 'custom_colors',
    keywords: ['custom color', 'change theme color', 'hex code', 'own color', 'brand color', 'more colors', 'color palette'],
    response: {
      text: "Currently, you can only choose from the **8 preset colors** available in the theme settings. Custom color options (hex codes) are not supported yet.",
      action: {
        type: 'navigate',
        label: 'Open Editor',
        url: '/dashboard/website'
      }
    }
  },

  // --- Pricing & Cost (General) ---
  {
    id: 'pricing',
    keywords: ['price', 'cost', 'subscription', 'plan', 'money', 'fee', 'charge', 'expensive', 'discount', 'offer'],
    response: {
      text: "Our standard plan is **₹799/mo**. However, as a Founding Member, you can get it for just **₹399/mo** (50% OFF). This includes unlimited products and zero commission fees.",
      action: null // No nav needed, pure info
    }
  },

  // --- Account: Password ---
  {
    id: 'password_reset',
    keywords: ['reset password', 'forgot password', 'change password', 'login issue', 'cant login', 'magic link'],
    response: {
      text: "If you're having trouble logging in, please check your email for the **'Magic Link'** or use the reset password option on the login page.",
      action: {
        type: 'link',
        label: 'Reset Password',
        url: '/forgot-password'
      }
    }
  },

  // --- Navigation: Dashboard ---
  {
    id: 'nav_dashboard',
    keywords: ['dashboard', 'home', 'main menu', 'overview', 'start', 'where is dashboard'],
    response: {
      text: "You are currently in the Dashboard area. Click the link below to return to the main overview.",
      action: {
        type: 'navigate',
        label: 'Go to Dashboard',
        url: '/dashboard'
      }
    }
  },

   // --- Navigation: Website/Editor ---
   {
    id: 'nav_website',
    keywords: ['website', 'editor', 'design', 'template', 'change theme', 'edit site', 'preview', 'how to edit site'],
    response: {
      text: "To customize your website: \n1. Go to **Website**.\n2. Use the editor to change themes, colors, and content.",
      action: {
        type: 'navigate',
        label: 'Go to Editor',
        url: '/dashboard/website'
      }
    }
  },

  // --- Navigation: Analytics ---
  {
    id: 'nav_analytics',
    keywords: ['analytics', 'stats', 'traffic', 'views', 'visitors', 'performance', 'charts', 'data'],
    response: {
      text: "To view your store's performance: \n1. Go to **Analytics**.\n2. View your traffic, sales, and top products.",
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
  // Threshold 0.4 is strict, 0.6 is loose.
  // We want to be reasonably strict to avoid bad advice, but forgiving enough for "how to..."
  threshold: 0.5,
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
