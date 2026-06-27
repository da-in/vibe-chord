export interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onUndo: () => void;
  canUndo: boolean;
}

export function PlaybackControls({
  isPlaying,
  onPlay,
  onStop,
  onUndo,
  canUndo,
}: PlaybackControlsProps) {
  return (
    <div className="playback-controls" role="group" aria-label="재생 컨트롤">
      <button
        type="button"
        className="playback-controls__play"
        aria-label="재생"
        aria-pressed={isPlaying}
        onClick={onPlay}
      >
        ▶ Play
      </button>
      <button
        type="button"
        className="playback-controls__stop"
        aria-label="정지"
        onClick={onStop}
      >
        ■ Stop
      </button>
      <button
        type="button"
        className="playback-controls__undo"
        aria-label="되돌리기"
        disabled={!canUndo}
        onClick={onUndo}
      >
        Undo
      </button>
    </div>
  );
}
