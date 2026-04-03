/**
 * Time Slot Logic Audit Tests (Task 4)
 *
 * Verifies all time boundaries for getCurrentSlot() and getEffectiveDateKey(),
 * including the midnight crossover and the 5 AM boundary race condition.
 *
 * Validates: Requirements 2.1, 2.2, 2.3, 2.4, 2.5, 2.6
 *
 * Property 4: Time Slot Boundary Correctness
 * Property 5: Day Boundary Attribution
 */

import * as fc from 'fast-check';
import {
  getCurrentSlot,
  getEffectiveDateKey,
  formatLocalDateKey,
} from '../utils/timeSlotManager';

// Capture the real Date constructor BEFORE any mocking
const RealDate = global.Date;

// ---------------------------------------------------------------------------
// Helper: mock Date.now() and new Date() to return a specific hour
// ---------------------------------------------------------------------------
function mockDateToHour(hour: number, minute = 0): Date {
  const now = new RealDate();
  now.setHours(hour, minute, 0, 0);
  jest.spyOn(global, 'Date').mockImplementation((...args: any[]) => {
    if (args.length === 0) return now;
    return new RealDate(...(args as []));
  });
  return now;
}

// ---------------------------------------------------------------------------
// 1. getCurrentSlot() — boundary tests
// ---------------------------------------------------------------------------

describe('getCurrentSlot() — morning slot (08:00–12:59)', () => {
  afterEach(() => jest.restoreAllMocks());

  it('hour=8 → morning', () => {
    mockDateToHour(8);
    expect(getCurrentSlot()).toBe('morning');
  });

  it('hour=10 → morning', () => {
    mockDateToHour(10);
    expect(getCurrentSlot()).toBe('morning');
  });

  it('hour=12 → morning', () => {
    mockDateToHour(12);
    expect(getCurrentSlot()).toBe('morning');
  });

  it('hour=12, minute=59 → morning', () => {
    mockDateToHour(12, 59);
    expect(getCurrentSlot()).toBe('morning');
  });
});

describe('getCurrentSlot() — noon slot (13:00–17:59)', () => {
  afterEach(() => jest.restoreAllMocks());

  it('hour=13 → noon', () => {
    mockDateToHour(13);
    expect(getCurrentSlot()).toBe('noon');
  });

  it('hour=15 → noon', () => {
    mockDateToHour(15);
    expect(getCurrentSlot()).toBe('noon');
  });

  it('hour=17 → noon', () => {
    mockDateToHour(17);
    expect(getCurrentSlot()).toBe('noon');
  });

  it('hour=17, minute=59 → noon', () => {
    mockDateToHour(17, 59);
    expect(getCurrentSlot()).toBe('noon');
  });
});

describe('getCurrentSlot() — night slot (18:00–23:59 and 00:00–04:59)', () => {
  afterEach(() => jest.restoreAllMocks());

  it('hour=18 → night', () => {
    mockDateToHour(18);
    expect(getCurrentSlot()).toBe('night');
  });

  it('hour=21 → night', () => {
    mockDateToHour(21);
    expect(getCurrentSlot()).toBe('night');
  });

  it('hour=23 → night', () => {
    mockDateToHour(23);
    expect(getCurrentSlot()).toBe('night');
  });

  it('hour=0 → night (midnight crossover)', () => {
    mockDateToHour(0);
    expect(getCurrentSlot()).toBe('night');
  });

  it('hour=2 → night (midnight crossover)', () => {
    mockDateToHour(2);
    expect(getCurrentSlot()).toBe('night');
  });

  it('hour=4 → night (midnight crossover)', () => {
    mockDateToHour(4);
    expect(getCurrentSlot()).toBe('night');
  });

  it('hour=4, minute=59 → night (midnight crossover)', () => {
    mockDateToHour(4, 59);
    expect(getCurrentSlot()).toBe('night');
  });
});

