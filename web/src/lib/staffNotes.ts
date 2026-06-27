export interface ParsedNote {
  letter: string;
  accidental: '' | '#' | 'b';
  octave: number;
  source: string;
}

const PITCH_CLASS: Record<string, number> = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11,
};

const LETTER_INDEX: Record<string, number> = {
  C: 0,
  D: 1,
  E: 2,
  F: 3,
  G: 4,
  A: 5,
  B: 6,
};

/** E4 = 0 on treble staff (bottom line) */
const E4_OCTAVE = 4;
const E4_LETTER_INDEX = LETTER_INDEX.E;
const STAFF_HALF_LINES = 8;
const SECOND_OFFSET = 3.2;

export function parseNote(note: string): ParsedNote | null {
  const match = note.match(/^([A-G])(#{1}|b{1})?(\d+)$/);
  if (!match) return null;
  return {
    letter: match[1],
    accidental: (match[2] as ParsedNote['accidental']) ?? '',
    octave: Number.parseInt(match[3], 10),
    source: note,
  };
}

export function noteToMidi(note: ParsedNote): number {
  const pitchClass = PITCH_CLASS[note.letter];
  const accidental = note.accidental === '#' ? 1 : note.accidental === 'b' ? -1 : 0;
  return (note.octave + 1) * 12 + pitchClass + accidental;
}

/** Diatonic staff step from E4 (line/space index; accidentals share the natural letter). */
export function noteToHalfLine(note: string): number | null {
  const parsed = parseNote(note);
  if (!parsed) return null;
  const letterIndex = LETTER_INDEX[parsed.letter];
  return (parsed.octave - E4_OCTAVE) * 7 + (letterIndex - E4_LETTER_INDEX);
}

function halfLineToY(halfLine: number, height: number): number {
  return height - (halfLine / STAFF_HALF_LINES) * height;
}

function ledgerLinesForHalfLine(halfLine: number, height: number): number[] {
  const ledgerY: number[] = [];
  if (halfLine < 0) {
    for (let line = -2; line >= halfLine; line -= 2) {
      ledgerY.push(halfLineToY(line, height));
    }
  } else if (halfLine > STAFF_HALF_LINES) {
    for (let line = 10; line <= halfLine; line += 2) {
      ledgerY.push(halfLineToY(line, height));
    }
  }
  return ledgerY;
}

export interface NoteLayout {
  source: string;
  x: number;
  y: number;
  halfLine: number;
  accidental: '' | '#' | 'b';
}

export function layoutChordNotes(
  notes: string[],
  width: number,
  height: number,
): NoteLayout[] {
  const parsed = notes
    .map((source) => {
      const halfLine = noteToHalfLine(source);
      const note = parseNote(source);
      if (halfLine === null || !note) return null;
      return { source, halfLine, accidental: note.accidental };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null)
    .sort((a, b) => a.halfLine - b.halfLine);

  const centerX = width / 2;
  const layouts: NoteLayout[] = parsed.map((note) => ({
    source: note.source,
    x: centerX,
    y: halfLineToY(note.halfLine, height),
    halfLine: note.halfLine,
    accidental: note.accidental,
  }));

  // Adjacent line/space (2nd): shift heads so they don't overlap
  for (let index = 0; index < layouts.length - 1; index += 1) {
    const lower = layouts[index];
    const upper = layouts[index + 1];
    if (upper.halfLine - lower.halfLine === 1) {
      lower.x = centerX - SECOND_OFFSET;
      upper.x = centerX + SECOND_OFFSET;
    }
  }

  return layouts;
}

export function layoutLedgerLines(
  notes: string[],
  width: number,
  height: number,
): { x: number; y: number }[] {
  const centerX = width / 2;
  const seen = new Set<number>();

  return notes
    .map((source) => noteToHalfLine(source))
    .filter((halfLine): halfLine is number => halfLine !== null)
    .flatMap((halfLine) => ledgerLinesForHalfLine(halfLine, height))
    .filter((y) => {
      const key = Math.round(y * 10);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((y) => ({ x: centerX, y }));
}
