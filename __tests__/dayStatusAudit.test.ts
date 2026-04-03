/**
 * Task 8: DayStatus Audit Tests
 * Tests for getDayStatus() utility function
 * Requirements: 5.1, 5.5
 */

import * as fc from 'fast-check';
import { getDayStatus } from '../utils/dayStatus';
import { DayStatus, DailyProgress } from '../types';

const VALID_STATUSES: DayStatus[] = ['complete', 'partial', 'missed', 'pending', 'future'];

describe('getDayStatus — all 5 statuses', () => {
  it("returns 'future' when isFuture=true", () => {
    expect(getDayStatus(null, false, true)).toBe('future');
    expect(getDayStatus({ morning: true, noon: true, night: true }, true, true)).toBe('future');
  });

  it("returns 'future' when dateKey < startDate (journey hasn't started)", () => {
    expect(getDayStatus(null, false, false, '2025-01-01', '2025-01-02')).toBe('future');
    expect(getDayStatus(null, true, false, '2024-12-31', '2025-01-01')).toBe('future');
  });

  it("returns 'pending' when progress=null and isToday=true", () => {
    expect(getDayStatus(null, true)).toBe('pending');
    expect(getDayStatus(null, true, false)).toBe('pending');
  });

  it("returns 'missed' when progress=null and isToday=false", () => {
    expect(getDayStatus(null, false)).toBe('missed');
    expect(getDayStatus(null, false, false)).toBe('missed');
  });

  it("returns 'complete' when all three slots are true", () => {
    const progress: DailyProgress = { morning: true, noon: true, night: true };
    expect(getDayStatus(progress, false)).toBe('complete');
    expect(getDayStatus(progress, true)).toBe('complete');
  });

  it("returns 'pending' when partial progress and isToday=true", () => {
    const progress: DailyProgress = { morning: true, noon: false, night: false };
    expect(getDayStatus(progress, true)).toBe('pending');
  });

  it("returns 'partial' when partial progress and isToday=false", () => {
    const progress: DailyProgress = { morning: true, noon: false, night: false };
    expect(getDayStatus(progress, false)).toBe('partial');
  });
});

/**
 * Property 11: Day Status Completeness
 * getDayStatus() always returns one of the 5 valid DayStatus values
 * Validates: Requirements 5.1
 */
describe('Property 11: Day Status Completeness', () => {
  it('always returns one of the 5 valid DayStatus values for any input combination', () => {
    const progressArb = fc.oneof(
      fc.constant(null),
      fc.record({
        morning: fc.boolean(),
        noon: fc.boolean(),
        night: fc.boolean(),
      })
    );

    // Generate YYYY-MM-DD strings directly to avoid invalid Date issues
    const dateStringArb = fc
      .tuple(
        fc.integer({ min: 2020, max: 2030 }),
        fc.integer({ min: 1, max: 12 }),
        fc.integer({ min: 1, max: 28 })
      )
      .map(([y, m, d]) => `${y}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`);

    const dateKeyArb = fc.oneof(fc.constant(undefined), dateStringArb);

    const startDateArb = fc.oneof(fc.constant(undefined), fc.constant(null), dateStringArb);

    fc.assert(
      fc.property(
        progressArb,
        fc.boolean(),
        fc.boolean(),
        dateKeyArb,
        startDateArb,
        (progress, isToday, isFuture, dateKey, startDate) => {
          const result = getDayStatus(
            progress as DailyProgress | null,
            isToday,
            isFuture,
            dateKey as string | undefined,
            startDate as string | null | undefined
          );
          return VALID_STATUSES.includes(result);
        }
      ),
      { numRuns: 500 }
    );
  });
});
