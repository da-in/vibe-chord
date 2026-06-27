import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { TimelineChord } from '../types';
import { useSettings } from './SettingsContext';

let idCounter = 0;

export function createTimelineChord(chordId: string, bars: 1 | 2 = 1): TimelineChord {
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `tc-${++idCounter}`;
  return { id, chordId, bars };
}

function cloneTimeline(timeline: TimelineChord[]): TimelineChord[] {
  return timeline.map((item) => ({ ...item }));
}

interface TimelineContextValue {
  timeline: TimelineChord[];
  history: TimelineChord[][];
  canUndo: boolean;
  isFull: boolean;
  maxChords: number;
  activePresetId: string | null;
  saveHistory: () => void;
  undo: () => void;
  setTimeline: (next: TimelineChord[]) => void;
  appendChord: (chordId: string) => TimelineChord[] | null;
  insertChord: (chordId: string, index: number) => TimelineChord[] | null;
  replaceWithChordIds: (chordIds: string[], presetId?: string) => TimelineChord[];
  replaceChordAt: (index: number, chordId: string) => TimelineChord[];
  updateBlockBars: (index: number, bars: 1 | 2) => void;
  reorder: (fromIndex: number, toIndex: number) => TimelineChord[];
  resetToStarter: (chordId: string) => void;
}

const TimelineContext = createContext<TimelineContextValue | null>(null);

export function TimelineProvider({ children }: { children: ReactNode }) {
  const { maxChords } = useSettings();
  const [timeline, setTimelineState] = useState<TimelineChord[]>(() => [
    createTimelineChord('C'),
  ]);
  const [history, setHistory] = useState<TimelineChord[][]>([]);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const saveHistory = useCallback(() => {
    setHistory((prev) => [...prev, cloneTimeline(timeline)]);
  }, [timeline]);

  const setTimeline = useCallback(
    (next: TimelineChord[]) => {
      setTimelineState(next.slice(0, maxChords));
    },
    [maxChords],
  );

  const undo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const previous = prev[prev.length - 1];
      setTimelineState(previous);
      return prev.slice(0, -1);
    });
  }, []);

  const appendChord = useCallback(
    (chordId: string): TimelineChord[] | null => {
      if (timeline.length >= maxChords) return null;
      const next = [...timeline, createTimelineChord(chordId)];
      setTimelineState(next);
      setActivePresetId(null);
      return next;
    },
    [timeline, maxChords],
  );

  const insertChord = useCallback(
    (chordId: string, index: number): TimelineChord[] | null => {
      const next = [...timeline];
      next.splice(index, 0, createTimelineChord(chordId));
      const trimmed = next.slice(0, maxChords);
      setTimelineState(trimmed);
      setActivePresetId(null);
      return trimmed;
    },
    [timeline, maxChords],
  );

  const replaceWithChordIds = useCallback(
    (chordIds: string[], presetId?: string): TimelineChord[] => {
      const next = chordIds.slice(0, maxChords).map((id) => createTimelineChord(id));
      setTimelineState(next);
      setActivePresetId(presetId ?? null);
      return next;
    },
    [maxChords],
  );

  const replaceChordAt = useCallback(
    (index: number, chordId: string): TimelineChord[] => {
      const next = timeline.map((item, i) =>
        i === index ? { ...item, chordId } : item,
      );
      setTimelineState(next);
      setActivePresetId(null);
      return next;
    },
    [timeline],
  );

  const updateBlockBars = useCallback((index: number, bars: 1 | 2) => {
    setTimelineState((prev) =>
      prev.map((item, i) => (i === index ? { ...item, bars } : item)),
    );
  }, []);

  const reorder = useCallback(
    (fromIndex: number, toIndex: number): TimelineChord[] => {
      if (fromIndex === toIndex) return timeline;
      const next = [...timeline];
      const [moved] = next.splice(fromIndex, 1);
      next.splice(toIndex, 0, moved);
      setTimelineState(next);
      return next;
    },
    [timeline],
  );

  const resetToStarter = useCallback((chordId: string) => {
    setTimelineState([createTimelineChord(chordId)]);
    setHistory([]);
    setActivePresetId(null);
  }, []);

  const value = useMemo(
    () => ({
      timeline,
      history,
      canUndo: history.length > 0,
      isFull: timeline.length >= maxChords,
      maxChords,
      activePresetId,
      saveHistory,
      undo,
      setTimeline,
      appendChord,
      insertChord,
      replaceWithChordIds,
      replaceChordAt,
      updateBlockBars,
      reorder,
      resetToStarter,
    }),
    [
      timeline,
      history,
      maxChords,
      activePresetId,
      saveHistory,
      undo,
      setTimeline,
      appendChord,
      insertChord,
      replaceWithChordIds,
      replaceChordAt,
      updateBlockBars,
      reorder,
      resetToStarter,
    ],
  );

  return (
    <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>
  );
}

export function useTimeline(): TimelineContextValue {
  const ctx = useContext(TimelineContext);
  if (!ctx) throw new Error('useTimeline must be used within TimelineProvider');
  return ctx;
}
