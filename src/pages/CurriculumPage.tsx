import React, { useEffect, useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { CurriculumIndexViewer } from '../components/CurriculumIndexViewer';
import { getCurriculum } from '../lib/content';
import { loadProgress } from '../lib/storage';
import { UserProgress } from '../types/content';

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

      <CurriculumIndexViewer
        curriculum={curriculum}
        completedLessonIds={progress.completedLessons}
      />
    </div>
  );
};
