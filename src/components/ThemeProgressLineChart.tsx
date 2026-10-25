import { useMemo } from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getCohortLast7DaysProgress, type DailyProgressPoint, type StudentCohort, useLessonProgress } from '../lib/progress';
import { Icon } from './Icon';
export interface ThemeProgressLineChartProps {
    themeTitle: string;
    themeLessonIds: string[];
    completedLessonIds?: string[];
    colorScheme?: 'emerald' | 'indigo' | 'amber';
    studentCohort?: StudentCohort;
}
function CustomTooltip({ active, payload, label }: {
    active?: boolean;
    payload?: readonly {
        value?: number | string;
        payload?: DailyProgressPoint;
    }[];
    label?: string | number;
}) {
    const data = payload?.[0]?.payload;
    if (!active || !data)
        return null;
    return <div className="index-recharts-tooltip">
    <div className="index-recharts-tooltip__header">
    <span>{label}</span>
    <span>{data.date}</span>
    </div>
    <div className="index-recharts-tooltip__body">
    <div className="index-recharts-tooltip__row">
    <span className="index-recharts-tooltip__dot"/>
    <span>الدروس المكتملة تراكمياً:</span>
    <strong>{data.cumulativeCompleted} دروس</strong>
    </div>{data.completedDaily > 0 && <div className="index-recharts-tooltip__daily">(+{data.completedDaily} في هذا اليوم)</div>}</div>
    </div>;
}
export function ThemeProgressLineChart({ themeTitle, themeLessonIds, completedLessonIds, colorScheme = 'emerald', studentCohort = 'all' }: ThemeProgressLineChartProps) {
    const progress = useLessonProgress();
    const ids = completedLessonIds ?? progress.completedLessonIds;
    const data = useMemo(() => getCohortLast7DaysProgress(themeLessonIds, studentCohort, ids), [themeLessonIds, studentCohort, ids]);
    const last = data.at(-1)?.cumulativeCompleted ?? 0, weekly = data.reduce((sum, p) => sum + p.completedDaily, 0), stroke = colorScheme === 'indigo' ? '#4f46e5' : colorScheme === 'amber' ? '#d97706' : '#059669';
    const total = new Set(themeLessonIds).size, max = Math.max(total, 1, ...data.map(d => d.cumulativeCompleted));
    const reduced = typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    return <div className="index-line-chart-section" data-testid="theme-recharts-line-chart" aria-label={`تقدم دروس ${themeTitle} خلال آخر 7 أيام`}>
  <div className="index-line-chart-header">
    <div className="index-line-chart-header__title-group">
    <span className="index-line-chart-header__icon">
    <Icon name="trending-up"/>
    </span>
    <div>
    <h4 className="index-line-chart-header__title">تقدم إنجاز الدروس خلال آخر 7 أيام</h4>
    <p className="index-line-chart-header__subtitle">متابعة التعلم في {themeTitle}<span className="index-line-chart-header__cohort-tag">{studentCohort === 'all' ? ' · تقدم هذا المتصفح فقط' : ' · محاكاة تعليمية — ليست سجلات طلاب'}</span>
    </p>
    </div>
    </div>
    <div className="index-line-chart-header__stats">
    <span className="index-line-chart-chip">
    <span className="index-line-chart-chip__indicator" style={{ background: stroke }}/>المكتمل: <strong>{last} من {total}</strong>
    </span>{weekly > 0 && <span className="index-line-chart-chip index-line-chart-chip--active">هذا الأسبوع: <strong>+{weekly}</strong>
        </span>}</div>
    </div>
  <div className="index-line-chart-container" style={{ width: '100%', height: 180, direction: 'ltr' }}>
    <ResponsiveContainer width="100%" height={180}>
    <LineChart data={data} margin={{ top: 16, right: 24, left: -16, bottom: 6 }}>
    <CartesianGrid strokeDasharray="3 3" stroke="var(--border,#e2e8f0)" vertical={false} opacity={.65}/>
    <XAxis dataKey="dayLabel" tick={{ fontSize: 11, fill: 'var(--muted,#64748b)' }} axisLine={{ stroke: 'var(--border,#cbd5e1)' }} tickLine={false}/>
    <YAxis allowDecimals={false} domain={[0, max]} tick={{ fontSize: 11, fill: 'var(--muted,#64748b)' }} axisLine={false} tickLine={false}/>
    <Tooltip content={<CustomTooltip />} cursor={{ stroke, strokeWidth: 1.5, strokeDasharray: '4 4' }}/>
    <Line type="monotone" dataKey="cumulativeCompleted" name="الدروس المكتملة" stroke={stroke} strokeWidth={3} dot={{ r: 4, fill: '#ffffff', stroke, strokeWidth: 2.5 }} activeDot={{ r: 6.5, fill: stroke, stroke: '#ffffff', strokeWidth: 2.5 }} isAnimationActive={!reduced} animationDuration={800}/>
    </LineChart>
    </ResponsiveContainer>
    </div>
  <div className="index-line-chart-footer">
    <span>
    <Icon name="check-circle"/> {studentCohort === 'all' ? 'يتحدث المخطط عند تحديد الدرس كمكتمل في هذا المتصفح.' : 'هذه بيانات تمثيلية لشرح شكل التقرير فقط.'}</span>
    </div>
  <details className="chart-data-table">
    <summary>عرض البيانات نصيًا</summary>
    <table>
    <caption>{studentCohort === 'all' ? 'إنجاز محلي' : 'بيانات محاكاة'}</caption>
    <thead>
    <tr>
    <th>التاريخ</th>
    <th>إنجاز اليوم</th>
    <th>الإجمالي</th>
    </tr>
    </thead>
    <tbody>{data.map(row => <tr key={row.date}>
        <td>{row.date}</td>
        <td>{row.completedDaily}</td>
        <td>{row.cumulativeCompleted}</td>
        </tr>)}</tbody>
    </table>
    </details>
 </div>;
}
