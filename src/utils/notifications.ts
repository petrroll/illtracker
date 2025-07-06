import type { NotificationSettings } from '../types/settings';

const STORAGE_KEY = 'mood-notification-settings';
const DEFAULT_TIME = '14:00';
let notificationTimeout: number | null = null;

export const isNotificationSupported = (): boolean => {
  return 'Notification' in window;
};

export const getNotificationSettings = (): NotificationSettings => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // Fallback to default
    }
  }
  return { enabled: false, time: DEFAULT_TIME };
};

const syncSettingsToServiceWorker = (settings: NotificationSettings): void => {
  // Send settings to service worker
  if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({
      type: 'UPDATE_NOTIFICATION_SETTINGS',
      settings
    });
  }
};

export const saveNotificationSettings = (settings: NotificationSettings): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  syncSettingsToServiceWorker(settings);
};

export const showNotification = (title: string, body?: string): void => {
  if (Notification.permission === 'granted') {
    new Notification(title, {
      body,
      icon: '/pwa-192x192.svg',
      tag: 'mood-reminder',
    });
    
    // Update last shown time
    const settings = getNotificationSettings();
    const updatedSettings = {
      ...settings,
      lastShown: new Date().toISOString()
    };
    saveNotificationSettings(updatedSettings);
  }
};

export const shouldShowNotification = (settings: NotificationSettings): boolean => {
  if (!settings.enabled) return false;
  
  const now = new Date();
  const [targetHours, targetMinutes] = settings.time.split(':').map(Number);
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // Check if we're within 5 minutes of the target time
  const isWithinTimeWindow = hours === targetHours && minutes <= targetMinutes + 5 && minutes >= targetMinutes;
  
  if (!isWithinTimeWindow) return false;
  
  // Check if we already showed today's notification
  if (settings.lastShown) {
    const lastShown = new Date(settings.lastShown);
    const today = new Date();
    today.setHours(targetHours, targetMinutes, 0, 0);
    
    // If we already showed notification today, don't show again
    if (lastShown >= today) {
      return false;
    }
  }
  
  return true;
};

export const checkForMissedNotification = (): void => {
  const settings = getNotificationSettings();
  if (!settings.enabled || Notification.permission !== 'granted') return;
  
  const now = new Date();
  const [targetHours, targetMinutes] = settings.time.split(':').map(Number);
  
  // Calculate today's notification time
  const todayTarget = new Date();
  todayTarget.setHours(targetHours, targetMinutes, 0, 0);
  
  // If notification time has passed today
  if (now > todayTarget) {
    // Check if we missed showing today's notification
    if (!settings.lastShown) {
      // Never shown any notification, show missed one
      showNotification('Don\'t forget to track your mood! 😊', 'How are you feeling today?');
      return;
    }
    
    const lastShown = new Date(settings.lastShown);
    
    // If last shown was before today's target time, we missed it
    if (lastShown < todayTarget) {
      showNotification('Don\'t forget to track your mood! 😊', 'How are you feeling today?');
    }
  }
};

export const enableNotifications = async (time: string = DEFAULT_TIME): Promise<boolean> => {
  if (!isNotificationSupported()) return false;
  
  const permission = await Notification.requestPermission();
  if (permission === 'granted') {
    const settings = { enabled: true, time };
    saveNotificationSettings(settings);
    scheduleNextNotification(settings);
    return true;
  }
  return false;
};

export const disableNotifications = (): void => {
  const settings = getNotificationSettings();
  saveNotificationSettings({ ...settings, enabled: false });
  clearNotification();
};

export const updateNotificationTime = (time: string): void => {
  const settings = getNotificationSettings();
  const updatedSettings = { ...settings, time };
  saveNotificationSettings(updatedSettings);
  
  if (settings.enabled && Notification.permission === 'granted') {
    scheduleNextNotification(updatedSettings);
  }
};

const scheduleNextNotification = (settings: NotificationSettings): void => {
  if (!settings.enabled || Notification.permission !== 'granted') return;
  
  clearNotification();
  
  const [hours, minutes] = settings.time.split(':').map(Number);
  const now = new Date();
  const target = new Date();
  target.setHours(hours, minutes, 0, 0);
  
  if (target <= now) {
    target.setDate(target.getDate() + 1);
  }
  
  const delay = target.getTime() - now.getTime();
  
  notificationTimeout = window.setTimeout(() => {
    showNotification('Time to track your mood! 😊', 'How are you feeling today?');
    scheduleNextNotification(settings); // Schedule tomorrow
  }, delay);
};

const clearNotification = (): void => {
  if (notificationTimeout) {
    clearTimeout(notificationTimeout);
    notificationTimeout = null;
  }
};

export const initializeNotifications = async (): Promise<void> => {
  const settings = getNotificationSettings();
  
  // Check for missed notifications first
  if (settings.enabled && Notification.permission === 'granted') {
    checkForMissedNotification();
  }
  
  // Send current settings to service worker - try multiple ways to ensure delivery
  if ('serviceWorker' in navigator) {
    try {
      // First, try to send to controller immediately
      if (navigator.serviceWorker.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: 'UPDATE_NOTIFICATION_SETTINGS',
          settings
        });
      }
      
      // Also send when service worker becomes ready
      const registration = await navigator.serviceWorker.ready;
      if (registration.active) {
        registration.active.postMessage({
          type: 'UPDATE_NOTIFICATION_SETTINGS',
          settings
        });
      }
      
      // Listen for new service worker installations and send settings
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (navigator.serviceWorker.controller) {
          navigator.serviceWorker.controller.postMessage({
            type: 'UPDATE_NOTIFICATION_SETTINGS',
            settings: getNotificationSettings() // Get fresh settings
          });
        }
      });
      
      // Listen for messages from service worker (e.g., when it shows a notification)
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data?.type === 'NOTIFICATION_SHOWN') {
          // Update our local settings with the timestamp
          const settings = getNotificationSettings();
          const updatedSettings = {
            ...settings,
            lastShown: event.data.timestamp
          };
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedSettings));
        }
      });
      
    } catch (error) {
      console.warn('Failed to sync settings with service worker:', error);
    }
  }
  
  if (settings.enabled && Notification.permission === 'granted') {
    scheduleNextNotification(settings);
  }
};
