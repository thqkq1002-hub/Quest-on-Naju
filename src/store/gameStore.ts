import { create } from 'zustand'
import type { Quest } from '@/content/schema'
import { QUESTS, questById } from '@/game/quest/data'
import type { MapId } from '@/game/world/registry'

/**
 * 게임 상태.
 *
 * 매 프레임 바뀌는 값(캐릭터 위치, 카메라)은 여기 넣지 않습니다.
 * → docs/03-TECH-ARCHITECTURE.md 4절
 *
 * 퀘스트는 전부 데이터(src/content/sites/*.quests.json)에서 옵니다.
 * 이 스토어는 "어느 퀘스트가 어디까지 진행됐나"만 기억합니다.
 */

export interface DialogueLine {
  speaker: string
  text: string
}

/** 여러 줄 대화. 탭/Space가 한 줄씩 넘기고, 끝나면 onDone이 불립니다 */
interface DialogueSeq {
  lines: DialogueLine[]
  index: number
  onDone: (() => void) | null
}

/** 수락한 퀘스트의 진행 상황. objective id → 채운 횟수 */
export interface QuestRun {
  progress: Record<string, number>
}

/**
 * 레벨 구간별 칭호. docs/00-PLAN.md 3절.
 * 복암리 1차 호(弧)가 Lv.4에서 끝나므로 「견습 답사꾼」을 4로 내렸습니다 —
 * 지역이 늘어 XP 총량이 커지면 다시 5로 벌립니다.
 */
const TITLE_TIERS: ReadonlyArray<{ minLevel: number; title: string }> = [
  { minLevel: 20, title: '나주 최고 해설사' },
  { minLevel: 15, title: '나주 통(通)' },
  { minLevel: 10, title: '기록하는 자' },
  { minLevel: 4, title: '견습 답사꾼' },
  { minLevel: 1, title: '다시초 탐험대' },
]

export function titleForLevel(level: number): string {
  return TITLE_TIERS.find((t) => level >= t.minLevel)?.title ?? TITLE_TIERS.at(-1)!.title
}

/** 다음 레벨까지 필요한 누적 XP. 초반은 완만하게 — 좌절보다 진도감이 중요합니다 */
export function xpForLevel(level: number): number {
  return Math.round(100 * Math.pow(level, 1.4))
}

/** 도감 최초 해금 보너스. docs/02-GAME-DESIGN.md 4.1 */
const CODEX_XP = 50

interface GameState {
  level: number
  xp: number
  items: string[]
  codex: string[]
  /** 수락했고 아직 보상을 받지 않은 퀘스트 */
  active: Record<string, QuestRun>
  /** 보상까지 받은 퀘스트 id */
  completedQuests: string[]
  dialogue: DialogueSeq | null
  hint: string
  worldMapOpen: boolean
  /** 열려 있는 퍼즐의 id (없으면 null) */
  puzzle: string | null
  /** 탐험 수첩(도감·가방) 열림 여부 */
  inventoryOpen: boolean
  /** 현재 화면에 떠 있는 지역 완주 카드 (없으면 null) */
  siteEnding: MapId | null
  /** 이미 한 번 보여준 지역 완주 카드 — 다시 안 띄웁니다 */
  siteEndingsSeen: MapId[]
  /** 나주역 기념관 방명록 — 이 기기에서 남긴 추모 메시지만 기억합니다 */
  memorialMessages: string[]
  /** 전 퀘스트 완주 후 교장선생님이 보여주는 탐험 수료증 */
  certificate: boolean

  gainXp: (amount: number) => void
  showDialogue: (lines: DialogueLine[], onDone?: () => void) => void
  advanceDialogue: () => void
  setHint: (hint: string) => void
  openWorldMap: () => void
  closeWorldMap: () => void
  openPuzzle: (id: string) => void
  closePuzzle: () => void
  solvePuzzle: (id: string) => void
  openInventory: () => void
  closeInventory: () => void
  acceptQuest: (id: string) => void
  /** 게임 안에서 일어난 일을 알립니다. 맞는 목표가 있으면 진행됩니다 */
  questEvent: (kind: string, target: string) => void
  turnInQuest: (id: string) => void
  showSiteEnding: (id: MapId) => void
  dismissSiteEnding: () => void
  addMemorialMessage: (text: string) => void
  openCertificate: () => void
  closeCertificate: () => void
}

// ── 저장 ──────────────────────────────────────────────────────────
// 학교 공용 PC는 저장이 막혀 있을 수 있으므로 실패해도 조용히 넘어갑니다.
const SAVE_KEY = 'naju-heritage-quest'
const SAVE_VERSION = 1

interface SaveData {
  level: number
  xp: number
  items: string[]
  codex: string[]
  active: Record<string, QuestRun>
  completedQuests: string[]
  siteEndingsSeen: MapId[]
  memorialMessages: string[]
}

function loadSave(): SaveData | null {
  try {
    const raw = JSON.parse(localStorage.getItem(SAVE_KEY) ?? 'null')
    return raw && raw.v === SAVE_VERSION ? (raw.state as SaveData) : null
  } catch {
    return null
  }
}

function persist(s: GameState) {
  try {
    const state: SaveData = {
      level: s.level,
      xp: s.xp,
      items: s.items,
      codex: s.codex,
      active: s.active,
      completedQuests: s.completedQuests,
      siteEndingsSeen: s.siteEndingsSeen,
      memorialMessages: s.memorialMessages,
    }
    localStorage.setItem(SAVE_KEY, JSON.stringify({ v: SAVE_VERSION, state }))
  } catch {
    /* 저장이 막힌 환경 — 이번 방문 동안만 기억합니다 */
  }
}

