import React, { useState, useEffect } from 'react';
import './PWAInstall.css';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

const PWAInstall: React.FC = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    const checkIfInstalled = () => {
      // Check if running in standalone mode
      if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsInstalled(true);
        return;
      }
      
      // Check navigator.standalone for iOS Safari
      if ((navigator as { standalone?: boolean }).standalone === true) {
        setIsInstalled(true);
        return;
      }
      
      // Check if the app was installed through Chrome's Add to Home Screen
      if (document.referrer.includes('android-app://')) {
        setIsInstalled(true);
        return;
      }
    };

    checkIfInstalled();

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      console.log('PWA: beforeinstallprompt event fired');
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event for later use
      setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      console.log('PWA: appinstalled event fired');
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    // Add debug logging
    console.log('PWA: Setting up event listeners');
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Debug: Check if service worker is registered
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then((registration) => {
        console.log('PWA: Service Worker is ready:', registration);
      });
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!installPrompt) return;

    setIsInstalling(true);
    
    try {
      // Show the install prompt
      await installPrompt.prompt();
      
      // Wait for the user to respond to the prompt
      const result = await installPrompt.userChoice;
      
      if (result.outcome === 'accepted') {
        console.log('PWA installation accepted');
      } else {
        console.log('PWA installation dismissed');
      }
    } catch (error) {
      console.error('Error during PWA installation:', error);
    } finally {
      setIsInstalling(false);
      setInstallPrompt(null);
    }
  };

  // Don't render if already installed
  if (isInstalled) {
    return (
      <div className="pwa-install">
        <h3>✅ App Installed</h3>
        <p>Great! Mood Tracker is installed on your device.</p>
      </div>
    );
  }

  // Show manual installation instructions for iOS or if no install prompt
  if (!installPrompt) {
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    
    if (isIOS && isSafari) {
      return (
        <div className="pwa-install">
          <h3>Install App on iOS</h3>
          <p>To install Mood Tracker on your iPhone or iPad:</p>
          <ol style={{ textAlign: 'left', paddingLeft: '1.5rem' }}>
            <li>Tap the Share button <span style={{ fontSize: '1.2rem' }}>⬆️</span> in Safari</li>
            <li>Scroll down and tap "Add to Home Screen"</li>
            <li>Tap "Add" to install the app</li>
          </ol>
        </div>
      );
    }
    
    // For other browsers that don't support beforeinstallprompt
    return (
      <div className="pwa-install">
        <h3>Install App</h3>
        <p>To install Mood Tracker:</p>
        <ul style={{ textAlign: 'left' }}>
          <li><strong>Chrome/Edge:</strong> Look for the install button in the address bar</li>
          <li><strong>Firefox:</strong> Check the three-dot menu for "Install"</li>
          <li><strong>Safari:</strong> Use "Add to Home Screen" from the share menu</li>
        </ul>
      </div>
    );
  }

  return (
    <div className="pwa-install">
      <h3>Install App</h3>
      <p>Install Mood Tracker on your device for the best experience. You'll be able to:</p>
      <ul>
        <li>Access the app from your home screen</li>
        <li>Use it offline once downloaded</li>
        <li>Receive notifications even when the browser is closed</li>
        <li>Enjoy a native app-like experience</li>
      </ul>
      
      <button 
        className="install-button"
        onClick={handleInstallClick}
        disabled={isInstalling}
      >
        {isInstalling ? (
          <span className="installing">
            <span className="spinner"></span>
            Installing...
          </span>
        ) : (
          <>
            <span className="install-icon">📱</span>
            Install App
          </>
        )}
      </button>
    </div>
  );
};

export default PWAInstall;