'use server';

import { createClient } from '@supabase/supabase-js';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// ═══════════════════════════════════════════════════════
//  HELPER: Get authenticated user + website
// ═══════════════════════════════════════════════════════
async function getAuthContext() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try { cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options)) } catch {}
        },
      },
    }
  );

  const { data: { user }, error } = await supabase.auth.getUser();
  if (error || !user) return null;

  // Get website
  const { data: website } = await supabaseAdmin
    .from('websites')
    .select('id, site_slug, is_published, template_id, website_data')
    .eq('user_id', user.id)
    .order('is_published', { ascending: false })
    .order('updated_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!website) return null;

  return { user, website };
}

// ═══════════════════════════════════════════════════════
//  SALES DATA
// ═══════════════════════════════════════════════════════
export async function getChatSalesData() {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return { error: 'Please sign in to view your sales data.' };

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const lastMonthEnd = monthStart;
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    // This month orders
    const { data: thisMonthOrders } = await supabaseAdmin
      .from('orders')
      .select('id, total_amount, created_at')
      .eq('website_id', ctx.website.id)
      .neq('status', 'canceled')
      .gte('created_at', monthStart);

    // Last month orders
    const { data: lastMonthOrders } = await supabaseAdmin
      .from('orders')
      .select('id, total_amount')
      .eq('website_id', ctx.website.id)
      .neq('status', 'canceled')
      .gte('created_at', lastMonthStart)
      .lt('created_at', lastMonthEnd);

    const thisMonthTotal = (thisMonthOrders || []).reduce((s, o) => s + Number(o.total_amount), 0);
    const thisMonthCount = (thisMonthOrders || []).length;
    const lastMonthTotal = (lastMonthOrders || []).reduce((s, o) => s + Number(o.total_amount), 0);

    // Today's orders
    const todayOrders = (thisMonthOrders || []).filter(o => o.created_at >= todayStart);
    const todayTotal = todayOrders.reduce((s, o) => s + Number(o.total_amount), 0);
    const todayCount = todayOrders.length;

    const change = lastMonthTotal > 0 ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1) : 0;
    const changeText = Number(change) > 0 ? `That's **${change}% more** than last month! 📈` : Number(change) < 0 ? `That's ${Math.abs(change)}% less than last month.` : '';

    const formatCurrency = (val) => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(val);

    return {
      text: `📊 **Your Sales Summary:**\n\n**Today:** ${formatCurrency(todayTotal)} from ${todayCount} order${todayCount !== 1 ? 's' : ''}\n**This Month:** ${formatCurrency(thisMonthTotal)} from ${thisMonthCount} order${thisMonthCount !== 1 ? 's' : ''}\n**Last Month:** ${formatCurrency(lastMonthTotal)}\n\n${changeText}\n\nKeep up the great work! 💪`,
    };
  } catch (err) {
    console.error('getChatSalesData error:', err);
    return { error: 'Sorry, I couldn\'t fetch your sales data right now. Please try again.' };
  }
}

// ═══════════════════════════════════════════════════════
//  PRODUCT DATA
// ═══════════════════════════════════════════════════════
export async function getChatProductData() {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return { error: 'Please sign in to view your product data.' };

    const { data: products } = await supabaseAdmin
      .from('products')
      .select('id, name, stock, category_id')
      .eq('website_id', ctx.website.id);

    const { data: categories } = await supabaseAdmin
      .from('categories')
      .select('id, name')
      .eq('website_id', ctx.website.id);

    const total = (products || []).length;
    const catCount = (categories || []).length;
    const outOfStock = (products || []).filter(p => p.stock === 0).length;
    const lowStock = (products || []).filter(p => p.stock > 0 && p.stock < 10 && p.stock !== -1).length;
    const unlimited = (products || []).filter(p => p.stock === -1).length;

    let stockAlert = '';
    if (outOfStock > 0) stockAlert += `\n⚠️ **${outOfStock} product${outOfStock > 1 ? 's' : ''} out of stock!**`;
    if (lowStock > 0) stockAlert += `\n⚡ **${lowStock} product${lowStock > 1 ? 's' : ''} running low on stock.**`;

    return {
      text: `📦 **Your Product Summary:**\n\n**Total Products:** ${total}\n**Categories:** ${catCount}\n**Unlimited Stock:** ${unlimited}\n**Active:** ${total - outOfStock - lowStock - unlimited}${stockAlert}\n\nLooking good! Need to add more products? 🛍️`,
    };
  } catch (err) {
    console.error('getChatProductData error:', err);
    return { error: 'Sorry, I couldn\'t fetch your product data. Please try again.' };
  }
}

// ═══════════════════════════════════════════════════════
//  ORDER DATA
// ═══════════════════════════════════════════════════════
export async function getChatOrderData() {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return { error: 'Please sign in to view your orders.' };

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();

    const { data: orders } = await supabaseAdmin
      .from('orders')
      .select('id, status, created_at')
      .eq('website_id', ctx.website.id)
      .gte('created_at', monthStart);

    const all = (orders || []);
    const pending = all.filter(o => o.status === 'pending').length;
    const paid = all.filter(o => o.status === 'paid').length;
    const shipped = all.filter(o => o.status === 'shipped').length;
    const delivered = all.filter(o => o.status === 'delivered').length;
    const canceled = all.filter(o => o.status === 'canceled').length;
    const today = all.filter(o => o.created_at >= todayStart).length;

    let urgentText = '';
    if (pending > 0) urgentText = `\n\n🔔 You have **${pending} pending order${pending > 1 ? 's'  : ''}** that need attention!`;

    return {
      text: `📋 **Your Orders This Month:**\n\n**Total:** ${all.length}\n**Today:** ${today}\n📌 Pending: ${pending}\n💳 Paid: ${paid}\n🚚 Shipped: ${shipped}\n✅ Delivered: ${delivered}\n❌ Canceled: ${canceled}${urgentText}`,
    };
  } catch (err) {
    console.error('getChatOrderData error:', err);
    return { error: 'Sorry, I couldn\'t fetch your order data. Please try again.' };
  }
}

