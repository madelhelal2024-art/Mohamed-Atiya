import { useState } from 'react';
import { treasureQuestions } from '../data/grade-six-lesson-interactions';

export function GradeSixTreasureAssistant() {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(0);
  const matching = treasureQuestions
    .map((item, index) => ({ item, index }))
    .filter(({ item }) => `${item.prompt} ${item.explanation}`.includes(query.trim()));

  return (
    <section className="treasure-learning" aria-labelledby="treasure-assistant-title">
      <header className="treasure-learning__intro">
        <h2 id="treasure-assistant-title">اسألني وأنا هشرح لك</h2>
        <p>ابحث في أسئلة الدرس أو اختر سؤالك لعرض شرح مبسّط وخلاصة للحفظ.</p>
        <p className="treasure-note">هذا مساعد تعليمي بإجابات مُعدّة مسبقًا من محتوى الدرس، وليس محادثة ذكاء اصطناعي مباشرة.</p>
      </header>
      <label className="treasure-search">
        <span>ابحث عن سؤال</span>
        <input type="search" value={query} onChange={(event) => { setQuery(event.target.value); setSelectedIndex(null); }} placeholder="مثل: التأجيل، الوقت، أسامة..." />
      </label>
      <div className="treasure-faq">
        {matching.length === 0 && <p className="treasure-card">لم أجد سؤالًا بهذه الكلمات. جرّب كلمة أقصر مثل «الوقت» أو «تنظيم».</p>}
        {matching.map(({ item, index }) => (
          <div key={item.prompt} className="treasure-faq__item">
            <button
              type="button"
              aria-expanded={selectedIndex === index}
              onClick={() => setSelectedIndex((old) => old === index ? null : index)}
            >
              <span>{item.prompt}</span><span aria-hidden="true">{selectedIndex === index ? '−' : '+'}</span>
            </button>
            {selectedIndex === index && (
              <div className="treasure-faq__answer">
                <p>{item.explanation}</p>
                <p><strong>الخلاصة:</strong> {item.keyTakeaway}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
