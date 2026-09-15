/**
 * 나주읍성 배치 — 4대문(남고문·동점문·서성문·북망문)과 금성관.
 *
 * 좌표계: +X 동, -Z 북, +Z 남(진입로 쪽). 1 unit = 1m. 다른 맵과 같은 규칙입니다.
 *
 * ── 고증 ────────────────────────────────────────────────────
 * 나주읍성은 나주목의 읍치를 두른 성곽으로, 한양도성처럼 동서남북 네
 * 성문을 두었습니다. **남고문**은 2층 문루를 올린 남쪽 정문으로 가장
 * 웅장했고, **동점문**은 동쪽에서 영산강 쪽 통로 구실을 했으며, **서성문
 * (영금문)**은 동학농민군과 봉학선생의 이야기가 전하는 서쪽 문, **북망문**은
 * 한양으로 향하던 북쪽 문입니다. 성 한가운데의 **금성관**은 나주목 관아의
 * 중심 객사로, 임금을 상징하는 전패를 모시고 지방관이 예를 올리던
 * 가장 격식 높은 건물입니다.
 *
 * 성곽의 정확한 둘레·문루 치수는 실측이 아니라 게임용 재구성입니다.
 * ───────────────────────────────────────────────────────────
 */
import { box, type Box } from '@/lib/collision'

export const BOUNDS = { minX: -84, maxX: 84, minZ: -84, maxZ: 84 }

/** 성곽 한 변의 절반 길이 — 정사각형 읍성으로 단순화합니다 */
export const WALL_HALF = 58
/** 문루가 뚫려 있는 문 폭(성곽 중심 기준 ±) */
export const GATE_GAP = 9

export const LAYOUT = {
  /** 플레이어 시작 지점 — 남고문 밖 진입로 */
  spawn: { x: 0, z: 74 },
  /**
   * 나주목사 김 목사님 — 진입로 초입, 시작하자마자 마주치는 자리.
   * 원래는 남고문 안쪽 깊숙이(z=34) 있었는데, 성벽 바깥을 돌아 다른
   * 문부터 구경하면 이 목사님을 아예 못 만나고 지나칠 수 있었습니다 —
   * 그러면 읍성의 유일한 퀘스트 시작점을 영영 놓치는 셈이라, 다른
   * 맵들처럼 출발 지점 바로 앞으로 옮겼습니다.
   */
  mayor: { x: 0, z: 68 },

  /** 중심 — 금성관 */
  geumseonggwan: { x: 0, z: 0, w: 22, d: 14, h: 8 },
  geumseonggwanInfo: { x: 0, z: 12 },

  /**
   * 망화루 — 금성관(객사)의 정문. 답사 영상 속 "객사의 정문인 망화루로
   * 들어가고 있습니다"라는 설명을 그대로 옮겼습니다. 남고문에서 금성관으로
   * 이어지는 진입로 한가운데 세워, 실제로 그 문을 지나야 금성관에 닿게 했습니다.
   * 정렬사의 김천일 사적("금성관 망화루 앞에서 의병을 일으켰다")과도 이어집니다.
   */
  manghwaru: { x: 0, z: 30, w: 11, d: 5, h: 5.2 },

  /** 동헌 — 목사가 정무를 보던 건물. 금성관 서쪽 옆에 둡니다 */
  dongheon: { x: -19, z: -4, w: 11, d: 8, h: 5.6 },
  dongheonInfo: { x: -19, z: 5 },

  /** 당간지주 — 동점문 안쪽에 남은 돌 깃대 받침 한 쌍 */
  dangganjiju: { x: 44, z: 14 },

  /**
   * 나주곰탕집 — 금성관 동쪽 옆. 수호대장 마패를 얻은 뒤에만 나타나는
   * 보상성 가게입니다. 나주곰탕은 실제로 나주읍성 5일장 상인·길손을
   * 먹이던 국밥에서 비롯되었다고 전하는 나주의 대표 향토음식입니다.
   */
  gomtangHouse: { x: 17, z: 4, w: 6, d: 5 },
  gomtangLady: { x: 17, z: 8.5 },
  /** 곰탕집 문제 팻말 — 할머니 옆 */
  gomtangQuiz: { x: 20, z: 9.5 },

  /** 4대문 — 성곽 네 변의 한가운데 */
  gates: {
    namgomun: { id: 'namgomun', name: '남고문', label: '남고문 (남문)', x: 0, z: WALL_HALF, axis: 'z' as const },
    dongjeommun: { id: 'dongjeommun', name: '동점문', label: '동점문 (동문)', x: WALL_HALF, z: 0, axis: 'x' as const },
    seoseongmun: { id: 'seoseongmun', name: '서성문', label: '서성문·영금문 (서문)', x: -WALL_HALF, z: 0, axis: 'x' as const },
    bukmangmun: { id: 'bukmangmun', name: '북망문', label: '북망문 (북문)', x: 0, z: -WALL_HALF, axis: 'z' as const },
  },
} as const

