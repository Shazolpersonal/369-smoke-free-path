/**
 * Edge Case Audit Tests (Task 14)
 *
 * Verifies boundary conditions for journey completion, content cycling,
 * affirmation fallbacks, day status before startDate, and elapsed days minimum.
 *
 * Validates: Requirements 8.6, 8.7, 8.8
 *
 * Property 15: Journey Complete Boundary
 * Property 16: Elapsed Days Minimum
 */

import * as fc from 'fast-check';
import { getContentIndex, getAffirmationByLanguage } from '../utils/contentCycler';
import { getDayStatus } from '../utils/dayStatus';
import {
  calculateEffectiveElapsedDays,
  isJourneyComplete,
  getDisplayDay,
  formatLocalDateKey,
} from '../utils/timeSlotManager';

// Capture real Date before any mocking
const RealDate = global.Date;

// ---------------------------------------------------------------------------
// 1. Journey complete boundary — isJourneyComplete & getDisplayDay
// ---------------------------------------------------------------------------

describe('Journey complete boundary (Req 8.7)', () => {
  it('isJourneyComplete(368) → false', () => {
    expect(isJourneyComplete(368)).toBe(false);
  });

  it('isJourneyComplete(369) → true', () => {
    expect(isJourneyComplete(369)).toBe(true);
  });

  it('isJourneyComplete(370) → true', () => {
    expect(isJourneyComplete(370)).toBe(true);
  });

  it('isJourneyComplete(1000) → true', () => {
    expect(isJourneyComplete(1000)).toBe(true);
  });

  it('getDisplayDay(369) → 369 (caps at 369)', () => {
    expect(getDisplayDay(369)).toBe(369);
  });

  it('getDisplayDay(370) → 369 (caps at 369)', () => {
    expect(getDisplayDay(370)).toBe(369);
  });

  it('getDisplayDay(1000) → 369 (caps at 369)', () => {
    expect(getDisplayDay(1000)).toBe(369);
  });

  it('getDisplayDay(1) → 1 (below cap)', () => {
    expect(getDisplayDay(1)).toBe(1);
  });
});

// ---------------------------------------------------------------------------
// 2. getContentIndex at journey complete boundary
// ---------------------------------------------------------------------------

