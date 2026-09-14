import { useEffect, useMemo, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { LAYER_COLORS } from '@/game/world/maps/bokamri/BokamriProps'

/**
 * 층위 퍼즐 — 뒤섞인 지층을 오래된 순서로 놓습니다.
 *
 * 정답의 근거는 **씬 안에 있습니다**: 안내판 2번("아래일수록 오래된 것")과
 * 트렌치 벽에 실제로 드러난 색. 밖에서 검색해야 풀리는 문제는 만들지 않습니다.
 * → docs/02-GAME-DESIGN.md 3.1
 *
 * 틀려도 감점하지 않습니다. 왜 틀렸는지 한 줄 알려주고 다시 놓게 합니다.
 */

interface Layer {
  id: number
  name: string
  note: string
}

/** 아래(오래된 것)부터 위(새것)로. 이 순서가 정답입니다 */
const LAYERS: Layer[] = [
  { id: 0, name: '맨 아래 짙은 갈색 층', note: '가장 먼저 쌓였습니다' },
  { id: 1, name: '그 위 갈색 층', note: '' },
  { id: 2, name: '그 위 밝은 갈색 층', note: '' },
  { id: 3, name: '맨 위 모래빛 층', note: '가장 나중에 쌓였습니다' },
]

/** 처음엔 반드시 정답이 아닌 순서로 시작합니다 */
const SCRAMBLED = [2, 0, 3, 1]

export function StratigraphyPuzzle() {
  const open = useGameStore((s) => s.puzzle) === 'puzzle-stratigraphy'
  const close = useGameStore((s) => s.closePuzzle)
  const solve = useGameStore((s) => s.solvePuzzle)

  const [order, setOrder] = useState<number[]>(SCRAMBLED)
  const [picked, setPicked] = useState<number | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  const correct = useMemo(() => order.every((id, i) => id === i), [order])

  // 한 번 풀고 다시 열어도(once=false라 재도전 가능) 처음부터 다시 시작합니다 —
  // 그러지 않으면 이전에 푼 완료 상태(done=true)가 그대로 남아 두 버튼이
  // 계속 비활성인 채로 창이 멈춰 버립니다.
  useEffect(() => {
    if (!open) return
    setOrder(SCRAMBLED)
    setPicked(null)
    setMsg(null)
    setDone(false)
  }, [open])

  if (!open) return null

  function tap(slot: number) {
    if (done) return
    if (picked === null) {
      setPicked(slot)
      return
    }
    if (picked === slot) {
      setPicked(null)
      return
    }
    const next = [...order]
    ;[next[picked], next[slot]] = [next[slot], next[picked]]
    setOrder(next)
    setPicked(null)
    setMsg(null)
  }

  function check() {
    if (correct) {
      setDone(true)
      setMsg('맞았어요! 아래에 있는 층일수록 먼저 쌓인, 더 오래된 층입니다.')
      setTimeout(() => solve('puzzle-stratigraphy'), 1500)
    } else {
      const wrong = order.findIndex((id, i) => id !== i)
      setMsg(
        wrong === 0
          ? '맨 아래 칸부터 다시 봅시다. 가장 먼저 쌓인 흙은 어떤 색이었나요?'
          : '아직 순서가 맞지 않아요. 안내판에 「아래일수록 오래된 것」이라고 적혀 있었죠.',
      )
    }
  }

  return (
    <div style={overlay}>
      <div style={sheet}>
        <p style={eyebrow}>층위 읽기 · 3호 트렌치</p>
        <h2 style={{ margin: '4px 0 0', fontSize: 20 }}>오래된 순서로 놓아 보세요</h2>
        <p style={lead}>
          아래 칸이 가장 오래된 층입니다. 두 칸을 차례로 누르면 자리가 바뀝니다.
        </p>

        {/* 위가 새 층, 아래가 오래된 층 — 실제 단면과 같은 방향으로 세웁니다 */}
        <div style={stack}>
          {[...order].reverse().map((layerId, revIdx) => {
            const slot = order.length - 1 - revIdx
            const layer = LAYERS[layerId]
            const isPicked = picked === slot
            return (
              <button
                key={slot}
                onClick={() => tap(slot)}
                style={{
                  ...band,
                  background: LAYER_COLORS[layerId],
                  outline: isPicked ? '3px solid #ffd24a' : '3px solid transparent',
                  transform: isPicked ? 'translateX(8px)' : 'none',
                }}
              >
                <span style={bandLabel}>{layer.name}</span>
                <span style={slotTag}>{slot === 0 ? '맨 아래' : slot === 3 ? '맨 위' : `${slot + 1}번째`}</span>
              </button>
            )
          })}
        </div>

        {msg && (
          <p style={{ ...feedback, color: done ? '#7fe0a8' : '#ffd24a' }} role="status">
            {msg}
          </p>
        )}

        <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
          {/* 닫기는 완료 여부와 무관하게 항상 눌립니다 — 어떤 상태에서도 빠져나갈 길은 있어야 합니다 */}
          <button onClick={close} style={ghostBtn}>
            {done ? '닫기' : '나중에 하기'}
          </button>
          <button onClick={check} style={primaryBtn} disabled={done}>
            {done ? '완료!' : '이대로 맞나요?'}
          </button>
        </div>
      </div>
    </div>
  )
}

const overlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(8,16,22,.7)',
  backdropFilter: 'blur(3px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  pointerEvents: 'auto',
  zIndex: 35,
}

const sheet: React.CSSProperties = {
  width: 'min(560px, 100%)',
  padding: '20px 22px 22px',
  borderRadius: 18,
  border: '1px solid rgba(140,205,235,.45)',
  background: 'rgba(14,30,40,.96)',
  color: '#eaf4f8',
  boxShadow: '0 18px 60px rgba(0,0,0,.5)',
}

const eyebrow: React.CSSProperties = {
  margin: 0,
  fontSize: 11.5,
  letterSpacing: '.08em',
  color: '#ffd24a',
  fontWeight: 700,
}

const lead: React.CSSProperties = {
  margin: '8px 0 0',
  fontSize: 13.5,
  lineHeight: 1.6,
  opacity: 0.82,
  wordBreak: 'keep-all',
}

const stack: React.CSSProperties = {
  marginTop: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: 10,
  borderRadius: 12,
  background: 'rgba(0,0,0,.25)',
}

const band: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: 10,
  padding: '15px 14px',
  borderRadius: 9,
  border: 'none',
  cursor: 'pointer',
  fontFamily: 'inherit',
  transition: 'transform .16s ease-out',
}

const bandLabel: React.CSSProperties = {
  fontSize: 14,
  fontWeight: 700,
  color: '#1e1a14',
  textShadow: '0 1px 2px rgba(255,255,255,.25)',
}

const slotTag: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 700,
  color: 'rgba(30,26,20,.65)',
  background: 'rgba(255,255,255,.4)',
  padding: '2px 7px',
  borderRadius: 999,
  whiteSpace: 'nowrap',
}

const feedback: React.CSSProperties = {
  margin: '13px 0 0',
  fontSize: 13.5,
  lineHeight: 1.6,
  wordBreak: 'keep-all',
}

const primaryBtn: React.CSSProperties = {
  flex: 1,
  padding: '13px 18px',
  borderRadius: 12,
  border: 'none',
  background: '#ffd24a',
  color: '#22301f',
  fontSize: 15,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
}

const ghostBtn: React.CSSProperties = {
  padding: '13px 18px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,.32)',
  background: 'rgba(255,255,255,.08)',
  color: '#eaf4f8',
  fontSize: 14,
  fontFamily: 'inherit',
  cursor: 'pointer',
}
