/**
 * 정렬사 배치 — 김천일 의병장과 충절 5위를 모신 사당.
 *
 * 좌표계: +X 동, -Z 북, +Z 남(진입로 쪽). 1 unit = 1m. 다른 맵과 같은 규칙입니다.
 *
 * ── 고증 ────────────────────────────────────────────────────
 * 정렬사(旌烈祠)는 나주시 대호동에 있는 사당으로, 임진왜란 때 나주
 * 금성관 망화루 앞에서 호남 최초로 의병을 일으킨 김천일(金千鎰,
 * 1537~1593) 의병장과 아들 김상건, 양산숙, 임회, 이용재 등 충절 5위의
 * 위패를 모셨습니다. 김천일은 이후 제2차 진주성 전투에서 순절했습니다.
 *
 * 공간은 문평면 소충사와 같은 문법(홍살문 + 단청 사당)을 씁니다 — 둘 다
 * "충절을 기리는 사당"이라는 같은 장르라 새로 만들 이유가 없습니다.
 *
 * 건물 치수·배치는 실측이 아니라 게임용 재구성입니다.
 * ───────────────────────────────────────────────────────────
 */
import { box, type Box } from '@/lib/collision'

export const BOUNDS = { minX: -50, maxX: 50, minZ: -50, maxZ: 50 }

export const LAYOUT = {
  /** 플레이어 시작 지점 — 남쪽 진입로 */
  spawn: { x: 0, z: 40 },
  /** 김천일 의병장 — 홍살문을 지나 유물전시관으로 가는 길목 */
  kimCheonil: { x: 0, z: 26 },

  /** 홍살문 — 사당 영역의 입구 */
  hongsalmun: { x: 0, z: 20 },

  /**
   * 외삼문 — 홍살문을 지나 안마당으로 들어서는 세 칸 솟을대문.
   * 실제 정렬사 답사 영상에서 확인되는 기와지붕 대문을 재구성했습니다.
   * 가운데 어간(御間)만 열려 있고 양쪽 협칸은 벽으로 막혀 있습니다.
   */
  oesammun: { x: 0, z: 12, w: 7.2, d: 3, h: 4.4 },

  /** [구역 1] 유물전시관 — 김천일 선생의 유품·의병 기록 */
  exhibit: { x: -16, z: 4, w: 10, d: 8, h: 5 },
  exhibitInfo: { x: -16, z: -2 },
  exhibitQuiz: { x: -8, z: -2 },
  /** 전시관 옆면에 거는 「제2차 진주성 전투도」 — 김천일이 순절한 전투를 그린 모사도 */
  exhibitMural: { x: -16 + 5 + 0.1, z: 4 },

  /** [구역 2] 사당(정렬사) — 충절 5위 위패 */
  shrine: { x: 0, z: -22, w: 18, d: 12, h: 7 },
  shrineInfo: { x: 0, z: -13 },

  /** 의병 훈련 모닥불 — 사당 앞마당, 깃발·횃불 미니게임 */
  bonfire: { x: 0, z: -6 },

  /** 김천일 장군 동상 — 답사 영상에서 확인되는 청동상. 진입로 동쪽, 참배객을 맞는 자리 */
  statue: { x: 13, z: 24, h: 4.4 },

  /** 정렬사 사적비 — 임진왜란과 김천일의 의병 창의를 새긴 번역비. 진입로 서쪽 */
  stele: { x: -13, z: 24, h: 2.6 },
  /** 사적비 뒤로 두르는 나지막한 돌 축대 */
  steleWall: { x: -13, z: 27, w: 8 },
} as const

/** 사당·전시관·외삼문 협칸만 막습니다. 홍살문과 외삼문 어간은 지나갈 수 있습니다 */
export const COLLIDERS: readonly Box[] = [
  box(LAYOUT.exhibit.x, LAYOUT.exhibit.z, LAYOUT.exhibit.w, LAYOUT.exhibit.d),
  box(LAYOUT.shrine.x, LAYOUT.shrine.z, LAYOUT.shrine.w, LAYOUT.shrine.d),
  box(LAYOUT.oesammun.x - 2.5, LAYOUT.oesammun.z, 2, LAYOUT.oesammun.d),
  box(LAYOUT.oesammun.x + 2.5, LAYOUT.oesammun.z, 2, LAYOUT.oesammun.d),
  box(LAYOUT.statue.x, LAYOUT.statue.z, 1.6, 1.6),
  box(LAYOUT.stele.x, LAYOUT.stele.z, 1, 0.6),
]

/** 사당 뒷산을 두르는 소나무 숲 — 답사 영상 속 나지막한 뒷산을 재구성합니다 */
export const PINES: ReadonlyArray<[x: number, z: number, scale: number]> = [
  [-34, -30, 1.1], [-24, -38, 1.0], [-8, -42, 1.05], [10, -40, 1.0],
  [26, -34, 1.1], [36, -22, 0.95], [-40, -10, 1.0], [-42, 14, 1.05],
  [40, -2, 1.0], [40, 20, 0.95], [-34, 30, 0.9], [30, 34, 1.0],
]
