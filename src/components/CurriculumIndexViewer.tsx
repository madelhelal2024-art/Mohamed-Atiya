import { useId, useMemo, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { D3CircularProgressChart } from './D3CircularProgressChart';
import { ThemeProgressLineChart } from './ThemeProgressLineChart';
import { SectionCheckButton } from './SectionCheckButton';
import { Icon } from './Icon';
import { curriculum, unitPath } from '../lib/content';
import { normalizeArabic } from '../lib/search';
import { getCohortLast7DaysProgress, useLessonProgress, type StudentCohort } from '../lib/progress';
import { getUnitTheme, sectionTypeColors, sectionTypeIcons, type CurriculumUnitTheme, type CurriculumIndexItem } from '../data/curriculum-units-index';
import settings from '../data/template-settings.json';
type IndexTheme = CurriculumUnitTheme & {
    colorScheme: 'emerald' | 'indigo';
};
const themes: IndexTheme[] = curriculum.levels.flatMap(level => level.subjects.flatMap(subject => subject.units.map((unit, index) => ({ ...getUnitTheme(unit.id, level.title, subject.title, unit.title, unit.lessons), levelId: level.id, subjectId: subject.id, unitId: unit.id, colorScheme: index % 2 ? 'indigo' as const : 'emerald' as const }))));
function itemsOf(theme: IndexTheme): CurriculumIndexItem[] { return [...(theme.diagnostic ? [theme.diagnostic] : []), ...theme.topics.flatMap(topic => topic.items), ...(theme.project ? [theme.project] : [])].filter((item, index, items) => items.findIndex(other => other.id === item.id) === index); }
export function CurriculumIndexViewer({ initialThemeId = 'all', defaultExpanded = true }: {
    initialThemeId?: string;
    defaultExpanded?: boolean;
}) {
    const [activeTab, setActiveTab] = useState(initialThemeId), [query, setQuery] = useState(''), [expanded, setExpanded] = useState(defaultExpanded);
    const headingId = useId(), contentId = useId();
    const { getUnitProgress } = useLessonProgress();
    const allIds = useMemo(() => themes.flatMap(theme => itemsOf(theme).map(item => item.id)), []), progress = getUnitProgress(allIds);
    const visible = themes.filter(theme => activeTab === 'all' || theme.id === activeTab).filter(theme => !query.trim() || normalizeArabic([theme.title, ...itemsOf(theme).map(item => `${item.title} ${item.typeLabel} ${item.description ?? ''}`)].join(' ')).includes(normalizeArabic(query)));
    return <article className="index-card" aria-labelledby={headingId}>
  <div className="index-banner">
    <div className="index-banner__top">
    <div className="index-title-group">
    <span className="index-icon-box" aria-hidden="true">📖</span>
    <div>
    <div className="index-badge-official">
    <Icon name="layers"/>
    <span>مسار تعليمي قابل للتخصيص</span>
    </div>
    <h2 id={headingId}>الفهرس التفصيلي وتقدم التعلم</h2>
    </div>
    </div>
    <button className="secondary-button index-banner-toggle" type="button" onClick={() => setExpanded(value => !value)} aria-expanded={expanded} aria-controls={contentId}>
    <Icon name="chevron"/>{expanded ? 'طيّ الفهرس' : 'عرض الفهرس بالكامل'}</button>
    </div>
    <p>استعرض وحداتك وموضوعاتها وأقسامها الداخلية، وافتح الدروس وتابع ما أنجزته على هذا المتصفح.</p>
    <div className="index-stats">
    <span className="index-stat-pill">
    <Icon name="layers"/>{themes.length} وحدات</span>
    <span className="index-stat-pill">
    <Icon name="book"/>{allIds.length} دروس وأقسام</span>
    <span className="index-stat-pill">
    <Icon name="check-circle"/>الإنجاز الكلي: {progress.percentage}% ({progress.completed} من {progress.total})</span>
    </div>
    </div>
  {expanded && <div id={contentId}>
        <div className="index-controls">
        <div className="index-tabs" role="group" aria-label="تصفية الوحدات">
        <button type="button" className={`index-tab${activeTab === 'all' ? ' is-active' : ''}`} aria-pressed={activeTab === 'all'} onClick={() => setActiveTab('all')}>كافة الوحدات</button>{themes.map(theme => <button type="button" key={theme.id} className={`index-tab index-tab--${theme.colorScheme}${activeTab === theme.id ? ' is-active' : ''}`} aria-pressed={activeTab === theme.id} onClick={() => setActiveTab(theme.id)}>{theme.title}</button>)}</div>
        <div className="index-search-box">
        <span className="index-search-icon">
        <Icon name="search"/>
        </span>
        <input type="search" className="index-search-input" value={query} onChange={event => setQuery(event.target.value)} placeholder="ابحث في العناوين وأنواع الأقسام..." aria-label="البحث داخل الفهرس"/>
        </div>
        </div>
        <div className="index-themes-container">{visible.length ? visible.map(theme => <ThemeBlock key={theme.id} theme={theme} query={query}/>) : <div className="index-empty">
            <Icon name="search"/>
            <h4>لا توجد نتائج تطابق البحث</h4>
            <button type="button" className="secondary-button" onClick={() => { setQuery(''); setActiveTab('all'); }}>مسح التصفية</button>
            </div>}</div>
        </div>}
 </article>;
}
function ThemeBlock({ theme, query }: {
    theme: IndexTheme;
    query: string;
}) {
    const [expanded, setExpanded] = useState(false), [cohort, setCohort] = useState<StudentCohort>('all');
    const { isLessonFinished, toggleLessonFinished, getUnitProgress, completedLessonIds } = useLessonProgress();
    const allItems = useMemo(() => itemsOf(theme), [theme]), ids = useMemo(() => allItems.map(item => item.id), [allItems]);
    const progress = getUnitProgress(ids), statsId = useId();
    const simulated = cohort !== 'all';
    const count = simulated ? (getCohortLast7DaysProgress(ids, cohort).at(-1)?.cumulativeCompleted ?? 0) : progress.completed;
    const percentage = ids.length ? Math.round(count / ids.length * 100) : 0;
    const q = normalizeArabic(query), themeMatch = normalizeArabic(theme.title).includes(q);
    const matches = (item: CurriculumIndexItem) => !q || themeMatch || normalizeArabic(`${item.title} ${item.typeLabel} ${item.description ?? ''}`).includes(q);
    const breakdown = Object.entries(allItems.reduce<Record<string, number>>((map, item) => { map[item.typeLabel] = (map[item.typeLabel] ?? 0) + 1; return map; }, {}));
    const row = (item: CurriculumIndexItem, index: number) => {
        const finished = isLessonFinished(item.id), colors = sectionTypeColors[item.type] ?? sectionTypeColors.explanation;
        return <li key={item.id} className={`index-section-item${finished ? ' is-completed' : ''}`} style={{ '--section-item-index': index } as CSSProperties}>
        <div className="index-section-item__meta">
        <span className="index-section-type-badge" style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
        <Icon name={sectionTypeIcons[item.type] ?? 'book'}/>{item.typeLabel}</span>
        <div className="index-section-item__title-box">
        <Link to={`/lessons/${item.id}`} className="index-section-item__title">{item.title}</Link>{item.description && <span className="index-section-item__desc">{item.description}</span>}</div>
        </div>
        <div className="index-section-item__side">{item.pageNumber && <span className="index-section-page-badge">ص {item.pageNumber}</span>}<SectionCheckButton isFinished={finished} onToggle={() => toggleLessonFinished(item.id)} ariaLabel={finished ? `إلغاء إكمال ${item.title}` : `إكمال ${item.title}`}/>
        <Link to={`/lessons/${item.id}`} className="index-section-open-link" aria-label={`فتح ${item.title}`}>
        <Icon name="arrow-left"/>
        </Link>
        </div>
        <div className={`index-section-progress-bar${finished ? ' is-filled' : ''}`} role="progressbar" aria-label={`تقدم ${item.title}`} aria-valuenow={finished ? 100 : 0} aria-valuemin={0} aria-valuemax={100}>
        <span className="index-section-progress-fill" style={{ width: finished ? '100%' : '0%' }}/>
        </div>
        </li>;
    };
    return <section className="index-theme-section">
  <header className={`index-theme-header index-theme-header--${theme.colorScheme}`}>
    <div className="index-theme-header__title">
    <span className="index-theme-header__tag">{theme.number}</span>
    <h3>{theme.title}</h3>
    <button type="button" className="index-theme-header__expand-indicator" aria-expanded={expanded} aria-controls={statsId} onClick={() => setExpanded(value => !value)}>
    <Icon name="chevron" className={`index-theme-header__chevron${expanded ? ' index-theme-header__chevron--expanded' : ''}`}/>{expanded ? 'إخفاء الإحصائيات' : 'إحصائيات الوحدة'}</button>
    </div>
    <div className="index-theme-header__chart">
    <D3CircularProgressChart completed={progress.completed} total={progress.total} percentage={progress.percentage} title={theme.title} colorScheme={theme.colorScheme}/>
    </div>
    <Link to={unitPath(theme.levelId, theme.subjectId, theme.unitId)} className="index-theme-header__action">فتح الوحدة التعليمية <Icon name="arrow-left"/>
    </Link>
    </header>
  {expanded && <div id={statsId} className="index-theme-dropdown">
        <div className="index-theme-dropdown__header">
        <span className="index-theme-dropdown__title">
        <Icon name="brain"/>إحصائيات ومؤشرات {theme.title}</span>
        <span className="index-theme-dropdown__badge">{ids.length} دروس · {theme.topics.length} موضوعات</span>
        </div>
   <div className="index-cohort-filter">
        <div className="index-cohort-filter__header">
        <span className="index-cohort-filter__label">
        <Icon name="user"/>مصدر العرض</span>
        <span className="index-cohort-filter__hint">لا توجد قاعدة بيانات لطلاب أو فصل حقيقي في هذا القالب.</span>
        </div>
        <div className="index-cohort-filter__chips" role="group" aria-label="اختيار تقدم محلي أو بيانات محاكاة">{(['all', ...(settings.demoMode ? ['top', 'support'] : [])] as StudentCohort[]).map(value => <button type="button" aria-pressed={cohort === value} key={value} className={`index-cohort-chip index-cohort-chip--${value}${cohort === value ? ' is-active' : ''}`} onClick={() => setCohort(value)}>
            <span className="index-cohort-chip__icon">
            <Icon name={value === 'all' ? 'user' : value === 'top' ? 'star' : 'flag'}/>
            </span>
            <span className="index-cohort-chip__content">
            <strong className="index-cohort-chip__name">{value === 'all' ? 'تقدمي على هذا المتصفح' : value === 'top' ? 'محاكاة تقدم مرتفع' : 'محاكاة احتياج إلى دعم'}</strong>
            <span className="index-cohort-chip__sub">{value === 'all' ? 'إنجاز محلي محفوظ' : 'بيانات تجريبية غير حقيقية'}</span>
            </span>
            </button>)}</div>
        </div>
   <div className="index-stats-grid">{[{ icon: 'book' as const, tone: 'blue', label: 'إجمالي الدروس', value: `${ids.length} دروس`, meta: `${theme.topics.length} موضوعات رئيسية` }, { icon: 'clock' as const, tone: 'amber', label: 'زمن إنجاز الدرس', value: 'غير مقاس', meta: 'القالب لا يتتبع وقت المذاكرة الفعلي.' }, { icon: 'check-circle' as const, tone: 'emerald', label: simulated ? 'نسبة الإنجاز في المحاكاة' : 'الإنجاز المحلي', value: `${count} من ${ids.length} (${percentage}%)`, meta: simulated ? 'ليست نتيجة طالب حقيقي.' : `${ids.length - count} دروس متبقية` }].map((stat, index) => <div className="index-stat-card" key={stat.label} style={{ '--stagger-index': index } as CSSProperties}>
            <div className={`index-stat-card__icon index-stat-card__icon--${stat.tone}`}>
            <Icon name={stat.icon}/>
            </div>
            <div className="index-stat-card__body">
            <span className="index-stat-card__label">{stat.label}</span>
            <strong className="index-stat-card__value">{stat.value}</strong>
            <span className="index-stat-card__meta">{stat.meta}</span>
            </div>
            </div>)}</div>
   <div className="index-theme-dropdown__breakdown">
        <span className="index-breakdown__title">
        <Icon name="layers"/>توزيع الأقسام:</span>
        <div className="index-breakdown__chips">{breakdown.map(([label, total]) => <span className="index-breakdown__chip" key={label}>{label}<strong className="index-breakdown__count">{total}</strong>
            </span>)}</div>
        </div>
        <ThemeProgressLineChart themeTitle={theme.title} themeLessonIds={ids} completedLessonIds={completedLessonIds} studentCohort={cohort} colorScheme={theme.colorScheme}/>
  </div>}
  {theme.diagnostic && matches(theme.diagnostic) && <div className="index-diagnostic-strip">
        <div className="index-diagnostic-strip__info">
        <span className="index-diagnostic-strip__badge">{theme.diagnostic.typeLabel}</span>
        <strong>{theme.diagnostic.title}</strong>
        </div>
        <div className="index-diagnostic-actions">
        <SectionCheckButton isFinished={isLessonFinished(theme.diagnostic.id)} onToggle={() => toggleLessonFinished(theme.diagnostic!.id)} ariaLabel={`إكمال ${theme.diagnostic.title}`}/>
        <Link to={`/lessons/${theme.diagnostic.id}`}>افتح التقييم <Icon name="arrow-left"/>
        </Link>
        </div>
        </div>}
  <div className="index-topics-grid">{theme.topics.map(topic => {
            const visible = topic.items.filter(matches);
            return visible.length ? <div className="index-topic-card" key={topic.id}>
            <div className={`index-topic-card__header index-topic-card__header--${theme.colorScheme}`}>
            <div className="index-topic-card__title-wrap">
            <span className={`index-topic-card__badge index-topic-card__badge--${theme.colorScheme}`}>{topic.number}</span>
            <h4>{topic.title}</h4>
            </div>
            <span className="index-topic-card__count">{visible.length} أقسام</span>
            </div>
            <ul className="index-internal-sections">{visible.map(row)}</ul>
            </div> : null;
        })}{theme.project && matches(theme.project) && <div className="index-topic-card">
        <h4>مشروع الوحدة</h4>
        <ul className="index-internal-sections">{row(theme.project, 0)}</ul>
        </div>}</div>
 </section>;
}
