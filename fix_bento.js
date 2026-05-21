const fs = require('fs');
let file = fs.readFileSync('/Users/Shared/BizVistar/src/components/blogs/BlogBentoGrid.js', 'utf8');

// We only want to apply these to the DESKTOP GRID part (up to "MOBILE & TABLET FALLBACK")
const desktopParts = file.split('{/* MOBILE & TABLET FALLBACK */}');
let desktop = desktopParts[0];

// h-[646px] -> md:h-[500px] lg:h-[646px]
desktop = desktop.replace(/h-\[646px\]/g, 'h-[500px] lg:h-[646px]');
// h-[380px] -> md:h-[280px] lg:h-[380px]
desktop = desktop.replace(/h-\[380px\]/g, 'h-[280px] lg:h-[380px]');
// h-[250px] -> md:h-[204px] lg:h-[250px]
desktop = desktop.replace(/h-\[250px\]/g, 'h-[204px] lg:h-[250px]');

// cut-outs for green bento
desktop = desktop.replace(/w-\[64px\] h-\[64px\]/g, 'w-[48px] h-[48px] lg:w-[64px] lg:h-[64px]');
desktop = desktop.replace(/right-\[64px\]/g, 'right-[48px] lg:right-[64px]');
desktop = desktop.replace(/top-\[64px\]/g, 'top-[48px] lg:top-[64px]');

// right blue cut-out (p4 doesn't have one)

// right bottom play button (p5 doesn't have cut-out, just text)
// all SVGs w-[24px] h-[24px] -> md:w-[20px] md:h-[20px] lg:w-[24px] lg:h-[24px]
desktop = desktop.replace(/w-\[24px\] h-\[24px\]/g, 'w-[20px] h-[20px] lg:w-[24px] lg:h-[24px]');

// rounded-tr-[24px] -> rounded-tr-[20px] lg:rounded-tr-[24px]
desktop = desktop.replace(/rounded-tr-\[24px\]/g, 'rounded-tr-[20px] lg:rounded-tr-[24px]');
// rounded-bl-[32px] -> rounded-bl-[24px] lg:rounded-bl-[32px]
desktop = desktop.replace(/rounded-bl-\[32px\]/g, 'rounded-bl-[24px] lg:rounded-bl-[32px]');

desktopParts[0] = desktop;
fs.writeFileSync('/Users/Shared/BizVistar/src/components/blogs/BlogBentoGrid.js', desktopParts.join('{/* MOBILE & TABLET FALLBACK */}'));
