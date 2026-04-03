import { TimeSlot } from '../types';
import { Language } from '../i18n';

interface NotificationContent {
    title: string;
    body: string;
}

const MORNING_NOTIFICATIONS = {
    en: [
        "A fresh smoke-free day begins! Set your intention to stay healthy.",
        "Breathe. Feel your clear lungs. Your morning affirmation awaits.",
        "Today is a new day to conquer your cravings. Start with faith.",
        "Step into the morning with gratitude and unbreakable willpower.",
        "Your health is a trust from Allah. Affirm your commitment this morning.",
        "A new day, a stronger you. Complete your morning writing.",
        "Start your day by remembering why you quit. The smoke-free path is yours.",
    ],
    bn: [
        "একটি নতুন ধোঁয়া-মুক্ত দিন শুরু! সুস্থ থাকার নিয়ত করুন।",
        "শ্বাস নিন। আপনার সুন্দর ফুসফুস অনুভব করুন। সকালের শপথ আপনার অপেক্ষায়।",
        "ধূমপানের আকাঙ্ক্ষাকে জয় করার এটি নতুন দিন। ঈমানের সাথে শুরু করুন।",
        "কৃতজ্ঞতা এবং অটুট ইচ্ছাশক্তি নিয়ে সকালে পা রাখুন।",
        "আপনার স্বাস্থ্য আল্লাহর আমানত। সকালে আপনার প্রতিশ্রুতি নবায়ন করুন।",
        "নতুন দিনে, আপনি আরো শক্তিশালী। আপনার সকালের লেখা সম্পূর্ণ করুন।",
        "আপনি কেন ধূমপান ছেড়েছেন তা স্মরণ করে দিন শুরু করুন।"
    ]
};

const NOON_NOTIFICATIONS = {
    en: [
        "Stay strong! Write your afternoon affirmation to anchor your resolve.",
        "Mid-day check: Are you feeling tempted? Silence it with your writing.",
        "Take a moment to pause. Your afternoon writing helps beat the cravings.",
        "Half the day is done! Keep your smoke-free streak unbroken.",
        "Your family is proud of you. Honor their love by staying strong.",
        "Don't let the mid-day stress get to you. Renew your intention now.",
        "Every hour without smoking is a victory. Claim your afternoon win.",
    ],
    bn: [
        "শক্ত থাকুন! আপনার সংকল্পকে মজবুত করতে দুপুরের শপথটি লিখুন।",
        "মধ্যাহ্নের যাচাই: ধূমপানের ইচ্ছা জাগছে? লেখার মাধ্যমে তা শান্ত করুন।",
        "একটু থামুন। আপনার দুপুরের লেখাটি আকাঙ্ক্ষা দূর করতে সাহায্য করবে।",
        "অর্ধেক দিন শেষ! আপনার ধোঁয়া-মুক্ত ধারাটি অটুট রাখুন।",
        "আপনার পরিবার আপনার জন্য গর্বিত। দৃঢ় থেকে তাঁদের ভালোবাসার সম্মান দিন।",
        "দুপুরের মানসিক চাপকে আপনাকে হারাতে দেবেন না। এখনই আপনার নিয়্যত নবায়ন করুন।",
        "ধূমপান ছাড়া প্রতিটি ঘণ্টা একটি বিজয়। আপনার দুপুরের বিজয় নিশ্চিত করুন।"
    ]
};

const NIGHT_NOTIFICATIONS = {
    en: [
        "The day is ending. End it smoke-free and write your evening gratitude.",
        "You survived today without smoking! Alhamdulillah, write your last affirmation.",
        "Rest your body and thank Allah for giving you the strength today.",
        "Before you sleep, reflect on the healing happening inside your body.",
        "Another smoke-free day in the books. Secure your streak before bed.",
        "Say Alhamdulillah. Your lungs are thanking you tonight.",
        "End your successful day correctly. Your evening affirmation is ready."
    ],
    bn: [
        "দিন শেষ হচ্ছে। ধোঁয়া-মুক্ত অবস্থায় দিনটি শেষ করুন এবং রাতের শুকরিয়া লিখুন।",
        "ধূমপান ছাড়াই আপনি আজ টিকে আছেন! আলহামদুলিল্লাহ, আপনার শেষ শপথ লিখুন।",
        "বিশ্রাম নিন এবং আজ শক্তি দেওয়ার জন্য আল্লাহর শুকরিয়া আদায় করুন।",
        "ঘুমানোর আগে ভাবুন, আপনার শরীরের ভেতর কতটা সুস্থতা ফিরে আসছে।",
        "আরেকটি ধোঁয়া-মুক্ত দিন সম্পন্ন। ঘুমানোর আগে আপনার স্ট্রিকটি নিশ্চিত করুন।",
        "আলহামদুলিল্লাহ বলুন। আজ রাতে আপনার ফুসফুস আপনাকে ধন্যবাদ জানাচ্ছে।",
        "আপনার সফল দিনটি পুর্ণাঙ্গভাবে শেষ করুন। রাতের শপথ প্রস্তুত।"
    ]
};

export const getDynamicNotificationMessage = (slot: TimeSlot, language: Language, targetDate: Date = new Date()): NotificationContent => {
    const dayOfYear = Math.floor(
        (targetDate.getTime() - new Date(targetDate.getFullYear(), 0, 0).getTime()) / 1000 / 60 / 60 / 24
    );

    let textsEn: string[];
    let textsBn: string[];
    let titleBaseEn: string;
    let titleBaseBn: string;

    switch (slot) {
        case 'morning':
            textsEn = MORNING_NOTIFICATIONS.en;
            textsBn = MORNING_NOTIFICATIONS.bn;
            titleBaseEn = "🌅 Morning Affirmation";
            titleBaseBn = "🌅 সকালের শপথ";
            break;
        case 'noon':
            textsEn = NOON_NOTIFICATIONS.en;
            textsBn = NOON_NOTIFICATIONS.bn;
            titleBaseEn = "☀️ Afternoon Affirmation";
            titleBaseBn = "☀️ দুপুরের শপথ";
            break;
        case 'night':
            textsEn = NIGHT_NOTIFICATIONS.en;
            textsBn = NIGHT_NOTIFICATIONS.bn;
            titleBaseEn = "🌙 Evening Affirmation";
            titleBaseBn = "🌙 রাতের শপথ";
            break;
    }

    const index = dayOfYear % textsEn.length;

    return {
        title: language === 'bn' ? titleBaseBn : titleBaseEn,
        body: language === 'bn' ? textsBn[index] : textsEn[index],
    };
};

export const getGentleNudgeMessage = (slot: TimeSlot, language: Language): NotificationContent => {
    if (language === 'bn') {
        return {
            title: `⏳ আপনার ${slot === 'morning' ? 'সকালের' : slot === 'noon' ? 'দুপুরের' : 'রাতের'} শপথ সম্পন্ন করুন`,
            body: "সময় প্রায় শেষ! এখনই লিখে আপনার ধোঁয়া-মুক্ত যাত্রাটি ধরে রাখুন।"
        };
    }

    return {
        title: `⏳ Don't Miss Your ${slot === 'morning' ? 'Morning' : slot === 'noon' ? 'Afternoon' : 'Evening'} Affirmation`,
        body: "Time is almost up! Write your affirmation now to stay on the smoke-free path."
    };
};
