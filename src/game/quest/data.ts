/**
 * 퀘스트 데이터 로더.
 *
 * 퀘스트는 코드가 아니라 데이터입니다 (docs/02-GAME-DESIGN.md 2.3).
 * 여기서 사이트별 JSON을 모아 스키마 타입으로 내보내고,
 * 게임 코드는 이 모듈만 바라봅니다.
 */
import type { Quest } from '@/content/schema'
import dasiQuests from '@/content/sites/dasi-school.quests.json'
import bokamriQuests from '@/content/sites/bokamri.quests.json'
import bitgaramQuests from '@/content/sites/bitgaram.quests.json'
import munpyeongQuests from '@/content/sites/munpyeong.quests.json'
import najustationQuests from '@/content/sites/najustation.quests.json'
import yeongsanpoQuests from '@/content/sites/yeongsanpo.quests.json'
import najueupseongQuests from '@/content/sites/najueupseong.quests.json'
import ddeuldeulgangQuests from '@/content/sites/ddeuldeulgang.quests.json'
import jeongryeolsaQuests from '@/content/sites/jeongryeolsa.quests.json'

export const QUESTS: readonly Quest[] = [
  ...(dasiQuests as Quest[]),
  ...(bokamriQuests as Quest[]),
  ...(bitgaramQuests as Quest[]),
  ...(munpyeongQuests as Quest[]),
  ...(najustationQuests as Quest[]),
  ...(yeongsanpoQuests as Quest[]),
  ...(najueupseongQuests as Quest[]),
  ...(ddeuldeulgangQuests as Quest[]),
  ...(jeongryeolsaQuests as Quest[]),
]

const byId = new Map(QUESTS.map((q) => [q.id, q]))

export function questById(id: string): Quest {
  const q = byId.get(id)
  if (!q) throw new Error(`정의되지 않은 퀘스트: ${id}`)
  return q
}

/**
 * 도감 항목 이름. 완전한 도감 UI(모델·출처 카드)는 다음 단계이고,
 * 지금은 엔딩과 HUD가 보여줄 이름만 필요합니다.
 * 서술형 콘텐츠는 전문가 검수 전이라 넣지 않습니다 → docs/04 경고문.
 */
export const CODEX_NAMES: Record<string, string> = {
  'bokamri-site': '나주 복암리 고분군 (사적 404호)',
  'bokamri-ongan-burial': '옹관묘(甕棺墓)',
  'bokamri-apartment-tomb': '아파트식 고분',
  'relic-golden-shoe': '물고기 달개 금동신발',
  'term-stratigraphy': '층위(層位)',
  'term-trench': '트렌치',
  'tool-trowel': '흙손',
  'item-golden-shoe-badge': '위대한 고고학자 배지',
  'item-golden-pear': '황금 나주배',
  'item-bitgaram-telescope': '빛가람의 눈 망원경',
  'item-smart-grid-core': '스마트 그리드 코어',
  'item-kentech-card': 'KENTECH 연구원 카드',
  'item-kpx-badge': '전력 거래 매니저 배지',
  'item-kocca-pen': 'K-크리에이터 펜',
  'item-carbon-tumbler': '탄소중립 마스터 텀블러',
  'item-na-blueprint': '나대용 장군의 설계도',
  'item-incense': '충절의 향불',
  'item-turtle-ship-model': '전설의 거북선 모형',
  'item-mumin-sword': '무민공의 삼척검',
  'item-station-pamphlet': '나주역 안내 팜플렛',
  'item-1920s-album': '1920년대 사진첩',
  'item-testimony-record': '학생들의 증언록',
  'item-mansei-badge': '만세 함성 배지',
  'yeongsanpo-gallery': '영산포 역사갤러리 (구 조선식산은행 건물)',
  'yeongsanpo-literature': '타오르는 강 문학관',
  'item-hongeo-samhap': '영산포 홍어삼합',
  'najueupseong-geumseonggwan': '금성관',
  'gate-namgomun': '남고문 (남문)',
  'gate-dongjeommun': '동점문 (동문)',
  'gate-seoseongmun': '서성문·영금문 (서문)',
  'gate-bukmangmun': '북망문 (북문)',
  'item-guardian-token': '나주읍성 수호대장 마패',
  'item-naju-gomtang': '나주곰탕',
  'ddeuldeulgang-songbi': '안성현 선생 노래비',
  'item-ansunghyeon-songbook': '안성현 선생의 노래책',
  'jeongryeolsa-exhibit': '정렬사 유물전시관',
  'jeongryeolsa-shrine': '정렬사 충절 5위',
  'item-uibyeong-torch': '의병의 횃불',
}

export const ITEM_NAMES: Record<string, string> = {
  'tool-trowel': '흙손',
  'item-golden-shoe-badge': '위대한 고고학자 배지',
  'item-hongeo-samhap': '영산포 홍어삼합',
  'item-guardian-token': '나주읍성 수호대장 마패',
  'item-naju-gomtang': '나주곰탕',
  'item-ansunghyeon-songbook': '안성현 선생의 노래책',
  'item-uibyeong-torch': '의병의 횃불',
  'item-golden-pear': '황금 나주배',
  'item-bitgaram-telescope': '빛가람의 눈 망원경',
  'item-smart-grid-core': '스마트 그리드 코어',
  'item-kentech-card': 'KENTECH 연구원 카드',
  'item-kpx-badge': '전력 거래 매니저 배지',
  'item-kocca-pen': 'K-크리에이터 펜',
  'item-carbon-tumbler': '탄소중립 마스터 텀블러',
  'item-na-blueprint': '나대용 장군의 설계도',
  'item-incense': '충절의 향불',
  'item-turtle-ship-model': '전설의 거북선 모형',
  'item-mumin-sword': '무민공의 삼척검',
  'item-station-pamphlet': '나주역 안내 팜플렛',
  'item-1920s-album': '1920년대 사진첩',
  'item-testimony-record': '학생들의 증언록',
  'item-mansei-badge': '만세 함성 배지',
}

/** HUD에 아이템을 표시할 때 쓰는 아이콘. 없으면 기본 🔧 */
export const ITEM_ICONS: Record<string, string> = {
  'tool-trowel': '🔧',
  'item-golden-shoe-badge': '👞',
  'item-hongeo-samhap': '🍽️',
  'item-guardian-token': '🏯',
  'item-naju-gomtang': '🍲',
  'item-ansunghyeon-songbook': '🎼',
  'item-uibyeong-torch': '🔥',
  'item-golden-pear': '🍐',
  'item-bitgaram-telescope': '🔭',
  'item-smart-grid-core': '⚡',
  'item-kentech-card': '🎓',
  'item-kpx-badge': '📊',
  'item-kocca-pen': '🖊️',
  'item-carbon-tumbler': '🌱',
  'item-na-blueprint': '📜',
  'item-incense': '🕯️',
  'item-turtle-ship-model': '🐢',
  'item-mumin-sword': '⚔️',
  'item-station-pamphlet': '🎫',
  'item-1920s-album': '📷',
  'item-testimony-record': '📝',
  'item-mansei-badge': '🎗️',
}
