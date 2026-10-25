import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import studentProgramsData from '../data/student-programs.json';
import { SafeExternalLink } from '../components/SafeExternalLink';
import { Link } from 'react-router-dom';

export const StudentProgramsPage: React.FC = () => {
  return (
    <div>
      <Breadcrumbs items={[{ label: 'البرامج والدورات' }]} />

      <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 2.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.75rem' }}>
          {studentProgramsData.title}
        </h1>
        <p style={{ color: '#64748b', fontSize: '1.05rem', lineHeight: 1.6 }}>
          {studentProgramsData.description}
        </p>
      </div>

      <div className="programs-grid">
        {studentProgramsData.programs.map((program) => (
          <div
            key={program.id}
            className={`program-card ${program.isRestricted ? 'restricted' : ''}`}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span className="badge" style={{ backgroundColor: '#eff6ff', color: '#2563EB' }}>
                  {program.duration}
                </span>
                {program.isRestricted && (
                  <span className="badge" style={{ backgroundColor: '#fef3c7', color: '#d97706' }}>
                    🔒 وصول مقيّد
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                {program.title}
              </h2>
              <p style={{ fontSize: '0.95rem', color: '#64748b', lineHeight: 1.6 }}>
                {program.description}
              </p>

              <div style={{ margin: '1.5rem 0', padding: '1rem', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                <span style={{ fontSize: '1.3rem', fontWeight: 800, color: '#0f172a' }}>
                  {program.price}
                </span>
              </div>

              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#334155', marginBottom: '0.5rem' }}>
                مميزات البرنامج:
              </h4>
              <ul className="program-features-list">
                {program.features.map((feat, i) => (
                  <li key={i}>
                    <span style={{ color: '#16a34a', fontWeight: 'bold' }}>✓</span>
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div style={{ marginTop: '1.5rem' }}>
              {program.linkUrl.startsWith('#') ? (
                <Link to={program.linkUrl.replace('#', '')} className="btn-primary" style={{ width: '100%', boxSizing: 'border-box' }}>
                  الانتقال إلى المنهج ←
                </Link>
              ) : (
                <SafeExternalLink href={program.linkUrl} className="btn-primary" style={{ width: '100%', boxSizing: 'border-box' }}>
                  طلب الاشتراك والتواصل ←
                </SafeExternalLink>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
