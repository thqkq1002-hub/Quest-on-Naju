import { useEffect } from 'react'
import { useGameStore, titleForLevel } from '@/store/gameStore'
import { CODEX_NAMES } from '@/game/quest/data'
import { useMapStore } from '@/store/mapStore'
import type { MapId } from '@/game/world/registry'

/**
 * 지역 완주 카드 — 한 지역의 퀘스트를 전부 마쳤을 때.
 *
 * 이 게임의 마지막 장면은 "다 깼다" 가 아니라 **같은 자리가 다르게
 * 보이는 것**입니다. 그래서 트로피를 주는 대신, 배운 것을 한 줄로
 * 되돌려 주고 다시초로 돌아갈 문을 엽니다 — 여덟 지역 모두 같은 문법을
 * 씁니다. → docs/06-NAJU-WORLD-MAP.md 4절
 *
 * 다시초등학교는 시작점이라 이 카드가 없습니다. 여기 없는 지역은
 * 아직 완주 카드를 안 만든 것이 아니라, 만들 이유가 없는 곳입니다.
 */
interface SiteEndingContent {
  questIds: readonly string[]
  eyebrow: string
  title: string
  body: string
  /** 다음 행선지 안내. 빛가람동(마지막 지역)은 학교로 돌아가라는 말로 맺습니다 */
  nextHint: string
}

