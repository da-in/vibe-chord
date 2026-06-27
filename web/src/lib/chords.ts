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
};

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
