/**
 * 미술 방향: 로우폴리 스타일라이즈드 (flat shading + 단색 면).
 *
 * 레퍼런스 이미지 3의 색감을 따릅니다 — 채도는 있되 탁하지 않게,
 * 그림자 쪽으로 갈수록 파랑이 섞이도록. 텍스처를 쓰지 않으므로
 * 색이 곧 형태 구분입니다. 인접한 오브젝트끼리는 명도 차를 둡니다.
 */
export const PALETTE = {
  // 하늘 · 대기
  skyTop: '#7fc4e8',
  skyBottom: '#d8eef7',
  fog: '#cfe6f0',

  // 지면
  grass: '#7cc46b',
  grassDark: '#5fa855',
  /** 잔디 운동장 — 늦가을이라 마른 올리브빛 */
  turf: '#93ab72',
  /** 트랙 인필드 흙 */
  dirt: '#d9a066',
  dirtDark: '#c48b52',
  /** 우레탄 트랙의 빨강 */
  track: '#b8503f',
  /** 트랙 안쪽을 두르는 파란 띠 */
  trackApron: '#4a7fb5',
  path: '#cfc4a8',
  asphalt: '#8d8f90',

  // 본관 — 항공뷰의 분홍(살구)빛 벽돌
  brick: '#e3ada2',
  brickShade: '#d0958a',
  /** 층 사이를 두르는 흰 수평 띠 */
  band: '#f2efe8',
  windowGlass: '#8fbcd4',
  windowFrame: '#e8e8e8',
  roof: '#dcdcd6',
  roofDark: '#5b6b7a',
  pillar: '#e2d6bd',
  baseboard: '#9aa3a8',
  /** 원형 탑의 은색 돔 */
  dome: '#c6ccd2',
  /** 강당의 빨간 반원통 지붕 */
  hallRoof: '#b8503f',
  hallWall: '#e8dfd0',

  // 나무 · 식생
  pineDark: '#3f7a4a',
  pineMid: '#4f8f57',
  ginkgo: '#8fc45c',
  trunk: '#7a5a3c',
  /** 배나무 — 덕유식(수평 덕)으로 다듬은 잎 색. 소나무보다 밝고 노란기가 있습니다 */
  pearLeaf: '#8fb84a',
  pearLeafLight: '#a3c95e',
  /** 덕 아래 매달린 나주배 열매 — 잘 익은 황금빛 */
  pearFruit: '#e8c24a',
  pearFruitBlush: '#d9973a',
  flowerRed: '#e0685f',
  flowerYellow: '#f0c04a',
  flowerPink: '#ec9ab8',

  // 시설물
  goalpost: '#f2f2f2',
  steelBlue: '#5b8fb0',
  steelRed: '#c1584c',
  steelYellow: '#e8b53f',
  stone: '#b8b3a8',
  stoneDark: '#9a958a',
  flagpole: '#dcdcdc',

  // 캐릭터 (Lv.1 — 낡은 체육복)
  skin: '#f0c9a4',
  hair: '#2b2320',
  gymTop: '#e8e4dc',
  gymPants: '#3c4a63',
  shoe: '#d8d8d8',
  backpack: '#c0705a',

  // 주변 환경 — 다시면 소재지 마을
  paddy: '#a8c96a',
  village: '#e6e0d4',
  /** 시골 마을 지붕은 파랑·빨강·초록·회색이 섞여 있습니다 */
  roofPalette: ['#4a7fb5', '#b5483c', '#5f8f6a', '#8a9098'],
  /** 교정 한가운데 활엽수 군락 */
  broadleaf: '#4a7f42',
  broadleafLight: '#5c9450',

  // 영산강 · 황포돛배
  river: '#5089b5',
  riverDark: '#3f6f97',
  boatHull: '#6b4a35',
  boatHullDark: '#573a29',
  /** 황포(黃布) — 누런 무명 돛 */
  sail: '#d99a3f',
  sailDark: '#c17f2c',

  // 철로 · 다시역
  ballast: '#8c8478',
  rail: '#5f6266',
  platform: '#b7b2a6',
  /** 다시역 — 붉은 벽돌 */
  stationBrick: '#a8493a',
  stationRoof: '#4a3f38',
  trainEngine: '#c1584c',
  trainCar: '#4a6fa5',

  // 스쿨버스
  busYellow: '#f4c430',
  busYellowDark: '#d9ab1f',

  // 빛가람동 — 계획도시. 유리·콘크리트의 차가운 색감으로 다시면과 대비시킵니다
  lake: '#4fa8c9',
  lakeDark: '#3d87a3',
  plaza: '#c9c4b8',
  glassTeal: '#4fd8c4',
  glassBlue: '#5fa8e8',
  concrete: '#dcdad2',
  concreteDark: '#b8b4a8',
  kepcoNavy: '#1f3a63',
  kentechGreen: '#3fa073',
  /** 전력거래소 — 관제센터다운 짙은 그래파이트 + 경고등 주황 */
  kpxGraphite: '#3a4048',
  kpxScreen: '#e8843f',
  /** 한국콘텐츠진흥원 — K-콘텐츠다운 마젠타 포인트 */
  koccaMagenta: '#d8477a',
  koccaPurple: '#6a4fa0',
  /** 스마트 라이프 센터 — 탄소중립을 상징하는 우드+연두 */
  smartLifeWood: '#b98a5e',
  smartLifeLeaf: '#7fbf5a',

  // 문평면 — 나대용 장군 유적. 다시면보다 더 짙은 고재(古材) 색과
  // 전통 기와·단청으로, "조선시대 유적지"라는 인상을 줍니다
  hanokWood: '#7a5c3a',
  hanokWall: '#e8dcc0',
  tileRoof: '#454b54',
  tileRoofLight: '#5c636d',
  dancheongRed: '#a83a2e',
  dancheongGreen: '#3f7a5a',
  turtleShell: '#3f6b45',
  turtleShellDark: '#2f5236',
  dragonGold: '#c9a227',
  changseonHull: '#5a3d28',

  // 나주역 — 1929년 나주역 사건(광주학생독립운동의 발단). 빛바랜 흑백사진처럼
  // 채도를 낮춘 세피아·차콜에, 무민공 삼각지처럼 튀지 않는 톤다운 금색·붉은색만
  // 포인트로 씁니다 — 슬픈 역사라 화려하게 꾸미지 않습니다
  stationSepia: '#c9bfa0',
  stationSepiaDark: '#a89a72',
  stationBrickOld: '#8a6f5c',
  stationCharcoal: '#3a362f',
  mutedGold: '#a8843f',
  mutedRed: '#8a3f36',
  retroTrainBody: '#2b2f28',
  retroTrainTrim: '#6b5836',
  uniformNavy: '#26303f',
  uniformCream: '#d9d0b8',

  // 영산포 — 근대 수운(水運) 나루터. 옛 조선식산은행 건물인 역사갤러리는
  // 짙고 차분한 벽돌색으로, 문학관은 영산강을 닮은 차분한 청록빛 지붕으로,
  // 홍어거리는 시장 특유의 활기찬 원색 차양으로 세 구역의 성격을 색으로 구분합니다
  modernBrick: '#9c5c48',
  modernBrickDark: '#7a4636',
  modernRoof: '#4a4038',
  litHallWood: '#8a6a48',
  litHallRoof: '#3f5a52',
  driedFish: '#c9a8a0',
  /** 홍어거리 마스코트 "홍이" — 넓적하고 둥근 홍어 몸빛 */
  hongiPink: '#e8a0ac',
  hongiPinkDark: '#c97888',
  hongiNambawi: '#2e4a52',
  hongiFurTrim: '#3a2c22',
  /** 솔밭유원지 마스코트 "솔이" — 솔바람 요정의 민트빛 몸 */
  soliMint: '#5fae8c',
  soliMintLight: '#82c9a8',
  pineconeBrown: '#8a6a48',

  // 영산포 배경 거리 — 등대와 강변 민가
  /** 영산포 등대 — 순백에 가까운 몸체, 뱃사람 눈에 잘 띄어야 합니다 */
  lighthouseWhite: '#f5f2e8',
  lighthouseRed: '#c1584c',
  /** 강변의 파란 지붕 창고 */
  warehouseRoof: '#3f6f8f',
  /** 외부 계단이 달린 흰 2층 주택 — 크림빛 담장 */
  riverHouseWall: '#eee7d8',
  riverHouseFence: '#d9cfb8',
  bamboo: '#7fa855',

  // UI 강조
  questGold: '#ffd24a',
  questGoldDim: '#8a7a4a',
} as const
