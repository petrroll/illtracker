# Mood Tracker PWA

A mobile-first Progressive Web App (PWA) built with React, TypeScript, and Vite for tracking daily mood.

## Features

- 📱 **Mobile-first design** - Optimized for touch interactions and mobile UX
- 📊 **Mood tracking** - Simple 0-10 slider with emoji feedback
- 💾 **Local storage** - All data stored locally in your browser
- 📝 **Optional notes** - Add context to your mood entries
- ✏️ **Edit/Delete** - Modify or remove past entries
- � **Daily reminders** - Push notifications at your chosen time (2 PM by default)
- �🔄 **PWA features** - Installable, offline support, native app-like experience
- 🎨 **Beautiful UI** - Gradient backgrounds and glassmorphism design

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to view it in the browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## PWA Features

This app is a fully functional PWA that can be:
- **Installed** on mobile devices and desktops
- **Used offline** once initially loaded
- **Accessed** from home screen like a native app

## Technology Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Vite PWA Plugin** - PWA functionality
- **React Router** - Navigation
- **LocalStorage** - Data persistence

## Project Structure

```
src/
├── components/          # Reusable components
│   ├── Navigation.tsx   # App navigation
│   ├── MoodSlider.tsx   # Mood input slider
│   ├── EditMoodModal.tsx # Edit entry modal
│   └── NotificationSettings.tsx # Notification configuration
├── pages/               # Page components
│   ├── TrackPage.tsx    # Main mood tracking page
│   ├── HistoryPage.tsx  # Mood history page
│   └── SettingsPage.tsx # App settings page
├── context/             # React context
│   ├── MoodContext.tsx  # Mood state management
│   └── SettingsContext.tsx # App settings management
├── types/               # TypeScript types
│   ├── mood.ts         # Mood entry types
│   └── settings.ts     # Settings and notification types
├── utils/               # Utility functions
│   ├── storage.ts      # LocalStorage utilities
│   └── notifications.ts # Push notification utilities
└── main.tsx            # App entry point
```

## Usage

1. **Track your mood**: Use the slider on the main page to select how you're feeling (0-10)
2. **Add notes**: Optionally add a note to provide context
3. **Save**: Click "Save Mood Entry" to store your entry
4. **View history**: Navigate to the History page to see all your past entries
5. **Edit/Delete**: Use the buttons on each entry to modify or remove them
6. **Set up reminders**: Go to Settings to enable daily push notifications

## Daily Notifications

The app features a **robust notification system** with true background capabilities:

- **Default time**: 2:00 PM local time (customizable)
- **Background sync**: Works even when browser/app is closed (hourly checks)
- **Service worker**: True background processing for notifications
- **Smart sync**: Checks for missed notifications when app opens
- **Catch-up notifications**: Shows reminders if you missed previous days
- **Page visibility**: Triggers sync when returning to the app
- **Offline capable**: Works without internet connection
- **Progressive enhancement**: Falls back gracefully on unsupported browsers

### How It Works
1. **Service Worker Background Sync**: Registers hourly background tasks that run even when app is closed
2. **Periodic Background Sync**: Advanced Chrome feature for maximum reliability (where supported)
3. **Immediate notifications**: Uses setTimeout for precise timing when app is open
4. **Fallback intervals**: 1-hour intervals for browsers without background sync
5. **Missed notification detection**: Checks on app startup for any missed reminders
6. **Page visibility sync**: Triggers when switching back to the app tab

### Background Sync Support
- **Chrome/Edge (desktop & mobile)**: Full background sync + periodic sync
- **Firefox (desktop & mobile)**: Basic background sync when PWA is installed
- **Safari**: Limited support, fallback to app-open notifications
- **Fallback**: Hourly checks when app is open (all browsers)

### Technical Features
- 🔄 **Service Worker**: True background processing
- ⚡ **Background Sync API**: Works when app is closed
- 🔁 **Periodic Background Sync**: Chrome's advanced scheduling (where available)
- 📱 **PWA Integration**: Install for best background performance
- 🛡️ **Progressive Enhancement**: Graceful degradation on older browsers

## Data Storage

All mood data is stored locally in your browser using LocalStorage. This means:
- ✅ Your data stays private and local
- ✅ No internet connection required after initial load
- ⚠️ Data is tied to your browser (clearing browser data will remove entries)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).
