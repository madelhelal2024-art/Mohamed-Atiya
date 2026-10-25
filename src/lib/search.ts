import { Curriculum, LessonRef, Unit } from '../types/content';

export interface SearchResultItem {
  id: string;
  title: string;
  type: 'lesson' | 'unit' | 'level';
  unitId?: string;
  levelTitle?: string;
  url: string;
}

export function normalizeArabicText(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا')
    .replace(/ة/g, 'ه')
    .replace(/ى/g, 'ي')
    .replace(/[\u064B-\u065F]/g, ''); // Remove Arabic tashkeel/diacritics
}

export function searchCurriculum(
  curriculum: Curriculum,
  rawQuery: string
): SearchResultItem[] {
  const query = normalizeArabicText(rawQuery);
  if (!query) return [];

  const results: SearchResultItem[] = [];

  for (const level of curriculum.levels) {
    const levelNormalized = normalizeArabicText(level.title);
    if (levelNormalized.includes(query)) {
      results.push({
        id: level.id,
        title: level.title,
        type: 'level',
        url: `/curriculum`,
      });
    }

    for (const domain of level.domains) {
      for (const unit of domain.units) {
        const unitNormalized = normalizeArabicText(unit.title);
        if (unitNormalized.includes(query)) {
          results.push({
            id: unit.id,
            title: unit.title,
            type: 'unit',
            unitId: unit.id,
            levelTitle: level.title,
            url: `/unit/${unit.id}`,
          });
        }

        for (const lesson of unit.lessons) {
          const lessonNormalized = normalizeArabicText(lesson.title);
          if (lessonNormalized.includes(query)) {
            results.push({
              id: lesson.id,
              title: lesson.title,
              type: 'lesson',
              unitId: unit.id,
              levelTitle: level.title,
              url: `/lesson/${lesson.id}`,
            });
          }
        }
      }
    }
  }

  return results;
}
