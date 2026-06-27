# vibe-chord

**듣고 고르는 작곡 놀이터** — 화성학·DAW 없이 코드 진행을 탐색하고, 4마디까지 만들어 Play로 들을 수 있는 웹 앱.

이 레포는 [vibe sprint](https://github.com/da-in/vibe-chord) 14단계로 기획한 **vibe-chord** 해커톤 MVP와, 스프린트 문서 템플릿(`docs/`)을 함께 담고 있습니다.

## Live demo

**https://web-sand-rho-51.vercel.app**

| 페이지 | 경로 | 설명 |
|--------|------|------|
| 온보딩 | `/onboarding` | 분위기 → 시작 코드 → 스튜디오 (건너뛰기 가능) |
| 작곡 스튜디오 | `/studio` | 타임라인 · 추천 · Play · 설정 |
| 코드 탐색 | `/explore` | 24코드 그리드 · 유명 진행 프리셋 |
| 데모 공유 | `/share` | mp3·링크 (mock) |

## 주요 기능

- **즉시 재생** — 코드 블록·추천 카드 탭 = 바로 소리
- **화성학 추천** — 다음 코드 3~4개 + 「이럴 때 고르면 좋다」 안내
- **타임라인** — 색 블록, 드래그 순서 변경, `+` 끼워 넣기, 1~2마디 길이
- **반주** — Play 시 드럼·베이스 패턴
- **4코드 완성** — 배지 + 자동 재생 (설정에서 8코드까지 확장 가능)

구현 범위·우선순위는 [`docs/13_priority_matrix.md`](docs/13_priority_matrix.md), 진행 이력은 [GitHub Issues](https://github.com/da-in/vibe-chord/issues)를 기준으로 합니다.

## 로컬 실행

```bash
cd web
npm install
npm run dev
```

브라우저에서 `http://localhost:5173` — 첫 방문 시 `/onboarding`, 이후 `/studio`.

```bash
npm run build    # 프로덕션 빌드
npm run preview  # 빌드 결과 미리보기
```

**Node.js** 20.19+ 권장 (20.18에서도 Vite 6으로 동작).

## 기술 스택

| 영역 | 선택 |
|------|------|
| UI | React 19, TypeScript, React Router |
| 빌드 | Vite 6 |
| 오디오 | [Tone.js](https://tonejs.github.io/) |
| 배포 | [Vercel](https://vercel.com) (`web/`) |

## 프로젝트 구조

```
vibe-chord/
├── web/                 # MVP 웹 앱 (Vite)
│   └── src/
│       ├── pages/       # onboarding, studio, explore, share
│       ├── components/
│       ├── context/     # timeline, settings
│       └── lib/         # chords, harmony, audio
├── docs/                # 스프린트 01~14 산출물
├── scripts/             # Issue 생성 등 보조 스크립트
└── AGENTS.md            # Sprint Master 페르소나
```

## Vercel 배포

루트가 아닌 **`web`** 디렉터리를 프로젝트 루트로 연결합니다.

1. [Vercel](https://vercel.com) → Import `da-in/vibe-chord`
2. **Root Directory:** `web`
3. Framework Preset: Vite (자동 감지)
4. Build: `npm run build` · Output: `dist`

CLI:

```bash
cd web
vercel --prod
```

SPA 라우팅(`react-router-dom`)은 [`web/vercel.json`](web/vercel.json)의 rewrite로 처리합니다.

---

## vibe sprint (문서 템플릿)

해커톤·스프린트에서 **아이디어 → MVP**까지 가는 14단계 워크숍 흐름과 AI 에이전트용 Guide·프롬프트 예시입니다.

| 구간 | Step | 한 줄 요약 |
|------|------|-----------|
| **① 팀·문제 이해** | 01 → 07 | 타겟, 기존 여정, Pain/Wow, 키워드 |
| **② 아이디어 구체화** | 08 → 11 | HMW, 기능 목록, 페이지, 우리 서비스 여정 |
| **③ 만들기** | 12 → 14 | 스케치 → 우선순위 → GitHub Issue 구현 |

| Step | 템플릿 |
|------|--------|
| 03~14 | [`docs/03`](docs/03_service_goal_target_value.md) … [`docs/14`](docs/14_development.md) |

- Step 04 = *지금 세상*의 여정 · Step 11 = *우리 서비스* 여정  
- Step 09·10 = 기능 수집·배치 · **Step 13** = 1~4순위·스펙 아웃  
- Step 14 이후 상태 = **GitHub Issues**

막히면 에이전트에게 「지금 Step 몇?」 — [`AGENTS.md`](AGENTS.md) Sprint Master가 해당 `docs/`를 안내합니다.

## License

MIT (템플릿·MVP 코드 — 팀 fork 후 자유롭게 수정)