// ═══════════════════════════════════════════════════════
//  STOCK ALERTS
// ═══════════════════════════════════════════════════════
export async function getChatStockAlerts() {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return { error: 'Please sign in to view stock alerts.' };

    const { data: products } = await supabaseAdmin
      .from('products')
      .select('id, name, stock')
      .eq('website_id', ctx.website.id)
      .neq('stock', -1)
      .order('stock', { ascending: true })
      .limit(20);

    const outOfStock = (products || []).filter(p => p.stock === 0);
    const lowStock = (products || []).filter(p => p.stock > 0 && p.stock < 10);

    if (outOfStock.length === 0 && lowStock.length === 0) {
      return { text: "✅ **All clear!** All your products have healthy stock levels. Great job managing inventory! 👏" };
    }

    let text = "⚠️ **Stock Alerts:**\n\n";
    if (outOfStock.length > 0) {
      text += "**🔴 Out of Stock:**\n";
      outOfStock.slice(0, 5).forEach(p => { text += `- ${p.name}\n`; });
      if (outOfStock.length > 5) text += `- ...and ${outOfStock.length - 5} more\n`;
      text += "\n";
    }
    if (lowStock.length > 0) {
      text += "**🟡 Low Stock:**\n";
      lowStock.slice(0, 5).forEach(p => { text += `- ${p.name} (${p.stock} left)\n`; });
      if (lowStock.length > 5) text += `- ...and ${lowStock.length - 5} more\n`;
    }
    text += "\nHead to **Products** to restock! 📦";

    return { text };
  } catch (err) {
    console.error('getChatStockAlerts error:', err);
    return { error: 'Sorry, I couldn\'t fetch stock data. Please try again.' };
  }
}

// ═══════════════════════════════════════════════════════
//  SUBSCRIPTION DATA
// ═══════════════════════════════════════════════════════
export async function getChatSubscriptionData() {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return { error: 'Please sign in to view your subscription.' };

    const { data: sub } = await supabaseAdmin
      .from('subscriptions')
      .select('status, current_period_end, plan:plans(name, price)')
      .eq('user_id', ctx.user.id)
      .order('id', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!sub) {
      return { text: "You don't have an active subscription yet.\n\nTo publish your website, you'll need to subscribe. Our founding member price is just **₹399/mo**! 🔥\n\nWould you like to see the pricing?" };
    }

    const planName = sub.plan?.name || 'Unknown';
    const price = sub.plan?.price ? `₹${sub.plan.price}` : 'N/A';
    const status = sub.status.charAt(0).toUpperCase() + sub.status.slice(1);
    const endDate = sub.current_period_end ? new Date(sub.current_period_end).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : 'N/A';
    const daysLeft = sub.current_period_end ? Math.ceil((new Date(sub.current_period_end) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

    const statusEmoji = sub.status === 'active' ? '✅' : sub.status === 'paused' ? '⏸️' : '⚠️';

    return {
      text: `💳 **Your Subscription:**\n\n**Plan:** ${planName}\n**Price:** ${price}/mo\n**Status:** ${statusEmoji} ${status}\n**Valid Until:** ${endDate}\n**Days Remaining:** ${daysLeft}\n\n${sub.status === 'active' ? 'Everything looks great! 🎉' : 'Need help with your subscription? Just ask!'}`,
    };
  } catch (err) {
    console.error('getChatSubscriptionData error:', err);
    return { error: 'Sorry, I couldn\'t fetch your subscription data. Please try again.' };
  }
}

// ═══════════════════════════════════════════════════════
//  WEBSITE STATUS
// ═══════════════════════════════════════════════════════
export async function getChatWebsiteStatus() {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return { error: 'Please sign in to view your website status.' };

    const { data: template } = await supabaseAdmin
      .from('templates')
      .select('name')
      .eq('id', ctx.website.template_id)
      .maybeSingle();

    const isLive = ctx.website.is_published;
    const slug = ctx.website.site_slug;
    const templateName = template?.name || 'Unknown';
    const storeName = ctx.website.website_data?.name || ctx.website.website_data?.logoText || 'Your Store';

    return {
      text: `🌐 **Your Website:**\n\n**Store Name:** ${storeName}\n**Template:** ${templateName}\n**Status:** ${isLive ? '🟢 Live' : '🔴 Offline'}\n**URL:** ${slug ? `**${slug}.bizvistar.in**` : 'Not set yet'}\n\n${isLive ? 'Your store is live and accessible to customers! 🎉' : 'Your site is currently offline. Publish it to go live!'}`,
    };
  } catch (err) {
    console.error('getChatWebsiteStatus error:', err);
    return { error: 'Sorry, I couldn\'t fetch your website status. Please try again.' };
  }
}

