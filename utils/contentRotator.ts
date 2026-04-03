import { TimeSlot } from '../types';
import { Language } from '../i18n';
import { getDynamicNotificationMessage } from './notificationContent';

export interface NotificationContent {
    title: string;
    body: string;
}

export function getNotificationContent(slot: TimeSlot, language: Language, targetDate?: Date): NotificationContent {
    return getDynamicNotificationMessage(slot, language, targetDate);
}

export function validateContent(content: NotificationContent): boolean {
    return (
        typeof content.title === 'string' && content.title.length > 0 &&
        typeof content.body === 'string' && content.body.length > 0
    );
}
