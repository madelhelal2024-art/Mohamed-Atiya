import type { SectionKey } from './ui-copy';

export type GradeSixContentBlock =
  | { type: 'paragraph'; title: string; text: string }
  | { type: 'list' | 'ordered-list'; title: string; items: string[] }
  | { type: 'table'; title: string; columns: string[]; rows: string[][] };

export interface GradeSixSectionContent {
  heading: string;
  subtitle?: string;
  blocks: GradeSixContentBlock[];
  examFocus?: string[];
}

export type GradeSixLessonContentManifest = Record<string, Partial<Record<SectionKey, GradeSixSectionContent>>>;

export function hasGradeSixInlineContent(value?: GradeSixSectionContent): boolean {
  return Boolean(value && Array.isArray(value.blocks) && value.blocks.length > 0);
}
