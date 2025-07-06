import { precacheAndRoute, cleanupOutdatedCaches } from 'workbox-precaching';
import { clientsClaim } from 'workbox-core';

declare const self: ServiceWorkerGlobalScope & {
  __WB_MANIFEST: any;
  clients: any;
  registration: ServiceWorkerRegistration & {
    showNotification(title: string, options?: NotificationOptions): Promise<void>;
  };
  skipWaiting(): Promise<void>;
  addEventListener(type: string, listener: (event: any) => void): void;
};

precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();
clientsClaim();

// Simple in-memory settings storage for service worker
let notificationSettings: { enabled: boolean; time: string; lastShown?: string } = { enabled: false, time: '14:00' };
let hasReceivedSettings = false;

const shouldShowNotification = (): boolean => {
  // Don't show notifications until we've received actual settings from main app
  if (!hasReceivedSettings || !notificationSettings.enabled) return false;
  
  const now = new Date();
  const [targetHours, targetMinutes] = notificationSettings.time.split(':').map(Number);
  const hours = now.getHours();
  const minutes = now.getMinutes();
  
  // Check if we're within 5 minutes of the target time
  const isWithinTimeWindow = hours === targetHours && minutes <= targetMinutes + 5 && minutes >= targetMinutes;
  
  if (!isWithinTimeWindow) return false;
  
  // Check if we already showed today's notification
  if (notificationSettings.lastShown) {
    const lastShown = new Date(notificationSettings.lastShown);
    const today = new Date();
    today.setHours(targetHours, targetMinutes, 0, 0);
    
    // If we already showed notification today, don't show again
    if (lastShown >= today) {
      return false;
    }
  }
  
  return true;
};

const checkAndShowNotification = async () => {
  if (shouldShowNotification()) {
    try {
      await self.registration.showNotification('Time to track your mood! 😊', {
        body: 'How are you feeling today?',
        icon: '/pwa-192x192.svg',
        tag: 'mood-reminder',
        requireInteraction: true,
      });
      
      // Update last shown time in our local settings
      notificationSettings.lastShown = new Date().toISOString();
      
      // Notify main app to update its settings too
      const clients = await self.clients.matchAll({ type: 'window' });
      clients.forEach((client: any) => {
        client.postMessage({
          type: 'NOTIFICATION_SHOWN',
          timestamp: notificationSettings.lastShown
        });
      });
      
    } catch (error) {
      console.warn('SW notification failed:', error);
    }
  }
};

// Check every 5 minutes when SW is active
setInterval(checkAndShowNotification, 5 * 60 * 1000);

// Listen for settings updates from main app
self.addEventListener('message', (event: any) => {
  if (event.data?.type === 'UPDATE_NOTIFICATION_SETTINGS') {
    notificationSettings = event.data.settings;
    hasReceivedSettings = true;
    console.log('SW: Received notification settings:', notificationSettings);
  }
});

self.addEventListener('notificationclick', (event: any) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients: any) => {
      const existingClient = clients.find((client: any) => client.url.includes('/illtracker'));
      return existingClient ? existingClient.focus() : self.clients.openWindow('/illtracker/');
    })
  );
});

export {};
