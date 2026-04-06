const fs = require('fs');
const path = require('path');

const filePaths = [
    'src/components/dashboard/products/Sparkline.js',
    'src/components/dashboard/products/ProductDrawer.js',
    'src/components/dashboard/analytics/VisitorsChart.js',
    'src/components/dashboard/analytics/RevenueChart.js',
    'src/components/dashboard/analytics/ActiveUsersStateChart.js',
    'src/components/dashboard/analytics/TopCategoriesChart.js',
    'src/components/dashboard/analytics/MonthlyTargetCard.js',
    'src/components/dashboard/UserGrowthChart.js'
];

filePaths.forEach(filePath => {
    const fullPath = path.join(__dirname, filePath);
    if (fs.existsSync(fullPath)) {
        let content = fs.readFileSync(fullPath, 'utf-8');
        // Replace recharts imports with dynamic import
        const rechartsImportMatch = content.match(/import\s+{([^}]+)}\s+from\s+['"]recharts['"];/);

        if (rechartsImportMatch) {
            const importsStr = rechartsImportMatch[1];
            const imports = importsStr.split(',').map(i => i.trim());

            let dynamicImports = "import dynamic from 'next/dynamic';\n";
            imports.forEach(imp => {
               dynamicImports += `const ${imp} = dynamic(() => import('recharts').then(mod => mod.${imp}), { ssr: false });\n`;
            });

            content = content.replace(rechartsImportMatch[0], dynamicImports);
            fs.writeFileSync(fullPath, content);
            console.log(`Updated ${filePath}`);
        }
    }
});
