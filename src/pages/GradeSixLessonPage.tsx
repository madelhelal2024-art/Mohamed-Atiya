import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import index from '../data/grade-six-term-one-index.json';
import fileManifest from '../data/grade-six-lesson-files.json';
import { SECTION_KEYS, SECTION_NAMES } from '../lib/ui-copy';
import { gradeSixLessonKey, validGradeSixFiles, type GradeSixLessonFiles } from '../lib/grade-six-resources';
import '../styles/grade-six-home.css';

const files = fileManifest as GradeSixLessonFiles;

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
  const materialCount = SECTION_KEYS.reduce((count, key) => count + validGradeSixFiles(files, lessonKey, key).length, 0);

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
        <p>محتوى الدرس منظّم في تسعة أقسام. تظهر الروابط والملفات بعد إضافتها إلى مكتبة الدروس.</p>
        <span className="grade-six-lesson__count">{materialCount > 0 ? `${materialCount} ملف متاح` : 'لم تُضَف ملفات إلى هذا الدرس بعد'}</span>
      </header>

      <div className="grade-six-lesson__sections">
        {SECTION_KEYS.map((section, idx) => {
          const resources = validGradeSixFiles(files, lessonKey, section);
          return (
            <details className="grade-six-lesson__section" key={section} open={idx === 0}>
              <summary>
                <span className="grade-six-lesson__section-number" aria-hidden="true">{idx + 1}</span>
                <strong>{SECTION_NAMES[section]}</strong>
                <span className={`grade-six-lesson__status ${resources.length ? 'is-ready' : ''}`}>
                  {resources.length ? `${resources.length} ملف` : 'بانتظار الملفات'}
                </span>
              </summary>
              <div className="grade-six-lesson__section-body">
                {resources.length ? (
                  <ul className="grade-six-lesson__files">
                    {resources.map((resource) => (
                      <li key={`${section}-${resource.url}`}>
                        <a href={resource.url} target="_blank" rel="noopener noreferrer">{resource.title} ↗</a>
                        {resource.description && <p>{resource.description}</p>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>لم تتم إضافة مواد لهذا القسم بعد. سيظهر المحتوى هنا بمجرد رفع الملف وتسجيله.</p>
                )}
              </div>
            </details>
          );
        })}
      </div>
      <Link className="btn-secondary grade-six-lesson__back" to="/grade-six/term-one">→ العودة إلى فهرس الفصل الأول</Link>
    </section>
  );
}
