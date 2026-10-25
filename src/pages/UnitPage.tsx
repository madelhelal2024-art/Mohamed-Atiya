import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { getUnitById } from '../lib/content';
import { getUnitIndexEntry } from '../data/curriculum-units-index';
import { loadProgress } from '../lib/storage';
import { calculateUnitProgress } from '../lib/progress';
import { Icon } from '../components/Icon';
import { UserProgress } from '../types/content';

export const UnitPage: React.FC = () => {
  const { unitId } = useParams<{ unitId: string }>();
  const [progress, setProgress] = useState<UserProgress>(loadProgress());

  useEffect(() => {
    const handleUpdate = () => setProgress(loadProgress());
    window.addEventListener('app:progress-updated', handleUpdate);
    return () => window.removeEventListener('app:progress-updated', handleUpdate);
  }, []);

  if (!unitId) {
    return <div style={{ padding: '2rem' }}>الوحدة غير محددة</div>;
  }

  const unitData = getUnitById(unitId);
  if (!unitData) {
    return (
      <div>
        <Breadcrumbs items={[{ label: 'المنهج', path: '/curriculum' }, { label: 'وحدة غير موجودة' }]} />
        <div style={{ textAlign: 'center', padding: '3rem' }}>
          <h2>عذراً، لم يتم العثور على هذه الوحدة التعليمية</h2>
          <Link to="/curriculum" className="btn-primary" style={{ marginTop: '1rem', display: 'inline-block' }}>
            العودة للمنهج
          </Link>
        </div>
      </div>
    );
  }

  const { unit, levelTitle } = unitData;
  const unitIndexEntry = getUnitIndexEntry(unit.id);
  const lessonIds = unit.lessons.map((l) => l.id);
  const unitStats = calculateUnitProgress(progress, lessonIds);
  const completedSet = new Set(progress.completedLessons);

  return (
    <div>
      <Breadcrumbs
        items={[
          { label: 'المنهج', path: '/curriculum' },
          { label: levelTitle, path: '/curriculum' },
          { label: unit.title },
        ]}
      />

      <div
        className="card"
        style={{
          borderRight: `6px solid ${unit.themeColor || '#2563EB'}`,
          marginBottom: '2rem',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#2563EB', marginBottom: '0.5rem' }}>
              {levelTitle}
            </span>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
              {unit.title}
            </h1>
            <p style={{ color: '#64748b', marginTop: '0.5rem', maxWidth: '700px' }}>
              {unit.description}
            </p>
          </div>

          <div style={{ background: '#f8fafc', padding: '1rem 1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
            <div style={{ fontSize: '1.75rem', fontWeight: 800, color: unit.themeColor || '#2563EB' }}>
              {unitStats.percentage}%
            </div>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              أكملت {unitStats.completed} من {unitStats.total} دروس
            </div>
          </div>
        </div>

        {/* Unit Objectives */}
        {unitIndexEntry?.objectives && unitIndexEntry.objectives.length > 0 && (
          <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#334155', marginBottom: '0.75rem' }}>
              🎯 أهداف الوحدة ومخرجات التعلم:
            </h3>
            <ul style={{ paddingRight: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {unitIndexEntry.objectives.map((obj, i) => (
                <li key={i} style={{ color: '#475569', fontSize: '0.95rem' }}>{obj}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Lessons List in this unit */}
      <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '1rem' }}>
        دروس الوحدة
      </h2>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {unit.lessons.map((lesson) => {
          const isDone = completedSet.has(lesson.id);
          return (
            <div
              key={lesson.id}
              className="card"
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                    {lesson.title}
                  </h3>
                  {isDone && (
                    <span className="badge" style={{ backgroundColor: '#dcfce7', color: '#16a34a' }}>
                      <Icon name="check" size={14} /> مكتمل
                    </span>
                  )}
                </div>
                <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                  المدة التقديرية: {lesson.durationMinutes} دقيقة
                </span>
              </div>

              <Link to={`/lesson/${lesson.id}`} className="btn-primary">
                فتح الدرس والأقسام التسعة ←
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};
