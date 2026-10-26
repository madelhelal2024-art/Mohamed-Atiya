import { existsSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import manifest from '../src/data/grade-six-lesson-files.json';
import content from '../src/data/grade-six-lesson-content.json';
import { gradeSixLessonKey, validGradeSixFiles, type GradeSixLessonFiles } from '../src/lib/grade-six-resources';
import { hasGradeSixInlineContent, type GradeSixLessonContentManifest } from '../src/lib/grade-six-content';

const lessonKey = gradeSixLessonKey('self-development', 2);
const files = manifest as GradeSixLessonFiles;
const contentMap = content as GradeSixLessonContentManifest;

describe('ملفات درس كنز لا يقدر بثمن', () => {
  it('يحفظ تسع نقاط جوهرية وست مفردات وخمس نقاط للمراجعة', () => {
    const entry = contentMap[lessonKey]?.keyPoints;
    expect(hasGradeSixInlineContent(entry)).toBe(true);
    expect(entry?.blocks).toHaveLength(9);
    expect(entry?.examFocus).toHaveLength(5);
    const vocabulary = entry?.blocks.find((block) => block.type === 'table');
    expect(vocabulary?.type === 'table' ? vocabulary.rows : []).toHaveLength(6);
  });

  it('يسجل صورة واحدة وفيديو واحدًا وبوكليت واحدًا دون تكرار', () => {
    expect(validGradeSixFiles(files, lessonKey, 'summary')).toHaveLength(1);
    expect(validGradeSixFiles(files, lessonKey, 'video')).toHaveLength(1);
    expect(validGradeSixFiles(files, lessonKey, 'booklet')).toHaveLength(1);
    for (const key of ['activities', 'quiz', 'presentation', 'assistant', 'homework'] as const) {
      expect(validGradeSixFiles(files, lessonKey, key)).toHaveLength(0);
    }
  });

  it('يتحقق أن كل رابط محلي في البيانات يقود إلى ملف موجود وملائم', () => {
    for (const key of ['summary', 'video', 'booklet'] as const) {
      for (const resource of validGradeSixFiles(files, lessonKey, key)) {
        const links = resource.parts?.length ? resource.parts : [resource.url];
        for (const url of links) {
          expect(url.startsWith('/assets/lessons/grade-six/')).toBe(true);
          const assetPath = join(process.cwd(), 'public', url.slice(1));
          expect(existsSync(assetPath)).toBe(true);
          expect(statSync(assetPath).size).toBeGreaterThan(1000);
        }
      }
    }
    expect(files[lessonKey]?.video?.[0]?.parts).toHaveLength(8);
  });
});
