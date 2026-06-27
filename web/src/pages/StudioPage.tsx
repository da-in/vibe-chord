import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CompletionBadge } from '../components/CompletionBadge';
import { PlaybackControls } from '../components/PlaybackControls';
import { RecommendationPanel } from '../components/RecommendationPanel';
import { Timeline } from '../components/Timeline';
import { MAX_CHORDS, useTimeline } from '../context/TimelineContext';
import {
  ensureAudioStarted,
  playChord,
  playChords,
  stopPlayback,
} from '../lib/audio';
import { getRecommendations } from '../lib/harmony';

export default function StudioPage() {
  const {
    timeline,
    canUndo,
    saveHistory,
    undo,
    appendChord,
    insertChord,
    reorder,
  } = useTimeline();

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

  useEffect(() => {
    setShowCompletionBadge(timeline.length === MAX_CHORDS);
  }, [timeline.length]);

  const playWithHighlight = useCallback(async (chordIds: string[]) => {
    setIsPlaying(true);
    try {
      await playChords(
        chordIds,
        90,
        (index) => setPlayingIndex(index),
        { withBacking: true },
      );
    } finally {
      setIsPlaying(false);
      setPlayingIndex(null);
    }
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
    await playWithHighlight(timeline.map((item) => item.chordId));
  }, [timeline, playWithHighlight]);

  const handleStop = useCallback(() => {
    stopPlayback();
    setIsPlaying(false);
    setPlayingIndex(null);
  }, []);

  const handleUndo = useCallback(() => {
    undo();
    setSelectedInsertIndex(null);
  }, [undo]);

  const handleReorder = useCallback(
    async (fromIndex: number, toIndex: number) => {
      await ensureAudioStarted();
      saveHistory();
      const next = reorder(fromIndex, toIndex);
      setSelectedInsertIndex(null);
      await playWithHighlight(next.map((item) => item.chordId));
    },
    [saveHistory, reorder, playWithHighlight],
  );

  const handleSelectRecommendation = useCallback(
    async (chordId: string) => {
      if (timeline.length >= MAX_CHORDS && selectedInsertIndex === null) {
        return;
      }

      await ensureAudioStarted();
      saveHistory();

      const nextTimeline =
        selectedInsertIndex !== null
          ? insertChord(chordId, selectedInsertIndex)
          : appendChord(chordId);

      if (!nextTimeline) return;

      setSelectedInsertIndex(null);

      const previewIds = nextTimeline.slice(-2).map((item) => item.chordId);
      await playChords(previewIds, 90, undefined, { withBacking: false });

      if (nextTimeline.length === MAX_CHORDS) {
        setShowCompletionBadge(true);
        await playWithHighlight(nextTimeline.map((item) => item.chordId));
      }
    },
    [
      timeline.length,
      selectedInsertIndex,
      saveHistory,
      insertChord,
      appendChord,
      playWithHighlight,
    ],
  );

  return (
    <div className="studio-page">
      <header className="studio-header">
        <div className="studio-header__brand">
          <h1 className="studio-header__title">vibe-chord</h1>
          <p className="studio-header__subtitle">듣고 고르는 작곡 놀이터</p>
        </div>
        <div className="studio-header__actions">
          <Link to="/explore" className="studio-header__explore">
            전체 코드 열기
          </Link>
          <PlaybackControls
            isPlaying={isPlaying}
            onPlay={() => void handlePlay()}
            onStop={handleStop}
            onUndo={handleUndo}
            canUndo={canUndo}
          />
        </div>
      </header>

      <main className="studio-main">
        <section className="studio-timeline-section" aria-label="코드 타임라인">
          <h2 className="studio-section-title">타임라인</h2>
          {selectedInsertIndex !== null && (
            <p className="studio-insert-hint" role="status">
              {selectedInsertIndex + 1}번째 위치에 넣을 코드를 고르세요
            </p>
          )}
          <p className="studio-drag-hint">블록을 드래그하면 순서를 바꿀 수 있어요</p>
          <Timeline
            timeline={timeline}
            selectedIndex={selectedInsertIndex}
            playingIndex={playingIndex}
            onBlockClick={(index, chordId) => void handleBlockClick(index, chordId)}
            onInsertClick={handleInsertClick}
            onReorder={(from, to) => void handleReorder(from, to)}
          />
        </section>

        {timeline.length >= MAX_CHORDS && selectedInsertIndex === null ? (
          <section className="recommendation-panel recommendation-panel--complete">
            <h2 className="recommendation-panel__title">4마디 완성</h2>
            <p className="recommendation-panel__empty">
              ▶ Play로 전체 진행을 들어보세요. 블록 사이 + 로 끼워 넣거나 드래그로 순서를 바꿀 수
              있어요.
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
