import { useState } from 'react';
import { treasurePlanningSteps, treasureScenarios, treasureVocabulary } from '../data/grade-six-lesson-interactions';

const initialOrder = [2, 0, 4, 1, 3];
const availableMeanings = [...treasureVocabulary.map((item) => item.meaning)].sort((a, b) => a.localeCompare(b, 'ar'));

export function GradeSixTreasureActivities() {
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [checkedMatches, setCheckedMatches] = useState(false);
  const [order, setOrder] = useState<number[]>(initialOrder);
  const [checkedOrder, setCheckedOrder] = useState(false);
  const [scenarios, setScenarios] = useState<Record<number, string>>({});
  const [checkedScenarios, setCheckedScenarios] = useState(false);

  const matchScore = treasureVocabulary.filter((item) => matches[item.word] === item.meaning).length;
  const orderCorrect = order.every((index, position) => index === position);
  const scenarioScore = treasureScenarios.filter((item, index) => scenarios[index] === item.correct).length;

  function moveStep(position: number, change: number) {
    const other = position + change;
    if (other < 0 || other >= order.length) return;
    setOrder((previous) => {
      const next = [...previous];
      [next[position], next[other]] = [next[other], next[position]];
      return next;
    });
    setCheckedOrder(false);
  }

  return (
    <div className="treasure-learning" aria-label="أنشطة تطبيقية تفاعلية">
      <header className="treasure-learning__intro">
        <h2>طبّق ما تعلّمته</h2>
        <p>ثلاث أنشطة قصيرة من مفردات الدرس وفكرته، ويمكنك المحاولة من جديد حتى تتقنها.</p>
      </header>

      <section className="treasure-card" aria-labelledby="treasure-match-title">
        <h3 id="treasure-match-title">١. صِل الكلمة بمعناها</h3>
        <p>اختر المعنى المناسب لكل كلمة.</p>
        <div className="treasure-match-grid">
          {treasureVocabulary.map((item) => (
            <label key={item.word} className="treasure-match-row">
              <strong>{item.word}</strong>
              <select
                aria-label={`معنى ${item.word}`}
                value={matches[item.word] ?? ''}
                onChange={(event) => { setMatches((previous) => ({ ...previous, [item.word]: event.target.value })); setCheckedMatches(false); }}
              >
                <option value="">اختر المعنى</option>
                {availableMeanings.map((meaning) => <option value={meaning} key={meaning}>{meaning}</option>)}
              </select>
              {checkedMatches && (
                <span className={matches[item.word] === item.meaning ? 'treasure-correct' : 'treasure-incorrect'}>
                  {matches[item.word] === item.meaning ? '✓ صحيح' : `الصواب: ${item.meaning}`}
                </span>
              )}
            </label>
          ))}
        </div>
        <button className="treasure-button" type="button" onClick={() => setCheckedMatches(true)}>تحقّق من المعاني</button>
        {checkedMatches && <p className="treasure-feedback" role="status">أجبت إجابة صحيحة عن {matchScore} من {treasureVocabulary.length} كلمات.</p>}
      </section>

      <section className="treasure-card" aria-labelledby="treasure-order-title">
        <h3 id="treasure-order-title">٢. رتّب خطوات تنظيم الوقت</h3>
        <p>حرّك كل خطوة للأعلى أو للأسفل حتى يصبح الترتيب صحيحًا.</p>
        <ol className="treasure-steps">
          {order.map((stepIndex, position) => (
            <li key={stepIndex}>
              <span>{treasurePlanningSteps[stepIndex]}</span>
              <div className="treasure-step-controls">
                <button type="button" aria-label={`حرّك ${treasurePlanningSteps[stepIndex]} للأعلى`} disabled={position === 0} onClick={() => moveStep(position, -1)}>↑</button>
                <button type="button" aria-label={`حرّك ${treasurePlanningSteps[stepIndex]} للأسفل`} disabled={position === order.length - 1} onClick={() => moveStep(position, 1)}>↓</button>
              </div>
            </li>
          ))}
        </ol>
        <button className="treasure-button" type="button" onClick={() => setCheckedOrder(true)}>تحقّق من الترتيب</button>
        {checkedOrder && (
          <p className={`treasure-feedback ${orderCorrect ? 'treasure-correct' : 'treasure-incorrect'}`} role="status">
            {orderCorrect ? 'ممتاز! رتّبت الخطوات الخمس ترتيبًا صحيحًا.' : 'حاول مرة أخرى. ابدأ بتحديد المهام، وانتهِ بمراجعة الإنجازات.'}
          </p>
        )}
      </section>

      <section className="treasure-card" aria-labelledby="treasure-scenarios-title">
        <h3 id="treasure-scenarios-title">٣. أصنّف المواقف</h3>
        <p>هل يدل الموقف على تخطيط، أم تأجيل، أم تشتّت؟</p>
        {treasureScenarios.map((item, index) => (
          <label key={item.text} className="treasure-scenario">
            <span>{item.text}</span>
            <select
              aria-label={`تصنيف الموقف ${index + 1}`}
              value={scenarios[index] ?? ''}
              onChange={(event) => { setScenarios((previous) => ({ ...previous, [index]: event.target.value })); setCheckedScenarios(false); }}
            >
              <option value="">اختر التصنيف</option>
              <option value="تخطيط">تخطيط</option>
              <option value="تأجيل">تأجيل</option>
              <option value="تشتّت">تشتّت</option>
            </select>
            {checkedScenarios && <span className={scenarios[index] === item.correct ? 'treasure-correct' : 'treasure-incorrect'}>{scenarios[index] === item.correct ? '✓ صحيح' : `الصواب: ${item.correct}`}</span>}
          </label>
        ))}
        <button className="treasure-button" type="button" onClick={() => setCheckedScenarios(true)}>تحقّق من المواقف</button>
        {checkedScenarios && <p className="treasure-feedback" role="status">أجبت إجابة صحيحة عن {scenarioScore} من {treasureScenarios.length} مواقف.</p>}
      </section>
    </div>
  );
}
