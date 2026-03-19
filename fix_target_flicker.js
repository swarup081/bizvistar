const fs = require('fs');
const path = 'src/components/dashboard/analytics/MonthlyTargetCard.js';
let content = fs.readFileSync(path, 'utf8');

// Add initialLoading state
content = content.replace(/const \[loading, setLoading\] = useState\(false\);/, 'const [loading, setLoading] = useState(false);\n  const [initialLoading, setInitialLoading] = useState(true);');

// Update fetchTarget useEffect to handle initialLoading
const newEffect = `
  useEffect(() => {
     async function fetchTarget() {
         if (!websiteId) return;
         setInitialLoading(true);
         try {
             const res = await getMonthlyTarget(websiteId);
             if (res && res.data) {
                 setTarget(res.data);
             }
         } catch (e) {
             console.error("Failed to load target", e);
         } finally {
             setInitialLoading(false);
         }
     }
     fetchTarget();
  }, [websiteId]);
`;
content = content.replace(/useEffect\(\(\) => \{\s*async function fetchTarget\(\) \{[\s\S]*?fetchTarget\(\);\s*\}, \[websiteId\]\);/, newEffect);

// Add skeleton return if initialLoading is true
const returnBlock = `
  if (initialLoading) {
     return (
        <div id="monthly-target" className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col h-full w-full relative animate-pulse">
           <div className="flex justify-between items-center mb-4">
               <div className="h-5 bg-gray-200 rounded w-1/2"></div>
               <div className="h-5 w-5 bg-gray-200 rounded-full"></div>
           </div>
           <div className="relative h-32 w-full mt-2 overflow-hidden flex items-end justify-center">
               <div className="h-24 w-48 bg-gray-100 rounded-t-full"></div>
           </div>
           <div className="text-center mt-auto mb-6 flex flex-col items-center gap-2">
               <div className="h-4 bg-gray-200 rounded w-1/3"></div>
               <div className="h-3 bg-gray-200 rounded w-3/4"></div>
           </div>
           <div className="h-[60px] bg-gray-100 rounded-xl w-full"></div>
        </div>
     );
  }

  return (
    <div id="monthly-target" className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col h-full w-full relative">
`;
content = content.replace(/return \(\s*<div id="monthly-target" className="rounded-2xl bg-white p-6 shadow-sm border border-gray-100 flex flex-col h-full w-full relative">/, returnBlock);

fs.writeFileSync(path, content);
console.log('Fixed MonthlyTargetCard initial flicker.');
