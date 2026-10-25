import { UserProgress } from '../types/content';
import defaultSettings from '../data/template-settings.json';

const NAMESPACE = defaultSettings.storageNamespace || 'educational_app_mohamed_atiya_v3';
const PROGRESS_KEY = `${NAMESPACE}_progress`;

export const INITIAL_PROGRESS: UserProgress = {
  completedSections: {},
  completedLessons: [],
  quizScores: {},
  badges: [],
  surveyAnswers: {},
  updatedAt: Date.now(),
};

export function loadProgress(): UserProgress {
  if (typeof window === 'undefined') return INITIAL_PROGRESS;
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return INITIAL_PROGRESS;
    const parsed = JSON.parse(raw);
    return {
      completedSections: parsed.completedSections || {},
      completedLessons: Array.isArray(parsed.completedLessons) ? parsed.completedLessons : [],
      quizScores: parsed.quizScores || {},
      badges: Array.isArray(parsed.badges) ? parsed.badges : [],
      surveyAnswers: parsed.surveyAnswers || {},
      lastVisitedLesson: parsed.lastVisitedLesson,
      updatedAt: parsed.updatedAt || Date.now(),
    };
  } catch (err) {
    console.warn('Failed to load user progress:', err);
    return INITIAL_PROGRESS;
  }
}

export function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  try {
    const data = { ...progress, updatedAt: Date.now() };
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(data));
    window.dispatchEvent(new Event('app:progress-updated'));
  } catch (err) {
    console.warn('Failed to save user progress:', err);
  }
}

export function toggleSectionComplete(lessonId: string, sectionId: string): UserProgress {
  const current = loadProgress();
  const sections = new Set(current.completedSections[lessonId] || []);
  if (sections.has(sectionId)) {
    sections.delete(sectionId);
  } else {
    sections.add(sectionId);
  }

  const updatedSections = {
    ...current.completedSections,
    [lessonId]: Array.from(sections),
  };

  // If all 9 sections or majority completed, mark lesson completed
  const completedLessonsSet = new Set(current.completedLessons);
  if (sections.size >= 5) {
    completedLessonsSet.add(lessonId);
  } else {
    completedLessonsSet.delete(lessonId);
  }

  const updated: UserProgress = {
    ...current,
    completedSections: updatedSections,
    completedLessons: Array.from(completedLessonsSet),
  };

  saveProgress(updated);
  return updated;
}

export function recordQuizScore(lessonId: string, scorePercent: number): UserProgress {
  const current = loadProgress();
  const updated: UserProgress = {
    ...current,
    quizScores: {
      ...current.quizScores,
      [lessonId]: Math.max(scorePercent, current.quizScores[lessonId] || 0),
    },
  };
  saveProgress(updated);
  return updated;
}

export function unlockBadge(badgeId: string): UserProgress {
  const current = loadProgress();
  const badgesSet = new Set(current.badges);
  badgesSet.add(badgeId);
  const updated: UserProgress = {
    ...current,
    badges: Array.from(badgesSet),
  };
  saveProgress(updated);
  return updated;
}

export function resetProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PROGRESS_KEY);
  window.dispatchEvent(new Event('app:progress-updated'));
}
