/**
 * Task 10: ProgressContext Streak Calculation Audit Tests
 * Tests for calculateTrueStreak(), isTodayComplete, currentDayInCycle, currentCycle
 * Requirements: 7.3, 7.4, 3.2
 */

import * as fc from 'fast-check';
import { DailyProgress } from '../types';
import { formatLocalDateKey } from '../utils/timeSlotManager';

// ---------------------------------------------------------------------------
// Replicated logic from ProgressContext.tsx (functions are not exported)
// ---------------------------------------------------------------------------

const MAX_STREAK_ITERATIONS = 1000;

const getLocalDateKey = (date?: Date): string => {
  const d = date || new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const parseToLocalDate = (dateStr: string): Date => {
  if (dateStr.includes('T')) {
    const d = new Date(dateStr);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate());
  }
  const [year, month, day] = dateStr.split('-').map(Number);
  return new Date(year, month - 1, day);
};

const calculateTrueStreak = (
  dailyProgress: Record<string, DailyProgress>,
  startDate: string | null,
  now: Date
): number => {
  if (!startDate) return 0;

  const startDateObj = parseToLocalDate(startDate);
  startDateObj.setHours(0, 0, 0, 0);

  const hour = now.getHours();
  const effectiveToday = new Date(now);
  if (hour < 5) {
    effectiveToday.setDate(effectiveToday.getDate() - 1);
  }
  effectiveToday.setHours(0, 0, 0, 0);

  const checkDate = new Date(effectiveToday);
  checkDate.setDate(checkDate.getDate() - 1);

  let streak = 0;
  let iterations = 0;

  while (iterations < MAX_STREAK_ITERATIONS) {
    if (checkDate < startDateObj) break;

    const dateKey = getLocalDateKey(checkDate);
    const progress = dailyProgress[dateKey];

    if (progress && progress.morning && progress.noon && progress.night) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }

    iterations++;
  }

  // Check if today is also complete
  const todayKey =
    hour < 5
      ? formatLocalDateKey(new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1))
      : formatLocalDateKey(now);
  const todayProgress = dailyProgress[todayKey];
  if (todayProgress && todayProgress.morning && todayProgress.noon && todayProgress.night) {
    streak++;
  }

  return streak;
};

// Cycle formulas (replicated from ProgressContext.tsx)
const calcCurrentDayInCycle = (totalElapsedDays: number): number =>
  ((totalElapsedDays - 1) % 41) + 1;

const calcCurrentCycle = (totalElapsedDays: number): number =>
  Math.floor((totalElapsedDays - 1) / 41) + 1;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Build a dailyProgress record with N consecutive complete days ending on `endDate` */
function makeConsecutiveProgress(
  endDate: Date,
  count: number
): Record<string, DailyProgress> {
  const result: Record<string, DailyProgress> = {};
  for (let i = 0; i < count; i++) {
    const d = new Date(endDate);
    d.setDate(d.getDate() - i);
    result[getLocalDateKey(d)] = { morning: true, noon: true, night: true };
  }
  return result;
}

// ---------------------------------------------------------------------------
// calculateTrueStreak — MAX_STREAK_ITERATIONS guard
// ---------------------------------------------------------------------------

