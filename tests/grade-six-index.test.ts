import { describe, expect, it } from 'vitest';
import index from '../src/data/grade-six-term-one-index.json';

describe('فهرس الصف السادس — الفصل الدراسي الأول', () => {
  it('يحفظ الوحدات الثلاث كما وردت في صور الفهرس', () => {
    expect(index.units.map((unit) => unit.title)).toEqual([
      'أطور ذاتي',
      'أنا مسؤول',
      'العلم والخيال والمستقبل',
    ]);
    expect(index.units.map((unit) => unit.entries.length)).toEqual([18, 18, 19]);
  });

  it('يحفظ العناوين دون أرقام صفحات أو روابط أو محتوى دراسي مُختلق', () => {
    for (const unit of index.units) {
      expect(unit.id).toMatch(/^[a-z0-9-]+$/);
      for (const entry of unit.entries) {
        expect(entry).toHaveLength(2);
        const [kind, title] = entry;
        expect(String(kind).trim().length).toBeGreaterThan(0);
        expect(String(title).trim().length).toBeGreaterThan(0);
      }
    }
    expect(index.units[0].entries[0][1]).toBe('سمر تطور نفسها');
    expect(index.units[2].entries.at(-1)?.[1]).toBe('نصوص الاستماع والإملاء');
  });
});