// ═══════════════════════════════════════════════════════
//  TOP PRODUCTS
// ═══════════════════════════════════════════════════════
export async function getChatTopProducts() {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return { error: 'Please sign in to view your top products.' };

    // Get all orders for this website first
    const { data: orders } = await supabaseAdmin
      .from('orders')
      .select('id')
      .eq('website_id', ctx.website.id)
      .neq('status', 'canceled');

    if (!orders || orders.length === 0) {
      return { text: "You haven't had any sales yet. Once orders start coming in, I'll show you your best sellers here! 🛍️\n\n**Tip:** Share your store link on WhatsApp to get your first order!" };
    }

    const orderIds = orders.map(o => o.id);

    // Get order items for these orders
    const { data: items } = await supabaseAdmin
      .from('order_items')
      .select('product_id, quantity')
      .in('order_id', orderIds);

    if (!items || items.length === 0) {
      return { text: "You haven't had any sales yet. Once orders start coming in, I'll show you your best sellers here! 🛍️" };
    }

    // Aggregate by product_id
    const productSales = {};
    items.forEach(item => {
      productSales[item.product_id] = (productSales[item.product_id] || 0) + (item.quantity || 1);
    });

    // Get product names
    const topProductIds = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([id]) => Number(id));
    const { data: products } = await supabaseAdmin
      .from('products')
      .select('id, name')
      .in('id', topProductIds);

    const productNameMap = {};
    (products || []).forEach(p => { productNameMap[p.id] = p.name; });

    const sorted = Object.entries(productSales).sort((a, b) => b[1] - a[1]).slice(0, 5);

    let text = "🏆 **Your Top Sellers:**\n\n";
    sorted.forEach(([id, qty], i) => {
      const name = productNameMap[Number(id)] || `Product #${id}`;
      const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i + 1}.`;
      text += `${medal} **${name}** — ${qty} sold\n`;
    });
    text += "\nGreat performance! Keep it up! 💪";

    return { text };
  } catch (err) {
    console.error('getChatTopProducts error:', err);
    return { error: 'Sorry, I couldn\'t fetch product performance data. Please try again.' };
  }
}

// ═══════════════════════════════════════════════════════
//  CUSTOMER DATA
// ═══════════════════════════════════════════════════════
export async function getChatCustomerData() {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return { error: 'Please sign in to view customer data.' };

    const { data: customers } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('website_id', ctx.website.id);

    const total = (customers || []).length;

    // Check repeat customers (customers with >1 order)
    const { data: orders } = await supabaseAdmin
      .from('orders')
      .select('customer_id')
      .eq('website_id', ctx.website.id)
      .neq('status', 'canceled');

    const customerOrderCount = {};
    (orders || []).forEach(o => {
      if (o.customer_id) customerOrderCount[o.customer_id] = (customerOrderCount[o.customer_id] || 0) + 1;
    });
    const repeat = Object.values(customerOrderCount).filter(c => c > 1).length;

    return {
      text: `👥 **Your Customers:**\n\n**Total Customers:** ${total}\n**Repeat Buyers:** ${repeat}\n**New Customers:** ${total - repeat}\n\n${repeat > 0 ? `${repeat} customer${repeat > 1 ? 's keep' : ' keeps'} coming back — that's great retention! 🎉` : 'Share your store more to attract your first repeat buyers! 💪'}`,
    };
  } catch (err) {
    console.error('getChatCustomerData error:', err);
    return { error: 'Sorry, I couldn\'t fetch customer data. Please try again.' };
  }
}

// ═══════════════════════════════════════════════════════
//  OFFERS DATA
// ═══════════════════════════════════════════════════════
export async function getChatOffersData() {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return { error: 'Please sign in to view your offers.' };

    const { data: offers } = await supabaseAdmin
      .from('offers')
      .select('code, type, value, is_active, usage_limit, used_count, expires_at')
      .eq('website_id', ctx.website.id)
      .eq('is_active', true);

    if (!offers || offers.length === 0) {
      return { text: "You don't have any active offers right now.\n\nCreating offers is a great way to attract customers! 🏷️\n\nWould you like to create one?" };
    }

    let text = "🏷️ **Your Active Offers:**\n\n";
    offers.forEach(o => {
      const discount = o.type === 'percentage' ? `${o.value}% off` : `₹${o.value} off`;
      const usage = o.usage_limit ? `${o.used_count || 0}/${o.usage_limit} used` : `${o.used_count || 0} used`;
      const expiry = o.expires_at ? `Expires: ${new Date(o.expires_at).toLocaleDateString('en-IN')}` : 'No expiry';
      text += `**${o.code}** — ${discount} (${usage}) | ${expiry}\n`;
    });

    return { text };
  } catch (err) {
    console.error('getChatOffersData error:', err);
    return { error: 'Sorry, I couldn\'t fetch your offers data. Please try again.' };
  }
}

// ═══════════════════════════════════════════════════════
//  NOTIFICATIONS
// ═══════════════════════════════════════════════════════
export async function getChatNotifications() {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return { error: 'Please sign in to view notifications.' };

    const { data: notifications } = await supabaseAdmin
      .from('notifications')
      .select('type, title, message, is_read, created_at')
      .eq('website_id', ctx.website.id)
      .eq('is_read', false)
      .order('created_at', { ascending: false })
      .limit(5);

    if (!notifications || notifications.length === 0) {
      return { text: "✅ **All caught up!** You have no unread notifications. Everything's running smoothly! 🎉" };
    }

    let text = `🔔 **You have ${notifications.length} unread notification${notifications.length > 1 ? 's' : ''}:**\n\n`;
    notifications.forEach(n => {
      const icon = n.type === 'new_order' ? '🛒' : n.type === 'low_stock' ? '⚡' : n.type === 'out_of_stock' ? '🔴' : '📌';
      text += `${icon} **${n.title}**\n${n.message}\n\n`;
    });

    return { text };
  } catch (err) {
    console.error('getChatNotifications error:', err);
    return { error: 'Sorry, I couldn\'t fetch your notifications. Please try again.' };
  }
}

// ═══════════════════════════════════════════════════════
//  VISITOR / TRAFFIC DATA (from client_analytics)
// ═══════════════════════════════════════════════════════
export async function getChatVisitorData() {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return { error: 'Please sign in to view visitor data.' };

    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
    const lastMonthStart = new Date(now.getFullYear(), now.getMonth() - 1, 1).toISOString();
    const lastMonthEnd = monthStart;
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();

    // This month page views
    const { count: monthViews } = await supabaseAdmin
      .from('client_analytics')
      .select('id', { count: 'exact', head: true })
      .eq('website_id', ctx.website.id)
      .eq('event_type', 'page_view')
      .gte('timestamp', monthStart);

    // Today page views
    const { count: todayViews } = await supabaseAdmin
      .from('client_analytics')
      .select('id', { count: 'exact', head: true })
      .eq('website_id', ctx.website.id)
      .eq('event_type', 'page_view')
      .gte('timestamp', todayStart);

    // This week page views
    const { count: weekViews } = await supabaseAdmin
      .from('client_analytics')
      .select('id', { count: 'exact', head: true })
      .eq('website_id', ctx.website.id)
      .eq('event_type', 'page_view')
      .gte('timestamp', weekStart);

    // Last month page views
    const { count: lastMonthViews } = await supabaseAdmin
      .from('client_analytics')
      .select('id', { count: 'exact', head: true })
      .eq('website_id', ctx.website.id)
      .eq('event_type', 'page_view')
      .gte('timestamp', lastMonthStart)
      .lt('timestamp', lastMonthEnd);

    // Unique visitors (approximate via distinct paths for today)
    const { data: todayPaths } = await supabaseAdmin
      .from('client_analytics')
      .select('path, user_agent')
      .eq('website_id', ctx.website.id)
      .eq('event_type', 'page_view')
      .gte('timestamp', todayStart)
      .limit(500);

    // Approximate unique visitors by unique user_agent combos
    const uniqueAgents = new Set((todayPaths || []).map(p => p.user_agent)).size;

    const change = (lastMonthViews || 0) > 0 ? (((monthViews || 0) - (lastMonthViews || 0)) / (lastMonthViews || 1) * 100).toFixed(1) : 0;
    const changeText = Number(change) > 0 ? `That's **${change}% more** than last month! 📈` : Number(change) < 0 ? `That's ${Math.abs(change)}% less than last month.` : '';

    return {
      text: `👀 **Your Visitor Stats:**\n\n**Today:** ${todayViews || 0} page views (~${uniqueAgents} unique visitors)\n**This Week:** ${weekViews || 0} page views\n**This Month:** ${monthViews || 0} page views\n**Last Month:** ${lastMonthViews || 0} page views\n\n${changeText}\n\n${(monthViews || 0) === 0 ? '💡 **Tip:** Share your store link on WhatsApp and Instagram to start getting visitors!' : 'Keep promoting your store to grow traffic! 🚀'}`,
    };
  } catch (err) {
    console.error('getChatVisitorData error:', err);
    return { error: 'Sorry, I couldn\'t fetch your visitor data right now. Please try again.' };
  }
}

// ═══════════════════════════════════════════════════════
//  STORE CHAT FEEDBACK (per-message thumbs up/down)
// ═══════════════════════════════════════════════════════
export async function storeChatFeedback(feedbackData) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return { error: 'Not authenticated' };

    // Store in dedicated chat_feedback table — per-message
    await supabaseAdmin.from('chat_feedback').insert({
      website_id: ctx.website.id,
      session_id: feedbackData.sessionId || null,
      message_index: feedbackData.messageIndex ?? null,
      message_content: (feedbackData.message || '').substring(0, 500),
      feedback: feedbackData.feedback, // 'up' or 'down'
    });

    return { success: true };
  } catch (err) {
    console.error('storeChatFeedback error:', err);
    return { error: err.message };
  }
}

// ═══════════════════════════════════════════════════════
//  ACTION: Update product price
// ═══════════════════════════════════════════════════════
export async function chatUpdateProductPrice(productName, newPrice) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return { error: 'Please sign in to update products.' };

    // Find product by name (fuzzy-ish match)
    const { data: products } = await supabaseAdmin
      .from('products')
      .select('id, name, price')
      .eq('website_id', ctx.website.id)
      .ilike('name', `%${productName}%`)
      .limit(5);

    if (!products || products.length === 0) {
      return { error: `I couldn't find a product matching "${productName}". Please check the name and try again.` };
    }

    if (products.length > 1) {
      const list = products.map(p => `- **${p.name}** (₹${p.price})`).join('\n');
      return { text: `I found multiple products matching "${productName}":\n\n${list}\n\nPlease be more specific — try saying:\n"Change price of [exact product name] to ₹[price]"` };
    }

    const product = products[0];
    const priceNum = parseFloat(newPrice);
    if (isNaN(priceNum) || priceNum < 0) {
      return { error: `"${newPrice}" is not a valid price. Please provide a number like 299 or 1500.` };
    }

    const { error } = await supabaseAdmin
      .from('products')
      .update({ price: priceNum })
      .eq('id', product.id);

    if (error) throw error;

    return {
      text: `✅ **Price Updated!**\n\n**${product.name}**\nOld Price: ₹${product.price}\nNew Price: ₹${priceNum}\n\nThe change is live on your store! 🎉`,
    };
  } catch (err) {
    console.error('chatUpdateProductPrice error:', err);
    return { error: 'Sorry, I couldn\'t update the price. Please try again or do it from the Products page.' };
  }
}

