export interface CompletionBadgeProps {
  visible: boolean;
}

export function CompletionBadge({ visible }: CompletionBadgeProps) {
  if (!visible) {
    return null;
  }

  return (
    <div
      className="completion-badge"
      role="status"
      aria-live="polite"
      aria-label="4마디 완성"
    >
      🎉 4마디 완성!
    </div>
  );
}
