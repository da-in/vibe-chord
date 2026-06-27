import { DIATONIC_GRID_IDS, getChord, getChordColor } from '../lib/chords';

export interface ChordGridProps {
  onSelect: (chordId: string) => void;
}

export function ChordGrid({ onSelect }: ChordGridProps) {
  return (
    <div className="chord-grid" role="list" aria-label="24 diatonic 코드">
      {DIATONIC_GRID_IDS.map((chordId) => {
        const chord = getChord(chordId);
        if (!chord) return null;
        const backgroundColor = getChordColor(chord.mood);

        return (
          <button
            key={chordId}
            type="button"
            className="chord-grid__cell"
            style={{ backgroundColor }}
            role="listitem"
            aria-label={`${chord.label} (${chord.symbol})`}
            onClick={() => onSelect(chordId)}
          >
            <span className="chord-grid__label">{chord.label}</span>
            <span className="chord-grid__symbol">{chord.symbol}</span>
          </button>
        );
      })}
    </div>
  );
}
