import AsyncStorage from '@react-native-async-storage/async-storage';

// ======================================================================
// Donation System — Halal, Ad-Free Revenue Model
// ======================================================================
// This app is completely ad-free. Revenue comes from voluntary Sadaqah
// (donations) from users who benefit from it. The system is gentle,
// respectful, and never intrusive.
// ======================================================================

/**
 * Configure your payment methods here.
 * Each entry will appear as a button in the DonationBottomSheet.
 */
export const PAYMENT_METHODS = [
    {
        id: 'bkash',
        label: 'bKash',
        labelBn: 'বিকাশ',
        number: '01977-752579',
        type: 'Personal',
        typeBn: 'পার্সোনাল',
        emoji: '💜',
    },
    {
        id: 'nagad',
        label: 'Nagad',
        labelBn: 'নগদ',
        number: '01977-752579',
        type: 'Personal',
        typeBn: 'পার্সোনাল',
        emoji: '🧡',
    },
];

/**
 * Rotating messages shown on the home screen DonationBanner.
 * A different message appears each day (based on totalElapsedDays % length).
 */
export const DONATION_BANNER_MESSAGES_EN = [
    'This app is free and ad-free. If it helps your soul, consider supporting its growth. 💚',
    'No ads. No tracking. Just you and Allah. A small Sadaqah keeps this alive. 🤲',
    'Built with love and intention. Your support helps this reach more hearts. 🌙',
    'Every Sadaqah, no matter how small, is an investment in your Akhirah. 💫',
    'This app exists by the grace of Allah and the generosity of people like you. 🕌',
];

export const DONATION_BANNER_MESSAGES_BN = [
    'এই অ্যাপটি সম্পূর্ণ ফ্রি এবং বিজ্ঞাপনমুক্ত। আপনার আত্মার উপকার হলে, এটিকে টিকিয়ে রাখতে সাহায্য করুন। 💚',
    'কোনো বিজ্ঞাপন নেই। কোনো ট্র্যাকিং নেই। শুধু আপনি আর আল্লাহ। একটি ছোট সাদাকাহ এটি বাঁচিয়ে রাখবে। 🤲',
    'ভালোবাসা ও নিয়তের সাথে তৈরি। আপনার সহযোগিতা এটিকে আরও মানুষের কাছে পৌঁছে দিতে পারে। 🌙',
    'প্রতিটি সাদাকাহ, যত ছোটই হোক, আপনার আখিরাতে বিনিয়োগ। 💫',
    'এই অ্যাপটি আল্লাহর রহমতে এবং আপনার মতো মানুষের উদারতায় টিকে আছে। 🕌',
];

// ─── Frequency Control ───────────────────────────────────────────────
const DONATION_PROMPT_KEY = '@niyyah_369_donation_prompt';

interface DonationPromptTracker {
    date: string; // YYYY-MM-DD
    shown: boolean;
}

function getTodayKey(): string {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

/**
 * Check if the donation prompt should be shown after task completion.
 * Returns true at most ONCE per day.
 */
export async function shouldShowDonationPrompt(): Promise<boolean> {
    try {
        const raw = await AsyncStorage.getItem(DONATION_PROMPT_KEY);
        if (raw) {
            const parsed: DonationPromptTracker = JSON.parse(raw);
            if (parsed.date === getTodayKey() && parsed.shown) {
                return false; // Already shown today
            }
        }
        return true;
    } catch {
        return true;
    }
}

/**
 * Mark the donation prompt as shown for today.
 */
export async function markDonationPromptShown(): Promise<void> {
    const tracker: DonationPromptTracker = {
        date: getTodayKey(),
        shown: true,
    };
    await AsyncStorage.setItem(DONATION_PROMPT_KEY, JSON.stringify(tracker));
}

/**
 * Get a rotating banner message based on the day number.
 */
export function getDonationBannerMessage(dayIndex: number, language: 'en' | 'bn'): string {
    const messages = language === 'bn' ? DONATION_BANNER_MESSAGES_BN : DONATION_BANNER_MESSAGES_EN;
    return messages[dayIndex % messages.length];
}
