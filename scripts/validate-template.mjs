/** Validate customizable files and local assets without installing any dependency. */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const check = (condition, message) => { if (!condition) errors.push(message); };
const read = (name) => {
  try { return JSON.parse(fs.readFileSync(path.join(root, name), 'utf8')); }
  catch (e) { errors.push(`${name}: ${e.message}`); return {}; }
};
const data = (name) => read(`src/data/${name}.json`);
const curriculum = data('curriculum');
const units = new Map();
const lessons = new Set();
const levels = new Set();
const types = new Set(['diagnostic','explanation','reading','listening','video','activity','formative','project','review','writing']);
for (const level of curriculum.levels ?? []) {
  levels.add(level.id);
  for (const subject of level.subjects ?? []) {
    for (const unit of subject.units ?? []) {
      units.set(unit.id, { ...unit, levelId: level.id, subjectId: subject.id });
      for (const lesson of unit.lessons ?? []) lessons.add(lesson.id);
    }
  }
}
const text = (value) => typeof value === 'string' && value.trim().length > 0;
const checkText = (value, label) => check(text(value), `${label}: a non-empty string is required`);
const safeUrl = (value, contact = false) => {
  if (typeof value !== 'string') return false;
  if (/^\/assets\/(?!.*(?:\.\.|\\|%|\s))[^?#]+(?:[?#].*)?$/.test(value)) return true;
  try { const u = new URL(value); return !u.username && !u.password && (u.protocol === 'https:' || contact && ['mailto:', 'tel:'].includes(u.protocol)); }
  catch { return false; }
};
const indices = data('unit-index');
for (const [key, index] of Object.entries(indices)) {
  const unit = units.get(key);
  check(Boolean(unit), `unit-index: unknown unit ${key}`);
  if (!unit) continue;
  check(index.unitId === key && index.levelId === unit.levelId && index.subjectId === unit.subjectId, `unit-index: path mismatch ${key}`);
  for (const field of ['id','number','title','stageBadge','iconSymbol','bannerGradient']) checkText(index[field], `unit-index.${key}.${field}`);
  check(!/url\s*\(|[{};]/i.test(index.bannerGradient ?? ''), `unit-index.${key}: use a CSS gradient without URLs`);
  check(Array.isArray(index.topics), `unit-index.${key}.topics must be an array`);
  const used = new Set();
  const topicIds = new Set();
  for (const topic of index.topics ?? []) {
    checkText(topic.id, `${key}.topic.id`);
    check(!topicIds.has(topic.id), `${key}: duplicate topic ${topic.id}`);
    topicIds.add(topic.id);
    checkText(topic.title, `${key}.topic.title`);
    checkText(topic.number, `${key}.topic.number`);
    check(Array.isArray(topic.items), `${key}.${topic.id}.items must be an array`);
  }
  for (const item of [index.diagnostic, ...(index.topics ?? []).flatMap(t => t.items ?? []), index.project].filter(Boolean)) {
    check(unit.lessons.some(l => l.id === item.id), `${key}: item ${item.id} has no lesson in this unit`);
    check(!used.has(item.id), `${key}: repeated item ${item.id}`);
    used.add(item.id);
    check(types.has(item.type), `${key}.${item.id}: unsupported section type`);
    checkText(item.title, `${key}.${item.id}.title`);
    checkText(item.typeLabel, `${key}.${item.id}.typeLabel`);
    if (item.pageNumber !== undefined) check(Number.isInteger(item.pageNumber) && item.pageNumber > 0, `${key}.${item.id}: pageNumber must be positive`);
  }
}
const display = data('curriculum-display');
check(Array.isArray(display.suggestedKeywords) && display.suggestedKeywords.every(text), 'suggestedKeywords must be an array of strings');
for (const [id, url] of Object.entries(display.levelCovers ?? {})) {
  check(levels.has(id), `Unknown level cover: ${id}`);
  check(safeUrl(url), `Unsafe cover URL: ${id}`);
}
const settings = data('template-settings');
check(/^[a-z0-9][a-z0-9-]{2,63}$/.test(settings.storageNamespace ?? ''), 'storageNamespace must be 3–64 lowercase letters, digits or hyphens');
check(typeof settings.demoMode === 'boolean', 'demoMode must be boolean');
const support = data('lesson-support');
for (const [id, guide] of Object.entries(support.guides ?? {})) {
  check(lessons.has(id), `Assistant guide has unknown lesson: ${id}`);
  checkText(guide.lessonTitle, `${id}.lessonTitle`);
  checkText(guide.intro, `${id}.intro`);
  check(Array.isArray(guide.topics) && guide.topics.length > 0, `${id}.topics must not be empty`);
  const topicIds = new Set();
  for (const topic of guide.topics ?? []) {
    for (const key of ['id','title','explanation','simpleExplanation']) checkText(topic[key], `${id}.topic.${key}`);
    check(!topicIds.has(topic.id), `${id}: duplicate assistant topic ${topic.id}`); topicIds.add(topic.id);
    check(Array.isArray(topic.examples) && topic.examples.every(text), `${id}.examples must be strings`);
    checkText(topic.commonMistake?.wrong, `${id}.commonMistake.wrong`);
    checkText(topic.commonMistake?.correction, `${id}.commonMistake.correction`);
  }
  const q = guide.quickQuestion ?? {};
  for (const key of ['question','correctFeedback','incorrectFeedback']) checkText(q[key], `${id}.quickQuestion.${key}`);
  check(Array.isArray(q.options) && q.options.length >= 2 && q.options.every(text), `${id}.quickQuestion.options must contain two or more strings`);
  check(Number.isInteger(q.correctIndex) && q.correctIndex >= 0 && q.correctIndex < (q.options?.length ?? 0), `${id}.quickQuestion.correctIndex out of range`);
}
for (const [id, item] of Object.entries(support.homeworkAssessments ?? {})) {
  check(lessons.has(id), `Homework has unknown lesson: ${id}`);
  for (const key of ['id','title','instructions']) checkText(item[key], `${id}.homework.${key}`);
  check(Array.isArray(item.resources), `${id}.homework.resources must be an array`);
}
const programs = data('student-programs');
for (const key of ['pageTitle','pageDescription']) checkText(programs[key], `student-programs.${key}`);
const course = programs.program ?? {};
for (const key of ['title','badge','priceLabel','priceNote','enrollmentTitle']) checkText(course[key], `program.${key}`);
for (const key of ['description','benefits','enrollmentSteps']) check(Array.isArray(course[key]) && course[key].every(text), `program.${key} must be a string array`);
check(Array.isArray(course.lectures), 'program.lectures must be an array');
for (const [i, lecture] of (course.lectures ?? []).entries()) {
  checkText(lecture.title, `lecture ${i}: title`);
  checkText(lecture.description, `lecture ${i}: description`);
  check(typeof lecture.free === 'boolean', `lecture ${i}: free must be boolean`);
}
function visit(value, label = '') {
  if (typeof value === 'string') {
    if (/^\/assets\//.test(value)) {
      const filename = value.split(/[?#]/)[0];
      check(safeUrl(value), `Unsafe asset path: ${label}`);
      check(fs.existsSync(path.join(root, 'public', filename)), `Missing asset ${value} (${label})`);
    }
    if (/\.?(?:url|enrollmentUrl)$/i.test(label) && value !== '') check(safeUrl(value, /enrollment|contact/i.test(label)), `Unsafe resource/contact URL: ${label}`);
  } else if (Array.isArray(value)) value.forEach((v,i) => visit(v, `${label}[${i}]`));
  else if (value && typeof value === 'object') Object.entries(value).forEach(([k,v]) => visit(v, `${label}.${k}`));
}
function walk(dir) { return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e => e.isDirectory() ? walk(path.join(dir,e.name)) : [path.join(dir,e.name)]); }
for (const file of walk(path.join(root, 'src/data')).filter(f => f.endsWith('.json'))) visit(read(path.relative(root,file)), path.relative(root,file));
for (const file of walk(path.join(root,'src')).filter(f => /\.[jt]sx?$/.test(f))) {
  const source=fs.readFileSync(file,'utf8');
  for (const match of source.matchAll(/["'](\/assets\/[^"']+)["']/g)) visit(match[1],path.relative(root,file));
}
if (errors.length) { console.error(`Template validation failed (${errors.length}):\n`+errors.map(e=>`- ${e}`).join('\n')); process.exit(1); }
console.log(`Template configuration validated: ${levels.size} levels, ${units.size} units, ${lessons.size} lessons, ${Object.keys(indices).length} unit indices.`);
