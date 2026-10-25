import { UserProgress } from '../types/content';

export function calculateCompletionRate(completed: number, total: number): number {
  if (total <= 0) return 0;
  if (completed <= 0) return 0;
  const rate = Math.round((completed / total) * 100);
  return Math.min(100, Math.max(0, rate));
}

export function calculateOverallProgress(
  progress: UserProgress,
  totalLessonsCount: number = 24
): number {
  if (!progress || totalLessonsCount <= 0) return 0;
  const completed = Array.isArray(progress.completedLessons) ? progress.completedLessons.length : 0;
  return calculateCompletionRate(completed, totalLessonsCount);
}

export function calculateUnitProgress(
  progress: UserProgress,
  unitLessonIds: string[]
): { completed: number; total: number; percentage: number } {
  if (!unitLessonIds || unitLessonIds.length === 0) {
    return { completed: 0, total: 0, percentage: 0 };
  }
  const completedSet = new Set(progress.completedLessons || []);
  const completedCount = unitLessonIds.filter((id) => completedSet.has(id)).length;
  return {
    completed: completedCount,
    total: unitLessonIds.length,
    percentage: calculateCompletionRate(completedCount, unitLessonIds.length),
  };
}

export function getSimulatedClassStats(demoMode: boolean = false) {
  // If demoMode is false, return zeroed or clearly marked empty metrics
  if (!demoMode) {
    return {
      activeStudents: 0,
      averageCompletion: 0,
      topUnit: 'الوحدة الأولى',
      isSimulated: false,
    };
  }
  return {
    activeStudents: 42,
    averageCompletion: 68,
    topUnit: 'الوحدة الأولى: الأساسيات والمفاهيم',
    isSimulated: true,
  };
}
