import React, { useState } from 'react';

interface MoodSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const MoodSlider: React.FC<MoodSliderProps> = ({ value, onChange }) => {
  const [isInteracting, setIsInteracting] = useState(false);

  const getMoodEmoji = (value: number): string => {
    if (value <= 1) return '😢';
    if (value <= 3) return '😔';
    if (value <= 4) return '😐';
    if (value <= 6) return '🙂';
    if (value <= 8) return '😊';
    return '😁';
  };

  const getMoodLabel = (value: number): string => {
    if (value <= 1) return 'Very Bad';
    if (value <= 3) return 'Bad';
    if (value <= 4) return 'Okay';
    if (value <= 6) return 'Good';
    if (value <= 8) return 'Very Good';
    return 'Excellent';
  };

  return (
    <div className="slider-container">
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>
          {getMoodEmoji(value)}
        </div>
        <h2 style={{ margin: 0, fontSize: '1.5rem' }}>
          {value}/10 - {getMoodLabel(value)}
        </h2>
      </div>
      
      <input
        type="range"
        min="0"
        max="10"
        step="1"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onMouseDown={() => setIsInteracting(true)}
        onMouseUp={() => setIsInteracting(false)}
        onTouchStart={() => setIsInteracting(true)}
        onTouchEnd={() => setIsInteracting(false)}
        className="slider"
        style={{
          transform: isInteracting ? 'scale(1.02)' : 'scale(1)',
          transition: 'transform 0.2s ease',
        }}
      />
      
      <div className="slider-labels">
        <span>😢 Terrible</span>
        <span>😁 Amazing</span>
      </div>
    </div>
  );
};

export default MoodSlider;
