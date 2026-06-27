#!/usr/bin/env python3
"""Create GitHub Issues for all F-xx features from docs/13_priority_matrix.md."""

from __future__ import annotations

import json
import subprocess
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]

LABELS = [
    ("1순위", "B60205", "즉시 구현"),
    ("2순위", "D93F0B", "핵심 확장"),
    ("3순위", "FBCA04", "여유 있으면"),
    ("4순위", "C5DEF5", "스펙 아웃·mock"),
]

# (id, title, priority, page, route, done_criteria)
ISSUES = [
    ("F-01", "클릭·탭 즉시 코드 재생", "1순위", "작곡 스튜디오", "/studio",
     "코드 블록·후보 카드 탭 시 0.3초 이내 Web Audio/Tone.js로 해당 코드가 재생된다."),
    ("F-07", "다음 코드 추천 패널", "1순위", "작곡 스튜디오", "/studio",
     "마지막 코드 기준 다음 후보 3~4개가 패널에 표시된다."),
    ("F-08", "추천 후보 ▶ 미리듣기", "1순위", "작곡 스튜디오", "/studio",
     "각 후보에서 직전 코드→후보 2코드 짧게 이어 재생된다."),
    ("F-09", "후보 → 타임라인 추가 + 2코드 재생", "1순위", "작곡 스튜디오", "/studio",
     "후보 클릭 시 타임라인에 추가되고 마지막 2코드가 자동 재생된다."),
    ("F-10", '"이럴 때 고르면 좋다" 한 문장', "1순위", "작곡 스튜디오", "/studio",
     "추천 후보 카드 아래 20자 이내 상황 안내 문구가 표시된다."),
    ("F-12", "화성학 규칙 기반 추천", "1순위", "작곡 스튜디오", "/studio",
     "다이아토닉·cadence 규칙으로 다음 코드 후보가 산출된다."),
    ("F-19", "가로 코드 타임라인 (색 블록)", "1순위", "작곡 스튜디오", "/studio",
     "선택한 코드가 분위기별 색 블록으로 가로 타임라인에 표시된다."),
    ("F-20", '블록 사이 "+" 끼워 넣기', "1순위", "작곡 스튜디오", "/studio",
     "타임라인 블록 사이 + 로 다음 코드 삽입 흐름이 동작한다."),
    ("F-24", "▶ Play / ■ Stop 전체 재생", "1순위", "작곡 스튜디오", "/studio",
     "타임라인 코드 진행이 처음부터 끝까지 순차 재생·정지된다."),
    ("F-31", "내장 MIDI 톤 재생", "1순위", "작곡 스튜디오", "/studio",
     "피아노/기타 MIDI 톤으로 코드가 재생된다(악기 입력 UI 없음)."),
    ("F-33", "Undo", "1순위", "작곡 스튜디오", "/studio",
     "직전 코드 선택/추가를 한 단계 되돌릴 수 있다."),
    ("F-36", "4마디 완성 배지 + 자동 Play", "1순위", "작곡 스튜디오", "/studio",
     "4번째 코드 추가 시 배지·완성 메시지·자동 Play가 실행된다."),
    ("F-41", "인터랙티브 시각화 — 타임라인", "1순위", "작곡 스튜디오", "/studio",
     "타임라인 블록으로 코드 진행을 시각적으로 탐색·실험할 수 있다."),
    ("F-42", "재생 가능한 블록만 (텍스트 코드표 X)", "1순위", "작곡 스튜디오", "/studio",
     "기본 UI에 텍스트 코드표 목록 없이 재생 가능한 블록만 표시된다."),
    ("F-13", '"전체 코드 열기" → /explore', "2순위", "작곡 스튜디오", "/studio",
     "버튼 클릭 시 /explore 페이지로 이동한다."),
    ("F-14", "24 diatonic 코드 그리드", "2순위", "코드·진행 탐색", "/explore",
     "색·분위기 태그와 함께 diatonic 코드 그리드가 표시된다."),
    ("F-15", "그리드 탭 → 재생 + 추가", "2순위", "코드·진행 탐색", "/explore",
     "그리드 코드 탭 시 즉시 재생되고 타임라인에 추가(또는 studio 전달)된다."),
    ("F-16", "유명 진행 프리셋 목록", "2순위", "코드·진행 탐색", "/explore",
     "카논·4코드 팝 등 프리셋 목록이 표시된다."),
    ("F-17", "프리셋 통째로 불러오기", "2순위", "코드·진행 탐색", "/explore",
     "프리셋 선택 시 타임라인에 진행 전체가 로드된다."),
    ("F-21", "블록 드래그 순서 변경", "2순위", "작곡 스튜디오", "/studio",
     "타임라인 블록 순서를 드래그로 변경할 수 있다."),
    ("F-22", "순서 변경 후 미리듣기", "2순위", "작곡 스튜디오", "/studio",
     "순서 변경 후 바뀐 순서로 즉시 미리듣기가 재생된다."),
    ("F-25", "재생 중 블록 하이라이트", "2순위", "작곡 스튜디오", "/studio",
     "Play 중 현재 재생 중인 코드 블록이 하이라이트된다."),
    ("F-30", "Play 시 드럼·베이스 반주", "2순위", "작곡 스튜디오", "/studio",
     "Play 시 간단 4/4 드럼·베이스 패턴이 코드와 함께 재생된다."),
    ("F-32", "모바일·태블릿 반응형 큰 카드 UI", "2순위", "전 페이지", "/*",
     "모바일·태블릿에서 큰 카드·한 손 조작 레이아웃이 동작한다."),
    ("F-03", "분위기 칩 선택", "3순위", "온보딩", "/onboarding",
     "밝은/슬픈/몽환적 등 분위기 칩 선택 UI (MVP는 studio 직행 가능)."),
    ("F-04", "시작 코드 3~4개 카드", "3순위", "온보딩", "/onboarding",
     "분위기 선택 후 시작 코드 카드 3~4개가 제시된다."),
    ("F-05", "한국어 느낌 라벨", "3순위", "온보딩", "/onboarding",
     "코드 카드에 Am 대신 '잔잔한 시작' 등 한국어 라벨이 표시된다."),
    ("F-34", "온보딩 3스텝", "3순위", "온보딩", "/onboarding",
     "분위기→시작 코드→추천 2~3회→Play 3스텝 온보딩이 동작한다."),
    ("F-35", "회원가입·DAW 용어 생략", "3순위", "온보딩", "/onboarding",
     "온보딩에 회원가입·DAW 용어 설명이 없다."),
    ("F-02", "드래그·드롭 추가 시 1마디 재생", "3순위", "작곡 스튜디오", "/studio",
     "타임라인에 드래그·드롭 추가 시 1마디 자동 재생된다."),
    ("F-06", "코드명 고급 모드 토글", "3순위", "작곡 스튜디오", "/studio",
     "토글로 Am·Cmaj7 등 코드명 표시 on/off (기본 숨김)."),
    ("F-11", 'ℹ️ "왜?" 이론 설명', "3순위", "작곡 스튜디오", "/studio",
     "후보 카드에서 cadence 등 짧은 이론 설명을 접기/펼치기로 볼 수 있다."),
    ("F-18", "프리셋 코드 하나씩 교체", "3순위", "코드·진행 탐색", "/explore",
     "불러온 프리셋의 개별 코드를 교체·실험할 수 있다."),
    ("F-23", "블록 길이(마디) 조절", "3순위", "작곡 스튜디오", "/studio",
     "타임라인 블록 길이를 마디 단위로 조절할 수 있다."),
    ("F-26", "BPM 조절", "3순위", "작곡 스튜디오", "/studio",
     "BPM 80~120(기본 90) 조절이 가능하다."),
    ("F-27", "마디 수 슬라이더", "3순위", "작곡 스튜디오", "/studio",
     "4/8마디 등 마디 수 슬라이더가 동작한다."),
    ("F-28", "코드당 박 수 슬라이더", "3순위", "작곡 스튜디오", "/studio",
     "코드당 박 수(1마디 vs 2박) 슬라이더가 동작한다."),
    ("F-29", '"이렇게 이어지면 이런 느낌" 연결 안내', "3순위", "작곡 스튜디오", "/studio",
     "코드 연결 시 분위기·감각 안내 문구가 표시된다."),
    ("F-39", "데모 공유 mp3·링크", "3순위", "데모 공유", "/share",
     "30초 mp3 또는 공유 링크 생성(MVP는 mock·「준비중입니다」 가능)."),
    ("F-37", "자연어·분위기 입력", "4순위", "작곡 스튜디오", "/studio",
     "자연어 입력 UI mock — 제출 시 「준비중입니다」 표시."),
    ("F-38", "자연어 → 타임라인 + Play", "4순위", "작곡 스튜디오", "/studio",
     "스펙 아웃 — F-37과 세트, MVP 제외."),
    ("F-40", "4마디 구간 좋고 나쁨 피드백", "4순위", "작곡 스튜디오", "/studio",
     "스펙 아웃 — MVP 이후 검토."),
]


