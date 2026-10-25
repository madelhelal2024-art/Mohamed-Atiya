export interface TeacherProfile {
  name: string;
  title: string;
  bio: string;
  avatar: string;
  logo: string;
  contact: {
    email: string;
    phone?: string;
    whatsapp?: string;
    telegram?: string;
    youtube?: string;
  };
  accentColor?: string;
  secondaryColor?: string;
}

export interface TemplateSettings {
  storageNamespace: string;
  demoMode: boolean;
  enableSound: boolean;
  allowReset: boolean;
}

export interface LessonRef {
  id: string;
  title: string;
  order: number;
  durationMinutes?: number;
}

export interface Unit {
  id: string;
  title: string;
  description: string;
  order: number;
  lessons: LessonRef[];
  themeColor?: string;
  badgeId?: string;
}

export interface Domain {
  id: string;
  title: string;
  order: number;
  units: Unit[];
}

export interface Level {
  id: string;
  title: string;
  order: number;
  coverImage?: string;
  domains: Domain[];
}

export interface Curriculum {
  levels: Level[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface LessonSectionItem {
  id: string;
  title?: string;
  content: string;
}

export interface LessonData {
  id: string;
  title: string;
  unitId: string;
  order: number;
  keyPoints: string[];
  summary: string;
  video: {
    title: string;
    url: string;
    durationMinutes: number;
  };
  activities: {
    title: string;
    description: string;
    materials?: string[];
  }[];
  quiz: QuizQuestion[];
  booklet: {
    title: string;
    url: string;
    totalPages: number;
    description?: string;
  };
  presentation: {
    title: string;
    url: string;
    slidesCount?: number;
  };
  assistant: {
    prompt: string;
    explanation: string;
    keyTakeaway?: string;
  }[];
  homework: {
    title: string;
    description: string;
    deadlineDays?: number;
    tasks: string[];
  };
}

export interface UnitIndexTopic {
  id: string;
  title: string;
  lessonId: string;
  category: string;
}

export interface UnitIndexEntry {
  unitId: string;
  title: string;
  themeColor: string;
  topics: UnitIndexTopic[];
  objectives: string[];
}

export interface StudentProgramItem {
  id: string;
  title: string;
  description: string;
  price: string;
  duration: string;
  isRestricted: boolean;
  features: string[];
  linkUrl: string;
}

export interface StudentProgramsData {
  title: string;
  description: string;
  programs: StudentProgramItem[];
}

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'progress' | 'quiz' | 'explorer' | 'board' | 'mastery';
  threshold: number;
}

export interface UserProgress {
  completedSections: Record<string, string[]>; // lessonId -> sectionIds
  completedLessons: string[];
  quizScores: Record<string, number>; // lessonId -> score percent
  badges: string[]; // unlocked badge ids
  surveyAnswers?: Record<string, string | number>;
  lastVisitedLesson?: string;
  updatedAt: number;
}
