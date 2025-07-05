import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { MoodProvider } from './context/MoodContext';
import Navigation from './components/Navigation';
import TrackPage from './pages/TrackPage';
import HistoryPage from './pages/HistoryPage';

function App() {
  return (
    <MoodProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
          <Navigation />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<TrackPage />} />
              <Route path="/history" element={<HistoryPage />} />
            </Routes>
          </main>
        </div>
      </Router>
    </MoodProvider>
  );
}

export default App;
