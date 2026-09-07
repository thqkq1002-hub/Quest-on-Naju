# 기술 아키텍처

---

## ★ 먼저: 이미지 3 같은 것을 Three.js로 만들 수 있는가?

### 판정: **가능합니다.** 다만 항목별로 난이도 차이가 큽니다.

이미지 3(「이세계 수학전설 2」 스타일 로우폴리 3D 액션 RPG)을 요소별로 분해해
Three.js/R3F로의 구현 난이도를 매기면 다음과 같습니다.

| 이미지 3의 요소 | 웹 구현 | 난이도 | 방법 |
| --- | --- | --- | --- |
| 로우폴리 스타일라이즈드 지형 (육각 타일, 단색 면) | ✅ | ★☆☆ | flat shading + 단색 머티리얼. **오히려 웹에 가장 유리한 미술 방향** |
| 3인칭 쿼터뷰 카메라 | ✅ | ★☆☆ | `PerspectiveCamera` + 오프셋 추적 + 부드러운 lerp |
| 캐릭터 이동/충돌 | ✅ | ★★☆ | `@react-three/rapier`의 KinematicCharacterController |
| 좌하단 가상 조이스틱 | ✅ | ★☆☆ | HTML 오버레이(DOM)로 구현. 3D 안에 넣지 않음 |
| WASD 동시 지원 | ✅ | ★☆☆ | `@react-three/drei`의 `KeyboardControls` |
| 캐릭터 스킨 애니메이션 (걷기/공격) | ✅ | ★★☆ | glTF + `AnimationMixer`. 믹스아모 리타게팅 가능 |
| 스킬 이펙트 (별빛 폭발 등) | ✅ | ★★☆ | GPU 파티클 + 커스텀 셰이더. 라이브러리 없이도 가능 |
| 부드러운 그림자 | ✅ | ★★☆ | 캐스케이드 섀도우맵 또는 **베이크된 그림자**(모바일 권장) |
| 물/발광 지형 | ✅ | ★★☆ | 커스텀 셰이더 머티리얼 |
| 3D 공간 라벨 (`별빛 버섯숲`, `세 룬의 광장`) | ✅ | ★☆☆ | drei `Html` 또는 `Billboard` + `Text` |
| HP 바 / 데미지 숫자 | ✅ | ★☆☆ | DOM 오버레이 |
| 상단 정보 패널 (`학습내용: 2학년 · 2~5단 곱셈`) | ✅ | ★☆☆ | 그냥 React 컴포넌트 |
| 우하단 스킬 버튼 | ✅ | ★☆☆ | DOM 오버레이 |
| 전체화면 가로 모드 | ✅ | ★☆☆ | Fullscreen API + Screen Orientation API |

**막히는 항목이 하나도 없습니다.** 이미지 3의 비주얼은 사실 로우폴리라서
텍스처 용량이 거의 안 들고 폴리곤도 적어, **웹에서 구현하기에 오히려 유리한
쪽**입니다. 사실적 그래픽을 목표로 했다면 훨씬 어려웠을 겁니다.

### 진짜 어려운 것은 렌더링이 아닙니다

| 진짜 난관 | 이유 | 대응 |
| --- | --- | --- |
| **에셋 물량** | 캐릭터·건물·유물·지형·애니메이션. 코딩보다 이게 훨씬 큼 | 국가유산청 무료 3D 에셋 + 로우폴리로 제작량 축소 |
| **초기 로딩 시간** | 학생들이 3G/구형 기기로 접속 | Draco/Meshopt 압축, KTX2 텍스처, 지역별 코드 스플리팅, 프로그레시브 로딩 |
| **저사양 기기** | 학교 태블릿, 구형 안드로이드 | 품질 프리셋(고/중/저), 그림자 off, DPR 클램프. 이미지 1의 "저전력 모드"가 정확한 선례 |
| **콘텐츠 제작 파이프라인** | 유적 5곳 × 퀘스트 여러 개 | 퀘스트/도감을 JSON 데이터로 분리 (아래) |

> **결론:** *"이미지 3을 구현할 수 있는가"* → **네.**
> 단, 프로젝트의 성패는 렌더링 기술이 아니라 **에셋과 콘텐츠 물량**에서
> 갈립니다. 계획도 그쪽에 무게를 둬야 합니다.

