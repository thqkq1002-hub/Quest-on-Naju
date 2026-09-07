import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { ITEM_NAMES } from '@/game/quest/data'

/**
 * 96호 돌방무덤 발굴 — 흙을 붓으로 털어 유물 세 점을 찾는 미니게임.
 *
 * 3x4 격자에 흙을 덮어 두고, 마우스 드래그(또는 터치 드래그)로 문지르면
 * 흙이 옅어지며 밑에 있는 것이 드러납니다. 세 칸에는 실제 96호 돌방무덤
 * 출토품(금동신발·대형 옹관 조각·세잎무늬 고리자루칼)이 묻혀 있고,
 * 나머지는 빈 흙입니다. 금동신발을 드러내면 그 자리에서 확인 퀴즈를 내고,
 * 맞혀야 "발굴 확정"으로 칩니다 — 틀려도 감점 없이 다시 생각하게 합니다.
 * → 국립나주박물관 「속속 들여다보기 #03」
 */
const PUZZLE_ID = 'puzzle-golden-shoe-dig'

const COLS = 4
const ROWS = 4
const CELLS = COLS * ROWS
const TIME_SECONDS = 40
const TARGET_CLEAR_PCT = 80
const BRUSH_AMOUNT = 16

type RelicKey = 'shoe' | 'jar' | 'sword'
interface RelicMeta {
  key: RelicKey
  icon: string
  name: string
}

const RELIC_CELLS: Record<number, RelicMeta> = {
  5: { key: 'shoe', icon: '👞', name: '금동신발' },
  10: { key: 'jar', icon: '🏺', name: '대형 옹관 조각' },
  2: { key: 'sword', icon: '🗡️', name: '세잎무늬 고리자루칼' },
}

type Stage = 'intro' | 'playing' | 'quiz' | 'success' | 'fail'

