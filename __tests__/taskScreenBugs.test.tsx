/**
 * Bug Condition Exploration Tests — Task Screen
 *
 * These tests are EXPECTED TO FAIL on unfixed code.
 * Failure confirms the bugs exist. DO NOT fix the code or tests when they fail.
 *
 * Bug 1: keyboardVerticalOffset is 20 on Android (should be 0)
 * Bug 2: Highlight wrapper is <View> when inputText.length > 0 (should be <Text>)
 *
 * Validates: Requirements 1.1, 1.2, 1.3
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { Platform } from 'react-native';

// ── Mocks ──────────────────────────────────────────────────────────────────

jest.mock('expo-router', () => ({
  useLocalSearchParams: () => ({ slot: 'morning' }),
  useRouter: () => ({ back: jest.fn() }),
  Stack: { Screen: () => null },
}));

jest.mock('expo-haptics', () => ({
  notificationAsync: jest.fn(),
  NotificationFeedbackType: { Success: 'success' },
}));

jest.mock('expo-linear-gradient', () => {
  const { View } = require('react-native');
  return { LinearGradient: (props: any) => <View {...props} /> };
});

jest.mock('react-native-safe-area-context', () => {
  const { View } = require('react-native');
  return {
    SafeAreaView: (props: any) => <View {...props} />,
    useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
  };
});

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

jest.mock('lucide-react-native', () => ({
  ArrowLeft: () => null,
  CheckCircle: () => null,
}));

jest.mock('../components/RepetitionCounter', () => ({
  RepetitionCounter: () => null,
}));

jest.mock('../components/ConfettiBurst', () => ({
  ConfettiBurst: () => null,
}));

jest.mock('../components/DonationPrompt', () => ({
  DonationPrompt: () => null,
}));

jest.mock('../contexts/ProgressContext', () => ({
  useProgress: () => ({
    totalElapsedDays: 1,
    completeTask: jest.fn(),
  }),
}));

jest.mock('../contexts/LanguageContext', () => ({
  useLanguage: () => ({
    language: 'bn',
    t: (key: string) => key,
  }),
}));

// Fix contentCycler to return a known Bengali affirmation
jest.mock('../utils/contentCycler', () => ({
  getAffirmationByLanguage: () => 'আমি ধুমপান করি না',
}));

// ── Import component AFTER mocks ───────────────────────────────────────────

import TaskInputScreen from '../app/task/[slot]';

// ── Test 1: Android keyboard offset ───────────────────────────────────────

describe('Bug 1 — Android keyboardVerticalOffset', () => {
  it('should be 0 on Android (BUG: currently returns 20)', () => {
    // Force Android platform
    const originalOS = Platform.OS;
    Object.defineProperty(Platform, 'OS', { value: 'android', configurable: true });

    const { UNSAFE_getAllByType } = render(<TaskInputScreen />);

    const { KeyboardAvoidingView } = require('react-native');
    const kavInstances = UNSAFE_getAllByType(KeyboardAvoidingView);
    expect(kavInstances.length).toBeGreaterThan(0);

    const offset = kavInstances[0].props.keyboardVerticalOffset;
    // On unfixed code this is 20 — the test FAILS, confirming the bug
    expect(offset).toBe(0);

    Object.defineProperty(Platform, 'OS', { value: originalOS, configurable: true });
  });
});

// ── Test 2: Bangla highlight wrapper node type ─────────────────────────────

describe('Bug 2 — Bangla highlight wrapper is Text not View', () => {
  it('highlight wrapper should be Text when inputText is non-empty (BUG: currently View)', () => {
    const { UNSAFE_getAllByType, getByPlaceholderText, rerender } = render(<TaskInputScreen />);

    // Simulate user typing into the input
    const { fireEvent } = require('@testing-library/react-native');
    const input = getByPlaceholderText('task.placeholder');
    fireEvent.changeText(input, 'আমি');

    // Re-query after state update
    const { View, Text } = require('react-native');

    // Find all Views with flexDirection: 'row' and flexWrap: 'wrap' — that's the buggy wrapper
    const allViews = UNSAFE_getAllByType(View);
    const highlightView = allViews.find(
      (v: any) =>
        v.props.style &&
        (Array.isArray(v.props.style)
          ? v.props.style.some(
              (s: any) => s && s.flexDirection === 'row' && s.flexWrap === 'wrap'
            )
          : v.props.style.flexDirection === 'row' && v.props.style.flexWrap === 'wrap')
    );

    // On unfixed code, highlightView is defined (the View wrapper exists — BUG)
    // On fixed code, highlightView is undefined (no View wrapper)
    // The test asserts the fixed state: no View wrapper should exist
    expect(highlightView).toBeUndefined();
  });
});

// ── Preservation Property Tests ────────────────────────────────────────────
/**
 * Preservation Property Tests — Segment Concatenation & Grapheme Boundary Integrity
 *
 * These tests are EXPECTED TO PASS on unfixed code.
 * getHighlightSegments is not changed by the fix — these tests confirm baseline behavior.
 *
 * Property 2a: correct + incorrect + remaining === displayTarget (for any input pair)
 * Property 2b: every segment boundary aligns with a splitIntoGraphemes boundary
 *
 * Validates: Requirements 3.3, 3.6
 */

