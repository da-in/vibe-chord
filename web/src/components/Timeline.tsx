import type { TimelineChord } from '../types';
import { CHORD_DRAG_MIME } from '../types';
import { getChord, getChordColor } from '../lib/chords';
import { MeasureSlot } from './MeasureSlot';

const REORDER_PREFIX = 'reorder:';

export interface TimelineProps {
  timeline: TimelineChord[];
  insertIndex: number | null;
  replaceIndex?: number | null;
  playingIndex: number | null;
  onBlockClick: (index: number, chordId: string) => void;
  onInsertClick: (index: number) => void;
  onReorder?: (fromIndex: number, toIndex: number) => void;
  onDropChord?: (chordId: string, index: number) => void;
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
  insertIndex,
  replaceIndex = null,
  playingIndex,
  onBlockClick,
  onInsertClick,
  onReorder,
  onDropChord,
  showSymbols = false,
}: TimelineProps) {
  const dragEnabled = Boolean(onReorder);
  const appendIndex = timeline.length;

  return (
    <div
      className={['timeline', timeline.length === 0 && 'timeline--empty']
        .filter(Boolean)
        .join(' ')}
      role="list"
      aria-label="코드 타임라인"
    >
      {timeline.map((block, index) => {
        const chord = getChord(block.chordId);
        const label = chord
          ? showSymbols
            ? chord.symbol
            : chord.label
          : block.chordId;
        const backgroundColor = chord ? getChordColor(chord.mood) : undefined;
        const isReplaceTarget = replaceIndex === index;
        const isPlaying = playingIndex === index;

        return (
          <MeasureSlot
            key={block.id}
            variant="chord"
            showLeadingBarline={index > 0}
            notes={chord?.notes}
          >
            <button
              type="button"
              className={[
                'timeline-block',
                isReplaceTarget && 'timeline-block--replace-target',
                isPlaying && 'timeline-block--playing',
                dragEnabled && 'timeline-block--draggable',
              ]
                .filter(Boolean)
                .join(' ')}
              style={backgroundColor ? { backgroundColor } : undefined}
              aria-label={`${label}, ${index + 1}번째 코드${isReplaceTarget ? ', 교체 선택됨' : ''}`}
              aria-pressed={isReplaceTarget}
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
              {dragEnabled && (
                <span className="timeline-block__drag-hint" aria-hidden="true">
                  ⠿
                </span>
              )}
            </button>
          </MeasureSlot>
        );
      })}
      <MeasureSlot
        variant="insert"
        insertIndex={appendIndex}
        timelineLength={timeline.length}
        isInsertSelected={insertIndex === appendIndex}
        showLeadingBarline={timeline.length > 0}
        onInsertClick={onInsertClick}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.stopPropagation();
          handleDropZone(e, appendIndex, onDropChord, onReorder);
        }}
      />
    </div>
  );
}