export function RelicDigGame() {
  const isOpen = useGameStore((s) => s.puzzle) === PUZZLE_ID
  const close = useGameStore((s) => s.closePuzzle)
  const solve = useGameStore((s) => s.solvePuzzle)

  const [stage, setStage] = useState<Stage>('intro')
  const [dirt, setDirt] = useState<number[]>(() => Array(CELLS).fill(100))
  const [found, setFound] = useState<Set<RelicKey>>(new Set())
  const [timeLeft, setTimeLeft] = useState(TIME_SECONDS)
  const [quizWrong, setQuizWrong] = useState(false)

  const draggingRef = useRef(false)
  const gridRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) setStage('intro')
  }, [isOpen])

  function startGame() {
    setDirt(Array(CELLS).fill(100))
    setFound(new Set())
    setTimeLeft(TIME_SECONDS)
    setQuizWrong(false)
    setStage('playing')
  }

  // 타이머 — 퀴즈가 뜬 동안(stage !== 'playing')은 멈춥니다
  useEffect(() => {
    if (stage !== 'playing') return
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id)
          setStage((cur) => (cur === 'playing' ? 'fail' : cur))
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [stage])

  // 금동신발 칸이 드러나면 확인 퀴즈로 전환 (타이머는 위 effect에 의해 자동 정지)
  useEffect(() => {
    if (stage !== 'playing') return
    const shoeIdx = 5
    if (dirt[shoeIdx] === 0 && !found.has('shoe')) setStage('quiz')
  }, [dirt, stage, found])

  // 옹관 조각·고리자루칼은 드러나는 즉시 발굴 확정
  useEffect(() => {
    setFound((prev) => {
      let changed = false
      const next = new Set(prev)
      for (const [idxStr, relic] of Object.entries(RELIC_CELLS)) {
        if (relic.key === 'shoe') continue
        const idx = Number(idxStr)
        if (dirt[idx] === 0 && !next.has(relic.key)) {
          next.add(relic.key)
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [dirt])

  // 승리 판정 — 80% 이상 걷어냈고 세 유물을 전부 발굴 확정했으면 즉시 성공
  useEffect(() => {
    if (stage !== 'playing') return
    const clearedPct = (dirt.filter((d) => d === 0).length / CELLS) * 100
    if (clearedPct >= TARGET_CLEAR_PCT && found.size === 3) setStage('success')
  }, [dirt, found, stage])

  useEffect(() => {
    if (stage !== 'success') return
    const t = setTimeout(() => solve(PUZZLE_ID), 2200)
    return () => clearTimeout(t)
  }, [stage, solve])

  function brushAt(clientX: number, clientY: number) {
    const rect = gridRef.current?.getBoundingClientRect()
    if (!rect) return
    const relX = (clientX - rect.left) / rect.width
    const relY = (clientY - rect.top) / rect.height
    if (relX < 0 || relX >= 1 || relY < 0 || relY >= 1) return
    const col = Math.min(COLS - 1, Math.floor(relX * COLS))
    const row = Math.min(ROWS - 1, Math.floor(relY * ROWS))
    const idx = row * COLS + col
    setDirt((prev) => {
      if (prev[idx] <= 0) return prev
      const next = [...prev]
      next[idx] = Math.max(0, next[idx] - BRUSH_AMOUNT)
      return next
    })
  }

  function onPointerDown(e: React.PointerEvent) {
    if (stage !== 'playing') return
    draggingRef.current = true
    brushAt(e.clientX, e.clientY)
  }
  function onPointerMove(e: React.PointerEvent) {
    if (!draggingRef.current || stage !== 'playing') return
    brushAt(e.clientX, e.clientY)
  }
  function stopDrag() {
    draggingRef.current = false
  }

  function answerQuiz(idx: number) {
    if (idx === 1) {
      setQuizWrong(false)
      setFound((prev) => new Set(prev).add('shoe'))
      setStage('playing')
    } else {
      setQuizWrong(true)
    }
  }

  if (!isOpen) return null

  const clearedPct = Math.round((dirt.filter((d) => d === 0).length / CELLS) * 100)

  return (
    <div style={overlay}>
      <div style={sheet}>
        {stage === 'intro' && (
          <div style={{ textAlign: 'center' }}>
            <p style={eyebrow}>96호 돌방무덤 발굴 · 복암리 3호분</p>
            <div style={{ fontSize: 42, margin: '4px 0' }}>🏺🖌️</div>
            <h2 style={{ margin: 0, fontSize: 18 }}>흙을 조심조심 털어 볼까?</h2>
            <p style={bodyText}>
              화면을 눌러 드래그하면 붓으로 흙을 터는 것처럼 흙이 걷힙니다.
              <br />
              {TIME_SECONDS}초 안에 흙을 {TARGET_CLEAR_PCT}% 이상 걷어내고, 금동신발을 포함한
              유물 3점을 모두 발굴하면 성공이에요.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'center' }}>
              <button onClick={close} style={ghostBtn}>
                나중에 하기
              </button>
              <button onClick={startGame} style={primaryBtn}>
                발굴 시작
              </button>
            </div>
          </div>
        )}

        {(stage === 'playing' || stage === 'quiz') && (
          <>
            <div style={hud}>
              <span>⛏ {clearedPct}%</span>
              <span>⏱ {timeLeft}초</span>
              <span style={{ opacity: 0.75 }}>목표 {TARGET_CLEAR_PCT}%</span>
            </div>

            <div
              ref={gridRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={stopDrag}
              onPointerLeave={stopDrag}
              onPointerCancel={stopDrag}
              style={{ ...gridArea, pointerEvents: stage === 'playing' ? 'auto' : 'none' }}
            >
              {dirt.map((level, idx) => {
                const relic = RELIC_CELLS[idx]
                const revealed = level === 0
                return (
                  <div key={idx} style={cellOuter}>
                    <div
                      style={{
                        ...cellBase,
                        background: relic ? '#f3e6c4' : '#ddd0ab',
                      }}
                    >
                      {relic && revealed && (
                        <span style={{ fontSize: 26 }}>{relic.icon}</span>
                      )}
                    </div>
                    <div style={{ ...cellDirt, opacity: level / 100 }} />
                    {relic && revealed && <span style={foundTick}>✓</span>}
                  </div>
                )
              })}
            </div>

            {/* 발견한 유물 도감 */}
            <div style={codexRow}>
              {(Object.values(RELIC_CELLS) as RelicMeta[]).map((r) => (
                <div key={r.key} style={{ ...codexChip, opacity: found.has(r.key) ? 1 : 0.35 }}>
                  <span style={{ fontSize: 17 }}>{r.icon}</span>
                  <span style={{ fontSize: 10.5 }}>{r.name}</span>
                </div>
              ))}
            </div>

            {stage === 'quiz' && (
              <div style={quizOverlay}>
                <div style={quizCard}>
                  <p style={eyebrow}>확인 퀴즈 · 금동신발 발굴!</p>
                  <p style={{ ...bodyText, marginTop: 6, fontWeight: 700 }}>
                    복암리 3호분 금동신발 바닥에는 다른 곳에서 볼 수 없는 특별한 장식이
                    달려 있어요. 무엇일까요?
                  </p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
                    {['① 별 모양', '② 물고기 모양', '③ 새 모양'].map((opt, i) => (
                      <button key={opt} onClick={() => answerQuiz(i)} style={optionBtn}>
                        {opt}
                      </button>
                    ))}
                  </div>
                  {quizWrong && (
                    <p style={{ ...feedback, color: '#c1584c' }} role="status">
                      ❌ 다시 생각해 보렴. 신발 바닥에 달려 있던 작은 장식들을 떠올려 봐.
                    </p>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {stage === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48 }}>👞✨</div>
            <p style={eyebrow}>퀘스트 성공!</p>
            <h2 style={{ margin: '4px 0 8px', fontSize: 18 }}>
              복암리 고분군의 비밀을 모두 밝혀내고 위대한 고고학자 배지를 획득했습니다!
            </h2>
            <div style={summaryCard}>
              <p style={summaryLine}>
                <b>아파트식 고분</b> — 하나의 큰 무덤 안에 옹관묘·석실묘 등 41기의 무덤이
                층층이 쌓여 있어, 마치 아파트처럼 여러 세대가 겹쳐 있다고 해서 붙은 이름입니다.
              </p>
              <p style={summaryLine}>
                <b>물고기 달개 금동신발</b> — 96호 돌방무덤에서 나온 이 신발은 거북등무늬로
                꾸며져 있고, 바닥에 물고기 모양 장식(달개)이 달린 것은 세계에서 이곳
                하나뿐입니다.
              </p>
            </div>
            <p style={{ ...bodyText, fontSize: 12, opacity: 0.75 }}>
              [{ITEM_NAMES['item-golden-shoe-badge']}] 획득! 도감에 등록되었습니다.
            </p>
          </div>
        )}

        {stage === 'fail' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 42 }}>🖌️</div>
            <p style={eyebrow}>다시 파 볼까?</p>
            <h2 style={{ margin: '4px 0 8px', fontSize: 17 }}>
              이번엔 {clearedPct}%를 걷어내고 유물 {found.size}점을 찾았어요.
            </h2>
            <p style={bodyText}>
              흙은 {TARGET_CLEAR_PCT}% 이상, 유물은 금동신발을 포함해 3점 모두 필요해요.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'center' }}>
              <button onClick={close} style={ghostBtn}>
                나중에 하기
              </button>
              <button onClick={startGame} style={primaryBtn}>
                다시 하기
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── 스타일 ───────────────────────────────────────────────────────
const overlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(28,20,10,.6)',
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
  padding: '20px 20px 18px',
  borderRadius: 22,
  border: '3px solid #a8843f',
  background: '#f7ecd6',
  color: '#4a3a20',
  boxShadow: '0 18px 60px rgba(0,0,0,.42)',
  position: 'relative',
}

const eyebrow: React.CSSProperties = {
  margin: 0,
  fontSize: 11.5,
  letterSpacing: '.06em',
  color: '#a8843f',
  fontWeight: 700,
  textAlign: 'center',
}

const bodyText: React.CSSProperties = {
  marginTop: 8,
  fontSize: 13.5,
  lineHeight: 1.6,
  color: '#5c4a2c',
  wordBreak: 'keep-all',
  textAlign: 'center',
}

const hud: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 14,
  fontWeight: 700,
  color: '#5c4a2c',
  marginBottom: 10,
  padding: '0 4px',
}

const gridArea: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: `repeat(${COLS}, 1fr)`,
  gap: 4,
  aspectRatio: `${COLS} / ${ROWS}`,
  borderRadius: 14,
  overflow: 'hidden',
  background: '#5c4a2c',
  border: '2px solid #8a6f4f',
  touchAction: 'none',
  cursor: 'pointer',
  padding: 4,
}

const cellOuter: React.CSSProperties = {
  position: 'relative',
  borderRadius: 6,
  overflow: 'hidden',
}

const cellBase: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const cellDirt: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: '#8a6f4a',
  backgroundImage:
    'radial-gradient(circle at 30% 30%, rgba(255,255,255,.08), transparent 60%)',
  transition: 'opacity .08s linear',
  pointerEvents: 'none',
}

const foundTick: React.CSSProperties = {
  position: 'absolute',
  top: 2,
  right: 3,
  fontSize: 11,
  color: '#3f7a4a',
  fontWeight: 900,
}

const codexRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  gap: 6,
  marginTop: 10,
}

