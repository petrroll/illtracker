import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { NotificationSettings } from '../types/settings';
import { 
  initializeNotifications, 
  enableNotifications, 
  disableNotifications, 
  updateNotificationTime,
  getNotificationSettings,
  isNotificationSupported
} from '../utils/notifications';

interface SettingsContextType {
  notificationSettings: NotificationSettings;
  notificationSupported: boolean;
  enableDailyNotifications: (time?: string) => Promise<boolean>;
  disableDailyNotifications: () => void;
  updateNotificationTime: (time: string) => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>(() => 
    getNotificationSettings()
  );
  const [notificationSupported] = useState<boolean>(() => isNotificationSupported());

  const enableDailyNotifications = async (time?: string): Promise<boolean> => {
    const success = await enableNotifications(time);
    if (success) {
      setNotificationSettings(getNotificationSettings());
    }
    return success;
  };

  const disableDailyNotifications = (): void => {
    disableNotifications();
    setNotificationSettings(getNotificationSettings());
  };

  const handleUpdateNotificationTime = (time: string): void => {
    updateNotificationTime(time);
    setNotificationSettings(getNotificationSettings());
  };

  useEffect(() => {
    initializeNotifications().catch(console.error);
  }, []);

  const value = {
    notificationSettings,
    notificationSupported,
    enableDailyNotifications,
    disableDailyNotifications,
    updateNotificationTime: handleUpdateNotificationTime,
  };

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};
