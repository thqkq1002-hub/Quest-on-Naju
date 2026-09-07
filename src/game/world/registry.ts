/**
 * 씬 레지스트리 — 맵을 데이터로 등록합니다.
 *
 * 맵을 늘릴 때 고쳐야 할 코드가 여기 한 줄이어야 합니다.
 * `scene` 은 동적 import 라, 복암리에 안 간 사람은 복암리 청크를 받지 않습니다.
 * → docs/06-NAJU-WORLD-MAP.md 5절
 */
import { lazy, type LazyExoticComponent, type ComponentType } from 'react'

export type MapId =
  | 'dasi-school'
  | 'bokamri'
  | 'bitgaram'
  | 'munpyeong'
  | 'najustation'
  | 'yeongsanpo'
  | 'najueupseong'
  | 'ddeuldeulgang'

/** 씬 컴포넌트가 받는 것은 이것 하나뿐입니다 (맵마다 지켜야 할 계약) */
export interface SceneProps {
  shadows: boolean
}

export type UnlockRule =
  | { type: 'always' }
  | { type: 'quest'; id: string }

export interface MapDef {
  id: MapId
  name: string
  region: string
  era: string
  /** 월드맵에서 이 지역을 고를 때 보여 줄 한 줄 */
  blurb: string
  scene: LazyExoticComponent<ComponentType<SceneProps>>
  unlock: UnlockRule
  /**
   * 월드맵 지도판 위의 위치 (0~1). 실제 지리와 일치시킵니다 —
   * "우리 지역을 안다" 가 목적이라 여기는 양보하지 않습니다.
   * 다시면은 나주 북서쪽, 복암리는 그보다 조금 남동쪽(같은 다시면)입니다.
   */
  worldMapPos: [x: number, y: number]
  /**
   * 이 지역에 **도착**할 때 쓸 이동 연출. 기본은 나룻배(영산강)이고,
   * 나주역만 기차입니다 — 강이 아니라 철길로 이어지는 곳이니까요.
   */
  travelMode?: 'boat' | 'train'
}

