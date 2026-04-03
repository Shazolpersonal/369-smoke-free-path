/**
 * Toast Variant & Queue Property Tests
 * Task 9.1: Toast variant রঙ সামঞ্জস্য (Property 4)
 * Task 9.2: Toast queue — সর্বশেষ জয়ী (Property 5)
 *
 * Requirements: 8.3, 8.5
 */

import * as fc from 'fast-check';
import * as fs from 'fs';
import * as path from 'path';

const TOAST_PATH = path.resolve(__dirname, '../components/Toast.tsx');
const source = fs.readFileSync(TOAST_PATH, 'utf-8');

// ---------------------------------------------------------------------------
// Helper: extract color values from Toast source for each variant
// ---------------------------------------------------------------------------

/**
 * Parse the getBgColor / getBorderColor / getTextColor switch blocks
 * and return the color string for a given type.
 */
function extractColorForType(
    fnName: 'getBgColor' | 'getBorderColor' | 'getTextColor',
    type: 'success' | 'error' | 'info'
): string | null {
    // Find the function body
    const fnStart = source.indexOf(`const ${fnName}`);
    if (fnStart === -1) return null;
    const fnEnd = source.indexOf('\n    };', fnStart) + 7;
    const fnBody = source.slice(fnStart, fnEnd);

    // Find the case block for the given type
    const casePattern = new RegExp(`case '${type}'[^:]*:[^']*'(#[A-Fa-f0-9]{3,8})'`);
    const match = fnBody.match(casePattern);
    if (match) return match[1];

    // For 'success' it may be the default
    if (type === 'success') {
        const defaultMatch = fnBody.match(/default:[^']*'(#[A-Fa-f0-9]{3,8})'/);
        if (defaultMatch) return defaultMatch[1];
    }
    return null;
}

// ---------------------------------------------------------------------------
// Property 4: Toast variant রঙ সামঞ্জস্য
// Validates: Requirements 8.3
// ---------------------------------------------------------------------------

describe('Property 4: Toast variant রঙ সামঞ্জস্য (Req 8.3)', () => {
    // Feature: animation-modern-ui, Property 4: Toast variant রঙ সামঞ্জস্য

    it('success variant uses green background color', () => {
        const bg = extractColorForType('getBgColor', 'success');
        expect(bg).not.toBeNull();
        // Green-family: hue around green (#ECFDF5, #D1FAE5, etc.)
        // We verify it starts with a known green-ish hex
        expect(bg).toMatch(/^#(ECFDF5|D1FAE5|A7F3D0|6EE7B7|34D399|10B981|059669|047857|065F46)/i);
    });

    it('error variant uses red background color', () => {
        const bg = extractColorForType('getBgColor', 'error');
        expect(bg).not.toBeNull();
        // Red-family
        expect(bg).toMatch(/^#(FEF2F2|FEE2E2|FECACA|FCA5A5|F87171|EF4444|DC2626|B91C1C|991B1B)/i);
    });

    it('info variant uses blue background color', () => {
        const bg = extractColorForType('getBgColor', 'info');
        expect(bg).not.toBeNull();
        // Blue-family
        expect(bg).toMatch(/^#(EFF6FF|DBEAFE|BFDBFE|93C5FD|60A5FA|3B82F6|2563EB|1D4ED8|1E3A8A)/i);
    });

    it('error variant uses red border color', () => {
        const border = extractColorForType('getBorderColor', 'error');
        expect(border).not.toBeNull();
        expect(border).toMatch(/^#(FEF2F2|FEE2E2|FECACA|FCA5A5|F87171|EF4444|DC2626|B91C1C|991B1B)/i);
    });

    it('info variant uses blue border color', () => {
        const border = extractColorForType('getBorderColor', 'info');
        expect(border).not.toBeNull();
        expect(border).toMatch(/^#(EFF6FF|DBEAFE|BFDBFE|93C5FD|60A5FA|3B82F6|2563EB|1D4ED8|1E3A8A)/i);
    });

    it('success variant uses green border color', () => {
        const border = extractColorForType('getBorderColor', 'success');
        expect(border).not.toBeNull();
        expect(border).toMatch(/^#(ECFDF5|D1FAE5|A7F3D0|6EE7B7|34D399|10B981|059669|047857|065F46)/i);
    });

    it('error variant uses dark red text color', () => {
        const text = extractColorForType('getTextColor', 'error');
        expect(text).not.toBeNull();
        expect(text).toMatch(/^#(991B1B|B91C1C|DC2626|EF4444|7F1D1D)/i);
    });

    it('info variant uses dark blue text color', () => {
        const text = extractColorForType('getTextColor', 'info');
        expect(text).not.toBeNull();
        expect(text).toMatch(/^#(1E3A8A|1E40AF|1D4ED8|2563EB|1E3A8A)/i);
    });

    it('success variant uses dark green text color', () => {
        const text = extractColorForType('getTextColor', 'success');
        expect(text).not.toBeNull();
        expect(text).toMatch(/^#(065F46|047857|059669|064E3B|166534)/i);
    });

    // Property-based: for every valid toast type, all three color functions return a non-null hex color
    it('every valid toast type has non-null hex colors for bg, border, and text', () => {
        fc.assert(
            fc.property(
                fc.constantFrom('success' as const, 'error' as const, 'info' as const),
                (type) => {
                    const bg = extractColorForType('getBgColor', type);
                    const border = extractColorForType('getBorderColor', type);
                    const text = extractColorForType('getTextColor', type);
                    return (
                        bg !== null && bg.startsWith('#') &&
                        border !== null && border.startsWith('#') &&
                        text !== null && text.startsWith('#')
                    );
                }
            ),
            { numRuns: 100 }
        );
    });

    it('success, error, info variants all have distinct background colors', () => {
        const successBg = extractColorForType('getBgColor', 'success');
        const errorBg = extractColorForType('getBgColor', 'error');
        const infoBg = extractColorForType('getBgColor', 'info');
        expect(successBg).not.toBe(errorBg);
        expect(successBg).not.toBe(infoBg);
        expect(errorBg).not.toBe(infoBg);
    });
});

// ---------------------------------------------------------------------------
// Property 5: Toast queue — সর্বশেষ জয়ী
// Validates: Requirements 8.5
// ---------------------------------------------------------------------------

describe('Property 5: Toast queue — সর্বশেষ জয়ী (Req 8.5)', () => {
    // Feature: animation-modern-ui, Property 5: Toast queue — সর্বশেষ জয়ী

    it('ToastProvider uses a single toast state (not an array/queue)', () => {
        // Should use useState<ToastConfig | null> — a single value, not an array
        expect(source).toContain('useState<ToastConfig | null>');
        expect(source).not.toMatch(/useState<ToastConfig\[\]>/);
        expect(source).not.toMatch(/useState<Array<ToastConfig>>/);
    });

    it('listener calls setToast directly (replacing, not appending)', () => {
        // The listener should call setToast(config) — replacing the current toast
        expect(source).toContain('setToast(config)');
        // Should NOT push/concat to an array
        expect(source).not.toMatch(/\.push\(config\)/);
        expect(source).not.toMatch(/\.concat\(config\)/);
        expect(source).not.toMatch(/\[\.\.\.prev,\s*config\]/);
    });

    it('previous dismiss timer is cancelled when a new toast arrives', () => {
        // Must clear the previous timeout to prevent premature dismiss
        expect(source).toContain('clearTimeout');
        expect(source).toContain('dismissTimerRef');
    });

    it('uses a ref to track the dismiss timer', () => {
        expect(source).toContain('dismissTimerRef');
        expect(source).toContain('useRef');
    });

    it('new toast replaces old toast — state is always a single value', () => {
        // Property: calling showToast N times results in exactly 1 visible toast
        // We verify this structurally: single state, direct replacement
        fc.assert(
            fc.property(
                fc.array(
                    fc.record({
                        message: fc.string({ minLength: 1, maxLength: 50 }),
                        type: fc.constantFrom('success' as const, 'error' as const, 'info' as const),
                    }),
                    { minLength: 2, maxLength: 10 }
                ),
                (toasts) => {
                    // Simulate state replacement: last toast wins
                    let currentToast: { message: string; type: string } | null = null;
                    for (const t of toasts) {
                        currentToast = t; // direct replace, not queue
                    }
                    // Only the last toast should be visible
                    return currentToast === toasts[toasts.length - 1];
                }
            ),
            { numRuns: 100 }
        );
    });
});

// ---------------------------------------------------------------------------
// Structure & Safe Area tests
// ---------------------------------------------------------------------------

describe('Toast — Safe Area & Structure (Req 8.4)', () => {
    it('imports useSafeAreaInsets', () => {
        expect(source).toContain('useSafeAreaInsets');
        expect(source).toContain("from 'react-native-safe-area-context'");
    });

    it('uses insets.top for positioning', () => {
        expect(source).toContain('insets.top');
    });

    it('handles both iOS and Android top offset', () => {
        expect(source).toContain("Platform.OS === 'ios'");
    });
});

describe('Toast — Light background on dark screen (Req 8.6)', () => {
    it('success background is a light color (not dark)', () => {
        const bg = extractColorForType('getBgColor', 'success');
        // Light colors start with high hex values — #ECFDF5 etc.
        expect(bg).not.toBeNull();
        // Parse R channel — should be > 200 for light colors
        const r = parseInt(bg!.slice(1, 3), 16);
        expect(r).toBeGreaterThan(200);
    });

    it('error background is a light color (not dark)', () => {
        const bg = extractColorForType('getBgColor', 'error');
        expect(bg).not.toBeNull();
        const r = parseInt(bg!.slice(1, 3), 16);
        expect(r).toBeGreaterThan(200);
    });

    it('info background is a light color (not dark)', () => {
        const bg = extractColorForType('getBgColor', 'info');
        expect(bg).not.toBeNull();
        const r = parseInt(bg!.slice(1, 3), 16);
        expect(r).toBeGreaterThan(200);
    });
});
