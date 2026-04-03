import * as Notifications from 'expo-notifications';
import {
  AndroidImportance,
  AndroidNotificationVisibility,
  SchedulableTriggerInputTypes,
} from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { getNotificationContent } from './contentRotator';
import { Language } from '../i18n';
import { TimeSlot } from '../types';

// ─── Guards ──────────────────────────────────────────────────────────────────

const IS_EXPO_GO = Constants.appOwnership === 'expo';

// ─── Constants ───────────────────────────────────────────────────────────────

const LAST_SCHEDULED_KEY = '@notification_last_scheduled';

const CHANNEL_ID = 'daily-reminders';

const TIME_SLOTS: Array<{ slot: TimeSlot; hour: number; minute: number }> = [
  { slot: 'morning', hour: 8, minute: 0 },
  { slot: 'noon', hour: 13, minute: 0 },
  { slot: 'night', hour: 18, minute: 0 },
];

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ScheduleResult {
  success: boolean;
  scheduledAt: number;
  error?: string;
}

// ─── Sub-task 3.1: Android Notification Channel Setup ────────────────────────

export async function setupNotificationChannel(): Promise<void> {
  if (Platform.OS !== 'android') return;

  await Notifications.setNotificationChannelAsync(CHANNEL_ID, {
    name: 'Daily Reminders',
    importance: AndroidImportance.MAX,
    lockscreenVisibility: AndroidNotificationVisibility.PUBLIC,
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
    lightColor: '#10B981',
    enableVibrate: true,
  });
}

// ─── Sub-task 3.2: scheduleDailyReminders ────────────────────────────────────

export async function scheduleDailyReminders(language: Language): Promise<ScheduleResult> {
  // Guard: Expo Go and web are not supported
  if (IS_EXPO_GO || Platform.OS === 'web') {
    return { success: true, scheduledAt: Date.now() };
  }

  try {
    // Cancel all existing scheduled notifications first
    await Notifications.cancelAllScheduledNotificationsAsync();

    // Schedule 3 daily notifications — one per time slot
    for (const { slot, hour, minute } of TIME_SLOTS) {
      const content = getNotificationContent(slot, language);

      await Notifications.scheduleNotificationAsync({
        content: {
          title: content.title,
          body: content.body,
          data: { url: `/task/${slot}`, slot },
          sound: 'default',
          // @ts-ignore — channelId is valid on Android
          channelId: CHANNEL_ID,
        },
        trigger: {
          type: SchedulableTriggerInputTypes.DAILY,
          hour,
          minute,
        },
      });
    }

    // Persist timestamp only on success
    const scheduledAt = Date.now();
    await saveLastScheduledTimestamp(scheduledAt);

    return { success: true, scheduledAt };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return { success: false, scheduledAt: 0, error: message };
  }
}

// ─── Sub-task 3.3: Helper Functions ──────────────────────────────────────────

export async function getScheduledNotificationCount(): Promise<number> {
  const notifications = await Notifications.getAllScheduledNotificationsAsync();
  return notifications.length;
}

export async function getLastScheduledTimestamp(): Promise<number | null> {
  const value = await AsyncStorage.getItem(LAST_SCHEDULED_KEY);
  if (value === null) return null;
  const parsed = Number(value);
  return isNaN(parsed) ? null : parsed;
}

export async function saveLastScheduledTimestamp(ts: number): Promise<void> {
  await AsyncStorage.setItem(LAST_SCHEDULED_KEY, String(ts));
}

export async function cancelAllNotifications(): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
}
