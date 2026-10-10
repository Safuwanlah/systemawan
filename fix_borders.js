const fs = require('fs');
const path = require('path');
function processFile(filepath) {
    const content = fs.readFileSync(filepath, 'utf-8');
    let newContent = content.replace(/divide-\[\#292D32\]/g, 'divide-border');
    newContent = newContent.replace(/border-\[\#292D32\]/g, 'border-border');
    newContent = newContent.replace(/text-\[\#292D32\]/g, 'text-muted-foreground/50');
    
    // Make text more clearly visible in light mode by removing overly light text colors
    // But it's easier to change globals.css

    if (newContent !== content) {
        fs.writeFileSync(filepath, newContent, 'utf-8');
        console.log(`Updated ${filepath}`);
    }
}
function walkDir(dir) {
    if(!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}
walkDir(path.join(process.cwd(), 'src'));
