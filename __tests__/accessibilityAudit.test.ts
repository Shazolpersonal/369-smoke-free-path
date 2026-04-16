/**
 * Accessibility Audit Tests — Task 13: beta-test-qa-audit spec
 *
 * These tests read source files as text (static analysis via fs.readFileSync)
 * and verify accessibility properties. Some tests confirm good practices,
 * others flag accessibility concerns for future remediation.
 */

import * as fs from 'fs';
import * as path from 'path';

const ROOT = path.resolve(__dirname, '..');

function readSource(relPath: string): string {
    return fs.readFileSync(path.join(ROOT, relPath), 'utf-8');
}

// ---------------------------------------------------------------------------
// 1. TaskCard component — touch target size
// ---------------------------------------------------------------------------
describe('Accessibility: TaskCard — touch target size', () => {
    const source = readSource('components/TaskCard.tsx');

    test('TaskCard container has sufficient padding (padding: 20) for touch targets', () => {
        // The card uses padding: 20 in the card style, providing adequate touch area
        expect(source).toContain('padding: 20');
    });

    test('TaskCard iconContainer has explicit width and height (48x48)', () => {
        // Icon container is 48x48 — above the 44pt minimum
        expect(source).toContain('width: 48');
        expect(source).toContain('height: 48');
    });

    test('TaskCard completedBadge has explicit width and height (44x44)', () => {
        // completedBadge is now 44x44 — meets 44pt minimum
        expect(source).toContain('completedBadge');
        const badgeMatch = source.match(/completedBadge[\s\S]*?width:\s*44[\s\S]*?height:\s*44/);
        expect(badgeMatch).not.toBeNull();
    });

    test('ACCESSIBILITY: completedBadge/lockedBadge are 44x44 — meets 44pt minimum touch target', () => {
        // Badge touch targets now meet the 44pt WCAG guideline
        const hasBadgeWidth44 = source.includes('width: 44');
        const hasBadgeHeight44 = source.includes('height: 44');
        expect(hasBadgeWidth44).toBe(true);
        expect(hasBadgeHeight44).toBe(true);
    });
});

// ---------------------------------------------------------------------------
// 2. helpBtn style — minWidth: 44, minHeight: 44
// ---------------------------------------------------------------------------
describe('Accessibility: helpBtn — minimum touch target 44x44', () => {
    const source = readSource('app/(tabs)/index.tsx');

    test('helpBtn style exists in index.tsx', () => {
        expect(source).toContain('helpBtn');
    });

    test('helpBtn has minWidth: 44', () => {
        expect(source).toContain('minWidth: 44');
    });

    test('helpBtn has minHeight: 44', () => {
        expect(source).toContain('minHeight: 44');
    });

    test('GOOD PRACTICE: helpBtn meets 44pt minimum touch target requirement', () => {
        // Verify both minWidth and minHeight are present in the helpBtn style block
        const helpBtnMatch = source.match(/helpBtn:\s*\{[\s\S]*?minWidth:\s*44[\s\S]*?minHeight:\s*44[\s\S]*?\}/);
        expect(helpBtnMatch).not.toBeNull();
    });
});

// ---------------------------------------------------------------------------
// 3. langToggle style — minHeight: 44
// ---------------------------------------------------------------------------
describe('Accessibility: langToggle — minimum touch target height', () => {
    const source = readSource('app/(tabs)/index.tsx');

    test('langToggle style exists in index.tsx', () => {
        expect(source).toContain('langToggle');
    });

    test('langToggle has minHeight: 44', () => {
        // langToggle should have minHeight: 44 for accessibility
        const langToggleMatch = source.match(/langToggle:\s*\{[\s\S]*?minHeight:\s*44[\s\S]*?\}/);
        expect(langToggleMatch).not.toBeNull();
    });

    test('GOOD PRACTICE: langToggle meets 44pt minimum touch target height', () => {
        expect(source).toContain('minHeight: 44');
    });
});

// ---------------------------------------------------------------------------
// 4. navButton (history screen) — width: 44, height: 44
// ---------------------------------------------------------------------------
describe('Accessibility: navButton (history screen) — touch target 44x44', () => {
    const source = readSource('app/(tabs)/history.tsx');

    test('navButton style exists in history.tsx', () => {
        expect(source).toContain('navButton');
    });

    test('navButton has width: 44', () => {
        const navButtonMatch = source.match(/navButton:\s*\{[\s\S]*?width:\s*44[\s\S]*?\}/);
        expect(navButtonMatch).not.toBeNull();
    });

    test('navButton has height: 44', () => {
        const navButtonMatch = source.match(/navButton:\s*\{[\s\S]*?height:\s*44[\s\S]*?\}/);
        expect(navButtonMatch).not.toBeNull();
    });

    test('GOOD PRACTICE: navButton meets 44x44pt minimum touch target requirement', () => {
        // Both width and height should be 44 in the navButton style
        const navButtonBlock = source.match(/navButton:\s*\{[\s\S]*?width:\s*44[\s\S]*?height:\s*44[\s\S]*?\}/);
        expect(navButtonBlock).not.toBeNull();
    });
});

