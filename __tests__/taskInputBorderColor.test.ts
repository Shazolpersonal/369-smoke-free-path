/**
 * Task Input Screen — Border Color Consistency Property Test
 * Task 15.1: Property test লিখুন: Input border color সামঞ্জস্য
 *
 * Feature: animation-modern-ui, Property 10: Input border color সামঞ্জস্য
 *
 * For any input state:
 *   - correct prefix → border green (#10B981)
 *   - wrong prefix   → border red (#EF4444)
 *   - empty input    → border neutral (#334155)
 *
 * This mapping must always be consistent.
 *
 * **Validates: Requirements 14.1, 14.2**
 */

import * as fc from 'fast-check';
import { getValidationInfo } from '../utils/textValidator';
import { COLORS } from '../utils/theme';

// ── Helper: determine expected border color state ──────────────────────────

/**
 * Mirrors the logic in app/task/[slot].tsx:
 *
 *   if (inputText.length === 0)          → 'neutral'
 *   else if (!validation.isCorrectPrefix) → 'wrong'
 *   else                                  → 'correct'
 */
function getBorderColorState(
  inputText: string,
  displayText: string
): 'neutral' | 'correct' | 'wrong' {
  if (inputText.length === 0) return 'neutral';
  const { isCorrectSoFar } = getValidationInfo(inputText, displayText);
  return isCorrectSoFar ? 'correct' : 'wrong';
}

/**
 * Maps border color state to the expected color token.
 */
function expectedBorderColor(state: 'neutral' | 'correct' | 'wrong'): string {
  switch (state) {
    case 'neutral': return COLORS.darkBorder;   // #334155
    case 'correct': return COLORS.success;       // #10B981
    case 'wrong':   return COLORS.error;         // #EF4444
  }
}

// ── Generators ────────────────────────────────────────────────────────────

// Bengali character range U+0980–U+09FF
const bengaliChar = fc.integer({ min: 0x0980, max: 0x09ff }).map((cp) =>
  String.fromCodePoint(cp)
);
const bengaliString = fc
  .array(bengaliChar, { minLength: 1, maxLength: 20 })
  .map((chars) => chars.join(''));

// Any non-empty string (ASCII or Bengali)
const anyNonEmptyString = fc.oneof(
  fc.string({ minLength: 1, maxLength: 30 }),
  bengaliString
);

// ── Unit Tests ────────────────────────────────────────────────────────────

describe('Border color state — unit tests', () => {
  it('empty input → neutral state', () => {
    const state = getBorderColorState('', 'hello');
    expect(state).toBe('neutral');
    expect(expectedBorderColor(state)).toBe(COLORS.darkBorder);
  });

  it('correct prefix → correct state (green)', () => {
    const state = getBorderColorState('hel', 'hello');
    expect(state).toBe('correct');
    expect(expectedBorderColor(state)).toBe(COLORS.success);
  });

  it('full correct match → correct state (green)', () => {
    const state = getBorderColorState('hello', 'hello');
    expect(state).toBe('correct');
    expect(expectedBorderColor(state)).toBe(COLORS.success);
  });

  it('wrong first character → wrong state (red)', () => {
    const state = getBorderColorState('x', 'hello');
    expect(state).toBe('wrong');
    expect(expectedBorderColor(state)).toBe(COLORS.error);
  });

  it('correct start then wrong → wrong state (red)', () => {
    const state = getBorderColorState('helx', 'hello');
    expect(state).toBe('wrong');
    expect(expectedBorderColor(state)).toBe(COLORS.error);
  });

  it('color tokens have correct hex values', () => {
    expect(COLORS.darkBorder).toBe('#334155');
    expect(COLORS.success).toBe('#10B981');
    expect(COLORS.error).toBe('#EF4444');
  });
});

// ── Property Tests ────────────────────────────────────────────────────────

