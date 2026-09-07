import { useEffect, useMemo, useState } from 'react'
import { useGameStore } from '@/store/gameStore'

/**
 * 성문 수문장 문제 — 4대문 공통 퍼즐.
 *
 * 두 단계입니다: ① 성문 역사 퀴즈를 맞히면 ② 무너진 성돌을 다시 쌓는
 * 퍼즐이 열립니다. "성벽은 큰 돌을 아래에 놓아야 무너지지 않는다"는
 * 건축의 기본 원리를 그대로 정답 순서로 씁니다 — 복암리 층위 퍼즐의
 * "아래일수록 오래된 것"과 같은 자리에, 다른 원리를 넣은 것입니다.
 * 문마다 파일을 새로 만드는 대신 데이터 하나로 묶었습니다 — QuizPuzzle과
 * 같은 이유입니다.
 */

interface Gate {
  id: string
  puzzleId: string
  name: string
  question: string
  options: string[]
  answer: number
  hint: string
}

const GATES: readonly Gate[] = [
  {
    id: 'namgomun',
    puzzleId: 'puzzle-wall-namgomun',
    name: '남고문',
    question: '나주읍성의 남쪽 정문으로, 2층 문루를 올린 가장 웅장한 문은?',
    options: ['① 남고문', '② 서성문'],
    answer: 0,
    hint: '방금 지나온, 성 남쪽의 가장 큰 문을 떠올려 봐.',
  },
  {
    id: 'dongjeommun',
    puzzleId: 'puzzle-wall-dongjeommun',
    name: '동점문',
    question: '나주의 동쪽을 지키며, 영산강 쪽으로 이어지는 통로 구실을 한 성문은?',
    options: ['① 동점문', '② 북망문'],
    answer: 0,
    hint: '동쪽(東) 문이니 이름에도 동녘 동(東) 자가 들어가지 않을까?',
  },
  {
    id: 'seoseongmun',
    puzzleId: 'puzzle-wall-seoseongmun',
    name: '서성문',
    question: '동학농민군과 봉학선생의 이야기가 전해지는, 나주읍성 서쪽의 성문(영금문)은?',
    options: ['① 서성문(영금문)', '② 남고문'],
    answer: 0,
    hint: '지금 서 있는 서쪽 문의 다른 이름이 영금문이야.',
  },
  {
    id: 'bukmangmun',
    puzzleId: 'puzzle-wall-bukmangmun',
    name: '북망문',
    question: '한양(서울)으로 향하던 길목에 자리했던 나주읍성의 북쪽 성문은?',
    options: ['① 북망문', '② 동점문'],
    answer: 0,
    hint: '북쪽(北) 문이니 이름에도 북녘 북(北) 자가 들어가지 않을까?',
  },
]

/** 정답 순서 — 큰 돌(0)부터 작은 돌(4)까지, 아래에서 위로 */
const STONES = ['가장 큰 성돌', '큰 성돌', '중간 성돌', '작은 성돌', '가장 작은 성돌']
const SCRAMBLED = [2, 0, 4, 1, 3]

type Stage = 'quiz' | 'wrong' | 'wall' | 'stamped'

