/**
 * 빛가람동 필드 배치.
 *
 * 좌표계: +X 동, -Z 북(호수공원 쪽), +Z 남(진입로 쪽). 1 unit = 1m.
 *
 * ── 고증 ────────────────────────────────────────────────────
 * 빛가람동은 나주시·전남 혁신도시로, 2005년 이후 논밭이던 자리에
 * 새로 계획해서 지은 동네입니다. 다시면(다시초등학교, 복암리)과 달리
 * "오래된 마을"이 아니라 "계획도시"라, 미술 방향도 다르게 갑니다 —
 * 다시면이 흙·벽돌·나무의 색이라면 여기는 유리·콘크리트·물의 색입니다.
 *
 *   · 한가운데 빛가람 호수공원 — 인공 호수를 중심으로 산책로가 둡니다
 *   · 호수 북쪽에 전망대 (높이 39.6m, 빛가람동에서 가장 눈에 띄는 구조물)
 *   · 서쪽에 한국전력공사(KEPCO) 본사 — 유리 외벽의 고층 사옥
 *   · 동쪽에 KENTECH(한국에너지공과대학교) 캠퍼스 — 낮고 넓은 건물
 *   · 북서쪽에 전력거래소(KPX) — 전국 전력 수급을 조절하는 관제센터
 *   · 북동쪽에 한국콘텐츠진흥원(KOCCA) — K-콘텐츠 산업을 지원하는 미디어 건물
 *   · 남쪽 진입로 옆에 스마트 라이프 센터 & 도서관 — 탄소중립 생활 공간
 *
 * 치수는 실측이 아니라 비율만 맞춘 값입니다. 다시초와 마찬가지로
 * 이 파일의 상수만 고치면 다른 코드는 손댈 필요가 없습니다.
 * ───────────────────────────────────────────────────────────
 */
import { box, type Box } from '@/lib/collision'

/** 플레이어가 돌아다닐 수 있는 범위 */
export const BOUNDS = { minX: -108, maxX: 108, minZ: -88, maxZ: 78 }

export const LAYOUT = {
  /** 빛가람 호수공원 — 가운데 인공 호수 */
  lake: { x: 0, z: -6, rx: 40, rz: 28 },

  /** 전망대 — 호수 북쪽, 높이 39.6m를 게임 스케일로 살렸습니다 */
  observatory: { x: 0, z: -50, r: 6.5, h: 24 },

  /** 한국전력공사 — 호수 서쪽, 유리 외벽 고층 사옥 */
  kepco: { x: -70, z: 6, w: 18, d: 15, h: 27 },

  /** KENTECH — 호수 동쪽, 낮고 넓은 캠퍼스 건물 */
  kentech: { x: 70, z: 16, w: 28, d: 17, h: 11 },

  /** 전력거래소(KPX) — 호수 북서쪽, 낮고 각진 관제센터 */
  kpx: { x: -56, z: -38, w: 16, d: 14, h: 10 },

  /** 한국콘텐츠진흥원(KOCCA) — 호수 북동쪽, 미디어 파사드가 있는 건물 */
  kocca: { x: 58, z: -38, w: 17, d: 14, h: 12 },

  /** 스마트 라이프 센터 & 도서관 — 남쪽 진입로 옆, 시민 생활 공간 */
  smartLife: { x: 0, z: 40, w: 20, d: 12, h: 8 },

  /** 플레이어 시작 지점 — 남쪽 진입로, 호수와 전망대를 바라보고 섭니다 */
  spawn: { x: 0, z: 58 },

  /** 빛가람 호수공원 안내원 — 전망대 앞 */
  guide: { x: 0, z: -32 },
  /** 한전 직원 — 사옥 앞 */
  kepcoStaff: { x: -58, z: 10 },
  /**
   * KENTECH 연구원 — 캠퍼스 앞. 원래 x:58,z:20은 캠퍼스 서쪽 날개
   * (충돌 박스 x:46~56, 본관 x:56~84)의 바로 안쪽이라, NPC가 건물
   * 매스 속에 파묻혀 보이지도 않고 다가갈 수도 없었습니다. 두 매스
   * 모두를 벗어난 서쪽(호수 방향)으로 옮겼습니다.
   */
  kentechResearcher: { x: 40, z: 16 },
  /** 전력거래소 관제 요원 — 관제센터 앞 */
  kpxOperator: { x: -56, z: -28 },
  /** KOCCA 크리에이터 — 미디어 건물 앞 */
  koccaCreator: { x: 58, z: -28 },
  /** 스마트 라이프 코디네이터 — 센터 앞 */
  smartLifeCoordinator: { x: 0, z: 32 },
} as const

/** 호숫가·진입로를 두르는 가로수 */
export const TREES: ReadonlyArray<[x: number, z: number, scale: number]> = [
  [-30, -34, 1.1], [-18, -40, 1.0], [18, -40, 1.05], [30, -34, 1.15],
  [-46, -14, 1.0], [46, -12, 1.05], [-40, 24, 1.1], [40, 26, 1.0],
  [-22, 48, 1.0], [22, 50, 1.15],
  [-22, -2, 0.9], [22, -4, 0.95],
  [-38, -46, 0.95], [40, -46, 1.0],
]

/**
 * 충돌 박스. 통과할 수 없는 것만 넣습니다.
 * 호수는 다시강(영산강)처럼 배경으로 두고 막지 않습니다 — 걸어서 둘러가게
 * 만드는 것보다 목적지로 곧장 갈 수 있는 쪽이 이 규모의 맵에서는 낫습니다.
 */
export const COLLIDERS: readonly Box[] = [
  box(LAYOUT.observatory.x, LAYOUT.observatory.z, LAYOUT.observatory.r * 2, LAYOUT.observatory.r * 2),
  box(LAYOUT.kepco.x, LAYOUT.kepco.z, LAYOUT.kepco.w, LAYOUT.kepco.d),
  box(LAYOUT.kentech.x, LAYOUT.kentech.z, LAYOUT.kentech.w, LAYOUT.kentech.d),
  box(LAYOUT.kpx.x, LAYOUT.kpx.z, LAYOUT.kpx.w, LAYOUT.kpx.d),
  box(LAYOUT.kocca.x, LAYOUT.kocca.z, LAYOUT.kocca.w, LAYOUT.kocca.d),
  box(LAYOUT.smartLife.x, LAYOUT.smartLife.z, LAYOUT.smartLife.w, LAYOUT.smartLife.d),
]
