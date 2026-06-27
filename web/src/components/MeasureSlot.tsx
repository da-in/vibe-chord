import type { ReactNode } from 'react';
import { ChordNotes } from './ChordNotes';
import { StaffLines } from './StaffLines';

function insertSlotLabel(slotIndex: number, timelineLength: number): string {
  if (timelineLength === 0 && slotIndex === 0) {
    return '첫 코드 추가';
  }
  if (slotIndex === timelineLength) {
    return '맨 끝에 코드 추가';
  }
  return `${slotIndex + 1}번째 위치에 코드 추가`;
}

interface MeasureSlotBaseProps {
  showLeadingBarline?: boolean;
}

export interface InsertMeasureSlotProps extends MeasureSlotBaseProps {
  variant: 'insert';
  insertIndex: number;
  timelineLength: number;
  isInsertSelected: boolean;
  onInsertClick: (index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
}

export interface ChordMeasureSlotProps extends MeasureSlotBaseProps {
  variant: 'chord';
  notes?: string[];
  children: ReactNode;
}

export type MeasureSlotProps = InsertMeasureSlotProps | ChordMeasureSlotProps;

function StaffRail({
  showLeadingBarline,
  notes,
}: {
  showLeadingBarline: boolean;
  notes?: string[];
}) {
  return (
    <div className="measure-slot__staff-rail">
      {showLeadingBarline && (
        <span className="measure-slot__barline" aria-hidden="true" />
      )}
      <StaffLines />
      {notes && notes.length > 0 && <ChordNotes notes={notes} />}
    </div>
  );
}

export function MeasureSlot(props: MeasureSlotProps) {
  const { showLeadingBarline = true } = props;

  if (props.variant === 'insert') {
    const {
      insertIndex,
      timelineLength,
      isInsertSelected,
      onInsertClick,
      onDragOver,
      onDrop,
    } = props;
    const label = insertSlotLabel(insertIndex, timelineLength);

    return (
      <div
        className={[
          'measure-slot',
          'measure-slot--insert',
          isInsertSelected && 'measure-slot--insert-selected',
        ]
          .filter(Boolean)
          .join(' ')}
        role="listitem"
      >
        <div className="measure-slot__chord-layer measure-slot__chord-layer--empty" />
        <button
          type="button"
          className="measure-slot__staff measure-slot__insert-target"
          aria-label={`${label}${isInsertSelected ? ', 선택됨' : ''}`}
          aria-pressed={isInsertSelected}
          onClick={() => onInsertClick(insertIndex)}
          onDragOver={onDragOver}
          onDrop={onDrop}
        >
          <StaffRail showLeadingBarline={showLeadingBarline} />
          <span className="measure-slot__insert-mark" aria-hidden="true">
            +
          </span>
        </button>
      </div>
    );
  }

  return (
    <div className="measure-slot measure-slot--chord" role="listitem">
      <div className="measure-slot__chord-layer">{props.children}</div>
      <div className="measure-slot__staff measure-slot__staff--decorative">
        <StaffRail showLeadingBarline={showLeadingBarline} notes={props.notes} />
      </div>
    </div>
  );
}
