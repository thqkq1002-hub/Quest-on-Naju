# 레퍼런스 리서치

"역사탐험대 컨셉의 게임이나 이미 깃허브에 올라와 있는 것"을 조사한 결과입니다.
2026년 8월 기준.

---

## 결론 먼저

> **똑같은 것은 없습니다.** "한국 지역 문화재 + 3D 웹 + WoW식 퀘스트/레벨링"을
> 한꺼번에 하는 오픈소스 프로젝트는 찾지 못했습니다.
> 대신 **조각은 전부 존재**합니다 — 3D 웹 게임 스타터, 대화/퀘스트 엔진,
> 방탈출 구현체, 그리고 결정적으로 **국가유산청의 무료 3D 에셋**.
> 이걸 조립하는 것이 우리 프로젝트입니다.

이건 좋은 신호입니다. 베낄 대상이 없다는 건 빈칸이 있다는 뜻이고,
바닥부터 만들 필요는 없다는 뜻이기도 합니다.

---

## 1. ★ 가장 중요한 발견 — 국가유산청 무료 3D 에셋

프로젝트 성패를 가르는 항목입니다. **에셋 제작 비용을 통째로 줄여줍니다.**

- **국가유산 디지털 서비스 — 3D 에셋 서비스**
  https://digital.khs.go.kr/heritage/heriTage.do
  2026년 6월, **3D 에셋 545건 + 전통문양 262건 등 약 800건을 무료 개방**.
  게임·영화 등 엔터테인먼트 활용을 명시적으로 상정하고 제작된 데이터입니다.
  ([보도자료](https://www.asiae.co.kr/article/2026060712390550376))
- 유통 채널이 여러 곳입니다 — 국가유산 디지털 서비스 누리집, **Sketchfab,
  Unity Asset Store, Unreal Marketplace**. Sketchfab 경로는 glTF로 바로
  받을 수 있어 우리에게 가장 유리합니다.
- **국가유산 3D 프린팅 데이터** (OBJ / STL / PLY) — 정밀 스캔 원본.
  게임용으로는 폴리곤이 너무 많아 리토폴로지가 필요하지만, **유물 클로즈업
  전시용**으로는 그대로 써도 좋습니다.
  https://www.data.go.kr/data/15028100/fileData.do
- **국가유산 Open API** — 문화재 목록·설명·이미지 메타데이터.
  https://www.khs.go.kr/html/HtmlPage.do?pg=/publicinfo/pbinfo3_0201.jsp&mn=NS_04_04_03
  → 도감(Codex) 데이터를 손으로 다 치지 않아도 됩니다.
- **국가유산 VR산책** — 복암리 유적 10차 발굴조사 관련 자료 존재 확인.
  https://portal.nrich.go.kr/kor/culturalHeritageVrList.do?menuIdx=1247
- **AI Hub 문화유산 유적 3D 데이터**
  https://aihub.or.kr/aihubdata/data/view.do?dataSetSn=71353

> ⚠️ **반드시 확인할 것:** 각 데이터의 **공공누리 유형**(제1~4유형)이 다릅니다.
> 상업적 이용·변형 허용 여부가 유형마다 갈리므로, 에셋을 받을 때마다
> 라이선스를 기록해야 합니다. → `src/content/` 의 `license` 필드로 강제.

---

## 2. 게임 디자인 레퍼런스

### 어쌔신 크리드 *Discovery Tour* — 우리와 가장 가까운 철학
전투를 제거하고 교육 모드만 남긴 사례. 우리가 참고할 지점:

- NPC(주로 실존 인물)가 **가이드 투어**를 인솔 — 우리의 해설 NPC와 동일 구조
- 투어를 일정 수 완료하면 **아바타를 보상**으로 지급 → 우리의 복장 성장과 동일
- 투어 끝에 **가이드가 내는 퀴즈**로 지식 확인 → 우리의 퍼즐 챔버의 원형
- 맥길대와 협업해 **교사용 커리큘럼 가이드** 제작 → P4에서 참고할 만함
- 예비 연구에서 "교사가 가르친 것과 거의 비슷한 학습 효과" 보고
  ([Variety](https://variety.com/2018/gaming/news/assassins-creed-origins-discovery-tour-effectiveness-1202861325))

**우리와의 차이:** Discovery Tour는 퍼즐이 없어서 "박물관 오디오가이드"에
가깝습니다. 우리는 여기에 **방탈출 퍼즐 + RPG 성장**을 얹어 체류시간을 만듭니다.

### 이미지 1·2 (나주 메타버스 / ZEP·게더타운 계열)
현재 운영 중인 2D 타일맵 메타버스. 배울 점과 넘어설 점:

- ✅ 배울 점: **지역 랜드마크를 알아볼 수 있게** 그린 것 (남고문, 금성관,
  나주향교, 대성전이 한눈에 식별됨), 화살표 포탈로 지역 간 이동, 저전력 모드
- ❌ 넘어설 점: **머물 이유가 없음.** 걸어 다니는 것 말고 할 일이 없어
  체류시간이 짧습니다. → 우리의 퀘스트/퍼즐/레벨이 정확히 이 빈칸입니다.

### 이미지 3 (로우폴리 3D 액션 RPG)
"이세계 수학전설 2" 스타일. 조이스틱 + 자동공격 + 스킬 + HP + 지역명 툴팁 +
학습내용 배지. **미술 방향과 UI 배치의 목표점**으로 삼습니다.
→ 구현 가능성 판정은 [`03-TECH-ARCHITECTURE.md`](03-TECH-ARCHITECTURE.md) 참조.

### 기타
- **우리 문화유산 되찾기 – 한국사 편** (Android) — 도난 문화재를 되찾는
  국내 역사 게임. 2D·퀴즈 중심. 접근이 우리보다 훨씬 가벼움.
  https://play.google.com/store/apps/details?id=com.choolbal.sehoon.historygame
- **sigco3111/age-of-exploration-lite** — 국내 개발자의 웹 기반 대항해시대
  탐험·교역 시뮬. 역사 소재 웹게임의 국내 사례.
  https://github.com/sigco3111/age-of-exploration-lite

---

## 3. 기술 레퍼런스 (오픈소스)

### 3D 웹 게임 기반
| 저장소 | 쓸모 |
| --- | --- |
| [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber) | **채택.** Three.js의 React 렌더러. 씬을 컴포넌트로 관리 |
| [matthias-schuetz/THREE-BasicThirdPersonGame](https://github.com/matthias-schuetz/THREE-BasicThirdPersonGame) | Three.js + Cannon.js 3인칭 게임 스타터. 캐릭터 컨트롤러 구조 참고 |
| [ordinarygithubuser/3d-rpg](https://github.com/ordinarygithubuser/3d-rpg) | Three.js 3인칭 RPG 셋업 |
| [akarlsten/cuberun](https://github.com/akarlsten/cuberun) | R3F 3D 게임 완성작. 모바일 대응·성능 최적화 사례로 좋음 |
| [ivoelbert/rtf-polybius](https://github.com/ivoelbert/rtf-polybius) | R3F 로우폴리 게임 |
| [R3F Discussion #2729](https://github.com/pmndrs/react-three-fiber/discussions/2729) | **모바일 조이스틱 구현** 논의. 이미지 3의 좌하단 조이스틱 직결 |

### NPC / AI
- [ssethsara/react-three-npc](https://github.com/ssethsara/react-three-npc) —
  R3F용 NPC 컨트롤 시스템 (MIT). NPC 배회·타겟 추적.
- [Yuka](https://mugen87.github.io/yuka/) — 게임 AI 라이브러리.
  상태기반/목표기반 에이전트, **내비메시 기반 길찾기**. NPC가 고분군을
  자연스럽게 돌아다니게 할 때 필요.

### 대화 / 퀘스트 스크립팅 ★ 중요
퀘스트 분기와 대화를 코드에 하드코딩하면 콘텐츠 확장이 지옥이 됩니다.

- **[Yarn Spinner](https://yarnspinner.dev/)** — 작가 친화적 대화 스크립트 언어.
  *Night in the Woods*, *A Short Hike*, *Escape Academy* 등에서 사용.
  브라우저 에디터 제공.
  → 다만 공식 런타임이 Unity/Godot/Unreal 중심이라 **웹 런타임 확인 필요.**
- **[ink](https://www.inklestudios.com/ink/)** — `inkjs`라는 **성숙한 JS 런타임이
  존재**합니다. 브라우저에서 바로 돌아갑니다.
  → **웹 프로젝트인 우리에게는 ink 쪽이 현실적**입니다.
- [blurymind/YarnClassic](https://github.com/blurymind/YarnClassic) — 대화 작성 툴

> **판단:** P1에서는 자체 JSON 스키마로 시작(퀘스트가 단순하므로 충분),
> 분기가 복잡해지면 `inkjs`로 이관. 처음부터 엔진에 묶이지 않도록
> 퀘스트 데이터를 순수 데이터로 유지합니다.

### 방탈출 / 퍼즐
- [alecdean/escape-room](https://github.com/alecdean/escape-room) — 포인트앤클릭
  3D 방탈출. **인벤토리 + 아이템 조합 + 시점 이동** 구조가 우리 퍼즐 챔버와 동일
- [rheeeuro/g-escape](https://github.com/rheeeuro/g-escape) — Three.js 방탈출
- [DeirdreHegarty/escape-room](https://github.com/DeirdreHegarty/escape-room) — 퍼즐 로직
- [sanggonlee/WebGLGame](https://github.com/sanggonlee/WebGLGame) — WebGL 방탈출

### 가상 박물관 / 문화유산 WebGL
- [theringsofsaturn/virtual-museum-tour-threejs](https://github.com/theringsofsaturn/virtual-museum-tour-threejs)
  — 박물관·유적지 가이드 투어. 전시 동선 설계 참고
- [pfontana96/WebGL-Museum](https://github.com/pfontana96/WebGL-Museum)
- [Resurrect3D](https://arxiv.org/pdf/2106.09509) — 문화유산 유물 시각화·분석
  오픈 플랫폼 (논문). 유물 뷰어 UX 참고
- [오픈소스 WebGL 문화유산 도구 리뷰 논문](https://www.researchgate.net/publication/371840860_REDISCOVERING_CULTURAL_HERITAGE_SITES_BY_INTERACTIVE_3D_EXPLORATION_A_PRACTICAL_REVIEW_OF_OPEN-SOURCE_WEBGL_TOOLS)

### 멀티플레이 (P4용, 지금은 참고만)
- [majidmanzarpour/vibe-coding-starter-pack-3d-multiplayer](https://github.com/majidmanzarpour/vibe-coding-starter-pack-3d-multiplayer)
  — Three.js + React + SpacetimeDB 멀티플레이 스타터
- [VerseEngine/verse-three](https://github.com/VerseEngine/verse-three) —
  P2P 오버레이 네트워크 기반 웹 메타버스 엔진

---

## 4. 콘텐츠 출처 (고증용)

| 출처 | 용도 |
| --- | --- |
| [국가유산포털](https://www.heritage.go.kr/) | 문화재 지정 정보, 공식 설명문 |
| [국가유산 지식이음](https://portal.nrich.go.kr/) | 발굴조사 보고서, 학술 자료 |
| [국립중앙박물관 3D 데이터 검색](https://www.museum.go.kr/MUSEUM/contents/M0505000000.do) | 유물 3D |
| 국립나주박물관 | 복암리·영산강 유역 유물의 1차 기관 |
| [국가유산채널](https://www.k-heritage.tv/) | 영상 자료 |

---

## 5. 리서치가 바꾼 계획

리서치 전후로 달라진 판단:

1. **에셋을 직접 다 만들 계획 → 국가유산청 3D 에셋 우선 사용.**
   가장 큰 비용이 크게 줄었습니다.
2. **퀘스트/대화를 코드로 짤 계획 → 데이터로 분리 (+ ink 이관 대비).**
   콘텐츠 확장 속도가 프로젝트 수명을 결정합니다.
3. **멀티플레이를 1차에 포함 → P4로 미룸.**
   이미지 1·2의 메타버스가 "머물 이유가 없다"는 게 진짜 문제였고,
   그건 동접이 아니라 콘텐츠로 푸는 문제입니다.
4. **퍼즐을 새로 설계 → 방탈출 오픈소스의 인벤토리/조합 패턴을 차용.**

---

### 출처

- [국가유산 디지털 서비스 – 3D 에셋](https://digital.khs.go.kr/heritage/heriTage.do)
- [국가유산청, 3D 에셋·전통문양 800건 무료 개방](https://www.asiae.co.kr/article/2026060712390550376)
- [국가유산청 Open API 개방목록](https://www.khs.go.kr/html/HtmlPage.do?pg=/publicinfo/pbinfo3_0201.jsp&mn=NS_04_04_03)
- [국가유산 3D 프린팅 데이터 (공공데이터포털)](https://www.data.go.kr/data/15028100/fileData.do)
- [국가유산 VR산책](https://portal.nrich.go.kr/kor/culturalHeritageVrList.do?menuIdx=1247)
- [AI Hub 문화유산 유적 3D 데이터](https://aihub.or.kr/aihubdata/data/view.do?dataSetSn=71353)
- [Assassin's Creed Discovery Tour (Ubisoft)](https://www.ubisoft.com/en-us/game/assassins-creed/discovery-tour)
- [Discovery Tour 학습 효과 (Variety)](https://variety.com/2018/gaming/news/assassins-creed-origins-discovery-tour-effectiveness-1202861325)
- [pmndrs/react-three-fiber](https://github.com/pmndrs/react-three-fiber)
- [R3F 모바일 컨트롤 Discussion](https://github.com/pmndrs/react-three-fiber/discussions/2729)
- [matthias-schuetz/THREE-BasicThirdPersonGame](https://github.com/matthias-schuetz/THREE-BasicThirdPersonGame)
- [ordinarygithubuser/3d-rpg](https://github.com/ordinarygithubuser/3d-rpg)
- [akarlsten/cuberun](https://github.com/akarlsten/cuberun)
- [ivoelbert/rtf-polybius](https://github.com/ivoelbert/rtf-polybius)
- [ssethsara/react-three-npc](https://github.com/ssethsara/react-three-npc)
- [Yuka – Game AI](https://mugen87.github.io/yuka/)
- [Yarn Spinner](https://yarnspinner.dev/)
- [YarnSpinnerTool/YarnSpinner](https://github.com/YarnSpinnerTool/YarnSpinner)
- [blurymind/YarnClassic](https://github.com/blurymind/YarnClassic)
- [alecdean/escape-room](https://github.com/alecdean/escape-room)
- [rheeeuro/g-escape](https://github.com/rheeeuro/g-escape)
- [DeirdreHegarty/escape-room](https://github.com/DeirdreHegarty/escape-room)
- [sanggonlee/WebGLGame](https://github.com/sanggonlee/WebGLGame)
- [theringsofsaturn/virtual-museum-tour-threejs](https://github.com/theringsofsaturn/virtual-museum-tour-threejs)
- [pfontana96/WebGL-Museum](https://github.com/pfontana96/WebGL-Museum)
- [Resurrect3D 논문](https://arxiv.org/pdf/2106.09509)
- [오픈소스 WebGL 문화유산 도구 리뷰 논문](https://www.researchgate.net/publication/371840860_REDISCOVERING_CULTURAL_HERITAGE_SITES_BY_INTERACTIVE_3D_EXPLORATION_A_PRACTICAL_REVIEW_OF_OPEN-SOURCE_WEBGL_TOOLS)
- [sigco3111/age-of-exploration-lite](https://github.com/sigco3111/age-of-exploration-lite)
- [우리 문화유산 되찾기 – 한국사 편](https://play.google.com/store/apps/details?id=com.choolbal.sehoon.historygame)
- [국가유산포털](https://www.heritage.go.kr/) / [국가유산 지식이음](https://portal.nrich.go.kr/) / [국립중앙박물관 3D 데이터](https://www.museum.go.kr/MUSEUM/contents/M0505000000.do) / [국가유산채널](https://www.k-heritage.tv/)
