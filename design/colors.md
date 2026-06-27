# Color System

## Brand Palette

- Primary Orange: `#FF6F00`
- Warm Beige: `#C2A26F`
- Dark Charcoal: `#2F2F2F`
- Accent Yellow: `#FFB300`
- Hot Pink: `#FF1744`

## Semantic Tokens

- `--bg`: 기본 페이지 배경
- `--bg-elevated`: 섹션/패널 배경
- `--bg-card`: 카드/입력/칩 배경
- `--text`, `--text-h`, `--text-muted`: 본문/제목/보조 텍스트
- `--border`: 서피스 구분선
- `--accent`, `--accent-hover`, `--accent-bg`: 주요 인터랙션 색
- `--danger`, `--danger-bg`: 경고·중지 계열
- `--success`: 긍정 피드백
- `--score-surface`, `--score-divider`: 스튜디오 악보 영역 흰 배경/구분선

정확한 값은 [`web/src/styles/tokens.css`](../web/src/styles/tokens.css)를 기준으로 사용합니다.

## Mood Colors (음악 의미 색, 유지)

아래 색상은 브랜드 컬러와 별도로, 코드 진행의 감정 의미를 전달하기 위해 유지합니다.

- bright: `#FFD166`
- calm: `#7EB8DA`
- dreamy: `#C4A1FF`
- tense: `#FF6B6B`

출처: [`web/src/lib/chords.ts`](../web/src/lib/chords.ts)

## Usage Rules

- Primary CTA는 한 화면에 1개 원칙 (보통 Play 버튼)
- 텍스트는 가능한 `--text` 또는 `--text-h` 사용
- Hot Pink는 경고/중지/즉시 주의 요소에 한정
- 컴포넌트에 직접 HEX 하드코딩하지 않고 semantic token만 사용
