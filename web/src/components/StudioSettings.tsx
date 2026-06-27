import { useId, useMemo, useState } from 'react';
import { useSettings } from '../context/SettingsContext';
import type { BeatsPerChord } from '../context/SettingsContext';

const BEATS_LABELS: Record<BeatsPerChord, string> = {
  2: '2박',
  4: '4박',
};

export function StudioSettings() {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const {
    bpm,
    setBpm,
    beatsPerChord,
    setBeatsPerChord,
    showSymbols,
    setShowSymbols,
  } = useSettings();

  const summary = useMemo(
    () =>
      `BPM ${bpm} · ${BEATS_LABELS[beatsPerChord]} · ${
        showSymbols ? '코드명 보기' : '코드명 숨김'
      }`,
    [bpm, beatsPerChord, showSymbols],
  );

  return (
    <section
      className={['studio-settings', open && 'studio-settings--open']
        .filter(Boolean)
        .join(' ')}
      aria-label="재생 설정"
    >
      <button
        type="button"
        className="studio-settings__trigger"
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={open ? '설정 닫기' : `설정, ${summary}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="studio-settings__title">설정</span>
        <span
          className="studio-settings__summary"
          aria-hidden={open}
        >
          {summary}
        </span>
        <span className="studio-settings__chevron" aria-hidden="true">
          {open ? '▴' : '▾'}
        </span>
      </button>

      {open && (
        <div id={panelId} className="studio-settings__panel">
          <label className="studio-settings__field">
            <span className="studio-settings__label">BPM</span>
            <div className="studio-settings__control studio-settings__control--range">
              <span className="studio-settings__value">{bpm}</span>
              <input
                type="range"
                min={80}
                max={120}
                step={1}
                value={bpm}
                onChange={(e) => setBpm(Number(e.target.value))}
              />
            </div>
          </label>

          <label className="studio-settings__field">
            <span className="studio-settings__label">코드당 박 수</span>
            <select
              className="studio-settings__control"
              value={beatsPerChord}
              onChange={(e) =>
                setBeatsPerChord(Number(e.target.value) as BeatsPerChord)
              }
            >
              <option value={2}>2박 (빠르게)</option>
              <option value={4}>4박 (1마디)</option>
            </select>
          </label>

          <label className="studio-settings__field">
            <span className="studio-settings__label">코드명 보기</span>
            <input
              className="studio-settings__control studio-settings__control--checkbox"
              type="checkbox"
              checked={showSymbols}
              onChange={(e) => setShowSymbols(e.target.checked)}
            />
          </label>
        </div>
      )}
    </section>
  );
}
