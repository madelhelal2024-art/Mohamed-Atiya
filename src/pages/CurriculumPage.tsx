import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CurriculumIndexViewer } from '../components/CurriculumIndexViewer';
import { getCurriculum } from '../lib/content';
import { loadProgress } from '../lib/storage';
import { UserProgress } from '../types/content';
import { Icon } from '../components/Icon';
import '../styles/grade-six-index.css';

export const CurriculumPage: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress>(loadProgress());
  const curriculum = getCurriculum();

  useEffect(() => {
    const handleUpdate = () => setProgress(loadProgress());
    window.addEventListener('app:progress-updated', handleUpdate);
    return () => window.removeEventListener('app:progress-updated', handleUpdate);
  }, []);

  return (
    <div>
      <Breadcrumbs items={[{ label: 'المنهج والدروس' }]} />

      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
          خريطة المنهج والدروس التعليمية
        </h1>
        <p style={{ color: '#64748b' }}>
          تصفح المستويات الأربعة، الوحدات الدراسية، والدروس المرتبة تسلسلياً للوصول إلى كافة الأنشطة والمذكرات.
        </p>
      </div>

      <Link className="grade-six-shortcut" to="/grade-six/term-one">
        <span className="grade-six-shortcut__icon"><Icon name="book" /></span>
        <span>
          <strong>اللغة العربية — الصف السادس الابتدائي — الفصل الدراسي الأول</strong>
          <small>فهرس وحدات الكتاب الثلاث مع عناوين الأقسام وأرقام الصفحات كما وردت بالمنهج المرفق.</small>
        </span>
        <span aria-hidden="true">←</span>
      </Link>

      <CurriculumIndexViewer
        curriculum={curriculum}
        completedLessonIds={progress.completedLessons}
      />
    </div>
  );
};
