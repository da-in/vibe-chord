import { useState, type FormEvent } from 'react';

export interface NaturalLanguageBarProps {
  onApply?: (text: string) => void;
}

export function NaturalLanguageBar({ onApply }: NaturalLanguageBarProps) {
  const [text, setText] = useState('');
  const [notice, setNotice] = useState<string | null>(null);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (!trimmed) return;

    onApply?.(trimmed);
    setNotice('자연어로 진행 만들기 — 준비중입니다.');
    window.setTimeout(() => setNotice(null), 2800);
  };

  return (
    <section className="nl-bar" aria-label="자연어·분위기 입력">
      <form className="nl-bar__form" onSubmit={handleSubmit}>
        <label htmlFor="nl-input" className="nl-bar__label">
          분위기로 말해보기
        </label>
        <div className="nl-bar__row">
          <input
            id="nl-input"
            type="text"
            className="nl-bar__input"
            placeholder='예: "조금 더 슬프게…"'
            value={text}
            onChange={(e) => setText(e.target.value)}
            maxLength={80}
          />
          <button type="submit" className="nl-bar__apply" disabled={!text.trim()}>
            적용
          </button>
        </div>
      </form>
      {notice && (
        <p className="nl-bar__notice" role="status">
          {notice}
        </p>
      )}
      <p className="nl-bar__hint">
        입력하면 타임라인에 반영하고 Play까지 — MVP 이후 제공 예정 (F-38)
      </p>
    </section>
  );
}