// ═══════════════════════════════════════════════════════
//  ACTION: Update product stock
// ═══════════════════════════════════════════════════════
export async function chatUpdateProductStock(productName, newStock) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return { error: 'Please sign in to update products.' };

    const { data: products } = await supabaseAdmin
      .from('products')
      .select('id, name, stock')
      .eq('website_id', ctx.website.id)
      .ilike('name', `%${productName}%`)
      .limit(5);

    if (!products || products.length === 0) {
      return { error: `I couldn't find a product matching "${productName}". Please check the name.` };
    }

    if (products.length > 1) {
      const list = products.map(p => `- **${p.name}** (Stock: ${p.stock === -1 ? 'Unlimited' : p.stock})`).join('\n');
      return { text: `I found multiple products matching "${productName}":\n\n${list}\n\nPlease be more specific.` };
    }

    const product = products[0];
    const stockNum = parseInt(newStock);
    if (isNaN(stockNum) || stockNum < -1) {
      return { error: `"${newStock}" is not a valid stock number. Use -1 for unlimited, or any positive number.` };
    }

    const { error } = await supabaseAdmin
      .from('products')
      .update({ stock: stockNum })
      .eq('id', product.id);

    if (error) throw error;

    return {
      text: `✅ **Stock Updated!**\n\n**${product.name}**\nOld Stock: ${product.stock === -1 ? 'Unlimited' : product.stock}\nNew Stock: ${stockNum === -1 ? 'Unlimited' : stockNum}\n\nDone! 📦`,
    };
  } catch (err) {
    console.error('chatUpdateProductStock error:', err);
    return { error: 'Sorry, I couldn\'t update the stock. Please try from the Products page.' };
  }
}

