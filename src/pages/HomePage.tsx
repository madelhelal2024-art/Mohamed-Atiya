import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import teacherData from '../data/teacher.json';
import curriculumData from '../data/curriculum.json';
import { BrandImage } from '../components/BrandImage';
import { D3CircularProgressChart } from '../components/D3CircularProgressChart';
import { loadProgress } from '../lib/storage';
import { calculateOverallProgress } from '../lib/progress';
import { UserProgress } from '../types/content';

export const HomePage: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress>(loadProgress());

  useEffect(() => {
    const handleUpdate = () => setProgress(loadProgress());
    window.addEventListener('app:progress-updated', handleUpdate);
    return () => window.removeEventListener('app:progress-updated', handleUpdate);
  }, []);

  const overallPercent = calculateOverallProgress(progress, 24);

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #2457A7 0%, #183C72 100%)',
          borderRadius: 'var(--radius-lg)',
          padding: '2.5rem',
          color: '#ffffff',
          marginBottom: '2.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '2rem',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', alignItems: 'center', textAlign: 'center' }}>
          <BrandImage
            src={teacherData.avatar || '/assets/brand/teacher-placeholder.svg'}
            alt={teacherData.name}
            style={{ width: '175px', height: '218px', borderRadius: '22px', border: '4px solid #F0D38D', objectFit: 'cover', objectPosition: 'center 24%', boxShadow: '0 12px 32px rgba(0,0,0,.24)' }}
          />

          <div style={{ maxWidth: '700px' }}>
            <span className="badge" style={{ background: 'rgba(240, 211, 141, 0.18)', color: '#F0D38D', marginBottom: '0.75rem' }}>
              نتعلّم العربية بإبداع
            </span>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.75rem', lineHeight: 1.25 }}>
              {teacherData.name}
            </h1>
            <p style={{ fontSize: '1.1rem', color: '#94A3B8', lineHeight: 1.6 }}>
              {teacherData.bio}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/curriculum" className="btn-primary" style={{ padding: '0.8rem 1.8rem', fontSize: '1rem' }}>
              تصفح المناهج والدروس 📚
            </Link>
            <Link to="/grade-six/term-one" className="btn-secondary" style={{ padding: '0.8rem 1.8rem', fontSize: '1rem', background: '#F0D38D', color: '#183C72', borderColor: '#F0D38D' }}>
              منهج الصف السادس — الفصل الأول
            </Link>
            <Link to="/board" className="btn-secondary" style={{ padding: '0.8rem 1.8rem', fontSize: '1rem', background: 'rgba(255,255,255,0.1)', color: '#ffffff', borderColor: 'rgba(255,255,255,0.2)' }}>
              السبورة التفاعلية ✏️
            </Link>
          </div>
        </div>
      </section>

      {/* Progress & Quick Stats Card */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <D3CircularProgressChart percentage={overallPercent} size={110} />
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>إنجازك العام</h3>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem' }}>
              أكملت {progress.completedLessons.length} من أصل 24 درساً
            </p>
            <Link to="/profile" style={{ fontSize: '0.85rem', color: '#2563EB', fontWeight: 600, marginTop: '0.5rem', display: 'inline-block' }}>
              عرض تفاصيل التقدم ←
            </Link>
          </div>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>🏆</span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>الأوسمة والشارات</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            حصلت على {progress.badges.length} وساماً من إنجازاتك الدراسية.
          </p>
          <Link to="/profile" style={{ fontSize: '0.85rem', color: '#2563EB', fontWeight: 600, marginTop: '0.5rem', display: 'inline-block' }}>
            استعراض الأوسمة المكتسبة ←
          </Link>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>💡</span>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a' }}>البرامج والدورات</h3>
          </div>
          <p style={{ fontSize: '0.9rem', color: '#64748b' }}>
            اكتشف البرامج التدريبية المخصصة والمراجعات النهائية المكثفة.
          </p>
          <Link to="/programs" style={{ fontSize: '0.85rem', color: '#2563EB', fontWeight: 600, marginTop: '0.5rem', display: 'inline-block' }}>
            استعراض الباقات والاشتراكات ←
          </Link>
        </div>
      </section>

      {/* Levels Overview */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a' }}>المستويات التعليمية</h2>
          <Link to="/curriculum" style={{ color: '#2563EB', fontWeight: 600, fontSize: '0.95rem' }}>
            عرض الفهرس الكامل ←
          </Link>
        </div>

        <div className="curriculum-grid">
          {curriculumData.levels.map((level) => (
            <div key={level.id} className="level-card">
              <BrandImage src={level.coverImage} alt={level.title} className="level-cover-img" />
              <div style={{ padding: '1.25rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
                  {level.title}
                </h3>
                <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1rem' }}>
                  يتضمن وحدات تعليمية متدرجة، شروحات فيديو، تقويمات ذاتية، وبوكليت.
                </p>
                <Link to="/curriculum" className="btn-secondary" style={{ width: '100%', boxSizing: 'border-box' }}>
                  دخول المستوى
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
