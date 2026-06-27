import { useMemo } from 'react';
import type { ChordRecommendation } from '../types';
import { DIATONIC_GRID_IDS, getChord, getChordColor } from '../lib/chords';
import { CHORD_DRAG_MIME } from '../types';

export interface ChordGridProps {
  onPreview: (chordId: string) => void;
  onAdd: (chordId: string) => void;
  recommendations?: ChordRecommendation[];
  showSymbols?: boolean;
  draggable?: boolean;
}

export function ChordGrid({
  onPreview,
  onAdd,
  recommendations = [],
  showSymbols = false,
  draggable = false,
}: ChordGridProps) {
  const recommendationById = useMemo(
    () => new Map(recommendations.map((rec) => [rec.chordId, rec])),
    [recommendations],
  );

  return (
    <div className="chord-grid" role="list" aria-label="24 diatonic 코드">
      {DIATONIC_GRID_IDS.map((chordId) => {
        const chord = getChord(chordId);
        if (!chord) return null;
        const recommendation = recommendationById.get(chordId);
        const backgroundColor = getChordColor(chord.mood);
        const primaryLabel = showSymbols ? chord.symbol : chord.label;
        const secondaryLabel = showSymbols ? chord.label : chord.symbol;
        const isRecommended = Boolean(recommendation);

        return (
          <button
            key={chordId}
            type="button"
            className={[
              'chord-grid__cell',
              isRecommended && 'chord-grid__cell--recommended',
              draggable && 'chord-grid__cell--draggable',
            ]
              .filter(Boolean)
              .join(' ')}
            style={{ backgroundColor }}
            role="listitem"
            aria-label={`${chord.label} (${chord.symbol})${
              recommendation ? `, ${recommendation.whenToChoose}` : ''
            }, 탭하여 미리듣기`}
            draggable={draggable}
            onDragStart={(e) => {
              if (!draggable) return;
              e.dataTransfer.setData(CHORD_DRAG_MIME, chordId);
              e.dataTransfer.effectAllowed = 'copy';
            }}
            onClick={() => onPreview(chordId)}
          >
            <span
              className="chord-grid__add"
              role="button"
              tabIndex={0}
              aria-label={`${primaryLabel} 악보에 추가`}
              onClick={(e) => {
                e.stopPropagation();
                onAdd(chordId);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  e.stopPropagation();
                  onAdd(chordId);
                }
              }}
            >
              +
            </span>
            <span className="chord-grid__label">{primaryLabel}</span>
            <span className="chord-grid__symbol">{secondaryLabel}</span>
            <span
              className={[
                'chord-grid__hint',
                !recommendation && 'chord-grid__hint--empty',
              ]
                .filter(Boolean)
                .join(' ')}
              aria-hidden={!recommendation}
            >
              {recommendation?.whenToChoose ?? '\u00A0'}
            </span>
          </button>
        );
      })}
    </div>
  );
}
