import React, { useState } from 'react';

interface GuidedAssistantItem {
  prompt: string;
  explanation: string;
  keyTakeaway?: string;
}

interface GuidedLessonAssistantProps {
  items: GuidedAssistantItem[];
}

export const GuidedLessonAssistant: React.FC<GuidedLessonAssistantProps> = ({ items = [] }) => {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(items.length > 0 ? 0 : null);

  if (!items || items.length === 0) {
    return (
      <div className="assistant-box" style={{ textAlign: 'center', color: '#166534' }}>
        <p style={{ fontWeight: 600 }}>المساعد الموجّه جاهز</p>
        <p style={{ fontSize: '0.9rem', color: '#4b5563', marginTop: '0.5rem' }}>
          قسم «اسألني وأنا هشرح لك» يعمل بمحتوى معدّ مسبقًا، وسيتم تزويده بالأسئلة التوضيحية قريبًا.
        </p>
      </div>
    );
  }

  return (
    <div className="assistant-box">
      <div style={{ marginBottom: '1rem' }}>
        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>💡</span>
          <span>اسألني وأنا هشرح لك (المساعد الموجّه)</span>
        </h4>
        <p style={{ fontSize: '0.85rem', color: '#475569' }}>
          اختر أحد الأسئلة الشائعة لعرض الشرح التوضيحي والخلاصة الذكية:
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {items.map((item, idx) => {
          const isOpen = selectedIdx === idx;
          return (
            <div key={idx} className="assistant-faq-item">
              <button
                type="button"
                onClick={() => setSelectedIdx(isOpen ? null : idx)}
                style={{
                  width: '100%',
                  textAlign: 'right',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: 700,
                  color: isOpen ? '#15803d' : '#1e293b',
                  fontSize: '0.95rem',
                }}
              >
                <span>{item.prompt}</span>
                <span style={{ fontSize: '1rem', color: '#16a34a' }}>{isOpen ? '▲' : '▼'}</span>
              </button>

              {isOpen && (
                <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px dashed #bbf7d0' }}>
                  <p className="assistant-explanation">{item.explanation}</p>
                  {item.keyTakeaway && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <span className="assistant-takeaway">خلاصة سريعة: {item.keyTakeaway}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
