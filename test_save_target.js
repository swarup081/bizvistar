const fs = require('fs');
const file = 'src/components/dashboard/analytics/MonthlyTargetCard.js';
let content = fs.readFileSync(file, 'utf8');

// The issue might be e.preventDefault() missing, or onMouseDown taking precedence.
// We change onClick to onMouseDown so that it fires before blur events if there are any
content = content.replace(/onClick=\{handleSave\}/g, 'onMouseDown={(e) => { e.preventDefault(); handleSave(e); }}');
content = content.replace(/onClick=\{\(e\) => \{ e\.stopPropagation\(\); setIsEditing\(false\); \}\}/g, 'onMouseDown={(e) => { e.preventDefault(); e.stopPropagation(); setIsEditing(false); }}');

fs.writeFileSync(file, content);
console.log('Fixed MonthlyTargetCard button event handlers.');
