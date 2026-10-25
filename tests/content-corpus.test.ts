import { describe, expect, it } from 'vitest';
import curriculum from '../src/data/curriculum.json';
import unitIndex from '../src/data/unit-index.json';
import { validateCurriculum, validateLesson } from '../src/content/schema';
import fs from 'fs';
import path from 'path';

describe('Content Corpus Integrity', () => {
  it('validates the live curriculum', () => {
    const res = validateCurriculum(curriculum);
    expect(res.valid).toBe(true);
    expect(res.errors).toHaveLength(0);
  });

  it('contains exactly 4 levels, 8 units, and 24 lessons in curriculum', () => {
    expect(curriculum.levels).toHaveLength(4);

    let unitCount = 0;
    let lessonIds: string[] = [];

    for (const level of curriculum.levels) {
      for (const domain of level.domains) {
        for (const unit of domain.units) {
          unitCount++;
          for (const l of unit.lessons) {
            lessonIds.push(l.id);
          }
        }
      }
    }

    expect(unitCount).toBe(8);
    expect(lessonIds).toHaveLength(24);
  });

  it('matches all unit-index entries with curriculum units', () => {
    expect(unitIndex.units).toHaveLength(8);
    const unitIds = new Set(unitIndex.units.map((u) => u.unitId));

    for (const level of curriculum.levels) {
      for (const domain of level.domains) {
        for (const unit of domain.units) {
          expect(unitIds.has(unit.id)).toBe(true);
        }
      }
    }
  });

  it('verifies that every single lesson JSON file exists and is valid', () => {
    const lessonsDir = path.join(process.cwd(), 'src/data/lessons');
    const files = fs.readdirSync(lessonsDir).filter((f) => f.endsWith('.json'));
    expect(files).toHaveLength(24);

    for (const file of files) {
      const data = JSON.parse(fs.readFileSync(path.join(lessonsDir, file), 'utf-8'));
      const validation = validateLesson(data);
      expect(validation.valid).toBe(true);
      expect(validation.errors).toHaveLength(0);
    }
  });
});
