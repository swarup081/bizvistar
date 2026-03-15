const fs = require('fs');
const file = 'src/app/pricing/page.js';
let content = fs.readFileSync(file, 'utf8');

// I also need to update the check for the "update" flag to pass it to the checkout page if needed, and make sure the link includes update=true.
content = content.replace(
    /query: {\s*plan: plan.name,\s*billing: isYearly \? 'yearly' : 'monthly',\s*price: plan.price\s*}/g,
    `query: {
                plan: plan.name,
                billing: isYearly ? 'yearly' : 'monthly',
                price: plan.price,
                ...(isUpdateFlow ? { update: 'true' } : {})
            }`
);

fs.writeFileSync(file, content);
