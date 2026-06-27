import { getChord } from './chords';

const PAIR_FEEL: Record<string, string> = {
  'C-Am': '밝은 톤에서 잔잔한 감성으로 자연스럽게 내려갑니다',
  'C-F': '넓고 따뜻한 느낌으로 펼쳐집니다',
  'C-G': '에너지가 올라가며 다음 코드를 기대하게 합니다',
  'Am-F': '쓸쓸함 속에 따뜻한 위로가 더해집니다',
  'Am-G': '감성에서 경쾌함으로 분위기가 전환됩니다',
  'Am-C': '잔잔한 무드에서 다시 밝은 안정감으로 돌아옵니다',
  'F-G': '긴장감이 살짝 올라가 해결을 기다리게 합니다',
  'F-C': '넓은 화음에서 편안한 홈으로 정리됩니다',
  'F-Am': '따뜻함이 감성적인 잔잔함으로 이어집니다',
  'G-C': '전형적인 마무리 — 안정감 있게 끝맺습니다',
  'G-Am': '기대를 살짝 비틀어 감성적으로 이어집니다',
  'G-F': '에너지가 풀리며 부드럽게 내려갑니다',
  'Dm-G': '쓸쓸함에서 긴장감으로 밀고 나갑니다',
  'Dm-Am': '어두운 톤이 이어지며 깊이가 더해집니다',
  'G7-C': '강한 해결감 — 홈으로 확실히 돌아옵니다',
  'G7-Am': '기대를 비틀어 서정적으로 마무리합니다',
};

function pairKey(from: string, to: string): string {
  return `${from}-${to}`;
}

export function getConnectionFeel(fromId: string, toId: string): string {
  const direct = PAIR_FEEL[pairKey(fromId, toId)];
  if (direct) return direct;

  const from = getChord(fromId);
  const to = getChord(toId);
  if (!from || !to) return '두 코드가 이어지며 새로운 분위기를 만듭니다';

  if (from.mood === to.mood) {
    return `비슷한 ${from.label} 느낌이 이어지며 흐름이 안정적입니다`;
  }
  if (to.mood === 'bright') return '분위기가 밝아지며 에너지가 살아납니다';
  if (to.mood === 'calm') return '조금 더 잔잔하고 감성적인 방향으로 흘러갑니다';
  if (to.mood === 'dreamy') return '몽환적이고 부드러운 공기로 전환됩니다';
  if (to.mood === 'tense') return '긴장감이 더해져 다음 전개를 기대하게 합니다';

  return `${from.label}에서 ${to.label} 느낌으로 넘어갑니다`;
}

export function getProgressionFeel(chordIds: string[]): string | null {
  if (chordIds.length < 2) return null;
  const last = chordIds[chordIds.length - 2];
  const current = chordIds[chordIds.length - 1];
  return getConnectionFeel(last, current);
}
