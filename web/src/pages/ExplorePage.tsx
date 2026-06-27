import { Link, useNavigate } from 'react-router-dom';
import { ChordGrid } from '../components/ChordGrid';
import { PresetList } from '../components/PresetList';
import { MAX_CHORDS, useTimeline } from '../context/TimelineContext';
import { ensureAudioStarted, playChord, playChords } from '../lib/audio';
import { getPreset } from '../lib/presets';

export default function ExplorePage() {
  const navigate = useNavigate();
  const { timeline, isFull, saveHistory, appendChord, replaceWithChordIds } =
    useTimeline();

  const handleGridSelect = async (chordId: string) => {
    await ensureAudioStarted();
    playChord(chordId);

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
    const next = replaceWithChordIds(preset.chordIds);
    const previewIds = next.slice(0, Math.min(2, next.length)).map((c) => c.chordId);
    if (previewIds.length > 0) {
      await playChords(previewIds);
    }
    navigate('/studio');
  };

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
        <section className="explore-section">
          <h2 className="studio-section-title">24 diatonic 코드</h2>
          <p className="explore-section__hint">
            탭하면 즉시 재생되고 타임라인에 추가됩니다
            {isFull ? ' (타임라인이 가득 차면 스튜디오로만 이동)' : ''}
          </p>
          <ChordGrid onSelect={(id) => void handleGridSelect(id)} />
        </section>

        <section className="explore-section">
          <h2 className="studio-section-title">유명 진행 프리셋</h2>
          <p className="explore-section__hint">
            선택하면 타임라인에 진행이 통째로 불러와집니다 (최대 {MAX_CHORDS}코드)
          </p>
          <PresetList onSelect={(id) => void handlePresetSelect(id)} />
        </section>

        <p className="explore-footer-note">
          현재 타임라인: {timeline.length}/{MAX_CHORDS}코드
        </p>
      </main>
    </div>
  );
}
