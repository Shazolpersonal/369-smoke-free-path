/**
 * Shared font family utility for 369 Smoke-Free Path
 * Centralizes font selection logic based on language.
 * Uses Inter (EN) + NotoSansBengali (BN) — language-aware dual font system.
 */

export type FontWeight = 'regular' | 'medium' | 'semibold' | 'bold';

const FONT_MAP: Record<string, Record<FontWeight, string>> = {
    en: {
        regular: 'Inter_400Regular',
        medium: 'Inter_500Medium',
        semibold: 'Inter_600SemiBold',
        bold: 'Inter_700Bold',
    },
    bn: {
        regular: 'NotoSansBengali_400Regular',
        medium: 'NotoSansBengali_500Medium',
        semibold: 'NotoSansBengali_600SemiBold',
        bold: 'NotoSansBengali_700Bold',
    },
};

/** Returns the correct font family based on language and weight */
export const getFontFamily = (arg1: string, arg2?: string): string => {
    let language = 'bn';
    let weight = arg1 as FontWeight;

    if (arg1 === 'en' || arg1 === 'bn') {
        language = arg1;
        weight = arg2 as FontWeight;
    } else if (arg2) {
        language = arg2;
    }

    return FONT_MAP[language]?.[weight] || FONT_MAP['en'][weight];
};
