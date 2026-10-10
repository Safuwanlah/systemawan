const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'components', 'dashboard');
const files = ['RevenueChart.tsx', 'OrdersChart.tsx', 'CategoryChart.tsx', 'StockChart.tsx', 'TrendChart.tsx'];

const replacements = {
  "'#252946'": "'var(--border)'",
  '"#252946"': '"var(--border)"',
  "'#858BA8'": "'var(--muted-foreground)'",
  '"#858BA8"': '"var(--muted-foreground)"',
  "'#11142B'": "'var(--card)'",
  '"#11142B"': '"var(--card)"',
  "'#F5F7FF'": "'var(--foreground)'",
  '"#F5F7FF"': '"var(--foreground)"',
  "'#151832'": "'var(--accent)'",
  '"#151832"': '"var(--accent)"',
  "'#3867FF'": "'var(--primary)'",
  '"#3867FF"': '"var(--primary)"',
  "animationDuration={1500}": "animationDuration={800}",
  "animationDuration={2000}": "animationDuration={800}",
  "animationDuration={1000}": "animationDuration={800}",
  "animationEasing=\"ease-out\"": "animationEasing=\"ease-out\""
};

files.forEach(file => {
  const filePath = path.join(dir, file);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    for (const [key, value] of Object.entries(replacements)) {
      content = content.split(key).join(value);
    }
    
    // Add Recharts animation prop defaults if missing, but it's simpler just to do a global regex replace for stroke/fill if needed.
    // The string split.join above covers the hex codes.
    
    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated ${file}`);
    }
  }
});
