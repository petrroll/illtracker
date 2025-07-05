import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { MoodProvider } from './context/MoodContext';
import { SettingsProvider } from './context/SettingsContext';
import Navigation from './components/Navigation';
import TrackPage from './pages/TrackPage';
import HistoryPage from './pages/HistoryPage';
import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <SettingsProvider>
      <MoodProvider>
        <Router>
          <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Navigation />
            <main style={{ flex: 1 }}>
              <Routes>
                <Route path="/" element={<TrackPage />} />
                <Route path="/history" element={<HistoryPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Routes>
            </main>
          </div>
        </Router>
      </MoodProvider>
    </SettingsProvider>
  );
}

export default App;
