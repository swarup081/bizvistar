const fs = require('fs');
const file = 'src/components/dashboard/analytics/AIPredictionCard.js';
let content = fs.readFileSync(file, 'utf8');

// The issue might be that `websiteId` is null on first render, causing an early exit,
// and when `websiteId` does populate, it might not re-trigger if not careful,
// or the error state is triggering and getting stuck.
// Also, let's remove the error state if there's no data and just use the fallback the API provides

content = content.replace(/if \(!websiteId\) return;/g, 'if (!websiteId) return;'); // ensure it returns when null
content = content.replace(/if \(data\.error\) \{\s*throw new Error\(data\.error\);\s*\}/g, 'if (data.error) throw new Error(data.error);');
content = content.replace(/\} else \? error \|\| !insight \? \(/g, '} else if (error || !insight) { return <div ...');

// actually rewrite the render function safely
content = content.replace(/\{loading \? \([\s\S]*?\) : error \|\| !insight \? \([\s\S]*?\) : \(/, `{loading ? (
        <div className="flex-grow flex flex-col gap-5 w-full h-full min-h-[250px] animate-pulse">
          <div className="h-4 bg-gray-200 rounded-md w-3/4 mb-2"></div>
          {[1, 2, 3].map((i) => (
             <div key={i} className="flex items-start gap-3 w-full bg-gray-50 p-3 rounded-xl border border-gray-100">
                <div className="w-8 h-8 bg-gray-200 rounded-lg shrink-0 mt-0.5"></div>
                <div className="flex-1 space-y-2.5 py-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                </div>
             </div>
          ))}
        </div>
      ) : error || !insight ? (
        <div className="flex-grow flex items-center justify-center text-sm text-gray-400 min-h-[150px]">
          No insights available right now. ({error || 'Unknown error'})
        </div>
      ) : (`);

fs.writeFileSync(file, content);
console.log('Fixed AI Prediction card error reporting.');
