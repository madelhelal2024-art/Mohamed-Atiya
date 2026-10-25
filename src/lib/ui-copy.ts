/**
 * UI Copy and localized Arabic constants
 */

export const SECTION_NAMES: Record<string, string> = {
  keyPoints: 'أهم النقاط',
  summary: 'التلخيص والخرائط',
  video: 'شرح الفيديو',
  activities: 'الأنشطة التطبيقية',
  quiz: 'التقويم الذاتي',
  booklet: 'البوكليت والمذكرة',
  presentation: 'العرض التقديمي',
  assistant: 'اسألني وأنا هشرح لك',
  homework: 'الواجبات والاختبارات',
};

export const SECTION_KEYS = [
  'keyPoints',
  'summary',
  'video',
  'activities',
  'quiz',
  'booklet',
  'presentation',
  'assistant',
  'homework',
] as const;

export type SectionKey = typeof SECTION_KEYS[number];

export const EMPTY_STATE_MESSAGES: Record<string, string> = {
  keyPoints: 'لم تتم إضافة نقاط رئيسية بعد.',
  summary: 'ملخص الدرس قيد الإعداد والإضافة قريبًا.',
  video: 'رابط فيديو الشرح غير متوفر حاليًا.',
  activities: 'لا توجد أنشطة إضافية لهذا الدرس حاليًا.',
  quiz: 'أسئلة التقويم قيد المراجعة والإضافة.',
  booklet: 'ملف البوكليت غير متاح للتحميل حاليًا.',
  presentation: 'شرائح العرض التقديمي قيد التجهيز.',
  assistant: 'المساعد الموجّه جاهز، وسيتم تزويده بالأسئلة الشائعة قريبًا.',
  homework: 'لا توجد تكليفات أو واجبات مطلوبة حاليًا.',
};

export const APP_STRINGS = {
  appName: 'تطبيق المعلم التعليمي',
  curriculum: 'المنهج والدروس',
  board: 'السبورة التفاعلية',
  profile: 'الملف والتقدم',
  programs: 'البرامج والدورات',
  searchPlaceholder: 'ابحث عن درس أو موضوع أو وحدة...',
  completed: 'مكتمل',
  notCompleted: 'غير مكتمل',
  markCompleted: 'تحديد كمكتمل',
  markIncomplete: 'إلغاء الإكمال',
  backToUnit: 'العودة للوحدة',
  backToCurriculum: 'العودة للمنهج',
  nextLesson: 'الدرس التالي',
  previousLesson: 'الدرس السابق',
  badgesTitle: 'أوسمة الإنجاز',
  progressTitle: 'مستوى التقدم الدراسي',
  startQuiz: 'ابدأ الاختبار القصير',
  submitQuiz: 'تأكيد الإجابات',
  quizResult: 'نتيجة التقويم الذاتي',
};
