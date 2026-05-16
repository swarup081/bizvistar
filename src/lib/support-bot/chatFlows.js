// Vista Chatbot — Conversational Flow Engine
// Step-by-step wizards for actions: Add Product, Create Offer, etc.
// Supports fuzzy yes/no/skip/cancel keywords in EN + Hindi/Hinglish.

// ═══════════════════════════════════════════════════════
//  FUZZY KEYWORD MATCHERS (handles typos & variations)
// ═══════════════════════════════════════════════════════
const YES_WORDS = [
  'yes','y','yeah','yep','yup','sure','ok','okay','confirm','correct','done','right','haan','ha','ji','theek','sahi','bilkul','kar do','karo','hn','han','yess','yea','alright','proceed','go ahead','lgtm','looks good','perfect'
];
const NO_WORDS = [
  'no','n','nah','nahi','nope','cancel','stop','mat karo','nhi','band karo','ruk','rehne do','chhod do','galat','wrong','change','edit','redo','dobara','phir se'
];
const SKIP_WORDS = [
  'skip','no','nahi','none','nothing','kuch nahi','nhi','blank','empty','leave','chhod','pass','next','aage','aage badho','koi nahi','mat do','rehne do'
];
const CANCEL_WORDS = [
  'cancel','stop','exit','quit','back','go back','abort','band karo','ruk jao','cancel karo','nikal','bahar','chhod do','leave','hatao','end','khatam'
];
const DO_IT_WORDS = [
  'do it','do it for me','you do','aap karo','tu kar','kar do','help me do','let vista do','bot karo','auto','automatic','khud karo','tum karo','just do it'
];
const SHOW_HOW_WORDS = [
  'show me','tell me','how to','how do i','guide','steps','batao','kaise','dikhao','samjhao','show how','explain','manual','myself','khud karunga','khud karna hai','i will do'
];

export function isYes(text) {
  const t = text.toLowerCase().trim();
  return YES_WORDS.some(w => t === w || t.startsWith(w + ' ') || t.endsWith(' ' + w));
}
export function isNo(text) {
  const t = text.toLowerCase().trim();
  return NO_WORDS.some(w => t === w || t.startsWith(w + ' ') || t.endsWith(' ' + w));
}
export function isSkip(text) {
  const t = text.toLowerCase().trim();
  return SKIP_WORDS.some(w => t === w || t.startsWith(w + ' ') || t.endsWith(' ' + w));
}
export function isCancel(text) {
  const t = text.toLowerCase().trim();
  return CANCEL_WORDS.some(w => t === w || t.startsWith(w + ' ') || t.endsWith(' ' + w));
}
export function wantsDoIt(text) {
  const t = text.toLowerCase().trim();
  return DO_IT_WORDS.some(w => t.includes(w));
}
export function wantsShowHow(text) {
  const t = text.toLowerCase().trim();
  return SHOW_HOW_WORDS.some(w => t.includes(w));
}

// ═══════════════════════════════════════════════════════
//  FLOW DEFINITIONS
// ═══════════════════════════════════════════════════════

