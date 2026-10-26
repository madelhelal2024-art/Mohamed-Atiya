import { useState } from 'react';
import { treasureExam, treasureHomework } from '../data/grade-six-lesson-interactions';

export function GradeSixTreasureHomework() {
  const [finished, setFinished] = useState<Record<number, boolean>>({});
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const completed = treasureHomework.filter((_, index) => finished[index]).length;
  const totalMarks = treasureExam.reduce((sum, task) => sum + task.marks, 0);

  return (
    <section className="treasure-learning" aria-labelledby="treasure-homework-title">
      <header className="treasure-learning__intro">
        <h2 id="treasure-homework-title">الواجبات والاختبارات</h2>
        <p>أنجز أنشطة الواجب أولًا، ثم جرّب الاختبار الختامي بنفسك. يمكنك مقارنة إجابتك بنموذج إرشادي بعد الكتابة.</p>
      </header>

      <section className="treasure-card" aria-labelledby="treasure-homework-list-title">
        <h3 id="treasure-homework-list-title">واجب عملي من تدريبات الدرس</h3>
        <p className="treasure-count">أنجزت {completed} من {treasureHomework.length} مهام</p>
        <div className="treasure-homework-list">
          {treasureHomework.map((item, index) => (
            <label key={item} className="treasure-homework-item">
              <input type="checkbox" checked={Boolean(finished[index])} onChange={(event) => setFinished((old) => ({ ...old, [index]: event.target.checked }))} />
              <span>{item}</span>
            </label>
          ))}
        </div>
        <p className="treasure-note">علامات الإنجاز هنا للمتابعة الشخصية داخل الصفحة، ولا ترسل الواجب إلى المعلم.</p>
      </section>

      <section aria-labelledby="treasure-exam-title">
        <div className="treasure-exam-heading">
          <h3 id="treasure-exam-title">اختبار ختامي — {totalMarks} درجة</h3>
          <p>زمن مقترح: ٢٠ دقيقة. الأسئلة مفتوحة؛ لا تُحتسب لها درجة آلية لأن صياغات صحيحة مختلفة قد تُقبَل.</p>
        </div>
        {treasureExam.map((task, index) => (
          <div className="treasure-card treasure-exam-item" key={task.id}>
            <label htmlFor={`treasure-answer-${task.id}`}><strong>{index + 1}. {task.prompt}</strong> <span>({task.marks} درجات)</span></label>
            <textarea
              id={`treasure-answer-${task.id}`}
              rows={3}
              placeholder="اكتب إجابتك هنا قبل عرض النموذج..."
              value={responses[task.id] ?? ''}
              onChange={(event) => setResponses((old) => ({ ...old, [task.id]: event.target.value }))}
            />
            <button className="treasure-button treasure-button--subtle" type="button" onClick={() => setRevealed((old) => ({ ...old, [task.id]: !old[task.id] }))}>
              {revealed[task.id] ? 'إخفاء نموذج الإجابة' : 'اعرض نموذج الإجابة للمقارنة'}
            </button>
            {revealed[task.id] && <p className="treasure-model-answer"><strong>نموذج إرشادي:</strong> {task.model}</p>}
          </div>
        ))}
        <p className="treasure-note">في أسئلة الفهم والتعبير، تُقبل الإجابة المختلفة إذا كانت صحيحة ومصحوبة بدليل أو سبب مناسب. لن تُحفَظ الإجابات المكتوبة بعد تحديث الصفحة.</p>
      </section>
    </section>
  );
}
