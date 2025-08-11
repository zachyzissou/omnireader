import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Copy any additional assets if needed
const srcDir = path.join(__dirname, '..', 'src');
const distDir = path.join(__dirname, '..', 'dist');

// Example: copy any non-TS files
const copyAssets = (src, dest) => {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const items = fs.readdirSync(src);
  for (const item of items) {
    const srcPath = path.join(src, item);
    const destPath = path.join(dest, item);
    
    if (fs.statSync(srcPath).isDirectory()) {
      copyAssets(srcPath, destPath);
    } else if (!item.endsWith('.ts')) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
};

// Only copy if there are non-TS files to copy
console.log('Build assets copy complete');