const codexChip: React.CSSProperties = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 2,
  padding: '6px 4px',
  borderRadius: 10,
  background: 'rgba(168,132,63,.14)',
  color: '#5c4a2c',
  textAlign: 'center',
}

const quizOverlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(28,20,10,.72)',
  borderRadius: 22,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 18,
}

const quizCard: React.CSSProperties = {
  width: '100%',
  padding: '16px 16px 14px',
  borderRadius: 16,
  background: '#f7ecd6',
  border: '2px solid #e8c24a',
}

const optionBtn: React.CSSProperties = {
  padding: '11px 14px',
  borderRadius: 10,
  border: '2px solid #d8c48a',
  background: '#fff8e8',
  color: '#4a3a20',
  fontSize: 13.5,
  fontWeight: 700,
  fontFamily: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
}

const feedback: React.CSSProperties = {
  marginTop: 10,
  fontSize: 12.5,
  lineHeight: 1.5,
  wordBreak: 'keep-all',
}

const summaryCard: React.CSSProperties = {
  marginTop: 10,
  padding: '12px 14px',
  borderRadius: 12,
  background: 'rgba(168,132,63,.14)',
  textAlign: 'left',
}

const summaryLine: React.CSSProperties = {
  margin: '6px 0 0',
  fontSize: 12.5,
  lineHeight: 1.6,
  color: '#5c4a2c',
  wordBreak: 'keep-all',
}

const ghostBtn: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: 12,
  border: '1px solid #d8c48a',
  background: 'transparent',
  color: '#a8843f',
  fontSize: 13,
  fontFamily: 'inherit',
  cursor: 'pointer',
}

const primaryBtn: React.CSSProperties = {
  padding: '10px 20px',
  borderRadius: 12,
  border: 'none',
  background: '#a8843f',
  color: '#fdf6e6',
  fontSize: 14,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
}
