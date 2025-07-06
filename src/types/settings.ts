/**
 * Settings-related type definitions
 */

export interface NotificationSettings {
  enabled: boolean;
  time: string; // HH:MM format
  lastShown?: string; // ISO date string of last notification shown
}

// Future settings types can be added here
// export interface ThemeSettings { ... }
// export interface PrivacySettings { ... }
