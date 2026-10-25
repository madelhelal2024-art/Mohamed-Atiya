import curriculumData from '../data/curriculum.json';
import { Curriculum, LessonData, LessonRef, Unit } from '../types/content';

// Import all lesson JSON files eagerly via Vite glob or fallback map
const lessonModules = import.meta.glob('../data/lessons/*.json', { eager: true }) as Record<string, any>;

const lessonsMap: Record<string, LessonData> = {};

for (const path in lessonModules) {
  const mod = lessonModules[path];
  const lesson = (mod && mod.default) ? mod.default : mod;
  if (lesson && lesson.id) {
    lessonsMap[lesson.id] = lesson;
  }
}

export function getCurriculum(): Curriculum {
  return curriculumData as unknown as Curriculum;
}

export function getLessonById(id: string): LessonData | undefined {
  return lessonsMap[id];
}

export function getAllLessons(): LessonData[] {
  return Object.values(lessonsMap).sort((a, b) => a.order - b.order);
}

export function getUnitById(unitId: string): { unit: Unit; levelTitle: string } | undefined {
  const curriculum = getCurriculum();
  for (const level of curriculum.levels) {
    for (const domain of level.domains) {
      for (const unit of domain.units) {
        if (unit.id === unitId) {
          return { unit, levelTitle: level.title };
        }
      }
    }
  }
  return undefined;
}

export function getAdjacentLessons(lessonId: string): {
  prevLesson?: LessonRef;
  nextLesson?: LessonRef;
  unit?: Unit;
} {
  const curriculum = getCurriculum();
  const allRefs: { ref: LessonRef; unit: Unit }[] = [];

  for (const level of curriculum.levels) {
    for (const domain of level.domains) {
      for (const unit of domain.units) {
        for (const ref of unit.lessons) {
          allRefs.push({ ref, unit });
        }
      }
    }
  }

  const index = allRefs.findIndex((item) => item.ref.id === lessonId);
  if (index === -1) return {};

  return {
    prevLesson: index > 0 ? allRefs[index - 1].ref : undefined,
    nextLesson: index < allRefs.length - 1 ? allRefs[index + 1].ref : undefined,
    unit: allRefs[index].unit,
  };
}
