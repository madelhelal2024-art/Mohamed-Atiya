import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { LessonAccordion } from '../components/LessonAccordion';
import { ConfettiBurst } from '../components/ConfettiBurst';
import { getAdjacentLessons, getLessonById, getUnitById } from '../lib/content';
import { loadProgress, recordQuizScore, toggleSectionComplete, unlockBadge } from '../lib/storage';
import { evaluateBadges } from '../lib/badges';
import { UserProgress } from '../types/content';

export const LessonPage: React.FC = () => {
  const { lessonId } = useParams<{ lessonId: string }>();
  const [progress, setProgress] = useState<UserProgress>(loadProgress());
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  useEffect(() => {
    const handleUpdate = () => setProgress(loadProgress());
    window.addEventListener('app:progress-updated', handleUpdate);
    return () => window.removeEventListener('app:progress-updated', handleUpdate);
  }, []);

  if (!lessonId) {
    return <div style={{ padding: '2rem' }}>الدرس غير محدد</div>;
  }

  const lesson = getLessonById(lessonId);
  if (!lesson) {
    return (
      <div>
        <Breadcrumbs items={[{ label: 'المنهج', path: '/curriculum' }, { label: 'درس غير موجود' }]} />
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>عذراً، لم يتم العثور على هذا الدرس</h2>
          <Link to="/curriculum" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            العودة للمنهج
          </Link>
        </div>
      </div>
    );
  }

  const unitData = getUnitById(lesson.unitId);
  const adjacent = getAdjacentLessons(lesson.id);
  const completedSections = progress.completedSections[lesson.id] || [];
  const isLessonCompleted = progress.completedLessons.includes(lesson.id);

  const handleToggleSection = (sectionKey: string) => {
    const wasCompleted = completedSections.includes(sectionKey);
    const updated = toggleSectionComplete(lesson.id, sectionKey);
    setProgress(updated);

    // If section just completed, trigger badges evaluation
    if (!wasCompleted) {
      const earned = evaluateBadges(updated);
      earned.forEach((badgeId) => {
        if (!updated.badges.includes(badgeId)) {
          unlockBadge(badgeId);
          setShowConfetti(true);
        }
      });
    }
  };

  const handleQuizScore = (score: number) => {
    const updated = recordQuizScore(lesson.id, score);
    setProgress(updated);
    if (score >= 100) {
      unlockBadge('quiz-champ');
      setShowConfetti(true);
    }
  };

  return (
    <div>
      <ConfettiBurst active={showConfetti} onComplete={() => setShowConfetti(false)} />

      <Breadcrumbs
        items={[
          { label: 'المنهج', path: '/curriculum' },
          ...(unitData
            ? [
                { label: unitData.levelTitle, path: '/curriculum' },
                { label: unitData.unit.title, path: `/unit/${unitData.unit.id}` },
              ]
            : []),
          { label: lesson.title },
        ]}
      />

      {/* Lesson Header Banner */}
      <div className="lesson-header">
        <div
          className="card"
          style={{
            borderRight: '6px solid var(--primary)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '1rem',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#2563EB' }}>
                {unitData?.unit.title || 'الوحدة الدراسية'}
              </span>
              {isLessonCompleted && (
                <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                  ✓ تم إكمال الدرس
                </span>
              )}
            </div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
              {lesson.title}
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginTop: '0.25rem' }}>
              أكمل الأقسام التسعة للدرس للوصول إلى الإتقان والحصول على شارة الوحدة.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '0.9rem', color: '#475569', fontWeight: 600 }}>
              الأقسام المكتملة: {completedSections.length} من 9
            </span>
          </div>
        </div>
      </div>

      {/* 9 Sections Accordion */}
      <div style={{ marginBottom: '2.5rem' }}>
        <LessonAccordion
          lesson={lesson}
          completedSectionKeys={completedSections}
          onToggleSection={handleToggleSection}
          onQuizScore={handleQuizScore}
        />
      </div>

      {/* Navigation between adjacent lessons */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid var(--border-color)',
        }}
      >
        {adjacent.prevLesson ? (
          <Link to={`/lesson/${adjacent.prevLesson.id}`} className="btn-secondary">
            ← الدرس السابق: {adjacent.prevLesson.title}
          </Link>
        ) : (
          <div />
        )}

        {unitData && (
          <Link to={`/unit/${unitData.unit.id}`} style={{ color: '#64748b', fontWeight: 600, fontSize: '0.95rem' }}>
            فهرس الوحدة
          </Link>
        )}

        {adjacent.nextLesson ? (
          <Link to={`/lesson/${adjacent.nextLesson.id}`} className="btn-primary">
            الدرس التالي: {adjacent.nextLesson.title} →
          </Link>
        ) : (
          <div />
        )}
      </div>
    </div>
  );
};
