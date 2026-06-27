import type { TimelineChord } from '../types';
import { getChord, getChordColor } from '../lib/chords';

export interface TimelineProps {
  timeline: TimelineChord[];
  selectedIndex: number | null;
  playingIndex: number | null;
  onBlockClick: (index: number, chordId: string) => void;
  onInsertClick: (index: number) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  showSymbols?: boolean;
}

export function Timeline({
  timeline,
  selectedIndex,
  playingIndex,
  onBlockClick,
  onInsertClick,
  onReorder,
  showSymbols = false,
}: TimelineProps) {
  const dragEnabled = Boolean(onReorder);

  if (timeline.length === 0) {
    return (
      <div className="timeline timeline--empty">
        <button
          type="button"
          className="timeline-insert"
          aria-label="코드 추가"
          onClick={() => onInsertClick(0)}
        >
          +
        </button>
      </div>
    );
  }

  return (
    <div className="timeline" role="list" aria-label="코드 타임라인">
      {timeline.map((block, index) => {
        const chord = getChord(block.chordId);
        const label = chord
          ? showSymbols
            ? chord.symbol
            : chord.label
          : block.chordId;
        const backgroundColor = chord ? getChordColor(chord.mood) : undefined;
        const isSelected = selectedIndex === index;
        const isPlaying = playingIndex === index;

        return (
          <div key={block.id} className="timeline-slot" role="listitem">
            <button
              type="button"
              className={[
                'timeline-block',
                isSelected && 'timeline-block--selected',
                isPlaying && 'timeline-block--playing',
                dragEnabled && 'timeline-block--draggable',
              ]
                .filter(Boolean)
                .join(' ')}
              style={backgroundColor ? { backgroundColor } : undefined}
              aria-label={`${label}, ${index + 1}번째 코드`}
              aria-pressed={isSelected}
              draggable={dragEnabled}
              onDragStart={(e) => {
                if (!dragEnabled) return;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', String(index));
              }}
              onDragOver={(e) => {
                if (!dragEnabled) return;
                e.preventDefault();
                e.dataTransfer.dropEffect = 'move';
              }}
              onDrop={(e) => {
                if (!dragEnabled) return;
                e.preventDefault();
                const from = parseInt(e.dataTransfer.getData('text/plain'), 10);
                if (!Number.isNaN(from) && from !== index) {
                  onReorder?.(from, index);
                }
              }}
              onClick={() => onBlockClick(index, block.chordId)}
            >
              <span className="timeline-block__label">{label}</span>
              {dragEnabled && (
                <span className="timeline-block__drag-hint" aria-hidden="true">
                  ⠿
                </span>
              )}
            </button>
            <button
              type="button"
              className="timeline-insert"
              aria-label={`${index + 1}번째 코드 뒤에 추가`}
              onClick={() => onInsertClick(index + 1)}
            >
              +
            </button>
          </div>
        );
      })}
    </div>
  );
}
