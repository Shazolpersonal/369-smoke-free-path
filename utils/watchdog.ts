import * as BackgroundFetch from 'expo-background-fetch';
import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { scheduleDailyReminders, getScheduledNotificationCount, getLastScheduledTimestamp } from './scheduler';
import { Language } from '../i18n';
import { logWarn } from './logger';

// ─── Constants ────────────────────────────────────────────────────────────────

const TASK_NAME = 'NOTIFICATION_WATCHDOG';
const WATCHDOG_LOG_KEY = '@notification_watchdog_log';
const APP_LANGUAGE_KEY = '@app_language';
const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;
const MIN_INTERVAL_SECONDS = 900; // 15 minutes

const IS_EXPO_GO = Constants.appOwnership === 'expo';

// ─── Task Definition ──────────────────────────────────────────────────────────

TaskManager.defineTask(TASK_NAME, async () => {
  try {
    const count = await getScheduledNotificationCount();
    const lastScheduled = await getLastScheduledTimestamp();
    const now = Date.now();

    // If count >= 3 AND last scheduled < 24 hours ago → skip
    if (count >= 3 && lastScheduled !== null && now - lastScheduled < TWENTY_FOUR_HOURS) {
      await appendWatchdogLog({ timestamp: now, action: 'skipped', count });
      return BackgroundFetch.BackgroundFetchResult.NoData;
    }

    // Need to reschedule
    const rawLang = await AsyncStorage.getItem(APP_LANGUAGE_KEY);
    const language: Language = (rawLang === 'bn' ? 'bn' : 'en') as Language;

    await scheduleDailyReminders(language);
    await appendWatchdogLog({ timestamp: now, action: 'rescheduled', count });
    return BackgroundFetch.BackgroundFetchResult.NewData;
  } catch (error) {
    const now = Date.now();
    await appendWatchdogLog({ timestamp: now, action: 'checked', count: 0 });
    return BackgroundFetch.BackgroundFetchResult.Failed;
  }
});

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Register the background watchdog task.
 * No-op in Expo Go.
 */
export async function registerWatchdog(): Promise<void> {
  if (IS_EXPO_GO) return;

  try {
    await BackgroundFetch.registerTaskAsync(TASK_NAME, {
      minimumInterval: MIN_INTERVAL_SECONDS,
      stopOnTerminate: false,
      startOnBoot: true,
    });
  } catch (error) {
    logWarn('[Watchdog] registerWatchdog error:', error);
  }
}

/**
 * Unregister the background watchdog task.
 * No-op in Expo Go.
 */
export async function unregisterWatchdog(): Promise<void> {
  if (IS_EXPO_GO) return;

  try {
    const isRegistered = await TaskManager.isTaskRegisteredAsync(TASK_NAME);
    if (isRegistered) {
      await BackgroundFetch.unregisterTaskAsync(TASK_NAME);
    }
  } catch (error) {
    logWarn('[Watchdog] unregisterWatchdog error:', error);
  }
}

/**
 * Check whether the watchdog task is currently registered.
 * Returns false in Expo Go.
 */
export async function isWatchdogRegistered(): Promise<boolean> {
  if (IS_EXPO_GO) return false;

  try {
    return await TaskManager.isTaskRegisteredAsync(TASK_NAME);
  } catch (error) {
    logWarn('[Watchdog] isWatchdogRegistered error:', error);
    return false;
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

interface WatchdogLogEntry {
  timestamp: number;
  action: 'checked' | 'rescheduled' | 'skipped';
  count: number;
}

async function appendWatchdogLog(entry: WatchdogLogEntry): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(WATCHDOG_LOG_KEY);
    const log: WatchdogLogEntry[] = raw ? JSON.parse(raw) : [];
    log.push(entry);
    await AsyncStorage.setItem(WATCHDOG_LOG_KEY, JSON.stringify(log));
  } catch {
    // Silently ignore log errors
  }
}
