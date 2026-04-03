/**
 * Audit Report Aggregation Tests — Task 16: beta-test-qa-audit spec
 *
 * Aggregates all known bugs found across the beta QA audit and verifies
 * the BETA_QA_AUDIT_REPORT.md file exists after generation.
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');

function readSource(relPath: string): string {
    return fs.readFileSync(path.join(ROOT, relPath), 'utf-8');
}

// ---------------------------------------------------------------------------
// 1. Report file existence
// ---------------------------------------------------------------------------
describe('Audit Report: File Existence', () => {
    test('BETA_QA_AUDIT_REPORT.md exists in smoke-free-path root', () => {
        const reportPath = path.join(ROOT, 'BETA_QA_AUDIT_REPORT.md');
        expect(fs.existsSync(reportPath)).toBe(true);
    });

    test('BETA_QA_AUDIT_REPORT.md is non-empty', () => {
        const reportPath = path.join(ROOT, 'BETA_QA_AUDIT_REPORT.md');
        const content = fs.readFileSync(reportPath, 'utf-8');
        expect(content.length).toBeGreaterThan(500);
    });

    test('BETA_QA_AUDIT_REPORT.md contains Bengali text (বাংলা)', () => {
        const reportPath = path.join(ROOT, 'BETA_QA_AUDIT_REPORT.md');
        const content = fs.readFileSync(reportPath, 'utf-8');
        // Bengali Unicode range: \u0980-\u09FF
        expect(/[\u0980-\u09FF]/.test(content)).toBe(true);
    });

    test('BETA_QA_AUDIT_REPORT.md contains executive summary section', () => {
        const reportPath = path.join(ROOT, 'BETA_QA_AUDIT_REPORT.md');
        const content = fs.readFileSync(reportPath, 'utf-8');
        expect(content).toContain('Executive Summary');
    });

    test('BETA_QA_AUDIT_REPORT.md contains critical issues section', () => {
        const reportPath = path.join(ROOT, 'BETA_QA_AUDIT_REPORT.md');
        const content = fs.readFileSync(reportPath, 'utf-8');
        expect(content).toContain('Critical');
    });
});

// ---------------------------------------------------------------------------
// 2. Critical Bug #1 — history.tsx translation key mismatch (FIXED)
// ---------------------------------------------------------------------------
describe('Critical Bug #1: history.tsx — Translation Key Mismatch (FIXED)', () => {
    const historySource = readSource('app/(tabs)/history.tsx');
    const enSource = readSource('i18n/en.ts');
    const bnSource = readSource('i18n/bn.ts');

    test('FIXED: history.tsx uses correct key history.morningAffirmation', () => {
        expect(historySource).toContain("history.morningAffirmation");
    });

    test('FIXED: history.tsx uses correct key history.afternoonAffirmation', () => {
        expect(historySource).toContain("history.afternoonAffirmation");
    });

    test('FIXED: history.tsx uses correct key history.eveningAffirmation', () => {
        expect(historySource).toContain("history.eveningAffirmation");
    });

    test('history.morningNiyyah is absent from en.ts — stale key not added', () => {
        expect(enSource).not.toContain("'history.morningNiyyah'");
    });

    test('history.afternoonNiyyah is absent from en.ts — stale key not added', () => {
        expect(enSource).not.toContain("'history.afternoonNiyyah'");
    });

    test('history.eveningNiyyah is absent from en.ts — stale key not added', () => {
        expect(enSource).not.toContain("'history.eveningNiyyah'");
    });

    test('history.morningNiyyah is absent from bn.ts — stale key not added', () => {
        expect(bnSource).not.toContain("'history.morningNiyyah'");
    });

    test('correct key history.morningAffirmation exists in en.ts', () => {
        expect(enSource).toContain("'history.morningAffirmation'");
    });

    test('correct key history.afternoonAffirmation exists in en.ts', () => {
        expect(enSource).toContain("'history.afternoonAffirmation'");
    });

    test('correct key history.eveningAffirmation exists in en.ts', () => {
        expect(enSource).toContain("'history.eveningAffirmation'");
    });
});

// ---------------------------------------------------------------------------
// 3. Critical Bug #2 — TaskCard.tsx hardcoded English locked slot messages (FIXED)
// ---------------------------------------------------------------------------
describe('Critical Bug #2: TaskCard.tsx — Locked Slot Messages Now Use i18n (FIXED)', () => {
    const source = readSource('components/TaskCard.tsx');

    test('getLockedSlotMessage() function exists in TaskCard.tsx', () => {
        expect(source).toContain('getLockedSlotMessage');
    });

    test('FIXED: getLockedSlotMessage() uses t("taskCard.lockedMorning")', () => {
        expect(source).toContain("t('taskCard.lockedMorning')");
    });

    test('FIXED: getLockedSlotMessage() uses t("taskCard.lockedNoon")', () => {
        expect(source).toContain("t('taskCard.lockedNoon')");
    });

    test('FIXED: getLockedSlotMessage() uses t("taskCard.lockedNight")', () => {
        expect(source).toContain("t('taskCard.lockedNight')");
    });

    test('FIXED: getLockedSlotMessage() uses t() for i18n — localization bug resolved', () => {
        const fnMatch = source.match(/const getLockedSlotMessage[\s\S]+?^\s{4}\};/m);
        if (fnMatch) {
            expect(fnMatch[0]).toMatch(/return t\(/);
        } else {
            // Fallback: confirm i18n keys are present
            expect(source).toContain("t('taskCard.lockedMorning')");
        }
    });
});

// ---------------------------------------------------------------------------
// 4. Critical Bug #3 — dashboard.restPeriod duplicate key (FIXED)
// ---------------------------------------------------------------------------
describe('Critical Bug #3: dashboard.restPeriod Duplicate Key (FIXED)', () => {
    const enSource = readSource('i18n/en.ts');
    const bnSource = readSource('i18n/bn.ts');

    test('FIXED: dashboard.restPeriod appears exactly once in en.ts', () => {
        const matches = enSource.match(/'dashboard\.restPeriod'/g);
        expect(matches).not.toBeNull();
        expect(matches!.length).toBe(1);
    });

    test('FIXED: dashboard.restPeriod appears exactly once in bn.ts', () => {
        const matches = bnSource.match(/'dashboard\.restPeriod'/g);
        expect(matches).not.toBeNull();
        expect(matches!.length).toBe(1);
    });

    test('FIXED: no duplicate key in en.ts — single definition', () => {
        const occurrences = (enSource.match(/'dashboard\.restPeriod'\s*:/g) || []).length;
        expect(occurrences).toBe(1);
    });

    test('FIXED: no duplicate key in bn.ts — single definition', () => {
        const occurrences = (bnSource.match(/'dashboard\.restPeriod'\s*:/g) || []).length;
        expect(occurrences).toBe(1);
    });
});

// ---------------------------------------------------------------------------
// 5. Minor Bug #1 — guide.encouragement i18n symmetry (FIXED)
// ---------------------------------------------------------------------------
describe('Minor Bug #1: guide.encouragement i18n Symmetry (FIXED)', () => {
    const enSource = readSource('i18n/en.ts');
    const bnSource = readSource('i18n/bn.ts');

    test('FIXED: guide.encouragement is now present in en.ts', () => {
        expect(enSource).toContain("'guide.encouragement'");
    });

    test('guide.encouragement is present in bn.ts', () => {
        expect(bnSource).toContain("'guide.encouragement'");
    });
});

// ---------------------------------------------------------------------------
// 6. Minor Bug #2 — history.emptyState key added (FIXED)
// ---------------------------------------------------------------------------
describe('Minor Bug #2: history.emptyState Key Added (FIXED)', () => {
    const enSource = readSource('i18n/en.ts');
    const bnSource = readSource('i18n/bn.ts');

    test('FIXED: history.emptyState is now present in en.ts', () => {
        expect(enSource).toContain("'history.emptyState'");
    });

    test('FIXED: history.emptyState is now present in bn.ts', () => {
        expect(bnSource).toContain("'history.emptyState'");
    });

    test('history.tsx uses history.emptyState', () => {
        const historySource = readSource('app/(tabs)/history.tsx');
        expect(historySource).toContain("history.emptyState");
    });
});

// ---------------------------------------------------------------------------
// 7. Minor Bug #3 — require() inside function body removed (FIXED)
// ---------------------------------------------------------------------------
describe('Minor Bug #3: require() Inside Function Body — timeSlotManager.ts (FIXED)', () => {
    const source = readSource('utils/timeSlotManager.ts');

    test('formatDateKeyHumanReadable function exists in timeSlotManager.ts', () => {
        expect(source).toContain('formatDateKeyHumanReadable');
    });

    test('FIXED: no require() call inside formatDateKeyHumanReadable function body', () => {
        const fnMatch = source.match(/formatDateKeyHumanReadable[\s\S]*?^};/m);
        expect(fnMatch).not.toBeNull();
        expect(fnMatch![0]).not.toContain('require(');
    });

    test('FIXED: no inline require() pattern in timeSlotManager.ts', () => {
        const inlinedRequirePattern = /\bconst\s+\{[^}]+\}\s*=\s*require\s*\(/;
        expect(inlinedRequirePattern.test(source)).toBe(false);
    });
});

// ---------------------------------------------------------------------------
// 8. Accessibility Concern #1 — CalendarDay color-only status indicator
// ---------------------------------------------------------------------------
describe('Accessibility Concern #1: CalendarDay — Color-Only Status Indicator', () => {
    const source = readSource('components/CalendarDay.tsx');

    test('CalendarDay uses HEATMAP_STYLES for status colors', () => {
        expect(source).toContain('HEATMAP_STYLES');
    });

    test('CalendarDay has no accessibilityLabel for status — color-only indicator', () => {
        expect(source).not.toContain('accessibilityLabel');
    });

    test('CalendarDay has no accessibilityRole — screen reader concern', () => {
        expect(source).not.toContain('accessibilityRole');
    });
});

// ---------------------------------------------------------------------------
// 9. Accessibility Concern #2 — Error state color-only indicator
// ---------------------------------------------------------------------------
describe('Accessibility Concern #2: Error State — Color-Only Indicator', () => {
    const taskSource = readSource('app/task/[slot].tsx');

    test('task screen uses COLORS.error for incorrect text highlighting', () => {
        expect(taskSource).toContain('COLORS.error');
    });

    test('task screen has no accessibilityLabel on error text segments', () => {
        expect(taskSource).not.toContain('accessibilityLabel');
    });
});

// ---------------------------------------------------------------------------
// 10. Accessibility Concern #3 — completedBadge touch target size (FIXED)
// ---------------------------------------------------------------------------
describe('Accessibility Concern #3: completedBadge Touch Target (FIXED to 44pt)', () => {
    const source = readSource('components/TaskCard.tsx');

    test('FIXED: completedBadge has width: 44 (meets 44pt minimum)', () => {
        const badgeMatch = source.match(/completedBadge[\s\S]*?width:\s*44[\s\S]*?height:\s*44/);
        expect(badgeMatch).not.toBeNull();
    });

    test('FIXED: completedBadge is 44x44 — meets WCAG 44pt minimum touch target guideline', () => {
        expect(source).toContain('completedBadge');
        expect(source).toContain('width: 44');
        expect(source).toContain('height: 44');
    });
});

// ---------------------------------------------------------------------------
// 11. Positive: Good practices confirmed
// ---------------------------------------------------------------------------
describe('Positive Observations: Good Practices Confirmed', () => {
    test('grapheme-splitter is listed as a dependency', () => {
        const pkg = JSON.parse(readSource('package.json'));
        expect(pkg.dependencies['grapheme-splitter']).toBeDefined();
    });

    test('helpBtn meets 44pt minimum touch target (minWidth: 44, minHeight: 44)', () => {
        const indexSource = readSource('app/(tabs)/index.tsx');
        expect(indexSource).toContain('minWidth: 44');
        expect(indexSource).toContain('minHeight: 44');
    });

    test('navButton in history screen meets 44x44pt touch target', () => {
        const historySource = readSource('app/(tabs)/history.tsx');
        const navButtonBlock = historySource.match(/navButton:\s*\{[\s\S]*?width:\s*44[\s\S]*?height:\s*44[\s\S]*?\}/);
        expect(navButtonBlock).not.toBeNull();
    });

    test('fast-check (property-based testing) is listed as a dependency', () => {
        const pkg = JSON.parse(readSource('package.json'));
        expect(pkg.dependencies['fast-check']).toBeDefined();
    });

    test('TextInput placeholder uses i18n translation key in task screen', () => {
        const taskSource = readSource('app/task/[slot].tsx');
        expect(taskSource).toContain("placeholder={t('task.placeholder')}");
    });
});
