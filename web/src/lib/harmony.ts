import type { ChordRecommendation } from '../types';
import { CHORDS } from './chords';

type Rule = {
  chordId: string;
  whenToChoose: string;
  reason?: string;
  reasonDetail?: string;
};

const STARTING: Rule[] = [
  {
    chordId: 'C',
    whenToChoose: '밝고 희망적인 곡 시작',
    reason: 'I (tonic)',
    reasonDetail:
      '밝은 1도 코드로 시작하면 곡 전체가 희망적인 분위기를 갖기 쉬워요. 왜냐하면 1도는 이 키의 "집"이라 듣는 순간 편안하고 긍정적인 인상을 주기 때문이에요.',
  },
  {
    chordId: 'Am',
    whenToChoose: '잔잔한 감성으로 시작할 때',
    reason: 'vi (relative minor)',
    reasonDetail:
      '6도 코드로 시작하면 잔잔하고 서정적인 무드가 바로 잡혀요. 왜냐하면 6도는 1도와 같은 음을 쓰지만 더 어두운 색을 띠어, 밝음보다 감성이 앞서게 만들기 때문이에요.',
  },
  {
    chordId: 'F',
    whenToChoose: '따뜻하고 편안하게 시작',
    reason: 'IV (subdominant)',
    reasonDetail:
      '4도 코드로 시작하면 따뜻하고 포근한 느낌이에요. 왜냐하면 4도는 1도와 가까운 안정적인 화음이라 긴장 없이 편안하게 들리기 때문이에요.',
  },
  {
    chordId: 'G',
    whenToChoose: '경쾌하게 도입할 때',
    reason: 'V (dominant)',
    reasonDetail:
      '5도 코드로 시작하면 에너지가 바로 살아나요. 왜냐하면 5도는 "곧 1도로 간다"는 긴장을 품고 있어서, 첫 코드부터 다음 전개를 기대하게 만들기 때문이에요.',
  },
];

