import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMood } from '../context/MoodContext';
import { useSettings } from '../context/SettingsContext';
import MoodSlider from '../components/MoodSlider';

const TrackPage: React.FC = () => {
  const { addEntry, entries } = useMood();
  const { notificationSettings, notificationSupported } = useSettings();
  
  const [currentMood, setCurrentMood] = useState(5); // Default to 5, will be updated on initial load
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);

  // Set initial mood value based on last recorded entry (only on first load)
  useEffect(() => {
    if (!hasInitialized) {
      if (entries.length > 0) {
        setCurrentMood(entries[0].value);
      }
      setHasInitialized(true);
    }
  }, [entries, hasInitialized]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Add a small delay for better UX feedback
    setTimeout(() => {
      addEntry({
        value: currentMood,
        note: note.trim() || undefined,
      });
      
      // Reset form
      setNote('');
      // Keep the current mood value as the new default (the value just saved)
      // setCurrentMood remains at the value that was just saved
      setIsSubmitting(false);
      
      // Show success feedback
      const button = document.querySelector('.btn-primary') as HTMLElement;
      if (button) {
        const originalText = button.textContent;
        button.textContent = '✓ Saved!';
        button.style.background = 'linear-gradient(45deg, #48c78e, #06d6a0)';
        
        setTimeout(() => {
          button.textContent = originalText;
          button.style.background = 'linear-gradient(45deg, #ff6b6b, #feca57)';
        }, 2000);
      }
    }, 300);
  };

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div className="card">
        <h2 style={{ textAlign: 'center', marginTop: 0 }}>
          How are you feeling right now?
        </h2>
        
        <MoodSlider value={currentMood} onChange={setCurrentMood} />
        
        <div className="form-group">
          <label htmlFor="note" className="label">
            Add a note (optional)
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="What's on your mind?"
            className="input"
            rows={3}
            maxLength={200}
            style={{ resize: 'vertical', minHeight: '80px' }}
          />
          {note.length > 0 && (
            <div style={{ 
              fontSize: '0.875rem', 
              color: 'rgba(255, 255, 255, 0.6)', 
              marginTop: '0.5rem' 
            }}>
              {note.length}/200 characters
            </div>
          )}
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="btn btn-primary"
          style={{ 
            width: '100%', 
            fontSize: '1.1rem',
            opacity: isSubmitting ? 0.7 : 1,
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
          }}
        >
          {isSubmitting ? 'Saving...' : 'Save Mood Entry'}
        </button>
      </div>
      
      {/* Notification prompt */}
      {notificationSupported && !notificationSettings.enabled && (
        <div style={{
          background: 'rgba(255, 255, 255, 0.1)',
          padding: '1rem',
          borderRadius: '12px',
          marginTop: '1.5rem',
          textAlign: 'center',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}>
          <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem', color: 'white' }}>
            📱 Get Daily Reminders
          </h3>
          <p style={{ 
            margin: '0 0 1rem 0', 
            fontSize: '0.9rem', 
            color: 'rgba(255, 255, 255, 0.8)',
            lineHeight: '1.4'
          }}>
            Enable notifications to get gentle daily reminders to track your mood
          </p>
          <Link 
            to="/settings" 
            style={{
              display: 'inline-block',
              padding: '0.5rem 1rem',
              background: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '8px',
              fontSize: '0.9rem',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              transition: 'all 0.3s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
            }}
          >
            Set Up Reminders
          </Link>
        </div>
      )}
      
      <div style={{ 
        textAlign: 'center', 
        marginTop: '2rem', 
        color: 'rgba(255, 255, 255, 0.7)',
        fontSize: '0.875rem'
      }}>
        Track your mood regularly to see patterns over time
      </div>
    </div>
  );
};

export default TrackPage;
