import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ChordGrid } from '../components/ChordGrid';
import { PresetList } from '../components/PresetList';
import { useTimeline } from '../context/TimelineContext';
import { getChord, getChordColor } from '../lib/chords';
import { ensureAudioStarted, playChord, playChords } from '../lib/audio';
import { getPreset } from '../lib/presets';

export default function ExplorePage() {
  const navigate = useNavigate();
  const {
    timeline,
    maxChords,
    isFull,
    activePresetId,
    saveHistory,
    appendChord,
    replaceWithChordIds,
    replaceChordAt,
  } = useTimeline();

  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  const handleGridSelect = async (chordId: string) => {
    await ensureAudioStarted();
    playChord(chordId);

    if (replaceIndex !== null) {
      saveHistory();
      replaceChordAt(replaceIndex, chordId);
      setReplaceIndex(null);
      navigate('/studio');
      return;
    }

    if (isFull) {
      navigate('/studio');
      return;
    }

    saveHistory();
    appendChord(chordId);
    navigate('/studio');
  };

  const handlePresetSelect = async (presetId: string) => {
    const preset = getPreset(presetId);
    if (!preset) return;

    await ensureAudioStarted();
    saveHistory();
    const next = replaceWithChordIds(preset.chordIds, presetId);
    const previewIds = next.slice(0, Math.min(2, next.length)).map((c) => c.chordId);
    if (previewIds.length > 0) {
      await playChords(previewIds);
    }
    navigate('/studio');
  };

  const activePreset = activePresetId ? getPreset(activePresetId) : null;

  return (
    <div className="explore-page">
      <header className="explore-header">
        <div>
          <h1 className="explore-header__title">코드·진행 탐색</h1>
          <p className="explore-header__subtitle">
            추천 밖에서 직접 고르거나, 유명 진행을 통째로 불러오세요
          </p>
        </div>
        <Link to="/studio" className="explore-header__back">
          ← 스튜디오
        </Link>
      </header>

      <main className="explore-main">
        {timeline.length > 0 && (
          <section className="explore-section">
            <h2 className="studio-section-title">타임라인 코드 교체</h2>
            <p className="explore-section__hint">
              {activePreset
                ? `「${activePreset.name}」 프리셋 — 바꿀 칸을 고른 뒤 아래 그리드에서 선택하세요`
                : '바꿀 칸을 고른 뒤 그리드에서 새 코드를 선택하세요'}
            </p>
            <div className="preset-slots">
              {timeline.map((block, index) => {
                const chord = getChord(block.chordId);
                if (!chord) return null;
                const selected = replaceIndex === index;
                return (
                  <button
                    key={block.id}
                    type="button"
                    className={[
                      'preset-slot',
                      selected && 'preset-slot--selected',
                    ]
                      .filter(Boolean)
                      .join(' ')}
                    style={{ backgroundColor: getChordColor(chord.mood) }}
                    onClick={() =>
                      setReplaceIndex(selected ? null : index)
                    }
                  >
                    <span>{chord.label}</span>
                    <span className="preset-slot__idx">{index + 1}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        <section className="explore-section">
          <h2 className="studio-section-title">24 diatonic 코드</h2>
          <p className="explore-section__hint">
            {replaceIndex !== null
              ? `${replaceIndex + 1}번째 코드를 교체합니다 — 그리드에서 선택`
              : '탭하면 즉시 재생되고 타임라인에 추가됩니다'}
            {isFull && replaceIndex === null ? ' (가득 차면 교체 모드만 가능)' : ''}
          </p>
          <ChordGrid onSelect={(id) => void handleGridSelect(id)} />
        </section>

        <section className="explore-section">
          <h2 className="studio-section-title">유명 진행 프리셋</h2>
          <p className="explore-section__hint">
            선택하면 타임라인에 진행이 통째로 불러와집니다 (최대 {maxChords}코드)
          </p>
          <PresetList onSelect={(id) => void handlePresetSelect(id)} />
        </section>

        <p className="explore-footer-note">
          현재 타임라인: {timeline.length}/{maxChords}코드
        </p>
      </main>
    </div>
  );
}
