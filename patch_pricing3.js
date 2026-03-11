const fs = require('fs');
const file = 'src/app/pricing/page.js';
let content = fs.readFileSync(file, 'utf8');

// Next.js requires useSearchParams to be wrapped in a suspense boundary if used in a server component or page directly in some Next setups, but this is a client component ('use client' at top). We will wrap it just in case, but let's check if 'use client' is there.
const isClient = content.includes("'use client'");
if (!isClient) {
  content = "'use client';\n" + content;
}

// We need to add Suspense to the page export to prevent build errors with useSearchParams
content = content.replace(
  `export default function PricingPage() {`,
  `import { Suspense } from 'react';\n\nfunction PricingContent() {`
);

content = content.replace(
  `export default function PricingPage`,
  `function PricingContent`
);

content += `\n\nexport default function PricingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <PricingContent />
    </Suspense>
  );
}`;

fs.writeFileSync(file, content);
