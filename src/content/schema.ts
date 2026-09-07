/**
 * 콘텐츠 스키마
 *
 * `src/content/` 아래는 전부 데이터입니다. 새 유적·퀘스트를 추가할 때
 * `src/game/` 을 건드릴 일이 없어야 합니다. 이 경계가 무너지면 유적 3개쯤에서
 * 프로젝트가 멈춥니다. — docs/03-TECH-ARCHITECTURE.md 2절
 */

export type SiteId =
  | 'naju-world'
  | 'bokamri'
  | 'naju-museum'
  | 'hyanggyo'
  | 'geumseonggwan'
  | 'bitgaram'
  | 'munpyeong'
  | 'najustation'
  | 'yeongsanpo'
  | 'najueupseong'
  | 'ddeuldeulgang'

export type QuestType =
  | 'OBSERVE' // 관찰 — 지정 지점에서 대상을 살펴본다
  | 'COLLECT' // 수집 — 흩어진 유물·기록을 모은다
  | 'EXCAVATE' // 발굴 — 층위를 따라 조심스럽게 파낸다
  | 'RESTORE' // 복원 — 파편을 맞춰 원형을 되살린다
  | 'INTERPRET' // 해설 — 관람객 NPC의 질문에 답한다
  | 'ESCAPE' // 방탈출 — 잠긴 챔버의 연쇄 퍼즐

export type ObjectiveKind = 'reach' | 'interact' | 'collect' | 'puzzle' | 'dialogue'

export type EquipSlot = 'body' | 'legs' | 'feet' | 'head' | 'back' | 'hand'

export interface Objective {
  id: string
  kind: ObjectiveKind
  /** 씬 안의 오브젝트 ID 또는 퍼즐 ID */
  target: string
  /** 퀘스트 로그에 표시될 문구 */
  label: string
  /** 반복 목표일 때의 필요 횟수. 기본 1 */
  count?: number
}

/**
 * 출처. 문화재를 다루므로 학습 콘텐츠에는 필수입니다.
 * 출처 없는 항목은 커밋하지 않습니다.
 */
export interface Source {
  name: string
  url: string
  /** 공공누리 유형 등. 3D 에셋은 변형·상업이용 허용 여부가 유형마다 다릅니다 */
  license: string
  /** 사람이 실제로 확인한 날짜 (YYYY-MM-DD) */
  verifiedAt: string
}

export interface Quest {
  id: string
  site: SiteId
  title: string
  type: QuestType
  requiredLevel: number
  /** 선행 퀘스트 ID 목록 */
  prerequisites: string[]
  giver: { npc: string; marker: '!' | '?' }
  turnIn: { npc: string; marker: '!' | '?' }
  dialogue: {
    offer: string
    progress: string
    complete: string
  }
  objectives: Objective[]
  rewards: {
    xp: number
    items: string[]
    /** 완료 시 해금되는 도감 항목 */
    codex: string[]
    title: string | null
  }
  /**
   * 이 퀘스트가 무엇을 가르치는지. 필수입니다.
   * 여기를 채우지 못하는 퀘스트는 만들 이유가 없습니다.
   */
  learning: {
    curriculum: string
    concepts: string[]
  }
}

export interface CodexEntry {
  id: string
  name: string
  category: '유적' | '매장시설' | '용어' | '시대' | '도구' | '유물' | '건축'
  site: SiteId
  summary: string
  /** 이 항목을 해금시키는 퀘스트 ID */
  unlockedBy: string
  /** 도감에서 돌려볼 수 있는 3D 모델 경로 (없으면 null) */
  model: string | null
  source: Source
}

export interface Item {
  id: string
  name: string
  slot: EquipSlot | null
  description: string
  /** 이 아이템이 해금하는 기능. 장비는 성능이 아니라 열쇠입니다 */
  unlocks: string[]
  mesh: string | null
}

/** 레벨 구간별 칭호. docs/00-PLAN.md 3절 */
export interface TitleTier {
  minLevel: number
  title: string
  outfit: Partial<Record<EquipSlot, string>>
}
