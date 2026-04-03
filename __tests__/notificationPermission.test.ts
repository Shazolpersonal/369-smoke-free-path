/**
 * Tests for PermissionManager (utils/permissionManager.ts)
 * Covers: granted / denied / undetermined flows, storage, checkAndRequestPermission logic.
 */

// ---------------------------------------------------------------------------
// Mocks — must be declared before any imports that use them
// ---------------------------------------------------------------------------

jest.mock('expo-notifications', () => ({
  requestPermissionsAsync: jest.fn(),
  getPermissionsAsync: jest.fn(),
}));

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(),
  setItem: jest.fn(),
}));

jest.mock('expo-constants', () => ({
  default: { appOwnership: 'standalone' },
}));

jest.mock('react-native', () => ({
  Platform: { OS: 'android' },
}));

// ---------------------------------------------------------------------------
// Imports (after mocks)
// ---------------------------------------------------------------------------

import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  requestNotificationPermission,
  getStoredPermissionStatus,
  savePermissionStatus,
  checkAndRequestPermission,
  PermissionStatus,
  PermissionState,
} from '../utils/permissionManager';

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const mockRequest = Notifications.requestPermissionsAsync as jest.Mock;
const mockGet = Notifications.getPermissionsAsync as jest.Mock;
const mockAsyncGet = AsyncStorage.getItem as jest.Mock;
const mockAsyncSet = AsyncStorage.setItem as jest.Mock;

function makeStoredState(status: PermissionStatus): string {
  const state: PermissionState = { status, checkedAt: Date.now() };
  return JSON.stringify(state);
}

beforeEach(() => {
  jest.clearAllMocks();
  mockAsyncSet.mockResolvedValue(undefined);
});

// ---------------------------------------------------------------------------
// requestNotificationPermission
// ---------------------------------------------------------------------------

describe('requestNotificationPermission', () => {
  it('returns "granted" when OS grants permission', async () => {
    mockRequest.mockResolvedValue({ status: 'granted' });
    const result = await requestNotificationPermission();
    expect(result).toBe('granted');
  });

  it('returns "denied" when OS denies permission', async () => {
    mockRequest.mockResolvedValue({ status: 'denied' });
    const result = await requestNotificationPermission();
    expect(result).toBe('denied');
  });

  it('returns "undetermined" for unknown OS status', async () => {
    mockRequest.mockResolvedValue({ status: 'not-determined' });
    const result = await requestNotificationPermission();
    expect(result).toBe('undetermined');
  });

  it('saves the status to AsyncStorage after requesting', async () => {
    mockRequest.mockResolvedValue({ status: 'granted' });
    await requestNotificationPermission();
    expect(mockAsyncSet).toHaveBeenCalledWith(
      '@notification_permission_status',
      expect.stringContaining('"status":"granted"'),
    );
  });

  it('returns "undetermined" and does not throw when requestPermissionsAsync throws', async () => {
    mockRequest.mockRejectedValue(new Error('OS error'));
    const result = await requestNotificationPermission();
    expect(result).toBe('undetermined');
  });
});

// ---------------------------------------------------------------------------
// getStoredPermissionStatus
// ---------------------------------------------------------------------------

describe('getStoredPermissionStatus', () => {
  it('returns "undetermined" when nothing is stored', async () => {
    mockAsyncGet.mockResolvedValue(null);
    const result = await getStoredPermissionStatus();
    expect(result).toBe('undetermined');
  });

  it('returns stored "granted" status', async () => {
    mockAsyncGet.mockResolvedValue(makeStoredState('granted'));
    const result = await getStoredPermissionStatus();
    expect(result).toBe('granted');
  });

  it('returns stored "denied" status', async () => {
    mockAsyncGet.mockResolvedValue(makeStoredState('denied'));
    const result = await getStoredPermissionStatus();
    expect(result).toBe('denied');
  });

  it('returns "undetermined" when AsyncStorage throws', async () => {
    mockAsyncGet.mockRejectedValue(new Error('storage error'));
    const result = await getStoredPermissionStatus();
    expect(result).toBe('undetermined');
  });

  it('returns "undetermined" when stored JSON is malformed', async () => {
    mockAsyncGet.mockResolvedValue('not-valid-json{{{');
    const result = await getStoredPermissionStatus();
    expect(result).toBe('undetermined');
  });
});

// ---------------------------------------------------------------------------
// savePermissionStatus
// ---------------------------------------------------------------------------

describe('savePermissionStatus', () => {
  it('writes a JSON object with status and checkedAt to AsyncStorage', async () => {
    await savePermissionStatus('granted');
    expect(mockAsyncSet).toHaveBeenCalledTimes(1);
    const [key, value] = mockAsyncSet.mock.calls[0];
    expect(key).toBe('@notification_permission_status');
    const parsed: PermissionState = JSON.parse(value);
    expect(parsed.status).toBe('granted');
    expect(typeof parsed.checkedAt).toBe('number');
  });

  it('does not throw when AsyncStorage.setItem fails', async () => {
    mockAsyncSet.mockRejectedValue(new Error('write error'));
    await expect(savePermissionStatus('denied')).resolves.toBeUndefined();
  });
});

// ---------------------------------------------------------------------------
// checkAndRequestPermission
// ---------------------------------------------------------------------------

describe('checkAndRequestPermission', () => {
  it('verifies with OS when stored status is "granted" and returns "granted"', async () => {
    mockAsyncGet.mockResolvedValue(makeStoredState('granted'));
    mockGet.mockResolvedValue({ status: 'granted' });
    const result = await checkAndRequestPermission();
    expect(result).toBe('granted');
    expect(mockGet).toHaveBeenCalled();
    expect(mockRequest).not.toHaveBeenCalled();
  });

  it('updates stored status when OS has revoked permission', async () => {
    mockAsyncGet.mockResolvedValue(makeStoredState('granted'));
    mockGet.mockResolvedValue({ status: 'denied' });
    const result = await checkAndRequestPermission();
    expect(result).toBe('denied');
    expect(mockAsyncSet).toHaveBeenCalledWith(
      '@notification_permission_status',
      expect.stringContaining('"status":"denied"'),
    );
  });

  it('requests permission when stored status is "denied"', async () => {
    mockAsyncGet.mockResolvedValue(makeStoredState('denied'));
    mockRequest.mockResolvedValue({ status: 'granted' });
    const result = await checkAndRequestPermission();
    expect(result).toBe('granted');
    expect(mockRequest).toHaveBeenCalled();
  });

  it('requests permission when stored status is "undetermined"', async () => {
    mockAsyncGet.mockResolvedValue(null);
    mockRequest.mockResolvedValue({ status: 'denied' });
    const result = await checkAndRequestPermission();
    expect(result).toBe('denied');
    expect(mockRequest).toHaveBeenCalled();
  });

  it('does not throw on unexpected storage error and falls back to requesting permission', async () => {
    // getStoredPermissionStatus will return 'undetermined' on storage failure,
    // so checkAndRequestPermission will call requestPermissionsAsync.
    mockAsyncGet.mockRejectedValue(new Error('storage failure'));
    mockRequest.mockResolvedValue({ status: 'undetermined' });
    const result = await checkAndRequestPermission();
    // Should not throw; result comes from requestPermissionsAsync
    expect(['granted', 'denied', 'undetermined']).toContain(result);
  });
});
