import fs from 'fs';
import path from 'path';

console.log('🔒 Scanning repository for secrets and sensitive patterns...');

const SECRET_PATTERNS = [
  new RegExp('AI' + 'za[0-9A-Za-z-_]{35}'),
  new RegExp('sk-' + '[a-zA-Z0-9]{20,}'),
  new RegExp('gh' + 'p_[a-zA-Z0-9]{36}'),
  new RegExp('-----BEGIN ' + 'PRIVATE KEY-----'),
];

const IGNORE_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.aistudio']);

function scanDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    if (IGNORE_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.isFile() && !entry.name.endsWith('.png') && !entry.name.endsWith('.jpg')) {
      if (entry.name === 'scan-secrets.mjs') continue;
      const content = fs.readFileSync(fullPath, 'utf-8');
      for (const pattern of SECRET_PATTERNS) {
        if (pattern.test(content)) {
          console.error(`❌ Secret detected in ${fullPath}`);
          process.exit(1);
        }
      }
    }
  }
}

scanDir(process.cwd());
console.log('✅ Secrets scan passed: No leaked API keys or credentials detected.');
