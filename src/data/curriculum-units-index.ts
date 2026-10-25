import type { IconName } from '../components/Icon';
import type { LessonReference } from '../types/content';
import indexData from './unit-index.json';
/** General teaching categories. Add domain-specific names in data, not in page components. */
export type CurriculumSectionType = 'diagnostic' | 'explanation' | 'reading' | 'listening' | 'video' | 'activity' | 'formative' | 'project' | 'review' | 'writing';
export interface CurriculumIndexItem {
    id: string;
    title: string;
    type: CurriculumSectionType;
    typeLabel: string;
    pageNumber?: number;
    description?: string;
}
export interface CurriculumTopic {
    id: string;
    number: string;
    title: string;
    items: CurriculumIndexItem[];
}
export interface CurriculumUnitTheme {
    id: string;
    unitId: string;
    levelId: string;
    subjectId: string;
    stageBadge: string;
    number: string;
    title: string;
    bannerGradient: string;
    iconSymbol: string;
    diagnostic?: CurriculumIndexItem;
    topics: CurriculumTopic[];
    project?: CurriculumIndexItem;
}
export const sectionTypeIcons: Record<CurriculumSectionType, IconName> = { diagnostic: 'clipboard', explanation: 'book', reading: 'book', listening: 'volume-high', video: 'video', activity: 'game', formative: 'brain', project: 'flag', review: 'clipboard', writing: 'edit' };
export const sectionTypeColors: Record<CurriculumSectionType, {
    bg: string;
    text: string;
    border: string;
}> = {
    diagnostic: { bg: '#fff7ed', text: '#c2410c', border: '#fdba74' }, explanation: { bg: '#ecfeff', text: '#0e7490', border: '#a5f3fc' },
    reading: { bg: '#f0fdf4', text: '#15803d', border: '#86efac' }, listening: { bg: '#eff6ff', text: '#1d4ed8', border: '#93c5fd' },
    video: { bg: '#f5f3ff', text: '#6d28d9', border: '#c4b5fd' }, activity: { bg: '#fefce8', text: '#a16207', border: '#fde047' },
    formative: { bg: '#fff1f2', text: '#be123c', border: '#fecdd3' }, project: { bg: '#f0fdfa', text: '#0f766e', border: '#99f6e4' },
    review: { bg: '#fff1f2', text: '#e11d48', border: '#fecdd3' }, writing: { bg: '#f8fafc', text: '#334155', border: '#cbd5e1' },
};
export const allCurriculumUnitThemes: Record<string, CurriculumUnitTheme> = indexData as Record<string, CurriculumUnitTheme>;
/** New units work immediately even before an optional custom topic index is added. */
export function getUnitTheme(unitId: string, levelTitle: string, subjectTitle: string, unitTitle: string, lessons: LessonReference[]): CurriculumUnitTheme {
    const configured = allCurriculumUnitThemes[unitId];
    const validIds = new Set(lessons.map((lesson) => lesson.id));
    if (configured) {
        const used = new Set<string>();
        const retain = (item: CurriculumIndexItem) => {
            if (!validIds.has(item.id) || used.has(item.id))
                return false;
            used.add(item.id);
            return true;
        };
        const diagnostic = configured.diagnostic && retain(configured.diagnostic) ? configured.diagnostic : undefined;
        const topics = configured.topics.map((topic) => ({ ...topic, items: topic.items.filter(retain) })).filter((topic) => topic.items.length);
        const project = configured.project && retain(configured.project) ? configured.project : undefined;
        const missing = lessons.filter((lesson) => !used.has(lesson.id));
        if (missing.length)
            topics.push({ id: `${unitId}-additional`, number: 'دروس إضافية', title: 'بقية دروس الوحدة', items: missing.map((lesson) => ({ ...lesson, type: 'explanation', typeLabel: 'درس' })) });
        return { ...configured, diagnostic, topics, project };
    }
    return { id: unitId, unitId, levelId: '', subjectId: '', stageBadge: `${levelTitle} · ${subjectTitle}`, number: 'الوحدة', title: unitTitle, bannerGradient: 'linear-gradient(135deg, #0369a1 0%, #0284c7 45%, #0ea5e9 100%)', iconSymbol: '📚', topics: [{ id: `${unitId}-topic`, number: 'الدروس', title: unitTitle, items: lessons.map((lesson) => ({ ...lesson, type: 'explanation', typeLabel: 'درس' })) }] };
}