const SITE_ENDINGS: Partial<Record<MapId, SiteEndingContent>> = {
  bokamri: {
    questIds: ['bokamri-00-arrival', 'bokamri-01-first-dig', 'bokamri-02-jar-coffin', 'bokamri-03-golden-shoe'],
    eyebrow: '복암리 고분군 · 답사 완료',
    title: '언덕이 무덤으로 보이기 시작했습니다',
    body:
      '처음 왔을 때 저것은 그냥 언덕이었습니다. 지금은 1500년 전 사람들이 흙을 쌓아 만든 무덤이고, ' +
      '그 안에 항아리로 만든 관이 있고, 흙에는 쌓인 순서가 있다는 것을 압니다. 그리고 그 무덤이 41기나 ' +
      "겹겹이 쌓인 '아파트식 고분'이며, 그 속에서 물고기 장식이 달린 금동신발까지 당신 손으로 찾아냈다는 것도요.",
    nextHint: '다음은 나대용장군 생가입니다. 학교 운동장을 한 번 더 보고 오시겠어요?',
  },
  munpyeong: {
    questIds: [
      'munpyeong-01-birthplace',
      'munpyeong-02-sochungsa',
      'munpyeong-03-shipyard',
      'munpyeong-04-changseon',
    ],
    eyebrow: '나대용장군 생가 · 답사 완료',
    title: '생가 마당이 다르게 보이기 시작했습니다',
    body:
      '처음엔 그냥 오래된 기와집이었습니다. 지금은 이순신 장군과 함께 거북선을 설계한 나대용 장군이 ' +
      '태어난 곳이고, 소충사에는 그 충절을 기리는 위패가 모셔져 있다는 것을 압니다. 판옥선을 거북선으로 ' +
      '바꾼 발상도, 창선이라는 무기를 벼려 낸 것도 — 전부 이 마을 사람의 손끝에서 나왔습니다.',
    nextHint: '다음은 나주읍성입니다. 학교 운동장을 한 번 더 보고 오시겠어요?',
  },
  najueupseong: {
    questIds: ['najueupseong-00-geumseonggwan', 'najueupseong-01-four-gates', 'najueupseong-02-gomtang'],
    eyebrow: '나주읍성 · 답사 완료',
    title: '성벽이 더는 그냥 돌담이 아닙니다',
    body:
      "금성관 앞에 서니 이곳이 왜 '작은 서울'이라 불렸는지 알 것 같습니다. 남고문·동점문·서성문·북망문 — " +
      '4대문마다 성을 지키던 이유와 사연이 있었고, 나주곰탕 한 그릇에도 5일장을 오가던 사람들의 삶이 ' +
      '배어 있었습니다.',
    nextHint: '다음은 영산포입니다. 학교 운동장을 한 번 더 보고 오시겠어요?',
  },
  yeongsanpo: {
    questIds: ['yeongsanpo-01-heritage', 'yeongsanpo-02-hongeo'],
    eyebrow: '영산포 · 답사 완료',
    title: '물길이 어디로 이어지는지 알게 되었습니다',
    body:
      '영산강을 따라 배가 드나들던 시절, 이 거리는 호남 물류의 중심이었습니다. 근대 건물 사이를 걷다 보면 ' +
      '그 시절의 활기가 아직 남아 있는 듯했고, 삭힌 홍어와 삼합의 알싸한 맛에는 이 지역만의 발효 문화가 ' +
      '담겨 있었습니다.',
    nextHint: '다음은 정렬사입니다. 학교 운동장을 한 번 더 보고 오시겠어요?',
  },
  jeongryeolsa: {
    questIds: ['jeongryeolsa-00-exhibit', 'jeongryeolsa-01-torch'],
    eyebrow: '정렬사 · 답사 완료',
    title: '사당 앞에서 걸음이 느려집니다',
    body:
      '임진왜란이 일어나자 나주에서 가장 먼저 의병을 일으킨 사람이 있었습니다. 김천일 의병장과 충절 ' +
      '5위의 위패 앞에 서니, 나라가 위태로울 때 스스로 나섰던 이들의 마음이 조금은 짐작이 갑니다.',
    nextHint: '다음은 나주역입니다. 학교 운동장을 한 번 더 보고 오시겠어요?',
  },
  najustation: {
    questIds: ['najustation-01-plaza', 'najustation-02-waiting-room', 'najustation-03-platform', 'najustation-04-memorial'],
    eyebrow: '나주역 · 답사 완료',
    title: '승강장이 그날을 기억하고 있었습니다',
    body:
      '1929년 10월 30일, 이 승강장에서 시작된 작은 다툼이 전국을 뒤흔든 광주학생독립운동으로 번졌습니다. ' +
      '대합실의 연표와 그날의 증언을 따라가다 보니, 지금 우리가 누리는 평범한 하루가 그냥 주어진 게 ' +
      '아니라는 것을 새삼 느꼈습니다.',
    nextHint: '다음은 드들강 솔밭유원지입니다. 학교 운동장을 한 번 더 보고 오시겠어요?',
  },
  ddeuldeulgang: {
    questIds: ['ddeuldeulgang-01-melody'],
    eyebrow: '드들강 솔밭유원지 · 답사 완료',
    title: '솔숲 사이로 노래가 들리는 것 같습니다',
    body:
      '드들강변 소나무 숲, 그 사이에 작곡가 안성현 선생의 노래비가 서 있었습니다. 나주에서 나고 자란 ' +
      '한 사람이 남긴 노래가 지금까지 불리고 있다는 것이, 이 조용한 숲을 조금 다르게 보이게 만들었습니다.',
    nextHint: '다음은 빛가람동입니다. 학교 운동장을 한 번 더 보고 오시겠어요?',
  },
  bitgaram: {
    questIds: [
      'bitgaram-01-observatory',
      'bitgaram-02-kepco',
      'bitgaram-03-kentech',
      'bitgaram-04-kpx',
      'bitgaram-05-kocca',
      'bitgaram-06-smart-life',
    ],
    eyebrow: '빛가람동 · 답사 완료',
    title: '논밭이던 자리에 미래가 서 있습니다',
    body:
      '얼마 전까지 논밭이었다는 이 자리에, 지금은 한국전력공사와 KENTECH, 전력거래소 같은 곳들이 모여 ' +
      '나주의 내일을 만들고 있습니다. 옛 고분에서 오늘의 스마트 그리드까지 — 나주는 옛날 이야기로만 ' +
      '남은 동네가 아니라는 것을 이제 압니다.',
    nextHint: '이제 나주의 과거와 오늘을 모두 둘러봤습니다. 학교로 돌아가면, 누군가 당신을 기다리고 있을지도 몰라요.',
  },
}

export function SiteEndingWatcher() {
  const completed = useGameStore((s) => s.completedQuests)
  const seen = useGameStore((s) => s.siteEndingsSeen)
  const showSiteEnding = useGameStore((s) => s.showSiteEnding)
  const current = useMapStore((s) => s.current)

  useEffect(() => {
    const content = SITE_ENDINGS[current]
    if (!content) return
    if (seen.includes(current)) return
    if (content.questIds.every((q) => completed.includes(q))) showSiteEnding(current)
  }, [current, completed, seen, showSiteEnding])

  return null
}

