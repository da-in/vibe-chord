import { useState } from 'react';

export interface SectionFeedbackProps {
  visible: boolean;
}

export function SectionFeedback({ visible }: SectionFeedbackProps) {
  const [notice, setNotice] = useState<string | null>(null);

  if (!visible) return null;

  const showComingSoon = (label: string) => {
    setNotice(`${label} — 준비중입니다. MVP 이후 AI 피드백을 검토 중이에요.`);
    window.setTimeout(() => setNotice(null), 3200);
  };

  return (
    <section className="section-feedback" aria-label="구간 피드백">
      <h2 className="section-feedback__title">이 구간 어때요?</h2>
      <p className="section-feedback__desc">
        만든 진행 전체에 대한 좋고 나쁨 피드백 (MVP 이후)
      </p>
      <div className="section-feedback__actions">
        <button
          type="button"
          className="section-feedback__btn section-feedback__btn--good"
          onClick={() => showComingSoon('좋아요')}
        >
          👍 좋아요
        </button>
        <button
          type="button"
          className="section-feedback__btn section-feedback__btn--bad"
          onClick={() => showComingSoon('아쉬워요')}
        >
          👎 아쉬워요
        </button>
      </div>
      {notice && (
        <p className="section-feedback__notice" role="status">
          {notice}
        </p>
      )}
    </section>
  );
}