// ═══════════════════════════════════════════════════════
//  ACTION: Update order status
// ═══════════════════════════════════════════════════════
export async function chatUpdateOrderStatus(orderId, newStatus) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return { error: 'Please sign in to update orders.' };

    const validStatuses = ['pending', 'paid', 'shipped', 'delivered', 'canceled'];
    const status = newStatus.toLowerCase().trim();
    if (!validStatuses.includes(status)) {
      return { error: `"${newStatus}" is not a valid status. Valid options are: ${validStatuses.join(', ')}` };
    }

    const { data: order, error: fetchError } = await supabaseAdmin
      .from('orders')
      .select('id, status')
      .eq('id', orderId)
      .eq('website_id', ctx.website.id)
      .maybeSingle();

    if (fetchError || !order) {
      return { error: `Order #${orderId} not found. Please check the order ID.` };
    }

    const { error } = await supabaseAdmin
      .from('orders')
      .update({ status })
      .eq('id', order.id);

    if (error) throw error;

    return {
      text: `✅ **Order Updated!**\n\nOrder #${orderId}\n**${order.status}** → **${status}**\n\nDone! The order status has been updated. 📋`,
    };
  } catch (err) {
    console.error('chatUpdateOrderStatus error:', err);
    return { error: 'Sorry, I couldn\'t update the order. Please try from the Orders page.' };
  }
}

// ═══════════════════════════════════════════════════════
//  STORE CONVERSATION IN DB (dedicated chat_sessions table)
// ═══════════════════════════════════════════════════════
export async function storeChatConversation(conversationData) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return { error: 'Not authenticated' };

    await supabaseAdmin.from('chat_sessions').insert({
      website_id: ctx.website.id,
      session_id: conversationData.sessionId || `session_${Date.now()}`,
      message_count: conversationData.messageCount || 0,
      topics: conversationData.topics || [],
      started_at: conversationData.startedAt || new Date().toISOString(),
      ended_at: new Date().toISOString(),
      metadata: conversationData.metadata || {},
    });

    return { success: true };
  } catch (err) {
    console.error('storeChatConversation error:', err);
    return { error: err.message };
  }
}