import * as fc from 'fast-check';
import { getHighlightSegments, splitIntoGraphemes } from '../utils/textValidator';

// Arbitrary for Bengali characters (Unicode range U+0980–U+09FF)
const bengaliChar = fc.integer({ min: 0x0980, max: 0x09ff }).map((cp) =>
  String.fromCodePoint(cp)
);
const bengaliString = fc
  .array(bengaliChar, { minLength: 0, maxLength: 30 })
  .map((chars) => chars.join(''));

// Mixed arbitrary: either a plain fc.string() or a Bengali string
const anyString = fc.oneof(fc.string({ maxLength: 40 }), bengaliString);

describe('Preservation Property 2a — correct + incorrect + remaining === displayTarget', () => {
  /**
   * **Validates: Requirements 3.3, 3.6**
   *
   * For any (inputText, displayTarget) string pair, the concatenation of all three
   * segments returned by getHighlightSegments must equal displayTarget exactly.
   * This ensures no characters are lost or duplicated during segmentation.
   */
  it('segments concatenate to displayTarget for any string pair', () => {
    fc.assert(
      fc.property(anyString, anyString, (inputText, displayTarget) => {
        const { correct, incorrect, remaining } = getHighlightSegments(
          inputText,
          displayTarget
        );
        return correct + incorrect + remaining === displayTarget;
      }),
      { numRuns: 500 }
    );
  });

  it('segments concatenate to displayTarget for Bengali string pairs', () => {
    fc.assert(
      fc.property(bengaliString, bengaliString, (inputText, displayTarget) => {
        const { correct, incorrect, remaining } = getHighlightSegments(
          inputText,
          displayTarget
        );
        return correct + incorrect + remaining === displayTarget;
      }),
      { numRuns: 300 }
    );
  });
});

describe('Preservation Property 2b — segment boundaries align with grapheme boundaries', () => {
  /**
   * **Validates: Requirements 3.3, 3.6**
   *
   * For any displayTarget, every segment boundary index returned by getHighlightSegments
   * must align with a splitIntoGraphemes boundary — no grapheme cluster is split across
   * the correct/incorrect or incorrect/remaining boundary.
   */
  it('correct/incorrect boundary aligns with a grapheme boundary for any string pair', () => {
    fc.assert(
      fc.property(anyString, anyString, (inputText, displayTarget) => {
        const { correct, incorrect } = getHighlightSegments(inputText, displayTarget);
        const graphemes = splitIntoGraphemes(displayTarget);

        // Build the set of valid grapheme boundary byte-offsets in displayTarget
        const validBoundaries = new Set<number>();
        let offset = 0;
        validBoundaries.add(0);
        for (const g of graphemes) {
          offset += g.length;
          validBoundaries.add(offset);
        }

        // The correct/incorrect boundary is at correct.length
        const correctBoundary = correct.length;
        // The incorrect/remaining boundary is at correct.length + incorrect.length
        const incorrectBoundary = correct.length + incorrect.length;

        return (
          validBoundaries.has(correctBoundary) &&
          validBoundaries.has(incorrectBoundary)
        );
      }),
      { numRuns: 500 }
    );
  });

  it('segment boundaries align with grapheme boundaries for Bengali strings', () => {
    fc.assert(
      fc.property(bengaliString, bengaliString, (inputText, displayTarget) => {
        const { correct, incorrect } = getHighlightSegments(inputText, displayTarget);
        const graphemes = splitIntoGraphemes(displayTarget);

        const validBoundaries = new Set<number>();
        let offset = 0;
        validBoundaries.add(0);
        for (const g of graphemes) {
          offset += g.length;
          validBoundaries.add(offset);
        }

        const correctBoundary = correct.length;
        const incorrectBoundary = correct.length + incorrect.length;

        return (
          validBoundaries.has(correctBoundary) &&
          validBoundaries.has(incorrectBoundary)
        );
      }),
      { numRuns: 300 }
    );
  });
});

