import { describe, expect, it } from 'vitest';
import { calculateCompletionRate, calculateOverallProgress, calculateUnitProgress, getSimulatedClassStats } from '../src/lib/progress';
import { evaluateBadges } from '../src/lib/badges';
import { normalizeArabicText, searchCurriculum } from '../src/lib/search';
import curriculum from '../src/data/curriculum.json';
import { Curriculum, UserProgress } from '../src/types/content';

describe('General Template Domain Logic', () => {
  it('calculates completion percentages correctly', () => {
    expect(calculateCompletionRate(0, 10)).toBe(0);
    expect(calculateCompletionRate(5, 10)).toBe(50);
    expect(calculateCompletionRate(10, 10)).toBe(100);
    expect(calculateCompletionRate(15, 10)).toBe(100);
    expect(calculateCompletionRate(5, 0)).toBe(0);
  });

  it('calculates overall progress based on completed lessons', () => {
    const dummyProgress: UserProgress = {
      completedSections: {},
      completedLessons: ['lesson-01', 'lesson-02', 'lesson-03', 'lesson-04', 'lesson-05', 'lesson-06'],
      quizScores: {},
      badges: [],
      updatedAt: Date.now(),
    };
    expect(calculateOverallProgress(dummyProgress, 24)).toBe(25);
  });

  it('calculates unit-specific progress', () => {
    const dummyProgress: UserProgress = {
      completedSections: {},
      completedLessons: ['lesson-01', 'lesson-02'],
      quizScores: {},
      badges: [],
      updatedAt: Date.now(),
    };
    const unitRes = calculateUnitProgress(dummyProgress, ['lesson-01', 'lesson-02', 'lesson-03']);
    expect(unitRes.completed).toBe(2);
    expect(unitRes.total).toBe(3);
    expect(unitRes.percentage).toBe(67);
  });

  it('evaluates and awards badges while filtering out invalid IDs', () => {
    const progress: UserProgress = {
      completedSections: {
        'lesson-01': ['s1', 's2', 's3', 's4', 's5'],
      },
      completedLessons: ['lesson-01', 'lesson-02', 'lesson-03'],
      quizScores: { 'lesson-01': 100 },
      badges: ['invalid-ghost-badge-id'],
      updatedAt: Date.now(),
    };

    const earned = evaluateBadges(progress);
    expect(earned).toContain('first-step');
    expect(earned).toContain('knowledge-seeker');
    expect(earned).toContain('lesson-pioneer');
    expect(earned).toContain('unit-master');
    expect(earned).toContain('quiz-champ');
    expect(earned).not.toContain('invalid-ghost-badge-id');
  });

  it('provides simulated stats only when demoMode is active', () => {
    const liveStats = getSimulatedClassStats(false);
    expect(liveStats.isSimulated).toBe(false);
    expect(liveStats.activeStudents).toBe(0);

    const demoStats = getSimulatedClassStats(true);
    expect(demoStats.isSimulated).toBe(true);
    expect(demoStats.activeStudents).toBe(42);
  });

  it('normalizes Arabic characters and searches curriculum accurately', () => {
    expect(normalizeArabicText('إِخْتِبَارٌ')).toBe('اختبار');
    expect(normalizeArabicText('الوحدة الأولى')).toBe('الوحده الاولي');

    const searchRes = searchCurriculum(curriculum as unknown as Curriculum, 'مفاهيم');
    expect(searchRes.length).toBeGreaterThan(0);
    expect(searchRes[0].title).toBeDefined();
  });
});
