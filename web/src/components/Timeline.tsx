import type { TimelineChord } from '../types';
import { CHORD_DRAG_MIME } from '../types';
import { getChord, getChordColor } from '../lib/chords';

const REORDER_PREFIX = 'reorder:';

export interface TimelineProps {
  timeline: TimelineChord[];
  selectedIndex: number | null;
  playingIndex: number | null;
  onBlockClick: (index: number, chordId: string) => void;
  onInsertClick: (index: number) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onDropChord?: (chordId: string, index: number) => void;
  onBlockBarsChange?: (index: number, bars: 1 | 2) => void;
  showSymbols?: boolean;
}

function readDropChordId(dataTransfer: DataTransfer): string | null {
  return dataTransfer.getData(CHORD_DRAG_MIME) || null;
}

function readReorderIndex(dataTransfer: DataTransfer): number | null {
  const raw = dataTransfer.getData('text/plain');
  if (!raw.startsWith(REORDER_PREFIX)) return null;
  const index = parseInt(raw.slice(REORDER_PREFIX.length), 10);
  return Number.isNaN(index) ? null : index;
}

function handleDropZone(
  e: React.DragEvent,
  index: number,
  onDropChord?: (chordId: string, index: number) => void,
  onReorder?: (from: number, to: number) => void,
) {
  e.preventDefault();
  const chordId = readDropChordId(e.dataTransfer);
  if (chordId && onDropChord) {
    onDropChord(chordId, index);
    return;
  }
  const from = readReorderIndex(e.dataTransfer);
  if (from !== null && onReorder && from !== index) {
    onReorder(from, index);
  }
}

export function Timeline({
  timeline,
  selectedIndex,
  playingIndex,
  onBlockClick,
  onInsertClick,
  onReorder,
  onDropChord,
  onBlockBarsChange,
  showSymbols = false,
}: TimelineProps) {
  const dragEnabled = Boolean(onReorder);

  if (timeline.length === 0) {
    return (
      <div
        className="timeline timeline--empty"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => handleDropZone(e, 0, onDropChord, onReorder)}
      >
        <button
          type="button"
          className="timeline-insert timeline-insert--drop"
          aria-label="코드 추가"
          onClick={() => onInsertClick(0)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={(e) => {
            e.stopPropagation();
            handleDropZone(e, 0, onDropChord, onReorder);
          }}
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
        const bars = block.bars ?? 1;

        return (
          <div key={block.id} className="timeline-slot" role="listitem">
            <button
              type="button"
              className={[
                'timeline-block',
                isSelected && 'timeline-block--selected',
                isPlaying && 'timeline-block--playing',
                dragEnabled && 'timeline-block--draggable',
                bars === 2 && 'timeline-block--wide',
              ]
                .filter(Boolean)
                .join(' ')}
              style={backgroundColor ? { backgroundColor } : undefined}
              aria-label={`${label}, ${index + 1}번째 코드, ${bars}마디`}
              aria-pressed={isSelected}
              draggable={dragEnabled}
              onDragStart={(e) => {
                if (!dragEnabled) return;
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', `${REORDER_PREFIX}${index}`);
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.dataTransfer.dropEffect = readDropChordId(e.dataTransfer)
                  ? 'copy'
                  : 'move';
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handleDropZone(e, index, onDropChord, onReorder);
              }}
              onClick={() => onBlockClick(index, block.chordId)}
            >
              <span className="timeline-block__label">{label}</span>
              {onBlockBarsChange && (
                <span
                  className="timeline-block__bars"
                  role="button"
                  tabIndex={0}
                  aria-label={`${bars}마디, 탭하여 변경`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onBlockBarsChange(index, bars === 1 ? 2 : 1);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      e.stopPropagation();
                      onBlockBarsChange(index, bars === 1 ? 2 : 1);
                    }
                  }}
                >
                  {bars}마디
                </span>
              )}
              {dragEnabled && (
                <span className="timeline-block__drag-hint" aria-hidden="true">
                  ⠿
                </span>
              )}
            </button>
            <button
              type="button"
              className="timeline-insert timeline-insert--drop"
              aria-label={`${index + 1}번째 코드 뒤에 추가`}
              onClick={() => onInsertClick(index + 1)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.stopPropagation();
                handleDropZone(e, index + 1, onDropChord, onReorder);
              }}
            >
              +
            </button>
          </div>
        );
      })}
    </div>
  );
}
