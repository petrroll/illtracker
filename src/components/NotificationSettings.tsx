import React, { useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import './NotificationSettings.css';

const NotificationSettings: React.FC = () => {
  const { 
    notificationSettings, 
    notificationSupported, 
    enableDailyNotifications, 
    disableDailyNotifications, 
    updateNotificationTime 
  } = useSettings();
  
  const [tempTime, setTempTime] = useState(notificationSettings.time);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleNotifications = async () => {
    setIsLoading(true);
    try {
      if (notificationSettings.enabled) {
        disableDailyNotifications();
      } else {
        const success = await enableDailyNotifications(tempTime);
        if (!success) {
          alert('Failed to enable notifications. Please check your browser settings.');
        }
      }
    } catch (error) {
      console.error('Error toggling notifications:', error);
      alert('An error occurred while configuring notifications.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = event.target.value;
    setTempTime(newTime);
    
    if (notificationSettings.enabled) {
      updateNotificationTime(newTime);
    }
  };

  if (!notificationSupported) {
    return (
      <div className="notification-settings notification-settings--unsupported">
        <h3>Daily Reminders</h3>
        <p>🚫 Notifications are not supported in this browser.</p>
        <p>Try using a modern browser like Chrome, Firefox, or Safari.</p>
      </div>
    );
  }

  return (
    <div className="notification-settings">
      <h3>Daily Reminders</h3>
      <p>Get a gentle reminder to track your mood every day.</p>
      
      <div className="notification-toggle">
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={notificationSettings.enabled}
            onChange={handleToggleNotifications}
            disabled={isLoading}
          />
          <span className="toggle-slider">
            <span className="toggle-label">
              {notificationSettings.enabled ? 'Enabled' : 'Disabled'}
            </span>
          </span>
        </label>
      </div>

      <div className="time-setting">
        <label htmlFor="notification-time" className="time-label">
          Reminder Time:
        </label>
        <input
          id="notification-time"
          type="time"
          value={tempTime}
          onChange={handleTimeChange}
          className="time-input"
          disabled={isLoading}
        />
      </div>

      {notificationSettings.enabled && (
        <div className="notification-status">
          <p className="status-text">
            ✅ Daily reminders enabled for {tempTime}
          </p>
          {notificationSettings.lastScheduled && (
            <p className="last-scheduled">
              Last scheduled: {new Date(notificationSettings.lastScheduled).toLocaleDateString()}
            </p>
          )}
        </div>
      )}

      <div className="notification-info">
        <h4>How it works:</h4>
        <ul>
          <li>You'll receive a notification at your chosen time each day</li>
          <li>Notifications only work when the app is installed or the browser is open</li>
          <li>You can change the time anytime</li>
          <li>Disable notifications anytime by toggling them off</li>
        </ul>
      </div>
    </div>
  );
};

export default NotificationSettings;
