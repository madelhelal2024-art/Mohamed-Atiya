import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';
import { GradeSixOverviewPage } from '../src/pages/GradeSixOverviewPage';
import { GradeSixTermOnePage } from '../src/pages/GradeSixTermOnePage';
import { GradeSixLessonPage } from '../src/pages/GradeSixLessonPage';
import { SECTION_KEYS, SECTION_NAMES } from '../src/lib/ui-copy';

function renderPage(path: string, route: string, page: React.ReactNode): string {
  return renderToStaticMarkup(
    <MemoryRouter initialEntries={[path]}>
      <Routes><Route path={route} element={page} /></Routes>
    </MemoryRouter>,
  );
}

describe('واجهة الصف السادس', () => {
  it('تعرض فصلين فقط ولا تعرض المنهج العام غير المرتبط بالصف السادس', () => {
    const html = renderPage('/grade-six', '/grade-six', <GradeSixOverviewPage />);
    expect(html).toContain('الفصل الدراسي الأول');
    expect(html).toContain('الفصل الدراسي الثاني');
    expect(html).not.toContain('المنهج والدروس');
    expect(html).not.toContain('المستويات التعليمية');
  });

  it('تعرض روابط الدروس من دون عمود الصفحات', () => {
    const html = renderPage('/grade-six/term-one', '/grade-six/term-one', <GradeSixTermOnePage />);
    expect(html).toContain('سمر تطور نفسها');
    expect(html).toContain('فتح الدرس');
    expect(html).not.toContain('>الصفحة</th>');
  });

  it('تعرض الأقسام التسعة وعلامة الانتظار للدرس الذي لم تُرفع ملفاته', () => {
    const html = renderPage('/grade-six/term-one/self-development/1', '/grade-six/term-one/:unitId/:entryIndex', <GradeSixLessonPage />);
    for (const key of SECTION_KEYS) expect(html).toContain(SECTION_NAMES[key]);
    expect(html).toContain('لم تُضَف ملفات إلى هذا الدرس بعد');
    expect(html).not.toContain('href="undefined"');
  });

  it('تعرض أهم النقاط والفيديو والخريطة والبوكليت لدرس كنز لا يقدر بثمن', () => {
    const html = renderPage('/grade-six/term-one/self-development/2', '/grade-six/term-one/:unitId/:entryIndex', <GradeSixLessonPage />);
    expect(html).toContain('أهم النقاط الجوهرية');
    expect(html).toContain('٨٦٤٠٠ ثانية');
    expect(html).toContain('ركّز عليها قبل الامتحان');
    expect(html).toContain('time-guide.webp');
    expect(html).toContain('part-00.mp4');
    expect(html).toContain('kanz-workbook.pdf');
    expect(html).toContain('٤ أقسام متاحة من ٩');
  });
});
