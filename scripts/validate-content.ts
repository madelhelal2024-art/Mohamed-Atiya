import fs from 'fs';
import path from 'path';
import { validateCurriculum, validateLesson, validateSettings, validateTeacher } from '../src/content/schema.js';

console.log('🔍 Validating content files...');

const root = process.cwd();
const teacher = JSON.parse(fs.readFileSync(path.join(root, 'src/data/teacher.json'), 'utf-8'));
const settings = JSON.parse(fs.readFileSync(path.join(root, 'src/data/template-settings.json'), 'utf-8'));
const curriculum = JSON.parse(fs.readFileSync(path.join(root, 'src/data/curriculum.json'), 'utf-8'));

const teacherCheck = validateTeacher(teacher);
if (!teacherCheck.valid) {
  console.error('❌ Teacher validation failed:', teacherCheck.errors);
  process.exit(1);
}

const settingsCheck = validateSettings(settings);
if (!settingsCheck.valid) {
  console.error('❌ Settings validation failed:', settingsCheck.errors);
  process.exit(1);
}

const curriculumCheck = validateCurriculum(curriculum);
if (!curriculumCheck.valid) {
  console.error('❌ Curriculum validation failed:', curriculumCheck.errors);
  process.exit(1);
}

const lessonsDir = path.join(root, 'src/data/lessons');
const files = fs.readdirSync(lessonsDir).filter((f) => f.endsWith('.json'));

if (files.length !== 24) {
  console.error(`❌ Expected 24 lesson JSON files, found ${files.length}`);
  process.exit(1);
}

for (const file of files) {
  const content = JSON.parse(fs.readFileSync(path.join(lessonsDir, file), 'utf-8'));
  const check = validateLesson(content);
  if (!check.valid) {
    console.error(`❌ Lesson ${file} validation failed:`, check.errors);
    process.exit(1);
  }
}

console.log('✅ All 24 lessons, curriculum, teacher profile, and settings passed validation!');
