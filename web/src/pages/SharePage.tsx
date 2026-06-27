import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function SharePage() {
  const [message, setMessage] = useState<string | null>(null);

  const showComingSoon = (label: string) => {
    setMessage(`${label} — 준비중입니다.`);
    window.setTimeout(() => setMessage(null), 2500);
  };

  return (
    <div className="share-page">
      <header className="share-header">
        <h1>데모 공유</h1>
        <Link to="/studio" className="share-back">
          ← 스튜디오
        </Link>
      </header>

      <main className="share-main">
        <p className="share-desc">
          만든 코드 진행을 밴드·동아리에 들려줄 mp3나 공유 링크를 만들 수 있어요.
        </p>

        <div className="share-actions">
          <button
            type="button"
            className="share-btn"
            onClick={() => showComingSoon('30초 mp3 내보내기')}
          >
            30초 mp3 내보내기
          </button>
          <button
            type="button"
            className="share-btn"
            onClick={() => showComingSoon('공유 링크 만들기')}
          >
            공유 링크 만들기
          </button>
        </div>

        {message && (
          <p className="share-toast" role="status">
            {message}
          </p>
        )}

        <p className="share-note">
          지금은 ▶ Play로 스튜디오에서 바로 들려주거나 화면 공유로 데모할 수 있어요.
        </p>
      </main>
    </div>
  );
}
