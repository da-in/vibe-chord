import { useMemo } from 'react';
import {
  buildPianoKeys,
  getWhiteKeyCount,
  notesToMidiSet,
  type PianoBlackKey,
  type PianoWhiteKey,
} from '../lib/pianoKeys';

export interface PianoKeyboardProps {
  activeNotes: string[];
  label?: string | null;
}

function isWhiteKey(key: PianoWhiteKey | PianoBlackKey): key is PianoWhiteKey {
  return key.type === 'white';
}

export function PianoKeyboard({ activeNotes, label }: PianoKeyboardProps) {
  const keys = useMemo(() => buildPianoKeys(), []);
  const whiteKeys = useMemo(() => keys.filter(isWhiteKey), [keys]);
  const blackKeys = useMemo(
    () => keys.filter((key): key is PianoBlackKey => key.type === 'black'),
    [keys],
  );
  const activeMidi = useMemo(() => notesToMidiSet(activeNotes), [activeNotes]);
  const whiteCount = getWhiteKeyCount();

  const ariaLabel =
    activeNotes.length > 0
      ? `${label ? `${label} 코드: ` : ''}${activeNotes.join(', ')}`
      : '피아노 건반';

  return (
    <div className="piano-keyboard" aria-label={ariaLabel}>
      {label && activeNotes.length > 0 && (
        <p className="piano-keyboard__label">{label}</p>
      )}
      <div className="piano-keyboard__scroll">
        <div
          className="piano-keyboard__keys"
          style={{ '--white-count': whiteCount } as React.CSSProperties}
        >
          <div className="piano-keyboard__whites">
            {whiteKeys.map((key) => (
              <span
                key={key.midi}
                className={[
                  'piano-key',
                  'piano-key--white',
                  activeMidi.has(key.midi) && 'piano-key--active',
                ]
                  .filter(Boolean)
                  .join(' ')}
                aria-hidden="true"
              />
            ))}
          </div>
          {blackKeys.map((key) => (
            <span
              key={key.midi}
              className={[
                'piano-key',
                'piano-key--black',
                activeMidi.has(key.midi) && 'piano-key--active',
              ]
                .filter(Boolean)
                .join(' ')}
              style={
                {
                  '--left-white-index': key.leftWhiteIndex,
                } as React.CSSProperties
              }
              aria-hidden="true"
            />
          ))}
        </div>
      </div>
    </div>
  );
}
