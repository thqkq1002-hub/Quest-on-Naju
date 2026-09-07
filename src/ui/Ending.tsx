import { useEffect } from 'react'
import { useGameStore, titleForLevel } from '@/store/gameStore'
import { CODEX_NAMES } from '@/game/quest/data'
import { useMapStore } from '@/store/mapStore'

/**
 * 마지막 시나리오 — 복암리를 완주했을 때.
 *
 * 이 게임의 마지막 장면은 "다 깼다" 가 아니라 **같은 운동장이 다르게 보이는 것**
 * 입니다. 그래서 엔딩 카드는 트로피를 주는 대신, 배운 것을 한 줄로 되돌려
 * 주고 다시초로 돌아갈 문을 엽니다. → docs/06-NAJU-WORLD-MAP.md 4절
 */

/** 복암리 1차 호(弧)를 이루는 퀘스트 */
export const BOKAMRI_ARC = [
  'bokamri-00-arrival',
  'bokamri-01-first-dig',
  'bokamri-02-jar-coffin',
  'bokamri-03-golden-shoe',
] as const

export function EndingWatcher() {
  const completed = useGameStore((s) => s.completedQuests)
  const endingSeen = useGameStore((s) => s.endingSeen)
  const showEnding = useGameStore((s) => s.showEnding)

  useEffect(() => {
    if (endingSeen) return
    if (BOKAMRI_ARC.every((q) => completed.includes(q))) showEnding()
  }, [completed, endingSeen, showEnding])

  return null
}

export function Ending() {
  const open = useGameStore((s) => s.ending)
  const dismiss = useGameStore((s) => s.dismissEnding)
  const level = useGameStore((s) => s.level)
  const codex = useGameStore((s) => s.codex)
  const travelTo = useMapStore((s) => s.travelTo)
  const current = useMapStore((s) => s.current)

  if (!open) return null

  function goHome() {
    dismiss()
    if (current !== 'dasi-school') travelTo('dasi-school')
  }

  return (
    <div style={overlay}>
      <div style={card}>
        <p style={eyebrow}>복암리 고분군 · 답사 완료</p>
        <h2 style={title}>언덕이 무덤으로 보이기 시작했습니다</h2>

        <p style={body}>
          처음 왔을 때 저것은 그냥 언덕이었습니다. 지금은 1500년 전 사람들이
          흙을 쌓아 만든 무덤이고, 그 안에 항아리로 만든 관이 있고, 흙에는
          쌓인 순서가 있다는 것을 압니다. 그리고 그 무덤이 41기나 겹겹이
          쌓인 '아파트식 고분'이며, 그 속에서 물고기 장식이 달린 금동신발까지
          당신 손으로 찾아냈다는 것도요.
        </p>

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

        <p style={{ ...body, opacity: 0.72, fontSize: 13 }}>
          다음은 국립나주박물관과 반남고분군입니다. 아직 준비 중이에요 —
          그 전에, 학교 운동장을 한 번 더 보고 오시겠어요?
        </p>

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
  // 어두운 화면을 지나온 끝의 밝은 종이 한 장 — 여기서 이야기가 닫힙니다
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
