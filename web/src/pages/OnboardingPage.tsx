import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../context/SettingsContext';
import { useTimeline } from '../context/TimelineContext';
import { MOOD_OPTIONS, getStartersForMood } from '../lib/onboarding';
import { ensureAudioStarted, playChord } from '../lib/audio';
import { getChord, getChordColor } from '../lib/chords';
import { getRecommendations } from '../lib/harmony';
import type { Mood } from '../types';

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { setSelectedMood, completeOnboarding } = useSettings();
  const { resetToStarter } = useTimeline();

  const [step, setStep] = useState(1);
  const [mood, setMood] = useState<Mood | null>(null);
  const [starterId, setStarterId] = useState<string | null>(null);

  const starters = mood ? getStartersForMood(mood) : [];
  const recommendations =
    starterId ? getRecommendations(starterId, 1) : [];

  const goStudio = (chordId: string) => {
    resetToStarter(chordId);
    completeOnboarding();
    navigate('/studio');
  };

  const handleMood = (m: Mood) => {
    setMood(m);
    setSelectedMood(m);
    setStep(2);
  };

  const handleStarter = async (chordId: string) => {
    await ensureAudioStarted();
    playChord(chordId);
    setStarterId(chordId);
    setStep(3);
  };

  return (
    <div className="onboarding-page">
      <header className="onboarding-header">
        <p className="onboarding-step">Step {step} / 3</p>
        <h1 className="onboarding-title">vibe-chord</h1>
        <p className="onboarding-subtitle">듣고 고르는 작곡 놀이터</p>
        <button
          type="button"
          className="onboarding-skip"
          onClick={() => {
            completeOnboarding();
            navigate('/studio');
          }}
        >
          건너뛰기
        </button>
      </header>

      {step === 1 && (
        <section className="onboarding-section">
          <h2>어떤 분위기로 시작할까요?</h2>
          <div className="mood-chips">
            {MOOD_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className="mood-chip"
                onClick={() => handleMood(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>
      )}

      {step === 2 && mood && (
        <section className="onboarding-section">
          <h2>시작 코드를 골라보세요</h2>
          <p className="onboarding-hint">탭하면 바로 소리가 납니다</p>
          <div className="starter-cards">
            {starters.map((id) => {
              const chord = getChord(id);
              if (!chord) return null;
              return (
                <button
                  key={id}
                  type="button"
                  className="starter-card"
                  style={{ backgroundColor: getChordColor(chord.mood) }}
                  onClick={() => void handleStarter(id)}
                >
                  <span className="starter-card__label">{chord.label}</span>
                  <span className="starter-card__symbol">{chord.symbol}</span>
                </button>
              );
            })}
          </div>
          <button type="button" className="onboarding-back" onClick={() => setStep(1)}>
            ← 분위기 다시 고르기
          </button>
        </section>
      )}

      {step === 3 && starterId && (
        <section className="onboarding-section">
          <h2>다음 코드도 미리 들어볼까요?</h2>
          <p className="onboarding-hint">추천 중 하나를 탭해 보세요 (선택 사항)</p>
          <ul className="onboarding-recs">
            {recommendations.map((rec) => {
              const chord = getChord(rec.chordId);
              if (!chord) return null;
              return (
                <li key={rec.chordId}>
                  <button
                    type="button"
                    className="onboarding-rec-card"
                    onClick={async () => {
                      await ensureAudioStarted();
                      playChord(rec.chordId);
                    }}
                  >
                    <span>{chord.label}</span>
                    <span className="onboarding-rec-card__hint">{rec.whenToChoose}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button
            type="button"
            className="onboarding-cta"
            onClick={() => goStudio(starterId)}
          >
            스튜디오로 시작 →
          </button>
        </section>
      )}
    </div>
  );
}
