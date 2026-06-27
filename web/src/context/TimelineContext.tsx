import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import type { TimelineChord } from '../types';

let idCounter = 0;

export function createTimelineChord(chordId: string): TimelineChord {
  const id =
    typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `tc-${++idCounter}`;
  return { id, chordId };
}

function cloneTimeline(timeline: TimelineChord[]): TimelineChord[] {
  return timeline.map((item) => ({ ...item }));
}

interface TimelineContextValue {
  timeline: TimelineChord[];
  history: TimelineChord[][];
  canUndo: boolean;
  canClearAll: boolean;
  activePresetId: string | null;
  saveHistory: () => void;
  undo: () => void;
  setTimeline: (next: TimelineChord[]) => void;
  appendChord: (chordId: string) => TimelineChord[];
  insertChord: (chordId: string, index: number) => TimelineChord[];
  replaceWithChordIds: (chordIds: string[], presetId?: string) => TimelineChord[];
  replaceChordAt: (index: number, chordId: string) => TimelineChord[];
  reorder: (fromIndex: number, toIndex: number) => TimelineChord[];
  resetToStarter: (chordId: string) => void;
  clearAll: () => void;
}

const TimelineContext = createContext<TimelineContextValue | null>(null);

export function TimelineProvider({ children }: { children: ReactNode }) {
  const [timeline, setTimelineState] = useState<TimelineChord[]>(() => [
    createTimelineChord('C'),
  ]);
  const [history, setHistory] = useState<TimelineChord[][]>([]);
  const [activePresetId, setActivePresetId] = useState<string | null>(null);

  const saveHistory = useCallback(() => {
    setHistory((prev) => [...prev, cloneTimeline(timeline)]);
  }, [timeline]);

  const setTimeline = useCallback((next: TimelineChord[]) => {
    setTimelineState(next);
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
    (chordId: string): TimelineChord[] => {
      const next = [...timeline, createTimelineChord(chordId)];
      setTimelineState(next);
      setActivePresetId(null);
      return next;
    },
    [timeline],
  );

  const insertChord = useCallback(
    (chordId: string, index: number): TimelineChord[] => {
      const next = [...timeline];
      next.splice(index, 0, createTimelineChord(chordId));
      setTimelineState(next);
      setActivePresetId(null);
      return next;
    },
    [timeline],
  );

  const replaceWithChordIds = useCallback(
    (chordIds: string[], presetId?: string): TimelineChord[] => {
      const next = chordIds.map((id) => createTimelineChord(id));
      setTimelineState(next);
      setActivePresetId(presetId ?? null);
      return next;
    },
    [],
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

  const clearAll = useCallback(() => {
    if (timeline.length === 0) return;
    setHistory((prev) => [...prev, cloneTimeline(timeline)]);
    setTimelineState([]);
    setActivePresetId(null);
  }, [timeline]);

  const value = useMemo(
    () => ({
      timeline,
      history,
      canUndo: history.length > 0,
      canClearAll: timeline.length > 0,
      activePresetId,
      saveHistory,
      undo,
      setTimeline,
      appendChord,
      insertChord,
      replaceWithChordIds,
      replaceChordAt,
      reorder,
      resetToStarter,
      clearAll,
    }),
    [
      timeline,
      history,
      activePresetId,
      saveHistory,
      undo,
      setTimeline,
      appendChord,
      insertChord,
      replaceWithChordIds,
      replaceChordAt,
      reorder,
      resetToStarter,
      clearAll,
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
