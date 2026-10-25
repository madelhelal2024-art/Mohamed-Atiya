import lessonSupportData from './lesson-support.json';

export interface FAQItem {
  question: string;
  answer: string;
}

export function getGeneralFAQs(): FAQItem[] {
  return lessonSupportData.generalSupport.faqs;
}

export function getGeneralGreeting(): string {
  return lessonSupportData.generalSupport.greeting;
}
