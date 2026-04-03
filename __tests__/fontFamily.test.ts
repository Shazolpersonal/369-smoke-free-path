// Feature: ui-ux-production-ready, Property 9: getFontFamily argument order invariant
import * as fc from 'fast-check';
import { getFontFamily } from '../utils/fonts';

describe('getFontFamily', () => {
    it('Property 9: returns same font regardless of argument order', () => {
        const weights = fc.constantFrom('regular', 'medium', 'semibold', 'bold') as fc.Arbitrary<'regular' | 'medium' | 'semibold' | 'bold'>;
        const languages = fc.constantFrom('en', 'bn') as fc.Arbitrary<'en' | 'bn'>;
        fc.assert(fc.property(weights, languages, (weight, language) => {
            expect(getFontFamily(weight, language)).toBe(getFontFamily(language, weight));
        }));
    });
});
