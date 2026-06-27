import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CompletionBadge } from '../components/CompletionBadge';
import { ConnectionHint } from '../components/ConnectionHint';
import { NaturalLanguageBar } from '../components/NaturalLanguageBar';
import { PlaybackControls } from '../components/PlaybackControls';
import { RecommendationPanel } from '../components/RecommendationPanel';
import { SectionFeedback } from '../components/SectionFeedback';
import { StudioSettings } from '../components/StudioSettings';
import { Timeline } from '../components/Timeline';
import { useSettings } from '../context/SettingsContext';
import { useTimeline } from '../context/TimelineContext';
import {
  ensureAudioStarted,
  playChord,
  playOneBar,
  playTimeline,
  stopPlayback,
} from '../lib/audio';
import { getRecommendations } from '../lib/harmony';

export default function StudioPage() {
  const { bpm, beatsPerChord, showSymbols } = useSettings();
  const {
    timeline,
    maxChords,
    canUndo,
    saveHistory,
    undo,
    appendChord,
    insertChord,
    reorder,
    updateBlockBars,
  } = useTimeline();

  const [selectedInsertIndex, setSelectedInsertIndex] = useState<number | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [showCompletionBadge, setShowCompletionBadge] = useState(false);

  const lastChordId = timeline[timeline.length - 1]?.chordId ?? null;
  const chordIds = useMemo(
    () => timeline.map((item) => item.chordId),
    [timeline],
  );
  const recommendations = useMemo(
    () => getRecommendations(lastChordId, timeline.length),
    [lastChordId, timeline.length],
  );

  useEffect(() => {
    setShowCompletionBadge(timeline.length === maxChords);
  }, [timeline.length, maxChords]);

  const playbackOptions = useMemo(
    () => ({ withBacking: true, beatsPerChord }),
    [beatsPerChord],
  );

  const playWithHighlight = useCallback(async () => {
    setIsPlaying(true);
    try {
      await playTimeline(timeline, bpm, (index) => setPlayingIndex(index), playbackOptions);
    } finally {
      setIsPlaying(false);
      setPlayingIndex(null);
    }
  }, [timeline, bpm, playbackOptions]);

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
    await playWithHighlight();
  }, [timeline.length, playWithHighlight]);

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
      setIsPlaying(true);
      try {
        await playTimeline(next, bpm, (index) => setPlayingIndex(index), playbackOptions);
      } finally {
        setIsPlaying(false);
        setPlayingIndex(null);
      }
    },
    [saveHistory, reorder, bpm, playbackOptions],
  );

  const handleDropChord = useCallback(
    async (chordId: string, index: number) => {
      if (timeline.length >= maxChords && selectedInsertIndex === null) return;

      await ensureAudioStarted();
      saveHistory();

      const nextTimeline =
        selectedInsertIndex !== null
          ? insertChord(chordId, selectedInsertIndex)
          : insertChord(chordId, index);

      if (!nextTimeline) return;

      setSelectedInsertIndex(null);
      playOneBar(chordId, bpm, beatsPerChord);
    },
    [
      timeline.length,
      maxChords,
      selectedInsertIndex,
      saveHistory,
      insertChord,
      bpm,
      beatsPerChord,
    ],
  );

  const handleSelectRecommendation = useCallback(
    async (chordId: string) => {
      if (timeline.length >= maxChords && selectedInsertIndex === null) return;

      await ensureAudioStarted();
      saveHistory();

      const nextTimeline =
        selectedInsertIndex !== null
          ? insertChord(chordId, selectedInsertIndex)
          : appendChord(chordId);

      if (!nextTimeline) return;

      setSelectedInsertIndex(null);

      const previewItems = nextTimeline.slice(-2);
      await playTimeline(previewItems, bpm, undefined, {
        withBacking: false,
        beatsPerChord,
      });

      if (nextTimeline.length === maxChords) {
        setShowCompletionBadge(true);
        await playWithHighlight();
      }
    },
    [
      timeline.length,
      maxChords,
      selectedInsertIndex,
      saveHistory,
      insertChord,
      appendChord,
      bpm,
      beatsPerChord,
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
          <Link to="/share" className="studio-header__share">
            데모 공유
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
        <NaturalLanguageBar />
        <StudioSettings />

        <section className="studio-timeline-section" aria-label="코드 타임라인">
          <h2 className="studio-section-title">타임라인</h2>
          {selectedInsertIndex !== null && (
            <p className="studio-insert-hint" role="status">
              {selectedInsertIndex + 1}번째 위치에 넣을 코드를 고르세요
            </p>
          )}
          <ConnectionHint chordIds={chordIds} />
          <p className="studio-drag-hint">
            블록 드래그로 순서 변경 · + 에 카드 끌어 놓기 · 블록의 「N마디」 탭으로 길이 조절
          </p>
          <Timeline
            timeline={timeline}
            selectedIndex={selectedInsertIndex}
            playingIndex={playingIndex}
            showSymbols={showSymbols}
            onBlockClick={(index, chordId) => void handleBlockClick(index, chordId)}
            onInsertClick={handleInsertClick}
            onReorder={(from, to) => void handleReorder(from, to)}
            onDropChord={(id, idx) => void handleDropChord(id, idx)}
            onBlockBarsChange={(index, bars) => {
              saveHistory();
              updateBlockBars(index, bars);
            }}
          />
        </section>

        {timeline.length >= maxChords && selectedInsertIndex === null ? (
          <>
            <SectionFeedback visible />
            <section className="recommendation-panel recommendation-panel--complete">
              <h2 className="recommendation-panel__title">{maxChords}코드 완성</h2>
              <p className="recommendation-panel__empty">
                ▶ Play로 전체 진행을 들어보세요. 설정에서 마디 수를 8코드로 늘릴 수도 있어요.
              </p>
            </section>
          </>
        ) : (
          <RecommendationPanel
            recommendations={recommendations}
            showSymbols={showSymbols}
            onPreview={(chordId) => void handlePreview(chordId)}
            onSelect={(chordId) => void handleSelectRecommendation(chordId)}
          />
        )}
      </main>

      <CompletionBadge
        visible={showCompletionBadge}
        message={`🎉 ${maxChords}코드 완성!`}
      />
    </div>
  );
}
