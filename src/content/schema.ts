import { Curriculum, LessonData, TeacherProfile, TemplateSettings } from '../types/content';

export function validateTeacher(teacher: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!teacher || typeof teacher !== 'object') {
    return { valid: false, errors: ['Teacher object is missing or invalid'] };
  }
  if (!teacher.name || typeof teacher.name !== 'string') errors.push('Teacher name is required');
  if (!teacher.title || typeof teacher.title !== 'string') errors.push('Teacher title is required');
  if (!teacher.bio || typeof teacher.bio !== 'string') errors.push('Teacher bio is required');
  return { valid: errors.length === 0, errors };
}

export function validateSettings(settings: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!settings || typeof settings !== 'object') {
    return { valid: false, errors: ['Settings object is missing or invalid'] };
  }
  if (!settings.storageNamespace || typeof settings.storageNamespace !== 'string') {
    errors.push('storageNamespace is required and must be a string');
  }
  return { valid: errors.length === 0, errors };
}

export function validateCurriculum(curriculum: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!curriculum || !Array.isArray(curriculum.levels)) {
    return { valid: false, errors: ['Curriculum must contain a levels array'] };
  }
  if (curriculum.levels.length === 0) {
    errors.push('Curriculum must have at least one level');
  }

  const lessonIds = new Set<string>();
  const unitIds = new Set<string>();

  for (const level of curriculum.levels) {
    if (!level.id || !level.title) errors.push(`Level missing id or title: ${JSON.stringify(level)}`);
    if (!Array.isArray(level.domains)) {
      errors.push(`Level ${level.id} must have a domains array`);
      continue;
    }
    for (const domain of level.domains) {
      if (!domain.id || !domain.title) errors.push(`Domain missing id or title: ${JSON.stringify(domain)}`);
      if (!Array.isArray(domain.units)) {
        errors.push(`Domain ${domain.id} must have a units array`);
        continue;
      }
      for (const unit of domain.units) {
        if (!unit.id || !unit.title) errors.push(`Unit missing id or title: ${JSON.stringify(unit)}`);
        if (unitIds.has(unit.id)) errors.push(`Duplicate unit id: ${unit.id}`);
        unitIds.add(unit.id);

        if (!Array.isArray(unit.lessons)) {
          errors.push(`Unit ${unit.id} must have a lessons array`);
          continue;
        }
        for (const lesson of unit.lessons) {
          if (!lesson.id || !lesson.title) errors.push(`Lesson ref missing id or title: ${JSON.stringify(lesson)}`);
          if (lessonIds.has(lesson.id)) errors.push(`Duplicate lesson id: ${lesson.id}`);
          lessonIds.add(lesson.id);
        }
      }
    }
  }

  return { valid: errors.length === 0, errors };
}

export function validateLesson(lesson: any): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  if (!lesson || typeof lesson !== 'object') {
    return { valid: false, errors: ['Lesson object is missing'] };
  }
  if (!lesson.id) errors.push('Lesson id is required');
  if (!lesson.title) errors.push('Lesson title is required');
  if (!lesson.unitId) errors.push('Lesson unitId is required');

  // Verify all 9 sections exist
  if (!Array.isArray(lesson.keyPoints)) errors.push('keyPoints must be an array');
  if (typeof lesson.summary !== 'string') errors.push('summary must be a string');
  if (!lesson.video || typeof lesson.video.url !== 'string') errors.push('video section missing or invalid');
  if (!Array.isArray(lesson.activities)) errors.push('activities must be an array');
  if (!Array.isArray(lesson.quiz)) errors.push('quiz must be an array');
  if (!lesson.booklet || typeof lesson.booklet.url !== 'string') errors.push('booklet section missing or invalid');
  if (!lesson.presentation || typeof lesson.presentation.url !== 'string') errors.push('presentation section missing or invalid');
  if (!Array.isArray(lesson.assistant)) errors.push('assistant must be an array');
  if (!lesson.homework || !Array.isArray(lesson.homework.tasks)) errors.push('homework tasks must be an array');

  return { valid: errors.length === 0, errors };
}