describe('calculateTrueStreak — MAX_STREAK_ITERATIONS guard', () => {
  it('handles 300+ complete days without exceeding 1000 iterations', () => {
    // Build 350 consecutive complete days ending yesterday
    const now = new Date(2025, 5, 1, 10, 0, 0); // June 1 2025, 10 AM
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const startDate = getLocalDateKey(
      new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate() - 349)
    );

    const dailyProgress = makeConsecutiveProgress(yesterday, 350);

    // Should not throw, should return a value ≤ MAX_STREAK_ITERATIONS
    const streak = calculateTrueStreak(dailyProgress, startDate, now);
    expect(streak).toBeGreaterThan(0);
    expect(streak).toBeLessThanOrEqual(MAX_STREAK_ITERATIONS + 1); // +1 for today check
  });

  it('streak is capped by MAX_STREAK_ITERATIONS even with unlimited complete days', () => {
    // Build 1500 consecutive complete days — the guard must kick in at 1000
    const now = new Date(2025, 5, 1, 10, 0, 0);
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);

    const startDate = '2020-01-01'; // far in the past

    // Fill 1500 days of complete progress
    const dailyProgress: Record<string, DailyProgress> = {};
    for (let i = 0; i < 1500; i++) {
      const d = new Date(yesterday);
      d.setDate(d.getDate() - i);
      dailyProgress[getLocalDateKey(d)] = { morning: true, noon: true, night: true };
    }

    const streak = calculateTrueStreak(dailyProgress, startDate, now);
    // The while loop runs at most MAX_STREAK_ITERATIONS (1000) times
    // Plus 1 for today check = max 1001
    expect(streak).toBeLessThanOrEqual(MAX_STREAK_ITERATIONS + 1);
  });
});

// ---------------------------------------------------------------------------
// calculateTrueStreak — consecutive complete days
// ---------------------------------------------------------------------------

