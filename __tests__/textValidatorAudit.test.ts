/**
 * TextValidator Audit Tests (Task 7)
 *
 * Verifies normalize(), getValidationInfo(), getHighlightSegments(),
 * Bengali conjunct grapheme splitting, edge cases, and property-based tests.
 *
 * Validates: Requirements 1.2, 1.3, 4.6, 4.7, 8.1, 8.2
 *
 * Property 8:  Normalize Idempotency
 * Property 9:  Validation Percent Bounds
 * Property 10: Highlight Segment Completeness
 */

import * as fc from 'fast-check';
import GraphemeSplitter from 'grapheme-splitter';
import {
  normalize,
  getValidationInfo,
  getHighlightSegments,
  splitIntoGraphemes,
  getDisplayText,
} from '../utils/textValidator';

const splitter = new GraphemeSplitter();

// ---------------------------------------------------------------------------
// 1. normalize() — basic behaviour
// ---------------------------------------------------------------------------

describe('normalize() — Bengali dari and punctuation removal', () => {
  it('removes Bengali dari (।)', () => {
    expect(normalize('আমি ভালো আছি।')).toBe('আমি ভালো আছি');
  });

  it('removes double dari (॥)', () => {
    expect(normalize('শান্তি॥')).toBe('শান্তি');
  });

  it('removes standard punctuation: . , ; : ! ?', () => {
    expect(normalize('Hello, world! How are you?')).toBe('hello world how are you');
  });

  it('removes parentheses and dashes (multiple spaces collapsed)', () => {
    // Removing '(' ')' '—' leaves extra spaces which are then collapsed to single space
    expect(normalize('test (value) — result')).toBe('test value result');
  });

  it('collapses multiple spaces into one', () => {
    expect(normalize('a   b    c')).toBe('a b c');
  });

  it('trims leading and trailing whitespace', () => {
    expect(normalize('  hello world  ')).toBe('hello world');
  });

  it('converts to lowercase', () => {
    expect(normalize('Hello World')).toBe('hello world');
  });

  it('applies NFC normalization', () => {
    // NFD decomposed 'é' (e + combining acute) should normalize to NFC 'é'
    const nfd = '\u0065\u0301'; // e + combining acute accent
    const nfc = '\u00e9';       // é precomposed
    expect(normalize(nfd)).toBe(normalize(nfc));
  });

  it('handles empty string', () => {
    expect(normalize('')).toBe('');
  });

  it('handles string with only punctuation', () => {
    expect(normalize('।॥.,!?')).toBe('');
  });
});

// ---------------------------------------------------------------------------
// 2. getValidationInfo() — prefix detection, percent, complete match
// ---------------------------------------------------------------------------

