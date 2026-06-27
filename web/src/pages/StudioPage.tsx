import { useCallback, useMemo, useState } from 'react';
import { CompletionBadge } from '../components/CompletionBadge';
import { PlaybackControls } from '../components/PlaybackControls';
import { RecommendationPanel } from '../components/RecommendationPanel';
import { Timeline } from '../components/Timeline';
import {
  ensureAudioStarted,
  playChord,
  playChords,
  stopPlayback,
} from '../lib/audio';
import { getRecommendations } from '../lib/harmony';
import type { TimelineChord } from '../types';

let idCounter = 0;

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  idCounter += 1;
  return `tc-${idCounter}`;
}

function createTimelineChord(chordId: string): TimelineChord {
  return { id: createId(), chordId };
}

const MAX_CHORDS = 4;

export default function StudioPage() {
  const [timeline, setTimeline] = useState<TimelineChord[]>(() => [
    createTimelineChord('C'),
  ]);
  const [history, setHistory] = useState<TimelineChord[][]>([]);
  const [selectedInsertIndex, setSelectedInsertIndex] = useState<number | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [showCompletionBadge, setShowCompletionBadge] = useState(false);

  const lastChordId = timeline[timeline.length - 1]?.chordId ?? null;
  const recommendations = useMemo(
    () => getRecommendations(lastChordId, timeline.length),
    [lastChordId, timeline.length],
  );

  const saveHistory = useCallback((snapshot: TimelineChord[]) => {
    setHistory((prev) => [...prev, snapshot.map((item) => ({ ...item }))]);
  }, []);

  const handleBlockClick = useCallback(async (_index: number, chordId: string) => {
    await ensureAudioStarted();
    playChord(chordId);
  }, []);

  const handlePreview = useCallback(async (chordId: string) => {
    await ensureAudioStarted();
    playChord(chordId);
  }, []);

  const handleInsertClick = useCallback((index: number) => {
    setSelectedInsertIndex(index);
  }, []);

  const handlePlay = useCallback(async () => {
    if (timeline.length === 0) return;

    await ensureAudioStarted();
    stopPlayback();
    setIsPlaying(true);
    setPlayingIndex(null);

    try {
      await playChords(
        timeline.map((item) => item.chordId),
        90,
        (index) => setPlayingIndex(index),
      );
    } finally {
      setIsPlaying(false);
      setPlayingIndex(null);
    }
  }, [timeline]);

  const handleStop = useCallback(() => {
    stopPlayback();
    setIsPlaying(false);
    setPlayingIndex(null);
  }, []);

  const handleUndo = useCallback(() => {
    setHistory((prev) => {
      if (prev.length === 0) return prev;
      const previous = prev[prev.length - 1];
      setTimeline(previous);
      setShowCompletionBadge(previous.length === MAX_CHORDS);
      setSelectedInsertIndex(null);
      return prev.slice(0, -1);
    });
  }, []);

  const handleSelectRecommendation = useCallback(
    async (chordId: string) => {
      if (timeline.length >= MAX_CHORDS && selectedInsertIndex === null) {
        return;
      }

      await ensureAudioStarted();
      saveHistory(timeline);

      const newEntry = createTimelineChord(chordId);
      let nextTimeline: TimelineChord[];

      if (selectedInsertIndex !== null) {
        nextTimeline = [...timeline];
        nextTimeline.splice(selectedInsertIndex, 0, newEntry);
      } else {
        nextTimeline = [...timeline, newEntry];
      }

      if (nextTimeline.length > MAX_CHORDS) {
        nextTimeline = nextTimeline.slice(0, MAX_CHORDS);
      }

      setTimeline(nextTimeline);
      setSelectedInsertIndex(null);

      const previewIds = nextTimeline.slice(-2).map((item) => item.chordId);
      await playChords(previewIds);

      if (nextTimeline.length === MAX_CHORDS) {
        setShowCompletionBadge(true);
        setIsPlaying(true);
        try {
          await playChords(
            nextTimeline.map((item) => item.chordId),
            90,
            (index) => setPlayingIndex(index),
          );
        } finally {
          setIsPlaying(false);
          setPlayingIndex(null);
        }
      }
    },
    [timeline, selectedInsertIndex, saveHistory],
  );

  return (
    <div className="studio-page">
      <header className="studio-header">
        <div className="studio-header__brand">
          <h1 className="studio-header__title">vibe-chord</h1>
          <p className="studio-header__subtitle">듣고 고르는 작곡 놀이터</p>
        </div>
        <PlaybackControls
          isPlaying={isPlaying}
          onPlay={() => void handlePlay()}
          onStop={handleStop}
          onUndo={handleUndo}
          canUndo={history.length > 0}
        />
      </header>

      <main className="studio-main">
        <section className="studio-timeline-section" aria-label="코드 타임라인">
          <h2 className="studio-section-title">타임라인</h2>
          {selectedInsertIndex !== null && (
            <p className="studio-insert-hint" role="status">
              {selectedInsertIndex + 1}번째 위치에 넣을 코드를 고르세요
            </p>
          )}
          <Timeline
            timeline={timeline}
            selectedIndex={selectedInsertIndex}
            playingIndex={playingIndex}
            onBlockClick={(index, chordId) => void handleBlockClick(index, chordId)}
            onInsertClick={handleInsertClick}
          />
        </section>

        {timeline.length >= MAX_CHORDS && selectedInsertIndex === null ? (
          <section className="recommendation-panel recommendation-panel--complete">
            <h2 className="recommendation-panel__title">4마디 완성</h2>
            <p className="recommendation-panel__empty">
              ▶ Play로 전체 진행을 들어보세요. 블록 사이 + 로 끼워 넣을 수도 있어요.
            </p>
          </section>
        ) : (
          <RecommendationPanel
            recommendations={recommendations}
            onPreview={(chordId) => void handlePreview(chordId)}
            onSelect={(chordId) => void handleSelectRecommendation(chordId)}
          />
        )}
      </main>

      <CompletionBadge visible={showCompletionBadge} />
    </div>
  );
}
