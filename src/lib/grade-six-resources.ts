import { SECTION_KEYS, type SectionKey } from './ui-copy';

export interface GradeSixFile {
  title: string;
  url: string;
  description?: string;
  kind?: 'image' | 'video' | 'pdf' | 'file';
  parts?: string[];
}

export type GradeSixLessonFiles = Record<string, Partial<Record<SectionKey, GradeSixFile[]>>>;

export function gradeSixLessonKey(unitId: string, entryNumber: number): string {
  return `${unitId}/${String(entryNumber).padStart(2, '0')}`;
}

export function isSafeGradeSixFileUrl(value: string): boolean {
  if (value.startsWith('/assets/lessons/grade-six/')) {
    return !value.includes('..') && !/[?#]/.test(value) && !/[\\\u0000-\u001F]/.test(value);
  }
  try {
    const url = new URL(value);
    return url.protocol === 'https:' && Boolean(url.hostname) && !url.username && !url.password;
  } catch {
    return false;
  }
}

export function validGradeSixFiles(
  manifest: GradeSixLessonFiles,
  lessonKey: string,
  section: SectionKey,
): GradeSixFile[] {
  if (!SECTION_KEYS.includes(section)) return [];
  const entries = manifest[lessonKey]?.[section];
  if (!Array.isArray(entries)) return [];
  return entries.filter((entry) =>
    Boolean(
      entry &&
      typeof entry.title === 'string' && entry.title.trim() &&
      typeof entry.url === 'string' && isSafeGradeSixFileUrl(entry.url) &&
      (!entry.parts || (Array.isArray(entry.parts) && entry.parts.length > 0 && entry.parts.every(isSafeGradeSixFileUrl)))
    ));
}