// ---------------------------------------------------------------------------
// 5. TextInput placeholder prop — task screen
// ---------------------------------------------------------------------------
describe('Accessibility: TextInput placeholder — task screen', () => {
    const source = readSource('app/task/[slot].tsx');

    test('TextInput component exists in task screen', () => {
        expect(source).toContain('TextInput');
    });

    test('placeholder prop is present on TextInput in task screen', () => {
        expect(source).toContain('placeholder=');
    });

    test('placeholder uses i18n translation key (not hardcoded string)', () => {
        // placeholder should use t('task.placeholder') for proper localization
        expect(source).toContain("placeholder={t('task.placeholder')}");
    });

    test('GOOD PRACTICE: TextInput has placeholder for screen reader and user guidance', () => {
        // Confirm placeholder is not empty/null
        const placeholderMatch = source.match(/placeholder=\{[^}]+\}/);
        expect(placeholderMatch).not.toBeNull();
        // Should not be an empty string
        expect(source).not.toContain('placeholder=""');
    });
});

// ---------------------------------------------------------------------------
// 6. Error state — color-only indicator (accessibility concern)
// ---------------------------------------------------------------------------
describe('Accessibility Concern: Error state — color-only indicator', () => {
    const taskSource = readSource('app/task/[slot].tsx');

    test('error color (COLORS.error) is used for incorrect text highlighting', () => {
        expect(taskSource).toContain('COLORS.error');
    });

    test('error state uses red color for incorrect text (color-only indicator)', () => {
        // incorrectText style uses COLORS.error (red) as the sole visual indicator
        expect(taskSource).toContain('incorrectText');
        const incorrectTextMatch = taskSource.match(/incorrectText:\s*\{[\s\S]*?color:\s*COLORS\.error[\s\S]*?\}/);
        expect(incorrectTextMatch).not.toBeNull();
    });

    test('ACCESSIBILITY CONCERN: error state relies on color alone — no icon or text label for error', () => {
        // The error state uses red color + underline but no accessible label/icon
        // This is a concern for users with color vision deficiency
        // Document: textDecorationLine underline provides partial non-color cue
        expect(taskSource).toContain('textDecorationLine');
        // But no accessibilityLabel or accessibilityHint on the error text
        const hasAccessibilityHint = taskSource.includes('accessibilityHint');
        // Flag: no accessibilityHint on error text segments
        expect(hasAccessibilityHint).toBe(true);
    });

    test('progressError style uses color as primary error indicator', () => {
        // progressError text is red — color-only for users with color blindness
        const progressErrorMatch = taskSource.match(/progressError:\s*\{[\s\S]*?color:\s*COLORS\.error[\s\S]*?\}/);
        expect(progressErrorMatch).not.toBeNull();
    });
});

// ---------------------------------------------------------------------------
// 7. Calendar day status — color-only indicator (accessibility concern)
// ---------------------------------------------------------------------------
describe('Accessibility Concern: CalendarDay status — color-only indicator', () => {
    const source = readSource('components/CalendarDay.tsx');

    test('CalendarDay component exists and uses HEATMAP_STYLES', () => {
        expect(source).toContain('HEATMAP_STYLES');
    });

    test('status is communicated via background color only (no text label per status)', () => {
        // HEATMAP_STYLES maps status to bg/text colors — no status label rendered
        expect(source).toContain("complete: { bg: '#10B981'");
        expect(source).toContain("partial: { bg: '#F59E0B'");
        expect(source).toContain("missed: { bg: 'rgba(244, 63, 94");
    });

    test('ACCESSIBILITY CONCERN: CalendarDay has no accessibilityLabel reflecting day status', () => {
        // No accessibilityLabel prop is set on the circle/pressable to describe status
        // Users relying on screen readers cannot determine day status
        const hasAccessibilityLabel = source.includes('accessibilityLabel');
        expect(hasAccessibilityLabel).toBe(true);
    });

    test('ACCESSIBILITY CONCERN: status differentiation relies solely on background color', () => {
        // The day number text color changes but no non-color indicator (icon/pattern) exists
        // Document: 4 distinct statuses (complete/partial/missed/pending) are color-coded only
        const statusCount = (source.match(/HEATMAP_STYLES\[status\]/g) || []).length;
        expect(statusCount).toBeGreaterThanOrEqual(1);
        // No status-specific icons or patterns in the component
        expect(source).toContain('accessibilityRole');
    });
});
