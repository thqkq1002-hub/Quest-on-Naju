import { create } from 'zustand'
import { MAPS, type MapId } from '@/game/world/registry'

/**
 * 지금 어느 맵에 있는가, 그리고 옮겨 가는 중인가.
 *
 * 지역 이동은 로딩 화면이 아니라 **영산강 뱃길 연출**입니다. 그 사이에
 * 다음 씬 청크가 내려옵니다 — 기다리는 시간을 "영산강이 나주를 이었다" 는
 * 사실을 가르치는 데 씁니다. → docs/06-NAJU-WORLD-MAP.md 3절
 */

/** 뱃길 연출 길이(ms). 너무 짧으면 연출로 안 읽히고, 길면 지루합니다 */
export const SAIL_MS = 3600

interface Sailing {
  from: MapId
  to: MapId
  /** 연출이 시작된 시각. 배의 위치를 여기서 계산합니다 */
  startedAt: number
}

interface MapState {
  current: MapId
  sailing: Sailing | null
  visited: MapId[]
  travelTo: (to: MapId) => void
  /** 연출이 끝나면 씬을 갈아 끼웁니다 */
  arrive: () => void
}

const SAVE_KEY = 'naju-heritage-quest.map'

function loadCurrent(): { current: MapId; visited: MapId[] } {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY) ?? 'null')
    if (raw && raw.current in MAPS) {
      return { current: raw.current as MapId, visited: (raw.visited ?? [raw.current]) as MapId[] }
    }
  } catch {
    /* 저장이 막힌 환경 */
  }
  return { current: 'dasi-school', visited: ['dasi-school'] }
}

const saved = loadCurrent()

export const useMapStore = create<MapState>((set, get) => ({
  current: saved.current,
  sailing: null,
  visited: saved.visited,

  travelTo: (to) => {
    const { current, sailing } = get()
    if (sailing || to === current) return
    set({ sailing: { from: current, to, startedAt: performance.now() } })
  },

  arrive: () => {
    const s = get()
    if (!s.sailing) return
    const to = s.sailing.to
    const visited = s.visited.includes(to) ? s.visited : [...s.visited, to]
    set({ current: to, sailing: null, visited })
    try {
      localStorage.setItem(SAVE_KEY, JSON.stringify({ current: to, visited }))
    } catch {
      /* 무시 */
    }
  },
}))
