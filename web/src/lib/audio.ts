import {
  FMSynth,
  MembraneSynth,
  MonoSynth,
  PolySynth,
  getTransport,
  start,
} from 'tone';
import { getChord } from './chords';

const DEFAULT_BPM = 90;
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

export interface PlayChordsOptions {
  withBacking?: boolean;
}

export async function playChords(
  chordIds: string[],
  bpm = DEFAULT_BPM,
  onStep?: (index: number) => void,
  options: PlayChordsOptions = {},
): Promise<void> {
  if (chordIds.length === 0) return;

  await ensureAudioStarted();
  stopPlayback();

  const generation = ++playbackGeneration;
  playing = true;
  const { withBacking = false } = options;

  const transport = getTransport();
  transport.bpm.value = bpm;
  transport.stop();
  transport.position = 0;
  transport.cancel();

  const barDuration = (60 / bpm) * BEATS_PER_BAR;
  const beatDuration = barDuration / BEATS_PER_BAR;

  chordIds.forEach((chordId, index) => {
    const barStart = index * barDuration;

    transport.schedule((time) => {
      if (!playing || generation !== playbackGeneration) return;
      onStep?.(index);
      const chord = getChord(chordId);
      if (chord) {
        getSynth().triggerAttackRelease(chord.notes, barDuration * 0.95, time);
      }
    }, barStart);

    if (withBacking) {
      const bassNote = bassNoteFromChord(chordId);
      if (bassNote) {
        transport.schedule((time) => {
          if (!playing || generation !== playbackGeneration) return;
          getBassSynth().triggerAttackRelease(bassNote, barDuration * 0.9, time);
        }, barStart);
      }

      transport.schedule((time) => {
        if (!playing || generation !== playbackGeneration) return;
        getKickSynth().triggerAttackRelease('C1', '8n', time);
        getKickSynth().triggerAttackRelease('C1', '8n', time + beatDuration * 2);
      }, barStart);
    }
  });

  return new Promise((resolve) => {
    transport.schedule(() => {
      if (generation !== playbackGeneration) return;
      playing = false;
      resolve();
    }, chordIds.length * barDuration);

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