export type GateId = keyof typeof LAYOUT.gates

/**
 * 초가 민가 — 답사 영상의 항공 재현 장면에서 성 안이 초가지붕 민가로
 * 빽빽이 채워져 있던 모습을 재구성합니다. 가운데 흙마당과 금성관 진입로,
 * 네 성문 축은 비워 두고 그 사이 빈 잔디에만 둡니다.
 */
export const HANOK_VILLAGE: ReadonlyArray<{ x: number; z: number; rotY: number }> = [
  { x: -34, z: -34, rotY: 0.5 },
  { x: -44, z: -20, rotY: 0.2 },
  { x: -44, z: 20, rotY: -0.2 },
  { x: -34, z: 34, rotY: -0.5 },
  { x: 34, z: -34, rotY: -0.5 },
  { x: 44, z: -22, rotY: 0.3 },
  { x: 34, z: 34, rotY: 0.4 },
  { x: -30, z: -46, rotY: 0.1 },
  { x: 28, z: -46, rotY: -0.1 },
  { x: -28, z: 46, rotY: -0.15 },
  { x: 28, z: 46, rotY: 0.15 },
  { x: -46, z: 4, rotY: -0.3 },
]

/** 문 안쪽으로 4m — 퀴즈·성벽 퍼즐 표지를 세우는 자리 */
export function gateMarker(id: GateId) {
  const g = LAYOUT.gates[id]
  const dx = g.x === 0 ? 0 : g.x > 0 ? -1 : 1
  const dz = g.z === 0 ? 0 : g.z > 0 ? -1 : 1
  return { x: g.x + dx * 5, z: g.z + dz * 5 }
}

/**
 * 성곽 벽체만. 문루는 사람이 지나다니는 통로라 막지 않고, 금성관 본체만
 * 실제로 막힌 건물로 넣습니다.
 */
const SEG_LEN = WALL_HALF - GATE_GAP
const SEG_OFF = (WALL_HALF + GATE_GAP) / 2

export const COLLIDERS: readonly Box[] = [
  box(LAYOUT.geumseonggwan.x, LAYOUT.geumseonggwan.z, LAYOUT.geumseonggwan.w, LAYOUT.geumseonggwan.d),
  box(LAYOUT.dongheon.x, LAYOUT.dongheon.z, LAYOUT.dongheon.w, LAYOUT.dongheon.d),
  // 망화루 — 가운데 어간은 비우고 양쪽 협칸만 막습니다
  box(LAYOUT.manghwaru.x - 3.6, LAYOUT.manghwaru.z, 2.6, LAYOUT.manghwaru.d),
  box(LAYOUT.manghwaru.x + 3.6, LAYOUT.manghwaru.z, 2.6, LAYOUT.manghwaru.d),
  // 남쪽 벽 — 남고문 좌우 두 토막
  box(-SEG_OFF, WALL_HALF, SEG_LEN, 3),
  box(SEG_OFF, WALL_HALF, SEG_LEN, 3),
  // 북쪽 벽 — 북망문 좌우
  box(-SEG_OFF, -WALL_HALF, SEG_LEN, 3),
  box(SEG_OFF, -WALL_HALF, SEG_LEN, 3),
  // 동쪽 벽 — 동점문 남북
  box(WALL_HALF, -SEG_OFF, 3, SEG_LEN),
  box(WALL_HALF, SEG_OFF, 3, SEG_LEN),
  // 서쪽 벽 — 서성문 남북
  box(-WALL_HALF, -SEG_OFF, 3, SEG_LEN),
  box(-WALL_HALF, SEG_OFF, 3, SEG_LEN),
  // 초가 민가 — 성 안을 채운 작은 집들
  ...HANOK_VILLAGE.map((h) => box(h.x, h.z, 4.2, 3.4)),
]
