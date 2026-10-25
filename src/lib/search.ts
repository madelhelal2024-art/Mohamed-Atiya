import type { CurriculumLevel, CurriculumSubject, CurriculumUnit } from '../types/content';
/** Arabic-aware search; stored labels are never modified. */
export function normalizeArabic(text: string): string {
    return (text ?? '').toLowerCase().replace(/[\u064B-\u065F\u0670]/g, '').replace(/\u0640/g, '').replace(/[أإآٱ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/\s+/g, ' ').trim();
}
export function unitMatchesQuery(unit: CurriculumUnit, query: string, contextKeywords: string[] = []): boolean {
    const tokens = normalizeArabic(query).split(/\s+/).filter(Boolean);
    const fields = [unit.title, unit.description ?? '', ...unit.lessons.map((lesson) => lesson.title), ...contextKeywords].map(normalizeArabic);
    // Keep multiword matches within one field; do not combine a level name with a number from an unrelated lesson.
    return fields.some((field) => tokens.every((token) => field.includes(token)));
}
export interface CurriculumSearchResult {
    filteredLevels: CurriculumLevel[];
    matchedUnitsCount: number;
    totalUnitsCount: number;
    isSearching: boolean;
}
export function filterCurriculum(levels: CurriculumLevel[], query: string): CurriculumSearchResult {
    const trimmed = query.trim(), isSearching = trimmed.length > 0;
    let totalUnitsCount = 0, matchedUnitsCount = 0;
    const filteredLevels: CurriculumLevel[] = [];
    for (const level of levels) {
        const subjects: CurriculumSubject[] = [];
        for (const subject of level.subjects) {
            totalUnitsCount += subject.units.length;
            const units = isSearching ? subject.units.filter((unit) => unitMatchesQuery(unit, trimmed, [level.title, level.stage ?? '', subject.title])) : subject.units;
            if (!isSearching || units.length) {
                matchedUnitsCount += units.length;
                subjects.push({ ...subject, units });
            }
        }
        if (subjects.length || !isSearching)
            filteredLevels.push({ ...level, subjects });
    }
    return { filteredLevels, matchedUnitsCount, totalUnitsCount, isSearching };
}