// ── Preservation Unit Tests — ASCII and Non-Buggy Bengali ─────────────────
/**
 * Explicit preservation unit tests for non-buggy inputs.
 * These PASS on unfixed code — confirming baseline behavior to preserve.
 *
 * Validates: Requirements 3.1, 3.2, 3.3, 3.4, 3.5, 3.6
 */

describe('Preservation Unit Tests — Non-Buggy Inputs (Property 2)', () => {
  /**
   * **Validates: Requirements 3.1, 3.3**
   *
   * ASCII full match: 'hello' typed, 'hello' displayed.
   * No combining characters — both normalization strategies agree.
   * Must pass on unfixed code.
   */
  it('ASCII full match returns correct === displayTarget', () => {
    const { correct, incorrect, remaining } = getHighlightSegments('hello', 'hello');
    expect(correct).toBe('hello');
    expect(incorrect).toBe('');
    expect(remaining).toBe('');
  });

  /**
   * **Validates: Requirements 3.5, 3.3**
   *
   * Empty input: always returns remaining === displayTarget.
   * Not affected by normalization order.
   */
  it('empty input returns remaining === displayTarget', () => {
    const { correct, incorrect, remaining } = getHighlightSegments('', 'ধূমপান');
    expect(correct).toBe('');
    expect(incorrect).toBe('');
    expect(remaining).toBe('ধূমপান');
  });

  /**
   * **Validates: Requirements 3.2, 3.3**
   *
   * Mismatch: wrong character produces non-empty incorrect segment.
   */
  it('mismatched input produces non-empty incorrect segment', () => {
    const { incorrect } = getHighlightSegments('wrong', 'hello');
    expect(incorrect.length).toBeGreaterThan(0);
  });

  /**
   * **Validates: Requirements 3.1, 3.3**
   *
   * Bengali text WITHOUT combining vowel signs — single word, no spaces.
   * 'আমি' (I/me) has no combining vowel signs and no spaces, so neither the
   * space-normalization bug nor the vowel-sign grapheme bug applies.
   * Full match should return correct === displayTarget on unfixed code.
   *
   * Note: Multi-word Bengali text like 'আমি ধুমপান করি না' is also affected by the
   * space-normalization bug (normalize(' ') === '' causes space mismatch), so it is
   * NOT a non-buggy input on unfixed code. Single-word Bengali without combining
   * vowel signs is the correct non-buggy baseline.
   */
  it('getHighlightSegments("আমি", "আমি") returns correct === displayTarget (single Bengali word, no combining vowel signs)', () => {
    const text = 'আমি';
    const { correct, incorrect, remaining } = getHighlightSegments(text, text);
    expect(correct).toBe(text);
    expect(incorrect).toBe('');
    expect(remaining).toBe('');
  });

  /**
   * **Validates: Requirements 3.4, 3.3**
   *
   * Partial correct prefix: typed portion shows green, rest shows default.
   */
  it('partial correct prefix returns correct prefix in correct segment', () => {
    const { correct, remaining } = getHighlightSegments('hel', 'hello');
    expect(correct).toBe('hel');
    expect(remaining).toBe('lo');
  });
});

// ── Bug Condition Exploration Tests — Bengali Vowel Sign Full Match ────────
/**
 * Property 1: Bug Condition — Bengali Vowel Sign Full Match
 *
 * These tests are EXPECTED TO FAIL on unfixed code.
 * Failure confirms the asymmetric normalization bug exists.
 * DO NOT fix the code or tests when they fail.
 *
 * Root cause: getHighlightSegments normalizes the full input string before splitting,
 * but splits displayTarget first and normalizes each grapheme individually via normalize().
 * The normalize() function calls .trim(), which strips whitespace from individual space
 * graphemes — so normalize(' ') === '' — causing space graphemes in the target to never
 * match the space graphemes in the input. This breaks any multi-word Bengali affirmation.
 *
 * Additionally, for Bengali vowel signs like "ূ" (U+09C2), per-grapheme normalize()
 * can produce different NFC forms than full-string normalization in Hermes (React Native).
 *
 * Validates: Requirements 1.1, 1.2, 1.3
 */

