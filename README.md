# 나주 문화유산 퀘스트 (Naju Heritage Quest)

> 나주를 3D로 걸어 다니며, 퀘스트를 깨면서 문화재를 배우고,
> **「나주 최고 해설사」** 가 되는 웹 게임.

독립 저장소입니다. (`jihoonlove` 모노레포에서 분리해 왔고, 커밋 이력도 함께 가져왔습니다.)

---

## 현재 상태

**P1 수직 슬라이스 완주 가능.** 다시초등학교에서 출발해 영산강 뱃길로
복암리 고분군에 가고, 퀘스트 3개와 층위 퍼즐을 거쳐 엔딩까지 갑니다.
자세한 현황과 다음 할 일은 [`HANDOFF.md`](HANDOFF.md)를 읽으세요.

## 한눈에

| | |
| --- | --- |
| 장르 | 3D 웹 · 교육 어드벤처 RPG |
| 렌더링 | Three.js (React Three Fiber) |
| 대상 | 초등 고학년 ~ 중학생 |
| 1차 콘텐츠 | **다시초등학교 → 복암리 고분군** (구현 완료) |
| 핵심 루프 | `!` 퀘스트 수락 → 유적 탐험 → 발굴·복원·방탈출 퍼즐 → XP·장비·도감 → 레벨업 |
| 최종 목표 | Lv.20 「나주 최고 해설사」 |

## 실행

```bash
npm install
npm run dev   # → http://localhost:5173/
```

Node 20 이상.

## 폴더

```
docs/          기획 문서 ← 여기부터 읽으세요
public/        3D 모델 · 텍스처 · 오디오
src/
├── game/
│   ├── world/
│   │   ├── registry.ts   ★ 맵 등록부 (동적 import)
│   │   ├── terrain.ts    맵이 지켜야 할 지형 계약
│   │   ├── interaction.ts 가장 가까운 대상이 이기는 상호작용 중재
│   │   ├── Npc.tsx / Interactable.tsx / bodies.tsx   맵과 무관한 부품
│   │   └── maps/         맵별 씬과 배치 상수
│   ├── player/  이동 · 카메라
│   └── quest/   퀘스트 데이터 로더 · 마커
├── content/   ★ 순수 데이터 — 퀘스트 JSON + 스키마
├── ui/        HUD · 대화창 · 월드맵 · 퍼즐 · 엔딩 · 조이스틱
├── store/     zustand 상태 (게임 진행 / 현재 맵)
└── lib/       입력 · 충돌 · 팔레트 · 태극기
```

**설계 원칙:** 새 유적을 추가할 때 `src/game/` 을 건드리지 않습니다.
`src/content/` 에 JSON만 추가하면 새 콘텐츠가 생겨야 합니다.

## 기획 문서

| 문서 | 내용 |
| --- | --- |
| [`docs/00-PLAN.md`](docs/00-PLAN.md) | **전체 요약 (여기서 시작)** |
| [`docs/01-RESEARCH.md`](docs/01-RESEARCH.md) | 레퍼런스 리서치 — 오픈소스, 국가유산청 3D 에셋, 유사 사례 |
| [`docs/02-GAME-DESIGN.md`](docs/02-GAME-DESIGN.md) | 퀘스트 · 퍼즐 · 성장 시스템 상세 |
| [`docs/03-TECH-ARCHITECTURE.md`](docs/03-TECH-ARCHITECTURE.md) | 아키텍처 + **3D 액션 RPG 스타일 구현 가능성 판정** |
| [`docs/04-CONTENT-bokamri.md`](docs/04-CONTENT-bokamri.md) | 복암리 고분군 콘텐츠 설계 |
| [`docs/05-ROADMAP.md`](docs/05-ROADMAP.md) | 단계별 로드맵과 판단 게이트 |

## 배포

Vercel에 GitHub 연동으로 배포합니다. 설정은 저장소 루트의
[`vercel.json`](vercel.json)에 들어 있으므로, Vercel에서 이 저장소를
Import 하기만 하면 됩니다 (Root Directory는 기본값 그대로).

Vercel은 기본적으로 저장소의 기본 브랜치를 프로덕션으로 배포합니다.
작업 브랜치를 배포하려면 프로젝트 설정에서 Production Branch를 바꾸거나,
기본 브랜치로 병합하세요.

### 플레이 테스트용 단일 HTML

```bash
npm run build:artifact   # artifact/dasi-school.html (약 1MB, 자기완결적)
```

외부 요청이 차단된 환경(아티팩트 등)에 올릴 때 씁니다. 코드 스플리팅을 끄고
JS를 HTML에 인라인합니다. 생성물은 커밋하지 않습니다.

## 콘텐츠 원칙

문화재를 다루는 프로젝트이므로 두 가지는 타협하지 않습니다.

1. **모든 학습 콘텐츠에 출처를 붙입니다.** `source` 는 필수 필드입니다.
2. **모든 퀘스트는 무엇을 가르치는지 명시합니다.** `learning` 이 비어 있으면
   그 퀘스트는 만들 이유가 없습니다.

공개 전 문화재 정보에 대한 **전문가 검수**가 필요합니다.
