import fs from 'fs';
import path from 'path';

console.log('🔍 Validating template structure and assets...');

const root = process.cwd();

// 1. Check curriculum counts
const curriculum = JSON.parse(fs.readFileSync(path.join(root, 'src/data/curriculum.json'), 'utf-8'));
if (!curriculum.levels || curriculum.levels.length !== 4) {
  console.error(`❌ Expected 4 levels, found ${curriculum.levels?.length}`);
  process.exit(1);
}

let unitCount = 0;
let lessonCount = 0;
for (const level of curriculum.levels) {
  for (const domain of level.domains || []) {
    for (const unit of domain.units || []) {
      unitCount++;
      lessonCount += (unit.lessons || []).length;
    }
  }
}

if (unitCount !== 8) {
  console.error(`❌ Expected 8 units, found ${unitCount}`);
  process.exit(1);
}

if (lessonCount !== 24) {
  console.error(`❌ Expected 24 lessons, found ${lessonCount}`);
  process.exit(1);
}

// 2. Check unit index entries
const unitIndex = JSON.parse(fs.readFileSync(path.join(root, 'src/data/unit-index.json'), 'utf-8'));
if (!unitIndex.units || unitIndex.units.length !== 8) {
  console.error(`❌ Expected 8 unit-index entries, found ${unitIndex.units?.length}`);
  process.exit(1);
}

// 3. Check SVGs
const requiredSvgs = [
  'public/assets/brand/logo-placeholder.svg',
  'public/assets/brand/teacher-placeholder.svg',
  'public/assets/covers/level-01.svg',
  'public/assets/covers/level-02.svg',
  'public/assets/covers/level-03.svg',
  'public/assets/covers/level-04.svg',
  'public/assets/learning-profile-hero.svg',
];

for (const svgPath of requiredSvgs) {
  const fullPath = path.join(root, svgPath);
  if (!fs.existsSync(fullPath)) {
    console.error(`❌ Missing required SVG: ${svgPath}`);
    process.exit(1);
  }
  const content = fs.readFileSync(fullPath, 'utf-8');
  if (!content.includes('<svg') || !content.includes('</svg>')) {
    console.error(`❌ Invalid SVG XML format in: ${svgPath}`);
    process.exit(1);
  }
}

console.log('✅ Template structure: 4 levels, 8 units, 24 lessons, and all 7 SVGs validated successfully!');