---

## 1. 스택

```
React 19 + TypeScript + Vite
  └─ @react-three/fiber      Three.js React 렌더러
     ├─ @react-three/drei    카메라/로더/Html/Text/KeyboardControls 등 유틸
     ├─ @react-three/rapier  물리 · 캐릭터 컨트롤러 (WASM)
     └─ three                렌더링 코어
  └─ zustand                 게임 상태 (퀘스트/인벤토리/진행도)
  └─ (선택) inkjs            대화 분기가 복잡해지면 도입
```

**왜 R3F인가:** 순수 Three.js로도 되지만, 씬이 커질수록 "이 오브젝트를 언제
추가하고 언제 dispose 하는가"가 지옥이 됩니다. R3F는 그걸 React 라이프사이클에
맡깁니다. 유적지 씬을 언마운트하면 GPU 리소스가 정리됩니다.

**왜 Rapier인가:** Cannon.js보다 빠르고(Rust/WASM), 우리에게 필요한
`KinematicCharacterController`(경사 오르기, 계단, 벽 미끄러짐)를 이미 갖고 있습니다.
직접 구현하면 몇 주짜리 작업입니다.

---

## 2. 폴더 구조

```
apps/naju-heritage-quest/
├── docs/                     기획 문서 (이 폴더)
├── public/
│   ├── models/               .glb 에셋
│   │   ├── character/        플레이어 + 교체 장비 메시
│   │   ├── heritage/         문화재 모델
│   │   └── env/              지형·식생·소품
│   ├── textures/             KTX2 압축 텍스처
│   └── audio/
└── src/
    ├── main.tsx
    ├── App.tsx               라우팅 · 씬 전환
    ├── game/
    │   ├── world/            나주 월드맵, 유적지 씬, 지형, 포탈
    │   ├── player/           캐릭터 컨트롤러, 카메라, 애니메이션, 장비 슬롯
    │   ├── quest/            퀘스트 엔진 (데이터 → 상태 → UI)
    │   ├── puzzle/           퍼즐 아키타입별 구현
    │   └── progression/      XP · 레벨 · 칭호 · 장비 해금
    ├── content/              ★ 순수 데이터 (코드 아님)
    │   ├── sites/            유적별 퀘스트/NPC/퍼즐 JSON
    │   ├── codex/            도감 항목 JSON
    │   └── schema.ts         타입 정의 + 런타임 검증
    ├── ui/                   HUD, 퀘스트 로그, 대화창, 도감, 조이스틱
    ├── store/                zustand 스토어
    └── lib/                  로더, 저장, 품질 프리셋, 유틸
```

### 핵심 원칙: 콘텐츠와 코드의 분리

`src/content/` 아래는 **전부 데이터**입니다. 새 유적을 추가할 때
`src/game/` 을 건드릴 일이 없어야 합니다. 이게 지켜지지 않으면
유적 3개쯤에서 프로젝트가 멈춥니다.

```
   퀘스트 JSON  ──►  스키마 검증  ──►  퀘스트 엔진  ──►  UI
   (기획자 영역)                      (개발자 영역)
```

---

## 3. 씬 전환 구조

```
   [ 나주 월드맵 ]  ← 항상 메모리에 상주 (가벼운 LOD)
         │
         │ 유적 입구 진입 → 로딩 화면 → 씬 언마운트/마운트
         ▼
   [ 복암리 고분군 ]  ← 상세 모델, 무거움
         │
         │ 고분 입구 → 실내 챔버 (별도 씬)
         ▼
   [ 퍼즐 챔버 ]  ← 좁고 밀도 높은 씬
```

각 씬은 독립 번들로 코드 스플리팅합니다 (`React.lazy`).
복암리에 안 간 사람은 복암리 에셋을 받지 않습니다.

---

## 4. 상태 관리

```ts
// store/gameStore.ts (구조 스케치)
interface GameState {
  player: {
    level: number
    xp: number
    title: string
    equipment: Record<EquipSlot, ItemId | null>
    position: [number, number, number]
    currentSite: SiteId
  }
  quests: {
    active: Record<QuestId, { objectives: Record<string, number> }>
    completed: QuestId[]
  }
  inventory: Record<ItemId, number>
  codex: { unlocked: CodexId[] }
  settings: { quality: 'low' | 'medium' | 'high'; subtitles: boolean }
}
```

