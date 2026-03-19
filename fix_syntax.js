const fs = require('fs');
const path = 'src/app/dashboard/analytics/page.js';
let content = fs.readFileSync(path, 'utf8');

// We replaced part of the loading state incorrectly, leaving `<p>` dangling.
// The regex was: `/<div className="h-64 flex flex-col items-center justify-center text-gray-400 gap-3 w-full">[\s\S]*?<\/div>/`
// It didn't consume the `<p>` and closing `</div>` correctly because of `</div>` matching too early.

content = content.replace(/<\/div>\n\n             <p className="text-sm font-medium">Loading analytics\.\.\.<\/p>\n        <\/div>/, '</div>');

fs.writeFileSync(path, content);
console.log('Fixed syntax error in page.js');