describe('Bug Condition — Bengali Vowel Sign Full Match (Property 1)', () => {
  /**
   * **Validates: Requirements 1.1, 1.2, 1.3**
   *
   * Test case 1: Full match — "ধূমপান" typed, "ধূমপান" displayed.
   * Single word (no spaces) — tests the vowel sign normalization asymmetry.
   * On unfixed code in Hermes: correct === '' instead of 'ধূমপান' (bug confirmed).
   * In Node.js/V8: passes (V8 NFC is consistent), but the asymmetry is still present.
   */
  it('getHighlightSegments("ধূমপান", "ধূমপান") should return correct === "ধূমপান" (BUG: returns "" in Hermes)', () => {
    const { correct, incorrect, remaining } = getHighlightSegments('ধূমপান', 'ধূমপান');
    expect(correct).toBe('ধূমপান');
    expect(incorrect).toBe('');
    expect(remaining).toBe('');
  });

  /**
   * **Validates: Requirements 1.1, 1.2, 1.3**
   *
   * Test case 2: Partial prefix — "ধূ" typed, "ধূমপান" displayed.
   * On unfixed code in Hermes: correct === '' instead of 'ধূ' (bug confirmed).
   */
  it('getHighlightSegments("ধূ", "ধূমপান") should return correct === "ধূ" (BUG: returns "" in Hermes)', () => {
    const { correct } = getHighlightSegments('ধূ', 'ধূমপান');
    expect(correct).toBe('ধূ');
  });

  /**
   * **Validates: Requirements 1.1, 1.2, 1.3**
   *
   * Test case 3: Full match of a multi-word Bengali affirmation.
   * The real bug trigger in Node.js: normalize(' ') === '' (trim strips spaces),
   * so per-grapheme normalize of a space grapheme returns '', causing mismatch
   * at the first space in any multi-word displayTarget.
   *
   * On unfixed code: correct === 'ধূমপান' (only first word, stops at first space).
   * On fixed code: correct === full affirmation.
   */
  it('getHighlightSegments(affirmation, affirmation) should return correct === affirmation for multi-word Bengali text (BUG: stops at first space)', () => {
    const affirmation = 'ধূমপান করি না'; // multi-word, contains U+09C2
    const { correct, incorrect, remaining } = getHighlightSegments(affirmation, affirmation);
    expect(correct).toBe(affirmation);
    expect(incorrect).toBe('');
    expect(remaining).toBe('');
  });

  /**
   * **Validates: Requirements 1.1, 1.2, 1.3**
   *
   * Property test: for any Bengali string s containing U+09C2 (Bengali Vowel Sign UU),
   * getHighlightSegments(s.normalize('NFC').toLowerCase(), s) should return correct === s.
   *
   * Scoped to inputs where input === displayTarget.normalize('NFC').toLowerCase()
   * and displayTarget contains U+09C2 — the exact bug condition.
   *
   * On unfixed code: correct will be '' or shorter than s when s contains spaces
   * (counterexample found — normalize(' ') === '' causes space mismatch).
   */
  it('for any Bengali string with U+09C2, full-match input should return correct === displayTarget (BUG: stops at first space)', () => {
    // Generator: Bengali strings with spaces that contain at least one U+09C2 (ূ)
    // Spaces are the reliable bug trigger in Node.js (normalize(' ') === '')
    const bengaliWordChar = fc.integer({ min: 0x0980, max: 0x09ff }).map((cp) =>
      String.fromCodePoint(cp)
    );
    const bengaliWord = fc
      .array(bengaliWordChar, { minLength: 1, maxLength: 5 })
      .map((chars) => chars.join(''));

    // Multi-word Bengali string with U+09C2 in the first word
    const bengaliStringWithVowelSignAndSpace = fc
      .tuple(bengaliWord, bengaliWord)
      .map(([w1, w2]) => {
        // Ensure U+09C2 appears in first word
        const vowelSign = '\u09C2'; // ূ
        return w1 + vowelSign + ' ' + w2;
      });

    fc.assert(
      fc.property(bengaliStringWithVowelSignAndSpace, (s) => {
        const input = s.normalize('NFC').toLowerCase();
        const { correct } = getHighlightSegments(input, s);
        // On fixed code: correct === s (full match)
        // On unfixed code: correct stops at first space (bug)
        return correct === s;
      }),
      { numRuns: 200 }
    );
  });
});
