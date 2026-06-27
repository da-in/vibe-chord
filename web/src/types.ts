export type Mood = 'bright' | 'calm' | 'dreamy' | 'tense';

export interface ChordDef {
  id: string;
  symbol: string;
  label: string;
  mood: Mood;
  notes: string[];
}

export interface TimelineChord {
  id: string;
  chordId: string;
}

export interface ChordRecommendation {
  chordId: string;
  whenToChoose: string;
  reason?: string;
}
