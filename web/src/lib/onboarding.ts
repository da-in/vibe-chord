import type { Mood } from '../types';

export const MOOD_OPTIONS: { id: Mood; label: string }[] = [
  { id: 'bright', label: '밝은' },
  { id: 'calm', label: '잔잔한' },
  { id: 'dreamy', label: '몽환적' },
  { id: 'tense', label: '긴장감' },
];

export const MOOD_STARTERS: Record<Mood, string[]> = {
  bright: ['C', 'G', 'F', 'Am'],
  calm: ['Am', 'F', 'Dm', 'C'],
  dreamy: ['Fmaj7', 'Am7', 'Cmaj7', 'Dm7'],
  tense: ['Am', 'E7', 'G7', 'Dm'],
};

export function getStartersForMood(mood: Mood): string[] {
  return MOOD_STARTERS[mood];
}
