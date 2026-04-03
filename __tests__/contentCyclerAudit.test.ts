/**
 * Content Cycler Audit Tests (Task 5)
 *
 * Verifies getContentIndex() cycling logic and getAffirmationByLanguage()
 * edge-case handling including invalid days, missing entries, and all
 * language/slot combinations.
 *
 * Validates: Requirements 3.1, 3.2, 3.3
 *
 * Property 6: Content Index Range Correctness
 * Property 7: Affirmation Fallback Safety
 */

import * as fc from 'fast-check';
import { getContentIndex, getAffirmationByLanguage } from '../utils/contentCycler';

// ---------------------------------------------------------------------------
// 1. getContentIndex() — basic cycling
// ---------------------------------------------------------------------------

describe('getContentIndex() — basic cycling', () => {
  it('day=1 → index=0', () => {
    expect(getContentIndex(1)).toBe(0);
  });

  it('day=41 → index=40', () => {
    expect(getContentIndex(41)).toBe(40);
  });

  it('day=42 → index=0 (cycle restart)', () => {
    expect(getContentIndex(42)).toBe(0);
  });

  it('day=82 → index=40 (second cycle end)', () => {
    expect(getContentIndex(82)).toBe(40);
  });

  it('day=83 → index=0 (third cycle start)', () => {
    expect(getContentIndex(83)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 2. getContentIndex() — edge cases
// ---------------------------------------------------------------------------

describe('getContentIndex() — edge cases', () => {
  it('day=0 → returns 0 (fallback)', () => {
    expect(getContentIndex(0)).toBe(0);
  });

  it('day=-1 → returns 0 (fallback)', () => {
    expect(getContentIndex(-1)).toBe(0);
  });

  it('day=-100 → returns 0 (fallback)', () => {
    expect(getContentIndex(-100)).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// 3. getAffirmationByLanguage() — invalid/edge days
// ---------------------------------------------------------------------------

describe('getAffirmationByLanguage() — day=0 or negative → fallback, no crash', () => {
  it('day=0, en, morning → returns non-empty fallback string', () => {
    const result = getAffirmationByLanguage(0, 'morning', 'en');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('day=0, en, noon → returns non-empty fallback string', () => {
    const result = getAffirmationByLanguage(0, 'noon', 'en');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('day=0, en, night → returns non-empty fallback string', () => {
    const result = getAffirmationByLanguage(0, 'night', 'en');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('day=-1, bn, morning → returns non-empty fallback string', () => {
    const result = getAffirmationByLanguage(-1, 'morning', 'bn');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('day=-50, bn, night → returns non-empty fallback string', () => {
    const result = getAffirmationByLanguage(-50, 'night', 'bn');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// 4. getAffirmationByLanguage() — day > 369 cycles correctly
// ---------------------------------------------------------------------------

describe('getAffirmationByLanguage() — day > 369 cycles correctly', () => {
  it('day=370 → no crash, returns non-empty string (en, morning)', () => {
    const result = getAffirmationByLanguage(370, 'morning', 'en');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('day=410 → no crash, returns non-empty string (en, noon)', () => {
    const result = getAffirmationByLanguage(410, 'noon', 'en');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('day=1000 → no crash, returns non-empty string (bn, night)', () => {
    const result = getAffirmationByLanguage(1000, 'night', 'bn');
    expect(typeof result).toBe('string');
    expect(result.length).toBeGreaterThan(0);
  });

  it('day=370 cycles to same content as day=1 (en, morning)', () => {
    // 370 = 1 + 9*41, so (370-1) % 41 = 369 % 41 = 369 - 9*41 = 369 - 369 = 0 → index 0
    expect(getContentIndex(370)).toBe(getContentIndex(1));
    const result370 = getAffirmationByLanguage(370, 'morning', 'en');
    const result1 = getAffirmationByLanguage(1, 'morning', 'en');
    expect(result370).toBe(result1);
  });
});

// ---------------------------------------------------------------------------
// 5. getAffirmationByLanguage() — all language × slot combinations
// ---------------------------------------------------------------------------

describe('getAffirmationByLanguage() — all language and slot combinations', () => {
  const languages = ['en', 'bn'] as const;
  const slots = ['morning', 'noon', 'night'] as const;
  const testDay = 5;

  for (const lang of languages) {
    for (const slot of slots) {
      it(`day=${testDay}, lang=${lang}, slot=${slot} → non-empty string`, () => {
        const result = getAffirmationByLanguage(testDay, slot, lang);
        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(0);
      });
    }
  }

  it('en and bn return different strings for same day/slot', () => {
    const en = getAffirmationByLanguage(1, 'morning', 'en');
    const bn = getAffirmationByLanguage(1, 'morning', 'bn');
    expect(en).not.toBe(bn);
  });
});

// ---------------------------------------------------------------------------
// Property 6: Content Index Range Correctness (fast-check)
// Validates: Requirements 3.1
// ---------------------------------------------------------------------------

describe('Property 6 — Content Index Range Correctness', () => {
  /**
   * **Validates: Requirements 3.1**
   *
   * For any day d > 0:
   *   - getContentIndex(d) is in range [0, 40]
   *   - getContentIndex(d) equals (d - 1) % 41
   */
  it('Property 6: for any d > 0, getContentIndex(d) ∈ [0, 40] and equals (d-1) % 41', () => {
    fc.assert(
      fc.property(fc.integer({ min: 1, max: 100_000 }), (d) => {
        const index = getContentIndex(d);
        const expected = (d - 1) % 41;
        return index >= 0 && index <= 40 && index === expected;
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 7: Affirmation Fallback Safety (fast-check)
// Validates: Requirements 3.2, 3.3
// ---------------------------------------------------------------------------

describe('Property 7 — Affirmation Fallback Safety', () => {
  /**
   * **Validates: Requirements 3.2, 3.3**
   *
   * For any day d ≤ 0 or any invalid day, getAffirmationByLanguage()
   * returns a non-empty string without throwing.
   */
  it('Property 7: for any d ≤ 0, getAffirmationByLanguage returns non-empty string without throwing', () => {
    const languages = ['en', 'bn'] as const;
    const slots = ['morning', 'noon', 'night'] as const;

    fc.assert(
      fc.property(
        fc.integer({ min: -10_000, max: 0 }),
        fc.constantFrom(...languages),
        fc.constantFrom(...slots),
        (d, lang, slot) => {
          let result: string;
          try {
            result = getAffirmationByLanguage(d, slot, lang);
          } catch {
            return false; // should not throw
          }
          return typeof result === 'string' && result.length > 0;
        },
      ),
    );
  });
});
