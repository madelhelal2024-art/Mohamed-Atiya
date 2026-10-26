import { useState } from 'react';
import { treasureQuiz } from '../data/grade-six-lesson-interactions';

export function GradeSixTreasureQuiz() {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const answeredCount = treasureQuiz.filter((question) => answers[question.id] !== undefined).length;
  const score = treasureQuiz.filter((question) => answers[question.id] === question.correct).length;

  return (
    <section className="treasure-learning" aria-labelledby="treasure-quiz-title">
      <header className="treasure-learning__intro">
        <h2 id="treasure-quiz-title">اختبر فهمك للدرس</h2>
        <p>١٠ أسئلة متنوعة في الفكرة الرئيسة والمفردات وتنظيم الوقت. تظهر النتيجة والتفسير بعد الإجابة عن جميع الأسئلة.</p>
        <p className="treasure-count">أجبت عن {answeredCount} من {treasureQuiz.length} أسئلة</p>
      </header>
      {treasureQuiz.map((question, index) => (
        <fieldset className="treasure-card treasure-question" key={question.id}>
          <legend>{index + 1}. {question.prompt}</legend>
          <div className="treasure-options">
            {question.options.map((option, optionIndex) => (
              <label key={option}>
                <input
                  type="radio"
                  name={`treasure-quiz-${question.id}`}
                  value={optionIndex}
                  checked={answers[question.id] === optionIndex}
                  disabled={submitted}
                  onChange={() => setAnswers((previous) => ({ ...previous, [question.id]: optionIndex }))}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
          {submitted && (
            <p className={`treasure-feedback ${answers[question.id] === question.correct ? 'treasure-correct' : 'treasure-incorrect'}`}>
              {answers[question.id] === question.correct ? '✓ إجابة صحيحة. ' : `✕ الإجابة الصحيحة: ${question.options[question.correct]}. `}
              {question.explanation}
            </p>
          )}
        </fieldset>
      ))}
      {submitted ? (
        <div className="treasure-quiz-result" role="status">
          <strong>نتيجتك: {score} من {treasureQuiz.length}</strong>
          <p>{score === treasureQuiz.length ? 'أحسنت! أتقنت أسئلة المراجعة.' : 'اقرأ تفسير الإجابات ثم أعد المحاولة لتحسين نتيجتك.'}</p>
          <button className="treasure-button" type="button" onClick={() => { setAnswers({}); setSubmitted(false); }}>أعد المحاولة</button>
        </div>
      ) : (
        <button className="treasure-button" type="button" disabled={answeredCount < treasureQuiz.length} onClick={() => setSubmitted(true)}>
          {answeredCount < treasureQuiz.length ? `أكمل ${treasureQuiz.length - answeredCount} أسئلة لإظهار النتيجة` : 'صحّح إجاباتي'}
        </button>
      )}
      <p className="treasure-note">هذه أسئلة تدريبية للتعلّم، وليست نتيجة امتحان رسمي.</p>
    </section>
  );
}
