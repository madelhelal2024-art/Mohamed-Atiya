import unitIndexData from './unit-index.json';
import { UnitIndexEntry } from '../types/content';

export const unitIndexEntries: UnitIndexEntry[] = unitIndexData.units as UnitIndexEntry[];

export function getUnitIndexEntry(unitId: string): UnitIndexEntry | undefined {
  return unitIndexEntries.find((u) => u.unitId === unitId);
}

export function getTopicsForLesson(lessonId: string) {
  const result = [];
  for (const unit of unitIndexEntries) {
    for (const topic of unit.topics) {
      if (topic.lessonId === lessonId) {
        result.push({ ...topic, unitTitle: unit.title, themeColor: unit.themeColor });
      }
    }
  }
  return result;
}