describe('getContentIndex() — journey complete boundary', () => {
  it('getContentIndex(369) → valid index in [0, 40]', () => {
    const index = getContentIndex(369);
    expect(index).toBeGreaterThanOrEqual(0);
    expect(index).toBeLessThanOrEqual(40);
  });

  it('getContentIndex(370) → valid index in [0, 40]', () => {
    const index = getContentIndex(370);
    expect(index).toBeGreaterThanOrEqual(0);
    expect(index).toBeLessThanOrEqual(40);
  });

  it('getContentIndex(369) equals (369-1) % 41 = 368 % 41 = 40', () => {
    expect(getContentIndex(369)).toBe(40);
  });

  it('getContentIndex(370) equals (370-1) % 41 = 369 % 41 = 0', () => {
    expect(getContentIndex(370)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 3. getAffirmationByLanguage() — fallback for day=0 and day=-1 (Req 8.8)
// ---------------------------------------------------------------------------

describe('getAffirmationByLanguage() — fallback, no crash (Req 8.8)', () => {
  it('day=0, morning, en → non-empty fallback string, no crash', () => {
    let result: string;
    expect(() => {
      result = getAffirmationByLanguage(0, 'morning', 'en');
    }).not.toThrow();
    result = getAffirmationByLanguage(0, 'morning', 'en');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('day=-1, morning, bn → non-empty fallback string, no crash', () => {
    let result: string;
    expect(() => {
      result = getAffirmationByLanguage(-1, 'morning', 'bn');
    }).not.toThrow();
    result = getAffirmationByLanguage(-1, 'morning', 'bn');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// 4. getDayStatus() — 'future' for dates before startDate (Req 8.6)
// ---------------------------------------------------------------------------

describe('getDayStatus() — future for dates before startDate (Req 8.6)', () => {
  it('getDayStatus(null, false, false, "2025-01-01", "2025-01-02") → "future"', () => {
    // dateKey "2025-01-01" is before startDate "2025-01-02"
    const result = getDayStatus(null, false, false, '2025-01-01', '2025-01-02');
    expect(result).toBe('future');
  });

  it('getDayStatus(null, false, false, "2024-12-31", "2025-01-01") → "future"', () => {
    const result = getDayStatus(null, false, false, '2024-12-31', '2025-01-01');
    expect(result).toBe('future');
  });

  it('getDayStatus(null, false, false, "2025-01-02", "2025-01-02") → "missed" (same date, not before)', () => {
    // dateKey equals startDate → not before, so not 'future' due to startDate check
    const result = getDayStatus(null, false, false, '2025-01-02', '2025-01-02');
    expect(result).toBe('missed');
  });
});

// ---------------------------------------------------------------------------
// 5. calculateEffectiveElapsedDays — same start and current date → returns 1
// ---------------------------------------------------------------------------

describe('calculateEffectiveElapsedDays() — same start and current date → 1', () => {
  afterEach(() => jest.restoreAllMocks());

  it('same start and current date → returns 1 (minimum)', () => {
    // Mock "now" to be the same calendar day as startDate, at noon (well past 5 AM boundary)
    const startDate = '2025-06-15';
    const mockNow = new RealDate(2025, 5, 15, 12, 0, 0, 0); // June 15, 2025 12:00

    jest.spyOn(global, 'Date').mockImplementation((...args: any[]) => {
      if (args.length === 0) return mockNow;
      return new RealDate(...(args as []));
    });

    const result = calculateEffectiveElapsedDays(startDate);
    expect(result).toBe(1);
  });

  it('start date one day before current → returns 2', () => {
    const startDate = '2025-06-14';
    const mockNow = new RealDate(2025, 5, 15, 12, 0, 0, 0); // June 15, 2025 12:00

    jest.spyOn(global, 'Date').mockImplementation((...args: any[]) => {
      if (args.length === 0) return mockNow;
      return new RealDate(...(args as []));
    });

    const result = calculateEffectiveElapsedDays(startDate);
    expect(result).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// Property 15: Journey Complete Boundary (fast-check)
// Validates: Requirements 8.7
// ---------------------------------------------------------------------------

describe('Property 15 — Journey Complete Boundary', () => {
  /**
   * **Validates: Requirements 8.7**
   *
   * For any totalElapsedDays d ≥ 369:
   *   - isJourneyComplete(d) returns true
   *   - getDisplayDay(d) returns 369
   *
   * Additionally, for any d ≥ 369, getContentIndex(d) returns a valid index in [0, 40].
   */
  it('Property 15: for any d ≥ 369, isJourneyComplete returns true, getDisplayDay returns 369, getContentIndex in [0,40]', () => {
    fc.assert(
      fc.property(fc.integer({ min: 369, max: 100_000 }), (d) => {
        const journeyComplete = isJourneyComplete(d);
        const displayDay = getDisplayDay(d);
        const contentIndex = getContentIndex(d);

        return (
          journeyComplete === true &&
          displayDay === 369 &&
          contentIndex >= 0 &&
          contentIndex <= 40
        );
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 16: Elapsed Days Minimum (fast-check)
// Validates: Requirements 8.6
// ---------------------------------------------------------------------------

describe('Property 16 — Elapsed Days Minimum', () => {
  afterEach(() => jest.restoreAllMocks());

  /**
   * **Validates: Requirements 8.6**
   *
   * calculateEffectiveElapsedDays always returns ≥ 1 for any valid startDate.
   * We test by mocking "now" to be the same day as startDate (worst case: minimum).
   */
  it('Property 16: calculateEffectiveElapsedDays always returns ≥ 1 for any valid startDate', () => {
    fc.assert(
      fc.property(
        fc.record({
          year: fc.integer({ min: 2020, max: 2030 }),
          month: fc.integer({ min: 0, max: 11 }),
          day: fc.integer({ min: 1, max: 28 }),
          // Use hours 5–23 to ensure we're in the current effective day (past 5 AM boundary)
          hour: fc.integer({ min: 5, max: 23 }),
        }),
        ({ year, month, day, hour }) => {
          const mockNow = new RealDate(year, month, day, hour, 0, 0, 0);
          jest.spyOn(global, 'Date').mockImplementation((...args: any[]) => {
            if (args.length === 0) return mockNow;
            return new RealDate(...(args as []));
          });

          const startDateKey = formatLocalDateKey(new RealDate(year, month, day));
          const result = calculateEffectiveElapsedDays(startDateKey);

          jest.restoreAllMocks();

          return result >= 1;
        },
      ),
    );
  });
});
