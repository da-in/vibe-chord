import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { Mood } from '../types';

const ONBOARDING_KEY = 'vibe-chord-onboarding-done';

export type BeatsPerChord = 2 | 4;
export type MaxChords = 4 | 8;

interface SettingsContextValue {
  bpm: number;
  setBpm: (bpm: number) => void;
  maxChords: MaxChords;
  setMaxChords: (n: MaxChords) => void;
  beatsPerChord: BeatsPerChord;
  setBeatsPerChord: (n: BeatsPerChord) => void;
  showSymbols: boolean;
  setShowSymbols: (v: boolean) => void;
  selectedMood: Mood | null;
  setSelectedMood: (m: Mood | null) => void;
  onboardingComplete: boolean;
  completeOnboarding: () => void;
  skipOnboarding: () => void;
}

const SettingsContext = createContext<SettingsContextValue | null>(null);

function readOnboardingDone(): boolean {
  try {
    return localStorage.getItem(ONBOARDING_KEY) === '1';
  } catch {
    return false;
  }
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [bpm, setBpm] = useState(90);
  const [maxChords, setMaxChords] = useState<MaxChords>(4);
  const [beatsPerChord, setBeatsPerChord] = useState<BeatsPerChord>(4);
  const [showSymbols, setShowSymbols] = useState(false);
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [onboardingComplete, setOnboardingComplete] = useState(readOnboardingDone);

  const markDone = useCallback(() => {
    try {
      localStorage.setItem(ONBOARDING_KEY, '1');
    } catch {
      /* ignore */
    }
    setOnboardingComplete(true);
  }, []);

  const completeOnboarding = markDone;
  const skipOnboarding = markDone;

  const value = useMemo(
    () => ({
      bpm,
      setBpm,
      maxChords,
      setMaxChords,
      beatsPerChord,
      setBeatsPerChord,
      showSymbols,
      setShowSymbols,
      selectedMood,
      setSelectedMood,
      onboardingComplete,
      completeOnboarding,
      skipOnboarding,
    }),
    [
      bpm,
      maxChords,
      beatsPerChord,
      showSymbols,
      selectedMood,
      onboardingComplete,
      completeOnboarding,
      skipOnboarding,
    ],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings(): SettingsContextValue {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}
