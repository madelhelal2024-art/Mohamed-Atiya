import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
const scale = [1, 2, 3, 4, 5] as const;
type Question = {
    id: number;
    text: string;
};
type ScoreItem = {
    key: string;
    label: string;
    score: number;
};
const questions: Question[] = [
    { id: 1, text: 'أستطيع التعبير عن أفكاري بالكلام أو الكتابة بسهولة.' },
    { id: 2, text: 'أتذكر الكلمات والمعاني والمعلومات المكتوبة بصورة جيدة.' },
    { id: 3, text: 'أحب حل المسائل والألغاز واكتشاف العلاقات بين الأشياء.' },
    { id: 4, text: 'أحب ترتيب المعلومات في خطوات ومقارنة الأشياء ببعضها.' },
    { id: 5, text: 'أفهم المعلومة أسرع عندما أراها في صورة أو خريطة أو رسم.' },
    { id: 6, text: 'أتذكر الأشكال والأماكن والصور والتفاصيل البصرية بسهولة.' },
    { id: 7, text: 'أحب أن أتعلم عن طريق الحركة والتجربة والعمل بيدي.' },
    { id: 8, text: 'أفهم المهمة بشكل أفضل عندما أجرب تنفيذها بنفسي.' },
    { id: 9, text: 'أنتبه بسهولة إلى الأصوات والإيقاع والنغم.' },
    { id: 10, text: 'يسهل عليّ تذكر بعض المعلومات عندما أربطها بصوت أو إيقاع.' },
    { id: 11, text: 'أفهم مشاعر الآخرين وأستطيع العمل معهم بصورة جيدة.' },
    { id: 12, text: 'أستمتع بشرح ما تعلمته لزميل أو مساعدته على الفهم.' },
    { id: 13, text: 'أعرف الأشياء التي أجيدها والأشياء التي أحتاج إلى تحسينها.' },
    { id: 14, text: 'أستطيع أن أضع لنفسي هدفًا وأتابع تقدمي فيه.' },
    { id: 15, text: 'أحب ملاحظة الحيوانات والنباتات والبيئة وتصنيف الأشياء من حولي.' },
    { id: 16, text: 'أفهم بعض الأفكار بصورة أفضل عندما أربطها بالطبيعة والحياة من حولي.' },
    { id: 17, text: 'الصور والإنفوجرافيك والخرائط تساعدني كثيرًا على الفهم.' },
    { id: 18, text: 'الاستماع إلى الشرح والحوار يساعدني كثيرًا على الفهم.' },
    { id: 19, text: 'القراءة وكتابة الملاحظات بنفسي تساعدني على التعلم.' },
    { id: 20, text: 'الألعاب والتجارب والأنشطة العملية تجعلني أفهم بصورة أفضل.' },
    { id: 21, text: 'المناقشة والعمل مع زملائي يساعدانني على اكتشاف أفكار جديدة.' },
    { id: 22, text: 'أحيانًا أفهم وأركز أكثر عندما أتعلم وحدي في مكان هادئ.' },
    { id: 23, text: 'أستطيع التركيز على مهمة تعليمية حتى أنهي جزءًا واضحًا منها.' },
    { id: 24, text: 'عندما أتعلم معلومة جديدة أحاول ربطها بشيء أعرفه من قبل.' },
    { id: 25, text: 'إذا لم أفهم بطريقة معينة، أجرب طريقة أخرى مثل صورة أو مثال أو سؤال أو تجربة.' },
    { id: 26, text: 'بعد انتهاء الدرس أستطيع تحديد ما فهمته وما الذي أحتاج إلى مراجعته.' },
    { id: 27, text: 'أحب طرح الأسئلة والبحث عندما أقابل شيئًا لا أعرفه.' },
    { id: 28, text: 'عندما يكون السؤال صعبًا أحاول أكثر من مرة قبل أن أتركه.' },
    { id: 29, text: 'أستطيع البدء في واجبي أو مهمتي دون الحاجة إلى تذكير مستمر.' },
    { id: 30, text: 'عندما أخطئ أحاول معرفة سبب الخطأ واستخدامه لتحسين إجابتي التالية.' },
];
const intelligenceGroups = [
    { key: 'linguistic', label: 'القدرة اللغوية', ids: [1, 2] },
    { key: 'logical', label: 'القدرة المنطقية', ids: [3, 4] },
    { key: 'visual', label: 'القدرة البصرية المكانية', ids: [5, 6] },
    { key: 'kinesthetic', label: 'التعلم الحركي والتجريبي', ids: [7, 8] },
    { key: 'musical', label: 'الحس السمعي والإيقاعي', ids: [9, 10] },
    { key: 'social', label: 'التعلم الاجتماعي', ids: [11, 12] },
    { key: 'intrapersonal', label: 'معرفة الذات', ids: [13, 14] },
    { key: 'naturalistic', label: 'الربط بالطبيعة والتصنيف', ids: [15, 16] },
];
const learningPreferences = [
    { key: 'visual', label: 'التعلم البصري', ids: [17] },
    { key: 'auditory', label: 'الاستماع والحوار', ids: [18] },
    { key: 'readwrite', label: 'القراءة والكتابة', ids: [19] },
    { key: 'practice', label: 'التعلم العملي والتجريبي', ids: [20] },
    { key: 'collaborative', label: 'التعلم التعاوني', ids: [21] },
    { key: 'solo', label: 'التعلم الفردي الهادئ', ids: [22] },
];
const studySkills = [
    { key: 'focus', label: 'التركيز وإنهاء المهمة', ids: [23] },
    { key: 'connection', label: 'ربط الجديد بما تعرفه', ids: [24] },
    { key: 'flexibility', label: 'المرونة وتغيير طريقة التعلم', ids: [25] },
    { key: 'metacognition', label: 'مراجعة فهمك بنفسك', ids: [26] },
];
const habits = [
    { key: 'curiosity', label: 'الفضول وطرح الأسئلة', ids: [27] },
    { key: 'persistence', label: 'المثابرة أمام الصعوبة', ids: [28] },
    { key: 'independence', label: 'الاستقلالية وبدء المهمة', ids: [29] },
    { key: 'errorlearning', label: 'التعلم من الخطأ', ids: [30] },
];
const preferenceAdvice: Record<string, string[]> = {
    visual: ['حوّل الدرس إلى خريطة أو رسم.', 'استخدم لونين أو ثلاثة لتمييز العلاقات.', 'ارسم الفكرة من الذاكرة بعد مشاهدتها.'],
    auditory: ['اشرح الفكرة بصوتك.', 'اسمع جزءًا قصيرًا ثم لخّصه.', 'حوّل النقاط إلى أسئلة وأجب بصوت مرتفع.'],
    readwrite: ['اكتب ملخصًا بلغتك.', 'حوّل العناوين إلى أسئلة.', 'استخدم بطاقات سؤال وجواب.'],
    practice: ['ابدأ بمثال أو تجربة.', 'طبّق القاعدة على مثال جديد.', 'اجعل كل جلسة تنتهي بمهمة عملية.'],
    collaborative: ['اشرح لزميل بعد أن تحاول وحدك.', 'ناقش سؤالًا صعبًا.', 'استخدم: أشرح — اسأل — أصحح.'],
    solo: ['خصص جلسات هادئة قصيرة.', 'اكتب هدف الجلسة.', 'راجع نفسك ثم اطلب المساعدة فيما تعثر.'],
};
function scoreGroups(groups: Array<{
    key: string;
    label: string;
    ids: number[];
}>, answers: Record<number, number>): ScoreItem[] {
    return groups.map((group) => ({
        key: group.key,
        label: group.label,
        score: group.ids.reduce((sum, id) => sum + (answers[id] ?? 0), 0) / group.ids.length,
    })).sort((a, b) => b.score - a.score);
}
function scoreLabel(score: number) {
    if (score >= 4)
        return 'نقطة قوة واضحة';
    if (score >= 3)
        return 'مستوى جيد قابل للتطوير';
    return 'مساحة مناسبة للتدريب';
}
const emoji: Record<string, string> = { linguistic: '📝', logical: '🧩', visual: '🎨', kinesthetic: '👐', musical: '🎵', social: '🤝', intrapersonal: '🪞', naturalistic: '🌿', auditory: '🎧', readwrite: '📚', practice: '🧪', collaborative: '👥', solo: '🧘', focus: '🎯', connection: '🔗', flexibility: '🔄', metacognition: '🧠', curiosity: '❓', persistence: '💪', independence: '🚀', errorlearning: '🛠️' };
const intelligenceAdvice: Record<string, string> = {
    linguistic: 'استثمر الشرح بصوتك وكتابة الملخصات وصناعة أسئلة من الدرس.',
    logical: 'استخدم الجداول والمقارنات والخطوات، واسأل عن العلاقات بين الأفكار.',
    visual: 'حوّل المعلومات إلى خرائط ورسوم ومسارات بصرية.',
    kinesthetic: 'اربط المذاكرة بالتطبيق والتجريب والبطاقات كلما ناسب ذلك المهمة.',
    musical: 'استخدم النطق المتكرر في مراجعة المصطلحات، دون الاعتماد عليه وحده.',
    social: 'اجعل الشرح والمناقشة وسيلة لاختبار فهمك.',
    intrapersonal: 'ضع أهدافًا قصيرة وراقب ما نجح معك وما يحتاج إلى تعديل.',
    naturalistic: 'استخدم التصنيف واربط المعلومات بأمثلة من الحياة اليومية.'
};
function scrollBehavior(): ScrollBehavior { return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'; }
export function LearningProfilePage() {
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [showResults, setShowResults] = useState(false);
    const answeredCount = Object.keys(answers).length;
    const allAnswered = answeredCount === questions.length;
    const completion = Math.round(answeredCount / questions.length * 100);
    const intelligenceScores = useMemo(() => scoreGroups(intelligenceGroups, answers), [answers]);
    const preferenceScores = useMemo(() => scoreGroups(learningPreferences, answers), [answers]);
    const skillScores = useMemo(() => scoreGroups(studySkills, answers).sort((a, b) => a.score - b.score), [answers]);
    const habitScores = useMemo(() => scoreGroups(habits, answers), [answers]);
    const topPreference = preferenceScores[0], topIntelligences = intelligenceScores.slice(0, 3), prioritySkill = skillScores[0];
    const answer = (id: number, value: number) => { setAnswers(current => ({ ...current, [id]: value })); setShowResults(false); };
    const submitSurvey = () => { if (!allAnswered)
        return; setShowResults(true); window.setTimeout(() => document.getElementById('learning-profile-results')?.scrollIntoView({ behavior: scrollBehavior(), block: 'start' }), 0); };
    const resetSurvey = () => { setAnswers({}); setShowResults(false); window.scrollTo({ top: 0, behavior: scrollBehavior() }); };
    const plan = [
        'اختر مادة واحدة، وحدد هدفًا صغيرًا وواضحًا لجلسة مذاكرة قصيرة.',
        `ذاكر جزءًا باستخدام ${topPreference.label}، ثم اختبر نفسك دون الرجوع للمصدر.`,
        `تدرب على ${prioritySkill.label}: نفّذ تمرينًا واحدًا وسجل ما نجح معك.`,
        'اشرح ما تعلمته بصوتك أو اكتبه بأسلوبك، ثم اكتشف نقطة غير واضحة.',
        'حل أسئلة وتطبيقات جديدة، وصحح أخطاءك بدل إعادة القراءة وحدها.',
        'استخدم طريقة تعلم ثانية مختلفة عن طريقتك المفضلة.',
        'راجع الأسبوع: ما الذي ساعدك فعلًا؟ وما تعديلك للأسبوع القادم؟'
    ];
    return <div className="learning-profile-page">
  <section className="learning-profile-intro">
    <div className="container learning-profile-intro__grid">
    <div>
   <p className="section-kicker">اكتشف بصمة تعلّمك</p>
    <h1 id="page-title" tabIndex={-1}>اعرف تفضيلاتك التعليمية قبل ما تبدأ مذاكرة</h1>
   <p className="learning-profile-lead">أجب عن 30 سؤالًا قصيرًا، ثم استكشف تفضيلاتك الحالية وعاداتك الدراسية، مع نصائح وخطة عملية لتجريب طرق متنوعة للتعلم.</p>
   <div className="learning-profile-scale" aria-label="مقياس الإجابة">
    <span>1 = لا ينطبق عليّ</span>
    <span>3 = متوسط</span>
    <span>5 = ينطبق عليّ جدًا</span>
    </div>
   <p className="learning-profile-note">لا توجد إجابة صحيحة أو خاطئة. اختر ما يعبّر عنك الآن. هذا استبيان تأمل ذاتي، وليس قياسًا للذكاء أو تصنيفًا ثابتًا لنمط التعلم.</p>
  </div>
    <img alt="رسم توضيحي للتأمل في طرق التعلم" className="learning-profile-intro__image" src="/assets/learning-profile-hero.svg"/>
    </div>
    </section>
  <section className="learning-profile-survey" aria-labelledby="survey-title">
    <div className="container learning-profile-survey__container">
   <div className="learning-profile-progress-wrap">
    <div className="learning-profile-progress-copy">
    <h2 id="survey-title">استبيان بصمة التعلم</h2>
    <strong>{answeredCount} / {questions.length}</strong>
    </div>
    <div className="learning-profile-progress" role="progressbar" aria-label="إكمال الاستبيان" aria-valuemin={0} aria-valuemax={100} aria-valuenow={completion}>
    <span style={{ width: `${completion}%` }}/>
    </div>
    </div>
   <div className="learning-profile-questions">{questions.map(question => <article className={`learning-profile-question${answers[question.id] ? ' is-answered' : ''}`} key={question.id}>
        <div className="learning-profile-question__number">{question.id}</div>
        <p id={`question-${question.id}`}>{question.text}</p>
        <div className="learning-profile-rating" role="radiogroup" aria-labelledby={`question-${question.id}`}>{scale.map(value => <button key={value} type="button" role="radio" aria-checked={answers[question.id] === value} tabIndex={(answers[question.id] ?? 1) === value ? 0 : -1} className={answers[question.id] === value ? 'is-selected' : ''} onClick={() => answer(question.id, value)} onKeyDown={event => { let next = value as number; if (event.key === 'ArrowRight' || event.key === 'ArrowDown')
                next = value === 5 ? 1 : value + 1;
            else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp')
                next = value === 1 ? 5 : value - 1;
            else if (event.key === 'Home')
                next = 1;
            else if (event.key === 'End')
                next = 5;
            else
                return; event.preventDefault(); answer(question.id, next); (event.currentTarget.parentElement?.children[next - 1] as HTMLButtonElement)?.focus(); }}>{value}</button>)}</div>
        </article>)}</div>
   <div className="learning-profile-submit">
    <button className="primary-button" disabled={!allAnswered} onClick={submitSurvey} type="button">اعرض بصمة تعلّمي وخطتي</button>{!allAnswered && <p>أكمل الأسئلة المتبقية أولًا — بقي {questions.length - answeredCount} سؤال.</p>}</div>
  </div>
    </section>
  {showResults && allAnswered && <section className="learning-profile-results" id="learning-profile-results" aria-labelledby="results-title">
        <div className="container">
   <div className="learning-profile-results__header">
        <p className="section-kicker">قراءتك الذاتية</p>
        <h2 id="results-title">هذه بصمة تعلّمك الحالية</h2>
        <p>تعكس إجاباتك الآن، وليست حكمًا على قدراتك. عند تساوي الدرجات لا توجد أفضلية مثبتة لأحد الخيارات.</p>
        </div>
   <div className="learning-profile-result-grid">
    <article className="learning-profile-result-card learning-profile-result-card--highlight">
        <span className="learning-profile-result-card__emoji">{emoji[topPreference.key]}</span>
        <p className="section-kicker">أحد تفضيلاتك الأعلى تقييمًا</p>
        <h3>{topPreference.label}</h3>
        <p>اجمع بين أكثر من طريقة حسب طبيعة المادة والمهمة، ثم قارن فهمك بالتطبيق والاختبار.</p>
        </article>
    <article className="learning-profile-result-card">
        <p className="section-kicker">مجالات قيّمتها بإيجابية</p>
        <h3>أعلى 3 مجالات في إجاباتك</h3>
        <div className="learning-profile-chips">{topIntelligences.map(item => <span key={item.key}>{emoji[item.key]} {item.label}</span>)}</div>
        </article>
    <article className="learning-profile-result-card">
        <p className="section-kicker">مهارة تستحق التجريب والتدريب</p>
        <h3>{emoji[prioritySkill.key]} {prioritySkill.label}</h3>
        <p>{scoreLabel(prioritySkill.score)}</p>
        </article>
   </div>
   <div className="learning-profile-section-block">
        <h3>كيف تستفيد أثناء المذاكرة؟</h3>
        <div className="learning-profile-advice-grid">{(preferenceAdvice[topPreference.key] ?? []).map(tip => <div className="learning-profile-tip" key={tip}>
            <span>✓</span>
            <p>{tip}</p>
            </div>)}<div className="learning-profile-tip learning-profile-tip--wide">
        <span>★</span>
        <p>{intelligenceAdvice[topIntelligences[0].key]}</p>
        </div>
        </div>
        </div>
   <div className="learning-profile-section-block">
        <h3>خطة 7 أيام لتقوية مهاراتك الدراسية</h3>
        <div className="learning-profile-plan">{plan.map((item, index) => <div key={index}>
            <b>اليوم {index + 1}</b>
            <p>{item}</p>
            </div>)}</div>
        </div>
   <div className="learning-profile-section-block">
        <h3>مؤشر مهاراتك الدراسية حسب إجاباتك</h3>
        <div className="learning-profile-skill-list">{studySkills.map(skill => {
                const score = answers[skill.ids[0]] ?? 0;
                return <div className="learning-profile-skill" key={skill.key}>
                <div>
                <strong>{emoji[skill.key]} {skill.label}</strong>
                <span>{score} / 5</span>
                </div>
                <div className="learning-profile-skill__bar">
                <span style={{ width: `${score * 20}%` }}/>
                </div>
                <small>{scoreLabel(score)}</small>
                </div>;
            })}</div>
        </div>
   <div className="learning-profile-section-block">
        <h3>ميول تساعدك أثناء التعلم</h3>
        <div className="learning-profile-chips learning-profile-chips--large">{habitScores.map(item => <span key={item.key}>{emoji[item.key]} {item.label}: {item.score}/5</span>)}</div>
        </div>
   <div className="learning-profile-results__actions">
        <Link className="primary-button" to="/curriculum">ابدأ مذاكرتك الآن</Link>
        <button className="secondary-button" onClick={resetSurvey} type="button">أعد الاستبيان</button>
        </div>
   <p className="learning-profile-disclaimer">أداة تعليمية إرشادية للتأمل الذاتي، وليست اختبارًا نفسيًا أو تشخيصًا أو مقياسًا معتمدًا للذكاء. الإجابات لا تُرسل إلى خادم ولا تُحفظ بعد مغادرة الصفحة.</p>
  </div>
        </section>}
 </div>;
}
