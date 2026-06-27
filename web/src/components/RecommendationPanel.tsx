import type { ChordRecommendation } from '../types';
import { getChord } from '../lib/chords';

export interface RecommendationPanelProps {
  recommendations: ChordRecommendation[];
  onPreview: (chordId: string) => void;
  onSelect: (chordId: string) => void;
}

export function RecommendationPanel({
  recommendations,
  onPreview,
  onSelect,
}: RecommendationPanelProps) {
  if (recommendations.length === 0) {
    return (
      <section className="recommendation-panel recommendation-panel--empty">
        <h2 className="recommendation-panel__title">다음 코드 추천</h2>
        <p className="recommendation-panel__empty">추천할 코드가 없습니다</p>
      </section>
    );
  }

  return (
    <section className="recommendation-panel" aria-label="다음 코드 추천">
      <h2 className="recommendation-panel__title">다음 코드 추천</h2>
      <ul className="recommendation-panel__list">
        {recommendations.map((rec) => {
          const chord = getChord(rec.chordId);
          const label = chord?.label ?? rec.chordId;

          return (
            <li key={rec.chordId} className="recommendation-panel__item">
              <div
                className="recommendation-card"
                role="button"
                tabIndex={0}
                onClick={() => onSelect(rec.chordId)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelect(rec.chordId);
                  }
                }}
              >
                <span className="recommendation-card__label">{label}</span>
                <span className="recommendation-card__hint">{rec.whenToChoose}</span>
                <button
                  type="button"
                  className="recommendation-card__preview"
                  aria-label={`${label} 미리듣기`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onPreview(rec.chordId);
                  }}
                >
                  ▶
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
