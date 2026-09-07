import { CODEX_NAMES, ITEM_NAMES } from '@/game/quest/data'

/**
 * 탐험 수첩(도감·가방)에 띄우는 항목 메타데이터.
 *
 * 이름은 `game/quest/data.ts`의 CODEX_NAMES/ITEM_NAMES를 그대로 따와
 * 두 군데서 따로 관리하지 않게 합니다. 여기서는 아이콘·분류·장소 같은
 * 표시용 정보만 더합니다.
 *
 * 설명은 최소한으로 씁니다 — 복암리 항목은 학습 콘텐츠 전문가 검수
 * 전이라 서술형 콘텐츠를 넣지 않는다는 방침(HANDOFF 4절)을 따릅니다.
 * "어디서 얻었는지"만 적고, 유물 자체에 대한 설명은 넣지 않습니다.
 */
export interface Collectible {
  id: string
  name: string
  icon: string
  category: string
  location: string
  description: string
  /** 가방(보유 아이템) 탭에도 나오는지 */
  isItem: boolean
}

export const COLLECTIBLES: readonly Collectible[] = [
  {
    id: 'item-golden-pear',
    name: ITEM_NAMES['item-golden-pear'],
    icon: '🍐',
    category: '특산물',
    location: '다시초등학교 · 배나무 밭',
    description: '나주는 예로부터 배가 많이 나는 고장입니다.',
    isItem: true,
  },
  {
    id: 'tool-trowel',
    name: ITEM_NAMES['tool-trowel'],
    icon: '🔧',
    category: '도구',
    location: '복암리 고분군',
    description: '발굴 현장에서 층위를 살필 때 쓰는 도구입니다.',
    isItem: true,
  },
  {
    id: 'bokamri-site',
    name: CODEX_NAMES['bokamri-site'],
    icon: '⛰️',
    category: '유적',
    location: '복암리 고분군',
    description: '복암리 고분군을 둘러보며 확인했습니다.',
    isItem: false,
  },
  {
    id: 'bokamri-ongan-burial',
    name: CODEX_NAMES['bokamri-ongan-burial'],
    icon: '⚱️',
    category: '매장시설',
    location: '복암리 고분군',
    description: '복암리 고분군 발굴 현장에서 확인한 매장시설입니다.',
    isItem: false,
  },
  {
    id: 'term-stratigraphy',
    name: CODEX_NAMES['term-stratigraphy'],
    icon: '🪨',
    category: '용어',
    location: '복암리 고분군',
    description: '복암리 고분군 발굴 현장에서 배운 용어입니다.',
    isItem: false,
  },
  {
    id: 'term-trench',
    name: CODEX_NAMES['term-trench'],
    icon: '⛏️',
    category: '용어',
    location: '복암리 고분군',
    description: '복암리 고분군 발굴 현장에서 배운 용어입니다.',
    isItem: false,
  },
  {
    id: 'item-bitgaram-telescope',
    name: ITEM_NAMES['item-bitgaram-telescope'],
    icon: '🔭',
    category: '도구',
    location: '빛가람동 · 호수공원 전망대',
    description: '전망대에서 빛가람동 전경을 보고 받았습니다.',
    isItem: true,
  },
  {
    id: 'item-smart-grid-core',
    name: ITEM_NAMES['item-smart-grid-core'],
    icon: '⚡',
    category: '특산물',
    location: '빛가람동 · 한국전력공사',
    description: '한국전력공사에서 스마트 그리드 문제를 풀고 받았습니다.',
    isItem: true,
  },
  {
    id: 'item-kentech-card',
    name: ITEM_NAMES['item-kentech-card'],
    icon: '🎓',
    category: '도구',
    location: '빛가람동 · KENTECH',
    description: 'KENTECH에서 수소 에너지 문제를 풀고 받았습니다.',
    isItem: true,
  },
  {
    id: 'item-kpx-badge',
    name: ITEM_NAMES['item-kpx-badge'],
    icon: '📊',
    category: '도구',
    location: '빛가람동 · 전력거래소',
    description: '전력거래소에서 전력 수급 문제를 풀고 받았습니다.',
    isItem: true,
  },
  {
    id: 'item-kocca-pen',
    name: ITEM_NAMES['item-kocca-pen'],
    icon: '🖊️',
    category: '도구',
    location: '빛가람동 · 한국콘텐츠진흥원',
    description: '한국콘텐츠진흥원에서 K-콘텐츠 문제를 풀고 받았습니다.',
    isItem: true,
  },
  {
    id: 'item-carbon-tumbler',
    name: ITEM_NAMES['item-carbon-tumbler'],
    icon: '🌱',
    category: '특산물',
    location: '빛가람동 · 스마트 라이프 센터',
    description: '스마트 라이프 센터에서 탄소중립 문제를 풀고 받았습니다.',
    isItem: true,
  },
  {
    id: 'item-na-blueprint',
    name: ITEM_NAMES['item-na-blueprint'],
    icon: '📜',
    category: '도구',
    location: '문평면 · 나대용 장군 생가',
    description: '나대용 장군 생가에서 문제를 풀고 받았습니다.',
    isItem: true,
  },
  {
    id: 'item-incense',
    name: ITEM_NAMES['item-incense'],
    icon: '🕯️',
    category: '도구',
    location: '문평면 · 소충사',
    description: '소충사에서 호국충절 문제를 풀고 받았습니다.',
    isItem: true,
  },
  {
    id: 'item-turtle-ship-model',
    name: ITEM_NAMES['item-turtle-ship-model'],
    icon: '🐢',
    category: '유물',
    location: '문평면 · 거북선 건조 체험장',
    description: '거북선 건조 체험장에서 문제를 풀고 받았습니다.',
    isItem: true,
  },
  {
    id: 'item-mumin-sword',
    name: ITEM_NAMES['item-mumin-sword'],
    icon: '⚔️',
    category: '유물',
    location: '문평면 · 창선 연구소',
    description: '창선 연구소에서 문제를 풀고 받았습니다.',
    isItem: true,
  },
  {
    id: 'item-station-pamphlet',
    name: ITEM_NAMES['item-station-pamphlet'],
    icon: '🎫',
    category: '도구',
    location: '나주역 · 광장',
    description: '나주역 안내원과 이야기를 나누고 받았습니다.',
    isItem: true,
  },
  {
    id: 'item-1920s-album',
    name: ITEM_NAMES['item-1920s-album'],
    icon: '📷',
    category: '도구',
    location: '나주역 · 대합실',
    description: '대합실 연표 카드 문제를 풀고 받았습니다.',
    isItem: true,
  },
  {
    id: 'item-testimony-record',
    name: ITEM_NAMES['item-testimony-record'],
    icon: '📝',
    category: '유물',
    location: '나주역 · 승강장',
    description: '세 사람의 증언을 듣고 편향 분석 리포트를 완성한 뒤 받았습니다.',
    isItem: true,
  },
  {
    id: 'item-mansei-badge',
    name: ITEM_NAMES['item-mansei-badge'],
    icon: '🎗️',
    category: '유물',
    location: '나주역 · 기념관',
    description: '기념비 앞에서 만세를 외치고 방명록에 마음을 남긴 뒤 받았습니다.',
    isItem: true,
  },
]
