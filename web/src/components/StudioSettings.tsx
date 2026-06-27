import { useSettings } from '../context/SettingsContext';
import type { MaxChords, BeatsPerChord } from '../context/SettingsContext';

export function StudioSettings() {
  const {
    bpm,
    setBpm,
    maxChords,
    setMaxChords,
    beatsPerChord,
    setBeatsPerChord,
    showSymbols,
    setShowSymbols,
  } = useSettings();

  return (
    <section className="studio-settings" aria-label="재생 설정">
      <h2 className="studio-section-title">설정</h2>
      <div className="studio-settings__grid">
        <label className="studio-settings__field">
          <span className="studio-settings__label">BPM {bpm}</span>
          <input
            type="range"
            min={80}
            max={120}
            step={1}
            value={bpm}
            onChange={(e) => setBpm(Number(e.target.value))}
          />
        </label>

        <label className="studio-settings__field">
          <span className="studio-settings__label">마디 수 (코드 칸)</span>
          <select
            value={maxChords}
            onChange={(e) => setMaxChords(Number(e.target.value) as MaxChords)}
          >
            <option value={4}>4코드</option>
            <option value={8}>8코드</option>
          </select>
        </label>

        <label className="studio-settings__field">
          <span className="studio-settings__label">코드당 박 수</span>
          <select
            value={beatsPerChord}
            onChange={(e) =>
              setBeatsPerChord(Number(e.target.value) as BeatsPerChord)
            }
          >
            <option value={2}>2박 (빠르게)</option>
            <option value={4}>4박 (1마디)</option>
          </select>
        </label>

        <label className="studio-settings__toggle">
          <input
            type="checkbox"
            checked={showSymbols}
            onChange={(e) => setShowSymbols(e.target.checked)}
          />
          <span>코드명 보기 (Am, C…)</span>
        </label>
      </div>
    </section>
  );
}
