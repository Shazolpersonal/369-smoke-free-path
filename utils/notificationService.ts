import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { checkAndRequestPermission } from './permissionManager';
import { setupNotificationChannel, scheduleDailyReminders } from './scheduler';
import { registerWatchdog, unregisterWatchdog } from './watchdog';
import { registerBootReceiver } from './bootReceiver';
import { startAppStateChecker } from './appStateChecker';
import { Language } from '../i18n';

// ─── Guards ───────────────────────────────────────────────────────────────────

const IS_EXPO_GO = Constants.appOwnership === 'expo';

// ─── Module-level state ───────────────────────────────────────────────────────

let appStateCleanup: (() => void) | null = null;

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Initialize the notification system.
 * Sets up the Android channel, requests permission, schedules daily reminders,
 * registers the watchdog and boot receiver, and starts the app state checker.
 *
 * No-op in Expo Go and on web.
 *
 * Requirements: 1.1, 15.1, 15.6
 */
export async function initNotificationSystem(config: { language: Language }): Promise<void> {
  if (IS_EXPO_GO || Platform.OS === 'web') return;

  await setupNotificationChannel();

  const permission = await checkAndRequestPermission();

  if (permission === 'granted') {
    await scheduleDailyReminders(config.language);
  }

  await registerWatchdog();
  registerBootReceiver();

  appStateCleanup = startAppStateChecker(config.language);
}

/**
 * Tear down the notification system.
 * Stops the app state listener and unregisters the watchdog.
 */
export async function teardownNotificationSystem(): Promise<void> {
  if (appStateCleanup) {
    appStateCleanup();
    appStateCleanup = null;
  }

  await unregisterWatchdog();
}
