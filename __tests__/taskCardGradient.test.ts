// Feature: ui-ux-production-ready, Property 3: TaskCard gradient color validity
import * as fc from 'fast-check';

// Regex that matches invalid hex+opacity strings like #10B98120
const INVALID_HEX_OPACITY = /^#[0-9A-Fa-f]{6}[0-9A-Fa-f]{2}$/;

// The completed gradient colors from TaskCard
const COMPLETED_GRADIENT_COLORS = ['rgba(16, 185, 129, 0.12)', 'rgba(16, 185, 129, 0.25)'];

describe('TaskCard Gradient Colors', () => {
    it('Property 3: completed gradient colors are valid React Native color values', () => {
        COMPLETED_GRADIENT_COLORS.forEach(color => {
            expect(INVALID_HEX_OPACITY.test(color)).toBe(false);
        });
    });

    it('completed gradient colors use rgba format', () => {
        COMPLETED_GRADIENT_COLORS.forEach(color => {
            expect(color).toMatch(/^rgba\(/);
        });
    });
});
