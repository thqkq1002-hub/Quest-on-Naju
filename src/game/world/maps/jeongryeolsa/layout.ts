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

  /** [구역 1] 유물전시관 — 김천일 선생의 유품·의병 기록 */
  exhibit: { x: -16, z: 8, w: 10, d: 8, h: 5 },
  exhibitInfo: { x: -16, z: 2 },
  exhibitQuiz: { x: -8, z: 2 },

  /** [구역 2] 사당(정렬사) — 충절 5위 위패 */
  shrine: { x: 0, z: -18, w: 18, d: 12, h: 7 },
  shrineInfo: { x: 0, z: -9 },

  /** 의병 훈련 모닥불 — 사당 앞마당, 깃발·횃불 미니게임 */
  bonfire: { x: 0, z: -2 },
} as const

/** 사당·전시관 본체만 막습니다. 홍살문은 기둥 사이로 지나갈 수 있습니다 */
export const COLLIDERS: readonly Box[] = [
  box(LAYOUT.exhibit.x, LAYOUT.exhibit.z, LAYOUT.exhibit.w, LAYOUT.exhibit.d),
  box(LAYOUT.shrine.x, LAYOUT.shrine.z, LAYOUT.shrine.w, LAYOUT.shrine.d),
]
