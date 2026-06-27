import { useId, useState } from 'react';
import type { ChordRecommendation } from '../types';
import { ChordGrid } from './ChordGrid';
import { PianoKeyboard } from './PianoKeyboard';
import { PresetList } from './PresetList';

export type ChordPickerMode = 'append' | 'insert' | 'replace';

export interface ChordPickerPanelProps {
  recommendations: ChordRecommendation[];
  showSymbols?: boolean;
  pickerMode: ChordPickerMode;
  insertIndex: number | null;
  replaceIndex: number | null;
  timelineLength: number;
  pianoNotes: string[];
  pianoLabel: string | null;
  onPreview: (chordId: string) => void;
  onAddChord: (chordId: string) => void;
  onSelectPreset: (presetId: string) => void;
}

function panelStatusText(
  mode: ChordPickerMode,
  insertIndex: number | null,
  replaceIndex: number | null,
  timelineLength: number,
  hasRecommendations: boolean,
): string {
  const how = '카드 탭 미리듣기 · + 로 적용';
  const rec = hasRecommendations ? ' · 강조 = 이어가기 좋음' : '';

  if (mode === 'replace' && replaceIndex !== null) {
    return `${replaceIndex + 1}번째 코드 교체 · ${how}${rec}`;
  }
  if (mode === 'insert' && insertIndex !== null && timelineLength === 0) {
    return `첫 코드 · ${how}${rec}`;
  }
  if (mode === 'insert' && insertIndex !== null) {
    return `맨 끝 추가 · ${how}${rec}`;
  }
  return `${how}${rec}`;
}

export function ChordPickerPanel({
  recommendations,
  showSymbols = false,
  pickerMode,
  insertIndex,
  replaceIndex,
  timelineLength,
  pianoNotes,
  pianoLabel,
  onPreview,
  onAddChord,
  onSelectPreset,
}: ChordPickerPanelProps) {
  const presetsPanelId = useId();
  const [presetsOpen, setPresetsOpen] = useState(false);
  const statusText = panelStatusText(
    pickerMode,
    insertIndex,
    replaceIndex,
    timelineLength,
    recommendations.length > 0,
  );

  return (
    <section className="chord-picker-panel" aria-label="코드 고르기">
      <h2 className="chord-picker-panel__title">코드 고르기</h2>

      <p className="chord-picker-panel__banner" role="status">
        {statusText}
      </p>

      <div className="chord-picker-panel__grid">
        <h3 className="chord-picker-panel__subsection-label">전체 코드</h3>
        <PianoKeyboard activeNotes={pianoNotes} label={pianoLabel} />
        <ChordGrid
          recommendations={recommendations}
          showSymbols={showSymbols}
          draggable
          onPreview={onPreview}
          onAdd={onAddChord}
        />
      </div>

      <div className="chord-picker-panel__presets">
        <button
          type="button"
          className="chord-picker-panel__presets-trigger"
          aria-expanded={presetsOpen}
          aria-controls={presetsPanelId}
          onClick={() => setPresetsOpen((prev) => !prev)}
        >
          <span>유명 진행 불러오기</span>
          <span className="chord-picker-panel__presets-chevron" aria-hidden="true">
            {presetsOpen ? '▴' : '▾'}
          </span>
        </button>
        {presetsOpen && (
          <div id={presetsPanelId} className="chord-picker-panel__presets-body">
            <p className="chord-picker-panel__presets-hint">
              선택하면 타임라인에 진행이 통째로 불러와집니다
            </p>
            <PresetList onSelect={onSelectPreset} />
          </div>
        )}
      </div>
    </section>
  );
}
