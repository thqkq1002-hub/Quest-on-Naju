/**
 * 영산포 배치 — 근대문화유산 거리 + 홍어거리.
 *
 * 좌표계: +X 동, -Z 북(강 쪽), +Z 남(진입로 쪽). 1 unit = 1m. 다른 맵과 같은 규칙입니다.
 *
 * ── 고증 ────────────────────────────────────────────────────
 * 영산포는 일제강점기 영산강 수운(水運)의 종착 나루였고, 목포 개항과 함께
 * 1900년대 초부터 일본인이 들어와 살기 시작해 한때 인구의 3분의 1이
 * 일본인이었을 만큼 근대 상업이 번성한 곳입니다. 그 시절 지어진 근대
 * 건축물이 지금도 남아 있습니다 — 동양척식주식회사 문서고, 조선식산은행
 * 건물, 쿠로즈미 이타로 저택이 대표적입니다.
 *
 * **영산포 역사갤러리**는 이 중 옛 조선식산은행 건물을 나주시가 매입해
 * 새단장한 곳으로, 영산포 등대·오일장·우시장 등 옛 모습을 담은 흑백사진과
 * 전통 음식·문화 모형·실물을 전시합니다. **타오르는 강 문학관**은 영산강을
 * 배경으로 한 문순태의 소설과 수운의 역사를 소개합니다. **영산포 홍어거리**는
 * 흑산도에서 잡힌 홍어가 영산강 뱃길로 옮겨지며 자연 발효(숙성)된 데서
 * 비롯된 나주의 대표 음식 거리입니다.
 *
 * 건물 치수·배치는 실측이 아니라 게임용 재구성입니다.
 * ───────────────────────────────────────────────────────────
 */
import { box, type Box } from '@/lib/collision'

export const BOUNDS = { minX: -66, maxX: 66, minZ: -66, maxZ: 46 }

/** 영산강 — 거리 북쪽을 동서로 가로지릅니다 */
export const RIVER = { zFrom: -66, zTo: -44, xFrom: -66, xTo: 66 }

/** 황포돛배가 강 위를 오가는 구간 — 동서로 천천히 왕복합니다 */
export const BOAT_ROUTE = { xFrom: -55, xTo: 55, period: 46 }

export const LAYOUT = {
  /** 플레이어 시작 지점 — 남쪽 진입로 */
  spawn: { x: 0, z: 22 },
  /** 영산강 선장 할아버지 — 진입로 초입에서 맞아 줍니다 */
  captain: { x: 0, z: 10 },

  /** [구역 1] 영산포 역사갤러리 (구 조선식산은행 건물) — 서쪽 */
  gallery: { x: -38, z: -22, w: 16, d: 11, h: 6.4 },
  galleryInfo: { x: -38, z: -14 },
  galleryQuiz: { x: -30, z: -14 },

  /** [구역 2] 타오르는 강 문학관 — 가운데 */
  literature: { x: 0, z: -22, w: 13, d: 10, h: 5.6 },
  literatureInfo: { x: 0, z: -14 },
  literatureQuiz: { x: 8, z: -14 },

  /** [구역 3] 영산포 홍어거리 — 동쪽. 좌판 셋이 늘어선 짧은 거리.
   *  이름은 실제 영산3길 홍어거리에서 확인되는 상호(홍어세상·김지순홍어·금성수산)를 씁니다. */
  hongeoStalls: [
    { x: 26, z: -20, name: '홍어세상' },
    { x: 38, z: -20, name: '김지순홍어' },
    { x: 50, z: -20, name: '금성수산' },
  ],
  hongeoTrigger: { x: 38, z: -10 },
  /** 홍어거리 마스코트 "홍이" — 좌판보다 앞쪽, 거리 초입에서 맞아 줍니다 */
  hongiMascot: { x: 30, z: -2 },

  /**
   * 나루터 — 문학관과 홍어거리 사이, 강가로 걸어 내려가는 자리.
   * 흑산도 홍어도, 수운 이야기도 결국 이 뱃길에서 시작됩니다.
   */
  wharf: { x: 18, nearZ: -44, farZ: -60, w: 14 },

  /** 영산포 등대 — 선착장 옆에서 뱃길을 인도하던 흰 등대. 실제 높이 8.65m를 게임 스케일로 재구성 */
  lighthouse: { x: 34, z: -48, h: 7.2 },

  /** 황포돛배 승선 매표소 — 선착장 서쪽 진입로 */
  wharfBooth: { x: 4, z: -40 },

  /** 죽전골목 초입의 노포 "삼화홍어" — 흰 정면 + 붉은 벽돌 측면의 랜드마크 상점.
   *  홍어거리 좌판들보다 동쪽, 거리 맨 끝에서 거리를 마무리합니다. */
  samhwa: { x: 60, z: -14, w: 8, d: 6, h: 5.2 },

  /** 거리 이름표 — 등대길·선창길·영산3길, 실제 도로명을 그대로 씁니다 */
  streetSigns: [
    { x: 16, z: -38, rotY: 0, name: '등대길' },
    { x: -14, z: -38, rotY: 0, name: '선창길' },
    { x: 20, z: -8, rotY: Math.PI / 2, name: '영산3길' },
  ],
} as const