def run(cmd: list[str], *, check: bool = True) -> subprocess.CompletedProcess[str]:
    print("+", " ".join(cmd))
    return subprocess.run(cmd, check=check, capture_output=True, text=True)


def ensure_labels() -> None:
    existing = run(["gh", "label", "list", "--limit", "100"]).stdout
    for name, color, desc in LABELS:
        if name in existing:
            continue
        run(["gh", "label", "create", name, "--color", color, "--description", desc])


def body(fid: str, title: str, page: str, route: str, done: str, priority: str) -> str:
    mock_note = ""
    if priority == "4순위":
        mock_note = "\n> **Note:** mock 또는 스펙 아웃 — Step 13 기준.\n"
    elif fid == "F-39":
        mock_note = "\n> **Note:** MVP 데모는 Play로 충분. mock 가능.\n"
    return f"""## {fid}: {title}
{mock_note}
| 항목 | 내용 |
|------|------|
| **기능 ID** | {fid} |
| **페이지** | {page} (`{route}`) |
| **우선순위** | {priority} |

### 참고 문서
- `docs/10_page_routing_split.md`
- `docs/12_sketch_and_decision.md`
- `docs/13_priority_matrix.md`

### 완료 조건
{done}

### 체크리스트
- [ ] **UI** — Step 12 스케치·와이어프레임 반영
- [ ] **API / 로직** — 오디오·추천·상태 관리
- [ ] **데모** — Step 11 고객 여정에서 동작 확인
"""


