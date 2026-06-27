import { useMemo } from 'react';
import { layoutChordNotes, layoutLedgerLines } from '../lib/staffNotes';

const RAIL_WIDTH = 88;
const RAIL_HEIGHT = 24;

export interface ChordNotesProps {
  notes: string[];
}

export function ChordNotes({ notes }: ChordNotesProps) {
  const layouts = useMemo(
    () => layoutChordNotes(notes, RAIL_WIDTH, RAIL_HEIGHT),
    [notes],
  );
  const ledgerLines = useMemo(
    () => layoutLedgerLines(notes, RAIL_WIDTH, RAIL_HEIGHT),
    [notes],
  );

  if (layouts.length === 0) return null;

  return (
    <svg
      className="chord-notes"
      viewBox={`0 0 ${RAIL_WIDTH} ${RAIL_HEIGHT}`}
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
    >
      {ledgerLines.map((ledger) => (
        <line
          key={`ledger-${ledger.y}`}
          className="chord-notes__ledger"
          x1={ledger.x - 7}
          y1={ledger.y}
          x2={ledger.x + 7}
          y2={ledger.y}
        />
      ))}

      {layouts.map((note) => (
        <g key={note.source} className="chord-notes__note">
          {note.accidental === '#' && (
            <text
              className="chord-notes__accidental"
              x={note.x - 6.5}
              y={note.y + 1}
            >
              ♯
            </text>
          )}
          {note.accidental === 'b' && (
            <text
              className="chord-notes__accidental"
              x={note.x - 6.5}
              y={note.y + 1}
            >
              ♭
            </text>
          )}
          <ellipse
            className="chord-notes__head"
            cx={note.x}
            cy={note.y}
            rx={3.6}
            ry={2.8}
          />
        </g>
      ))}
    </svg>
  );
}
