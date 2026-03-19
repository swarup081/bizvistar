const fs = require('fs');
const file = 'src/components/dashboard/analytics/MonthlyTargetCard.js';
let content = fs.readFileSync(file, 'utf8');

// Replace the <Check> button with a spinner if `loading` is true
const newButtons = `
                       <button type="button" onMouseDown={(e) => { e.preventDefault(); handleSave(e); }} disabled={loading} className="text-green-500 hover:text-green-700 bg-green-50 p-1.5 rounded-md transition-colors cursor-pointer flex-shrink-0 z-30">
                          {loading ? (
                             <div className="w-3.5 h-3.5 border-2 border-green-200 border-t-green-500 rounded-full animate-spin pointer-events-none" />
                          ) : (
                             <Check className="w-3.5 h-3.5 pointer-events-none" />
                          )}
                       </button>
                       <button type="button" onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditing(false); }} disabled={loading} className="text-red-500 hover:text-red-700 bg-red-50 p-1.5 rounded-md transition-colors cursor-pointer flex-shrink-0 z-30">
                          <X className="w-3.5 h-3.5 pointer-events-none" />
                       </button>
`;
content = content.replace(/<button type="button" onMouseDown=\{\(e\) => \{ e\.preventDefault\(\); handleSave\(e\); \}\} disabled=\{loading\}[\s\S]*?<X className="w-3\.5 h-3\.5 pointer-events-none" \/>\s*<\/button>/, newButtons);

// Make sure input is disabled while loading
content = content.replace(/onChange=\{\(e\) => setEditValue\(e\.target\.value\)\}/, "onChange={(e) => setEditValue(e.target.value)} disabled={loading}");

fs.writeFileSync(file, content);
console.log('Fixed target loader');
