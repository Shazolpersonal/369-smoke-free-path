/**
 * Bengali Numeral Display Audit Tests
 * Validates: Requirements 10.2, 3.1, 4.5, 4.6
 */
import * as fc from 'fast-check';
import { formatNumberByLanguage } from '../utils/bengaliNumber';

const BENGALI_DIGITS_REGEX = /^[০-৯]+$/;
const ASCII_DIGITS_REGEX = /^[0-9]+$/;

describe('Bengali Numeral Display Audit', () => {
  describe('Specific value tests — Bengali (bn)', () => {
    const cases: [number, string][] = [
      [0, '০'],
      [1, '১'],
      [9, '৯'],
      [10, '১০'],
      [41, '৪১'],
      [100, '১০০'],
      [369, '৩৬৯'],
    ];

    test.each(cases)('formatNumberByLanguage(%i, "bn") === "%s"', (input, expected) => {
      expect(formatNumberByLanguage(input, 'bn')).toBe(expected);
    });
  });

  describe('Specific value tests — English (en)', () => {
    const cases: number[] = [0, 1, 9, 10, 41, 100, 369];

    test.each(cases)('formatNumberByLanguage(%i, "en") returns ASCII "%i"', (input) => {
      expect(formatNumberByLanguage(input, 'en')).toBe(String(input));
    });
  });

  describe('Bengali digit regex validation', () => {
    it('returns only Bengali digits for bn locale', () => {
      const values = [0, 1, 9, 10, 41, 100, 369];
      for (const n of values) {
        const result = formatNumberByLanguage(n, 'bn');
        expect(result).toMatch(BENGALI_DIGITS_REGEX);
        expect(result).not.toMatch(/[0-9]/);
      }
    });

    it('returns only ASCII digits for en locale', () => {
      const values = [0, 1, 9, 10, 41, 100, 369];
      for (const n of values) {
        const result = formatNumberByLanguage(n, 'en');
        expect(result).toMatch(ASCII_DIGITS_REGEX);
      }
    });
  });

  describe('Streak counter format (single number)', () => {
    it('streak counter in bn returns Bengali digits only', () => {
      // Streak values are single non-negative integers
      for (const streak of [0, 1, 7, 21, 41, 100]) {
        const result = formatNumberByLanguage(streak, 'bn');
        expect(result).toMatch(BENGALI_DIGITS_REGEX);
      }
    });

    it('streak counter in en returns ASCII digits only', () => {
      for (const streak of [0, 1, 7, 21, 41, 100]) {
        const result = formatNumberByLanguage(streak, 'en');
        expect(result).toMatch(ASCII_DIGITS_REGEX);
      }
    });
  });

  describe('Counter badge format (e.g. "3/9")', () => {
    // formatNumberByLanguage handles single numbers; badge "3/9" is composed of two calls
    it('badge numerator and denominator in bn are Bengali digits', () => {
      const numerator = formatNumberByLanguage(3, 'bn');
      const denominator = formatNumberByLanguage(9, 'bn');
      expect(numerator).toMatch(BENGALI_DIGITS_REGEX);
      expect(denominator).toMatch(BENGALI_DIGITS_REGEX);
      // Composed badge string contains only Bengali digits and separator
      const badge = `${numerator}/${denominator}`;
      expect(badge).toMatch(/^[০-৯]+\/[০-৯]+$/);
    });

    it('badge numerator and denominator in en are ASCII digits', () => {
      const numerator = formatNumberByLanguage(3, 'en');
      const denominator = formatNumberByLanguage(9, 'en');
      expect(numerator).toMatch(ASCII_DIGITS_REGEX);
      expect(denominator).toMatch(ASCII_DIGITS_REGEX);
      const badge = `${numerator}/${denominator}`;
      expect(badge).toMatch(/^[0-9]+\/[0-9]+$/);
    });
  });

  /**
   * Property 2: Numeral Display Consistency
   * For any integer n ≥ 0:
   *   - formatNumberByLanguage(n, 'bn') contains only Bengali digits
   *   - formatNumberByLanguage(n, 'en') contains only ASCII digits
   * Validates: Requirements 10.2
   */
  describe('Property 2: Numeral Display Consistency (fast-check)', () => {
    it('bn: any non-negative integer produces only Bengali digits', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 1_000_000 }), (n) => {
          const result = formatNumberByLanguage(n, 'bn');
          expect(result).toMatch(BENGALI_DIGITS_REGEX);
          expect(result).not.toMatch(/[0-9]/);
        })
      );
    });

    it('en: any non-negative integer produces only ASCII digits', () => {
      fc.assert(
        fc.property(fc.integer({ min: 0, max: 1_000_000 }), (n) => {
          const result = formatNumberByLanguage(n, 'en');
          expect(result).toMatch(ASCII_DIGITS_REGEX);
        })
      );
    });
  });
});