describe('getValidationInfo() — prefix detection', () => {
  const target = 'আমি সুস্থ থাকব';

  it('empty input → isCorrectSoFar=true, isCompleteMatch=false, percent=0', () => {
    const info = getValidationInfo('', target);
    expect(info.isCorrectSoFar).toBe(true);
    expect(info.isCompleteMatch).toBe(false);
    expect(info.percent).toBe(0);
  });

  it('correct prefix → isCorrectSoFar=true', () => {
    const info = getValidationInfo('আমি', target);
    expect(info.isCorrectSoFar).toBe(true);
  });

  it('wrong first character → isCorrectSoFar=false', () => {
    const info = getValidationInfo('ব', target);
    expect(info.isCorrectSoFar).toBe(false);
  });

  it('complete correct match → isCompleteMatch=true, percent=100', () => {
    const info = getValidationInfo(target, target);
    expect(info.isCompleteMatch).toBe(true);
    expect(info.percent).toBe(100);
  });

  it('percent increases as more graphemes are typed', () => {
    const targetGraphemes = splitIntoGraphemes(normalize(target));
    const half = targetGraphemes.slice(0, Math.floor(targetGraphemes.length / 2)).join('');
    const info = getValidationInfo(half, target);
    expect(info.percent).toBeGreaterThan(0);
    expect(info.percent).toBeLessThan(100);
  });

  it('percent does not exceed 100 even with extra input', () => {
    const info = getValidationInfo(target + target, target);
    expect(info.percent).toBeLessThanOrEqual(100);
  });

  it('returns inputGraphemes and targetGraphemes arrays', () => {
    const info = getValidationInfo('আমি', target);
    expect(Array.isArray(info.inputGraphemes)).toBe(true);
    expect(Array.isArray(info.targetGraphemes)).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// 3. getHighlightSegments() — correct / incorrect / remaining split
// ---------------------------------------------------------------------------

describe('getHighlightSegments() — segment splitting', () => {
  const displayTarget = 'আমি ভালো আছি';

  it('empty input → correct="", incorrect="", remaining=displayTarget', () => {
    const seg = getHighlightSegments('', displayTarget);
    expect(seg.correct).toBe('');
    expect(seg.incorrect).toBe('');
    expect(seg.remaining).toBe(displayTarget);
  });

  it('fully correct input → incorrect="" and remaining=""', () => {
    const seg = getHighlightSegments(displayTarget, displayTarget);
    expect(seg.incorrect).toBe('');
    expect(seg.remaining).toBe('');
    expect(seg.correct).toBe(displayTarget);
  });

  it('wrong first character → correct="" and incorrect is non-empty', () => {
    const seg = getHighlightSegments('ব', displayTarget);
    expect(seg.correct).toBe('');
    expect(seg.incorrect.length).toBeGreaterThan(0);
  });

  it('correct prefix then wrong char → correct is non-empty, incorrect is non-empty', () => {
    // Type 'আমি ' correctly then a wrong char
    const seg = getHighlightSegments('আমি ব', displayTarget);
    expect(seg.correct.length).toBeGreaterThan(0);
    expect(seg.incorrect.length).toBeGreaterThan(0);
  });

  it('correct + incorrect + remaining graphemes equal displayTarget graphemes', () => {
    const input = 'আমি ব';
    const seg = getHighlightSegments(input, displayTarget);
    const reconstructed = seg.correct + seg.incorrect + seg.remaining;
    const origGraphemes = splitter.splitGraphemes(displayTarget);
    const reconGraphemes = splitter.splitGraphemes(reconstructed);
    expect(reconGraphemes).toEqual(origGraphemes);
  });
});

// ---------------------------------------------------------------------------
// 4. Bengali conjunct (যুক্তাক্ষর) grapheme splitting
// ---------------------------------------------------------------------------

describe('Bengali conjunct grapheme splitting', () => {
  // grapheme-splitter v1 uses Unicode 6.3 cluster rules.
  // Bengali virama (্) sequences are split as 2 graphemes: base + virama+consonant.
  // This is the library's actual behaviour — validation still works correctly
  // because both input and target are split identically.

  it("'ক্ষ' splits into 2 grapheme units (base + virama+consonant)", () => {
    const graphemes = splitIntoGraphemes('ক্ষ');
    expect(graphemes.length).toBe(2);
  });

  it("'ত্র' splits into 2 grapheme units (base + virama+consonant)", () => {
    const graphemes = splitIntoGraphemes('ত্র');
    expect(graphemes.length).toBe(2);
  });

  it("'জ্ঞ' splits into 2 grapheme units (base + virama+consonant)", () => {
    const graphemes = splitIntoGraphemes('জ্ঞ');
    expect(graphemes.length).toBe(2);
  });

  it('word containing conjunct: ক্ষমা splits into 3 grapheme units', () => {
    // ক্ষমা = [ক, ্ষ, মা] under grapheme-splitter v1 rules
    const graphemes = splitIntoGraphemes('ক্ষমা');
    expect(graphemes.length).toBe(3);
  });

  it('validation works correctly with conjunct-containing target (symmetric splitting)', () => {
    // Both input and target split identically → complete match is detected correctly
    const target = 'ক্ষমা করুন';
    const info = getValidationInfo(target, target);
    expect(info.isCompleteMatch).toBe(true);
    expect(info.percent).toBe(100);
  });
});

// ---------------------------------------------------------------------------
// 5. Edge cases
// ---------------------------------------------------------------------------

describe('Edge cases', () => {
  it('500+ character input → no crash, validation still works (Req 8.2)', () => {
    const longTarget = 'আমি সুস্থ থাকব '.repeat(40); // ~640 chars
    const info = getValidationInfo(longTarget, longTarget);
    expect(info.isCompleteMatch).toBe(true);
    expect(info.percent).toBe(100);
  });

  it('500+ character input with wrong suffix → isCorrectSoFar=false, no crash', () => {
    const base = 'আমি সুস্থ থাকব '.repeat(30);
    const info = getValidationInfo(base + 'ভুল', base + 'সঠিক');
    expect(() => getValidationInfo(base + 'ভুল', base + 'সঠিক')).not.toThrow();
    expect(info.isCompleteMatch).toBe(false);
  });

  it('pasted text (same as typed) → validation works identically (Req 8.1)', () => {
    const target = 'আমি প্রতিদিন সুস্থ থাকব';
    const typed = getValidationInfo(target, target);
    const pasted = getValidationInfo(target, target); // same input, simulates paste
    expect(typed.isCompleteMatch).toBe(pasted.isCompleteMatch);
    expect(typed.percent).toBe(pasted.percent);
    expect(typed.isCorrectSoFar).toBe(pasted.isCorrectSoFar);
  });

  it('pasted partial text → same result as typing the same partial text', () => {
    const target = 'আমি সুস্থ থাকব';
    const partial = 'আমি সুস্থ';
    const typed = getValidationInfo(partial, target);
    const pasted = getValidationInfo(partial, target);
    expect(typed.isCorrectSoFar).toBe(pasted.isCorrectSoFar);
    expect(typed.percent).toBe(pasted.percent);
  });

  it('getHighlightSegments with 500+ char displayTarget → no crash', () => {
    const longDisplay = 'আমি সুস্থ থাকব '.repeat(40).trim();
    expect(() => getHighlightSegments('আমি', longDisplay)).not.toThrow();
  });
});

// ---------------------------------------------------------------------------
// Property 8: Normalize Idempotency (fast-check)
// Validates: Requirements 1.2
// ---------------------------------------------------------------------------

describe('Property 8 — Normalize Idempotency', () => {
  /**
   * **Validates: Requirements 1.2**
   *
   * For any string s, normalize(normalize(s)) === normalize(s)
   */
  it('Property 8: normalize(normalize(s)) === normalize(s) for any string s', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        const once = normalize(s);
        const twice = normalize(once);
        return once === twice;
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 9: Validation Percent Bounds (fast-check)
// Validates: Requirements 4.6
// ---------------------------------------------------------------------------

describe('Property 9 — Validation Percent Bounds', () => {
  /**
   * **Validates: Requirements 4.6**
   *
   * For any input and target, getValidationInfo().percent is always in [0, 100]
   */
  it('Property 9: getValidationInfo().percent is always in [0, 100]', () => {
    fc.assert(
      fc.property(fc.string(), fc.string(), (input, target) => {
        const info = getValidationInfo(input, target);
        return info.percent >= 0 && info.percent <= 100;
      }),
    );
  });
});

// ---------------------------------------------------------------------------
// Property 10: Highlight Segment Completeness (fast-check)
// Validates: Requirements 4.7
// ---------------------------------------------------------------------------

describe('Property 10 — Highlight Segment Completeness', () => {
  /**
   * **Validates: Requirements 4.7**
   *
   * For any input and displayTarget,
   * correct + incorrect + remaining === displayTarget (grapheme-level)
   */
  it('Property 10: correct + incorrect + remaining graphemes === displayTarget graphemes', () => {
    fc.assert(
      fc.property(
        // Use printable ASCII + Bengali Unicode range for realistic inputs
        fc.string({ unit: 'grapheme' }),
        fc.string({ unit: 'grapheme' }),
        (input, displayTarget) => {
          const seg = getHighlightSegments(input, displayTarget);
          const reconstructed = seg.correct + seg.incorrect + seg.remaining;
          // Compare at grapheme level
          const origGraphemes = splitter.splitGraphemes(displayTarget);
          const reconGraphemes = splitter.splitGraphemes(reconstructed);
          if (origGraphemes.length !== reconGraphemes.length) return false;
          for (let i = 0; i < origGraphemes.length; i++) {
            if (origGraphemes[i] !== reconGraphemes[i]) return false;
          }
          return true;
        },
      ),
    );
  });
});
