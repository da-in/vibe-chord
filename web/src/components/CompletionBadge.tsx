export interface CompletionBadgeProps {
  visible: boolean;
  message?: string;
}

export function CompletionBadge({
  visible,
  message = '🎉 4마디 완성!',
}: CompletionBadgeProps) {
  if (!visible) return null;

  return (
    <div
      className="completion-badge"
      role="status"
      aria-live="polite"
    >
      {message}
    </div>
  );
}
