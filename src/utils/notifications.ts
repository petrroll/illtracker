/**
 * Notifications utility for mood tracking reminders
 * Handles push notification permissions, scheduling, and delivery
 */

import type { NotificationSettings } from '../types/settings';

const NOTIFICATION_STORAGE_KEY = 'mood-notification-settings';
const DEFAULT_NOTIFICATION_TIME = '14:00'; // 2 PM

// Export the storage key for use in contexts
export const getNotificationStorageKey = () => NOTIFICATION_STORAGE_KEY;

/**
 * Check if the browser supports notifications
 */
export const isNotificationSupported = (): boolean => {
  return 'Notification' in window && 'serviceWorker' in navigator;
};

/**
 * Request notification permission from the user
 */
export const requestNotificationPermission = async (): Promise<NotificationPermission> => {
  if (!isNotificationSupported()) {
    throw new Error('Notifications are not supported in this browser');
  }
  
  return await Notification.requestPermission();
};

/**
 * Get current notification settings from localStorage
 */
export const getNotificationSettings = (): NotificationSettings => {
  const stored = localStorage.getItem(NOTIFICATION_STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch (error) {
      console.error('Failed to parse notification settings:', error);
    }
  }
  
  return {
    enabled: false,
    time: DEFAULT_NOTIFICATION_TIME,
  };
};

/**
 * Save notification settings to localStorage
 */
export const saveNotificationSettings = (settings: NotificationSettings): void => {
  localStorage.setItem(NOTIFICATION_STORAGE_KEY, JSON.stringify(settings));
};

/**
 * Calculate milliseconds until the next notification time
 */
export const getMillisecondsUntilNotificationTime = (timeString: string): number => {
  const now = new Date();
  const [hours, minutes] = timeString.split(':').map(Number);
  
  const notificationTime = new Date();
  notificationTime.setHours(hours, minutes, 0, 0);
  
  // If the time has already passed today, schedule for tomorrow
  if (notificationTime <= now) {
    notificationTime.setDate(notificationTime.getDate() + 1);
  }
  
  return notificationTime.getTime() - now.getTime();
};

/**
 * Show a notification to the user
 */
export const showNotification = (title: string, options?: NotificationOptions): void => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      icon: '/pwa-192x192.svg',
      badge: '/pwa-192x192.svg',
      requireInteraction: true,
      ...options,
    });
  }
};

/**
 * Schedule the next daily notification
 */
export const scheduleNextNotification = (settings: NotificationSettings): void => {
  if (!settings.enabled || Notification.permission !== 'granted') {
    return;
  }
  
  // Clear any existing timeout
  clearDailyNotificationTimeout();
  
  const delay = getMillisecondsUntilNotificationTime(settings.time);
  
  const timeoutId = window.setTimeout(() => {
    showNotification('Time to track your mood! 😊', {
      body: 'How are you feeling today? Take a moment to log your mood.',
      tag: 'daily-mood-reminder',
    });
    
    // Schedule the next notification (24 hours later)
    const updatedSettings = {
      ...settings,
      lastScheduled: new Date().toISOString(),
    };
    saveNotificationSettings(updatedSettings);
    scheduleNextNotification(updatedSettings);
  }, delay);
  
  // Store the timeout ID for potential cleanup
  sessionStorage.setItem('notificationTimeoutId', timeoutId.toString());
};

/**
 * Clear the current daily notification timeout
 */
export const clearDailyNotificationTimeout = (): void => {
  const timeoutId = sessionStorage.getItem('notificationTimeoutId');
  if (timeoutId) {
    clearTimeout(Number(timeoutId));
    sessionStorage.removeItem('notificationTimeoutId');
  }
};

/**
 * Initialize notification system
 */
export const initializeNotifications = async (): Promise<void> => {
  if (!isNotificationSupported()) {
    console.warn('Notifications are not supported in this browser');
    return;
  }
  
  const settings = getNotificationSettings();
  
  if (settings.enabled) {
    if (Notification.permission === 'granted') {
      scheduleNextNotification(settings);
    } else if (Notification.permission === 'default') {
      // Don't auto-request permission, let user enable it manually
      console.log('Notification permission not granted');
    }
  }
};

/**
 * Enable notifications with permission check
 */
export const enableNotifications = async (time: string = DEFAULT_NOTIFICATION_TIME): Promise<boolean> => {
  try {
    const permission = await requestNotificationPermission();
    
    if (permission === 'granted') {
      const settings: NotificationSettings = {
        enabled: true,
        time,
        lastScheduled: new Date().toISOString(),
      };
      
      saveNotificationSettings(settings);
      scheduleNextNotification(settings);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Failed to enable notifications:', error);
    return false;
  }
};

/**
 * Disable notifications
 */
export const disableNotifications = (): void => {
  const settings: NotificationSettings = {
    enabled: false,
    time: getNotificationSettings().time,
  };
  
  saveNotificationSettings(settings);
  clearDailyNotificationTimeout();
};

/**
 * Update notification time
 */
export const updateNotificationTime = (time: string): void => {
  const settings = getNotificationSettings();
  const updatedSettings = {
    ...settings,
    time,
  };
  
  saveNotificationSettings(updatedSettings);
  
  if (settings.enabled && Notification.permission === 'granted') {
    scheduleNextNotification(updatedSettings);
  }
};
