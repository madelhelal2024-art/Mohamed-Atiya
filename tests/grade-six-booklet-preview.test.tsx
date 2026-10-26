import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { GradeSixBookletPages, GradeSixResourcePreview } from '../src/components/GradeSixResourcePreview';

const pages = [
  '/assets/lessons/grade-six/term-one/self-development/02/booklet/pages/page-01.png',
  '/assets/lessons/grade-six/term-one/self-development/02/booklet/pages/page-02.png',
  '/assets/lessons/grade-six/term-one/self-development/02/booklet/pages/page-03.png',
];

describe('معاينة صفحات البوكليت', () => {
  it('يعرض الصفحة الأولى ويبدّل الصفحات بزر التالي والسابق والقائمة', () => {
    render(<GradeSixBookletPages title="كنز لا يقدر بثمن" pages={pages} />);
    expect(screen.getByRole('img', { name: /صفحة 1 من 3/ }).getAttribute('src')).toBe(pages[0]);
    expect(screen.getByRole('button', { name: 'السابق' }).hasAttribute('disabled')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'التالي' }));
    expect(screen.getByRole('img', { name: /صفحة 2 من 3/ }).getAttribute('src')).toBe(pages[1]);
    fireEvent.change(screen.getByLabelText('اختر صفحة من البوكليت'), { target: { value: '2' } });
    expect(screen.getByRole('img', { name: /صفحة 3 من 3/ }).getAttribute('src')).toBe(pages[2]);
    expect(screen.getByRole('button', { name: 'التالي' }).hasAttribute('disabled')).toBe(true);
  });

  it('لا يعتمد على إطار PDF المدمج ويحتفظ برابط التنزيل الأصلي', () => {
    const { container } = render(<GradeSixResourcePreview resource={{
      title: 'بوكليت القراءة', url: '/assets/lessons/grade-six/booklet.pdf', kind: 'pdf', pages,
    }} />);
    expect(container.querySelector('iframe')).toBeNull();
    expect(screen.getByRole('link', { name: 'تنزيل البوكليت PDF' }).getAttribute('href')).toContain('booklet.pdf');
    expect(screen.getByRole('img', { name: /صفحة 1 من 3/ })).toBeDefined();
  });
});
