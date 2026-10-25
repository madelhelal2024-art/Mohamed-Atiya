import { lazy, Suspense, useId, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { Icon } from '../components/Icon';
import { UnitAchievementBadge } from '../components/LearningBadges';
import { curriculum, unitPath } from '../lib/content';
import { useLessonProgress } from '../lib/progress';
import { filterCurriculum } from '../lib/search';
import display from '../data/curriculum-display.json';
import { isSafeContentUrl } from '../lib/urls';
const CurriculumIndexViewer = lazy(() => import('../components/CurriculumIndexViewer').then(module => ({ default: module.CurriculumIndexViewer })));
const levelCovers: Record<string, string> = display.levelCovers;
const suggested = display.suggestedKeywords.length ? display.suggestedKeywords : curriculum.levels.flatMap((level) => level.subjects.flatMap((subject) => subject.units.map((unit) => unit.title)));
const SUGGESTED_KEYWORDS = [...new Set(suggested)].slice(0, 7);
export function CurriculumPage() {
    const { getUnitProgress } = useLessonProgress();
    const [showDetailed, setShowDetailed] = useState(false);
    const [searchQuery, setSearchQuery] = useState(''), searchInputRef = useRef<HTMLInputElement>(null), searchInputId = useId();
    const { filteredLevels, matchedUnitsCount, totalUnitsCount, isSearching } = useMemo(() => filterCurriculum(curriculum.levels, searchQuery), [searchQuery]);
    const handleClearSearch = () => { setSearchQuery(''); searchInputRef.current?.focus(); };
    const handleKeywordClick = (keyword: string) => { setSearchQuery(searchQuery.trim() === keyword ? '' : keyword); searchInputRef.current?.focus(); };
    return <section className="page-section curriculum-page">
    <div className="container">
    <Breadcrumbs items={[{ label: 'الرئيسية', to: '/' }, { label: 'المناهج' }]}/>
    <header className="page-heading">
    <p className="section-kicker">مسارك التعليمي</p>
    <h1 id="page-title" tabIndex={-1}>المناهج والدروس</h1>
    <p>تابع تقدمك الدراسي ونسبة إنجاز كل وحدة مع الدروس المكتملة.</p>
    </header>
    <div className="detailed-index-entry">
    <button type="button" className="secondary-button" aria-expanded={showDetailed} onClick={() => setShowDetailed(value => !value)}>
    <Icon name="layers"/>{showDetailed ? "إخفاء الفهرس التفصيلي" : "الفهرس التفصيلي والإحصائيات"}</button>
    <small>عرض الأقسام الداخلية ورسوم التقدم</small>
    </div>
    {showDetailed && <Suspense fallback={<p role="status">جارٍ فتح الفهرس...</p>}>
        <CurriculumIndexViewer />
        </Suspense>}
    <div className="curriculum-search-container" role="search" aria-label="البحث في الوحدات والمناهج">
      <div className="curriculum-search-input-wrapper">
    <span className="curriculum-search-icon" aria-hidden="true">
    <Icon name="search"/>
    </span>
    <input id={searchInputId} ref={searchInputRef} type="search" className="curriculum-search-input" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => { if (e.key === 'Escape')
        handleClearSearch(); }} placeholder="ابحث باسم الوحدة أو الدرس أو المادة..." aria-label="ابحث عن وحدة باسمها أو كلمة مفتاحية" autoComplete="off" spellCheck={false}/>{searchQuery.trim() && <button type="button" className="curriculum-search-clear" onClick={handleClearSearch} aria-label="مسح نص البحث" title="مسح البحث">
        <Icon name="close"/>
        </button>}</div>
      {SUGGESTED_KEYWORDS.length > 0 && <div className="curriculum-search-suggestions">
        <span className="curriculum-search-suggestions-label">وصول سريع:</span>{SUGGESTED_KEYWORDS.map((keyword) => <button key={keyword} type="button" className={`curriculum-keyword-chip${searchQuery.trim() === keyword ? ' is-active' : ''}`} onClick={() => handleKeywordClick(keyword)} aria-pressed={searchQuery.trim() === keyword}>
            <span>{keyword}</span>{searchQuery.trim() === keyword && <Icon name="close"/>}</button>)}</div>}
      {isSearching && <div className="curriculum-search-feedback" aria-live="polite">
        <span className="curriculum-search-feedback-text">
        <Icon name="search"/>
        <span>تم العثور على <strong>{matchedUnitsCount}</strong> {matchedUnitsCount === 1 ? 'وحدة' : 'وحدات'} من أصل {totalUnitsCount} وحدة</span>
        </span>
        <button type="button" className="curriculum-search-reset-link" onClick={handleClearSearch}>مسح التصفية</button>
        </div>}
    </div>
    {!curriculum.levels.length ? <div className="large-empty-state">
        <Icon name="book"/>
        <h2>لم تُضف مناهج بعد</h2>
        <p>ستظهر المستويات والوحدات هنا عند إضافتها.</p>
        </div> : isSearching && !filteredLevels.length ? <div className="large-empty-state">
        <Icon name="search"/>
        <h2>لا توجد وحدات تطابق «{searchQuery}»</h2>
        <p>جرّب البحث باسم الوحدة أو كلمة من عنوان الدرس أو المادة الدراسية.</p>
        <button type="button" className="secondary-button" onClick={handleClearSearch}>عرض جميع الوحدات</button>
        </div> : <div className="curriculum-levels">{filteredLevels.map((level) => {
                const cover = levelCovers[level.id], originalLevel = curriculum.levels.find((l) => l.id === level.id)!;
                const allLevelLessonIds = originalLevel.subjects.flatMap((s) => s.units.flatMap((u) => u.lessons.map((l) => l.id))), levelProgress = getUnitProgress(allLevelLessonIds);
                return <section className="level-block" key={level.id}>
                <div className="level-heading">{cover && isSafeContentUrl(cover) && <img alt={`غلاف ${level.title}`} loading="lazy" src={cover} style={{ width: '88px', height: '118px', flex: '0 0 auto', objectFit: 'cover', border: '1px solid var(--border)', borderRadius: '.85rem', background: 'var(--color-warm-surface)', boxShadow: 'var(--shadow-sm)' }}/>}<span className="level-icon">
                <Icon name="layers"/>
                </span>
                <div className="level-heading__meta">{level.stage && <p>{level.stage}</p>}<h2>{level.title}</h2>{allLevelLessonIds.length > 0 && <div className="level-progress-summary">
                    <span className="level-progress-badge">
                    <Icon name={levelProgress.isFullyCompleted ? 'check-circle' : 'check'}/>
                    <span>إنجاز المستوى: {levelProgress.percentage}%</span>
                    </span>
                    <span className="level-progress-counts">({levelProgress.completed} من {levelProgress.total} درس)</span>
                    </div>}</div>
                </div>
        <div className="subject-list">{level.subjects.map((subject) => {
                        const originalSubject = originalLevel.subjects.find((s) => s.id === subject.id);
                        return <section className="subject-block" key={subject.id}>
                        <h3>{subject.title}</h3>{subject.units.length ? <div className="unit-grid">{subject.units.map((unit) => {
                                    const progress = getUnitProgress(unit.lessons.map((l) => l.id)), originalIndex = originalSubject?.units.findIndex((u) => u.id === unit.id) ?? 0;
                                    return <Link className={`unit-card${progress.isFullyCompleted ? ' unit-card--completed' : ''}`} key={unit.id} to={unitPath(level.id, subject.id, unit.id)}>
                                    <span className="unit-number">{String(originalIndex + 1).padStart(2, '0')}</span>
                                    <div className="unit-card__details">
                                    <h4>{unit.title}</h4>{unit.description && <p>{unit.description}</p>}<div className="unit-card__stats">
                                    <span className="lesson-count">
                                    <Icon name="book"/> {unit.lessons.length} {unit.lessons.length === 1 ? 'درس' : 'دروس'}</span>
                                    <span className="unit-index-label">
                                    <Icon name="layers"/> الفهرس والأقسام الداخلية</span>
                                    <span className={`unit-completion-badge ${progress.isFullyCompleted ? 'is-completed' : progress.percentage > 0 ? 'is-in-progress' : 'is-not-started'}`}>
                                    <Icon name={progress.isFullyCompleted ? 'check-circle' : 'check'}/>
                                    <strong>{progress.percentage}%</strong> مكتمل</span>
                                    </div>
                                    <div aria-label={`نسبة إنجاز الوحدة ${progress.percentage}%`} aria-valuemax={100} aria-valuemin={0} aria-valuenow={progress.percentage} className="unit-progress-track" role="progressbar">
                                    <div className={`unit-progress-fill ${progress.isFullyCompleted ? 'is-completed' : ''}`} style={{ width: `${progress.percentage}%` }}/>
                                    </div>
                                    <div className="unit-progress-footer">
                                    <span className="unit-completed-text">{progress.completed} من {progress.total} {progress.total === 1 ? 'درس مكتمل' : 'دروس مكتملة'}</span>{progress.isFullyCompleted && <span className="unit-completed-tag">مكتملة بالكامل ✨</span>}</div>
                                    <UnitAchievementBadge completed={progress.isFullyCompleted} unitTitle={unit.title}/>
                                    </div>
                                    <span className="card-arrow">
                                    <Icon name="arrow-left"/>
                                    </span>
                                    </Link>;
                                })}</div> : <p className="inline-empty">لم تُضف وحدات لهذه المادة بعد.</p>}</section>;
                    })}</div>
      </section>;
            })}</div>}
  </div>
    </section>;
}
