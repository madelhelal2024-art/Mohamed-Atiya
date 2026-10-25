import { describe, expect, it } from 'vitest';
import { validateCurriculum, validateLesson, validateSettings, validateTeacher } from '../src/content/schema';

describe('Schema Validators', () => {
  it('validates a correct teacher profile', () => {
    const validTeacher = {
      name: 'الأستاذ محمد عطية',
      title: 'معلم ومربي تعليمي',
      bio: 'وصف تعريفي مختصر',
      avatar: '/assets/brand/teacher-placeholder.svg',
      logo: '/assets/brand/logo-placeholder.svg',
      contact: { email: 'test@example.com' },
    };
    expect(validateTeacher(validTeacher).valid).toBe(true);
  });

  it('rejects an incomplete teacher profile', () => {
    expect(validateTeacher({}).valid).toBe(false);
    expect(validateTeacher({ name: 'Only name' }).valid).toBe(false);
  });

  it('validates template settings', () => {
    expect(validateSettings({ storageNamespace: 'test_ns' }).valid).toBe(true);
    expect(validateSettings({}).valid).toBe(false);
  });

  it('validates curriculum hierarchy and catches duplicate ids', () => {
    const invalidCurriculum = {
      levels: [
        {
          id: 'l1',
          title: 'L1',
          order: 1,
          domains: [
            {
              id: 'd1',
              title: 'D1',
              order: 1,
              units: [
                {
                  id: 'u1',
                  title: 'U1',
                  order: 1,
                  lessons: [
                    { id: 'dup', title: 'Lesson 1', order: 1 },
                    { id: 'dup', title: 'Lesson 2', order: 2 },
                  ],
                },
              ],
            },
          ],
        },
      ],
    };
    const res = validateCurriculum(invalidCurriculum);
    expect(res.valid).toBe(false);
    expect(res.errors.some((e) => e.includes('Duplicate lesson id'))).toBe(true);
  });

  it('validates lesson structure and ensures all 9 sections exist', () => {
    const incompleteLesson = {
      id: 'lesson-01',
      title: 'Title',
      unitId: 'unit-01',
    };
    const res = validateLesson(incompleteLesson);
    expect(res.valid).toBe(false);
    expect(res.errors.length).toBeGreaterThan(0);
  });
});