describe('Property 10: Input border color সামঞ্জস্য', () => {
  /**
   * **Validates: Requirements 14.1, 14.2**
   *
   * Property: empty input always maps to neutral border color.
   * For any displayText, when inputText is empty, the border state must be 'neutral'.
   */
  it('empty input সবসময় neutral border state রিটার্ন করে', () => {
    // Feature: animation-modern-ui, Property 10: Input border color সামঞ্জস্য
    fc.assert(
      fc.property(anyNonEmptyString, (displayText) => {
        const state = getBorderColorState('', displayText);
        return state === 'neutral';
      }),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 14.1**
   *
   * Property: correct prefix always maps to green border.
   * For any displayText with length ≥ 1, typing the exact prefix produces 'correct' state.
   */
  it('সঠিক prefix সবসময় correct (green) border state রিটার্ন করে', () => {
    // Feature: animation-modern-ui, Property 10: Input border color সামঞ্জস্য
    fc.assert(
      fc.property(
        fc.string({ minLength: 2, maxLength: 20 }),
        fc.integer({ min: 1, max: 19 }),
        (displayText, prefixLen) => {
          const actualPrefixLen = Math.min(prefixLen, displayText.length);
          if (actualPrefixLen === 0) return true; // skip degenerate case
          const inputText = displayText.slice(0, actualPrefixLen);
          const state = getBorderColorState(inputText, displayText);
          return state === 'correct';
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 14.2**
   *
   * Property: wrong first character always maps to red border.
   * For any displayText with a non-empty normalized form, if the first normalized
   * grapheme of inputText differs from the first normalized grapheme of displayText,
   * the border state must be 'wrong'.
   *
   * Note: We use alphabetic characters to avoid punctuation-stripping edge cases
   * (punctuation is removed by normalize(), so "'" normalizes to "" which matches "").
   */
  it('ভুল প্রথম অক্ষর সবসময় wrong (red) border state রিটার্ন করে', () => {
    // Feature: animation-modern-ui, Property 10: Input border color সামঞ্জস্য
    // Use only alphabetic ASCII to avoid normalization edge cases with punctuation
    const alphaString = (min: number, max: number) =>
      fc.array(fc.integer({ min: 97, max: 122 }).map((c) => String.fromCharCode(c)), { minLength: min, maxLength: max })
        .map((chars) => chars.join(''));

    fc.assert(
      fc.property(
        alphaString(2, 15),  // displayText: e.g. "hello"
        alphaString(1, 10),  // wrongInput: e.g. "xyz"
        (displayText, wrongInput) => {
          // Ensure wrongInput starts with a different character than displayText
          if (wrongInput[0] === displayText[0]) return true; // skip equal-first-char cases
          const state = getBorderColorState(wrongInput, displayText);
          return state === 'wrong';
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 14.1, 14.2**
   *
   * Property: border state is always one of exactly three values.
   * For any (inputText, displayText) pair, the state must be 'neutral', 'correct', or 'wrong'.
   */
  it('border state সবসময় neutral | correct | wrong এর মধ্যে একটি', () => {
    // Feature: animation-modern-ui, Property 10: Input border color সামঞ্জস্য
    const validStates = new Set(['neutral', 'correct', 'wrong']);
    fc.assert(
      fc.property(
        fc.string({ maxLength: 30 }),
        fc.string({ minLength: 1, maxLength: 30 }),
        (inputText, displayText) => {
          const state = getBorderColorState(inputText, displayText);
          return validStates.has(state);
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 14.1, 14.2**
   *
   * Property: border color mapping is deterministic.
   * Same (inputText, displayText) always produces the same border color.
   */
  it('동일한 input에 대해 border color는 항상 동일하다 (deterministic)', () => {
    // Feature: animation-modern-ui, Property 10: Input border color সামঞ্জস্য
    fc.assert(
      fc.property(
        fc.string({ maxLength: 20 }),
        fc.string({ minLength: 1, maxLength: 20 }),
        (inputText, displayText) => {
          const state1 = getBorderColorState(inputText, displayText);
          const state2 = getBorderColorState(inputText, displayText);
          const color1 = expectedBorderColor(state1);
          const color2 = expectedBorderColor(state2);
          return state1 === state2 && color1 === color2;
        }
      ),
      { numRuns: 100 }
    );
  });

  /**
   * **Validates: Requirements 14.1, 14.2**
   *
   * Property: neutral state always maps to COLORS.darkBorder (#334155),
   *           correct state always maps to COLORS.success (#10B981),
   *           wrong state always maps to COLORS.error (#EF4444).
   * The color token values must match the spec-defined colors.
   */
  it('border color token মান spec-এর সাথে সামঞ্জস্যপূর্ণ', () => {
    // Feature: animation-modern-ui, Property 10: Input border color সামঞ্জস্য
    fc.assert(
      fc.property(
        fc.constantFrom('neutral', 'correct', 'wrong' as const),
        (state) => {
          const color = expectedBorderColor(state as 'neutral' | 'correct' | 'wrong');
          if (state === 'neutral') return color === '#334155';
          if (state === 'correct') return color === '#10B981';
          if (state === 'wrong')   return color === '#EF4444';
          return false;
        }
      ),
      { numRuns: 100 }
    );
  });
});
