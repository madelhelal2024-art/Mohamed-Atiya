import React, { useEffect, useState } from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { D3CircularProgressChart } from '../components/D3CircularProgressChart';
import { ThemeProgressLineChart } from '../components/ThemeProgressLineChart';
import { LearningBadges } from '../components/LearningBadges';
import { loadProgress, resetProgress, saveProgress } from '../lib/storage';
import { calculateOverallProgress, calculateUnitProgress } from '../lib/progress';
import { getCurriculum } from '../lib/content';
import templateSettings from '../data/template-settings.json';
import { UserProgress } from '../types/content';

export const LearningProfilePage: React.FC = () => {
  const [progress, setProgress] = useState<UserProgress>(loadProgress());
  const [surveyAnswers, setSurveyAnswers] = useState<Record<string, string>>(
    (progress.surveyAnswers as Record<string, string>) || {}
  );
  const [surveySaved, setSurveySaved] = useState<boolean>(false);

  useEffect(() => {
    const handleUpdate = () => setProgress(loadProgress());
    window.addEventListener('app:progress-updated', handleUpdate);
    return () => window.removeEventListener('app:progress-updated', handleUpdate);
  }, []);

  const curriculum = getCurriculum();
  const overallPercentage = calculateOverallProgress(progress, 24);

  // Compute progress for each of the 4 levels for Recharts
  const chartData = curriculum.levels.map((lvl) => {
    let lessonIds: string[] = [];
    for (const d of lvl.domains) {
      for (const u of d.units) {
        for (const l of u.lessons) {
          lessonIds.push(l.id);
        }
      }
    }
    const stats = calculateUnitProgress(progress, lessonIds);
    return {
      name: lvl.title.split(':')[0], // e.g. المستوى الأول
      completion: stats.percentage,
    };
  });

  const handleSurveyChange = (questionKey: string, val: string) => {
    const updated = { ...surveyAnswers, [questionKey]: val };
    setSurveyAnswers(updated);
    setSurveySaved(false);
  };

  const handleSaveSurvey = () => {
    const updatedProgress: UserProgress = {
      ...progress,
      surveyAnswers,
    };
    saveProgress(updatedProgress);
    setProgress(updatedProgress);
    setSurveySaved(true);
    setTimeout(() => setSurveySaved(false), 3000);
  };

  const handleReset = () => {
    if (window.confirm('هل أنت متأكد من رغبتك في إعادة ضبط كامل تقدمك الدراسي؟')) {
      resetProgress();
      setProgress(loadProgress());
      setSurveyAnswers({});
    }
  };

  return (
    <div>
      <Breadcrumbs items={[{ label: 'الملف والتقدم التعليمي' }]} />

      {/* Header Profile Card */}
      <div className="profile-header-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
          <D3CircularProgressChart percentage={overallPercentage} size={130} />
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#0f172a' }}>
              لوحة الإنجاز والملف التعليمي
            </h1>
            <p style={{ color: '#64748b', marginTop: '0.25rem' }}>
              متابعة الإنجاز الدراسي الشخصي، إحصائيات الدروس المكتملة، وشارات التميز.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div className="stat-box">
            <div className="stat-value">{progress.completedLessons.length}</div>
            <div className="stat-label">دروس مكتملة</div>
          </div>
          <div className="stat-box">
            <div className="stat-value" style={{ color: '#F59E0B' }}>{progress.badges.length}</div>
            <div className="stat-label">أوسمة مكتسبة</div>
          </div>
          <div className="stat-box">
            <div className="stat-value" style={{ color: '#10B981' }}>{overallPercentage}%</div>
            <div className="stat-label">معدل الإنجاز</div>
          </div>
        </div>
      </div>

      {/* Level Breakdown Chart */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '1.5rem' }}>
          معدل إنجاز المستويات الدراسية
        </h3>
        <ThemeProgressLineChart data={chartData} />
      </div>

      {/* Badges Section */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <LearningBadges unlockedBadgeIds={progress.badges} />
      </div>

      {/* Reflective Questionnaire / Self-Assessment Survey */}
      <div className="card" style={{ marginBottom: '2.5rem' }}>
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>
            استبيان التأمل الذاتي لأسلوب التعلم 📝
          </h3>
          <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '0.25rem' }}>
            أجب عن الأسئلة التالية لتحديد أسلوب التعلم الأمثل وتنظيم خطتك الدراسية.
          </p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>
              1. ما هي وسيلة الشرح الأكثر فائدة لك أثناء مذاكرة الدرس؟
            </label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {['فيديو الشرح التفاعلي', 'الملخص والخرائط الذهنية', 'المذكرة والبوكليت', 'حل التمارين والتقويم'].map((opt) => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem' }}>
                  <input
                    type="radio"
                    name="q1"
                    checked={surveyAnswers.q1 === opt}
                    onChange={() => handleSurveyChange('q1', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>
              2. كم ساعة تفضل تخصيصها للمذاكرة والمراجعة أسبوعياً؟
            </label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {['أقل من 3 ساعات', 'من 3 إلى 5 ساعات', 'من 6 إلى 10 ساعات', 'أكثر من 10 ساعات'].map((opt) => (
                <label key={opt} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.95rem' }}>
                  <input
                    type="radio"
                    name="q2"
                    checked={surveyAnswers.q2 === opt}
                    onChange={() => handleSurveyChange('q2', opt)}
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, color: '#334155', marginBottom: '0.5rem' }}>
              3. ملاحظاتك وأهدافك الشخصية لهذا الفصل:
            </label>
            <textarea
              rows={3}
              value={surveyAnswers.notes || ''}
              onChange={(e) => handleSurveyChange('notes', e.target.value)}
              placeholder="اكتب أهدافك أو أي ملاحظات ترغب في الرجوع إليها..."
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '8px',
                border: '1px solid #cbd5e1',
                fontFamily: 'inherit',
                fontSize: '0.95rem',
                boxSizing: 'border-box',
                direction: 'rtl',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button type="button" onClick={handleSaveSurvey} className="btn-primary">
              حفظ إجابات الاستبيان
            </button>
            {surveySaved && (
              <span style={{ color: '#16a34a', fontWeight: 600, fontSize: '0.9rem' }}>
                ✓ تم حفظ الإجابات محلياً بنجاح
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Reset Progress Option */}
      {templateSettings.allowReset && (
        <div style={{ textAlign: 'left', padding: '1rem 0' }}>
          <button
            type="button"
            onClick={handleReset}
            style={{
              color: '#dc2626',
              border: '1px solid #fecaca',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#fef2f2',
              fontSize: '0.85rem',
              fontWeight: 600,
            }}
          >
            إعادة ضبط التقدم ومسح البيانات المحلية 🔄
          </button>
        </div>
      )}
    </div>
  );
};