export function WallStonePuzzle() {
  const openId = useGameStore((s) => s.puzzle)
  const close = useGameStore((s) => s.closePuzzle)
  const solve = useGameStore((s) => s.solvePuzzle)

  const gate = GATES.find((g) => g.puzzleId === openId)

  const [stage, setStage] = useState<Stage>('quiz')
  const [order, setOrder] = useState<number[]>(SCRAMBLED)
  const [picked, setPicked] = useState<number | null>(null)
  const [wallMsg, setWallMsg] = useState<string | null>(null)

  const correct = useMemo(() => order.every((id, i) => id === i), [order])

  // 문이 바뀌면(다른 puzzleId로 열리면) 처음(퀴즈)부터 다시 시작합니다
  useEffect(() => {
    setStage('quiz')
    setOrder(SCRAMBLED)
    setPicked(null)
    setWallMsg(null)
  }, [openId])

  if (!gate) return null

  function reset() {
    setStage('quiz')
    setOrder(SCRAMBLED)
    setPicked(null)
    setWallMsg(null)
  }

  function answer(idx: number) {
    if (idx === gate!.answer) {
      setStage('wall')
    } else {
      setStage('wrong')
    }
  }

  function tap(slot: number) {
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
    setWallMsg(null)
  }

  function checkWall() {
    if (correct) {
      setStage('stamped')
      setTimeout(() => solve(gate!.puzzleId), 1600)
    } else {
      setWallMsg('아직 안 맞아. 큰 돌이 아래, 작은 돌이 위로 가야 무너지지 않아.')
    }
  }

  function handleClose() {
    reset()
    close()
  }

  return (
    <div style={overlay}>
      <div style={sheet}>
        {(stage === 'quiz' || stage === 'wrong') && (
          <>
            <p style={eyebrow}>수문장 문제 · {gate.name}</p>
            <div style={{ fontSize: 38, margin: '4px 0' }}>🏯</div>
            <h2 style={{ margin: 0, fontSize: 17 }}>{gate.question}</h2>
            <div style={optionList}>
              {gate.options.map((opt, i) => (
                <button key={opt} onClick={() => answer(i)} style={optionBtn}>
                  {opt}
                </button>
              ))}
            </div>
            {stage === 'wrong' && (
              <p style={feedback} role="status">
                ❌ {gate.hint}
              </p>
            )}
            <button onClick={handleClose} style={ghostBtn}>
              나중에 하기
            </button>
          </>
        )}

        {stage === 'wall' && (
          <>
            <p style={eyebrow}>성벽 돌 쌓기 · {gate.name}</p>
            <h2 style={{ margin: '4px 0 0', fontSize: 18 }}>무너진 성돌을 다시 쌓아 보세요</h2>
            <p style={lead}>
              큰 돌이 아래, 작은 돌이 위로 갑니다. 두 칸을 차례로 누르면 자리가 바뀝니다.
            </p>
            <div style={stack}>
              {[...order].reverse().map((stoneId, revIdx) => {
                const slot = order.length - 1 - revIdx
                const isPicked = picked === slot
                return (
                  <button
                    key={slot}
                    onClick={() => tap(slot)}
                    style={{
                      ...band,
                      background: STONE_COLORS[stoneId],
                      outline: isPicked ? '3px solid #ffd24a' : '3px solid transparent',
                      transform: isPicked ? 'translateX(8px)' : 'none',
                    }}
                  >
                    <span style={bandLabel}>{STONES[stoneId]}</span>
                    <span style={slotTag}>{slot === 0 ? '맨 아래' : slot === 4 ? '맨 위' : `${slot + 1}번째`}</span>
                  </button>
                )
              })}
            </div>
            {wallMsg && (
              <p style={feedback} role="status">
                {wallMsg}
              </p>
            )}
            <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
              <button onClick={handleClose} style={ghostBtn}>
                나중에 하기
              </button>
              <button onClick={checkWall} style={primaryBtn}>
                이대로 맞나요?
              </button>
            </div>
          </>
        )}

        {stage === 'stamped' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48 }}>🏯✨</div>
            <p style={eyebrow}>성문 통과!</p>
            <h2 style={{ margin: '4px 0 8px', fontSize: 18 }}>{gate.name} 마패를 얻었습니다!</h2>
            <p style={{ ...feedback, color: '#d8c48a' }}>
              큰 돌을 아래에, 작은 돌을 위에 쌓아야 성벽이 무너지지 않습니다.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

const STONE_COLORS = ['#6b6058', '#7d7268', '#8f8478', '#a89e8e', '#c2b8a6']

const overlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(20,14,8,.68)',
  backdropFilter: 'blur(3px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  pointerEvents: 'auto',
  zIndex: 35,
}

const sheet: React.CSSProperties = {
  width: 'min(480px, 100%)',
  padding: '20px 22px 22px',
  borderRadius: 18,
  border: '1px solid rgba(200,164,74,.4)',
  background: 'rgba(30,22,14,.96)',
  color: '#f3ecd8',
  boxShadow: '0 18px 60px rgba(0,0,0,.5)',
  textAlign: 'center',
}

const eyebrow: React.CSSProperties = {
  margin: 0,
  fontSize: 11.5,
  letterSpacing: '.08em',
  color: '#e0b84a',
  fontWeight: 700,
}

const lead: React.CSSProperties = {
  margin: '8px 0 0',
  fontSize: 13.5,
  lineHeight: 1.6,
  opacity: 0.82,
  wordBreak: 'keep-all',
}

const optionList: React.CSSProperties = {
  marginTop: 14,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}

const optionBtn: React.CSSProperties = {
  padding: '13px 14px',
  borderRadius: 10,
  border: '2px solid #5a4a2e',
  background: '#3a3020',
  color: '#f5ecd8',
  fontSize: 14,
  fontWeight: 700,
  fontFamily: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
}

const stack: React.CSSProperties = {
  marginTop: 16,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  padding: 10,
  borderRadius: 12,
  background: 'rgba(0,0,0,.25)',
  textAlign: 'left',
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
  fontSize: 13,
  lineHeight: 1.6,
  color: '#e0b84a',
  wordBreak: 'keep-all',
}

const primaryBtn: React.CSSProperties = {
  flex: 1,
  padding: '13px 18px',
  borderRadius: 12,
  border: 'none',
  background: '#e0b84a',
  color: '#241c10',
  fontSize: 15,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
}

const ghostBtn: React.CSSProperties = {
  marginTop: 14,
  padding: '10px 16px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,.28)',
  background: 'rgba(255,255,255,.06)',
  color: '#f3ecd8',
  fontSize: 13,
  fontFamily: 'inherit',
  cursor: 'pointer',
}
