import type { MoodEntry } from '../types/mood';

const STORAGE_KEY = 'mood-tracker-entries';

export const getMoodEntries = (): MoodEntry[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    
    const entries = JSON.parse(stored);
    const processedEntries = entries.map((entry: any) => ({
      ...entry,
      timestamp: new Date(entry.timestamp),
    }));
    return processedEntries;
  } catch (error) {
    console.error('Error loading mood entries:', error);
    return [];
  }
};

export const saveMoodEntry = (entry: MoodEntry): void => {
  try {
    const entries = getMoodEntries();
    entries.push(entry);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  } catch (error) {
    console.error('Error saving mood entry:', error);
  }
};

export const updateMoodEntry = (updatedEntry: MoodEntry): void => {
  try {
    const entries = getMoodEntries();
    const index = entries.findIndex(entry => entry.id === updatedEntry.id);
    if (index !== -1) {
      entries[index] = updatedEntry;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    }
  } catch (error) {
    console.error('Error updating mood entry:', error);
  }
};

export const deleteMoodEntry = (id: string): void => {
  try {
    const entries = getMoodEntries();
    const filteredEntries = entries.filter(entry => entry.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredEntries));
  } catch (error) {
    console.error('Error deleting mood entry:', error);
  }
};
