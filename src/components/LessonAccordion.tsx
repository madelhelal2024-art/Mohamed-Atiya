import React, { useState } from 'react';
import { LessonData } from '../types/content';
import { EMPTY_STATE_MESSAGES, SECTION_NAMES, SectionKey } from '../lib/ui-copy';
import { SectionCheckButton } from './SectionCheckButton';
import { getYouTubeEmbedUrl } from '../lib/youtube';
import { GuidedLessonAssistant } from './GuidedLessonAssistant';
import { BookletViewer } from './BookletViewer';
import { SafeExternalLink } from './SafeExternalLink';

interface LessonAccordionProps {
  lesson: LessonData;
  completedSectionKeys: string[];
  onToggleSection: (sectionKey: string) => void;
  onQuizScore?: (scorePercent: number) => void;
}

export const LessonAccordion: React.FC<LessonAccordionProps> = ({
  lesson,
  completedSectionKeys = [],
  onToggleSection,
  onQuizScore,
}) => {
  const [openSection, setOpenSection] = useState<string>('keyPoints');
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const completedSet = new Set(completedSectionKeys);

  const toggleAccordion = (key: string) => {
    setOpenSection((prev) => (prev === key ? '' : key));
  };

  const handleSelectQuizOption = (questionId: string, optionIndex: number) => {
    if (quizSubmitted) return;
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionIndex }));
  };

  const handleSubmitQuiz = () => {
    if (quizSubmitted || !lesson.quiz || lesson.quiz.length === 0) return;
    let correctCount = 0;
    lesson.quiz.forEach((q) => {
      if (quizAnswers[q.id] === q.correctAnswer) {
        correctCount++;
      }
    });
    const scorePercent = Math.round((correctCount / lesson.quiz.length) * 100);
    setQuizSubmitted(true);
    onQuizScore?.(scorePercent);
    if (!completedSet.has('quiz')) {
      onToggleSection('quiz');
    }
  };

  const renderSectionContent = (key: SectionKey) => {
    switch (key) {
      case 'keyPoints':
        if (!lesson.keyPoints || lesson.keyPoints.length === 0) {
          return <p style={{ color: '#64748b' }}>{EMPTY_STATE_MESSAGES.keyPoints}</p>;
        }
        return (
          <ul style={{ paddingRight: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {lesson.keyPoints.map((pt, i) => (
              <li key={i} style={{ color: '#334155', fontWeight: 500 }}>{pt}</li>
            ))}
          </ul>
        );

      case 'summary':
        return (
          <div>
            <p style={{ color: '#334155', whiteSpace: 'pre-line', lineHeight: '1.8' }}>
              {lesson.summary || EMPTY_STATE_MESSAGES.summary}
            </p>
          </div>
        );

      case 'video': {
        const embedUrl = getYouTubeEmbedUrl(lesson.video?.url);
        return (
          <div>
            {embedUrl ? (
              <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', borderRadius: '12px' }}>
                <iframe
                  src={embedUrl}
                  title={lesson.video.title || 'فيديو الدرس'}
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            ) : (
              <p style={{ color: '#64748b' }}>{EMPTY_STATE_MESSAGES.video}</p>
            )}
            <div style={{ marginTop: '0.75rem', fontSize: '0.9rem', color: '#64748b' }}>
              {lesson.video?.title} ({lesson.video?.durationMinutes} دقيقة)
            </div>
          </div>
        );
      }

      case 'activities':
        if (!lesson.activities || lesson.activities.length === 0) {
          return <p style={{ color: '#64748b' }}>{EMPTY_STATE_MESSAGES.activities}</p>;
        }
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {lesson.activities.map((act, i) => (
              <div key={i} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1rem' }}>
                <h5 style={{ fontWeight: 700, color: '#1e293b', marginBottom: '0.25rem' }}>{act.title}</h5>
                <p style={{ fontSize: '0.95rem', color: '#475569' }}>{act.description}</p>
                {act.materials && act.materials.length > 0 && (
                  <div style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    {act.materials.map((m, mi) => (
                      <span key={mi} className="badge" style={{ background: '#f1f5f9', color: '#64748b', fontSize: '0.75rem' }}>
                        {m}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        );

      case 'quiz': {
        if (!lesson.quiz || lesson.quiz.length === 0) {
          return <p style={{ color: '#64748b' }}>{EMPTY_STATE_MESSAGES.quiz}</p>;
        }
        return (
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {lesson.quiz.map((q, qIndex) => {
                const selectedOpt = quizAnswers[q.id];
                return (
                  <div key={q.id} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '1.25rem' }}>
                    <p style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.75rem' }}>
                      {qIndex + 1}. {q.question}
                    </p>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {q.options.map((opt, optIndex) => {
                        const isSelected = selectedOpt === optIndex;
                        const isCorrect = q.correctAnswer === optIndex;
                        let optBg = '#f8fafc';
                        let optColor = '#334155';
                        let optBorder = '#e2e8f0';

                        if (quizSubmitted) {
                          if (isCorrect) {
                            optBg = '#dcfce7';
                            optColor = '#15803d';
                            optBorder = '#86efac';
                          } else if (isSelected && !isCorrect) {
                            optBg = '#fee2e2';
                            optColor = '#b91c1c';
                            optBorder = '#fca5a5';
                          }
                        } else if (isSelected) {
                          optBg = '#eff6ff';
                          optColor = '#1d4ed8';
                          optBorder = '#93c5fd';
                        }

                        return (
                          <button
                            key={optIndex}
                            type="button"
                            onClick={() => handleSelectQuizOption(q.id, optIndex)}
                            style={{
                              textAlign: 'right',
                              padding: '0.75rem 1rem',
                              borderRadius: '8px',
                              background: optBg,
                              color: optColor,
                              border: `1px solid ${optBorder}`,
                              fontWeight: 500,
                              cursor: quizSubmitted ? 'default' : 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                            }}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && <span style={{ fontWeight: 'bold' }}>✓</span>}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && q.explanation && (
                      <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: '#f8fafc', borderRadius: '8px', fontSize: '0.85rem', color: '#475569' }}>
                        💡 <strong>التوضيح:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!quizSubmitted ? (
              <div style={{ marginTop: '1.25rem' }}>
                <button
                  type="button"
                  className="btn-primary"
                  onClick={handleSubmitQuiz}
                  disabled={Object.keys(quizAnswers).length < lesson.quiz.length}
                  style={{
                    opacity: Object.keys(quizAnswers).length < lesson.quiz.length ? 0.6 : 1,
                  }}
                >
                  تأكيد الإجابات واعتماد النتيجة
                </button>
              </div>
            ) : (
              <div style={{ marginTop: '1.25rem', padding: '1rem', background: '#dcfce7', borderRadius: '8px', color: '#15803d', fontWeight: 600 }}>
                تم اعتماد نتيجة الاختبار وحفظها في ملفك التعليمي!
              </div>
            )}
          </div>
        );
      }

      case 'booklet':
        return (
          <BookletViewer
            title={lesson.booklet?.title || 'مذكرة الدرس'}
            url={lesson.booklet?.url || '#'}
            totalPages={lesson.booklet?.totalPages}
            description={lesson.booklet?.description}
          />
        );

      case 'presentation':
        return (
          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h5 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              {lesson.presentation?.title || 'شرائح العرض التقديمي'}
            </h5>
            <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '1rem' }}>
              شرائح تقديمية مخصصة لشرح الدرس بالفصل أو الاستعراض الذاتي.
            </p>
            <SafeExternalLink href={lesson.presentation?.url || '#'} className="btn-secondary">
              استعراض العرض التقديمي 📽️
            </SafeExternalLink>
          </div>
        );

      case 'assistant':
        return <GuidedLessonAssistant items={lesson.assistant || []} />;

      case 'homework':
        if (!lesson.homework || !lesson.homework.tasks || lesson.homework.tasks.length === 0) {
          return <p style={{ color: '#64748b' }}>{EMPTY_STATE_MESSAGES.homework}</p>;
        }
        return (
          <div style={{ background: '#ffffff', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h5 style={{ fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              {lesson.homework.title}
            </h5>
            <p style={{ color: '#475569', marginBottom: '1rem' }}>{lesson.homework.description}</p>
            <ol style={{ paddingRight: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {lesson.homework.tasks.map((task, i) => (
                <li key={i} style={{ color: '#334155' }}>{task}</li>
              ))}
            </ol>
          </div>
        );

      default:
        return null;
    }
  };

  const sectionKeysList: SectionKey[] = [
    'keyPoints',
    'summary',
    'video',
    'activities',
    'quiz',
    'booklet',
    'presentation',
    'assistant',
    'homework',
  ];

  return (
    <div className="lesson-sections-container">
      {sectionKeysList.map((key, idx) => {
        const isOpen = openSection === key;
        const isCompleted = completedSet.has(key);
        const name = SECTION_NAMES[key];

        return (
          <div key={key} className={`section-card ${isCompleted ? 'completed' : ''}`}>
            <div
              className="section-header-btn"
              onClick={() => toggleAccordion(key)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    background: isCompleted ? '#dcfce7' : '#f1f5f9',
                    color: isCompleted ? '#16a34a' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                  }}
                >
                  {idx + 1}
                </span>
                <span>{name}</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <SectionCheckButton
                  completed={isCompleted}
                  onToggle={() => onToggleSection(key)}
                />
                <span style={{ color: '#94a3b8', fontSize: '0.85rem' }}>
                  {isOpen ? '▲' : '▼'}
                </span>
              </div>
            </div>

            {isOpen && (
              <div className="section-body">
                {renderSectionContent(key)}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
