import { existsSync, readFileSync, statSync } from 'node:fs';
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

  it('يسجل صورة وفيديو وبوكليتًا وعرض PowerPoint حقيقيًا دون تكرار', () => {
    expect(validGradeSixFiles(files, lessonKey, 'summary')).toHaveLength(1);
    expect(validGradeSixFiles(files, lessonKey, 'video')).toHaveLength(1);
    expect(validGradeSixFiles(files, lessonKey, 'booklet')).toHaveLength(1);
    expect(validGradeSixFiles(files, lessonKey, 'presentation')).toHaveLength(1);
    for (const key of ['activities', 'quiz', 'assistant', 'homework'] as const) {
      expect(validGradeSixFiles(files, lessonKey, key)).toHaveLength(0);
    }
  });

  it('يتحقق أن كل رابط محلي في البيانات يقود إلى ملف موجود وملائم', () => {
    for (const key of ['summary', 'video', 'booklet', 'presentation'] as const) {
      for (const resource of validGradeSixFiles(files, lessonKey, key)) {
        const links = [...(resource.parts?.length ? resource.parts : [resource.url]), ...(resource.pages ?? [])];
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

  it('يعرض ١٩ صفحة بصيغة PNG حقيقية داخل الدرس', () => {
    const pages = files[lessonKey]?.booklet?.[0]?.pages;
    expect(pages).toHaveLength(19);
    for (const url of pages ?? []) {
      const source = readFileSync(join(process.cwd(), 'public', url.slice(1)));
      expect(source.subarray(0, 8).toString('hex')).toBe('89504e470d0a1a0a');
      expect(source.readUInt32BE(16)).toBeGreaterThan(1000);
      expect(source.readUInt32BE(20)).toBeGreaterThan(1300);
    }
  });

  it('يتحقق أن ملف العرض المرفق PowerPoint سليم الترويسة وكبير بما يناسب الشرائح', () => {
    const presentationUrl = files[lessonKey]?.presentation?.[0]?.url;
    expect(presentationUrl).toBeTruthy();
    const source = readFileSync(join(process.cwd(), 'public', presentationUrl!.slice(1)));
    expect(source.subarray(0, 4).toString('hex')).toBe('504b0304');
    expect(source.length).toBeGreaterThan(100_000);
  });
});
