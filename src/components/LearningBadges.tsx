import React from 'react';
import { BADGES_LIST } from '../lib/badges';

interface LearningBadgesProps {
  unlockedBadgeIds: string[];
}

export const LearningBadges: React.FC<LearningBadgesProps> = ({ unlockedBadgeIds = [] }) => {
  const earnedSet = new Set(unlockedBadgeIds);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700 }}>أوسمة الإنجاز والشارات</h3>
        <span style={{ fontSize: '0.9rem', color: '#64748b', fontWeight: 600 }}>
          {earnedSet.size} من {BADGES_LIST.length} مكتمل
        </span>
      </div>

      <div className="badges-grid">
        {BADGES_LIST.map((badge) => {
          const isUnlocked = earnedSet.has(badge.id);
          return (
            <div
              key={badge.id}
              className={`badge-card ${isUnlocked ? 'unlocked' : 'locked'}`}
              title={badge.description}
            >
              <div className="badge-icon-wrap" aria-hidden="true">
                {badge.icon}
              </div>
              <h4 className="badge-title">{badge.title}</h4>
              <p className="badge-desc">{badge.description}</p>
              <div style={{ marginTop: '0.75rem' }}>
                <span
                  style={{
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.6rem',
                    borderRadius: '9999px',
                    fontWeight: 600,
                    backgroundColor: isUnlocked ? '#dcfce7' : '#f1f5f9',
                    color: isUnlocked ? '#15803d' : '#64748b',
                  }}
                >
                  {isUnlocked ? 'مكتسب ✨' : 'قيد الإنجاز'}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
