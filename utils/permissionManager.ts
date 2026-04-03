import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';
import { Platform } from 'react-native';

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface PermissionState {
  status: PermissionStatus;
  checkedAt: number;
}

const PERMISSION_STATUS_KEY = '@notification_permission_status';

const IS_EXPO_GO = Constants.appOwnership === 'expo';

/**
 * Request notification permission from the OS.
 * Returns 'granted' immediately on web or Expo Go to avoid crashes.
 */
export async function requestNotificationPermission(): Promise<PermissionStatus> {
  if (Platform.OS === 'web' || IS_EXPO_GO) {
    return 'granted';
  }

  try {
    const { status } = await Notifications.requestPermissionsAsync();
    const permissionStatus = mapStatus(status);
    await savePermissionStatus(permissionStatus);
    return permissionStatus;
  } catch (error) {
    console.warn('[PermissionManager] requestNotificationPermission error:', error);
    return 'undetermined';
  }
}

/**
 * Retrieve the last-stored permission status from AsyncStorage.
 * Returns 'undetermined' if nothing is stored or on error.
 */
export async function getStoredPermissionStatus(): Promise<PermissionStatus> {
  try {
    const raw = await AsyncStorage.getItem(PERMISSION_STATUS_KEY);
    if (!raw) return 'undetermined';
    const parsed: PermissionState = JSON.parse(raw);
    return parsed.status ?? 'undetermined';
  } catch (error) {
    console.warn('[PermissionManager] getStoredPermissionStatus error:', error);
    return 'undetermined';
  }
}

/**
 * Persist the given permission status to AsyncStorage.
 */
export async function savePermissionStatus(status: PermissionStatus): Promise<void> {
  try {
    const state: PermissionState = { status, checkedAt: Date.now() };
    await AsyncStorage.setItem(PERMISSION_STATUS_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('[PermissionManager] savePermissionStatus error:', error);
  }
}

/**
 * Check stored status first; if 'granted', verify with the OS.
 * If not granted, request permission again.
 *
 * Strategy:
 *  1. Read stored status.
 *  2. If stored === 'granted', verify with getPermissionsAsync().
 *  3. Otherwise, call requestPermissionsAsync() to prompt the user.
 */
export async function checkAndRequestPermission(): Promise<PermissionStatus> {
  if (Platform.OS === 'web' || IS_EXPO_GO) {
    return 'granted';
  }

  try {
    const stored = await getStoredPermissionStatus();

    if (stored === 'granted') {
      // Verify the OS still has permission (user may have revoked it in Settings)
      const { status } = await Notifications.getPermissionsAsync();
      const current = mapStatus(status);
      if (current !== stored) {
        await savePermissionStatus(current);
      }
      return current;
    }

    // Not granted — request again
    return await requestNotificationPermission();
  } catch (error) {
    console.warn('[PermissionManager] checkAndRequestPermission error:', error);
    return 'undetermined';
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function mapStatus(status: string): PermissionStatus {
  if (status === 'granted') return 'granted';
  if (status === 'denied') return 'denied';
  return 'undetermined';
}
