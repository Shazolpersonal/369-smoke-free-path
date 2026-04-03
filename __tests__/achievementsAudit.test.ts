/**
 * Task 9: Achievements Logic Audit Tests
 * Tests for getAchievements() utility function
 * Requirements: 5.2, 5.3
 */

import * as fc from 'fast-check';
import { getAchievements, Badge } from '../utils/achievements';
import { DailyProgress } from '../types';

// Helper to build a dailyProgress record with N mornings completed
function makeProgress(mornings: number, nights = 0): Record<string, DailyProgress> {
  const result: Record<string, DailyProgress> = {};
  for (let i = 0; i < Math.max(mornings, nights); i++) {
    result[`2025-01-${String(i + 1).padStart(2, '0')}`] = {
      morning: i < mornings,
      noon: false,
      night: i < nights,
    };
  }
  return result;
}

describe('getAchievements — basic invariants', () => {
  it('always returns a non-empty array', () => {
    expect(getAchievements({}, 0, 0).length).toBeGreaterThan(0);
    expect(getAchievements(makeProgress(5), 5, 5).length).toBeGreaterThan(0);
  });
});

describe('getAchievements — three_days badge', () => {
  it('unlocks three_days when trueStreak >= 3', () => {
    const badges = getAchievements({}, 3, 0);
    const badge = badges.find(b => b.id === 'three_days')!;
    expect(badge.isUnlocked).toBe(true);
  });

  it('unlocks three_days when trueStreak > 3', () => {
    const badges = getAchievements({}, 10, 0);
    const badge = badges.find(b => b.id === 'three_days')!;
    expect(badge.isUnlocked).toBe(true);
  });

  it('locks three_days when trueStreak < 3', () => {
    const badges0 = getAchievements({}, 0, 0);
    expect(badges0.find(b => b.id === 'three_days')!.isUnlocked).toBe(false);

    const badges2 = getAchievements({}, 2, 0);
    expect(badges2.find(b => b.id === 'three_days')!.isUnlocked).toBe(false);
  });
});

describe('getAchievements — morning_person badge', () => {
  it('unlocks morning_person when morningsCompleted >= 10', () => {
    const badges = getAchievements(makeProgress(10), 0, 0);
    const badge = badges.find(b => b.id === 'morning_person')!;
    expect(badge.isUnlocked).toBe(true);
  });

  it('locks morning_person when morningsCompleted < 10', () => {
    const badges = getAchievements(makeProgress(9), 0, 0);
    const badge = badges.find(b => b.id === 'morning_person')!;
    expect(badge.isUnlocked).toBe(false);
  });
});

describe('getAchievements — forty_one_days badge (streak-independent)', () => {
  it('unlocks forty_one_days when totalElapsedDays >= 41 even with trueStreak = 0', () => {
    const badges = getAchievements({}, 0, 41);
    const badge = badges.find(b => b.id === 'forty_one_days')!;
    expect(badge.isUnlocked).toBe(true);
  });

  it('locks forty_one_days when both trueStreak and totalElapsedDays < 41', () => {
    const badges = getAchievements({}, 10, 10);
    const badge = badges.find(b => b.id === 'forty_one_days')!;
    expect(badge.isUnlocked).toBe(false);
  });
});

/**
 * Property 12: Badge Progress Bounds
 * For any badge, 0 ≤ badge.progress ≤ badge.target
 * Validates: Requirements 5.2
 */
describe('Property 12: Badge Progress Bounds', () => {
  it('progress is always in [0, target] for any badge across all inputs', () => {
    const dailyProgressArb = fc.dictionary(
      fc.string({ minLength: 1, maxLength: 10 }),
      fc.record({
        morning: fc.boolean(),
        noon: fc.boolean(),
        night: fc.boolean(),
      })
    );

    fc.assert(
      fc.property(
        dailyProgressArb,
        fc.integer({ min: 0, max: 100 }),
        fc.integer({ min: 0, max: 100 }),
        (dailyProgress, trueStreak, totalElapsedDays) => {
          const badges = getAchievements(dailyProgress, trueStreak, totalElapsedDays);
          return badges.every(
            (badge: Badge) => badge.progress >= 0 && badge.progress <= badge.target
          );
        }
      ),
      { numRuns: 500 }
    );
  });
});
