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
]