export const MAPS: Record<MapId, MapDef> = {
  'dasi-school': {
    id: 'dasi-school',
    name: '다시초등학교',
    region: '다시면',
    era: '오늘',
    blurb: '내가 매일 다니는 학교. 여기서 시작합니다.',
    scene: lazy(() =>
      import('./maps/DasiSchoolField').then((m) => ({ default: m.DasiSchoolField })),
    ),
    unlock: { type: 'always' },
    worldMapPos: [0.3, 0.26],
  },
  bokamri: {
    id: 'bokamri',
    name: '복암리 고분군',
    region: '다시면',
    era: '마한 ~ 백제',
    blurb: '언덕처럼 보이는 1500년 된 무덤. 사적 404호.',
    scene: lazy(() =>
      import('./maps/BokamriSite').then((m) => ({ default: m.BokamriSite })),
    ),
    // 검수 편의상 지금은 항상 열어 둡니다. 원래 조건은
    // { type: 'quest', id: 'dasi-00-meet-teacher' } — 되돌리려면 이 값으로.
    unlock: { type: 'always' },
    worldMapPos: [0.42, 0.38],
  },
  bitgaram: {
    id: 'bitgaram',
    name: '빛가람동',
    region: '빛가람동',
    era: '오늘',
    blurb: '논밭이던 자리에 새로 지은 혁신도시. 호수공원과 전망대, 한국전력공사와 KENTECH가 있습니다.',
    scene: lazy(() =>
      import('./maps/BitgaramSite').then((m) => ({ default: m.BitgaramSite })),
    ),
    // 검수 편의상 지금은 항상 열어 둡니다. 원래 조건은
    // { type: 'quest', id: 'bokamri-02-jar-coffin' } — 되돌리려면 이 값으로.
    unlock: { type: 'always' },
    worldMapPos: [0.58, 0.7],
  },
  munpyeong: {
    id: 'munpyeong',
    name: '문평면',
    region: '문평면',
    era: '조선',
    blurb: '무민공 나대용 장군의 고향. 생가와 소충사, 거북선 이야기가 있습니다.',
    scene: lazy(() =>
      import('./maps/MunpyeongSite').then((m) => ({ default: m.MunpyeongSite })),
    ),
    // 검수 편의상 지금은 항상 열어 둡니다. 원래 조건은
    // { type: 'quest', id: 'bokamri-02-jar-coffin' } — 되돌리려면 이 값으로.
    unlock: { type: 'always' },
    worldMapPos: [0.14, 0.15],
  },
  najustation: {
    id: 'najustation',
    name: '나주역',
    region: '죽림동',
    era: '1929',
    blurb: '1929년 10월 30일, 광주학생독립운동의 발단이 된 그 승강장. 슬프지만 잊지 않아야 할 이야기입니다.',
    scene: lazy(() =>
      import('./maps/NajuStationSite').then((m) => ({ default: m.NajuStationSite })),
    ),
    // 검수 편의상 지금은 항상 열어 둡니다. 원래 조건은
    // { type: 'quest', id: 'bokamri-02-jar-coffin' } — 되돌리려면 이 값으로.
    unlock: { type: 'always' },
    // 영산강 곡선 위가 아니라, 기찻길(WorldMap.tsx의 RAILWAY) 끝점에 맞춥니다 —
    // 강이 아니라 철길로 이어지는 곳이라는 걸 지도에서도 보여주기 위해서입니다.
    worldMapPos: [0.41, 0.66],
    // 다시역에서 기차를 타고 나주역으로 — 강이 아니라 철길로 이어집니다.
    travelMode: 'train',
  },
  yeongsanpo: {
    id: 'yeongsanpo',
    name: '영산포',
    region: '영산동',
    era: '근대',
    blurb: '옛날 영산강을 따라 배가 드나들던 호남 물류의 중심지. 근대 역사 갤러리와 문학관, 홍어 거리가 있습니다.',
    scene: lazy(() =>
      import('./maps/YeongsanpoSite').then((m) => ({ default: m.YeongsanpoSite })),
    ),
    unlock: { type: 'always' },
    // 영산강 물길 위 — 실제로 영산포가 강변 나루터 마을이었던 자리입니다
    worldMapPos: [0.5, 0.55],
  },
  najueupseong: {
    id: 'najueupseong',
    name: '나주읍성',
    region: '나주 구도심',
    era: '조선',
    blurb: '"작은 서울"이라 불리던 호남의 중심 읍성. 금성관과 남고문·동점문·서성문·북망문 4대문이 있습니다.',
    scene: lazy(() =>
      import('./maps/NajueupseongSite').then((m) => ({ default: m.NajueupseongSite })),
    ),
    unlock: { type: 'always' },
    // 나주읍성은 실제로 나주 구도심 한복판, 영산포보다 조금 북서쪽입니다
    worldMapPos: [0.44, 0.5],
  },
  ddeuldeulgang: {
    id: 'ddeuldeulgang',
    name: '드들강 솔밭유원지',
    region: '남평읍',
    era: '오늘',
    blurb: '광주와 빛가람동 사이, 드들강변의 소나무 숲. 작곡가 안성현 선생의 노래비가 있습니다.',
    scene: lazy(() =>
      import('./maps/DdeuldeulgangSite').then((m) => ({ default: m.DdeuldeulgangSite })),
    ),
    unlock: { type: 'always' },
    // 지도 북동쪽 — 다시역에서 갈라져 나가는 별도 기찻길 끝점입니다
    worldMapPos: [0.82, 0.12],
    // 다시역에서 기차를 타고 갑니다 — 나주역과 같은 방식입니다
    travelMode: 'train',
  },
}

export const MAP_ORDER: MapId[] = [
  'dasi-school',
  'bokamri',
  'munpyeong',
  'najueupseong',
  'najustation',
  'yeongsanpo',
  'ddeuldeulgang',
  'bitgaram',
]

export function isUnlocked(def: MapDef, completedQuests: string[]): boolean {
  return def.unlock.type === 'always' || completedQuests.includes(def.unlock.id)
}
