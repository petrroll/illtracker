import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { MoodEntry, MoodEntryInput } from '../types/mood';
import { getMoodEntries, saveMoodEntry, updateMoodEntry, deleteMoodEntry } from '../utils/storage';

interface MoodContextType {
  entries: MoodEntry[];
  addEntry: (entry: MoodEntryInput) => void;
  updateEntry: (entry: MoodEntry) => void;
  deleteEntry: (id: string) => void;
  refreshEntries: () => void;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const useMood = () => {
  const context = useContext(MoodContext);
  if (context === undefined) {
    throw new Error('useMood must be used within a MoodProvider');
  }
  return context;
};

interface MoodProviderProps {
  children: ReactNode;
}

export const MoodProvider: React.FC<MoodProviderProps> = ({ children }) => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);

  const refreshEntries = () => {
    const loadedEntries = getMoodEntries();
    setEntries(loadedEntries.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()));
  };

  const addEntry = (entryInput: MoodEntryInput) => {
    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      timestamp: new Date(),
      ...entryInput,
    };
    saveMoodEntry(newEntry);
    refreshEntries();
  };

  const updateEntry = (entry: MoodEntry) => {
    updateMoodEntry(entry);
    refreshEntries();
  };

  const deleteEntry = (id: string) => {
    deleteMoodEntry(id);
    refreshEntries();
  };

  useEffect(() => {
    refreshEntries();
  }, []);

  const value = {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    refreshEntries,
  };

  return <MoodContext.Provider value={value}>{children}</MoodContext.Provider>;
};