export const FLOW_DEFINITIONS = {
  // ─────────────────────────────────────
  //  ADD PRODUCT
  // ─────────────────────────────────────
  add_product: {
    id: 'add_product',
    name: 'Add Product',
    emoji: '🛍️',
    intro: "Let's add a new product to your store! I'll ask you a few details.",
    showHowText: "To add a product yourself:\n1. Go to **Products** page.\n2. Click **Add Product** button.\n3. Fill in name, price, stock, description.\n4. Upload images.\n5. Save.\n\nWant me to take you there?",
    showHowAction: { type: 'navigate', label: 'Go to Products', url: '/dashboard/products' },
    steps: [
      {
        key: 'name',
        ask: "What's the **product name**?",
        validate: (v) => v.trim().length > 0,
        errorMsg: "Product name can't be empty. Please enter a name.",
      },
      {
        key: 'price',
        ask: "What's the **price**? (in ₹)",
        validate: (v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0,
        errorMsg: "Please enter a valid price (e.g., 499 or 1200).",
        transform: (v) => parseFloat(v),
      },
      {
        key: 'stock',
        ask: "How many do you have in **stock**? (type 'unlimited' for unlimited stock)",
        validate: (v) => {
          const t = v.toLowerCase().trim();
          if (['unlimited', 'aseem', 'infinite', '-1', 'bahut', 'no limit'].includes(t)) return true;
          return !isNaN(parseInt(v)) && parseInt(v) >= 0;
        },
        errorMsg: "Please enter a number (e.g., 50) or say 'unlimited'.",
        transform: (v) => {
          const t = v.toLowerCase().trim();
          if (['unlimited', 'aseem', 'infinite', '-1', 'bahut', 'no limit'].includes(t)) return -1;
          return parseInt(v);
        },
      },
      {
        key: 'description',
        ask: "Any **description**? (say 'skip' or 'no' to skip)",
        optional: true,
        transform: (v) => isSkip(v) ? '' : v.trim(),
      },
      {
        key: 'imageUrl',
        ask: "Want to add a **product image**? Paste an image URL, or say 'skip' to add later from the dashboard.",
        optional: true,
        transform: (v) => {
          if (isSkip(v)) return '';
          // Basic URL validation
          if (v.startsWith('http://') || v.startsWith('https://')) return v.trim();
          return '';
        },
      },
    ],
    buildConfirmation: (data) => {
      let text = `📋 **Product Summary:**\n\n`;
      text += `**Name:** ${data.name}\n`;
      text += `**Price:** ₹${data.price}\n`;
      text += `**Stock:** ${data.stock === -1 ? 'Unlimited' : data.stock}\n`;
      if (data.description) text += `**Description:** ${data.description}\n`;
      if (data.imageUrl) text += `**Image:** ✅ Provided\n`;
      else text += `**Image:** None (add later from dashboard)\n`;
      text += `\nLooks good? **Yes** to add, **No** to cancel, **Edit** to start over.`;
      return text;
    },
    buildPayload: (data) => ({
      name: data.name,
      price: data.price,
      stock: data.stock,
      description: data.description || '',
      imageUrl: data.imageUrl || '',
      categoryId: 'uncategorized',
      isUnlimited: data.stock === -1,
      additionalImages: [],
      variants: [],
    }),
    handler: 'addProduct',
    successMsg: (data) => `✅ **Product Added!**\n\n**${data.name}** is now live on your store at ₹${data.price}!\n\nYou can add images and more details from the Products page. 🎉`,
    followUp: ['Add another product', 'Show my products', 'How to add product images?'],
  },

  // ─────────────────────────────────────
  //  CREATE OFFER / COUPON
  // ─────────────────────────────────────
  create_offer: {
    id: 'create_offer',
    name: 'Create Offer',
    emoji: '🏷️',
    intro: "Let's create a new offer for your customers! I'll guide you through.",
    showHowText: "To create an offer yourself:\n1. Go to **Apps** page.\n2. Find the **Offers** section.\n3. Click **Create Offer**.\n4. Fill in code, type, value.\n5. Save.\n\nWant me to take you there?",
    showHowAction: { type: 'navigate', label: 'Go to Apps', url: '/dashboard/apps' },
    steps: [
      {
        key: 'code',
        ask: "What should the **coupon code** be? (e.g., SAVE10, WELCOME20)",
        validate: (v) => v.trim().length >= 2 && v.trim().length <= 20,
        errorMsg: "Code should be 2-20 characters. No spaces. (e.g., SAVE10)",
        transform: (v) => v.trim().toUpperCase().replace(/\s+/g, ''),
      },
      {
        key: 'type',
        ask: "What type of discount?\n\n1️⃣ **Percentage** (e.g., 10% off)\n2️⃣ **Fixed amount** (e.g., ₹50 off)\n\nType '1' or 'percentage', or '2' or 'fixed'.",
        validate: (v) => {
          const t = v.toLowerCase().trim();
          return ['1', '2', 'percentage', 'fixed', 'percent', '%', 'flat', 'amount', 'rupee', 'rs'].includes(t);
        },
        errorMsg: "Please type '1' for percentage or '2' for fixed amount.",
        transform: (v) => {
          const t = v.toLowerCase().trim();
          if (['1', 'percentage', 'percent', '%'].includes(t)) return 'percentage';
          return 'fixed';
        },
      },
      {
        key: 'value',
        ask: (data) => data.type === 'percentage' ? "How much **percentage off**? (e.g., 10 for 10%)" : "How much **₹ off**? (e.g., 50 for ₹50 off)",
        validate: (v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0,
        errorMsg: "Please enter a valid number (e.g., 10 or 50).",
        transform: (v) => parseFloat(v),
      },
      {
        key: 'minOrderValue',
        ask: "Any **minimum order value**? (e.g., 500 for ₹500 min, or say 'skip' for no minimum)",
        optional: true,
        transform: (v) => {
          if (isSkip(v)) return 0;
          const num = parseFloat(v);
          return isNaN(num) ? 0 : num;
        },
      },
    ],
    buildConfirmation: (data) => {
      let text = `📋 **Offer Summary:**\n\n`;
      text += `**Code:** ${data.code}\n`;
      text += `**Type:** ${data.type === 'percentage' ? `${data.value}% off` : `₹${data.value} off`}\n`;
      if (data.minOrderValue > 0) text += `**Min Order:** ₹${data.minOrderValue}\n`;
      else text += `**Min Order:** None\n`;
      text += `\nLooks good? **Yes** to create, **No** to cancel, **Edit** to start over.`;
      return text;
    },
    buildPayload: (data) => ({
      code: data.code,
      type: data.type,
      value: data.value,
      minOrderValue: data.minOrderValue || 0,
    }),
    handler: 'chatCreateOffer',
    successMsg: (data) => `✅ **Offer Created!**\n\n**${data.code}** — ${data.type === 'percentage' ? `${data.value}% off` : `₹${data.value} off`}\n\nShare this code with your customers! 🎉`,
    followUp: ['Show active offers', 'How to promote offers?', 'Create another offer'],
  },

  // ─────────────────────────────────────
  //  ADD CATEGORY
  // ─────────────────────────────────────
  add_category: {
    id: 'add_category',
    name: 'Add Category',
    emoji: '📁',
    intro: "Let's add a new product category!",
    showHowText: "To add a category yourself:\n1. Go to **Products** page.\n2. Click the **Categories** tab.\n3. Click **Add Category**.\n4. Enter the name and save.",
    showHowAction: { type: 'navigate', label: 'Go to Products', url: '/dashboard/products' },
    steps: [
      {
        key: 'name',
        ask: "What should the **category name** be? (e.g., Electronics, Clothing, Food)",
        validate: (v) => v.trim().length > 0,
        errorMsg: "Category name can't be empty.",
      },
    ],
    buildConfirmation: (data) => `📋 Create category **"${data.name}"**?\n\n**Yes** to create, **No** to cancel.`,
    buildPayload: (data) => data.name.trim(),
    handler: 'addCategory',
    successMsg: (data) => `✅ **Category Created!**\n\nCategory **"${data.name}"** is now available. You can assign products to it!`,
    followUp: ['Add a product', 'Show my products', 'Add another category'],
  },

  // ─────────────────────────────────────
  //  UPDATE PRODUCT PRICE (guided)
  // ─────────────────────────────────────
  update_price: {
    id: 'update_price',
    name: 'Update Price',
    emoji: '💰',
    intro: "Let's update a product price!",
    showHowText: "To change a price yourself:\n1. Go to **Products** page.\n2. Click **Edit** on the product.\n3. Change the price.\n4. Save.",
    showHowAction: { type: 'navigate', label: 'Go to Products', url: '/dashboard/products' },
    steps: [
      {
        key: 'productName',
        ask: "Which **product** do you want to update? (type the product name)",
        validate: (v) => v.trim().length > 0,
        errorMsg: "Please enter the product name.",
      },
      {
        key: 'newPrice',
        ask: "What should the **new price** be? (in ₹)",
        validate: (v) => !isNaN(parseFloat(v)) && parseFloat(v) > 0,
        errorMsg: "Please enter a valid price (e.g., 299).",
        transform: (v) => parseFloat(v),
      },
    ],
    buildConfirmation: (data) => `📋 Update **"${data.productName}"** price to **₹${data.newPrice}**?\n\n**Yes** to update, **No** to cancel.`,
    buildPayload: (data) => [data.productName, data.newPrice],
    handler: 'chatUpdateProductPrice',
    isArrayArgs: true,
    successMsg: (data) => `✅ Price updated! **${data.productName}** → ₹${data.newPrice}`,
    followUp: ['Update another product', 'Show my products', 'Show my sales'],
  },

  // ─────────────────────────────────────
  //  UPDATE STOCK (guided)
  // ─────────────────────────────────────
  update_stock: {
    id: 'update_stock',
    name: 'Update Stock',
    emoji: '📦',
    intro: "Let's update product stock!",
    showHowText: "To update stock yourself:\n1. Go to **Products** page.\n2. Click **Edit** on the product.\n3. Change the stock.\n4. Save.",
    showHowAction: { type: 'navigate', label: 'Go to Products', url: '/dashboard/products' },
    steps: [
      {
        key: 'productName',
        ask: "Which **product** do you want to update? (type the product name)",
        validate: (v) => v.trim().length > 0,
        errorMsg: "Please enter the product name.",
      },
      {
        key: 'newStock',
        ask: "What should the **new stock** be? (number, or 'unlimited')",
        validate: (v) => {
          const t = v.toLowerCase().trim();
          if (['unlimited', '-1', 'aseem', 'infinite'].includes(t)) return true;
          return !isNaN(parseInt(v)) && parseInt(v) >= 0;
        },
        errorMsg: "Please enter a number (e.g., 50) or 'unlimited'.",
        transform: (v) => {
          const t = v.toLowerCase().trim();
          if (['unlimited', '-1', 'aseem', 'infinite'].includes(t)) return -1;
          return parseInt(v);
        },
      },
    ],
    buildConfirmation: (data) => `📋 Update **"${data.productName}"** stock to **${data.newStock === -1 ? 'Unlimited' : data.newStock}**?\n\n**Yes** to update, **No** to cancel.`,
    buildPayload: (data) => [data.productName, data.newStock],
    handler: 'chatUpdateProductStock',
    isArrayArgs: true,
    successMsg: (data) => `✅ Stock updated! **${data.productName}** → ${data.newStock === -1 ? 'Unlimited' : data.newStock}`,
    followUp: ['Show stock alerts', 'Show my products', 'Update another product'],
  },

  // ─────────────────────────────────────
  //  UPDATE ORDER STATUS (guided)
  // ─────────────────────────────────────
  update_order: {
    id: 'update_order',
    name: 'Update Order Status',
    emoji: '📋',
    intro: "Let's update an order status!",
    showHowText: "To update an order yourself:\n1. Go to **Orders** page.\n2. Click **Manage** on the order.\n3. Change the status.\n4. Save.",
    showHowAction: { type: 'navigate', label: 'Go to Orders', url: '/dashboard/orders' },
    steps: [
      {
        key: 'orderId',
        ask: "What's the **Order ID**? (e.g., 42)",
        validate: (v) => !isNaN(parseInt(v)) && parseInt(v) > 0,
        errorMsg: "Please enter a valid order number.",
        transform: (v) => parseInt(v),
      },
      {
        key: 'newStatus',
        ask: "What should the new **status** be?\n\n1️⃣ Pending\n2️⃣ Paid\n3️⃣ Shipped\n4️⃣ Delivered\n5️⃣ Canceled",
        validate: (v) => {
          const t = v.toLowerCase().trim();
          return ['1','2','3','4','5','pending','paid','shipped','delivered','canceled','cancelled'].includes(t);
        },
        errorMsg: "Please choose: pending, paid, shipped, delivered, or canceled.",
        transform: (v) => {
          const map = { '1': 'pending', '2': 'paid', '3': 'shipped', '4': 'delivered', '5': 'canceled' };
          const t = v.toLowerCase().trim();
          return map[t] || (t === 'cancelled' ? 'canceled' : t);
        },
      },
    ],
    buildConfirmation: (data) => `📋 Update **Order #${data.orderId}** to **${data.newStatus}**?\n\n**Yes** to update, **No** to cancel.`,
    buildPayload: (data) => [data.orderId, data.newStatus],
    handler: 'chatUpdateOrderStatus',
    isArrayArgs: true,
    successMsg: (data) => `✅ Order #${data.orderId} updated to **${data.newStatus}**!`,
    followUp: ['Show pending orders', 'Show today\'s orders', 'Update another order'],
  },

  // ─────────────────────────────────────
  //  DELETE PRODUCT (guided)
  // ─────────────────────────────────────
  delete_product: {
    id: 'delete_product',
    name: 'Delete Product',
    emoji: '🗑️',
    intro: "I'll help you remove a product.",
    showHowText: "To delete a product yourself:\n1. Go to **Products** page.\n2. Select the product.\n3. Click **Delete**.\n4. Confirm.",
    showHowAction: { type: 'navigate', label: 'Go to Products', url: '/dashboard/products' },
    steps: [
      {
        key: 'productName',
        ask: "Which **product** do you want to delete? (type the exact product name)",
        validate: (v) => v.trim().length > 0,
        errorMsg: "Please enter the product name.",
      },
    ],
    buildConfirmation: (data) => `⚠️ Are you sure you want to **delete "${data.productName}"**? This cannot be undone!\n\n**Yes** to delete, **No** to cancel.`,
    buildPayload: (data) => data.productName,
    handler: 'chatDeleteProduct',
    successMsg: (data) => `✅ Product **"${data.productName}"** has been deleted.`,
    followUp: ['Show my products', 'Add a product'],
  },

  // ─────────────────────────────────────
  //  PUBLISH WEBSITE
  // ─────────────────────────────────────
  publish_website: {
    id: 'publish_website',
    name: 'Publish Website',
    emoji: '🌐',
    intro: "Ready to publish your website?",
    showHowText: "To publish your website:\n1. Go to **Website** page.\n2. Click **Publish** button.\n3. Confirm.\n\nMake sure you have an active subscription!",
    showHowAction: { type: 'navigate', label: 'Go to Website', url: '/dashboard/website' },
    steps: [],
    buildConfirmation: () => `🌐 Publish your website and make it **live** for everyone?\n\n**Yes** to publish, **No** to cancel.`,
    buildPayload: () => null,
    handler: 'chatPublishWebsite',
    successMsg: () => `✅ **Website Published!** Your store is now live! 🎉\n\nShare your link with customers!`,
    followUp: ['What is my store link?', 'How to share my store?', 'Show my sales'],
  },
};

// ═══════════════════════════════════════════════════════
//  FLOW TRIGGER DETECTION
// ═══════════════════════════════════════════════════════
const FLOW_TRIGGERS = [
  { flowId: 'add_product', patterns: ['add product','new product','create product','add item','product add','naya product','product banana','naya item','product jodo','ek product add karo','product daal do','item add karo','add a product','add new product','i want to add a product'] },
  { flowId: 'create_offer', patterns: ['create offer','new offer','add offer','make offer','create coupon','new coupon','add coupon','naya offer','offer banana','coupon banana','offer banao','coupon add karo','create a offer','create discount','add discount'] },
  { flowId: 'add_category', patterns: ['add category','new category','create category','naya category','category banana','category add karo','category banao','nayi category','add a category'] },
  { flowId: 'update_price', patterns: ['update price','change price','set price','modify price','price change','price badle','price update karo','daam badle','rate change','price kaise badle'] },
  { flowId: 'update_stock', patterns: ['update stock','change stock','set stock','modify stock','stock update','stock badle','stock change karo','inventory update','stock badha do','stock kam karo'] },
  { flowId: 'update_order', patterns: ['update order','change order status','set order status','order update','order status badle','order ship karo','order deliver karo','order cancel karo','mark order'] },
  { flowId: 'delete_product', patterns: ['delete product','remove product','product delete','hatao product','product remove karo','product delete karo'] },
  { flowId: 'publish_website', patterns: ['publish website','publish site','go live','site publish karo','website live karo','publish my site','make my site live'] },
];

/**
 * Detect if the user wants to start a flow.
 * Returns flowId or null.
 */
export function detectFlowTrigger(text) {
  if (!text) return null;
  const t = text.toLowerCase().trim();
  
  for (const { flowId, patterns } of FLOW_TRIGGERS) {
    for (const pattern of patterns) {
      if (t.includes(pattern)) return flowId;
    }
  }
  return null;
}

/**
 * Get a flow definition by ID.
 */
export function getFlowDefinition(flowId) {
  return FLOW_DEFINITIONS[flowId] || null;
}

/**
 * Get the current step's question text.
 * Supports dynamic questions (functions that take collected data).
 */
export function getStepQuestion(flow, stepIndex, collectedData) {
  if (stepIndex >= flow.steps.length) return null;
  const step = flow.steps[stepIndex];
  if (typeof step.ask === 'function') return step.ask(collectedData);
  return step.ask;
}

/**
 * Process user input for the current flow step.
 * Returns: { valid: boolean, value?: any, error?: string }
 */
export function processFlowInput(flow, stepIndex, userText, collectedData) {
  if (stepIndex >= flow.steps.length) return { valid: false, error: 'No more steps.' };

  const step = flow.steps[stepIndex];
  
  // Handle optional steps with skip
  if (step.optional && isSkip(userText)) {
    const value = step.transform ? step.transform(userText) : '';
    return { valid: true, value };
  }
  
  // Validate
  if (step.validate && !step.validate(userText)) {
    return { valid: false, error: step.errorMsg || 'Invalid input. Please try again.' };
  }
  
  // Transform
  const value = step.transform ? step.transform(userText) : userText.trim();
  return { valid: true, value };
}
