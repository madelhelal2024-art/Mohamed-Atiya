import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Icon } from '../components/Icon';
import index from '../data/grade-six-term-one-index.json';
import { normalizeArabicText } from '../lib/search';
import '../styles/grade-six-index.css';

function normalizeIndexText(value: string): string {
  return normalizeArabicText(value);
}

export function GradeSixTermOnePage() {
  const [query, setQuery] = useState('');
  const normalizedQuery = normalizeIndexText(query.trim());
  const units = useMemo(() => index.units.map((unit) => ({
    ...unit,
    entries: unit.entries
      .map((entry, sourceIndex) => ({ entry, sourceIndex }))
      .filter(({ entry }) => !normalizedQuery || normalizeIndexText(entry.join(' ')).includes(normalizedQuery)),
  })).filter((unit) =>
    unit.entries.length > 0 || (!normalizedQuery && unit.entries.length === 0)),
  [normalizedQuery]);
  const totalEntries = index.units.reduce((sum, unit) => sum + unit.entries.length, 0);
  const filteredEntries = units.reduce((sum, unit) => sum + unit.entries.length, 0);

  return (
    <section className="page-section grade-six-index">
      <div className="container">
        <Breadcrumbs items={[
          { label: 'الصف السادس الابتدائي', path: '/grade-six' },
          { label: 'الصف السادس — الفصل الأول' },
        ]} />
        <header className="grade-six-index__hero">
          <div>
            <p className="section-kicker">فهرس الكتاب الدراسي</p>
            <h1 id="page-title" tabIndex={-1}>{index.title} — {index.grade}</h1>
            <p className="grade-six-index__term">{index.term}</p>
            <p>اختر الوحدة ثم اضغط على عنوان الدرس لفتح ملفاته التعليمية وأقسامه التسعة.</p>
          </div>
          <div className="grade-six-index__stats" aria-label="محتويات الفهرس">
            <span><strong>{index.units.length}</strong> وحدات</span>
            <span><strong>{totalEntries}</strong> بندًا في الفهرس</span>
          </div>
        </header>

        <div className="grade-six-index__notice" role="note">
          <Icon name="book" />
          <p><strong>تنبيه:</strong> عناوين الفهرس متاحة الآن. لكل عنوان صفحة خاصة بأقسام المحتوى التسعة؛ وسيظهر كل ملف عند إضافته فقط.</p>
        </div>
        <div className="grade-six-index__search">
          <label htmlFor="grade-six-search">ابحث عن درس أو مهارة</label>
          <div>
            <Icon name="search" />
            <input
              id="grade-six-search"
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="مثل: أنواع الخبر أو الاستماع"
            />
            {query && <button type="button" onClick={() => setQuery('')} aria-label="مسح البحث">مسح</button>}
          </div>
          {normalizedQuery && <p aria-live="polite">{filteredEntries} نتيجة في {units.length} وحدات</p>}
        </div>

        {units.length === 0 ? (
          <div className="grade-six-index__empty">
            <p>لا توجد عناوين تطابق بحثك.</p>
            <button className="btn-secondary" type="button" onClick={() => setQuery('')}>عرض الفهرس كاملًا</button>
          </div>
        ) : (
          <div className="grade-six-index__units">
            {units.map((unit, unitIndex) => (
              <details className="grade-six-index__unit" key={unit.id} open={normalizedQuery ? true : unitIndex === 0}>
                <summary>
                  <span className="grade-six-index__number">{unit.number}</span>
                  <strong>{unit.title}</strong>
                  <span className="grade-six-index__count">{unit.entries.length} بندًا</span>
                </summary>
                <div className="grade-six-index__table-wrap">
                  <table>
                    <thead><tr><th scope="col">نوع المحتوى</th><th scope="col">العنوان</th><th scope="col">الملفات التعليمية</th></tr></thead>
                    <tbody>
                      {unit.entries.map(({ entry, sourceIndex }) => (
                        <tr key={`${unit.id}-${sourceIndex}`}>
                          <td><span className="grade-six-index__kind">{entry[0]}</span></td>
                          <td><Link className="grade-six-index__lesson-link" to={`/grade-six/term-one/${unit.id}/${sourceIndex + 1}`}>{entry[1]}</Link></td>
                          <td><Link className="grade-six-index__open" to={`/grade-six/term-one/${unit.id}/${sourceIndex + 1}`}>فتح الدرس ←</Link></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </details>
            ))}
          </div>
        )}
        <div className="grade-six-index__back">
          <Link className="btn-secondary" to="/grade-six">→ العودة إلى الفصلين الدراسيين</Link>
        </div>
      </div>
    </section>
  );
}
