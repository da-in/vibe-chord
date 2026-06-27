export interface ProgressionPreset {
  id: string;
  name: string;
  description: string;
  chordIds: string[];
}

export const PRESETS: ProgressionPreset[] = [
  {
    id: 'pop',
    name: '4코드 팝',
    description: 'I → V → vi → IV — 팝송에서 가장 흔한 진행',
    chordIds: ['C', 'G', 'Am', 'F'],
  },
  {
    id: 'canon',
    name: '카논 진행',
    description: '파achelbel 스타일 — 서정적이고 익숙한 흐름',
    chordIds: ['C', 'G', 'Am', 'Em', 'F', 'C', 'F', 'G'],
  },
  {
    id: 'fifties',
    name: '50s 진행',
    description: 'I → vi → IV → V — 클래식 로큰롤 느낌',
    chordIds: ['C', 'Am', 'F', 'G'],
  },
  {
    id: 'sensitive',
    name: '감성 진행',
    description: 'vi → IV → I → V — 잔잔하게 시작하는 발라드',
    chordIds: ['Am', 'F', 'C', 'G'],
  },
  {
    id: 'jazz-ii-v',
    name: 'ii-V-I',
    description: 'Dm7 → G7 → C — 재즈에서 가장 기본적인 해결',
    chordIds: ['Dm7', 'G7', 'C', 'C'],
  },
  {
    id: 'dreamy',
    name: '몽환 진행',
    description: 'maj7 코드 위주 — 부드럽고 몽환적인 분위기',
    chordIds: ['Cmaj7', 'Am7', 'Fmaj7', 'G7'],
  },
];

export function getPreset(id: string): ProgressionPreset | undefined {
  return PRESETS.find((p) => p.id === id);
}
