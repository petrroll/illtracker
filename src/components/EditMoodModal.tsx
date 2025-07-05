import React, { useState, useEffect } from 'react';
import type { MoodEntry } from '../types/mood';
import MoodSlider from './MoodSlider';

interface EditMoodModalProps {
  entry: MoodEntry;
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: MoodEntry) => void;
}

const EditMoodModal: React.FC<EditMoodModalProps> = ({
  entry,
  isOpen,
  onClose,
  onSave,
}) => {
  const [moodValue, setMoodValue] = useState(entry.value);
  const [note, setNote] = useState(entry.note || '');

  useEffect(() => {
    if (isOpen) {
      setMoodValue(entry.value);
      setNote(entry.note || '');
    }
  }, [entry, isOpen]);

  const handleSave = () => {
    const updatedEntry: MoodEntry = {
      ...entry,
      value: moodValue,
      note: note.trim() || undefined,
    };
    onSave(updatedEntry);
    onClose();
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h3 className="modal-title">Edit Mood Entry</h3>
          <button className="close-btn" onClick={onClose} aria-label="Close">
            ×
          </button>
        </div>
        
        <div>
          <MoodSlider value={moodValue} onChange={setMoodValue} />
          
          <div className="form-group">
            <label htmlFor="edit-note" className="label">
              Note
            </label>
            <textarea
              id="edit-note"
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
        </div>
        
        <div className="modal-actions">
          <button className="btn" onClick={onClose}>
            Cancel
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditMoodModal;