- **저장:** 1차는 `localStorage`에 직렬화 (로그인 없이 바로 플레이).
  2차에서 Supabase 등으로 계정 연동 — 인터페이스만 맞춰두면 교체 가능.
- **주의:** 매 프레임 바뀌는 값(캐릭터 위치, 카메라)은 **스토어에 넣지 않습니다.**
  React 리렌더가 발생해 프레임이 떨어집니다. `useRef` + `useFrame`으로 처리하고,
  스토어에는 "저장 시점"에만 씁니다. → R3F 성능의 가장 흔한 함정입니다.

---

## 5. 성능 예산 (모바일 기준)

학교 태블릿에서 돌아가야 합니다. 지키지 못하면 아무리 예뻐도 실패입니다.

| 항목 | 목표 |
| --- | --- |
| 첫 인터랙션까지 | **5초 이내** (4G) |
| 초기 다운로드 | **8MB 이하** (월드맵 씬 기준) |
| 프레임 | 중급 모바일 **30fps 이상**, 데스크톱 60fps |
| Draw call | 씬당 **150 이하** |
| 삼각형 | 씬당 **30만 이하** |
| 텍스처 | KTX2/Basis 압축 필수 |

**수단:**
- glTF **Draco** (지오메트리) + **Meshopt** (애니메이션) 압축
- 반복 오브젝트(나무, 돌, 항아리)는 **InstancedMesh**
- 정적 그림자는 **베이크**, 실시간 그림자는 캐릭터 주변만
- `devicePixelRatio` 를 최대 2로 클램프
- **품질 프리셋 3단계** + 저사양 자동 감지 (이미지 1의 "저전력 모드" 참고)
- 프러스텀 컬링 + LOD (월드맵의 원거리 건물)

---

## 6. 멀티플레이를 나중에 붙이기 위한 준비

1차에서는 만들지 않지만, 나중에 붙일 때 전체를 다시 쓰지 않도록 지금 지킬 것:

- 플레이어 상태 갱신을 **한 곳(`player/` 모듈)에 모읍니다.** 여기저기서
  transform을 직접 만지면 나중에 네트워크 동기화가 불가능해집니다.
- 캐릭터 렌더 컴포넌트를 **`isLocal` 플래그로 파라미터화**해 둡니다.
  원격 플레이어는 같은 컴포넌트에 보간된 위치만 넣으면 됩니다.
- 퀘스트 진행은 **결정적(deterministic)** 으로 — 클라이언트 난수 의존 금지.

참고 스타터: [vibe-coding-starter-pack-3d-multiplayer](https://github.com/majidmanzarpour/vibe-coding-starter-pack-3d-multiplayer),
[VerseEngine/verse-three](https://github.com/VerseEngine/verse-three)

---

## 7. 배포

- 정적 빌드 → **Vercel / Cloudflare Pages / GitHub Pages** 중 택1
- 3D 에셋은 **CDN** 에서 서빙 (`public/models/` 가 커지면 분리)
- 서버가 필요 없는 구조로 시작 → 운영 비용 0에 가깝게

---

## 8. 열려 있는 기술 결정

아래는 P0에서 프로토타입으로 실측한 뒤 정합니다:

1. **지형** — 하이트맵 기반 vs 수작업 모델링.
   나주 실제 지형을 반영하려면 DEM 데이터 → 하이트맵이 정확하지만,
   게임적 재미(압축된 거리감)를 위해선 수작업이 낫습니다. **후자 우세.**
2. **캐릭터 애니메이션** — Mixamo 리타게팅 vs 직접 제작.
   장비 슬롯 교체와의 호환성을 P0에서 확인.
3. **대화 엔진** — 자체 JSON vs `inkjs`.
   퀘스트 3개까지는 자체 JSON으로 충분. 분기가 생기면 그때 판단.
4. **텍스트 렌더** — drei `Html`(DOM, 선명하지만 무거움) vs `Text`(SDF, 3D 안에서
   자연스러움). 이미지 3의 공간 라벨은 후자에 가까움.