// ═══════════════════════════════════════════════════════
//  SMART QUERY: Natural language → DB lookup
//  Handles: "price of X", "stock of X", "orders from today",
//           "how many X sold", "details of product X", etc.
// ═══════════════════════════════════════════════════════
export async function chatSmartQuery(queryText) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return null;

    const q = queryText.toLowerCase().trim();

    // ── Pattern 1: Product lookup ──
    // "price of X", "X price", "X ka price", "show X", "details of X"
    const productLookupPatterns = [
      /(?:price|rate|daam|kimat)\s+(?:of|for|ka|ki)?\s*(.+)/i,
      /(.+?)\s+(?:ka|ki|ke)?\s*(?:price|rate|daam|kimat)/i,
      /(?:stock|inventory)\s+(?:of|for|ka|ki)?\s*(.+)/i,
      /(.+?)\s+(?:ka|ki|ke)?\s*(?:stock|inventory)/i,
      /(?:show|details|info|about)\s+(?:of|for|about)?\s*(?:product)?\s*(.+)/i,
      /(?:product)\s+(.+?)\s+(?:dikhao|batao|show)/i,
    ];

    for (const pattern of productLookupPatterns) {
      const match = q.match(pattern);
      if (match && match[1]) {
        const searchName = match[1].trim().replace(/[?"']/g, '');
        if (searchName.length < 2) continue;

        const { data: products } = await supabaseAdmin
          .from('products')
          .select('id, name, price, stock, description, category_id')
          .eq('website_id', ctx.website.id)
          .ilike('name', `%${searchName}%`)
          .limit(5);

        if (products && products.length > 0) {
          if (products.length === 1) {
            const p = products[0];
            const stockText = p.stock === -1 ? 'Unlimited' : p.stock;
            return {
              text: `📦 **${p.name}**\n\n**Price:** ₹${p.price}\n**Stock:** ${stockText}\n${p.description ? `**Description:** ${p.description}\n` : ''}\nWant to update anything?`,
              followUp: [`Change price of ${p.name}`, `Update stock of ${p.name}`, 'Show all products'],
            };
          } else {
            let text = `I found ${products.length} products matching "${searchName}":\n\n`;
            products.forEach(p => {
              text += `• **${p.name}** — ₹${p.price} (Stock: ${p.stock === -1 ? 'Unlimited' : p.stock})\n`;
            });
            text += `\nWhich one did you mean?`;
            return { text, followUp: products.slice(0, 3).map(p => `Show ${p.name}`) };
          }
        }
      }
    }

    // ── Pattern 2: Order lookup ──
    // "order #42", "order 42", "show order 42"
    const orderPattern = /(?:order|order no|order number|order id)\s*#?\s*(\d+)/i;
    const orderMatch = q.match(orderPattern);
    if (orderMatch) {
      const orderId = parseInt(orderMatch[1]);
      const { data: order } = await supabaseAdmin
        .from('orders')
        .select('id, status, total_amount, created_at, customer_id, payment_method')
        .eq('id', orderId)
        .eq('website_id', ctx.website.id)
        .maybeSingle();

      if (order) {
        const statusEmoji = { pending: '📌', paid: '💳', shipped: '🚚', delivered: '✅', canceled: '❌' };
        const dateStr = new Date(order.created_at).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

        // Get customer info if available
        let customerName = 'N/A';
        if (order.customer_id) {
          const { data: customer } = await supabaseAdmin
            .from('customers')
            .select('name')
            .eq('id', order.customer_id)
            .maybeSingle();
          if (customer) customerName = customer.name;
        }

        return {
          text: `📋 **Order #${order.id}**\n\n${statusEmoji[order.status] || '📌'} **Status:** ${order.status}\n**Amount:** ₹${order.total_amount}\n**Customer:** ${customerName}\n**Payment:** ${order.payment_method || 'N/A'}\n**Date:** ${dateStr}`,
          followUp: [`Mark order ${order.id} as shipped`, `Mark order ${order.id} as delivered`, 'Show pending orders'],
        };
      } else {
        return { text: `I couldn't find Order #${orderId}. Please check the order number.` };
      }
    }

    // ── Pattern 3: Customer lookup ──
    // "customer X", "orders by X"
    const customerPatterns = [
      /(?:customer|buyer|orders?\s+(?:by|from|of))\s+(.+)/i,
    ];
    for (const pattern of customerPatterns) {
      const match = q.match(pattern);
      if (match && match[1]) {
        const searchName = match[1].trim().replace(/[?"']/g, '');
        if (searchName.length < 2) continue;

        const { data: customers } = await supabaseAdmin
          .from('customers')
          .select('id, name, email, phone')
          .eq('website_id', ctx.website.id)
          .ilike('name', `%${searchName}%`)
          .limit(3);

        if (customers && customers.length > 0) {
          const c = customers[0];
          // Count orders for this customer
          const { count } = await supabaseAdmin
            .from('orders')
            .select('id', { count: 'exact', head: true })
            .eq('customer_id', c.id)
            .eq('website_id', ctx.website.id);

          return {
            text: `👤 **${c.name}**\n\n**Email:** ${c.email || 'N/A'}\n**Phone:** ${c.phone || 'N/A'}\n**Total Orders:** ${count || 0}`,
            followUp: ['Show all customers', 'Show recent orders'],
          };
        }
      }
    }

    // ── Pattern 4: Category lookup ──
    // "products in X category", "X category products"
    const catPatterns = [
      /(?:products?\s+(?:in|from|of))\s+(.+?)\s*(?:category)?$/i,
      /(.+?)\s+(?:category)\s+(?:ke|ka|ki)?\s*(?:products?|items?)/i,
    ];
    for (const pattern of catPatterns) {
      const match = q.match(pattern);
      if (match && match[1]) {
        const catName = match[1].trim().replace(/[?"']/g, '');
        if (catName.length < 2) continue;

        const { data: categories } = await supabaseAdmin
          .from('categories')
          .select('id, name')
          .eq('website_id', ctx.website.id)
          .ilike('name', `%${catName}%`)
          .limit(1);

        if (categories && categories.length > 0) {
          const cat = categories[0];
          const { data: products } = await supabaseAdmin
            .from('products')
            .select('name, price, stock')
            .eq('website_id', ctx.website.id)
            .eq('category_id', cat.id)
            .limit(10);

          if (products && products.length > 0) {
            let text = `📁 **${cat.name}** — ${products.length} product${products.length !== 1 ? 's' : ''}:\n\n`;
            products.forEach(p => {
              text += `• **${p.name}** — ₹${p.price} (Stock: ${p.stock === -1 ? '∞' : p.stock})\n`;
            });
            return { text, followUp: ['Show all categories', 'Add a product'] };
          } else {
            return { text: `Category **"${cat.name}"** exists but has no products yet.\n\nWant to add a product to it?`, followUp: ['Add a product'] };
          }
        }
      }
    }

    // ── Pattern 5: Offer/coupon lookup ──
    // "offer X", "coupon X", "is X code valid"
    const offerPatterns = [
      /(?:offer|coupon|code|discount)\s+(.+)/i,
      /(?:is)\s+(.+?)\s+(?:valid|active|working)/i,
    ];
    for (const pattern of offerPatterns) {
      const match = q.match(pattern);
      if (match && match[1]) {
        const code = match[1].trim().toUpperCase().replace(/[?"']/g, '');
        if (code.length < 2) continue;

        const { data: offer } = await supabaseAdmin
          .from('offers')
          .select('code, type, value, is_active, used_count, usage_limit, expires_at')
          .eq('website_id', ctx.website.id)
          .ilike('code', `%${code}%`)
          .maybeSingle();

        if (offer) {
          const discount = offer.type === 'percentage' ? `${offer.value}% off` : `₹${offer.value} off`;
          const status = offer.is_active ? '🟢 Active' : '🔴 Inactive';
          return {
            text: `🏷️ **${offer.code}**\n\n**Discount:** ${discount}\n**Status:** ${status}\n**Used:** ${offer.used_count || 0}${offer.usage_limit ? `/${offer.usage_limit}` : ''} times\n**Expires:** ${offer.expires_at ? new Date(offer.expires_at).toLocaleDateString('en-IN') : 'Never'}`,
            followUp: ['Show all offers', 'Create a new offer'],
          };
        }
      }
    }

    return null; // No smart query match
  } catch (err) {
    console.error('chatSmartQuery error:', err);
    return null;
  }
}

// ═══════════════════════════════════════════════════════
//  WIZARD: Add Product (via chat flow)
// ═══════════════════════════════════════════════════════
export async function chatAddProduct(productData) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return { error: 'Please sign in to add products.' };

    let finalStock = parseInt(productData.stock);
    if (isNaN(finalStock)) finalStock = -1;
    if (productData.isUnlimited) finalStock = -1;
    if (finalStock < 0) finalStock = -1;

    const { data, error } = await supabaseAdmin
      .from('products')
      .insert({
        name: productData.name,
        price: productData.price,
        category_id: productData.categoryId === 'uncategorized' ? null : productData.categoryId || null,
        description: productData.description || '',
        image_url: productData.imageUrl || '',
        stock: finalStock,
        website_id: ctx.website.id,
        additional_images: productData.additionalImages || [],
        variants: productData.variants || [],
      })
      .select()
      .single();

    if (error) throw error;

    // Sync website_data JSON
    try {
      const { data: products } = await supabaseAdmin.from('products')
        .select('id, name, price, category_id, description, image_url, stock, additional_images, variants')
        .eq('website_id', ctx.website.id);
      const { data: categories } = await supabaseAdmin.from('categories')
        .select('id, name').eq('website_id', ctx.website.id);
      const { data: website } = await supabaseAdmin.from('websites')
        .select('website_data').eq('id', ctx.website.id).single();
      if (website && products) {
        const currentData = website.website_data || {};
        const mappedProducts = products.map(p => ({ id: p.id, name: p.name, price: Number(p.price), category: p.category_id ? String(p.category_id) : 'uncategorized', description: p.description, image: p.image_url, stock: p.stock, additional_images: p.additional_images || [], variants: p.variants || [] }));
        const mappedCategories = (categories || []).map(c => ({ id: String(c.id), name: c.name }));
        await supabaseAdmin.from('websites').update({ website_data: { ...currentData, allProducts: mappedProducts, categories: mappedCategories.length > 0 ? mappedCategories : (currentData.categories || []) } }).eq('id', ctx.website.id);
      }
    } catch (syncErr) { console.error('Sync error (non-fatal):', syncErr); }

    return { success: true, text: `✅ **Product Added!**\n\n**${data.name}** is now live on your store at ₹${data.price}!\n\nYou can add images and more details from the Products page. 🎉` };
  } catch (err) {
    console.error('chatAddProduct error:', err);
    return { error: err.message || 'Failed to add product. Please try again.' };
  }
}

// ═══════════════════════════════════════════════════════
//  WIZARD: Create Offer (via chat flow)
// ═══════════════════════════════════════════════════════
export async function chatCreateOffer(offerData) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return { error: 'Please sign in to create offers.' };

    // Check if code already exists
    const { data: existing } = await supabaseAdmin
      .from('offers')
      .select('id')
      .eq('website_id', ctx.website.id)
      .eq('code', offerData.code)
      .maybeSingle();

    if (existing) {
      return { error: `Offer code "${offerData.code}" already exists. Please use a different code.` };
    }

    const { data, error } = await supabaseAdmin
      .from('offers')
      .insert({
        website_id: ctx.website.id,
        code: offerData.code,
        type: offerData.type,
        value: offerData.value,
        min_order_value: offerData.minOrderValue || 0,
        is_active: true,
        is_featured: false,
      })
      .select()
      .single();

    if (error) throw error;

    return { success: true, text: `✅ **Offer Created!**\n\n**${data.code}** — ${data.type === 'percentage' ? `${data.value}% off` : `₹${data.value} off`}\n\nShare this code with your customers! 🎉` };
  } catch (err) {
    console.error('chatCreateOffer error:', err);
    return { error: err.message || 'Failed to create offer. Please try again.' };
  }
}

// ═══════════════════════════════════════════════════════
//  WIZARD: Add Category (via chat flow)
// ═══════════════════════════════════════════════════════
export async function chatAddCategory(categoryName) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return { error: 'Please sign in to add categories.' };

    const { data, error } = await supabaseAdmin
      .from('categories')
      .insert({ name: categoryName, website_id: ctx.website.id })
      .select()
      .single();

    if (error) throw error;

    // Sync website_data
    try {
      const { data: products } = await supabaseAdmin.from('products')
        .select('id, name, price, category_id, description, image_url, stock, additional_images, variants')
        .eq('website_id', ctx.website.id);
      const { data: categories } = await supabaseAdmin.from('categories')
        .select('id, name').eq('website_id', ctx.website.id);
      const { data: website } = await supabaseAdmin.from('websites')
        .select('website_data').eq('id', ctx.website.id).single();
      if (website && products) {
        const currentData = website.website_data || {};
        const mappedProducts = products.map(p => ({ id: p.id, name: p.name, price: Number(p.price), category: p.category_id ? String(p.category_id) : 'uncategorized', description: p.description, image: p.image_url, stock: p.stock, additional_images: p.additional_images || [], variants: p.variants || [] }));
        const mappedCategories = (categories || []).map(c => ({ id: String(c.id), name: c.name }));
        await supabaseAdmin.from('websites').update({ website_data: { ...currentData, allProducts: mappedProducts, categories: mappedCategories.length > 0 ? mappedCategories : (currentData.categories || []) } }).eq('id', ctx.website.id);
      }
    } catch (syncErr) { console.error('Sync error (non-fatal):', syncErr); }

    return { success: true, text: `✅ **Category Created!**\n\nCategory **"${data.name}"** is now available. You can assign products to it!` };
  } catch (err) {
    console.error('chatAddCategory error:', err);
    return { error: err.message || 'Failed to add category.' };
  }
}

