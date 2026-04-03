import { affirmations } from '../data/affirmations';
import { affirmations as affirmationsBn } from '../data/affirmations_bn';
import { TimeSlot } from '../types';
import { Language } from '../i18n';

/**
 * Content Cycler for 369 Smoke-Free Path
 * 
 * IMPORTANT: Always pass `totalElapsedDays` from ProgressContext, NOT `trueStreak`.
 * - `totalElapsedDays`: Days since journey started (ensures content progression continues even if streak breaks)
 * - `trueStreak`: Consecutive complete days (would reset content on streak break - NOT desired)
 */

/**
 * Calculates the content index for a given day.
 * The affirmations array is 0-indexed (0-40), but day starts at 1.
 * After day 41, the content cycles back to day 1.
 */
export const getContentIndex = (day: number): number => {
    if (day <= 0) return 0;
    return (day - 1) % 41;
};

// Fallback affirmations for edge cases
const FALLBACK_AFFIRMATIONS: Record<Language, Record<TimeSlot, string>> = {
    en: {
        morning: "I choose health over smoke. Every breath is a step toward freedom.",
        noon: "My body is a trust, and I will protect it from harm today.",
        night: "Alhamdulillah for the strength to stay smoke-free today.",
    },
    bn: {
        morning: "আমি ধোঁয়ার চেয়ে স্বাস্থ্যকে বেছে নিই। প্রতিটি শ্বাস মুক্তির দিকে একটি পদক্ষেপ।",
        noon: "আমার শরীর একটি আমানত, এবং আজ আমি এটিকে ক্ষতি থেকে রক্ষা করব।",
        night: "আলহামদুলিল্লাহ, আজ ধোঁয়ামুক্ত থাকার শক্তির জন্য।",
    },
};

/**
 * Retrieves the affirmation text for a given day, time slot, and language.
 */
export const getAffirmationByLanguage = (day: number, slot: TimeSlot, language: Language): string => {
    if (day <= 0) return FALLBACK_AFFIRMATIONS[language][slot];

    const contentIndex = getContentIndex(day);
    const source = language === 'bn' ? affirmationsBn : affirmations;
    const dayContent = source[contentIndex];

    if (!dayContent) return FALLBACK_AFFIRMATIONS[language][slot];

    // Some of the BN affirmations mistakenly used "noon" or "afternoon", so checking fallback safely.
    return dayContent[slot] || FALLBACK_AFFIRMATIONS[language][slot];
};
