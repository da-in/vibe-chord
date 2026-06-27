# Component Rules

## Button

- **Primary**: `--accent` 배경 + `--text-h` 텍스트, 화면당 1개
- **Secondary**: `--bg-card` 배경 + `--border`, hover 시 accent 강조
- **Danger**: `--danger` 계열 색으로 중지/경고 액션 표시

모션:

- hover: `--duration-normal`
- active: `transform: scale(var(--press-scale))`
- easing: `--ease-bounce`

## Card / Panel

- 기본 배경: `--bg-card`
- 강조 섹션: `--bg-elevated`
- 경계선: `1px solid var(--border)` (중요 패널은 2px 가능)
- 모서리: `--radius`, `--radius-sm`

## Chip

- 기본: 베이지 카드 톤 (`--bg-card`)
- hover/selected: `--accent-bg` + `--accent` 또는 `--text-h`

## Do / Don't

Do:

- semantic token으로만 스타일 지정
- 상태(hover/active/selected) 차이를 명확히 표현
- 모바일 터치 영역 `--tap-min` 이상 유지

Don't:

- 컴포넌트에 직접 HEX 값 하드코딩
- Primary 버튼을 같은 화면에 여러 개 배치
- display 폰트를 본문에 사용
