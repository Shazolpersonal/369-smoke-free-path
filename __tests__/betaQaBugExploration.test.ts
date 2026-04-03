/**
 * Beta QA Bug Exploration Tests
 *
 * These tests assert the BUGGY state of the code.
 * They are EXPECTED TO FAIL on unfixed code — failure confirms the bugs exist.
 *
 * DO NOT attempt to fix the tests or the code when they fail.
 * GOAL: Surface counterexamples that demonstrate each bug exists.
 */

import * as fs from 'fs';
import * as path from 'path';
import { en } from '../i18n/en';
import { bn } from '../i18n/bn';
import { formatDateKeyHumanReadable } from '../utils/timeSlotManager';

// Mock AsyncStorage — required because TaskCard imports LanguageContext which uses AsyncStorage
jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn().mockResolvedValue(null),
    setItem: jest.fn().mockResolvedValue(undefined),
    removeItem: jest.fn().mockResolvedValue(undefined),
    clear: jest.fn().mockResolvedValue(undefined),
}));

import { taskCardStyles } from '../components/TaskCard';

// ─────────────────────────────────────────────────────────────────────────────
// Bug 1 — history.tsx: Translation Key Mismatch (morningNiyyah / afternoonNiyyah / eveningNiyyah)
//
// The day-detail bottom sheet uses t('history.morningNiyyah') etc., but those
// keys were renamed to *Affirmation in both translation files.
// Expected (buggy) state: the old keys are UNDEFINED in both en and bn.
// ─────────────────────────────────────────────────────────────────────────────
describe('Bug 1 — history.tsx stale translation keys', () => {
    it('en["history.morningNiyyah"] is undefined (key was renamed to morningAffirmation)', () => {
        // BUGGY assertion: old key must not exist
        expect(en['history.morningNiyyah']).toBeUndefined();
    });

    it('en["history.afternoonNiyyah"] is undefined (key was renamed to afternoonAffirmation)', () => {
        expect(en['history.afternoonNiyyah']).toBeUndefined();
    });

    it('en["history.eveningNiyyah"] is undefined (key was renamed to eveningAffirmation)', () => {
        expect(en['history.eveningNiyyah']).toBeUndefined();
    });

    it('bn["history.morningNiyyah"] is undefined', () => {
        expect(bn['history.morningNiyyah']).toBeUndefined();
    });

    it('bn["history.afternoonNiyyah"] is undefined', () => {
        expect(bn['history.afternoonNiyyah']).toBeUndefined();
    });

    it('bn["history.eveningNiyyah"] is undefined', () => {
        expect(bn['history.eveningNiyyah']).toBeUndefined();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Bug 2 — TaskCard.tsx: Hardcoded English Locked Slot Messages (FIXED)
//
// getLockedSlotMessage() now uses t('taskCard.lockedMorning') etc.
// ─────────────────────────────────────────────────────────────────────────────
describe('Bug 2 — TaskCard.tsx hardcoded locked slot messages (FIXED)', () => {
    const taskCardSource = fs.readFileSync(
        path.join(__dirname, '../components/TaskCard.tsx'),
        'utf-8'
    );

    it('FIXED: TaskCard source uses t("taskCard.lockedMorning") instead of hardcoded English', () => {
        expect(taskCardSource).toContain("t('taskCard.lockedMorning')");
    });

    it('FIXED: TaskCard source uses t("taskCard.lockedNoon") instead of hardcoded English', () => {
        expect(taskCardSource).toContain("t('taskCard.lockedNoon')");
    });

    it('FIXED: TaskCard source uses t("taskCard.lockedNight") instead of hardcoded English', () => {
        expect(taskCardSource).toContain("t('taskCard.lockedNight')");
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Bug 3 — dashboard.restPeriod Duplicate Key (FIXED)
// ─────────────────────────────────────────────────────────────────────────────
describe('Bug 3 — dashboard.restPeriod duplicate key in translation files (FIXED)', () => {
    const enSource = fs.readFileSync(
        path.join(__dirname, '../i18n/en.ts'),
        'utf-8'
    );
    const bnSource = fs.readFileSync(
        path.join(__dirname, '../i18n/bn.ts'),
        'utf-8'
    );

    const countOccurrences = (source: string, key: string): number => {
        const regex = new RegExp(key.replace(/\./g, '\\.'), 'g');
        return (source.match(regex) || []).length;
    };

    it('FIXED: en.ts contains exactly 1 occurrence of "dashboard.restPeriod" (duplicate removed)', () => {
        expect(countOccurrences(enSource, "'dashboard.restPeriod'")).toBe(1);
    });

    it('FIXED: bn.ts contains exactly 1 occurrence of "dashboard.restPeriod" (duplicate removed)', () => {
        expect(countOccurrences(bnSource, "'dashboard.restPeriod'")).toBe(1);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Bug 4 — guide.encouragement Missing from en.ts (FIXED)
// ─────────────────────────────────────────────────────────────────────────────
describe('Bug 4 — guide.encouragement missing from en.ts (FIXED)', () => {
    it('FIXED: en["guide.encouragement"] is now defined', () => {
        expect(en['guide.encouragement']).toBeDefined();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Bug 5 — history.emptyState Missing Key (FIXED)
// ─────────────────────────────────────────────────────────────────────────────
describe('Bug 5 — history.emptyState missing from both translation files (FIXED)', () => {
    it('FIXED: en["history.emptyState"] is now defined', () => {
        expect(en['history.emptyState']).toBeDefined();
    });

    it('FIXED: bn["history.emptyState"] is now defined', () => {
        expect(bn['history.emptyState']).toBeDefined();
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Bug 6 — require() Inside formatDateKeyHumanReadable() Function Body (FIXED)
// ─────────────────────────────────────────────────────────────────────────────
describe('Bug 6 — require() inside formatDateKeyHumanReadable function body (FIXED)', () => {
    it('FIXED: formatDateKeyHumanReadable.toString() does not contain "require(" (inline require removed)', () => {
        expect(formatDateKeyHumanReadable.toString()).not.toContain("require(");
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Bug 7 — completedBadge / lockedBadge Touch Targets (FIXED to 44pt)
// ─────────────────────────────────────────────────────────────────────────────
describe('Bug 7 — badge touch targets fixed to 44pt minimum', () => {
    it('FIXED: taskCardStyles.completedBadge.width === 44 (meets 44pt minimum)', () => {
        expect(taskCardStyles.completedBadge.width).toBe(44);
    });

    it('FIXED: taskCardStyles.completedBadge.height === 44 (meets 44pt minimum)', () => {
        expect(taskCardStyles.completedBadge.height).toBe(44);
    });

    it('FIXED: taskCardStyles.lockedBadge.width === 44 (meets 44pt minimum)', () => {
        expect(taskCardStyles.lockedBadge.width).toBe(44);
    });

    it('FIXED: taskCardStyles.lockedBadge.height === 44 (meets 44pt minimum)', () => {
        expect(taskCardStyles.lockedBadge.height).toBe(44);
    });
});