def create_issues(dry_run: bool = False) -> list[dict]:
    created: list[dict] = []
    for fid, title, priority, page, route, done in ISSUES:
        issue_title = f"[{fid}] {title}"
        issue_body = body(fid, title, page, route, done, priority)
        entry = {"id": fid, "title": issue_title, "label": priority, "number": None}
        if dry_run:
            created.append(entry)
            continue
        result = run(
            [
                "gh", "issue", "create",
                "--title", issue_title,
                "--body", issue_body,
                "--label", priority,
            ]
        )
        # "https://github.com/owner/repo/issues/42"
        url = result.stdout.strip()
        num = url.rstrip("/").split("/")[-1] if url else "?"
        entry["number"] = num
        entry["url"] = url
        created.append(entry)
    return created


def main() -> None:
    dry_run = "--dry-run" in sys.argv
    if not dry_run:
        try:
            run(["gh", "auth", "status"])
        except (subprocess.CalledProcessError, FileNotFoundError):
            sys.exit(
                "gh CLI가 필요합니다: brew install gh && gh auth login\n"
                "미리보기: python scripts/create_github_issues.py --dry-run"
            )
        ensure_labels()
    created = create_issues(dry_run=dry_run)
    out = ROOT / "docs" / "14_issues_manifest.json"
    out.write_text(json.dumps(created, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n총 {len(created)}개 Issue {'(dry-run)' if dry_run else '생성 완료'}")
    print(f"manifest: {out}")
    for item in created:
        num = item.get("number") or "-"
        print(f"  #{num} [{item['label']}] {item['title']}")


if __name__ == "__main__":
    main()
