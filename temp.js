const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'src', 'app', 'templates');
const templateDirs = fs.readdirSync(templatesDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);

templateDirs.forEach(template => {
    const checkoutPage = path.join(templatesDir, template, 'checkout', 'page.js');
    if (fs.existsSync(checkoutPage)) {
        let content = fs.readFileSync(checkoutPage, 'utf-8');
        content = content.replace("import { QRCodeSVG } from 'qrcode.react';", "import dynamic from 'next/dynamic';\nconst QRCodeSVG = dynamic(() => import('qrcode.react').then(mod => mod.QRCodeSVG), { ssr: false });");
        fs.writeFileSync(checkoutPage, content);
        console.log(`Updated ${checkoutPage}`);
    }
});