export function SiteEnding() {
  const open = useGameStore((s) => s.siteEnding)
  const dismiss = useGameStore((s) => s.dismissSiteEnding)
  const level = useGameStore((s) => s.level)
  const codex = useGameStore((s) => s.codex)
  const travelTo = useMapStore((s) => s.travelTo)
  const current = useMapStore((s) => s.current)

  if (!open) return null
  const content = SITE_ENDINGS[open]
  if (!content) return null

  function goHome() {
    dismiss()
    if (current !== 'dasi-school') travelTo('dasi-school')
  }

  return (
    <div style={overlay}>
      <div style={card}>
        <p style={eyebrow}>{content.eyebrow}</p>
        <h2 style={title}>{content.title}</h2>

        <p style={body}>{content.body}</p>

        <div style={rowWrap}>
          <div style={stat}>
            <span style={statNum}>Lv.{level}</span>
            <span style={statLabel}>{titleForLevel(level)}</span>
          </div>
          <div style={stat}>
            <span style={statNum}>{codex.length}</span>
            <span style={statLabel}>도감 항목</span>
          </div>
        </div>

        {codex.length > 0 && (
          <ul style={codexList}>
            {codex.map((id) => (
              <li key={id} style={codexItem}>
                {CODEX_NAMES[id] ?? id}
              </li>
            ))}
          </ul>
        )}

        <p style={{ ...body, opacity: 0.72, fontSize: 13 }}>{content.nextHint}</p>

        <div style={{ display: 'flex', gap: 10, marginTop: 18 }}>
          <button onClick={dismiss} style={ghostBtn}>
            더 둘러보기
          </button>
          <button onClick={goHome} style={primaryBtn}>
            학교로 돌아가기 ›
          </button>
        </div>
      </div>
    </div>
  )
}

const overlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(8,16,22,.76)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  pointerEvents: 'auto',
  zIndex: 45,
  overflowY: 'auto',
}

const card: React.CSSProperties = {
  width: 'min(580px, 100%)',
  padding: '26px 26px 24px',
  borderRadius: 20,
  background: 'linear-gradient(170deg, #fdf8ee 0%, #f3e9d6 100%)',
  color: '#33291d',
  border: '1px solid rgba(120,95,60,.3)',
  boxShadow: '0 22px 70px rgba(0,0,0,.5)',
}

const eyebrow: React.CSSProperties = {
  margin: 0,
  fontSize: 11.5,
  letterSpacing: '.1em',
  fontWeight: 700,
  color: '#a1743a',
}

const title: React.CSSProperties = {
  margin: '8px 0 0',
  fontSize: 25,
  lineHeight: 1.35,
  letterSpacing: '-.01em',
  wordBreak: 'keep-all',
}

const body: React.CSSProperties = {
  margin: '14px 0 0',
  fontSize: 14.5,
  lineHeight: 1.75,
  wordBreak: 'keep-all',
}

const rowWrap: React.CSSProperties = {
  display: 'flex',
  gap: 10,
  marginTop: 18,
}

const stat: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
  padding: '11px 14px',
  borderRadius: 12,
  background: 'rgba(161,116,58,.12)',
  border: '1px solid rgba(161,116,58,.25)',
}

const statNum: React.CSSProperties = { fontSize: 20, fontWeight: 800, fontVariantNumeric: 'tabular-nums' }
const statLabel: React.CSSProperties = { fontSize: 12, opacity: 0.72 }

const codexList: React.CSSProperties = {
  listStyle: 'none',
  display: 'flex',
  flexWrap: 'wrap',
  gap: 7,
  padding: 0,
  margin: '12px 0 0',
}

const codexItem: React.CSSProperties = {
  fontSize: 12.5,
  fontWeight: 600,
  padding: '5px 11px',
  borderRadius: 999,
  background: '#33291d',
  color: '#fdf8ee',
}

const primaryBtn: React.CSSProperties = {
  flex: 1,
  padding: '14px 18px',
  borderRadius: 13,
  border: 'none',
  background: '#33291d',
  color: '#fdf8ee',
  fontSize: 15,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
}

const ghostBtn: React.CSSProperties = {
  padding: '14px 18px',
  borderRadius: 13,
  border: '1px solid rgba(51,41,29,.35)',
  background: 'transparent',
  color: '#33291d',
  fontSize: 14,
  fontFamily: 'inherit',
  cursor: 'pointer',
}
