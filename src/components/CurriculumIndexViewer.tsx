import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Curriculum } from '../types/content';
import { BrandImage } from './BrandImage';
import { Icon } from './Icon';

interface CurriculumIndexViewerProps {
  curriculum: Curriculum;
  completedLessonIds?: string[];
}

export const CurriculumIndexViewer: React.FC<CurriculumIndexViewerProps> = ({
  curriculum,
  completedLessonIds = [],
}) => {
  const [selectedLevelId, setSelectedLevelId] = useState<string>(
    curriculum.levels[0]?.id || ''
  );

  const completedSet = new Set(completedLessonIds);
  const activeLevel = curriculum.levels.find((l) => l.id === selectedLevelId) || curriculum.levels[0];

  return (
    <div>
      {/* Level selector tabs */}
      <div style={{ display: 'flex', gap: '0.75rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem' }}>
        {curriculum.levels.map((lvl) => {
          const isSelected = lvl.id === selectedLevelId;
          return (
            <button
              key={lvl.id}
              type="button"
              onClick={() => setSelectedLevelId(lvl.id)}
              style={{
                padding: '0.65rem 1.25rem',
                borderRadius: '9999px',
                fontWeight: 600,
                fontSize: '0.95rem',
                whiteSpace: 'nowrap',
                backgroundColor: isSelected ? 'var(--primary)' : '#ffffff',
                color: isSelected ? '#ffffff' : '#475569',
                border: `1px solid ${isSelected ? 'var(--primary)' : '#cbd5e1'}`,
                boxShadow: isSelected ? '0 4px 10px rgba(37, 99, 235, 0.2)' : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              {lvl.title}
            </button>
          );
        })}
      </div>

      {activeLevel && (
        <div>
          {/* Level banner */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              backgroundColor: '#ffffff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              overflow: 'hidden',
              marginBottom: '2rem',
            }}
          >
            {activeLevel.coverImage && (
              <BrandImage
                src={activeLevel.coverImage}
                alt={activeLevel.title}
                className="level-cover-img"
              />
            )}
            <div style={{ padding: '1.25rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>
                {activeLevel.title}
              </h2>
            </div>
          </div>

          {/* Domains and Units */}
          {activeLevel.domains.map((domain) => (
            <div key={domain.id} style={{ marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#334155', marginBottom: '1rem' }}>
                {domain.title}
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
                {domain.units.map((unit) => (
                  <div key={unit.id} className="unit-card" style={{ borderRightColor: unit.themeColor || '#2563EB' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                      <Link to={`/unit/${unit.id}`} style={{ textDecoration: 'none' }}>
                        <h4 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>
                          {unit.title}
                        </h4>
                      </Link>
                      <span className="badge" style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                        {unit.lessons.length} دروس
                      </span>
                    </div>

                    <p style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '1rem', minHeight: '40px' }}>
                      {unit.description}
                    </p>

                    <div>
                      {unit.lessons.map((lesson) => {
                        const isDone = completedSet.has(lesson.id);
                        return (
                          <Link
                            key={lesson.id}
                            to={`/lesson/${lesson.id}`}
                            className="lesson-list-item"
                          >
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: '#1e293b' }}>
                              {lesson.title}
                            </span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              {isDone && (
                                <span style={{ color: '#16a34a' }} title="مكتمل">
                                  <Icon name="check" size={16} />
                                </span>
                              )}
                              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                                {lesson.durationMinutes} دقيقة
                              </span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
