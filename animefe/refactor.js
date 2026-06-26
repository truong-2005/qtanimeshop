const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function getRelativeUtilsPath(filePath) {
  const depth = filePath.split(path.sep).length - srcDir.split(path.sep).length;
  if (depth === 1) return './utils';
  return '../'.repeat(depth - 1) + 'utils';
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let originalContent = content;
  
  let needsCurrency = false;
  let needsDate = false;

  // Replace format currency like `xxx.toLocaleString('vi-VN') + ' đ'` or `xxx.toLocaleString('vi-VN') đ`
  // e.g. {product.price?.toLocaleString('vi-VN')} đ -> {formatCurrency(product.price)}
  // e.g. {item.price.toLocaleString('vi-VN') + ' đ'} -> {formatCurrency(item.price)}
  
  // 1. Pattern: {xxx?.toLocaleString('vi-VN')} đ
  const regexCurr1 = /\{([^}]+?)\.?toLocaleString\('vi-VN'\)\}\s*đ/g;
  if (regexCurr1.test(content)) {
    content = content.replace(regexCurr1, '{formatCurrency($1)}');
    needsCurrency = true;
  }
  
  // 2. Pattern: xxx.toLocaleString('vi-VN') + ' đ'
  const regexCurr2 = /([^={}\s]+?)\.?toLocaleString\('vi-VN'\)\s*\+\s*' đ'/g;
  if (regexCurr2.test(content)) {
    content = content.replace(regexCurr2, 'formatCurrency($1)');
    needsCurrency = true;
  }
  
  // 3. Pattern: {xxx.toLocaleString()}đ
  const regexCurr3 = /\{([^}]+?)\.toLocaleString\(\)\}\s*đ/g;
  if (regexCurr3.test(content)) {
    content = content.replace(regexCurr3, '{formatCurrency($1)}');
    needsCurrency = true;
  }

  // Replace Date: new Date(xxx).toLocaleString('vi-VN') -> formatDate(xxx)
  const regexDate1 = /new\s+Date\(([^)]+)\)\.toLocaleString\('vi-VN'\)/g;
  if (regexDate1.test(content)) {
    content = content.replace(regexDate1, 'formatDate($1)');
    needsDate = true;
  }
  
  const regexDate2 = /new\s+Date\(([^)]+)\)\.toLocaleDateString\('vi-VN'\)/g;
  if (regexDate2.test(content)) {
    content = content.replace(regexDate2, 'formatDate($1, { hour: undefined, minute: undefined })');
    needsDate = true;
  }

  if ((needsCurrency || needsDate) && content !== originalContent) {
    const utilsPath = getRelativeUtilsPath(filePath).replace(/\\/g, '/');
    const imports = [];
    if (needsCurrency) imports.push('formatCurrency');
    if (needsDate) imports.push('formatDate');
    
    // Check if imported already
    if (!content.includes('from \'' + utilsPath + '\'') && !content.includes('from "' + utilsPath + '"')) {
      // Find last import
      const lines = content.split('\n');
      let lastImportIndex = -1;
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].startsWith('import ')) {
          lastImportIndex = i;
        }
      }
      
      const importStatement = `import { ${imports.join(', ')} } from '${utilsPath}';`;
      if (lastImportIndex !== -1) {
        lines.splice(lastImportIndex + 1, 0, importStatement);
      } else {
        lines.unshift(importStatement);
      }
      content = lines.join('\n');
    } else {
      // Update existing import if needed - tricky to do reliably with simple script,
      // but assuming they aren't imported yet since we just created utils.
    }
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
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
      processFile(filePath);
    }
  }
}

walkDir(path.join(srcDir, 'components'));
walkDir(path.join(srcDir, 'pages'));

console.log('Done!');
