import React from 'react';
import NotificationSettings from '../components/NotificationSettings';
import PWAInstall from '../components/PWAInstall';
import './SettingsPage.css';

const SettingsPage: React.FC = () => {
  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1>Settings</h1>
        
        <div className="settings-section">
          <NotificationSettings />
        </div>
        
        <div className="settings-section">
          <PWAInstall />
        </div>
        
        <div className="settings-section">
          <div className="app-info">
            <h3>About Mood Tracker</h3>
            <p>A simple, private mood tracking app that stores your data locally on your device.</p>
            <p>Your data never leaves your device and is completely private.</p>
            
            <div className="app-version">
              <small>Version 1.0.0</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
