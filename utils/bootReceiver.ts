import * as TaskManager from 'expo-task-manager';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { scheduleDailyReminders } from './scheduler';
import { getStoredPermissionStatus } from './permissionManager';
import { Language } from '../i18n';
import { logWarn } from './logger';

// ─── Constants ────────────────────────────────────────────────────────────────

const TASK_NAME = 'BOOT_NOTIFICATION_RECOVERY';
const BOOT_RECOVERY_LOG_KEY = '@notification_boot_recovery_log';
const APP_LANGUAGE_KEY = '@app_language';

const IS_EXPO_GO = Constants.appOwnership === 'expo';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface BootRecoveryLogEntry {
  timestamp: number;
  success: boolean;
  error?: string;
}

// ─── Task Definition ──────────────────────────────────────────────────────────

TaskManager.defineTask(TASK_NAME, async () => {
  const timestamp = Date.now();

  try {
    const permissionStatus = await getStoredPermissionStatus();

    if (permissionStatus !== 'granted') {
      await appendBootLog({ timestamp, success: false, error: 'Permission not granted' });
      return;
    }

    const rawLang = await AsyncStorage.getItem(APP_LANGUAGE_KEY);
    const language: Language = (rawLang === 'bn' ? 'bn' : 'en') as Language;

    const result = await scheduleDailyReminders(language);

    if (result.success) {
      await appendBootLog({ timestamp, success: true });
    } else {
      await appendBootLog({ timestamp, success: false, error: result.error });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await appendBootLog({ timestamp, success: false, error: message });
  }
});

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Register the boot recovery task by defining it.
 * expo-task-manager handles boot automatically when the task is defined.
 * No-op in Expo Go.
 */
export function registerBootReceiver(): void {
  if (IS_EXPO_GO) return;
  // Task is already defined above via TaskManager.defineTask.
  // expo-task-manager will invoke it on device boot automatically.
}

/**
 * Read and return the boot recovery log from AsyncStorage.
 */
export async function getBootRecoveryLog(): Promise<BootRecoveryLogEntry[]> {
  try {
    const raw = await AsyncStorage.getItem(BOOT_RECOVERY_LOG_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as BootRecoveryLogEntry[];
  } catch (error) {
    logWarn('[BootReceiver] getBootRecoveryLog error:', error);
    return [];
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function appendBootLog(entry: BootRecoveryLogEntry): Promise<void> {
  try {
    const raw = await AsyncStorage.getItem(BOOT_RECOVERY_LOG_KEY);
    const log: BootRecoveryLogEntry[] = raw ? JSON.parse(raw) : [];
    log.push(entry);
    await AsyncStorage.setItem(BOOT_RECOVERY_LOG_KEY, JSON.stringify(log));
  } catch {
    // Silently ignore log errors
  }
}