describe('calculateTrueStreak — consecutive complete days', () => {
  it('counts 3 consecutive complete days correctly', () => {
    const now = new Date(2025, 0, 10, 10, 0, 0); // Jan 10, 10 AM
    const startDate = '2025-01-01';

    // Jan 7, 8, 9 complete (yesterday = Jan 9)
    const dailyProgress: Record<string, DailyProgress> = {
      '2025-01-07': { morning: true, noon: true, night: true },
      '2025-01-08': { morning: true, noon: true, night: true },
      '2025-01-09': { morning: true, noon: true, night: true },
    };

    const streak = calculateTrueStreak(dailyProgress, startDate, now);
    expect(streak).toBe(3);
  });

  it('counts 1 complete day (only yesterday complete)', () => {
    const now = new Date(2025, 0, 10, 10, 0, 0);
    const startDate = '2025-01-01';

    const dailyProgress: Record<string, DailyProgress> = {
      '2025-01-09': { morning: true, noon: true, night: true },
    };

    const streak = calculateTrueStreak(dailyProgress, startDate, now);
    expect(streak).toBe(1);
  });

  it('returns 0 when no days are complete', () => {
    const now = new Date(2025, 0, 10, 10, 0, 0);
    const startDate = '2025-01-01';

    const streak = calculateTrueStreak({}, startDate, now);
    expect(streak).toBe(0);
  });

  it('returns 0 when startDate is null', () => {
    const now = new Date(2025, 0, 10, 10, 0, 0);
    const streak = calculateTrueStreak({}, null, now);
    expect(streak).toBe(0);
  });

  it('includes today in streak when today is also complete', () => {
    const now = new Date(2025, 0, 10, 10, 0, 0); // Jan 10, 10 AM
    const startDate = '2025-01-01';

    // Jan 9 (yesterday) and Jan 10 (today) both complete
    const dailyProgress: Record<string, DailyProgress> = {
      '2025-01-09': { morning: true, noon: true, night: true },
      '2025-01-10': { morning: true, noon: true, night: true },
    };

    const streak = calculateTrueStreak(dailyProgress, startDate, now);
    expect(streak).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// calculateTrueStreak — streak resets on incomplete day
// ---------------------------------------------------------------------------

describe('calculateTrueStreak — streak resets on incomplete day', () => {
  it('resets streak when a day has only morning complete', () => {
    const now = new Date(2025, 0, 10, 10, 0, 0);
    const startDate = '2025-01-01';

    const dailyProgress: Record<string, DailyProgress> = {
      '2025-01-07': { morning: true, noon: true, night: true },
      '2025-01-08': { morning: true, noon: false, night: false }, // incomplete — breaks streak
      '2025-01-09': { morning: true, noon: true, night: true },
    };

    // Streak goes back from Jan 9 (yesterday): Jan 9 complete, Jan 8 incomplete → streak = 1
    const streak = calculateTrueStreak(dailyProgress, startDate, now);
    expect(streak).toBe(1);
  });

  it('resets streak when a day has no progress entry', () => {
    const now = new Date(2025, 0, 10, 10, 0, 0);
    const startDate = '2025-01-01';

    const dailyProgress: Record<string, DailyProgress> = {
      '2025-01-07': { morning: true, noon: true, night: true },
      // Jan 8 missing — breaks streak
      '2025-01-09': { morning: true, noon: true, night: true },
    };

    const streak = calculateTrueStreak(dailyProgress, startDate, now);
    expect(streak).toBe(1);
  });

  it('streak does not go before startDate', () => {
    const now = new Date(2025, 0, 10, 10, 0, 0);
    const startDate = '2025-01-08'; // started Jan 8

    // Jan 8 and Jan 9 complete, but startDate is Jan 8 so we can't go before it
    const dailyProgress: Record<string, DailyProgress> = {
      '2025-01-08': { morning: true, noon: true, night: true },
      '2025-01-09': { morning: true, noon: true, night: true },
    };

    const streak = calculateTrueStreak(dailyProgress, startDate, now);
    expect(streak).toBe(2);
  });
});

// ---------------------------------------------------------------------------
// isTodayComplete logic
// ---------------------------------------------------------------------------

describe('isTodayComplete logic', () => {
  it('is true when morning && noon && night are all true', () => {
    const progress: DailyProgress = { morning: true, noon: true, night: true };
    const isTodayComplete = progress.morning && progress.noon && progress.night;
    expect(isTodayComplete).toBe(true);
  });

  it('is false when morning is false', () => {
    const progress: DailyProgress = { morning: false, noon: true, night: true };
    const isTodayComplete = progress.morning && progress.noon && progress.night;
    expect(isTodayComplete).toBe(false);
  });

  it('is false when noon is false', () => {
    const progress: DailyProgress = { morning: true, noon: false, night: true };
    const isTodayComplete = progress.morning && progress.noon && progress.night;
    expect(isTodayComplete).toBe(false);
  });

  it('is false when night is false', () => {
    const progress: DailyProgress = { morning: true, noon: true, night: false };
    const isTodayComplete = progress.morning && progress.noon && progress.night;
    expect(isTodayComplete).toBe(false);
  });

  it('is false when all slots are false', () => {
    const progress: DailyProgress = { morning: false, noon: false, night: false };
    const isTodayComplete = progress.morning && progress.noon && progress.night;
    expect(isTodayComplete).toBe(false);
  });

  it('is false when progress is null/undefined', () => {
    const progress: DailyProgress | undefined = undefined;
    const isTodayComplete = progress
      ? progress.morning && progress.noon && progress.night
      : false;
    expect(isTodayComplete).toBe(false);
  });
});

// ---------------------------------------------------------------------------
// currentDayInCycle formula: ((totalElapsedDays - 1) % 41) + 1
// ---------------------------------------------------------------------------

describe('currentDayInCycle formula', () => {
  it('day=1 → 1', () => {
    expect(calcCurrentDayInCycle(1)).toBe(1);
  });

  it('day=41 → 41', () => {
    expect(calcCurrentDayInCycle(41)).toBe(41);
  });

  it('day=42 → 1 (cycle restarts)', () => {
    expect(calcCurrentDayInCycle(42)).toBe(1);
  });

  it('day=82 → 41 (end of second cycle)', () => {
    expect(calcCurrentDayInCycle(82)).toBe(41);
  });

  it('day=83 → 1 (start of third cycle)', () => {
    expect(calcCurrentDayInCycle(83)).toBe(1);
  });

  it('day=20 → 20 (mid-cycle)', () => {
    expect(calcCurrentDayInCycle(20)).toBe(20);
  });
});

// ---------------------------------------------------------------------------
// currentCycle formula: Math.floor((totalElapsedDays - 1) / 41) + 1
// ---------------------------------------------------------------------------

describe('currentCycle formula', () => {
  it('day=1 → cycle 1', () => {
    expect(calcCurrentCycle(1)).toBe(1);
  });

  it('day=41 → cycle 1 (still in first cycle)', () => {
    expect(calcCurrentCycle(41)).toBe(1);
  });

  it('day=42 → cycle 2', () => {
    expect(calcCurrentCycle(42)).toBe(2);
  });

  it('day=82 → cycle 2', () => {
    expect(calcCurrentCycle(82)).toBe(2);
  });

  it('day=83 → cycle 3', () => {
    expect(calcCurrentCycle(83)).toBe(3);
  });

  it('day=369 → cycle 9', () => {
    expect(calcCurrentCycle(369)).toBe(9);
  });
});

// ---------------------------------------------------------------------------
// Property 13: Streak Calculation Bounds
// calculateTrueStreak() never exceeds MAX_STREAK_ITERATIONS (1000) iterations
// Validates: Requirements 7.4
// ---------------------------------------------------------------------------

describe('Property 13: Streak Calculation Bounds', () => {
  it('calculateTrueStreak never exceeds MAX_STREAK_ITERATIONS regardless of dailyProgress size', () => {
    /**
     * **Validates: Requirements 7.4**
     *
     * For any dailyProgress record (up to 1200 entries of complete days),
     * calculateTrueStreak() returns a value ≤ MAX_STREAK_ITERATIONS + 1
     * (the +1 accounts for the today check outside the loop).
     */
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 1200 }),
        (numDays) => {
          const now = new Date(2025, 5, 1, 10, 0, 0);
          const yesterday = new Date(now);
          yesterday.setDate(yesterday.getDate() - 1);

          const startDate = '2020-01-01';
          const dailyProgress: Record<string, DailyProgress> = {};

          for (let i = 0; i < numDays; i++) {
            const d = new Date(yesterday);
            d.setDate(d.getDate() - i);
            dailyProgress[getLocalDateKey(d)] = { morning: true, noon: true, night: true };
          }

          const streak = calculateTrueStreak(dailyProgress, startDate, now);
          return streak <= MAX_STREAK_ITERATIONS + 1;
        }
      ),
      { numRuns: 200 }
    );
  });
});

