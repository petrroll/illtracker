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
      if ((navigator as any).standalone === true) {
        setIsInstalled(true);
        return;
      }
    };

    checkIfInstalled();

    const handleBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Save the event for later use
      setInstallPrompt(e);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setInstallPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

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

  // Don't render if already installed or no install prompt available
  if (isInstalled || !installPrompt) {
    return null;
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