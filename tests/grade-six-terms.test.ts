import { describe, expect, it } from 'vitest';
import terms from '../src/data/grade-six-terms.json';
import index from '../src/data/grade-six-term-one-index.json';
import manifest from '../src/data/grade-six-lesson-files.json';
import { SECTION_KEYS, SECTION_NAMES } from '../src/lib/ui-copy';
import { gradeSixLessonKey, isSafeGradeSixFileUrl, validGradeSixFiles, type GradeSixLessonFiles } from '../src/lib/grade-six-resources';

describe('مسارات الصف السادس وأقسام الدرس', () => {
  it('يضم فصلين فقط مع حالة المحتوى الفعلية لكل منهما', () => {
    expect(terms.grade).toBe('الصف السادس الابتدائي');
    expect(terms.terms.map((term) => term.path)).toEqual(['/grade-six/term-one', '/grade-six/term-two']);
    expect(terms.terms.map((term) => term.status)).toEqual(['index-ready', 'awaiting-content']);
  });

  it('يعطي لكل واحد من بنود الفهرس عنوانًا قابلًا للربط بمجلد خاص', () => {
    const keys = index.units.flatMap((unit) => unit.entries.map((_, position) => gradeSixLessonKey(unit.id, position + 1)));
    expect(keys).toHaveLength(55);
    expect(new Set(keys).size).toBe(55);
    expect(keys[0]).toBe('self-development/01');
  });

  it('يحتفظ بالأقسام التسعة التي طلبها المعلم بالترتيب نفسه', () => {
    expect(SECTION_KEYS.map((key) => SECTION_NAMES[key])).toEqual([
      'أهم النقاط', 'التلخيص والخرائط', 'شرح الفيديو', 'الأنشطة التطبيقية',
      'التقويم الذاتي', 'البوكليت والمذكرة', 'العرض التقديمي',
      'اسألني وأنا هشرح لك', 'الواجبات والاختبارات',
    ]);
    expect(validGradeSixFiles(manifest as GradeSixLessonFiles, 'self-development/01', 'keyPoints')).toEqual([]);
  });

  it('يرفض المسارات غير الآمنة ولا يسمح إلا بروابط HTTPS أو ملفات الدروس المحلية', () => {
    expect(isSafeGradeSixFileUrl('/assets/lessons/grade-six/term-one/self-development/01/keyPoints/main.pdf')).toBe(true);
    expect(isSafeGradeSixFileUrl('https://youtu.be/example')).toBe(true);
    expect(isSafeGradeSixFileUrl('javascript:alert(1)')).toBe(false);
    expect(isSafeGradeSixFileUrl('/assets/lessons/grade-six/../private.pdf')).toBe(false);
    expect(isSafeGradeSixFileUrl('http://example.com/test.pdf')).toBe(false);
  });
});
