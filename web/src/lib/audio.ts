import {
  FMSynth,
  MembraneSynth,
  MonoSynth,
  PolySynth,
  getTransport,
  start,
} from 'tone';
import { getChord } from './chords';
import type { TimelineChord } from '../types';

const BEATS_PER_BAR = 4;

let synth: PolySynth<FMSynth> | null = null;
let bassSynth: MonoSynth | null = null;
let kickSynth: MembraneSynth | null = null;
let playing = false;
let playbackGeneration = 0;

function getSynth(): PolySynth<FMSynth> {
  if (!synth) {
    synth = new PolySynth({
      voice: FMSynth,
      maxPolyphony: 8,
      options: {
        harmonicity: 3,
        modulationIndex: 10,
        oscillator: { type: 'sine' },
        envelope: {
          attack: 0.01,
          decay: 0.3,
          sustain: 0.4,
          release: 1.2,
        },
        modulation: { type: 'square' },
        modulationEnvelope: {
          attack: 0.002,
          decay: 0.2,
          sustain: 0,
          release: 0.2,
        },
      },
    }).toDestination();
    synth.volume.value = -8;
  }
  return synth;
}

function getBassSynth(): MonoSynth {
  if (!bassSynth) {
    bassSynth = new MonoSynth({
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.02, decay: 0.2, sustain: 0.6, release: 0.4 },
      filterEnvelope: { attack: 0.01, decay: 0.1, sustain: 0.4, release: 0.2 },
    }).toDestination();
    bassSynth.volume.value = -14;
  }
  return bassSynth;
}

function getKickSynth(): MembraneSynth {
  if (!kickSynth) {
    kickSynth = new MembraneSynth({
      pitchDecay: 0.02,
      octaves: 4,
      envelope: { attack: 0.001, decay: 0.3, sustain: 0, release: 0.1 },
    }).toDestination();
    kickSynth.volume.value = -18;
  }
  return kickSynth;
}

function bassNoteFromChord(chordId: string): string | null {
  const chord = getChord(chordId);
  if (!chord || chord.notes.length === 0) return null;
  const root = chord.notes[0];
  const match = root.match(/^([A-G][#b]?)(\d)$/);
  if (!match) return root;
  const octave = Math.max(1, parseInt(match[2], 10) - 1);
  return `${match[1]}${octave}`;
}

function chordDurationSeconds(
  bpm: number,
  beatsPerChord: number,
  blockBars: number,
): number {
  return ((60 / bpm) * beatsPerChord * blockBars);
}

export async function ensureAudioStarted(): Promise<void> {
  await start();
  getSynth();
}

export function playChord(chordId: string, duration = 1.5): void {
  void ensureAudioStarted().then(() => {
    const chord = getChord(chordId);
    if (!chord) return;
    getSynth().triggerAttackRelease(chord.notes, duration);
  });
}

export function playOneBar(
  chordId: string,
  bpm = 90,
  beatsPerChord: number = BEATS_PER_BAR,
): void {
  const duration = chordDurationSeconds(bpm, beatsPerChord, 1);
  playChord(chordId, duration);
}

export interface PlayChordsOptions {
  withBacking?: boolean;
  beatsPerChord?: number;
}

export async function playChords(
  chordIds: string[],
  bpm = 90,
  onStep?: (index: number) => void,
  options: PlayChordsOptions = {},
): Promise<void> {
  const items: TimelineChord[] = chordIds.map((id) => ({ id, chordId: id }));
  return playTimeline(items, bpm, onStep, options);
}

export async function playTimeline(
  items: TimelineChord[],
  bpm = 90,
  onStep?: (index: number) => void,
  options: PlayChordsOptions = {},
): Promise<void> {
  if (items.length === 0) return;

  await ensureAudioStarted();
  stopPlayback();

  const generation = ++playbackGeneration;
  playing = true;
  const { withBacking = false, beatsPerChord = BEATS_PER_BAR } = options;

  const transport = getTransport();
  transport.bpm.value = bpm;
  transport.stop();
  transport.position = 0;
  transport.cancel();

  const beatDuration = 60 / bpm;
  let cursor = 0;

  items.forEach((item, index) => {
    const blockBars = item.bars ?? 1;
    const duration = chordDurationSeconds(bpm, beatsPerChord, blockBars);
    const barStart = cursor;

    transport.schedule((time) => {
      if (!playing || generation !== playbackGeneration) return;
      onStep?.(index);
      const chord = getChord(item.chordId);
      if (chord) {
        getSynth().triggerAttackRelease(chord.notes, duration * 0.95, time);
      }
    }, barStart);

    if (withBacking) {
      const bassNote = bassNoteFromChord(item.chordId);
      if (bassNote) {
        transport.schedule((time) => {
          if (!playing || generation !== playbackGeneration) return;
          getBassSynth().triggerAttackRelease(bassNote, duration * 0.9, time);
        }, barStart);
      }

      const beatsInBlock = beatsPerChord * blockBars;
      for (let beat = 0; beat < beatsInBlock; beat += 2) {
        transport.schedule((time) => {
          if (!playing || generation !== playbackGeneration) return;
          getKickSynth().triggerAttackRelease('C1', '8n', time);
        }, barStart + beat * beatDuration);
      }
    }

    cursor += duration;
  });

  return new Promise((resolve) => {
    transport.schedule(() => {
      if (generation !== playbackGeneration) return;
      playing = false;
      resolve();
    }, cursor);

    transport.start();
  });
}

export function stopPlayback(): void {
  playbackGeneration += 1;
  playing = false;
  const transport = getTransport();
  transport.stop();
  transport.cancel();
  synth?.releaseAll();
  bassSynth?.triggerRelease();
  kickSynth?.triggerRelease();
}

export function isPlaying(): boolean {
  return playing;
}
