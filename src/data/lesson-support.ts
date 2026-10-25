import supportData from './lesson-support.json';
import type { HomeworkItem } from '../types/content';
export interface AssistantCommonMistake {
    wrong: string;
    correction: string;
    reason?: string;
}
export interface AssistantTopic {
    id: string;
    title: string;
    explanation: string;
    simpleExplanation: string;
    examples: string[];
    commonMistake: AssistantCommonMistake;
}
export interface AssistantQuickQuestion {
    question: string;
    options: string[];
    correctIndex: number;
    correctFeedback: string;
    incorrectFeedback: string;
    hint?: string;
}
export interface LessonAssistantGuide {
    lessonTitle: string;
    intro: string;
    topics: AssistantTopic[];
    quickQuestion: AssistantQuickQuestion;
}
/** Prepared, local lesson help only. No generative AI or API key is bundled. */
const support = supportData as {
    guides: Record<string, LessonAssistantGuide>;
    homeworkAssessments: Record<string, HomeworkItem>;
};
export function getLessonAssistantGuide(lessonId: string): LessonAssistantGuide | null {
    return support.guides[lessonId] ?? null;
}
export function getLessonHomeworkAssessment(lessonId: string): HomeworkItem | null {
    return support.homeworkAssessments[lessonId] ?? null;
}
