jest.mock("@react-native-async-storage/async-storage", () => require("@react-native-async-storage/async-storage/jest/async-storage-mock"));
// Feature: ui-ux-production-ready, Property 8: Notification permission denial graceful handling
import { initNotifications } from '../utils/notifications';

jest.mock('expo-notifications', () => ({
    getPermissionsAsync: jest.fn().mockResolvedValue({ status: 'denied' }),
    requestPermissionsAsync: jest.fn().mockResolvedValue({ status: 'denied' }),
    setNotificationChannelAsync: jest.fn().mockResolvedValue(undefined),
    cancelAllScheduledNotificationsAsync: jest.fn().mockResolvedValue(undefined),
    scheduleNotificationAsync: jest.fn().mockResolvedValue(undefined),
    SchedulableTriggerInputTypes: { DAILY: 'daily' },
}));

describe('Notification Permission Handling', () => {
    it('Property 8: does not schedule reminders when permission denied', async () => {
        const Notifications = require('expo-notifications');
        await initNotifications();
        expect(Notifications.scheduleNotificationAsync).not.toHaveBeenCalled();
    });

    it('does not throw when permission is denied', async () => {
        await expect(initNotifications()).resolves.not.toThrow();
    });
});
