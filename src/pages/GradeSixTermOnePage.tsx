import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Icon } from '../components/Icon';
import index from '../data/grade-six-term-one-index.json';
import { normalizeArabicText } from '../lib/search';
import '../styles/grade-six-index.css';

function normalizeIndexText(value: string): string {
  return normalizeArabicText(value
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 0x0660))
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 0x06f0)));
}

export function GradeSixTermOnePage() {
  const [query, setQuery] = useState('');
  const normalizedQuery = normalizeIndexText(query.trim());
  const units = useMemo(() => index.units.map((unit) => ({
    ...unit,
    entries: unit.entries.filter((entry) =>
      !normalizedQuery || normalizeIndexText(entry.join(' ')).includes(normalizedQuery)),
  })).filter((unit) =>
    unit.entries.length > 0 || (!normalizedQuery && unit.entries.length === 0)),
  [normalizedQuery]);
  const totalEntries = index.units.reduce((sum, unit) => sum + unit.entries.length, 0);
  const filteredEntries = units.reduce((sum, unit) => sum + unit.entries.length, 0);

  return (
    <section className="page-section grade-six-index">
      <div className="container">
        <Breadcrumbs items={[
          { label: 'المناهج', path: '/curriculum' },
          { label: 'الصف السادس — الفصل الأول' },
        ]} />
        <header className="grade-six-index__hero">
          <div>
            <p className="section-kicker">فهرس الكتاب الدراسي</p>
            <h1 id="page-title" tabIndex={-1}>{index.title} — {index.grade}</h1>
            <p className="grade-six-index__term">{index.term}</p>
            <p>تصفح وحدات المنهج وعناوين القراءة والاستماع والنحو والإملاء والأنشطة وأرقام صفحاتها.</p>
          </div>
          <div className="grade-six-index__stats" aria-label="محتويات الفهرس">
            <span><strong>{index.units.length}</strong> وحدات</span>
            <span><strong>{totalEntries}</strong> بندًا في الفهرس</span>
          </div>
        </header>

        <div className="grade-six-index__notice" role="note">
          <Icon name="book" />
          <p><strong>تنبيه:</strong> هذه عناوين فهرس الكتاب وأرقام صفحاتها، وليست دروسًا مشروحة داخل التطبيق بعد. سنضيف الشرح والوسائط والتدريبات بعد توفير محتوى كل درس.</p>
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
              placeholder="مثل: أنواع الخبر، الاستماع، أو ١٠٨"
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
                    <thead><tr><th scope="col">نوع المحتوى</th><th scope="col">العنوان</th><th scope="col">الصفحة</th></tr></thead>
                    <tbody>
                      {unit.entries.map((entry, i) => (
                        <tr key={`${unit.id}-${i}`}>
                          <td><span className="grade-six-index__kind">{entry[0]}</span></td>
                          <td>{entry[1]}</td>
                          <td className="grade-six-index__page">{entry[2]}</td>
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
          <Link className="btn-secondary" to="/curriculum">→ العودة إلى المناهج</Link>
        </div>
      </div>
    </section>
  );
}
