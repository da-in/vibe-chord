export interface PlaybackControlsProps {
  isPlaying: boolean;
  onPlay: () => void;
  onStop: () => void;
  onUndo: () => void;
  canUndo: boolean;
  showPlayback?: boolean;
  showUndo?: boolean;
  onClearAll?: () => void;
  canClearAll?: boolean;
  showClearAll?: boolean;
}

export function PlaybackControls({
  isPlaying,
  onPlay,
  onStop,
  onUndo,
  canUndo,
  showPlayback = true,
  showUndo = true,
  onClearAll,
  canClearAll = false,
  showClearAll = false,
}: PlaybackControlsProps) {
  return (
    <div className="playback-controls" role="group" aria-label="재생 컨트롤">
      {showPlayback && (
        <>
          <button
            type="button"
            className="playback-controls__play playback-controls__btn--icon"
            aria-label={isPlaying ? '재생 중' : '재생'}
            title={isPlaying ? '재생 중' : '재생'}
            aria-pressed={isPlaying}
            onClick={onPlay}
          >
            <span className="playback-controls__icon" aria-hidden="true">
              ▶
            </span>
          </button>
          <button
            type="button"
            className="playback-controls__stop playback-controls__btn--icon"
            aria-label="정지"
            title="정지"
            onClick={onStop}
          >
            <span className="playback-controls__icon" aria-hidden="true">
              ■
            </span>
          </button>
        </>
      )}
      {showUndo && (
        <button
          type="button"
          className="playback-controls__undo"
          aria-label="되돌리기"
          title="되돌리기"
          disabled={!canUndo}
          onClick={onUndo}
        >
          Undo
        </button>
      )}
      {showClearAll && onClearAll && (
        <button
          type="button"
          className="playback-controls__clear"
          aria-label="전체 삭제"
          title="전체 삭제"
          disabled={!canClearAll}
          onClick={onClearAll}
        >
          Clear all
        </button>
      )}
    </div>
  );
}
