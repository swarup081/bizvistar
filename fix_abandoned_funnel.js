const fs = require('fs');

const path = 'src/app/dashboard/analytics/page.js';
let content = fs.readFileSync(path, 'utf8');

const newFunnelLogic = `
      // 3. Funnel Logic
      const cleanPath = (p) => {
          if (!p) return '/';
          let cleaned = p;
          if (website.site_slug) {
             cleaned = cleaned.replace(\`/site/\${website.site_slug}\`, '');
             cleaned = cleaned.replace(\`/templates/\${website.template_id}\`, '');
          }
          if (cleaned === '') return '/';
          return cleaned;
      };

      const funnelSets = {
          visitors: new Set(),
          product: new Set(),
          addToCart: new Set(),
          checkout: new Set(),
      };

      currentEvents.forEach(e => {
          const vid = e.location?.visitor_id || e.location?.ip || 'anon';
          if (vid === 'anon') return;
          funnelSets.visitors.add(vid);
          const path = cleanPath(e.path);
          if (path.includes('shop') || path.includes('product') || e.event_type === 'product_view') funnelSets.product.add(vid);
          if (e.event_type === 'add_to_cart') funnelSets.addToCart.add(vid);
          if (path.includes('checkout')) funnelSets.checkout.add(vid);
      });

      const rawVisitors = funnelSets.visitors.size;
      const rawProductViews = funnelSets.product.size;
      const rawAddCarts = funnelSets.addToCart.size;
      const rawCheckouts = funnelSets.checkout.size;
      const purchases = totalOrdersCount;

      // Waterfall Enforce: Each step must be at least as big as the next step
      const checkouts = Math.max(rawCheckouts, purchases);
      const addCarts = Math.max(rawAddCarts, checkouts);
      const productViews = Math.max(rawProductViews, addCarts);
      const visitors = Math.max(rawVisitors, productViews, totalVisitors);

      // Abandoned carts: users who added to cart but didn't purchase.
      // E.g. addCarts = 10, purchases = 2 -> abandoned = 8
      const abandonedEstimate = Math.max(0, addCarts - purchases);

      const funnelData = [
          { name: 'Total Visitors', value: visitors, fill: '#F5F3FF' },
          { name: 'Product Views', value: productViews, fill: '#EDE9FE' },
          { name: 'Add to Cart', value: addCarts, fill: '#DDD6FE' },
          { name: 'Proceed to Checkout', value: checkouts, fill: '#C4B5FD' },
          { name: 'Completed Purchases', value: purchases, fill: '#A78BFA' }
      ];

      const abandonedCartData = abandonedEstimate;

      // 4. Grouping for Charts
`;

content = content.replace(/\/\/ 3\. Funnel Logic[\s\S]*?\/\/ 4\. Grouping for Charts/, newFunnelLogic);

// Add abandonedData to setData
content = content.replace(/funnelData\n      }\);/, 'funnelData,\n        abandonedCartData\n      });');

fs.writeFileSync(path, content);
console.log('Funnel logic updated for 5 steps and independent abandoned cart.');