describe('getCurrentSlot() — rest period (05:00–07:59)', () => {
  afterEach(() => jest.restoreAllMocks());

  it('hour=5 → null (rest period)', () => {
    mockDateToHour(5);
    expect(getCurrentSlot()).toBeNull();
  });

  it('hour=6 → null (rest period)', () => {
    mockDateToHour(6);
    expect(getCurrentSlot()).toBeNull();
  });

  it('hour=7 → null (rest period)', () => {
    mockDateToHour(7);
    expect(getCurrentSlot()).toBeNull();
  });

  it('hour=7, minute=59 → null (rest period)', () => {
    mockDateToHour(7, 59);
    expect(getCurrentSlot()).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// 2. getEffectiveDateKey() — midnight crossover (00:00–04:59 → previous day)
// ---------------------------------------------------------------------------

describe('getEffectiveDateKey() — midnight crossover', () => {
  afterEach(() => jest.restoreAllMocks());

  /**
   * During 00:00–04:59, the effective date key should be the PREVIOUS calendar day.
   * This ensures night-slot progress is attributed to the correct day.
   */
  it('hour=0 → returns previous day date key', () => {
    const now = new RealDate(2025, 5, 15, 0, 30, 0, 0); // June 15, 2025 00:30
    jest.spyOn(global, 'Date').mockImplementation((...args: any[]) => {
      if (args.length === 0) return now;
      return new RealDate(...(args as []));
    });
    const result = getEffectiveDateKey();
    expect(result).toBe('2025-06-14'); // previous day
  });

  it('hour=2 → returns previous day date key', () => {
    const now = new RealDate(2025, 5, 15, 2, 0, 0, 0); // June 15, 2025 02:00
    jest.spyOn(global, 'Date').mockImplementation((...args: any[]) => {
      if (args.length === 0) return now;
      return new RealDate(...(args as []));
    });
    const result = getEffectiveDateKey();
    expect(result).toBe('2025-06-14');
  });

  it('hour=4 → returns previous day date key', () => {
    const now = new RealDate(2025, 5, 15, 4, 59, 0, 0); // June 15, 2025 04:59
    jest.spyOn(global, 'Date').mockImplementation((...args: any[]) => {
      if (args.length === 0) return now;
      return new RealDate(...(args as []));
    });
    const result = getEffectiveDateKey();
    expect(result).toBe('2025-06-14');
  });

  it('hour=5 → returns current day date key (boundary: new effective day starts)', () => {
    const now = new RealDate(2025, 5, 15, 5, 0, 0, 0); // June 15, 2025 05:00
    jest.spyOn(global, 'Date').mockImplementation((...args: any[]) => {
      if (args.length === 0) return now;
      return new RealDate(...(args as []));
    });
    const result = getEffectiveDateKey();
    expect(result).toBe('2025-06-15'); // same day
  });

  it('hour=12 → returns current day date key', () => {
    const now = new RealDate(2025, 5, 15, 12, 0, 0, 0); // June 15, 2025 12:00
    jest.spyOn(global, 'Date').mockImplementation((...args: any[]) => {
      if (args.length === 0) return now;
      return new RealDate(...(args as []));
    });
    const result = getEffectiveDateKey();
    expect(result).toBe('2025-06-15');
  });

  it('midnight crossover on month boundary: Jan 1 00:30 → Dec 31 of previous year', () => {
    const now = new RealDate(2025, 0, 1, 0, 30, 0, 0); // Jan 1, 2025 00:30
    jest.spyOn(global, 'Date').mockImplementation((...args: any[]) => {
      if (args.length === 0) return now;
      return new RealDate(...(args as []));
    });
    const result = getEffectiveDateKey();
    expect(result).toBe('2024-12-31');
  });
});

// ---------------------------------------------------------------------------
// 3. 5 AM Boundary Race Condition — Documentation
// ---------------------------------------------------------------------------

/**
 * KNOWN RACE CONDITION: 5 AM Boundary
 *
 * The effective day boundary is at 05:00 AM local time.
 * If two operations straddle this boundary (one at 04:59:59, one at 05:00:00),
 * they will compute different effective date keys for the same "session".
 *
 * Example scenario:
 *   - User opens app at 04:59:59 → getEffectiveDateKey() returns "2025-06-14"
 *   - User submits task at 05:00:01 → getEffectiveDateKey() returns "2025-06-15"
 *   - Progress is split across two different date keys within the same session
 *
 * Mitigation: getEffectiveStartDateFromTime(referenceTime) captures time ONCE
 * at initialization and uses that reference throughout the session.
 * However, getEffectiveDateKey() (no-arg version) always uses new Date(),
 * so it remains susceptible to this race condition at the 5 AM boundary.
 *
 * This test documents the boundary behavior — it is not a bug to fix here,
 * but a known edge case to be aware of during QA.
 */
describe('5 AM boundary race condition — documentation', () => {
  afterEach(() => jest.restoreAllMocks());

  it('04:59 and 05:00 produce DIFFERENT effective date keys (race condition window)', () => {
    const before5am = new RealDate(2025, 5, 15, 4, 59, 59, 0); // June 15, 2025 04:59:59
    const after5am = new RealDate(2025, 5, 15, 5, 0, 0, 0);    // June 15, 2025 05:00:00

    // Compute effective date key for 04:59
    jest.spyOn(global, 'Date').mockImplementation((...args: any[]) => {
      if (args.length === 0) return before5am;
      return new RealDate(...(args as []));
    });
    const keyBefore = getEffectiveDateKey();
    jest.restoreAllMocks();

    // Compute effective date key for 05:00
    jest.spyOn(global, 'Date').mockImplementation((...args: any[]) => {
      if (args.length === 0) return after5am;
      return new RealDate(...(args as []));
    });
    const keyAfter = getEffectiveDateKey();

    // The two keys differ — this is the race condition
    expect(keyBefore).toBe('2025-06-14');
    expect(keyAfter).toBe('2025-06-15');
    expect(keyBefore).not.toBe(keyAfter);
  });
});

// ---------------------------------------------------------------------------
// Property 4: Time Slot Boundary Correctness (fast-check)
// Validates: Requirements 2.1, 2.2, 2.3, 2.4
// ---------------------------------------------------------------------------

describe('Property 4 — Time Slot Boundary Correctness', () => {
  afterEach(() => jest.restoreAllMocks());

  /**
   * **Validates: Requirements 2.1, 2.2, 2.3, 2.4**
   *
   * For any hour h:
   *   [8,12]  → 'morning'
   *   [13,17] → 'noon'
   *   [18,23] or [0,4] → 'night'
   *   [5,7]   → null
   */
  it('Property 4: slot mapping is correct for all hours 0–23', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 23 }), (hour) => {
        const mockDate = new RealDate();
        mockDate.setHours(hour, 0, 0, 0);
        jest.spyOn(global, 'Date').mockImplementation((...args: any[]) => {
          if (args.length === 0) return mockDate;
          return new RealDate(...(args as []));
        });

        const slot = getCurrentSlot();
        jest.restoreAllMocks();

        if (hour >= 8 && hour <= 12) {
          return slot === 'morning';
        }
        if (hour >= 13 && hour <= 17) {
          return slot === 'noon';
        }
        if (hour >= 18 || hour <= 4) {
          return slot === 'night';
        }
        // hours 5, 6, 7
        return slot === null;
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 5: Day Boundary Attribution (fast-check)
// Validates: Requirements 2.5, 2.6
// ---------------------------------------------------------------------------

describe('Property 5 — Day Boundary Attribution', () => {
  afterEach(() => jest.restoreAllMocks());

  /**
   * **Validates: Requirements 2.5, 2.6**
   *
   * For any time between 00:00–04:59, getEffectiveDateKey() returns the
   * previous calendar day's date key.
   */
  it('Property 5: 00:00–04:59 always returns previous day date key', () => {
    fc.assert(
      fc.property(
        // Generate a date: year 2020–2030, any month/day, hour 0–4, minute 0–59
        fc.record({
          year: fc.integer({ min: 2020, max: 2030 }),
          month: fc.integer({ min: 0, max: 11 }),
          day: fc.integer({ min: 2, max: 28 }), // start from 2 to avoid month-boundary complexity
          hour: fc.integer({ min: 0, max: 4 }),
          minute: fc.integer({ min: 0, max: 59 }),
        }),
        ({ year, month, day, hour, minute }) => {
          const mockDate = new RealDate(year, month, day, hour, minute, 0, 0);
          jest.spyOn(global, 'Date').mockImplementation((...args: any[]) => {
            if (args.length === 0) return mockDate;
            return new RealDate(...(args as []));
          });

          const result = getEffectiveDateKey();
          jest.restoreAllMocks();

          // Expected: previous calendar day
          const expectedPrevDay = new RealDate(year, month, day - 1);
          const expected = formatLocalDateKey(expectedPrevDay);

          return result === expected;
        },
      ),
    );
  });

  /**
   * **Validates: Requirements 2.5, 2.6**
   *
   * For any time from 05:00–23:59, getEffectiveDateKey() returns the
   * current calendar day's date key.
   */
  it('Property 5b: 05:00–23:59 always returns current day date key', () => {
    fc.assert(
      fc.property(
        fc.record({
          year: fc.integer({ min: 2020, max: 2030 }),
          month: fc.integer({ min: 0, max: 11 }),
          day: fc.integer({ min: 1, max: 28 }),
          hour: fc.integer({ min: 5, max: 23 }),
          minute: fc.integer({ min: 0, max: 59 }),
        }),
        ({ year, month, day, hour, minute }) => {
          const mockDate = new RealDate(year, month, day, hour, minute, 0, 0);
          jest.spyOn(global, 'Date').mockImplementation((...args: any[]) => {
            if (args.length === 0) return mockDate;
            return new RealDate(...(args as []));
          });

          const result = getEffectiveDateKey();
          jest.restoreAllMocks();

          const expected = formatLocalDateKey(mockDate);
          return result === expected;
        },
      ),
    );
  });
});
