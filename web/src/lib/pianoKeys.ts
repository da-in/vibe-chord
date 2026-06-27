import { noteToMidi, parseNote } from './staffNotes';

export const PIANO_RANGE = {
  startMidi: 53,
  endMidi: 74,
} as const;

const BLACK_SEMITONES = new Set([1, 3, 6, 8, 10]);

const PITCH_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'] as const;

export interface PianoWhiteKey {
  type: 'white';
  midi: number;
  noteName: string;
  whiteIndex: number;
}

export interface PianoBlackKey {
  type: 'black';
  midi: number;
  noteName: string;
  whiteIndex: number;
  leftWhiteIndex: number;
}

export type PianoKey = PianoWhiteKey | PianoBlackKey;

export function midiToNoteName(midi: number): string {
  const pitch = PITCH_NAMES[midi % 12];
  const octave = Math.floor(midi / 12) - 1;
  return `${pitch}${octave}`;
}

export function isBlackMidi(midi: number): boolean {
  return BLACK_SEMITONES.has(midi % 12);
}

export function buildPianoKeys(): PianoKey[] {
  const keys: PianoKey[] = [];
  let whiteIndex = 0;

  for (let midi = PIANO_RANGE.startMidi; midi <= PIANO_RANGE.endMidi; midi += 1) {
    const noteName = midiToNoteName(midi);
    if (isBlackMidi(midi)) {
      keys.push({
        type: 'black',
        midi,
        noteName,
        whiteIndex: -1,
        leftWhiteIndex: whiteIndex - 1,
      });
      continue;
    }

    keys.push({
      type: 'white',
      midi,
      noteName,
      whiteIndex,
    });
    whiteIndex += 1;
  }

  return keys;
}

export function getWhiteKeyCount(): number {
  let count = 0;
  for (let midi = PIANO_RANGE.startMidi; midi <= PIANO_RANGE.endMidi; midi += 1) {
    if (!isBlackMidi(midi)) count += 1;
  }
  return count;
}

export function notesToMidiSet(notes: string[]): Set<number> {
  const set = new Set<number>();
  for (const note of notes) {
    const parsed = parseNote(note);
    if (!parsed) continue;
    set.add(noteToMidi(parsed));
  }
  return set;
}
