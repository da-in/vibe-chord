import { getProgressionFeel } from '../lib/connectionFeel';

export interface ConnectionHintProps {
  chordIds: string[];
}

export function ConnectionHint({ chordIds }: ConnectionHintProps) {
  const feel = getProgressionFeel(chordIds);
  if (!feel) return null;

  return (
    <p className="connection-hint" role="status">
      <span className="connection-hint__label">이렇게 이어지면</span>
      {feel}
    </p>
  );
}
