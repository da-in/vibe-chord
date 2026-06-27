import type { ChordRecommendation } from '../types';
import { CHORDS } from './chords';

type Rule = {
  chordId: string;
  whenToChoose: string;
  reason?: string;
};

const STARTING: Rule[] = [
  { chordId: 'C', whenToChoose: '밝고 희망적인 곡 시작' },
  { chordId: 'Am', whenToChoose: '잔잔한 감성으로 시작할 때' },
  { chordId: 'F', whenToChoose: '따뜻하고 편안하게 시작' },
  { chordId: 'G', whenToChoose: '경쾌하게 도입할 때' },
];

const NEXT: Record<string, Rule[]> = {
  C: [
    { chordId: 'Am', whenToChoose: '잔잔하게 이어갈 때', reason: 'I → vi' },
    { chordId: 'F', whenToChoose: '넓고 따뜻한 느낌을 줄 때', reason: 'I → IV' },
    { chordId: 'G', whenToChoose: '에너지와 해결감을 줄 때', reason: 'I → V' },
    { chordId: 'Fmaj7', whenToChoose: '몽환적으로 풀고 싶을 때', reason: 'I → IVmaj7' },
  ],
  Am: [
    { chordId: 'F', whenToChoose: '더 넓게 펼칠 때', reason: 'vi → IV' },
    { chordId: 'G', whenToChoose: '다음 마디로 밀고 갈 때', reason: 'vi → V' },
    { chordId: 'Dm', whenToChoose: '조금 더 어둡게 갈 때', reason: 'vi → ii' },
    { chordId: 'C', whenToChoose: '밝게 돌아올 때', reason: 'vi → I' },
  ],
  F: [
    { chordId: 'G', whenToChoose: '긴장감을 올릴 때', reason: 'IV → V' },
    { chordId: 'C', whenToChoose: '안정감 있게 마무리할 때', reason: 'IV → I' },
    { chordId: 'Dm', whenToChoose: '부드럽게 이어갈 때', reason: 'IV → ii' },
    { chordId: 'Am', whenToChoose: '감성적으로 흘릴 때', reason: 'IV → vi' },
  ],
  G: [
    { chordId: 'C', whenToChoose: '홈으로 돌아올 때', reason: 'V → I (cadence)' },
    { chordId: 'Am', whenToChoose: '해결 대신 잔잔히 이어갈 때', reason: 'V → vi (deceptive)' },
    { chordId: 'Em', whenToChoose: '중간 정거장으로 쉴 때', reason: 'V → iii' },
    { chordId: 'Dm', whenToChoose: '한 박 더 끌고 갈 때', reason: 'V → ii' },
  ],
  Dm: [
    { chordId: 'G', whenToChoose: '전형적인 팝 진행으로', reason: 'ii → V' },
    { chordId: 'G7', whenToChoose: '더 강한 해결감을 줄 때', reason: 'ii → V7' },
    { chordId: 'Am', whenToChoose: '감성 라인을 이어갈 때', reason: 'ii → vi' },
    { chordId: 'F', whenToChoose: '서브도미넌트로 풀 때', reason: 'ii → IV' },
  ],
  Em: [
    { chordId: 'Am', whenToChoose: '같은 무드로 이어갈 때', reason: 'iii → vi' },
    { chordId: 'F', whenToChoose: '넓은 화음으로 전환할 때', reason: 'iii → IV' },
    { chordId: 'C', whenToChoose: '밝은 톤으로 돌아올 때', reason: 'iii → I' },
    { chordId: 'Bdim', whenToChoose: '짧은 긴장을 줄 때', reason: 'iii → vii°' },
  ],
  G7: [
    { chordId: 'C', whenToChoose: '도미넌트에서 홈으로', reason: 'V7 → I' },
    { chordId: 'Am', whenToChoose: '기대를 살짝 비틀 때', reason: 'V7 → vi' },
    { chordId: 'F', whenToChoose: '플래그넌트 해결로', reason: 'V7 → IV' },
  ],
  Fmaj7: [
    { chordId: 'G', whenToChoose: '몽환에서 에너지로', reason: 'IVmaj7 → V' },
    { chordId: 'Am', whenToChoose: '부드럽게 이어갈 때', reason: 'IVmaj7 → vi' },
    { chordId: 'C', whenToChoose: '밝게 정리할 때', reason: 'IVmaj7 → I' },
  ],
  Am7: [
    { chordId: 'Dm7', whenToChoose: '재즈 느낌으로 이어갈 때', reason: 'vi7 → ii7' },
    { chordId: 'F', whenToChoose: '세븐스를 풀고 싶을 때', reason: 'vi7 → IV' },
    { chordId: 'G', whenToChoose: '다음 화음으로 밀 때', reason: 'vi7 → V' },
  ],
  Dm7: [
    { chordId: 'G7', whenToChoose: 'ii-V 느낌으로', reason: 'ii7 → V7' },
    { chordId: 'G', whenToChoose: '클래식 ii-V로', reason: 'ii7 → V' },
    { chordId: 'F', whenToChoose: '부드럽게 우회할 때', reason: 'ii7 → IV' },
  ],
  E7: [
    { chordId: 'Am', whenToChoose: '세컨더리 도미넌트 해결', reason: 'V7/ii → ii' },
    { chordId: 'Am7', whenToChoose: '부드럽게 Am으로', reason: 'V7/ii → ii7' },
    { chordId: 'F', whenToChoose: '우회 해결할 때', reason: 'V7/ii → IV' },
  ],
  Bdim: [
    { chordId: 'C', whenToChoose: '불안에서 안정으로', reason: 'vii° → I' },
    { chordId: 'Am', whenToChoose: '짧은 통행 후 vi로', reason: 'vii° → vi' },
    { chordId: 'F', whenToChoose: '서브도미넌트로 풀 때', reason: 'vii° → IV' },
  ],
};

function toRecommendations(rules: Rule[]): ChordRecommendation[] {
  return rules
    .filter((rule) => rule.chordId in CHORDS)
    .slice(0, 3)
    .map(({ chordId, whenToChoose, reason }) => ({
      chordId,
      whenToChoose,
      reason,
    }));
}

export function getRecommendations(
  lastChordId: string | null,
  timelineLength: number,
): ChordRecommendation[] {
  if (!lastChordId || timelineLength === 0) {
    return toRecommendations(STARTING);
  }

  const rules = NEXT[lastChordId] ?? NEXT.C;
  return toRecommendations(rules);
}
