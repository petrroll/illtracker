export interface MoodEntry {
  id: string;
  value: number;
  timestamp: Date;
  note?: string;
}

export type MoodEntryInput = Omit<MoodEntry, 'id' | 'timestamp'>;
