/**
 * 복암리 고분군 배치.
 *
 * 좌표계: +X 동, -Z 북, 1 unit = 1m. 다시초와 같은 규칙입니다.
 *
 * ── 고증 주의 ────────────────────────────────────────────────
 * 나주 복암리 고분군 · 사적 제404호 · 전남 나주시 다시면 복암리.
 * 낮은 구릉에 분구묘 4기가 모여 있고, 3호분은 하나의 분구 안에 여러 시기의
 * 매장시설이 겹쳐 있는 것으로 널리 알려져 있습니다.
 *
 * **아래 치수·배치는 실측이 아니라 게임용 재구성입니다.** 고분의 상대적
 * 위치와 규모감만 맞췄습니다. 국립나주박물관 발굴조사 보고서로 검증한 뒤
 * 이 파일의 상수만 고치면 되도록, 다른 코드는 전부 여기를 참조합니다.
 * → docs/04-CONTENT-bokamri.md 머리말 경고
 * ────────────────────────────────────────────────────────────
 */
import { box, type Box } from '@/lib/collision'

export const BOUNDS = { minX: -70, maxX: 70, minZ: -64, maxZ: 62 }

/** 고분 하나. 분구는 낮고 넓은 사다리꼴 언덕입니다 */
export interface Mound {
  id: string
  label: string
  x: number
  z: number
  /** 밑면 반지름 (타원) */
  rx: number
  rz: number
  h: number
}

export const MOUNDS: readonly Mound[] = [
  { id: 'mound-1', label: '1호분', x: -34, z: -14, rx: 13, rz: 11, h: 4.6 },
  { id: 'mound-2', label: '2호분', x: -8, z: -26, rx: 11, rz: 10, h: 4.0 },
  { id: 'mound-3', label: '3호분', x: 22, z: -12, rx: 17, rz: 14, h: 6.4 },
  { id: 'mound-4', label: '4호분', x: 44, z: -30, rx: 10, rz: 9, h: 3.6 },
]

export const LAYOUT = {
  /** 나룻배가 닿는 선착장 — 남쪽. 여기가 진입 지점입니다 */
  dock: { x: -4, z: 46 },
  spawn: { x: -4, z: 40 },
  /** 발굴 캠프 천막 */
  camp: { x: -22, z: 20 },
  /** 3호 트렌치 — 3호분 남쪽 사면 아래 */
  trench: { x: 22, z: 8, w: 12, d: 8 },
  /** 옹관 전시 가림막 */
  onganShelter: { x: -2, z: 6 },
  /** 언덕 위 전망대 — 3호분 정상 */
  viewpoint: { x: 22, z: -12 },
  /** NPC 자리 */
  elder: { x: -6, z: 34 },
  digLead: { x: -18, z: 15 },
  researcher: { x: 2, z: 10 },
  explorer: { x: 2, z: -6 },
  /** 96호 돌방무덤 발굴지 — 3호분 서쪽 기슭 */
  goldenShoeDig: { x: 6, z: -10 },
} as const

/** 안내판. 전부 퍼즐의 단서입니다 — 장식이 아닙니다 */
export interface Signboard {
  id: string
  x: number
  z: number
  rotY: number
  title: string
  body: string
}

export const SIGNS: readonly Signboard[] = [
  {
    id: 'signboard-01',
    x: -6, z: 26, rotY: 0,
    title: '나주 복암리 고분군',
    body: '사적 제404호. 낮은 구릉에 분구묘가 모여 있습니다. 언덕처럼 보이지만 사람이 흙을 쌓아 만든 무덤입니다.',
  },
  {
    id: 'signboard-02',
    x: 10, z: 10, rotY: -0.5,
    title: '층위 — 아래일수록 오래된 것',
    body: '흙은 시간이 지나며 위로 쌓입니다. 그래서 아래에 있는 층이 위에 있는 층보다 먼저 쌓인, 더 오래된 층입니다.',
  },
  {
    id: 'signboard-03',
    x: -2, z: 1, rotY: 0.3,
    title: '옹관묘(甕棺墓)',
    body: '큰 항아리를 관으로 쓴 무덤입니다. 항아리 두 개의 입을 맞대어 그 안에 사람을 눕혔습니다. 영산강 유역에서 특히 발달했습니다.',
  },
  {
    id: 'signboard-04',
    x: 36, z: 2, rotY: -0.9,
    title: '트렌치',
    body: '땅을 좁고 길게 파 내려가 흙의 단면을 보는 조사 구덩이입니다. 넓게 파헤치지 않고 먼저 층을 읽습니다.',
  },
  {
    id: 'signboard-05',
    x: 22, z: -30, rotY: Math.PI,
    title: '하나의 무덤, 여러 시기',
    body: '3호분은 한 분구 안에 서로 다른 시기의 매장시설이 겹쳐 있습니다. 한 무덤에 시간이 쌓인 셈입니다.',
  },
]

/**
 * 구릉 지형. 고분은 "언덕처럼 보이는 무덤" 이므로 땅 자체가 콘텐츠입니다.
 * 물리엔진 없이, 좌표를 넣으면 높이가 나오는 함수 하나로 처리합니다.
 */
export function heightAt(x: number, z: number): number {
  // 완만한 밑바탕 구릉 — 북쪽으로 갈수록 조금 높아집니다
  let h = Math.max(0, (-z + 20) * 0.035)

  for (const m of MOUNDS) {
    const dx = (x - m.x) / m.rx
    const dz = (z - m.z) / m.rz
    const d = Math.hypot(dx, dz)
    if (d >= 1) continue
    // 가장자리는 완만하고 정상은 평평하게 — 분구의 실루엣
    const t = 1 - d
    h += m.h * (t * t * (3 - 2 * t))
  }
  return h
}

/**
 * 통과할 수 없는 것만. 언덕은 걸어 오를 수 있어야 하므로 넣지 않습니다.
 *
 * 천막과 가림막은 **기둥과 지붕뿐이라 아래로 지나갈 수 있습니다.** 처음에는
 * 시설물 전체를 막았는데, 선착장에서 고분으로 가는 길목에 가림막이 있어
 * 플레이어가 벽에 걸렸습니다. 실제로 막혀 있는 것 — 작업대와 전시 받침 —
 * 만 남깁니다. 조작 답답함이 고증 정확도보다 비쌉니다.
 */
export const COLLIDERS: readonly Box[] = [
  // 발굴 캠프의 작업대
  box(LAYOUT.camp.x, LAYOUT.camp.z, 3.6, 1.8),
  // 옹관 전시 받침 단
  box(LAYOUT.onganShelter.x, LAYOUT.onganShelter.z, 6.2, 3.6),
]
