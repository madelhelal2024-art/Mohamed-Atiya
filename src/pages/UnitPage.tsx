import { useId, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Icon } from '../components/Icon';
import { UnitAchievementBadge } from '../components/LearningBadges';
import { SectionCheckButton } from '../components/SectionCheckButton';
import { getUnitTheme, sectionTypeColors, sectionTypeIcons, type CurriculumIndexItem } from '../data/curriculum-units-index';
import { findUnit } from '../lib/content';
import { useLessonProgress } from '../lib/progress';
import { normalizeArabic } from '../lib/search';
import { NotFoundPage } from './NotFoundPage';
export function UnitPage() {
    const { levelId = '', subjectId = '', unitId = '' } = useParams();
    const context = findUnit(levelId, subjectId, unitId);
    return context ? <UnitContent key={unitId} context={context}/> : <NotFoundPage />;
}
/** All hooks are unconditional, including navigation from a missing unit. */
function UnitContent({ context }: {
    context: NonNullable<ReturnType<typeof findUnit>>;
}) {
    const { level, subject, unit } = context;
    const { getUnitProgress, isLessonFinished, toggleLessonFinished } = useLessonProgress();
    const [viewMode, setViewMode] = useState<'grouped' | 'flat'>('grouped'), [searchQuery, setSearchQuery] = useState(''), [selectedType, setSelectedType] = useState('all');
    const searchInputId = useId(), progress = getUnitProgress(unit.lessons.map((l) => l.id));
    const theme = useMemo(() => getUnitTheme(unit.id, level.title, subject.title, unit.title, unit.lessons), [unit, level.title, subject.title]);
    const allItems = useMemo(() => [...(theme.diagnostic ? [theme.diagnostic] : []), ...theme.topics.flatMap((topic) => topic.items), ...(theme.project ? [theme.project] : [])], [theme]);
    const itemsById = useMemo(() => new Map(allItems.map((item) => [item.id, item])), [allItems]);
    const types = useMemo(() => Array.from(new Map(allItems.map((item) => [item.type, item.typeLabel]))), [allItems]);
    const query = normalizeArabic(searchQuery);
    const matches = (item: CurriculumIndexItem, topicText = '') => (selectedType === 'all' || item.type === selectedType) && (!query || normalizeArabic([item.title, item.typeLabel, item.description ?? '', topicText].join(' ')).includes(query));
    const filteredTopics = theme.topics.map((topic) => ({ ...topic, items: topic.items.filter((item) => matches(item, `${topic.title} ${topic.number}`)) })).filter((topic) => topic.items.length);
    const project = theme.project && matches(theme.project) ? theme.project : undefined;
    const diagnostic = theme.diagnostic && matches(theme.diagnostic) ? theme.diagnostic : undefined;
    const flat = unit.lessons.filter((lesson) => { const meta = itemsById.get(lesson.id); return meta ? matches(meta) : selectedType === 'all' && (!query || normalizeArabic(lesson.title).includes(query)); });
    const reset = () => { setSearchQuery(''); setSelectedType('all'); };
    function lessonCard(item: CurriculumIndexItem, index: number) {
        const finished = isLessonFinished(item.id), colors = sectionTypeColors[item.type] ?? sectionTypeColors.explanation;
        return <div className={`lesson-card-wrapper${finished ? ' is-finished' : ''}`} key={item.id}>
      <Link className={`lesson-card${finished ? ' lesson-card--finished' : ''}`} to={`/lessons/${item.id}`}>
        <span className={`lesson-card__number${finished ? ' is-finished' : ''}`}>{finished ? <Icon name="check"/> : index + 1}</span>
        <span className="lesson-card__content">
        <small className="lesson-card__kicker">
        <span className="index-item-type" style={{ background: colors.bg, color: colors.text, border: `1px solid ${colors.border}` }}>
        <Icon name={sectionTypeIcons[item.type] ?? 'book'}/>
        <span>{item.typeLabel}</span>
        </span>{item.pageNumber && <span className="index-page-number">(ص {item.pageNumber})</span>}{finished && <span className="lesson-finished-badge">
            <Icon name="check"/> مكتمل</span>}</small>
        <strong>{item.title}</strong>{item.description && <span className="index-item-description">{item.description}</span>}</span>
        <span className="lesson-card__action">افتح الدرس <Icon name="arrow-left"/>
        </span>
        </Link>
      <SectionCheckButton ariaLabel={finished ? `إلغاء تعليم «${item.title}» كمكتمل` : `تعليم «${item.title}» كمكتمل`} className={`lesson-check-toggle${finished ? ' is-active' : ''}`} isFinished={finished} onToggle={() => toggleLessonFinished(item.id)} finishedText="مكتمل" unfinishedText="تحديد كمكتمل"/>
    </div>;
    }
    return <section className="page-section unit-page">
    <div className="container narrow-container">
    <Breadcrumbs items={[{ label: 'الرئيسية', to: '/' }, { label: 'المناهج', to: '/curriculum' }, { label: level.title, to: '/curriculum' }, { label: subject.title, to: '/curriculum' }, { label: unit.title }]}/>
    <article className="index-card" style={{ marginTop: '1rem', marginBottom: '1.75rem' }}>
    <div className="index-banner" style={{ background: theme.bannerGradient }}>
      <div className="index-banner__top">
    <div className="index-title-group">
    <span className="index-icon-box" aria-hidden="true">{theme.iconSymbol}</span>
    <div>
    <div className="index-badge-official">
    <Icon name="check-circle"/>
    <span>{theme.stageBadge}</span>
    </div>
    <h1 id="page-title" style={{ fontSize: '1.5rem', fontWeight: 800, margin: '.35rem 0 0', color: '#fff' }} tabIndex={-1}>{unit.title}</h1>
    <UnitAchievementBadge completed={progress.isFullyCompleted} unitTitle={unit.title}/>
    </div>
    </div>
        {unit.lessons.length > 0 && <div className="index-stats unit-header-stats">
        <div>
        <small>الدروس</small>
        <strong>{unit.lessons.length}</strong>
        </div>
        <i />
        <div>
        <small>الأقسام الداخلية</small>
        <strong>{allItems.length}</strong>
        </div>
        <i />
        <div>
        <small>الإنجاز</small>
        <strong>{progress.percentage}%</strong>
        </div>
        </div>}
      </div>{unit.description && <p className="unit-banner-description">{unit.description}</p>}
      {unit.lessons.length > 0 && <div style={{ marginTop: '.25rem' }}>
        <div aria-label={`نسبة إنجاز الوحدة ${progress.percentage}%`} aria-valuemax={100} aria-valuemin={0} aria-valuenow={progress.percentage} className="unit-progress-track" role="progressbar" style={{ background: 'rgba(0,0,0,.25)', height: '10px' }}>
        <div className={`unit-progress-fill ${progress.isFullyCompleted ? 'is-completed' : ''}`} style={{ width: `${progress.percentage}%`, background: progress.isFullyCompleted ? '#4ade80' : '#38bdf8' }}/>
        </div>
        <div className="unit-banner-progress-meta">
        <span>{progress.completed} من {progress.total} دروس مكتملة</span>{progress.isFullyCompleted && <span>مكتملة بالكامل ✨</span>}</div>
        </div>}
    </div>
    </article>
    <div className="unit-index-controls">
    <div className="unit-index-controls__row">
    <div className="unit-index-search">
    <span>
    <Icon name="search"/>
    </span>
    <input id={searchInputId} type="search" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="ابحث داخل موضوعات وأقسام هذه الوحدة..." aria-label="ابحث داخل موضوعات وأقسام هذه الوحدة"/>{searchQuery && <button type="button" onClick={() => setSearchQuery('')} aria-label="مسح نص البحث">
        <Icon name="close"/>
        </button>}</div>
    <div className="unit-view-switch">
    <span>طريقة العرض:</span>
    <button type="button" aria-pressed={viewMode === 'grouped'} onClick={() => setViewMode('grouped')} className={`secondary-button${viewMode === 'grouped' ? ' is-active' : ''}`}>
    <Icon name="layers"/>
    <span>تقسيم الموضوعات</span>
    </button>
    <button type="button" aria-pressed={viewMode === 'flat'} onClick={() => setViewMode('flat')} className={`secondary-button${viewMode === 'flat' ? ' is-active' : ''}`}>
    <Icon name="file"/>
    <span>قائمة متتابعة</span>
    </button>
    </div>
    </div>
      {types.length > 1 && <div className="unit-type-filters">
        <strong>تصفية حسب القسم:</strong>
        <button type="button" aria-pressed={selectedType === 'all'} onClick={() => setSelectedType('all')} className={`curriculum-keyword-chip${selectedType === 'all' ? ' is-active' : ''}`}>جميع الأقسام ({allItems.length})</button>{types.map(([type, label]) => <button key={type} type="button" aria-pressed={selectedType === type} onClick={() => setSelectedType(selectedType === type ? 'all' : type)} className={`curriculum-keyword-chip${selectedType === type ? ' is-active' : ''}`} style={{ borderColor: selectedType === type ? undefined : sectionTypeColors[type]?.border }}>
            <span>{label}</span>{selectedType === type && <Icon name="close"/>}</button>)}</div>}
    </div>
    {viewMode === 'grouped' ? <div className="index-unit-grouped-experience">
      {diagnostic && <div className="index-diagnostic-strip" style={{ borderRadius: '.85rem', border: '1px solid #fde68a' }}>
            <div className="index-diagnostic-strip__info">
            <span className="index-diagnostic-strip__badge">
            <Icon name={sectionTypeIcons[diagnostic.type] ?? 'clipboard'}/> {diagnostic.typeLabel}</span>
            <strong>{diagnostic.title}</strong>{diagnostic.pageNumber && <span className="page-num">ص {diagnostic.pageNumber}</span>}{diagnostic.description && <span> — {diagnostic.description}</span>}</div>
            <div className="index-diagnostic-actions">
            <SectionCheckButton isFinished={isLessonFinished(diagnostic.id)} onToggle={() => toggleLessonFinished(diagnostic.id)} ariaLabel={`تحديد ${diagnostic.title} كمكتمل`} finishedText="مكتمل" unfinishedText="تحديد كمكتمل"/>
            <Link to={`/lessons/${diagnostic.id}`}>
            <span>افتح الدرس</span>
            <Icon name="arrow-left"/>
            </Link>
            </div>
            </div>}
      {filteredTopics.map((topic, topicIdx) => <section key={topic.id} className="unit-topic-card">
            <div className="unit-topic-card__heading" style={{ background: topicIdx % 2 === 0 ? 'var(--color-warm-surface)' : 'var(--color-surface)' }}>
            <div>
            <span className="unit-topic-number">{topic.number}</span>
            <h2>{topic.title}</h2>
            </div>
            <span className="unit-topic-count">{topic.items.length} {topic.items.length === 1 ? 'قسم داخلي' : 'أقسام داخلية'}</span>
            </div>
            <div className="lesson-list" style={{ padding: '.75rem' }}>{topic.items.map(lessonCard)}</div>
            </section>)}
      {project && <section className="unit-topic-card">
            <div className="unit-topic-card__heading">
            <h2>المشروع التطبيقي</h2>
            </div>
            <div className="lesson-list" style={{ padding: '.75rem' }}>{lessonCard(project, 0)}</div>
            </section>}
      {!filteredTopics.length && !diagnostic && !project && <div className="large-empty-state">
            <Icon name="search"/>
            <h3>لا توجد نتائج تطابق بحثك</h3>
            <p>جرّب تغيير كلمات البحث أو اختيار «جميع الأقسام».</p>
            <button type="button" className="secondary-button" onClick={reset}>إعادة ضبط البحث</button>
            </div>}
    </div> : flat.length ? <div className="lesson-list">{flat.map((lesson, index) => lessonCard(itemsById.get(lesson.id) ?? { ...lesson, type: 'explanation', typeLabel: 'درس' }, index))}</div> : <div className="large-empty-state">
        <Icon name="book"/>
        <h2>لم يُعثر على دروس مطابقة</h2>
        <button type="button" className="secondary-button" onClick={reset}>عرض جميع الدروس</button>
        </div>}
  </div>
    </section>;
}
