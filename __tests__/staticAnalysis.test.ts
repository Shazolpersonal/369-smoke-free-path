/**
 * Static Code Analysis — Known Bug Documentation Tests
 * Task 12: beta-test-qa-audit spec
 *
 * These tests read source files as text and use regex/string matching to
 * document known bugs. All tests are expected to PASS — they confirm bugs exist.
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');

function readSource(relPath: string): string {
    return fs.readFileSync(path.join(ROOT, relPath), 'utf-8');
}

// ---------------------------------------------------------------------------
// 1. TaskCard.tsx — getLockedSlotMessage() now uses i18n (FIXED)
// ---------------------------------------------------------------------------
describe('Fix: TaskCard.tsx — getLockedSlotMessage() uses i18n', () => {
    const source = readSource('components/TaskCard.tsx');

    test('getLockedSlotMessage() function exists in TaskCard.tsx', () => {
        expect(source).toContain('getLockedSlotMessage');
    });

    test('FIXED: getLockedSlotMessage() uses t() for i18n — no hardcoded English strings', () => {
        // The function now calls t('taskCard.lockedMorning') etc.
        expect(source).toContain("t('taskCard.lockedMorning')");
        expect(source).toContain("t('taskCard.lockedNoon')");
        expect(source).toContain("t('taskCard.lockedNight')");
    });

    test('i18n keys taskCard.lockedMorning/lockedNoon/lockedNight exist in en.ts', () => {
        const enSource = readSource('i18n/en.ts');
        expect(enSource).toContain("'taskCard.lockedMorning'");
        expect(enSource).toContain("'taskCard.lockedNoon'");
        expect(enSource).toContain("'taskCard.lockedNight'");
    });
});

// ---------------------------------------------------------------------------
// 2. en.ts — dashboard.restPeriod duplicate key (FIXED)
// ---------------------------------------------------------------------------
describe('Fix: en.ts — dashboard.restPeriod duplicate key removed', () => {
    const source = readSource('i18n/en.ts');

    test('dashboard.restPeriod appears exactly once in en.ts source (duplicate removed)', () => {
        const matches = source.match(/'dashboard\.restPeriod'/g);
        expect(matches).not.toBeNull();
        expect(matches!.length).toBe(1);
    });
});

// ---------------------------------------------------------------------------
// 3. bn.ts — dashboard.restPeriod duplicate key (FIXED)
// ---------------------------------------------------------------------------
describe('Fix: bn.ts — dashboard.restPeriod duplicate key removed', () => {
    const source = readSource('i18n/bn.ts');

    test('dashboard.restPeriod appears exactly once in bn.ts source (duplicate removed)', () => {
        const matches = source.match(/'dashboard\.restPeriod'/g);
        expect(matches).not.toBeNull();
        expect(matches!.length).toBe(1);
    });
});

// ---------------------------------------------------------------------------
// 4. history.tsx — translation keys fixed (morningAffirmation etc.)
// ---------------------------------------------------------------------------
describe('Fix: history.tsx — translation key mismatch resolved', () => {
    const historySource = readSource('app/(tabs)/history.tsx');
    const enSource = readSource('i18n/en.ts');
    const bnSource = readSource('i18n/bn.ts');

    test('history.tsx uses correct key history.morningAffirmation', () => {
        expect(historySource).toContain("history.morningAffirmation");
    });

    test('history.tsx uses correct key history.afternoonAffirmation', () => {
        expect(historySource).toContain("history.afternoonAffirmation");
    });

    test('history.tsx uses correct key history.eveningAffirmation', () => {
        expect(historySource).toContain("history.eveningAffirmation");
    });

    test('FIXED: history.morningNiyyah is absent from history.tsx (stale key removed)', () => {
        expect(historySource).not.toContain("history.morningNiyyah");
    });

    test('FIXED: history.afternoonNiyyah is absent from history.tsx (stale key removed)', () => {
        expect(historySource).not.toContain("history.afternoonNiyyah");
    });

    test('FIXED: history.eveningNiyyah is absent from history.tsx (stale key removed)', () => {
        expect(historySource).not.toContain("history.eveningNiyyah");
    });

    test('history.morningNiyyah is absent from en.ts', () => {
        expect(enSource).not.toContain("'history.morningNiyyah'");
    });

    test('history.afternoonNiyyah is absent from en.ts', () => {
        expect(enSource).not.toContain("'history.afternoonNiyyah'");
    });

    test('history.eveningNiyyah is absent from en.ts', () => {
        expect(enSource).not.toContain("'history.eveningNiyyah'");
    });

    test('history.morningNiyyah is absent from bn.ts', () => {
        expect(bnSource).not.toContain("'history.morningNiyyah'");
    });

    test('history.afternoonNiyyah is absent from bn.ts', () => {
        expect(bnSource).not.toContain("'history.afternoonNiyyah'");
    });

    test('history.eveningNiyyah is absent from bn.ts', () => {
        expect(bnSource).not.toContain("'history.eveningNiyyah'");
    });

    test('en.ts has history.morningAffirmation (the correct key)', () => {
        expect(enSource).toContain("'history.morningAffirmation'");
    });
});

// ---------------------------------------------------------------------------
// 5. timeSlotManager.ts — require() inside function body (FIXED)
// ---------------------------------------------------------------------------
describe('Fix: timeSlotManager.ts — require() removed from function body', () => {
    const source = readSource('utils/timeSlotManager.ts');

    test('formatDateKeyHumanReadable function exists in timeSlotManager.ts', () => {
        expect(source).toContain('formatDateKeyHumanReadable');
    });

    test('FIXED: no inline require() call inside formatDateKeyHumanReadable function body', () => {
        const fnMatch = source.match(/formatDateKeyHumanReadable[\s\S]*?^};/m);
        expect(fnMatch).not.toBeNull();
        expect(fnMatch![0]).not.toContain("require(");
    });

    test('FIXED: no inlined require() pattern in timeSlotManager.ts', () => {
        const inlinedRequirePattern = /\bconst\s+\{[^}]+\}\s*=\s*require\s*\(/;
        expect(inlinedRequirePattern.test(source)).toBe(false);
    });
});

// ---------------------------------------------------------------------------
// 6. en.ts — guide.encouragement key added (FIXED)
// ---------------------------------------------------------------------------
describe('Fix: en.ts — guide.encouragement key added', () => {
    const enSource = readSource('i18n/en.ts');
    const bnSource = readSource('i18n/bn.ts');

    test('FIXED: guide.encouragement is now present in en.ts', () => {
        expect(enSource).toContain("'guide.encouragement'");
    });

    test('guide.encouragement IS present in bn.ts', () => {
        expect(bnSource).toContain("'guide.encouragement'");
    });

    test('FIXED: i18n symmetry restored — both en.ts and bn.ts have guide.encouragement', () => {
        const enHasKey = enSource.includes("'guide.encouragement'");
        const bnHasKey = bnSource.includes("'guide.encouragement'");
        expect(enHasKey).toBe(true);
        expect(bnHasKey).toBe(true);
    });
});
