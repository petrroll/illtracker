/**
 * Settings-related type definitions
 */

export interface NotificationSettings {
  enabled: boolean;
  time: string; // HH:MM format
  lastScheduled?: string; // ISO date string
}

// Future settings types can be added here
// export interface ThemeSettings { ... }
// export interface PrivacySettings { ... }
