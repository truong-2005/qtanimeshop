const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function fixFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;

  // formatCurrency(something?) -> formatCurrency(something)
  content = content.replace(/formatCurrency\(([^)]+?)\?\)/g, 'formatCurrency($1)');

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed syntax in: ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(filePath);
    } else if (file.endsWith('.js')) {
      fixFile(filePath);
    }
  }
}

walkDir(path.join(srcDir, 'components'));
walkDir(path.join(srcDir, 'pages'));

console.log('Fix Done!');
