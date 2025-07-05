import React, { useState } from 'react';
import { useMood } from '../context/MoodContext';
import type { MoodEntry } from '../types/mood';
import EditMoodModal from '../components/EditMoodModal';

const HistoryPage: React.FC = () => {
  const { entries, updateEntry, deleteEntry } = useMood();
  const [editingEntry, setEditingEntry] = useState<MoodEntry | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const formatDate = (date: Date): string => {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return `Today at ${date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    } else if (diffDays === 1) {
      return `Yesterday at ${date.toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString([], {
        month: 'short',
        day: 'numeric',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
      });
    }
  };

  const getMoodEmoji = (value: number): string => {
    if (value <= 1) return '😢';
    if (value <= 3) return '😔';
    if (value <= 4) return '😐';
    if (value <= 6) return '🙂';
    if (value <= 8) return '😊';
    return '😁';
  };

  const getMoodColor = (value: number): string => {
    if (value <= 2) return '#ff6b6b';
    if (value <= 4) return '#ffa726';
    if (value <= 6) return '#feca57';
    if (value <= 8) return '#48c78e';
    return '#06d6a0';
  };

  const handleDelete = (id: string) => {
    setDeletingId(id);
    
    // Add a small delay for better UX
    setTimeout(() => {
      deleteEntry(id);
      setDeletingId(null);
    }, 200);
  };

  const handleEdit = (entry: MoodEntry) => {
    setEditingEntry(entry);
  };

  const handleSaveEdit = (updatedEntry: MoodEntry) => {
    updateEntry(updatedEntry);
    setEditingEntry(null);
  };

  if (entries.length === 0) {
    return (
      <div className="container" style={{ paddingTop: '2rem' }}>
        <div className="empty-state">
          <h3>No mood entries yet</h3>
          <p>Start tracking your mood to see your history here!</p>
          <div style={{ fontSize: '3rem', marginTop: '1rem' }}>📊</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: '2rem', paddingBottom: '2rem' }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '1.5rem'
      }}>
        <h2 style={{ margin: 0 }}>Mood History</h2>
        <div style={{ 
          fontSize: '0.875rem', 
          color: 'rgba(255, 255, 255, 0.7)' 
        }}>
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </div>
      </div>

      <ul className="entry-list">
        {entries.map((entry) => (
          <li 
            key={entry.id} 
            className="entry-item"
            style={{
              opacity: deletingId === entry.id ? 0.5 : 1,
              transform: deletingId === entry.id ? 'scale(0.95)' : 'scale(1)',
              transition: 'all 0.2s ease',
            }}
          >
            <div className="entry-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>
                  {getMoodEmoji(entry.value)}
                </span>
                <span 
                  className="entry-mood" 
                  style={{ color: getMoodColor(entry.value) }}
                >
                  {entry.value}/10
                </span>
              </div>
              <span className="entry-date">
                {formatDate(entry.timestamp)}
              </span>
            </div>
            
            {entry.note && (
              <div style={{ 
                marginTop: '0.5rem',
                color: 'rgba(255, 255, 255, 0.8)',
                fontSize: '0.9rem',
                lineHeight: '1.4'
              }}>
                {entry.note}
              </div>
            )}
            
            <div className="entry-actions">
              <button
                className="btn"
                onClick={() => handleEdit(entry)}
                disabled={deletingId === entry.id}
              >
                ✏️ Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDelete(entry.id)}
                disabled={deletingId === entry.id}
              >
                {deletingId === entry.id ? 'Deleting...' : '🗑️ Delete'}
              </button>
            </div>
          </li>
        ))}
      </ul>

      {editingEntry && (
        <EditMoodModal
          entry={editingEntry}
          isOpen={true}
          onClose={() => setEditingEntry(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
};

export default HistoryPage;
