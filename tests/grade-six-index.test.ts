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

  it('يحفظ الصفحات والعناوين دون روابط أو محتوى دراسي مُختلق', () => {
    for (const unit of index.units) {
      expect(unit.id).toMatch(/^[a-z0-9-]+$/);
      let previousPage = 0;
      for (const [kind, title, page] of unit.entries) {
        expect(String(kind).trim().length).toBeGreaterThan(0);
        expect(String(title).trim().length).toBeGreaterThan(0);
        expect(typeof page).toBe('number');
        expect(page).toBeGreaterThanOrEqual(previousPage);
        previousPage = Number(page);
      }
    }
    expect(index.units[0].entries[0][2]).toBe(7);
    expect(index.units[2].entries.at(-1)?.[2]).toBe(145);
  });
});
