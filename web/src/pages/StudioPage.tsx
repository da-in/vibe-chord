import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChordPickerPanel } from '../components/ChordPickerPanel';
import type { ChordPickerMode } from '../components/ChordPickerPanel';
import { ConnectionHint } from '../components/ConnectionHint';
import { PlaybackControls } from '../components/PlaybackControls';
import { StudioSettings } from '../components/StudioSettings';
import { Timeline } from '../components/Timeline';
import { useSettings } from '../context/SettingsContext';
import { useTimeline } from '../context/TimelineContext';
import {
  ensureAudioStarted,
  playChord,
  playChords,
  playTimeline,
  stopPlayback,
} from '../lib/audio';
import { getRecommendations } from '../lib/harmony';
import { getChord } from '../lib/chords';
import { getPreset } from '../lib/presets';

function defaultInsertIndex(timelineLength: number): number {
  return timelineLength === 0 ? 0 : timelineLength;
}

export default function StudioPage() {
  const { bpm, beatsPerChord, showSymbols } = useSettings();
  const {
    timeline,
    canUndo,
    canClearAll,
    saveHistory,
    undo,
    clearAll,
    insertChord,
    replaceChordAt,
    replaceWithChordIds,
    reorder,
  } = useTimeline();

  const [selectedInsertIndex, setSelectedInsertIndex] = useState<number | null>(
    null,
  );
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playingIndex, setPlayingIndex] = useState<number | null>(null);
  const [pianoNotes, setPianoNotes] = useState<string[]>([]);
  const [pianoLabel, setPianoLabel] = useState<string | null>(null);

  const clearPiano = useCallback(() => {
    setPianoNotes([]);
    setPianoLabel(null);
  }, []);

  const showChordOnPiano = useCallback((chordId: string) => {
    const chord = getChord(chordId);
    if (!chord) return;
    setPianoNotes(chord.notes);
    setPianoLabel(chord.symbol);
  }, []);

  useEffect(() => {
    if (replaceIndex !== null) return;
    setSelectedInsertIndex(defaultInsertIndex(timeline.length));
  }, [timeline.length, replaceIndex]);

  const lastChordId = timeline[timeline.length - 1]?.chordId ?? null;
  const chordIds = useMemo(
    () => timeline.map((item) => item.chordId),
    [timeline],
  );
  const recommendations = useMemo(
    () => getRecommendations(lastChordId, timeline.length),
    [lastChordId, timeline.length],
  );
  const pickerMode = useMemo((): ChordPickerMode => {
    if (replaceIndex !== null) return 'replace';
    if (selectedInsertIndex !== null) return 'insert';
    return 'append';
  }, [replaceIndex, selectedInsertIndex]);

  const playbackOptions = useMemo(
    () => ({ withBacking: true, beatsPerChord }),
    [beatsPerChord],
  );

  const playWithHighlight = useCallback(
    async (items = timeline) => {
      setIsPlaying(true);
      try {
        await playTimeline(
          items,
          bpm,
          (index) => {
            setPlayingIndex(index);
            const block = items[index];
            if (block) showChordOnPiano(block.chordId);
          },
          playbackOptions,
        );
      } finally {
        setIsPlaying(false);
        setPlayingIndex(null);
      }
    },
    [timeline, bpm, playbackOptions, showChordOnPiano],
  );

  const handleBlockClick = useCallback(async (index: number, chordId: string) => {
    await ensureAudioStarted();
    playChord(chordId);
    showChordOnPiano(chordId);

    setReplaceIndex(index);
    setSelectedInsertIndex(null);
  }, [showChordOnPiano]);

  const handlePreview = useCallback(async (chordId: string) => {
    await ensureAudioStarted();
    playChord(chordId);
    showChordOnPiano(chordId);
  }, [showChordOnPiano]);

  const handleInsertClick = useCallback(() => {
    setReplaceIndex(null);
    setSelectedInsertIndex(defaultInsertIndex(timeline.length));
  }, [timeline.length]);

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
    clearPiano();
  }, [clearPiano]);

  const handleUndo = useCallback(() => {
    undo();
    setReplaceIndex(null);
  }, [undo]);

  const handleClearAll = useCallback(() => {
    stopPlayback();
    setIsPlaying(false);
    setPlayingIndex(null);
    clearAll();
    setReplaceIndex(null);
    clearPiano();
  }, [clearAll, clearPiano]);

  const handleReorder = useCallback(
    async (fromIndex: number, toIndex: number) => {
      await ensureAudioStarted();
      saveHistory();
      const next = reorder(fromIndex, toIndex);
      setReplaceIndex(null);
      setIsPlaying(true);
      try {
        await playTimeline(
          next,
          bpm,
          (index) => {
            setPlayingIndex(index);
            const block = next[index];
            if (block) showChordOnPiano(block.chordId);
          },
          playbackOptions,
        );
      } finally {
        setIsPlaying(false);
        setPlayingIndex(null);
      }
    },
    [saveHistory, reorder, bpm, playbackOptions, showChordOnPiano],
  );

  const handleDropChord = useCallback(
    (chordId: string, _index: number) => {
      if (replaceIndex !== null) return;

      saveHistory();

      const targetIndex = selectedInsertIndex ?? defaultInsertIndex(timeline.length);
      insertChord(chordId, targetIndex);
    },
    [replaceIndex, selectedInsertIndex, saveHistory, insertChord, timeline.length],
  );

  const handleAddChord = useCallback(
    (chordId: string) => {
      if (replaceIndex !== null) {
        saveHistory();
        replaceChordAt(replaceIndex, chordId);
        setReplaceIndex(null);
        return;
      }

      saveHistory();
      const insertAt = selectedInsertIndex ?? defaultInsertIndex(timeline.length);
      insertChord(chordId, insertAt);
    },
    [
      replaceIndex,
      selectedInsertIndex,
      timeline.length,
      saveHistory,
      replaceChordAt,
      insertChord,
    ],
  );

  const handleSelectPreset = useCallback(
    async (presetId: string) => {
      const preset = getPreset(presetId);
      if (!preset) return;

      if (
        !window.confirm(
          `현재 타임라인을 「${preset.name}」 진행으로 바꿉니다.`,
        )
      ) {
        return;
      }

      await ensureAudioStarted();
      saveHistory();
      const next = replaceWithChordIds(preset.chordIds, presetId);
      const previewIds = next
        .slice(0, Math.min(2, next.length))
        .map((c) => c.chordId);
      if (previewIds.length > 0) {
        await playChords(previewIds, bpm);
      }
      setReplaceIndex(null);
    },
    [saveHistory, replaceWithChordIds, bpm],
  );

  return (
    <div className="studio-page">
      <main className="studio-main">
        <div className="studio-workspace">
          <header className="studio-header studio-header--brand" aria-label="스튜디오 헤더">
            <div className="studio-header__row">
              <div className="studio-header__brand">
                <h1 className="studio-header__title">vibe-chord</h1>
                <p className="studio-header__subtitle">듣고 고르는 작곡 놀이터</p>
              </div>
              <div className="studio-header__actions" aria-label="악보 재생 및 공유">
                <PlaybackControls
                  isPlaying={isPlaying}
                  onPlay={() => void handlePlay()}
                  onStop={handleStop}
                  onUndo={handleUndo}
                  canUndo={canUndo}
                  showUndo={false}
                />
                <Link to="/share" className="studio-header__share">
                  데모 공유
                </Link>
              </div>
            </div>
          </header>

          <section className="studio-timeline-section studio-score" aria-label="악보">
            <h2 className="studio-section-title">타임라인</h2>
            <ConnectionHint chordIds={chordIds} />
            <p className="studio-drag-hint">
              맨 끝 + 에 코드 추가 · 블록 탭으로 코드 교체 · 블록 드래그로 순서 변경 · + 에 카드 끌어 놓기
            </p>
            <Timeline
              timeline={timeline}
              insertIndex={selectedInsertIndex}
              replaceIndex={replaceIndex}
              playingIndex={playingIndex}
              showSymbols={showSymbols}
              onBlockClick={(index, chordId) => void handleBlockClick(index, chordId)}
              onInsertClick={handleInsertClick}
              onReorder={(from, to) => void handleReorder(from, to)}
              onDropChord={(id, idx) => void handleDropChord(id, idx)}
            />
          </section>

          <aside className="studio-aside" aria-label="추천 및 설정">
            <StudioSettings />

            <div className="studio-toolbar" aria-label="편집">
              <PlaybackControls
                isPlaying={isPlaying}
                onPlay={() => void handlePlay()}
                onStop={handleStop}
                onUndo={handleUndo}
                canUndo={canUndo}
                showPlayback={false}
                showClearAll
                onClearAll={handleClearAll}
                canClearAll={canClearAll}
              />
            </div>

            <ChordPickerPanel
              recommendations={recommendations}
              showSymbols={showSymbols}
              pickerMode={pickerMode}
              insertIndex={selectedInsertIndex}
              replaceIndex={replaceIndex}
              timelineLength={timeline.length}
              pianoNotes={pianoNotes}
              pianoLabel={pianoLabel}
              onPreview={(chordId) => void handlePreview(chordId)}
              onAddChord={handleAddChord}
              onSelectPreset={(presetId) => void handleSelectPreset(presetId)}
            />
          </aside>
        </div>
      </main>
    </div>
  );
}
