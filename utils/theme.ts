import { Platform } from 'react-native';

/**
 * 369 Smoke-Free Path Core Theme System
 * Contains constants, gradients, and semantic colors.
 * Mirrors Niyyah's design tokens with smoke-free context.
 */

export const COLORS = {
    // Primary
    primary: '#064E3B', // Deep Emerald
    primaryLight: '#059669',

    // Accents
    gold: '#C4A35A',     // Crescent Gold
    goldLight: '#D4A847',

    // Semantic
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',

    // Theme Accents
    dawn: '#FBC4AB',
    midnight: '#1E1B4B',
    mosqueTeal: '#0D9488',

    // Neutrals
    stone50: '#FAFAF9',
    stone100: '#F5F5F4',
    stone800: '#292524',

    // Dark backgrounds
    darkBg: '#0F172A',
    darkCard: '#0F172A',
    darkInput: '#1E293B',
    darkBorder: '#334155',

    // Surface tokens
    surface: '#0F172A',
    surfaceElevated: '#1E293B',
    border: 'rgba(255,255,255,0.1)',
    borderSubtle: 'rgba(255,255,255,0.06)',

    // Text colors
    textWhite: '#FFFFFF',
    textFadedWhite: 'rgba(255,255,255,0.35)',
    textMuted: 'rgba(255,255,255,0.6)',

    // Specific
    overlay: 'rgba(0,0,0,0.5)',
    glass: 'rgba(255,255,255,0.85)',
    confettiColors: ['#10B981', '#F59E0B', '#3B82F6', '#EF4444', '#D4A847', '#0D9488'],
};

/**
 * Gradients for specific times of day
 * Array format for Expo LinearGradient
 */
export const GRADIENTS = {
    morning: ['#FFF7ED', '#FBBF24', '#F59E0B'] as const,
    noon: ['#ECFDF5', '#10B981', '#059669'] as const,
    night: ['#1E1B4B', '#312E81', '#4338CA'] as const,

    // App-wide accents
    gold: ['#D4A847', '#C4A35A'] as const,
    emerald: ['#059669', '#064E3B'] as const,

    // Background gradients
    dashboardBg: ['#064E3B', '#0F766E', '#134E4A', '#1E293B', '#0F172A'] as [string, string, ...string[]],
    taskScreenBg: ['#064E3B', '#134E4A', '#1E293B', '#0F172A'] as [string, string, ...string[]],

    // New accent gradients
    cardGlow: ['rgba(5, 150, 105, 0.0)', 'rgba(5, 150, 105, 0.15)'] as const,
    goldShimmer: ['#C4A35A', '#D4A847', '#F5D98C', '#D4A847', '#C4A35A'] as const,
};

export const SLOT_ACCENT_COLORS = {
    morning: { start: '#FBBF24', end: '#F59E0B' },
    noon:    { start: '#10B981', end: '#059669' },
    night:   { start: '#6366F1', end: '#4338CA' },
};

export const SLOT_EMOJIS = {
    morning: '🌅',
    noon: '☀️',
    night: '🌙',
};

/**
 * Cross-platform Shadow Presets
 */
export const SHADOWS = {
    sm: Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3 },
        android: { elevation: 2 },
        web: { boxShadow: '0 1px 3px rgba(0,0,0,0.05)' },
    }),
    md: Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 6 },
        android: { elevation: 4 },
        web: { boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' },
    }),
    glow: Platform.select({
        ios: { shadowColor: COLORS.goldLight, shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.3, shadowRadius: 8 },
        android: { elevation: 8, shadowColor: COLORS.goldLight },
        web: { boxShadow: '0 0 15px rgba(212, 168, 71, 0.3)' },
    }),
};

export default COLORS;

/**
 * Typography scale
 * lineHeight: bn = fontSize × 1.8, en = fontSize × 1.5
 * letterSpacing: heading = 0.5, body = 0, caption = 0.8
 */
export const TYPOGRAPHY = {
    heading1: {
        fontSize: 32,
        lineHeight: { bn: 32 * 1.8, en: 32 * 1.5 },
        letterSpacing: 0.5,
    },
    heading2: {
        fontSize: 24,
        lineHeight: { bn: 24 * 1.8, en: 24 * 1.5 },
        letterSpacing: 0.5,
    },
    heading3: {
        fontSize: 20,
        lineHeight: { bn: 20 * 1.8, en: 20 * 1.5 },
        letterSpacing: 0.5,
    },
    body: {
        fontSize: 16,
        lineHeight: { bn: 16 * 1.8, en: 16 * 1.5 },
        letterSpacing: 0,
    },
    bodySmall: {
        fontSize: 14,
        lineHeight: { bn: 14 * 1.8, en: 14 * 1.5 },
        letterSpacing: 0,
    },
    caption: {
        fontSize: 12,
        lineHeight: { bn: 12 * 1.8, en: 12 * 1.5 },
        letterSpacing: 0.8,
    },
};

/**
 * Spacing scale (px)
 */
export const SPACING = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

/**
 * Border radius scale (px)
 */
export const BORDER_RADIUS = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 20,
    xxl: 24,
    full: 999,
};
