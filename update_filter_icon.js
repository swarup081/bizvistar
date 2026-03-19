const fs = require('fs');
const file = 'src/components/dashboard/analytics/SearchFilterHeader.js';
let content = fs.readFileSync(file, 'utf8');

// The dashboard pages (e.g. Products/Orders) usually use `Filter` or custom SVGs.
// We will replace Calendar with Filter from lucide-react.
content = content.replace(/import \{ Search, ChevronDown, Calendar \} from 'lucide-react';/, "import { Search, ChevronDown, Filter } from 'lucide-react';");
content = content.replace(/<Calendar size=\{16\} className="text-\[#8A63D2\] hidden sm:block"\/>/, '<Filter size={16} className="text-[#8A63D2] hidden sm:block"/>');

fs.writeFileSync(file, content);
console.log('Fixed Filter Icon');
