import { useSyncExternalStore } from 'react';
import { storageKey } from './storage';
const STORAGE_KEY = storageKey('finished-lessons');
const TIMESTAMPS_KEY = storageKey('lesson-completion-timestamps');
const CHANGE_EVENT = storageKey('lesson-progress-change');
let memoryFallback: string[] = [];
let timestampsMemoryFallback: Record<string, string> = {};
function localDate(date = new Date()): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
export function getLessonCompletionTimestamps(): Record<string, string> {
    if (typeof window === 'undefined')
        return timestampsMemoryFallback;
    try {
        const raw = window.localStorage.getItem(TIMESTAMPS_KEY);
        if (!raw)
            return timestampsMemoryFallback;
        const parsed: unknown = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed))
            return timestampsMemoryFallback;
        return Object.fromEntries(Object.entries(parsed).filter(([, value]) => typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)));
    }
    catch {
        return timestampsMemoryFallback;
    }
}
export function saveLessonCompletionTimestamp(lessonId: string, isoDate?: string): void {
    const dateStr = isoDate || localDate();
    timestampsMemoryFallback[lessonId] = dateStr;
    if (typeof window === 'undefined')
        return;
    try {
        const current = getLessonCompletionTimestamps();
        current[lessonId] = dateStr;
        window.localStorage.setItem(TIMESTAMPS_KEY, JSON.stringify(current));
    }
    catch { /* Storage can be disabled or full. */ }
}
export function removeLessonCompletionTimestamp(lessonId: string): void {
    delete timestampsMemoryFallback[lessonId];
    if (typeof window === 'undefined')
        return;
    try {
        const current = getLessonCompletionTimestamps();
        delete current[lessonId];
        window.localStorage.setItem(TIMESTAMPS_KEY, JSON.stringify(current));
    }
    catch { /* Keep in-memory progress usable. */ }
}
export function getCompletedLessonIds(): string[] {
    if (typeof window === 'undefined')
        return memoryFallback;
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw)
            return memoryFallback;
        const parsed: unknown = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
    }
    catch {
        return memoryFallback;
    }
}
function saveCompletedLessonIds(ids: string[]): void {
    const unique = Array.from(new Set(ids));
    memoryFallback = unique;
    if (typeof window === 'undefined')
        return;
    try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(unique));
    }
    catch { /* in-memory fallback */ }
    try {
        window.dispatchEvent(new CustomEvent(CHANGE_EVENT, { detail: unique }));
    }
    catch { /* non-browser environment */ }
}
export function isLessonFinished(lessonId: string): boolean { return getCompletedLessonIds().includes(lessonId); }
export function setLessonFinished(lessonId: string, finished: boolean): void {
    const current = getCompletedLessonIds();
    const exists = current.includes(lessonId);
    if (finished && !exists) {
        saveLessonCompletionTimestamp(lessonId);
        saveCompletedLessonIds([...current, lessonId]);
    }
    else if (!finished && exists) {
        removeLessonCompletionTimestamp(lessonId);
        saveCompletedLessonIds(current.filter((id) => id !== lessonId));
    }
}
export function toggleLessonFinished(lessonId: string): boolean {
    const nextState = !isLessonFinished(lessonId);
    setLessonFinished(lessonId, nextState);
    return nextState;
}
export interface UnitProgress {
    completed: number;
    total: number;
    percentage: number;
    isFullyCompleted: boolean;
}
export interface DailyProgressPoint {
    date: string;
    dayLabel: string;
    shortDate: string;
    completedDaily: number;
    cumulativeCompleted: number;
}
const arabicDays = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
export function getThemeLast7DaysProgress(themeLessonIds: string[], completedIds: string[] = getCompletedLessonIds()): DailyProgressPoint[] {
    const completedSet = new Set(completedIds);
    const finishedThemeLessons = [...new Set(themeLessonIds)].filter((id) => completedSet.has(id));
    const timestamps = getLessonCompletionTimestamps();
    const today = new Date();
    const points: DailyProgressPoint[] = [];
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = localDate(d);
        points.push({
            date: dateStr, dayLabel: i === 0 ? 'اليوم' : arabicDays[d.getDay()], shortDate: `${d.getDate()}/${d.getMonth() + 1}`,
            completedDaily: finishedThemeLessons.filter((id) => timestamps[id] ? timestamps[id] === dateStr : i === 0).length,
            cumulativeCompleted: finishedThemeLessons.filter((id) => timestamps[id] ? timestamps[id] <= dateStr : i === 0).length,
        });
    }
    return points;
}
export type StudentCohort = 'all' | 'top' | 'support';
/** The 'top' and 'support' options are explicitly labelled simulations in the UI, NOT student records. */
export function getCohortLast7DaysProgress(themeLessonIds: string[], cohort: StudentCohort = 'all', completedIds?: string[]): DailyProgressPoint[] {
    if (cohort === 'all')
        return getThemeLast7DaysProgress(themeLessonIds, completedIds);
    const total = new Set(themeLessonIds).size;
    const today = new Date();
    const points: DailyProgressPoint[] = [];
    const targetCompleted = total === 0 ? 0 : cohort === 'top' ? Math.min(total, Math.max(2, Math.round(total * 0.88))) : Math.min(total, Math.max(1, Math.round(total * 0.22)));
    const fractions = cohort === 'top' ? [0.35, 0.45, 0.58, 0.70, 0.80, 0.90, 1.0] : [0.15, 0.15, 0.35, 0.45, 0.65, 0.75, 1.0];
    let prevCumulative = 0;
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const cumulative = Math.min(targetCompleted, Math.max(1, Math.round(targetCompleted * fractions[6 - i])));
        const daily = Math.max(0, cumulative - prevCumulative);
        prevCumulative = cumulative;
        points.push({ date: localDate(d), dayLabel: i === 0 ? 'اليوم' : arabicDays[d.getDay()], shortDate: `${d.getDate()}/${d.getMonth() + 1}`, completedDaily: daily, cumulativeCompleted: cumulative });
    }
    return points;
}
export function calculateUnitProgress(lessonIds: string[], completedIds: string[] | Set<string> = getCompletedLessonIds()): UnitProgress {
    const uniqueIds = [...new Set(lessonIds)];
    const total = uniqueIds.length;
    if (!total)
        return { completed: 0, total: 0, percentage: 0, isFullyCompleted: false };
    const completedSet = completedIds instanceof Set ? completedIds : new Set(completedIds);
    const completed = uniqueIds.filter((id) => completedSet.has(id)).length;
    return { completed, total, percentage: Math.round(completed / total * 100), isFullyCompleted: completed === total };
}
let cachedIds = getCompletedLessonIds();
let cachedIdsString = JSON.stringify(cachedIds);
function subscribe(callback: () => void) {
    if (typeof window === 'undefined')
        return () => { };
    const handleUpdate = () => {
        const next = getCompletedLessonIds();
        const nextString = JSON.stringify(next);
        if (nextString !== cachedIdsString) {
            cachedIds = next;
            cachedIdsString = nextString;
        }
        callback();
    };
    window.addEventListener(CHANGE_EVENT, handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => { window.removeEventListener(CHANGE_EVENT, handleUpdate); window.removeEventListener('storage', handleUpdate); };
}
function getSnapshot(): string[] {
    const next = getCompletedLessonIds();
    const nextString = JSON.stringify(next);
    if (nextString !== cachedIdsString) {
        cachedIds = next;
        cachedIdsString = nextString;
    }
    return cachedIds;
}
export function useLessonProgress() {
    const completedLessonIds = useSyncExternalStore(subscribe, getSnapshot, () => memoryFallback);
    const completedSet = new Set<string>(completedLessonIds);
    return {
        completedLessonIds,
        isLessonFinished: (lessonId: string) => completedSet.has(lessonId),
        toggleLessonFinished: (lessonId: string) => toggleLessonFinished(lessonId),
        setLessonFinished: (lessonId: string, finished: boolean) => setLessonFinished(lessonId, finished),
        getUnitProgress: (lessonIds: string[]) => calculateUnitProgress(lessonIds, completedSet),
    };
}
