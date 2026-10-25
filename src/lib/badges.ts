import { Badge, UserProgress } from '../types/content';

export const BADGES_LIST: Badge[] = [
  {
    id: 'first-step',
    title: 'الخطوة الأولى',
    description: 'أكملت أول قسم تعليمي بنجاح',
    icon: '🚀',
    category: 'progress',
    threshold: 1,
  },
  {
    id: 'lesson-pioneer',
    title: 'رائد الدروس',
    description: 'أكملت درسًا تعليميًا كاملًا',
    icon: '⭐',
    category: 'progress',
    threshold: 1,
  },
  {
    id: 'knowledge-seeker',
    title: 'باحث المعرفة',
    description: 'أكملت 5 أقسام تعليمية مختلفة',
    icon: '📖',
    category: 'progress',
    threshold: 5,
  },
  {
    id: 'quiz-champ',
    title: 'بطل التقويم',
    description: 'حققت نسبة 100% في أحد الاختبارات القصيرة',
    icon: '🏆',
    category: 'quiz',
    threshold: 100,
  },
  {
    id: 'unit-master',
    title: 'قاهر الوحدة',
    description: 'أكملت 3 دروس في وحدة واحدة',
    icon: '👑',
    category: 'mastery',
    threshold: 3,
  },
  {
    id: 'board-artist',
    title: 'مبدع السبورة',
    description: 'استخدمت السبورة التفاعلية وسجلت ملاحظاتك',
    icon: '🎨',
    category: 'board',
    threshold: 1,
  },
  {
    id: 'curriculum-hero',
    title: 'بطل المنهج',
    description: 'أنجزت 12 درسًا أو أكثر عبر المنهج',
    icon: '🌟',
    category: 'mastery',
    threshold: 12,
  },
];

export function getBadgeById(id: string): Badge | undefined {
  return BADGES_LIST.find((b) => b.id === id);
}

export function evaluateBadges(progress: UserProgress): string[] {
  const earned = new Set<string>(progress.badges || []);

  // 1. Calculate total completed sections
  const totalSections = Object.values(progress.completedSections || {}).reduce(
    (acc, secs) => acc + (Array.isArray(secs) ? secs.length : 0),
    0
  );

  if (totalSections >= 1) {
    earned.add('first-step');
  }
  if (totalSections >= 5) {
    earned.add('knowledge-seeker');
  }

  // 2. Completed lessons
  const totalLessons = (progress.completedLessons || []).length;
  if (totalLessons >= 1) {
    earned.add('lesson-pioneer');
  }
  if (totalLessons >= 3) {
    earned.add('unit-master');
  }
  if (totalLessons >= 12) {
    earned.add('curriculum-hero');
  }

  // 3. Quiz perfection
  const scores = Object.values(progress.quizScores || {});
  if (scores.some((score) => score >= 100)) {
    earned.add('quiz-champ');
  }

  // Filter out any invalid badge ids that don't exist in BADGES_LIST
  const validIds = new Set(BADGES_LIST.map((b) => b.id));
  return Array.from(earned).filter((id) => validIds.has(id));
}
