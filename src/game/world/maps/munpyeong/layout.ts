/**
 * 문평면 필드 배치 — 무민공 나대용 장군 유적.
 *
 * 좌표계: +X 동, -Z 북, +Z 남(진입로 쪽). 1 unit = 1m. 다시초와 같은 규칙입니다.
 *
 * ── 고증 ────────────────────────────────────────────────────
 * 나대용(羅大用, 1556~1612)은 나주 문평면 출신으로, 이순신 장군과 함께
 * 거북선(구선)을 설계·개량한 것으로 널리 알려진 인물입니다. 시호는 충장(忠壯),
 * 사후 무민공(武愍公)으로도 불립니다. 문평면에는 실제로 생가지와 그를 기리는
 * 사당 **소충사(昭忠祠)**가 있습니다.
 *
 * "거북선 건조 체험장"과 "창선 연구소"는 실존 관광 시설명이 아니라, 나대용
 * 장군이 남긴 업적(거북선 개량, 돌격선 창선 건조)을 게임에서 체험하도록
 * 재구성한 공간입니다 — 다른 두 곳(생가·소충사)과 성격이 다르다는 점을
 * 안내판 문구에서 분명히 합니다.
 *
 * 다시면(오늘의 학교), 빛가람동(오늘의 혁신도시)과 달리 여기는 "조선시대
 * 유적"입니다. 그래서 색도 재질도 다시 갑니다 — 흙벽돌·기와·단청의
 * 고재(古材) 색입니다.
 * ───────────────────────────────────────────────────────────
 */
import { box, type Box } from '@/lib/collision'

export const BOUNDS = { minX: -90, maxX: 90, minZ: -76, maxZ: 74 }

export const LAYOUT = {
  /** 나대용 장군 생가 */
  birthplace: { x: -28, z: -14, w: 16, d: 11, h: 5 },
  /** 소충사 — 사당 + 홍살문 */
  sochungsa: { x: 16, z: -20, w: 12, d: 10, h: 6 },
  /** 거북선 건조 체험장 — 작은 개천 위에 거북선 모형 */
  shipyard: { x: -6, z: 26, pondR: 15 },
  /** 신형 군함 창선 연구소 — 작업장 + 창선 */
  changseon: { x: 40, z: 18, w: 13, d: 10, h: 5.5 },

  /** 플레이어 시작 지점 — 남쪽 진입로 */
  spawn: { x: 0, z: 52 },

  /** 생가 관리인 */
  caretaker: { x: -28, z: -5 },
  /** 소충사 관리인 — 홍살문 안쪽 */
  shrineKeeper: { x: 16, z: -9 },
  /** 조선공 — 거북선 옆 */
  shipwright: { x: -6, z: 12 },
  /** 대장장이 — 창선 공방 앞 */
  blacksmith: { x: 40, z: 30 },
} as const

/** 유적을 두르는 소나무 — 다시면 향나무보다 짙고 옹이진 실루엣 */
export const PINES: ReadonlyArray<[x: number, z: number, scale: number]> = [
  [-46, -20, 1.1], [-40, 4, 1.0], [-10, -30, 1.05], [30, -32, 1.1],
  [50, 0, 1.0], [50, 34, 1.1], [10, 40, 0.95], [-40, 30, 1.0],
  [0, -6, 0.9], [24, 4, 0.95],
]

/**
 * 통과할 수 없는 것만. 소충사 사당·생가 안채·창선 공방처럼 실제로 막힌
 * 건물만 넣고, 홍살문(기둥 사이로 지나갈 수 있음)은 넣지 않습니다.
 */
export const COLLIDERS: readonly Box[] = [
  box(LAYOUT.birthplace.x, LAYOUT.birthplace.z, LAYOUT.birthplace.w, LAYOUT.birthplace.d),
  box(LAYOUT.sochungsa.x, LAYOUT.sochungsa.z, LAYOUT.sochungsa.w, LAYOUT.sochungsa.d),
  box(LAYOUT.changseon.x, LAYOUT.changseon.z, LAYOUT.changseon.w, LAYOUT.changseon.d),
]
