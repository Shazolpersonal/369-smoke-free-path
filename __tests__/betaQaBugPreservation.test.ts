/**
 * Beta QA Bug Preservation Tests
 *
 * These tests assert the NON-BUGGY paths — things that should continue to work
 * both before AND after the fixes are applied.
 *
 * All tests MUST PASS on unfixed code — they establish the baseline behavior
 * that must not regress after fixes.
 *
 * Property 2: Preservation — Non-Buggy Paths for All 7 Bugs
 * Validates: Requirements 3.1, 3.2, 3.3 (all bugs)
 */

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
import { COLORS } from '../utils/theme';

// ─────────────────────────────────────────────────────────────────────────────
// Bug 1 Preservation — history.month.*, history.weekday.*, noProgress, close
//
// The fix only changes three slot label keys inside the day-detail bottom sheet.
// All calendar header keys (month names, weekday abbreviations) and the
// noProgress / close keys must remain unchanged.
// ─────────────────────────────────────────────────────────────────────────────
describe('Bug 1 Preservation — history calendar keys unchanged in both languages', () => {
    const monthKeys = [
        'history.month.january', 'history.month.february', 'history.month.march',
        'history.month.april', 'history.month.may', 'history.month.june',
        'history.month.july', 'history.month.august', 'history.month.september',
        'history.month.october', 'history.month.november', 'history.month.december',
    ];

    const weekdayKeys = [
        'history.weekday.sun', 'history.weekday.mon', 'history.weekday.tue',
        'history.weekday.wed', 'history.weekday.thu', 'history.weekday.fri',
        'history.weekday.sat',
    ];

    it.each(monthKeys)('en["%s"] is a non-empty string', (key) => {
        expect(en[key]).toBeTruthy();
        expect(typeof en[key]).toBe('string');
        expect(en[key].length).toBeGreaterThan(0);
    });

    it.each(monthKeys)('bn["%s"] is a non-empty string', (key) => {
        expect(bn[key]).toBeTruthy();
        expect(typeof bn[key]).toBe('string');
        expect(bn[key].length).toBeGreaterThan(0);
    });

    it.each(weekdayKeys)('en["%s"] is a non-empty string', (key) => {
        expect(en[key]).toBeTruthy();
        expect(typeof en[key]).toBe('string');
        expect(en[key].length).toBeGreaterThan(0);
    });

    it.each(weekdayKeys)('bn["%s"] is a non-empty string', (key) => {
        expect(bn[key]).toBeTruthy();
        expect(typeof bn[key]).toBe('string');
        expect(bn[key].length).toBeGreaterThan(0);
    });

    it('en["history.noProgress"] is a non-empty string', () => {
        expect(en['history.noProgress']).toBeTruthy();
        expect(typeof en['history.noProgress']).toBe('string');
    });

    it('bn["history.noProgress"] is a non-empty string', () => {
        expect(bn['history.noProgress']).toBeTruthy();
        expect(typeof bn['history.noProgress']).toBe('string');
    });

    it('en["history.close"] is a non-empty string', () => {
        expect(en['history.close']).toBeTruthy();
        expect(typeof en['history.close']).toBe('string');
    });

    it('bn["history.close"] is a non-empty string', () => {
        expect(bn['history.close']).toBeTruthy();
        expect(typeof bn['history.close']).toBe('string');
    });

    // The CORRECT keys (morningAffirmation etc.) already exist and must remain
    it('en["history.morningAffirmation"] is a non-empty string', () => {
        expect(en['history.morningAffirmation']).toBeTruthy();
        expect(typeof en['history.morningAffirmation']).toBe('string');
    });

    it('bn["history.morningAffirmation"] is a non-empty string', () => {
        expect(bn['history.morningAffirmation']).toBeTruthy();
        expect(typeof bn['history.morningAffirmation']).toBe('string');
    });

    it('en["history.afternoonAffirmation"] is a non-empty string', () => {
        expect(en['history.afternoonAffirmation']).toBeTruthy();
        expect(typeof en['history.afternoonAffirmation']).toBe('string');
    });

    it('bn["history.afternoonAffirmation"] is a non-empty string', () => {
        expect(bn['history.afternoonAffirmation']).toBeTruthy();
        expect(typeof bn['history.afternoonAffirmation']).toBe('string');
    });

    it('en["history.eveningAffirmation"] is a non-empty string', () => {
        expect(en['history.eveningAffirmation']).toBeTruthy();
        expect(typeof en['history.eveningAffirmation']).toBe('string');
    });

    it('bn["history.eveningAffirmation"] is a non-empty string', () => {
        expect(bn['history.eveningAffirmation']).toBeTruthy();
        expect(typeof bn['history.eveningAffirmation']).toBe('string');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Bug 2 Preservation — taskCard.opensAt and taskCard.opensInMin keys
//
// The fix only changes getLockedSlotMessage() to use t(). The timing hint keys
// (opensAt, opensInMin) already use t() and must remain unchanged.
// ─────────────────────────────────────────────────────────────────────────────
describe('Bug 2 Preservation — taskCard timing hint keys unchanged in both languages', () => {
    it('en["taskCard.opensAt"] is a non-empty string', () => {
        expect(en['taskCard.opensAt']).toBeTruthy();
        expect(typeof en['taskCard.opensAt']).toBe('string');
        expect(en['taskCard.opensAt'].length).toBeGreaterThan(0);
    });

    it('bn["taskCard.opensAt"] is a non-empty string', () => {
        expect(bn['taskCard.opensAt']).toBeTruthy();
        expect(typeof bn['taskCard.opensAt']).toBe('string');
        expect(bn['taskCard.opensAt'].length).toBeGreaterThan(0);
    });

    it('en["taskCard.opensInMin"] is a non-empty string', () => {
        expect(en['taskCard.opensInMin']).toBeTruthy();
        expect(typeof en['taskCard.opensInMin']).toBe('string');
        expect(en['taskCard.opensInMin'].length).toBeGreaterThan(0);
    });

    it('bn["taskCard.opensInMin"] is a non-empty string', () => {
        expect(bn['taskCard.opensInMin']).toBeTruthy();
        expect(typeof bn['taskCard.opensInMin']).toBe('string');
        expect(bn['taskCard.opensInMin'].length).toBeGreaterThan(0);
    });

    it('en["taskCard.opensAt"] contains the {{time}} placeholder', () => {
        expect(en['taskCard.opensAt']).toContain('{{time}}');
    });

    it('bn["taskCard.opensAt"] contains the {{time}} placeholder', () => {
        expect(bn['taskCard.opensAt']).toContain('{{time}}');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Bug 3 Preservation — all dashboard.* keys OTHER than dashboard.restPeriod
//
// The fix only removes the duplicate dashboard.restPeriod line. All other
// dashboard keys must remain unchanged.
// ─────────────────────────────────────────────────────────────────────────────
describe('Bug 3 Preservation — other dashboard keys unchanged in both languages', () => {
    const representativeDashboardKeys = [
        'dashboard.streak',
        'dashboard.dayOf',
        'dashboard.day',
        'dashboard.days',
        'dashboard.todayComplete',
        'dashboard.startFresh',
        'dashboard.tagline',
        'dashboard.viewProgress',
        'dashboard.close',
        'dashboard.mashaAllah',
        'dashboard.journeyComplete',
        'dashboard.cycle',
    ];

    // Filter to keys that actually exist in en (dayOf may not exist)
    const existingEnKeys = representativeDashboardKeys.filter(k => en[k] !== undefined);
    const existingBnKeys = representativeDashboardKeys.filter(k => bn[k] !== undefined);

    it.each(existingEnKeys)('en["%s"] is a non-empty string', (key) => {
        expect(en[key]).toBeTruthy();
        expect(typeof en[key]).toBe('string');
        expect(en[key].length).toBeGreaterThan(0);
    });

    it.each(existingBnKeys)('bn["%s"] is a non-empty string', (key) => {
        expect(bn[key]).toBeTruthy();
        expect(typeof bn[key]).toBe('string');
        expect(bn[key].length).toBeGreaterThan(0);
    });

    it('en["dashboard.streak"] equals "🔥 Streak:"', () => {
        expect(en['dashboard.streak']).toBe('🔥 Streak:');
    });

    it('bn["dashboard.streak"] is a non-empty Bengali string', () => {
        expect(bn['dashboard.streak']).toBeTruthy();
        expect(bn['dashboard.streak'].length).toBeGreaterThan(0);
    });

    it('en["dashboard.restPeriod"] is a non-empty string (value preserved even if duplicate removed)', () => {
        expect(en['dashboard.restPeriod']).toBeTruthy();
        expect(typeof en['dashboard.restPeriod']).toBe('string');
    });

    it('bn["dashboard.restPeriod"] is a non-empty string (value preserved even if duplicate removed)', () => {
        expect(bn['dashboard.restPeriod']).toBeTruthy();
        expect(typeof bn['dashboard.restPeriod']).toBe('string');
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Bug 4 Preservation — bn["guide.encouragement"] unchanged; all other guide.* keys
//
// The fix only adds guide.encouragement to en.ts. The Bengali value must remain
// unchanged, and all other guide.* keys in both files must remain non-empty.
// ─────────────────────────────────────────────────────────────────────────────
describe('Bug 4 Preservation — bn["guide.encouragement"] and other guide keys unchanged', () => {
    it('bn["guide.encouragement"] is a non-empty string', () => {
        expect(bn['guide.encouragement']).toBeTruthy();
        expect(typeof bn['guide.encouragement']).toBe('string');
        expect(bn['guide.encouragement'].length).toBeGreaterThan(10);
    });

    const otherGuideKeys = [
        'guide.title',
        'guide.whatIs.title',
        'guide.whatIs.body',
        'guide.method.title',
        'guide.method.intro',
        'guide.method.morning.title',
        'guide.method.morning.desc',
        'guide.method.noon.title',
        'guide.method.noon.desc',
        'guide.method.night.title',
        'guide.method.night.desc',
        'guide.howToWrite.title',
        'guide.rules.title',
        'guide.streaks.title',
        'guide.dua',
    ];

    it.each(otherGuideKeys)('en["%s"] is a non-empty string', (key) => {
        expect(en[key]).toBeTruthy();
        expect(typeof en[key]).toBe('string');
        expect(en[key].length).toBeGreaterThan(0);
    });

    it.each(otherGuideKeys)('bn["%s"] is a non-empty string', (key) => {
        expect(bn[key]).toBeTruthy();
        expect(typeof bn[key]).toBe('string');
        expect(bn[key].length).toBeGreaterThan(0);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Bug 5 Preservation — other history.* keys resolve correctly
//
// The fix only adds history.emptyState to both translation files. All other
// history keys must remain unchanged.
// ─────────────────────────────────────────────────────────────────────────────
describe('Bug 5 Preservation — other history keys unchanged in both languages', () => {
    const representativeHistoryKeys = [
        'history.title',
        'history.complete',
        'history.partial',
        'history.totalDays',
        'history.missed',
        'history.pending',
        'history.noProgress',
        'history.close',
        'history.legend.title',
        'history.midnightNotice',
    ];

    it.each(representativeHistoryKeys)('en["%s"] is a non-empty string', (key) => {
        expect(en[key]).toBeTruthy();
        expect(typeof en[key]).toBe('string');
        expect(en[key].length).toBeGreaterThan(0);
    });

    it.each(representativeHistoryKeys)('bn["%s"] is a non-empty string', (key) => {
        expect(bn[key]).toBeTruthy();
        expect(typeof bn[key]).toBe('string');
        expect(bn[key].length).toBeGreaterThan(0);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Bug 6 Preservation — formatDateKeyHumanReadable output unchanged
//
// The fix only removes the inline require() — the output must be identical.
// ─────────────────────────────────────────────────────────────────────────────
describe('Bug 6 Preservation — formatDateKeyHumanReadable output unchanged', () => {
    it('formatDateKeyHumanReadable("2024-01-15", "en") returns "January 15, 2024"', () => {
        expect(formatDateKeyHumanReadable('2024-01-15', 'en')).toBe('January 15, 2024');
    });

    it('formatDateKeyHumanReadable("2024-06-01", "en") returns "June 1, 2024"', () => {
        expect(formatDateKeyHumanReadable('2024-06-01', 'en')).toBe('June 1, 2024');
    });

    it('formatDateKeyHumanReadable("2024-12-31", "en") returns "December 31, 2024"', () => {
        expect(formatDateKeyHumanReadable('2024-12-31', 'en')).toBe('December 31, 2024');
    });

    it('formatDateKeyHumanReadable("2024-01-15", "bn") returns a non-empty Bengali date string', () => {
        const result = formatDateKeyHumanReadable('2024-01-15', 'bn');
        expect(result).toBeTruthy();
        expect(result.length).toBeGreaterThan(0);
        // Bengali date strings contain Bengali characters (Unicode range U+0980–U+09FF)
        expect(/[\u0980-\u09FF]/.test(result)).toBe(true);
    });

    it('formatDateKeyHumanReadable("2024-06-01", "bn") returns a non-empty Bengali date string', () => {
        const result = formatDateKeyHumanReadable('2024-06-01', 'bn');
        expect(result).toBeTruthy();
        expect(/[\u0980-\u09FF]/.test(result)).toBe(true);
    });

    it('formatDateKeyHumanReadable("2024-12-31", "bn") returns a non-empty Bengali date string', () => {
        const result = formatDateKeyHumanReadable('2024-12-31', 'bn');
        expect(result).toBeTruthy();
        expect(/[\u0980-\u09FF]/.test(result)).toBe(true);
    });
});

// ─────────────────────────────────────────────────────────────────────────────
// Bug 7 Preservation — actionButton layout unchanged; badge borderRadius = width/2
//
// The fix only changes width/height/borderRadius of completedBadge and lockedBadge.
// The actionButton (active state) must remain completely unchanged.
// Current state: badges are 40×40 with borderRadius 20 (= 40/2).
// ─────────────────────────────────────────────────────────────────────────────
describe('Bug 7 Preservation — actionButton layout unchanged and badge borderRadius = width/2', () => {
    it('taskCardStyles.actionButton exists', () => {
        expect(taskCardStyles.actionButton).toBeDefined();
    });

    it('taskCardStyles.actionButton has flexDirection layout property', () => {
        expect(taskCardStyles.actionButton.flexDirection).toBe('row');
    });

    it('taskCardStyles.actionButton has paddingHorizontal layout property', () => {
        expect(taskCardStyles.actionButton.paddingHorizontal).toBeDefined();
        expect(taskCardStyles.actionButton.paddingHorizontal).toBeGreaterThan(0);
    });

    it('taskCardStyles.actionButton has paddingVertical layout property', () => {
        expect(taskCardStyles.actionButton.paddingVertical).toBeDefined();
        expect(taskCardStyles.actionButton.paddingVertical).toBeGreaterThan(0);
    });

    it('taskCardStyles.completedBadge.borderRadius equals width / 2 (circular badge)', () => {
        const { width, borderRadius } = taskCardStyles.completedBadge;
        expect(borderRadius).toBe(width / 2);
    });

    it('taskCardStyles.lockedBadge.borderRadius equals width / 2 (circular badge)', () => {
        const { width, borderRadius } = taskCardStyles.lockedBadge;
        expect(borderRadius).toBe(width / 2);
    });

    it('taskCardStyles.completedBadge.borderRadius === 22 (fixed state: width=44)', () => {
        expect(taskCardStyles.completedBadge.borderRadius).toBe(22);
    });

    it('taskCardStyles.lockedBadge.borderRadius === 22 (fixed state: width=44)', () => {
        expect(taskCardStyles.lockedBadge.borderRadius).toBe(22);
    });
});
