// Feature: ui-ux-production-ready, Property 1: Bengali numeral display consistency
import * as fc from 'fast-check';
import { formatNumberByLanguage } from '../utils/bengaliNumber';

describe('Bengali Number Formatting', () => {
    it('Property 1: Bengali numerals contain only Bengali digits', () => {
        fc.assert(fc.property(fc.integer({ min: 0, max: 999 }), (n) => {
            const result = formatNumberByLanguage(n, 'bn');
            expect(result).toMatch(/^[০-৯]+$/);
            expect(result).not.toMatch(/[0-9]/);
        }));
    });

    it('English numerals contain only ASCII digits', () => {
        fc.assert(fc.property(fc.integer({ min: 0, max: 999 }), (n) => {
            const result = formatNumberByLanguage(n, 'en');
            expect(result).toMatch(/^[0-9]+$/);
        }));
    });
});
