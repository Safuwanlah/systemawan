const fs = require('fs');
const path = require('path');

function processFile(filepath) {
    const content = fs.readFileSync(filepath, 'utf-8');
    let newContent = content;

    const solidBgs = ['bg-[#E53935]', 'bg-[#EF4444]', 'bg-[#22C55E]', 'bg-[#3867FF]', 'bg-primary', 'bg-indigo-600', 'bg-[#DC2626]', 'bg-indigo-500'];

    // Replace className="..."
    newContent = newContent.replace(/className="([^"]+)"/g, (match, classStr) => {
        if (solidBgs.some(bg => classStr.includes(bg))) {
            return match;
        }
        let newClassStr = classStr.replace(/\btext-white\b/g, 'text-foreground');
        newClassStr = newClassStr.replace(/\bhover:text-white\b/g, 'hover:text-foreground');
        return `className="${newClassStr}"`;
    });

    // Replace className={`...`}
    newContent = newContent.replace(/className=\{`([^`]+)`\}/g, (match, classStr) => {
        if (solidBgs.some(bg => classStr.includes(bg))) {
            return match;
        }
        let newClassStr = classStr.replace(/\btext-white\b/g, 'text-foreground');
        newClassStr = newClassStr.replace(/\bhover:text-white\b/g, 'hover:text-foreground');
        return `className={\`${newClassStr}\`}`;
    });

    if (newContent !== content) {
        fs.writeFileSync(filepath, newContent, 'utf-8');
        console.log(`Updated ${filepath}`);
    }
}

function walkDir(dir) {
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

walkDir(path.join(__dirname, 'src', 'app', '(dashboard)'));
walkDir(path.join(__dirname, 'src', 'components'));
