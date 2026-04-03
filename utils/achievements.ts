import { DailyProgress } from '../types';

export interface Badge {
    id: string;
    icon: string;
    titleKey: string;
    descriptionKey: string;
    isUnlocked: boolean;
    progress: number;
    target: number;
}

export function getAchievements(
    dailyProgress: Record<string, DailyProgress>,
    trueStreak: number,
    totalElapsedDays: number
): Badge[] {
    const hasAnyProgress = Object.keys(dailyProgress).length > 0;
    const morningsCompleted = Object.values(dailyProgress).filter(p => p.morning).length;
    const nightsCompleted = Object.values(dailyProgress).filter(p => p.night).length;

    return [
        {
            id: 'first_step',
            icon: '🌱',
            titleKey: 'badge.first_step.name',
            descriptionKey: 'badge.first_step.desc',
            isUnlocked: hasAnyProgress,
            progress: hasAnyProgress ? 1 : 0,
            target: 1,
        },
        {
            id: 'three_days',
            icon: '🌱',
            titleKey: 'badge.three_days.name',
            descriptionKey: 'badge.three_days.desc',
            isUnlocked: trueStreak >= 3,
            progress: Math.min(trueStreak, 3),
            target: 3,
        },
        {
            id: 'seven_days',
            icon: '🌟',
            titleKey: 'badge.seven_days.name',
            descriptionKey: 'badge.seven_days.desc',
            isUnlocked: trueStreak >= 7,
            progress: Math.min(trueStreak, 7),
            target: 7,
        },
        {
            id: 'twenty_one_days',
            icon: '🧠',
            titleKey: 'badge.twenty_one_days.name',
            descriptionKey: 'badge.twenty_one_days.desc',
            isUnlocked: trueStreak >= 21,
            progress: Math.min(trueStreak, 21),
            target: 21,
        },
        {
            id: 'forty_one_days',
            icon: '👑',
            titleKey: 'badge.forty_one_days.name',
            descriptionKey: 'badge.forty_one_days.desc',
            isUnlocked: trueStreak >= 41 || totalElapsedDays >= 41,
            progress: Math.min(Math.max(trueStreak, totalElapsedDays), 41),
            target: 41,
        },
        {
            id: 'morning_person',
            icon: '🌅',
            titleKey: 'badge.morning_person.name',
            descriptionKey: 'badge.morning_person.desc',
            isUnlocked: morningsCompleted >= 10,
            progress: Math.min(morningsCompleted, 10),
            target: 10,
        },
        {
            id: 'night_owl',
            icon: '🦉',
            titleKey: 'badge.night_owl.name',
            descriptionKey: 'badge.night_owl.desc',
            isUnlocked: nightsCompleted >= 10,
            progress: Math.min(nightsCompleted, 10),
            target: 10,
        },
    ];
}