const NEXT: Record<string, Rule[]> = {
  C: [
    {
      chordId: 'Am',
      whenToChoose: '잔잔하게 이어갈 때',
      reason: 'I → vi',
      reasonDetail:
        '밝은 1도에서 잔잔한 6도로 가면 분위기가 부드럽게 내려가요. 왜냐하면 6도는 1도와 같은 음을 쓰지만 더 어두운 색이라, 밝음에서 감성으로 자연스럽게 전환되기 때문이에요.',
    },
    {
      chordId: 'F',
      whenToChoose: '넓고 따뜻한 느낌을 줄 때',
      reason: 'I → IV',
      reasonDetail:
        '1도에서 4도로 가면 넓고 따뜻한 공간이 펼쳐져요. 왜냐하면 4도는 1도와 가까운 안정적인 화음이라 긴장 없이 풍성하게 느껴지기 때문이에요.',
    },
    {
      chordId: 'G',
      whenToChoose: '에너지와 해결감을 줄 때',
      reason: 'I → V',
      reasonDetail:
        '1도에서 5도로 가면 에너지가 올라가며 다음 코드를 기대하게 해요. 왜냐하면 5도는 "곧 1도로 돌아간다"는 긴장을 만들어, 진행이 앞으로 밀려가는 느낌을 주기 때문이에요.',
    },
    {
      chordId: 'Fmaj7',
      whenToChoose: '몽환적으로 풀고 싶을 때',
      reason: 'I → IVmaj7',
      reasonDetail:
        '1도에서 4도 7th로 가면 몽환적이고 부드러운 공기가 생겨요. 왜냐하면 7th 음이 4도에 얹히면서 밝은 1도보다 더 넓고 꿈같은 색을 띠기 때문이에요.',
    },
  ],
  Am: [
    {
      chordId: 'F',
      whenToChoose: '더 넓게 펼칠 때',
      reason: 'vi → IV',
      reasonDetail:
        '잔잔한 6도에서 4도로 가면 쓸쓸함 속에 따뜻함이 더해져요. 왜냐하면 4도는 6도와 잘 어울리는 안정적인 화음이라, 감성적인 무드가 넓게 펼쳐지기 때문이에요.',
    },
    {
      chordId: 'G',
      whenToChoose: '다음 마디로 밀고 갈 때',
      reason: 'vi → V',
      reasonDetail:
        '6도에서 5도로 가면 감성에서 경쾌함으로 분위기가 전환돼요. 왜냐하면 5도는 진행을 앞으로 밀어 주는 역할을 해서, 잔잔한 흐름에 긴장감과 에너지가 더해지기 때문이에요.',
    },
    {
      chordId: 'Dm',
      whenToChoose: '조금 더 어둡게 갈 때',
      reason: 'vi → ii',
      reasonDetail:
        '6도에서 2도로 가면 분위기가 조금 더 깊고 어두워져요. 왜냐하면 2도는 6도와 비슷한 색을 공유하면서도 한층 더 쓸쓸한 느낌을 주기 때문이에요.',
    },
    {
      chordId: 'C',
      whenToChoose: '밝게 돌아올 때',
      reason: 'vi → I',
      reasonDetail:
        '6도에서 1도로 가면 잔잔한 무드에서 다시 밝은 안정감으로 돌아와요. 왜냐하면 1도는 이 진행의 "집"이라, 어두운 감성 뒤에 해결감과 희망이 더 크게 느껴지기 때문이에요.',
    },
  ],
  F: [
    {
      chordId: 'G',
      whenToChoose: '긴장감을 올릴 때',
      reason: 'IV → V',
      reasonDetail:
        '4도에서 5도로 가면 긴장감이 살짝 올라가 해결을 기다리게 해요. 왜냐하면 4도의 따뜻함 뒤에 5도의 "곧 끝난다"는 신호가 오면, 듣는 사람이 다음 코드를 기대하게 되기 때문이에요.',
    },
    {
      chordId: 'C',
      whenToChoose: '안정감 있게 마무리할 때',
      reason: 'IV → I',
      reasonDetail:
        '4도에서 1도로 가면 넓은 화음에서 편안한 홈으로 정리돼요. 왜냐하면 4도와 1도는 가까운 관계라, 4도의 따뜻함이 1도의 안정감으로 자연스럽게 이어지기 때문이에요.',
    },
    {
      chordId: 'Dm',
      whenToChoose: '부드럽게 이어갈 때',
      reason: 'IV → ii',
      reasonDetail:
        '4도에서 2도로 가면 따뜻함이 부드럽게 이어져요. 왜냐하면 2도는 4도와 잘 맞는 화음이라, 급격한 변화 없이 자연스럽게 흘러가기 때문이에요.',
    },
    {
      chordId: 'Am',
      whenToChoose: '감성적으로 흘릴 때',
      reason: 'IV → vi',
      reasonDetail:
        '4도에서 6도로 가면 따뜻함이 감성적인 잔잔함으로 이어져요. 왜냐하면 6도는 4도와 같은 키의 안정적인 화음이라, 넓은 4도 뒤에 서정적인 색이 더해지기 때문이에요.',
    },
  ],
  G: [
    {
      chordId: 'C',
      whenToChoose: '홈으로 돌아올 때',
      reason: 'V → I (cadence)',
      reasonDetail:
        '5도에서 1도로 가면 긴장이 풀리며 안정감 있게 마무리되는 느낌이에요. 왜냐하면 5도는 "곧 홈으로 간다"는 긴장을 만든 뒤, 1도로 돌아올 때 해결감이 가장 크게 느껴지기 때문이에요.',
    },
    {
      chordId: 'Am',
      whenToChoose: '해결 대신 잔잔히 이어갈 때',
      reason: 'V → vi (deceptive)',
      reasonDetail:
        '5도에서 6도로 가면 기대를 살짝 비틀어 감성적으로 이어져요. 왜냐하면 1도로 갈 것 같던 5도가 6도로 향하면, 해결 대신 서정적인 여운이 남기 때문이에요.',
    },
    {
      chordId: 'Em',
      whenToChoose: '중간 정거장으로 쉴 때',
      reason: 'V → iii',
      reasonDetail:
        '5도에서 3도로 가면 긴장이 풀리며 잠깐 숨 고르는 느낌이에요. 왜냐하면 3도는 5도보다 부드러운 화음이라, 강한 5도 뒤에 잠깐의 휴식 같은 공간을 만들기 때문이에요.',
    },
    {
      chordId: 'Dm',
      whenToChoose: '한 박 더 끌고 갈 때',
      reason: 'V → ii',
      reasonDetail:
        '5도에서 2도로 가면 해결을 한 박 더 미루는 느낌이에요. 왜냐하면 2도는 다시 5도로 이어지기 쉬운 화음이라, 마무리 직전에 긴장을 조금 더 끌고 갈 수 있기 때문이에요.',
    },
  ],
  Dm: [
    {
      chordId: 'G',
      whenToChoose: '전형적인 팝 진행으로',
      reason: 'ii → V',
      reasonDetail:
        '2도에서 5도로 가면 쓸쓸함에서 긴장감으로 밀고 나가요. 왜냐하면 2도-5도는 팝에서 가장 많이 쓰이는 연결 중 하나라, 자연스럽게 "다음이 기대된다"는 느낌을 주기 때문이에요.',
    },
    {
      chordId: 'G7',
      whenToChoose: '더 강한 해결감을 줄 때',
      reason: 'ii → V7',
      reasonDetail:
        '2도에서 5도 7th로 가면 해결을 향한 긴장이 더 강해져요. 왜냐하면 7th 음이 5도에 얹히면 "곧 1도로 간다"는 신호가 더 선명해지기 때문이에요.',
    },
    {
      chordId: 'Am',
      whenToChoose: '감성 라인을 이어갈 때',
      reason: 'ii → vi',
      reasonDetail:
        '2도에서 6도로 가면 어두운 톤이 이어지며 깊이가 더해져요. 왜냐하면 2도와 6도는 비슷한 색을 공유해서, 쓸쓸한 무드가 자연스럽게 유지되기 때문이에요.',
    },
    {
      chordId: 'F',
      whenToChoose: '서브도미넌트로 풀 때',
      reason: 'ii → IV',
      reasonDetail:
        '2도에서 4도로 가면 쓸쓸함이 따뜻함으로 풀려요. 왜냐하면 4도는 2도와 잘 맞는 안정적인 화음이라, 어두운 2도 뒤에 넓고 포근한 느낌이 더해지기 때문이에요.',
    },
  ],
  Em: [
    {
      chordId: 'Am',
      whenToChoose: '같은 무드로 이어갈 때',
      reason: 'iii → vi',
      reasonDetail:
        '3도에서 6도로 가면 비슷한 감성이 이어지며 흐름이 안정적이에요. 왜냐하면 3도와 6도는 같은 키에서 가까운 관계라, 부드럽게 같은 무드로 넘어가기 때문이에요.',
    },
    {
      chordId: 'F',
      whenToChoose: '넓은 화음으로 전환할 때',
      reason: 'iii → IV',
      reasonDetail:
        '3도에서 4도로 가면 섬세한 느낌에서 넓고 따뜻한 공간으로 펼쳐져요. 왜냐하면 4도는 3도보다 풍성한 화음이라, 잔잔한 3도 뒤에 따뜻함이 더해지기 때문이에요.',
    },
    {
      chordId: 'C',
      whenToChoose: '밝은 톤으로 돌아올 때',
      reason: 'iii → I',
      reasonDetail:
        '3도에서 1도로 가면 분위기가 밝아지며 에너지가 살아나요. 왜냐하면 1도는 이 진행의 "집"이라, 섬세한 3도 뒤에 안정적이고 밝은 해결감이 더해지기 때문이에요.',
    },
    {
      chordId: 'Bdim',
      whenToChoose: '짧은 긴장을 줄 때',
      reason: 'iii → vii°',
      reasonDetail:
        '3도에서 7도 감화음으로 가면 짧고 날카로운 긴장이 생겨요. 왜냐하면 감화음은 불안정한 색을 띠어, 다음 코드로 빠르게 이끌어 가기 때문이에요.',
    },
  ],
  G7: [
    {
      chordId: 'C',
      whenToChoose: '도미넌트에서 홈으로',
      reason: 'V7 → I',
      reasonDetail:
        '5도 7th에서 1도로 가면 강한 해결감으로 홈에 확실히 돌아와요. 왜냐하면 7th 음이 1도의 "도"로 자연스럽게 풀리면서, 긴장이 한 번에 해소되기 때문이에요.',
    },
    {
      chordId: 'Am',
      whenToChoose: '기대를 살짝 비틀 때',
      reason: 'V7 → vi',
      reasonDetail:
        '5도 7th에서 6도로 가면 기대를 비틀어 서정적으로 마무리돼요. 왜냐하면 1도로 갈 것 같던 강한 5도 7th가 6도로 향하면, 해결 대신 감성적인 여운이 남기 때문이에요.',
    },
    {
      chordId: 'F',
      whenToChoose: '플래그넌트 해결로',
      reason: 'V7 → IV',
      reasonDetail:
        '5도 7th에서 4도로 가면 해결 직전에 한 번 더 넓어지는 느낌이에요. 왜냐하면 4도는 1도와 가까운 화음이라, 5도 7th의 긴장 뒤에 따뜻한 여운을 남기기 때문이에요.',
    },
  ],
  Fmaj7: [
    {
      chordId: 'G',
      whenToChoose: '몽환에서 에너지로',
      reason: 'IVmaj7 → V',
      reasonDetail:
        '4도 7th에서 5도로 가면 몽환적인 공기에서 에너지가 살아나요. 왜냐하면 5도는 진행을 앞으로 밀어 주는 역할을 해서, 부드러운 4도 7th 뒤에 긴장과 기대가 더해지기 때문이에요.',
    },
    {
      chordId: 'Am',
      whenToChoose: '부드럽게 이어갈 때',
      reason: 'IVmaj7 → vi',
      reasonDetail:
        '4도 7th에서 6도로 가면 몽환적이고 부드러운 흐름이 이어져요. 왜냐하면 6도는 4도 7th와 잘 어울리는 화음이라, 꿈같은 색이 감성적으로 유지되기 때문이에요.',
    },
    {
      chordId: 'C',
      whenToChoose: '밝게 정리할 때',
      reason: 'IVmaj7 → I',
      reasonDetail:
        '4도 7th에서 1도로 가면 몽환적인 넓음에서 밝은 안정감으로 정리돼요. 왜냐하면 1도는 이 진행의 "집"이라, 7th의 부드러움 뒤에 편안한 해결감이 더해지기 때문이에요.',
    },
  ],
  Am7: [
    {
      chordId: 'Dm7',
      whenToChoose: '재즈 느낌으로 이어갈 때',
      reason: 'vi7 → ii7',
      reasonDetail:
        '6도 7th에서 2도 7th로 가면 부드럽고 재즈 같은 흐름이 이어져요. 왜냐하면 7th가 얹힌 6도-2도 연결은 색감이 풍부하면서도 자연스럽게 이어지기 때문이에요.',
    },
    {
      chordId: 'F',
      whenToChoose: '세븐스를 풀고 싶을 때',
      reason: 'vi7 → IV',
      reasonDetail:
        '6도 7th에서 4도로 가면 7th의 색이 풀리며 따뜻해져요. 왜냐하면 4도는 7th 없이도 넓은 느낌을 주는 화음이라, 부드러운 6도 7th 뒤에 포근함이 더해지기 때문이에요.',
    },
    {
      chordId: 'G',
      whenToChoose: '다음 화음으로 밀 때',
      reason: 'vi7 → V',
      reasonDetail:
        '6도 7th에서 5도로 가면 잔잔한 무드에서 에너지가 올라가요. 왜냐하면 5도는 진행을 앞으로 밀어 주는 역할을 해서, 부드러운 6도 7th 뒤에 긴장과 기대가 더해지기 때문이에요.',
    },
  ],
  Dm7: [
    {
      chordId: 'G7',
      whenToChoose: 'ii-V 느낌으로',
      reason: 'ii7 → V7',
      reasonDetail:
        '2도 7th에서 5도 7th로 가면 재즈에서 많이 쓰이는 ii-V 느낌이에요. 왜냐하면 7th가 얹힌 2도-5도 연결은 해결을 향한 긴장을 단계적으로 쌓아 주기 때문이에요.',
    },
    {
      chordId: 'G',
      whenToChoose: '클래식 ii-V로',
      reason: 'ii7 → V',
      reasonDetail:
        '2도 7th에서 5도로 가면 클래식한 ii-V 진행의 느낌이에요. 왜냐하면 2도는 5도로 자연스럽게 이어지는 화음이라, "다음이 기대된다"는 흐름을 만들기 때문이에요.',
    },
    {
      chordId: 'F',
      whenToChoose: '부드럽게 우회할 때',
      reason: 'ii7 → IV',
      reasonDetail:
        '2도 7th에서 4도로 가면 해결을 향하지 않고 부드럽게 우회해요. 왜냐하면 4도는 2도 7th와 잘 맞는 안정적인 화음이라, 7th의 색을 유지하면서 넓게 펼쳐지기 때문이에요.',
    },
  ],
  E7: [
    {
      chordId: 'Am',
      whenToChoose: '세컨더리 도미넌트 해결',
      reason: 'V7/ii → ii',
      reasonDetail:
        'E7에서 Am으로 가면 2도(Am)를 향한 강한 긴장이 풀려요. 왜냐하면 E7은 Am을 목표로 하는 "임시 5도"라, Am으로 갈 때 해결감이 선명하게 느껴지기 때문이에요.',
    },
    {
      chordId: 'Am7',
      whenToChoose: '부드럽게 Am으로',
      reason: 'V7/ii → ii7',
      reasonDetail:
        'E7에서 Am7으로 가면 강한 긴장이 부드럽게 Am으로 풀려요. 왜냐하면 7th가 얹힌 Am은 E7의 해결을 더 넓고 부드럽게 받아 주기 때문이에요.',
    },
    {
      chordId: 'F',
      whenToChoose: '우회 해결할 때',
      reason: 'V7/ii → IV',
      reasonDetail:
        'E7에서 F로 가면 Am 대신 4도로 우회해요. 왜냐하면 F는 E7의 긴장을 바로 풀지 않고, 넓은 4도를 거쳐 다른 방향으로 흘러가게 만들기 때문이에요.',
    },
  ],
  Bdim: [
    {
      chordId: 'C',
      whenToChoose: '불안에서 안정으로',
      reason: 'vii° → I',
      reasonDetail:
        '7도 감화음에서 1도로 가면 날카로운 불안이 안정으로 풀려요. 왜냐하면 감화음은 불안정한 색을 띠다가, 1도로 가면서 "집"의 편안함으로 해소되기 때문이에요.',
    },
    {
      chordId: 'Am',
      whenToChoose: '짧은 통행 후 vi로',
      reason: 'vii° → vi',
      reasonDetail:
        '7도 감화음에서 6도로 가면 짧은 긴장 뒤 감성적으로 이어져요. 왜냐하면 6도는 1도 대신 갈 수 있는 안정적인 화음이라, 감화음의 날카로움이 서정적인 색으로 바뀌기 때문이에요.',
    },
    {
      chordId: 'F',
      whenToChoose: '서브도미넌트로 풀 때',
      reason: 'vii° → IV',
      reasonDetail:
        '7도 감화음에서 4도로 가면 날카로운 긴장이 따뜻함으로 풀려요. 왜냐하면 4도는 넓고 안정적인 화음이라, 감화음의 불안이 포근한 공간으로 전환되기 때문이에요.',
    },
  ],
};

function toRecommendations(rules: Rule[]): ChordRecommendation[] {
  return rules
    .filter((rule) => rule.chordId in CHORDS)
    .slice(0, 3)
    .map(({ chordId, whenToChoose, reason, reasonDetail }) => ({
      chordId,
      whenToChoose,
      reason,
      reasonDetail,
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
