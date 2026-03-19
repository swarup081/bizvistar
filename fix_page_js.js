const fs = require('fs');
const pagePath = 'src/app/dashboard/analytics/page.js';
let content = fs.readFileSync(pagePath, 'utf8');

// 1. Calculate targetMultiplier based on dateRange
content = content.replace(/const \[websiteId, setWebsiteId\] = useState\(null\);/,
  'const [websiteId, setWebsiteId] = useState(null);\n  let targetMultiplier = 1;\n  if (dateRange === "7d") targetMultiplier = 7/30;\n  if (dateRange === "90d") targetMultiplier = 3;\n  if (dateRange === "year") targetMultiplier = 12;'
);

// Add customers to promise all
content = content.replace(/supabase\s*\.from\("client_analytics"\)\s*\.select\("event_type, timestamp, location, path"\)\s*\.eq\("website_id", website\.id\)\s*\.gte\("timestamp", prevStartDateISO\)/,
  'supabase\n          .from("client_analytics")\n          .select("event_type, timestamp, location, path")\n          .eq("website_id", website.id)\n          .gte("timestamp", prevStartDateISO),\n        supabase\n          .from("customers")\n          .select("id, shipping_address")\n          .eq("website_id", website.id)'
);

content = content.replace(/const \[allOrdersRes, allEventsRes\] = await Promise\.all\(\[/, 'const [allOrdersRes, allEventsRes, customersRes] = await Promise.all([');
content = content.replace(/const allEvents = allEventsRes\.data \|\| \[\];/, 'const allEvents = allEventsRes.data || [];\n      const allCustomers = customersRes.data || [];');

// Change "6. Active Users by State" logic
const newActiveUsersLogic = `
      // 6. Active Users by State (from Customers table)
      const stateMap = {};
      let totalStateUsers = 0;
      allCustomers.forEach(c => {
         const state = c.shipping_address?.state;
         if (state) {
             stateMap[state] = (stateMap[state] || 0) + 1;
             totalStateUsers++;
         }
      });

      let sortedStates = Object.entries(stateMap)
         .map(([state, users]) => ({ state, users }))
         .sort((a, b) => b.users - a.users);

      let activeUsersState = [];
      if (sortedStates.length > 4) {
          activeUsersState = sortedStates.slice(0, 4);
          const otherUsers = sortedStates.slice(4).reduce((sum, s) => sum + s.users, 0);
          if (otherUsers > 0) {
              activeUsersState.push({ state: 'Other', users: otherUsers });
          }
      } else {
          activeUsersState = sortedStates;
      }
`;

content = content.replace(/\/\/ 6\. Active Users by State[\s\S]*?\} else \{\s*activeUsersState = sortedStates;\s*\}/, newActiveUsersLogic);

// Add targetMultiplier to data state
content = content.replace(/abandonedCartData\n      \}\);/, 'abandonedCartData,\n        targetMultiplier\n      });');

// Pass targetMultiplier to MonthlyTargetCard
content = content.replace(/<MonthlyTargetCard websiteId=\{websiteId\} currentRevenue=\{data\.totalRevenue\} prevRevenue=\{data\.prevRevenue\} \/>/,
  '<MonthlyTargetCard websiteId={websiteId} currentRevenue={data.totalRevenue} prevRevenue={data.prevRevenue} targetMultiplier={data.targetMultiplier} />'
);

// Replace generic loading with a skeleton grid
const loadingSkeleton = `
        <div className="flex flex-col gap-6 w-full overflow-hidden animate-pulse">
             {/* Overview Cards Skeleton */}
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                 {[1,2,3,4].map(i => <div key={i} className="h-32 bg-gray-100 rounded-2xl w-full"></div>)}
             </div>

             {/* Row 2 Skeleton */}
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                 <div className="lg:col-span-2 h-[350px] bg-gray-100 rounded-2xl w-full"></div>
                 <div className="lg:col-span-1 h-[350px] bg-gray-100 rounded-2xl w-full"></div>
                 <div className="lg:col-span-1 h-[350px] bg-gray-100 rounded-2xl w-full"></div>
             </div>

             {/* Row 3 Skeleton */}
             <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                 <div className="lg:col-span-1 h-[300px] bg-gray-100 rounded-2xl w-full"></div>
                 <div className="lg:col-span-2 h-[300px] bg-gray-100 rounded-2xl w-full"></div>
                 <div className="lg:col-span-1 h-[300px] bg-gray-100 rounded-2xl w-full"></div>
             </div>
        </div>
`;
content = content.replace(/<div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-3 w-full">[\s\S]*?<\/div>/, loadingSkeleton);

fs.writeFileSync(pagePath, content);
console.log('Fixed page.js logic and loading state.');
