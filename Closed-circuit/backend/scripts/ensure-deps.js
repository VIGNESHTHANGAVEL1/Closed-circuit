import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const backendRoot = path.join(__dirname, '..');
const requiredPackages = ['node-cron', 'nodemailer'];

const missing = requiredPackages.filter((name) => {
  const pkgPath = path.join(backendRoot, 'node_modules', name, 'package.json');
  return !fs.existsSync(pkgPath);
});

if (missing.length > 0) {
  console.error('❌ Missing npm packages:', missing.join(', '));
  console.error('   Run this in the backend folder, then start again:');
  console.error('   npm install');
  process.exit(1);
}
