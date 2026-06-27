import { useState } from 'react';
import type { ChordRecommendation } from '../types';
import { CHORD_DRAG_MIME } from '../types';
import { getChord } from '../lib/chords';

export interface RecommendationPanelProps {
  recommendations: ChordRecommendation[];
  showSymbols?: boolean;
  draggable?: boolean;
  embedded?: boolean;
  onPreview: (chordId: string) => void;
  onSelect: (chordId: string) => void;
}

export function RecommendationPanel({
  recommendations,
  showSymbols = false,
  draggable = true,
  embedded = false,
  onPreview,
  onSelect,
}: RecommendationPanelProps) {
  const [expandedWhy, setExpandedWhy] = useState<string | null>(null);

  if (recommendations.length === 0) {
    if (embedded) {
      return (
        <p className="recommendation-panel__empty">추천할 코드가 없습니다</p>
      );
    }
    return (
      <section className="recommendation-panel recommendation-panel--empty">
        <h2 className="recommendation-panel__title">다음 코드 추천</h2>
        <p className="recommendation-panel__empty">추천할 코드가 없습니다</p>
      </section>
    );
  }

  const content = (
    <>
      {!embedded && (
        <h2 className="recommendation-panel__title">다음 코드 추천</h2>
      )}
      {draggable && (
        <p className="recommendation-panel__drag-hint">
          카드·칸을 타임라인 + 위에 끌어 놓으면 1마디 재생과 함께 추가됩니다
        </p>
      )}
      <ul className="recommendation-panel__list">
        {recommendations.map((rec) => {
          const chord = getChord(rec.chordId);
          const label = chord
            ? showSymbols
              ? chord.symbol
              : chord.label
            : rec.chordId;
          const whyOpen = expandedWhy === rec.chordId;

          return (
            <li key={rec.chordId} className="recommendation-panel__item">
              <div
                className="recommendation-card"
                role="button"
                tabIndex={0}
                draggable={draggable}
                onDragStart={(e) => {
                  if (!draggable) return;
                  e.dataTransfer.setData(CHORD_DRAG_MIME, rec.chordId);
                  e.dataTransfer.effectAllowed = 'copy';
                }}
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
                {(rec.reason || rec.reasonDetail) && (
                  <div className="recommendation-card__why">
                    <button
                      type="button"
                      className="recommendation-card__why-btn"
                      aria-expanded={whyOpen}
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedWhy(whyOpen ? null : rec.chordId);
                      }}
                    >
                      ℹ️ 왜?
                    </button>
                    {whyOpen && (
                      <div className="recommendation-card__why-body">
                        {rec.reason && (
                          <p className="recommendation-card__why-notation">{rec.reason}</p>
                        )}
                        {rec.reasonDetail && (
                          <p className="recommendation-card__why-text">{rec.reasonDetail}</p>
                        )}
                      </div>
                    )}
                  </div>
                )}
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
    </>
  );

  if (embedded) {
    return content;
  }

  return (
    <section className="recommendation-panel" aria-label="다음 코드 추천">
      {content}
    </section>
  );
}
