# vibe-chord Design System

`design/` 폴더는 `docs/` 기획 문서와 분리된 UI 디자인 시스템 기준 문서입니다.

## 목적

- 브랜드 색상, 타이포그래피, 컴포넌트 규칙의 단일 기준 제공
- `web/src/styles/tokens.css` 구현 토큰과 1:1 매핑 유지
- Step 12 스케치 방향을 구현 스타일로 일관되게 연결

## 핵심 표현

- **Bold / High-Contrast / Energetic**: 오렌지 배경과 강한 대비로 첫인상 강화
- **Retro-Modern**: 따뜻한 베이지 서피스 + 깔끔한 산세리프 + 포인트 디스플레이 폰트
- **Intuitive / Tactile / Playful**: 클릭 가능한 요소를 명확히, 눌림 반응과 가벼운 모션 제공

## 문서 맵

- [colors.md](./colors.md): Brand/Semantic/Mood 색상 체계
- [typography.md](./typography.md): 폰트, 스케일, 사용 규칙
- [components.md](./components.md): Button/Card/Chip/Panel 컴포넌트 규칙

## 연결 문서

- UX/플로우 합의: [`docs/12_sketch_and_decision.md`](../docs/12_sketch_and_decision.md)
- 구현 토큰: [`web/src/styles/tokens.css`](../web/src/styles/tokens.css)
