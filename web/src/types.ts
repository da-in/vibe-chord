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
  bars?: 1 | 2;
}

export interface ChordRecommendation {
  chordId: string;
  whenToChoose: string;
  reason?: string;
  reasonDetail?: string;
}

export const CHORD_DRAG_MIME = 'application/vnd.vibe-chord.chord-id';
