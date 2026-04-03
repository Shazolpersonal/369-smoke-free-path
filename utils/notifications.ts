import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { initNotificationSystem } from './notificationService';

/**
 * Request notification permissions and set up Android channel
 */
export async function registerForPushNotificationsAsync(): Promise<boolean> {
  // Check existing permissions
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  // Request permissions if not granted
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  // Set up Android notification channel
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Daily Reminders',
      importance: Notifications.AndroidImportance.MAX,
      sound: 'default',
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#10B981',
    });
  }

  return finalStatus === 'granted';
}

/**
 * Schedule the three daily reminder notifications
 */
export async function scheduleDailyReminders(): Promise<void> {
  // Cancel all existing scheduled notifications to avoid duplicates
  await Notifications.cancelAllScheduledNotificationsAsync();

  // Morning notification - 08:00 AM
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'সকালের শপথ',
      body: 'আজকের দিনের শুরুটা হোক পবিত্র। ৩ বার শপথ নেওয়ার সময় হয়েছে।',
      data: { url: '/task/morning' },
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 8,
      minute: 0,
    },
  });

  // Noon notification - 01:00 PM (13:00)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'দুপুরের শপথ',
      body: 'আল্লাহ দেখছেন। দুপুরের ৬টি শপথ পূর্ণ করো।',
      data: { url: '/task/noon' },
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 13,
      minute: 0,
    },
  });

  // Night notification - 06:00 PM (18:00)
  await Notifications.scheduleNotificationAsync({
    content: {
      title: 'রাতের শপথ',
      body: 'সারাদিন সফল ছিলে, আলহামদুলিল্লাহ। ঘুমানোর আগে ৯ বার শুকরিয়া আদায় করো।',
      data: { url: '/task/night' },
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: 18,
      minute: 0,
    },
  });
}

/**
 * Initialize notifications - delegates to notificationService for backward compatibility.
 */
export async function initNotifications(): Promise<void> {
  await initNotificationSystem({ language: 'en' });
}
