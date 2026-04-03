/**
 * Logic Flaw Fixes — Bug Condition Exploration Tests
 *
 * These tests are written BEFORE any fixes are applied.
 * They are expected to FAIL on unfixed code — failure confirms the bug exists.
 */

import { getEffectiveDateKey, getTodayEffectiveDateKey } from '../utils/timeSlotManager';

// ---------------------------------------------------------------------------
// Flaw 3 — Night Slot Date Key Mismatch at Midnight
// ---------------------------------------------------------------------------
//
// Bug: getEffectiveDateKey(slot) for 'morning' and 'noon' slots during hours
// 0–4 returns the CURRENT calendar date, but getTodayEffectiveDateKey()
// returns the PREVIOUS calendar date. Task writes and dashboard reads use
// different keys, so the morning/noon card never shows as completed.
//
// Counterexample (documented from unfixed code):
//   At 2025-01-16 02:30:00 (hour = 2):
//     getEffectiveDateKey('morning') → "2025-01-16"  ← BUG (should be "2025-01-15")
//     getTodayEffectiveDateKey()     → "2025-01-15"
//   The two keys differ, so the task write and dashboard read are mismatched.
// ---------------------------------------------------------------------------

describe('Flaw 3 — Night Slot Date Key Mismatch at Midnight', () => {
  // Mock Date to return 2025-01-16 02:30:00 (hour = 2, within 00:00–04:59)
  const mockDate = new Date(2025, 0, 16, 2, 30, 0); // Jan 16, 2025 at 02:30

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(mockDate);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('getEffectiveDateKey("morning") should equal getTodayEffectiveDateKey() at 02:30', () => {
    // Both should return "2025-01-15" (the previous day) because 02:30 is
    // still within the night slot's midnight crossover window (00:00–04:59).
    const writeKey = getEffectiveDateKey('morning');
    const readKey = getTodayEffectiveDateKey();

    // This assertion FAILS on unfixed code:
    //   writeKey = "2025-01-16" (bug: ignores midnight crossover for morning)
    //   readKey  = "2025-01-15" (correct: returns previous day)
    expect(writeKey).toBe(readKey);
  });

  it('getEffectiveDateKey("noon") should equal getTodayEffectiveDateKey() at 02:30', () => {
    // Same bug applies to the 'noon' slot.
    const writeKey = getEffectiveDateKey('noon');
    const readKey = getTodayEffectiveDateKey();

    // This assertion FAILS on unfixed code:
    //   writeKey = "2025-01-16" (bug: ignores midnight crossover for noon)
    //   readKey  = "2025-01-15" (correct: returns previous day)
    expect(writeKey).toBe(readKey);
  });

  it('both keys should be "2025-01-15" (the previous calendar day)', () => {
    const expectedKey = '2025-01-15';

    // getTodayEffectiveDateKey already returns the correct previous day
    expect(getTodayEffectiveDateKey()).toBe(expectedKey);

    // getEffectiveDateKey('morning') returns "2025-01-16" on unfixed code — FAILS
    expect(getEffectiveDateKey('morning')).toBe(expectedKey);

    // getEffectiveDateKey('noon') returns "2025-01-16" on unfixed code — FAILS
    expect(getEffectiveDateKey('noon')).toBe(expectedKey);
  });
});

// ---------------------------------------------------------------------------
// Flaw 3 — Preservation: Date Key Consistency Outside Midnight Window
// ---------------------------------------------------------------------------
//
// These tests document baseline behavior that MUST be preserved after the fix.
// They PASS on unfixed code and must continue to pass after the fix is applied.
//
// Baseline behaviors:
//   1. For hours 5–23, ALL slots return the CURRENT calendar date
//   2. For hours 0–4 with slot='night', returns the PREVIOUS calendar date
//   3. getTodayEffectiveDateKey() for hours 5–23 returns the current calendar date
// ---------------------------------------------------------------------------

describe('Flaw 3 — Preservation: Date Key Consistency Outside Midnight Window', () => {
  afterEach(() => {
    jest.useRealTimers();
  });

  describe('At hour 8 (morning slot active) — 2025-01-16 08:00', () => {
    const mockDate = new Date(2025, 0, 16, 8, 0, 0); // Jan 16, 2025 at 08:00

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);
    });

    it('getEffectiveDateKey("morning") returns current date "2025-01-16"', () => {
      expect(getEffectiveDateKey('morning')).toBe('2025-01-16');
    });

    it('getEffectiveDateKey("noon") returns current date "2025-01-16"', () => {
      expect(getEffectiveDateKey('noon')).toBe('2025-01-16');
    });

    it('getEffectiveDateKey("night") returns current date "2025-01-16"', () => {
      expect(getEffectiveDateKey('night')).toBe('2025-01-16');
    });

    it('getTodayEffectiveDateKey() returns current date "2025-01-16"', () => {
      expect(getTodayEffectiveDateKey()).toBe('2025-01-16');
    });
  });

  describe('At hour 2 (midnight window) — 2025-01-16 02:30', () => {
    const mockDate = new Date(2025, 0, 16, 2, 30, 0); // Jan 16, 2025 at 02:30

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);
    });

    it('getEffectiveDateKey("night") returns PREVIOUS date "2025-01-15" (already correct on unfixed code)', () => {
      expect(getEffectiveDateKey('night')).toBe('2025-01-15');
    });
  });

  describe('At hour 23 — 2025-01-16 23:00', () => {
    const mockDate = new Date(2025, 0, 16, 23, 0, 0); // Jan 16, 2025 at 23:00

    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(mockDate);
    });

    it('getEffectiveDateKey("morning") returns current date "2025-01-16"', () => {
      expect(getEffectiveDateKey('morning')).toBe('2025-01-16');
    });

    it('getEffectiveDateKey("noon") returns current date "2025-01-16"', () => {
      expect(getEffectiveDateKey('noon')).toBe('2025-01-16');
    });

    it('getEffectiveDateKey("night") returns current date "2025-01-16"', () => {
      expect(getEffectiveDateKey('night')).toBe('2025-01-16');
    });
  });
});