// ═══════════════════════════════════════════════════════
//  WIZARD: Delete Product (via chat flow)
// ═══════════════════════════════════════════════════════
export async function chatDeleteProduct(productName) {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return { error: 'Please sign in to delete products.' };

    const { data: products } = await supabaseAdmin
      .from('products')
      .select('id, name')
      .eq('website_id', ctx.website.id)
      .ilike('name', `%${productName}%`)
      .limit(5);

    if (!products || products.length === 0) {
      return { error: `I couldn't find a product matching "${productName}". Please check the name.` };
    }

    if (products.length > 1) {
      const list = products.map(p => `- ${p.name}`).join('\n');
      return { text: `I found multiple products:\n\n${list}\n\nPlease be more specific with the exact name.` };
    }

    const product = products[0];
    const { error } = await supabaseAdmin.from('products').delete().eq('id', product.id);
    if (error) throw error;

    // Sync
    try {
      const { data: allProducts } = await supabaseAdmin.from('products')
        .select('id, name, price, category_id, description, image_url, stock, additional_images, variants')
        .eq('website_id', ctx.website.id);
      const { data: categories } = await supabaseAdmin.from('categories')
        .select('id, name').eq('website_id', ctx.website.id);
      const { data: website } = await supabaseAdmin.from('websites')
        .select('website_data').eq('id', ctx.website.id).single();
      if (website) {
        const currentData = website.website_data || {};
        const mappedProducts = (allProducts || []).map(p => ({ id: p.id, name: p.name, price: Number(p.price), category: p.category_id ? String(p.category_id) : 'uncategorized', description: p.description, image: p.image_url, stock: p.stock, additional_images: p.additional_images || [], variants: p.variants || [] }));
        const mappedCategories = (categories || []).map(c => ({ id: String(c.id), name: c.name }));
        await supabaseAdmin.from('websites').update({ website_data: { ...currentData, allProducts: mappedProducts, categories: mappedCategories.length > 0 ? mappedCategories : (currentData.categories || []) } }).eq('id', ctx.website.id);
      }
    } catch (syncErr) { console.error('Sync error (non-fatal):', syncErr); }

    return { success: true, text: `✅ Product **"${product.name}"** has been deleted.` };
  } catch (err) {
    console.error('chatDeleteProduct error:', err);
    return { error: err.message || 'Failed to delete product.' };
  }
}

// ═══════════════════════════════════════════════════════
//  WIZARD: Publish Website (via chat flow)
// ═══════════════════════════════════════════════════════
export async function chatPublishWebsite() {
  try {
    const ctx = await getAuthContext();
    if (!ctx) return { error: 'Please sign in to publish your website.' };

    if (ctx.website.is_published) {
      return { text: '🟢 Your website is already published and live!\n\nURL: **' + ctx.website.site_slug + '.bizvistar.in**' };
    }

    const { error } = await supabaseAdmin
      .from('websites')
      .update({ is_published: true })
      .eq('id', ctx.website.id);

    if (error) throw error;

    return { success: true, text: `✅ **Website Published!**\n\nYour store is now live at **${ctx.website.site_slug}.bizvistar.in**! 🎉\n\nShare your link with customers!` };
  } catch (err) {
    console.error('chatPublishWebsite error:', err);
    return { error: err.message || 'Failed to publish website.' };
  }
}
