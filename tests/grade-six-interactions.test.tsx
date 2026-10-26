import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GradeSixTreasureActivities } from '../src/components/GradeSixTreasureActivities';
import { GradeSixTreasureQuiz } from '../src/components/GradeSixTreasureQuiz';
import { GradeSixTreasurePresentation } from '../src/components/GradeSixTreasurePresentation';
import { GradeSixTreasureAssistant } from '../src/components/GradeSixTreasureAssistant';
import { GradeSixTreasureHomework } from '../src/components/GradeSixTreasureHomework';
import { treasureExam, treasureQuiz } from '../src/data/grade-six-lesson-interactions';

describe('التفاعلات التعليمية لدرس كنز لا يقدر بثمن', () => {
  it('يصحح معاني الكلمات، ويسمح بإعادة ترتيب الخطوات', () => {
    render(<GradeSixTreasureActivities />);
    fireEvent.change(screen.getByLabelText('معنى وَرَدَ'), { target: { value: 'جاء أو وصل' } });
    fireEvent.click(screen.getByRole('button', { name: 'تحقّق من المعاني' }));
    expect(screen.getByText('أجبت إجابة صحيحة عن 1 من 6 كلمات.')).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'تحقّق من الترتيب' }));
    expect(screen.getByText(/حاول مرة أخرى/)).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'حرّك تحديد وقت لكل عمل للأسفل' }));
    expect(screen.getByText(/تحديد وقت لكل عمل/)).toBeDefined();
  });

  it('لا يُظهر درجة التقويم إلا بعد الإجابة عن جميع أسئلته، ويتيح الإعادة', () => {
    const { container } = render(<GradeSixTreasureQuiz />);
    expect(screen.getByRole('button', { name: /أكمل 10 أسئلة/ }).hasAttribute('disabled')).toBe(true);
    treasureQuiz.forEach((question) => {
      const radio = container.querySelector<HTMLInputElement>(`input[name="treasure-quiz-${question.id}"][value="${question.correct}"]`);
      expect(radio).not.toBeNull();
      fireEvent.click(radio!);
    });
    fireEvent.click(screen.getByRole('button', { name: 'صحّح إجاباتي' }));
    expect(screen.getByText('نتيجتك: 10 من 10')).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'أعد المحاولة' }));
    expect(screen.queryByText('نتيجتك: 10 من 10')).toBeNull();
  });

  it('يتنقل بين الشرائح ويمكنه اختيار شريحة مباشرة', () => {
    render(<GradeSixTreasurePresentation />);
    expect(screen.getByText('شريحة 1 من 9')).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: 'التالي' }));
    expect(screen.getByText('شريحة 2 من 9')).toBeDefined();
    fireEvent.click(screen.getByRole('button', { name: /شريحة 9: خمس خطوات/ }));
    expect(screen.getByText('شريحة 9 من 9')).toBeDefined();
  });

  it('يفلتر الشرح الموجّه حسب كلمة البحث من دون ادعاء توليد إجابات مفتوحة', () => {
    render(<GradeSixTreasureAssistant />);
    fireEvent.change(screen.getByPlaceholderText(/مثل: التأجيل/), { target: { value: 'الشطرنج' } });
    expect(screen.getByRole('button', { name: /أسامة قدوة/ })).toBeDefined();
    expect(screen.queryByRole('button', { name: /المثل/ })).toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /أسامة قدوة/ }));
    expect(screen.getByText(/قسّم وقته بين الواجبات/)).toBeDefined();
  });

  it('يعرض واجبات عملية واختبارًا من عشرين درجة دون تصحيح آلي للأسئلة المفتوحة', () => {
    render(<GradeSixTreasureHomework />);
    expect(treasureExam.reduce((sum, task) => sum + task.marks, 0)).toBe(20);
    fireEvent.click(screen.getAllByRole('checkbox')[0]);
    expect(screen.getByText('أنجزت 1 من 4 مهام')).toBeDefined();
    fireEvent.click(screen.getAllByRole('button', { name: 'اعرض نموذج الإجابة للمقارنة' })[0]);
    expect(screen.getByText(/أُفَسِّر = أُوضّح/)).toBeDefined();
  });
});
