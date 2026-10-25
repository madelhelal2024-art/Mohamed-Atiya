import { describe, expect, it } from 'vitest';
import { calculateUnitProgress, getCohortLast7DaysProgress } from '../src/lib/progress';
import { getBadgeSummary } from '../src/lib/badges';
import { getUnitTheme } from '../src/data/curriculum-units-index';
import { filterCurriculum } from '../src/lib/search';
import { curriculum } from '../src/lib/content';
describe('Generalized template behavior', () => {
    it('does not count duplicate lesson IDs or complete an empty unit', () => {
        expect(calculateUnitProgress([], []).isFullyCompleted).toBe(false);
        expect(calculateUnitProgress(['a', 'a', 'b'], ['a'])).toMatchObject({ total: 2, completed: 1, percentage: 50 });
    });
    it('keeps cohort simulation explicitly separate and inside valid bounds', () => {
        for (const cohort of ['top', 'support'] as const) {
            expect(getCohortLast7DaysProgress([], cohort).every(point => point.cumulativeCompleted === 0)).toBe(true);
            expect(getCohortLast7DaysProgress(['a'], cohort).every(point => point.cumulativeCompleted <= 1)).toBe(true);
        }
    });
    it('ignores unrelated local progress when awarding badges', () => {
        expect(getBadgeSummary(['unknown'], [{ id: 'unit', title: 'Unit', lessonIds: ['a'] }]).completedCount).toBe(0);
    });
    it('creates a usable index for a new unconfigured unit', () => {
        const theme = getUnitTheme('new-unit', 'Level', 'Subject', 'Unit', [{ id: 'new-lesson', title: 'Lesson' }]);
        expect(theme.topics[0].items[0].id).toBe('new-lesson');
    });
    it('searches a level name without matching lesson numbers in other levels', () => {
        expect(filterCurriculum(curriculum.levels, 'المستوى 1').matchedUnitsCount).toBe(2);
        expect(filterCurriculum(curriculum.levels, 'غيرموجودXYZ').matchedUnitsCount).toBe(0);
    });
});
