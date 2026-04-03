/**
 * i18n Completeness Audit — Translation Key Coverage Tests
 * Validates: Requirements 10.1, 10.3, 10.4, 11.4, 11.5
 */

import * as fc from 'fast-check';

// We import the raw source text to detect duplicate keys at the source level.
// The TypeScript objects themselves will have duplicates silently overridden,
// so we also read the raw file content for static analysis.
import { en } from '../i18n/en';
import { bn } from '../i18n/bn';
import * as fs from 'fs';
import * as path from 'path';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Flatten a flat Record<string, string> (already flat — keys use dot notation)
 * into a Set of keys. The i18n files already use flat dot-notation keys,
 * so no recursive flattening is needed.
 */
function getKeys(obj: Record<string, string>): Set<string> {
    return new Set(Object.keys(obj));
}

/**
 * Extract all string literal keys from a TypeScript source file that uses
 * the pattern:  'some.key': '...',
 * Returns an array (preserving duplicates) so we can detect duplicate keys.
 */
function extractKeysFromSource(filePath: string): string[] {
    const source = fs.readFileSync(filePath, 'utf-8');
    const regex = /^\s*'([^']+)'\s*:/gm;
    const keys: string[] = [];
    let match: RegExpExecArray | null;
    while ((match = regex.exec(source)) !== null) {
        keys.push(match[1]);
    }
    return keys;
}

// ---------------------------------------------------------------------------
// Paths to source files (relative to this test file)
// ---------------------------------------------------------------------------
const EN_PATH = path.resolve(__dirname, '../i18n/en.ts');
const BN_PATH = path.resolve(__dirname, '../i18n/bn.ts');

// ---------------------------------------------------------------------------
// 1. Key symmetry: every en key must exist in bn
// ---------------------------------------------------------------------------
describe('i18n Key Symmetry — en → bn', () => {
    const enKeys = getKeys(en);
    const bnKeys = getKeys(bn);

    test('every key in en.ts has a corresponding entry in bn.ts', () => {
        const missingInBn: string[] = [];
        enKeys.forEach((key) => {
            if (!bnKeys.has(key)) {
                missingInBn.push(key);
            }
        });
        expect(missingInBn).toEqual([]);
    });
});

// ---------------------------------------------------------------------------
// 2. Symmetry: guide.encouragement now exists in both en and bn (FIXED)
// ---------------------------------------------------------------------------
describe('i18n Symmetry — guide.encouragement (FIXED)', () => {
    const enKeys = getKeys(en);
    const bnKeys = getKeys(bn);

    test('guide.encouragement is present in bn.ts', () => {
        expect(bnKeys.has('guide.encouragement')).toBe(true);
    });

    test('FIXED: guide.encouragement is now present in en.ts', () => {
        expect(enKeys.has('guide.encouragement')).toBe(true);
    });

    test('FIXED: guide.encouragement is no longer a bn-only key', () => {
        const bnOnlyKeys: string[] = [];
        bnKeys.forEach((key) => {
            if (!enKeys.has(key)) {
                bnOnlyKeys.push(key);
            }
        });
        // guide.encouragement was fixed — it should no longer be bn-only
        expect(bnOnlyKeys).not.toContain('guide.encouragement');
    });
});

// ---------------------------------------------------------------------------
// 3. Duplicate key detection: dashboard.restPeriod fixed (FIXED)
// ---------------------------------------------------------------------------
describe('i18n Duplicate Key Detection (FIXED)', () => {
    test('FIXED: dashboard.restPeriod appears exactly once in en.ts source', () => {
        const enSourceKeys = extractKeysFromSource(EN_PATH);
        const restPeriodOccurrences = enSourceKeys.filter((k) => k === 'dashboard.restPeriod');
        expect(restPeriodOccurrences.length).toBe(1);
    });

    test('FIXED: dashboard.restPeriod appears exactly once in bn.ts source', () => {
        const bnSourceKeys = extractKeysFromSource(BN_PATH);
        const restPeriodOccurrences = bnSourceKeys.filter((k) => k === 'dashboard.restPeriod');
        expect(restPeriodOccurrences.length).toBe(1);
    });

    test('runtime en object only has one dashboard.restPeriod value', () => {
        expect(Object.keys(en).filter((k) => k === 'dashboard.restPeriod').length).toBe(1);
    });

    test('runtime bn object only has one dashboard.restPeriod value', () => {
        expect(Object.keys(bn).filter((k) => k === 'dashboard.restPeriod').length).toBe(1);
    });
});

// ---------------------------------------------------------------------------
// 4. Missing key: history.emptyState now present in both files (FIXED)
// ---------------------------------------------------------------------------
describe('i18n Missing Key Detection — history.emptyState (FIXED)', () => {
    const enKeys = getKeys(en);
    const bnKeys = getKeys(bn);

    test('FIXED: history.emptyState is now present in en.ts', () => {
        expect(enKeys.has('history.emptyState')).toBe(true);
    });

    test('FIXED: history.emptyState is now present in bn.ts', () => {
        expect(bnKeys.has('history.emptyState')).toBe(true);
    });
});

// ---------------------------------------------------------------------------
// 5. Property 1: i18n Key Symmetry (fast-check)
//    Validates: Requirements 10.1
//
//    For every key in `en`, a corresponding key exists in `bn`.
// ---------------------------------------------------------------------------
describe('Property 1: i18n Key Symmetry', () => {
    /**
     * **Validates: Requirements 10.1**
     *
     * We use fast-check to pick arbitrary keys from the `en` object and assert
     * that each one is also present in `bn`. This property holds iff en ⊆ bn
     * (key-wise).
     */
    test('for every key in en, a corresponding key exists in bn', () => {
        const enKeyArray = Object.keys(en);
        const bnKeys = getKeys(bn);

        fc.assert(
            fc.property(
                // Generate arbitrary indices into the en key array
                fc.integer({ min: 0, max: enKeyArray.length - 1 }),
                (index) => {
                    const key = enKeyArray[index];
                    return bnKeys.has(key);
                }
            )
        );
    });
});
