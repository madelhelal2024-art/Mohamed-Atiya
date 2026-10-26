import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import index from '../data/grade-six-term-one-index.json';
import fileManifest from '../data/grade-six-lesson-files.json';
import contentManifest from '../data/grade-six-lesson-content.json';
import { GradeSixInlineContent } from '../components/GradeSixInlineContent';
import { GradeSixResourcePreview } from '../components/GradeSixResourcePreview';
import { GradeSixTreasureActivities } from '../components/GradeSixTreasureActivities';
import { GradeSixTreasureQuiz } from '../components/GradeSixTreasureQuiz';
import { GradeSixTreasurePresentation } from '../components/GradeSixTreasurePresentation';
import { GradeSixTreasureAssistant } from '../components/GradeSixTreasureAssistant';
import { GradeSixTreasureHomework } from '../components/GradeSixTreasureHomework';
import { hasTreasureInteractiveSection, TREASURE_LESSON_KEY } from '../data/grade-six-lesson-interactions';
import { SECTION_KEYS, SECTION_NAMES } from '../lib/ui-copy';
import { gradeSixLessonKey, validGradeSixFiles, type GradeSixLessonFiles } from '../lib/grade-six-resources';
import { hasGradeSixInlineContent, type GradeSixLessonContentManifest } from '../lib/grade-six-content';
import '../styles/grade-six-home.css';

const files = fileManifest as GradeSixLessonFiles;
const contents = contentManifest as GradeSixLessonContentManifest;

export function GradeSixLessonPage() {
  const { unitId, entryIndex } = useParams<{ unitId: string; entryIndex: string }>();
  const unit = index.units.find((item) => item.id === unitId);
  const entryNumber = Number(entryIndex);
  const validIndex = Number.isInteger(entryNumber) && entryNumber >= 1;
  const entry = validIndex ? unit?.entries[entryNumber - 1] : undefined;

  if (!unit || !entry) {
    return (
      <div className="grade-six-lesson__missing">
        <h1>لم يُعثر على هذا العنوان</h1>
        <Link className="btn-primary" to="/grade-six/term-one">العودة إلى فهرس الفصل الأول</Link>
      </div>
    );
  }

  const lessonKey = gradeSixLessonKey(unit.id, entryNumber);
  const readySectionCount = SECTION_KEYS.filter((key) =>
    hasGradeSixInlineContent(contents[lessonKey]?.[key]) || validGradeSixFiles(files, lessonKey, key).length > 0 || hasTreasureInteractiveSection(lessonKey, key),
  ).length;

  return (
    <section className="grade-six-lesson" aria-labelledby="grade-six-lesson-title">
      <Breadcrumbs items={[
        { label: 'الصف السادس الابتدائي', path: '/grade-six' },
        { label: 'الفصل الدراسي الأول', path: '/grade-six/term-one' },
        { label: entry[1] },
      ]} />
      <header className="grade-six-lesson__hero">
        <span className="grade-six-lesson__type">{entry[0]} · {unit.number} — {unit.title}</span>
        <h1 id="grade-six-lesson-title">{entry[1]}</h1>
        <p>{lessonKey === TREASURE_LESSON_KEY
          ? 'تعلّم الدرس خطوة بخطوة: اقرأ النقاط الأساسية، شاهد الشرح، شارك في الأنشطة، ثم اختبر فهمك وراجع واجباتك.'
          : 'محتوى الدرس منظّم في تسعة أقسام. تظهر الروابط والملفات بعد إضافتها إلى مكتبة الدروس.'}</p>
        <span className="grade-six-lesson__count">{readySectionCount > 0 ? `${readySectionCount.toLocaleString('ar-EG')} أقسام متاحة من ٩` : 'لم تُضَف ملفات إلى هذا الدرس بعد'}</span>
      </header>

      <div className="grade-six-lesson__sections">
        {SECTION_KEYS.map((section, idx) => {
          const resources = validGradeSixFiles(files, lessonKey, section);
          const inlineContent = contents[lessonKey]?.[section];
          const hasContent = hasGradeSixInlineContent(inlineContent);
          const hasInteraction = hasTreasureInteractiveSection(lessonKey, section);
          const isReady = resources.length > 0 || hasContent || hasInteraction;
          return (
            <details className="grade-six-lesson__section" key={section} open={idx === 0}>
              <summary>
                <span className="grade-six-lesson__section-number" aria-hidden="true">{idx + 1}</span>
                <strong>{SECTION_NAMES[section]}</strong>
                <span className={`grade-six-lesson__status ${isReady ? 'is-ready' : ''}`}>
                  {isReady ? 'المحتوى متاح' : 'بانتظار الملفات'}
                </span>
              </summary>
              <div className="grade-six-lesson__section-body">
                {hasContent && inlineContent && <GradeSixInlineContent content={inlineContent} />}
                {resources.map((resource) => <GradeSixResourcePreview key={`${section}-${resource.url}`} resource={resource} />)}
                {hasInteraction && section === 'activities' && <GradeSixTreasureActivities />}
                {hasInteraction && section === 'quiz' && <GradeSixTreasureQuiz />}
                {hasInteraction && section === 'presentation' && <GradeSixTreasurePresentation />}
                {hasInteraction && section === 'assistant' && <GradeSixTreasureAssistant />}
                {hasInteraction && section === 'homework' && <GradeSixTreasureHomework />}
                {!isReady && <p>لم تتم إضافة مواد لهذا القسم بعد. سيظهر المحتوى هنا بمجرد رفع الملف وتسجيله.</p>}
              </div>
            </details>
          );
        })}
      </div>
      <Link className="btn-secondary grade-six-lesson__back" to="/grade-six/term-one">→ العودة إلى فهرس الفصل الأول</Link>
    </section>
  );
}