// ---------------------------------------------------------------------------
// Property 14: Cycle Calculation Correctness
// For any totalElapsedDays d ≥ 1, currentDayInCycle is in [1, 41] and currentCycle ≥ 1
// Validates: Requirements 3.2
// ---------------------------------------------------------------------------

describe('Property 14: Cycle Calculation Correctness', () => {
  it('currentDayInCycle is always in [1, 41] for any d ≥ 1', () => {
    /**
     * **Validates: Requirements 3.2**
     *
     * For any totalElapsedDays d ≥ 1,
     * currentDayInCycle = ((d - 1) % 41) + 1 is always in [1, 41].
     */
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        (d) => {
          const dayInCycle = calcCurrentDayInCycle(d);
          return dayInCycle >= 1 && dayInCycle <= 41;
        }
      ),
      { numRuns: 1000 }
    );
  });

  it('currentCycle is always ≥ 1 for any d ≥ 1', () => {
    /**
     * **Validates: Requirements 3.2**
     *
     * For any totalElapsedDays d ≥ 1,
     * currentCycle = Math.floor((d - 1) / 41) + 1 is always ≥ 1.
     */
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        (d) => {
          const cycle = calcCurrentCycle(d);
          return cycle >= 1;
        }
      ),
      { numRuns: 1000 }
    );
  });

  it('both currentDayInCycle and currentCycle are valid for any d ≥ 1', () => {
    /**
     * **Validates: Requirements 3.2**
     *
     * Combined property: for any d ≥ 1,
     * currentDayInCycle ∈ [1, 41] AND currentCycle ≥ 1.
     */
    fc.assert(
      fc.property(
        fc.integer({ min: 1, max: 10000 }),
        (d) => {
          const dayInCycle = calcCurrentDayInCycle(d);
          const cycle = calcCurrentCycle(d);
          return dayInCycle >= 1 && dayInCycle <= 41 && cycle >= 1;
        }
      ),
      { numRuns: 1000 }
    );
  });
});
