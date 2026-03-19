const fs = require('fs');
const pagePath = 'src/app/dashboard/analytics/page.js';
const compPath = 'src/components/dashboard/analytics/FunnelChart.js';

// 1. Pass abandonedCartData to FunnelChart
let pageContent = fs.readFileSync(pagePath, 'utf8');
pageContent = pageContent.replace(/<FunnelChart data=\{data.funnelData\} \/>/, '<FunnelChart data={data.funnelData} abandonedCarts={data.abandonedCartData} />');
fs.writeFileSync(pagePath, pageContent);

// 2. Update FunnelChart to accept and display it
let compContent = fs.readFileSync(compPath, 'utf8');
compContent = compContent.replace(/export default function FunnelChart\(\{ data \}\) \{/, 'export default function FunnelChart({ data, abandonedCarts = 0 }) {');
compContent = compContent.replace(/<div className="flex justify-between items-center mb-10">\s*<h3 className="font-semibold text-gray-900 text-lg">Conversion Funnel<\/h3>\s*<span className="text-xs font-semibold bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100 flex items-center gap-1">\s*<svg.*?><path.*?\/><\/svg>\s*\{conversionRate\}% Conv. Rate\s*<\/span>\s*<\/div>/, `<div className="flex justify-between items-center mb-10">
        <h3 className="font-semibold text-gray-900 text-lg">Conversion Funnel</h3>
        <div className="flex items-center gap-3">
            <span className="text-xs font-semibold bg-orange-50 text-orange-700 px-3 py-1.5 rounded-full border border-orange-100 flex items-center gap-1">
               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
               {abandonedCarts} Abandoned
            </span>
            <span className="text-xs font-semibold bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100 flex items-center gap-1">
               <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
               {conversionRate}% Conv. Rate
            </span>
        </div>
      </div>`);

fs.writeFileSync(compPath, compContent);
console.log('Funnel UI updated to show abandoned carts metric.');