export function clearSave() {
  try {
    localStorage.removeItem(SAVE_KEY)
  } catch {
    /* 무시 */
  }
}

const saved = loadSave()

export const useGameStore = create<GameState>((set, get) => ({
  level: saved?.level ?? 1,
  xp: saved?.xp ?? 0,
  items: saved?.items ?? [],
  codex: saved?.codex ?? [],
  active: saved?.active ?? {},
  completedQuests: saved?.completedQuests ?? [],
  dialogue: null,
  hint: '',
  worldMapOpen: false,
  puzzle: null,
  inventoryOpen: false,
  siteEnding: null,
  siteEndingsSeen: saved?.siteEndingsSeen ?? [],
  memorialMessages: saved?.memorialMessages ?? [],
  certificate: false,

  gainXp: (amount) => {
    let { level, xp } = get()
    xp += amount
    while (xp >= xpForLevel(level)) {
      xp -= xpForLevel(level)
      level += 1
    }
    set({ level, xp })
  },

  showDialogue: (lines, onDone) =>
    set({ dialogue: { lines, index: 0, onDone: onDone ?? null } }),

  advanceDialogue: () => {
    const d = get().dialogue
    if (!d) return
    if (d.index + 1 < d.lines.length) {
      set({ dialogue: { ...d, index: d.index + 1 } })
    } else {
      set({ dialogue: null })
      d.onDone?.()
    }
  },

  setHint: (hint) => set({ hint }),
  openWorldMap: () => set({ worldMapOpen: true }),
  closeWorldMap: () => set({ worldMapOpen: false }),
  openInventory: () => set({ inventoryOpen: true }),
  closeInventory: () => set({ inventoryOpen: false }),

  openPuzzle: (id) => set({ puzzle: id }),
  closePuzzle: () => set({ puzzle: null }),
  solvePuzzle: (id) => {
    set({ puzzle: null })
    get().questEvent('puzzle', id)
  },

  acceptQuest: (id) => {
    const s = get()
    if (s.active[id] || s.completedQuests.includes(id)) return
    set({ active: { ...s.active, [id]: { progress: {} } } })
  },

  questEvent: (kind, target) => {
    const s = get()
    let changed = false
    const next: Record<string, QuestRun> = {}
    for (const [qid, run] of Object.entries(s.active)) {
      const quest = questById(qid)
      let progress = run.progress
      for (const o of quest.objectives) {
        if (o.kind !== kind || o.target !== target) continue
        const need = o.count ?? 1
        const have = progress[o.id] ?? 0
        if (have >= need) continue
        progress = { ...progress, [o.id]: have + 1 }
        changed = true
      }
      next[qid] = progress === run.progress ? run : { progress }
    }
    if (changed) set({ active: next })
  },

  turnInQuest: (id) => {
    const s = get()
    const run = s.active[id]
    if (!run) return
    const quest = questById(id)

    const newItems = quest.rewards.items.filter((i) => !s.items.includes(i))
    const newCodex = quest.rewards.codex.filter((c) => !s.codex.includes(c))
    const rest = { ...s.active }
    delete rest[id]

    set({
      active: rest,
      completedQuests: [...s.completedQuests, id],
      items: [...s.items, ...newItems],
      codex: [...s.codex, ...newCodex],
    })
    get().gainXp(quest.rewards.xp + newCodex.length * CODEX_XP)
  },

  showSiteEnding: (id) =>
    set((s) => ({
      siteEnding: id,
      siteEndingsSeen: s.siteEndingsSeen.includes(id) ? s.siteEndingsSeen : [...s.siteEndingsSeen, id],
    })),
  dismissSiteEnding: () => set({ siteEnding: null }),

  addMemorialMessage: (text) => {
    const trimmed = text.trim().slice(0, 80)
    if (!trimmed) return
    // 최근 30개만 남깁니다 — 방명록이지 채팅 로그가 아닙니다
    set((s) => ({ memorialMessages: [...s.memorialMessages, trimmed].slice(-30) }))
  },

  openCertificate: () => set({ certificate: true }),
  closeCertificate: () => set({ certificate: false }),
}))

// 상태가 바뀔 때마다 저장합니다. 매 프레임 값은 스토어에 없으므로 쌉니다.
useGameStore.subscribe(persist)

// ── 파생 값 ──────────────────────────────────────────────────────
export type QuestPhase = 'locked' | 'available' | 'active' | 'ready' | 'done'

export function questPhase(
  s: Pick<GameState, 'level' | 'active' | 'completedQuests'>,
  id: string,
): QuestPhase {
  if (s.completedQuests.includes(id)) return 'done'
  const quest = questById(id)
  const run = s.active[id]
  if (run) {
    const allDone = quest.objectives.every((o) => (run.progress[o.id] ?? 0) >= (o.count ?? 1))
    return allDone ? 'ready' : 'active'
  }
  const prereqOk = quest.prerequisites.every((p) => s.completedQuests.includes(p))
  if (!prereqOk) return 'locked'
  return s.level >= quest.requiredLevel ? 'available' : 'locked'
}

/** 지금 진행 중인 퀘스트 하나 (로그 표시용 — 한 번에 하나면 충분합니다) */
export function currentQuest(s: Pick<GameState, 'active'>): Quest | null {
  const ids = Object.keys(s.active)
  return ids.length ? questById(ids[0]) : null
}

export { QUESTS }
