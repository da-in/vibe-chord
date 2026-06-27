import type { ChordDef, Mood } from '../types';

export const CHORDS: Record<string, ChordDef> = {
  C: {
    id: 'C',
    symbol: 'C',
    label: '밝은',
    mood: 'bright',
    notes: ['C4', 'E4', 'G4'],
  },
  Am: {
    id: 'Am',
    symbol: 'Am',
    label: '잔잔한',
    mood: 'calm',
    notes: ['A3', 'C4', 'E4'],
  },
  F: {
    id: 'F',
    symbol: 'F',
    label: '따뜻한',
    mood: 'calm',
    notes: ['F3', 'A3', 'C4'],
  },
  G: {
    id: 'G',
    symbol: 'G',
    label: '경쾌한',
    mood: 'bright',
    notes: ['G3', 'B3', 'D4'],
  },
  Dm: {
    id: 'Dm',
    symbol: 'Dm',
    label: '쓸쓸한',
    mood: 'calm',
    notes: ['D4', 'F4', 'A4'],
  },
  Em: {
    id: 'Em',
    symbol: 'Em',
    label: '섬세한',
    mood: 'calm',
    notes: ['E4', 'G4', 'B4'],
  },
  G7: {
    id: 'G7',
    symbol: 'G7',
    label: '긴장감',
    mood: 'tense',
    notes: ['G3', 'B3', 'D4', 'F4'],
  },
  Fmaj7: {
    id: 'Fmaj7',
    symbol: 'Fmaj7',
    label: '몽환적',
    mood: 'dreamy',
    notes: ['F3', 'A3', 'C4', 'E4'],
  },
  Am7: {
    id: 'Am7',
    symbol: 'Am7',
    label: '부드러운',
    mood: 'dreamy',
    notes: ['A3', 'C4', 'E4', 'G4'],
  },
  Dm7: {
    id: 'Dm7',
    symbol: 'Dm7',
    label: '그윽한',
    mood: 'dreamy',
    notes: ['D4', 'F4', 'A4', 'C5'],
  },
  E7: {
    id: 'E7',
    symbol: 'E7',
    label: '밀어붙이는',
    mood: 'tense',
    notes: ['E4', 'G#4', 'B4', 'D5'],
  },
  Bdim: {
    id: 'Bdim',
    symbol: 'Bdim',
    label: '불안한',
    mood: 'tense',
    notes: ['B3', 'D4', 'F4'],
  },
  Cmaj7: {
    id: 'Cmaj7',
    symbol: 'Cmaj7',
    label: '포근한',
    mood: 'dreamy',
    notes: ['C4', 'E4', 'G4', 'B4'],
  },
  Em7: {
    id: 'Em7',
    symbol: 'Em7',
    label: '은은한',
    mood: 'dreamy',
    notes: ['E4', 'G4', 'B4', 'D5'],
  },
  Csus2: {
    id: 'Csus2',
    symbol: 'Csus2',
    label: '맑은',
    mood: 'bright',
    notes: ['C4', 'D4', 'G4'],
  },
  Csus4: {
    id: 'Csus4',
    symbol: 'Csus4',
    label: '대기하는',
    mood: 'tense',
    notes: ['C4', 'F4', 'G4'],
  },
  C6: {
    id: 'C6',
    symbol: 'C6',
    label: '가벼운',
    mood: 'bright',
    notes: ['C4', 'E4', 'G4', 'A4'],
  },
  Dm6: {
    id: 'Dm6',
    symbol: 'Dm6',
    label: '그리운',
    mood: 'calm',
    notes: ['D4', 'F4', 'A4', 'B4'],
  },
  Em6: {
    id: 'Em6',
    symbol: 'Em6',
    label: '섬세한',
    mood: 'calm',
    notes: ['E4', 'G4', 'B4', 'C5'],
  },
  F6: {
    id: 'F6',
    symbol: 'F6',
    label: '따스한',
    mood: 'calm',
    notes: ['F3', 'A3', 'C4', 'D4'],
  },
  G6: {
    id: 'G6',
    symbol: 'G6',
    label: '통통한',
    mood: 'bright',
    notes: ['G3', 'B3', 'D4', 'E4'],
  },
  Am6: {
    id: 'Am6',
    symbol: 'Am6',
    label: '애잔한',
    mood: 'calm',
    notes: ['A3', 'C4', 'E4', 'F4'],
  },
  Bm7b5: {
    id: 'Bm7b5',
    symbol: 'Bm7♭5',
    label: '긴장된',
    mood: 'tense',
    notes: ['B3', 'D4', 'F4', 'A4'],
  },
  Gsus4: {
    id: 'Gsus4',
    symbol: 'Gsus4',
    label: '기대하는',
    mood: 'tense',
    notes: ['G3', 'C4', 'D4'],
  },
};

/** 24 diatonic chords for /explore grid (F-14) */
export const DIATONIC_GRID_IDS = [
  'C', 'Cmaj7', 'Csus2', 'Csus4',
  'Dm', 'Dm7', 'Dm6',
  'Em', 'Em7', 'Em6',
  'F', 'Fmaj7', 'F6',
  'G', 'G7', 'G6', 'Gsus4',
  'Am', 'Am7', 'Am6',
  'Bdim', 'Bm7b5', 'E7', 'C6',
] as const;

const MOOD_COLORS: Record<Mood, string> = {
  bright: '#FFD166',
  calm: '#7EB8DA',
  dreamy: '#C4A1FF',
  tense: '#FF6B6B',
};

export function getChord(id: string): ChordDef | undefined {
  return CHORDS[id];
}

export function getChordColor(mood: Mood): string {
  return MOOD_COLORS[mood];
}
