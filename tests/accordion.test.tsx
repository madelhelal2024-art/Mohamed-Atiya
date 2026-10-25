import { describe, expect, it, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { LessonAccordion } from '../src/components/LessonAccordion';
import { LessonData } from '../src/types/content';

const mockLesson: LessonData = {
  id: 'lesson-01',
  title: 'الدرس التجريبي',
  unitId: 'unit-01',
  order: 1,
  keyPoints: ['نقطة أولى', 'نقطة ثانية'],
  summary: 'ملخص الدرس التجريبي',
  video: { title: 'فيديو الشرح', url: 'https://youtube.com/watch?v=dQw4w9WgXcQ', durationMinutes: 20 },
  activities: [{ title: 'نشاط 1', description: 'وصف النشاط' }],
  quiz: [
    {
      id: 'q1',
      question: 'السؤال الأول؟',
      options: ['إجابة 1', 'إجابة 2'],
      correctAnswer: 0,
      explanation: 'توضيح السؤال',
    },
  ],
  booklet: { title: 'مذكرة الدرس', url: '/sample.pdf', totalPages: 5 },
  presentation: { title: 'عرض تقديمي', url: 'https://presentation.com' },
  assistant: [{ prompt: 'سؤال موجّه؟', explanation: 'شرح المساعد' }],
  homework: { title: 'واجب', description: 'حل التمارين', tasks: ['مهمة 1'] },
};

describe('LessonAccordion Component', () => {
  it('renders all 9 section titles properly', () => {
    render(
      <LessonAccordion
        lesson={mockLesson}
        completedSectionKeys={[]}
        onToggleSection={vi.fn()}
      />
    );

    expect(screen.getByText('أهم النقاط')).toBeDefined();
    expect(screen.getByText('التلخيص والخرائط')).toBeDefined();
    expect(screen.getByText('شرح الفيديو')).toBeDefined();
    expect(screen.getByText('الأنشطة التطبيقية')).toBeDefined();
    expect(screen.getByText('التقويم الذاتي')).toBeDefined();
    expect(screen.getByText('البوكليت والمذكرة')).toBeDefined();
    expect(screen.getByText('العرض التقديمي')).toBeDefined();
    expect(screen.getByText('اسألني وأنا هشرح لك')).toBeDefined();
    expect(screen.getByText('الواجبات والاختبارات')).toBeDefined();
  });

  it('triggers onToggleSection when check button is clicked', () => {
    const handleToggle = vi.fn();
    render(
      <LessonAccordion
        lesson={mockLesson}
        completedSectionKeys={[]}
        onToggleSection={handleToggle}
      />
    );

    const checkButtons = screen.getAllByRole('button', { name: /تحديد القسم كمكتمل/i });
    expect(checkButtons.length).toBeGreaterThan(0);
    fireEvent.click(checkButtons[0]);
    expect(handleToggle).toHaveBeenCalled();
  });
});
