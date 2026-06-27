import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { TimelineChord } from '../types';

export const MAX_CHORDS = 4;

let idCounter = 0;

export function createTimelineChord(chordId: string): TimelineChord {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return { id: crypto.randomUUID(), chordId };
  }
  idCounter += 1;
  return { id: `tc-${idCounter}`, chordId };
}

function cloneTimeline(timeline: TimelineChord[]): TimelineChord[] {
  return timeline.map((item) => ({ ...item }));
}

interface TimelineContextValue {
  timeline: TimelineChord[];
  history: TimelineChord[][];
  canUndo: boolean;
  isFull: boolean;
  saveHistory: () => void;
  undo: () => void;
  setTimeline: (next: TimelineChord[]) => void;
  appendChord: (chordId: string) => TimelineChord[] | null;
  insertChord: (chordId: string, index: number) => TimelineChord[] | null;
  replaceWithChordIds: (chordIds: string[]) => TimelineChord[];
  reorder: (fromIndex: number, toIndex: number) => TimelineChord[];
}

const TimelineContext = createContext<TimelineContextValue | null>(null);

export function TimelineProvider({ children }: { children: ReactNode }) {
  const [timeline, setTimelineState] = useState<TimelineChord[]>(() => [
    createTimelineChord('C'),
  ]);
  const [history, setHistory] = useState<TimelineChord[][]>([]);

  const saveHistory = useCallback(() => {
    setHistory((prev) => [...prev, cloneTimeline(timeline)]);
  }, [timeline]);

  const setTimeline = useCallback((next: TimelineChord[]) => {
    setTimelineState(next.slice(0, MAX_CHORDS));
  }, []);

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
      if (timeline.length >= MAX_CHORDS) return null;
      const next = [...timeline, createTimelineChord(chordId)];
      setTimelineState(next);
      return next;
    },
    [timeline],
  );

  const insertChord = useCallback(
    (chordId: string, index: number): TimelineChord[] | null => {
      const next = [...timeline];
      next.splice(index, 0, createTimelineChord(chordId));
      const trimmed = next.slice(0, MAX_CHORDS);
      setTimelineState(trimmed);
      return trimmed;
    },
    [timeline],
  );

  const replaceWithChordIds = useCallback((chordIds: string[]): TimelineChord[] => {
    const next = chordIds.slice(0, MAX_CHORDS).map((id) => createTimelineChord(id));
    setTimelineState(next);
    return next;
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

  const value = useMemo(
    () => ({
      timeline,
      history,
      canUndo: history.length > 0,
      isFull: timeline.length >= MAX_CHORDS,
      saveHistory,
      undo,
      setTimeline,
      appendChord,
      insertChord,
      replaceWithChordIds,
      reorder,
    }),
    [
      timeline,
      history,
      saveHistory,
      undo,
      setTimeline,
      appendChord,
      insertChord,
      replaceWithChordIds,
      reorder,
    ],
  );

  return (
    <TimelineContext.Provider value={value}>{children}</TimelineContext.Provider>
  );
}

export function useTimeline(): TimelineContextValue {
  const ctx = useContext(TimelineContext);
  if (!ctx) {
    throw new Error('useTimeline must be used within TimelineProvider');
  }
  return ctx;
}
