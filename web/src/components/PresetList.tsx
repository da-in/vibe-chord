import { PRESETS } from '../lib/presets';

export interface PresetListProps {
  onSelect: (presetId: string) => void;
}

export function PresetList({ onSelect }: PresetListProps) {
  return (
    <ul className="preset-list">
      {PRESETS.map((preset) => (
        <li key={preset.id}>
          <button
            type="button"
            className="preset-card"
            onClick={() => onSelect(preset.id)}
          >
            <span className="preset-card__name">{preset.name}</span>
            <span className="preset-card__desc">{preset.description}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
