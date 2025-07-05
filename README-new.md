# Mood Tracker PWA

A mobile-first Progressive Web App (PWA) built with React, TypeScript, and Vite for tracking daily mood.

## Features

- 📱 **Mobile-first design** - Optimized for touch interactions and mobile UX
- 📊 **Mood tracking** - Simple 0-10 slider with emoji feedback
- 💾 **Local storage** - All data stored locally in your browser
- 📝 **Optional notes** - Add context to your mood entries
- ✏️ **Edit/Delete** - Modify or remove past entries
- 🔄 **PWA features** - Installable, offline support, native app-like experience
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
│   └── EditMoodModal.tsx # Edit entry modal
├── pages/               # Page components
│   ├── TrackPage.tsx    # Main mood tracking page
│   └── HistoryPage.tsx  # Mood history page
├── context/             # React context
│   └── MoodContext.tsx  # Mood state management
├── types/               # TypeScript types
│   └── mood.ts         # Mood entry types
├── utils/               # Utility functions
│   └── storage.ts      # LocalStorage utilities
└── main.tsx            # App entry point
```

## Usage

1. **Track your mood**: Use the slider on the main page to select how you're feeling (0-10)
2. **Add notes**: Optionally add a note to provide context
3. **Save**: Click "Save Mood Entry" to store your entry
4. **View history**: Navigate to the History page to see all your past entries
5. **Edit/Delete**: Use the buttons on each entry to modify or remove them

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
