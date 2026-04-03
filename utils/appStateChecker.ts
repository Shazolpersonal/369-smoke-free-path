import { AppState, AppStateStatus } from 'react-native';
import { scheduleDailyReminders, getScheduledNotificationCount, getLastScheduledTimestamp } from './scheduler';
import { getStoredPermissionStatus } from './permissionManager';
import { Language } from '../i18n';

const TWENTY_FOUR_HOURS = 24 * 60 * 60 * 1000;

/**
 * Start listening for app state changes and silently recover notifications
 * when the app becomes active and fewer than 3 notifications are scheduled.
 *
 * Returns a cleanup function that removes the listener.
 */
export function startAppStateChecker(language: Language): () => void {
  const handler = async (nextState: AppStateStatus) => {
    if (nextState !== 'active') return;

    try {
      const count = await getScheduledNotificationCount();
      const lastScheduled = await getLastScheduledTimestamp();
      const now = Date.now();

      // If count >= 3 AND last scheduled < 24 hours ago → skip silently
      if (count >= 3 && lastScheduled !== null && now - lastScheduled < TWENTY_FOUR_HOURS) {
        return;
      }

      // Only reschedule if permission is granted
      if (count < 3) {
        const permissionStatus = await getStoredPermissionStatus();
        if (permissionStatus === 'granted') {
          await scheduleDailyReminders(language);
        }
      }
    } catch {
      // Silent recovery — no UI feedback
    }
  };

  const subscription = AppState.addEventListener('change', handler);

  return () => {
    subscription.remove();
  };
}