/**
 * 배경 민가 — 강변 거리에서 확인되는 파란 지붕 창고, 기와 민가, 외부 계단이 달린
 * 흰 2층 주택을 재구성한 배경 건물입니다. 플레이 동선을 막지 않는 자리에 배치해
 * "사람이 실제로 사는 거리"라는 인상을 더합니다. 근경 요소가 아니라 실내 진입은 없습니다.
 */
export const BACKGROUND_HOUSES: ReadonlyArray<{
  x: number
  z: number
  w: number
  d: number
  h: number
  roof: 'tile' | 'blue' | 'white2f'
}> = [
  { x: -60, z: -16, w: 6, d: 5, h: 3.6, roof: 'blue' },
  { x: -60, z: 8, w: 5, d: 5, h: 3.2, roof: 'tile' },
  { x: 62, z: 8, w: 5, d: 5, h: 3.2, roof: 'tile' },
  { x: -16, z: 34, w: 6, d: 5, h: 3.4, roof: 'white2f' },
  { x: 16, z: 34, w: 6, d: 5, h: 3.4, roof: 'tile' },
  { x: 48, z: 4, w: 5, d: 5, h: 3.2, roof: 'tile' },
]

/** 타오르는 강 문학관 앞 돌·자갈 정원 — 실제 문학관 마당의 돌 포인트를 재구성 */
export const GARDEN_ROCKS: ReadonlyArray<[x: number, z: number, s: number]> = [
  [-2.6, -15.2, 0.9],
  [-1.2, -14.4, 0.6],
  [1.6, -15.6, 0.75],
  [2.8, -14.6, 0.55],
  [0.2, -13.8, 0.5],
]

/** 거리를 두르는 나무 — 저층부 소나무보다 밝은 활엽수로, 근대 거리 느낌을 냅니다 */
export const STREET_TREES: ReadonlyArray<[x: number, z: number, scale: number]> = [
  [-58, -6, 1.0], [-52, 14, 0.95], [-20, 10, 1.05], [18, 14, 0.95],
  [46, 10, 1.0], [58, -6, 1.05], [-58, -30, 0.9], [58, -30, 0.95],
]

/**
 * 통과할 수 없는 것만. 갤러리·문학관 건물 본체만 막고, 홍어거리 좌판은
 * 지붕과 좌판대뿐이라 옆으로 돌아가면 그만이라 넣지 않습니다.
 */
export const COLLIDERS: readonly Box[] = [
  box(LAYOUT.gallery.x, LAYOUT.gallery.z, LAYOUT.gallery.w, LAYOUT.gallery.d),
  box(LAYOUT.literature.x, LAYOUT.literature.z, LAYOUT.literature.w, LAYOUT.literature.d),
  box(LAYOUT.samhwa.x, LAYOUT.samhwa.z, LAYOUT.samhwa.w, LAYOUT.samhwa.d),
  ...BACKGROUND_HOUSES.map((h) => box(h.x, h.z, h.w, h.d)),
]
