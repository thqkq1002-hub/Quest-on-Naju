import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { ITEM_NAMES } from '@/game/quest/data'

/**
 * 의병 깃발 모으기 & 횃불 점화 — 정렬사 앞마당 모닥불 미니게임.
 *
 * 떨어지는 깃발·횃불(🚩🔥)을 모닥불로 받으면 +10, 왜군 장애물(👹)을
 * 받으면 -5입니다. PearCatchGame과 같은 낙하-캐치 구조를 그대로
 * 재사용했습니다 — "좋은 것/나쁜 것 두 종류가 떨어진다"는 같은 문제라
 * 새 메커니즘을 만들 이유가 없습니다. 목표 점수에 닿으면 곧바로 확인
 * 퀴즈로 넘어갑니다(HongeoComboGame과 같은 자리).
 */
const PUZZLE_ID = 'puzzle-uibyeong-torch'

const GAME_W = 420
const GAME_H = 320
const CATCHER_W = 64
const CATCHER_H = 34
const CATCHER_Y = GAME_H - CATCHER_H - 6
const ITEM_SIZE = 36
const GAME_SECONDS = 30
const TARGET_SCORE = 50
const SPAWN_MS = 700
const BAD_CHANCE = 0.3
const GOOD_ICONS = ['🚩', '🔥']

type DropType = 'good' | 'bad'
interface FallingItem {
  id: number
  x: number
  y: number
  type: DropType
  icon: string
  speed: number
}
interface Popup {
  id: number
  x: number
  text: string
  good: boolean
}

type Stage = 'intro' | 'playing' | 'quiz' | 'success' | 'fail'

export function UibyeongTorchGame() {
  const isOpen = useGameStore((s) => s.puzzle) === PUZZLE_ID
  const close = useGameStore((s) => s.closePuzzle)
  const solve = useGameStore((s) => s.solvePuzzle)

  const [stage, setStage] = useState<Stage>('intro')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS)
  const [catcherX, setCatcherX] = useState((GAME_W - CATCHER_W) / 2)
  const [drops, setDrops] = useState<FallingItem[]>([])
  const [popups, setPopups] = useState<Popup[]>([])
  const [quizWrong, setQuizWrong] = useState(false)

  const areaRef = useRef<HTMLDivElement>(null)
  const catcherXRef = useRef(catcherX)
  const scoreRef = useRef(score)
  const nextIdRef = useRef(0)
  const rafRef = useRef(0)
  const lastTsRef = useRef(0)
  const startTsRef = useRef(0)
  const spawnMsRef = useRef(0)

  catcherXRef.current = catcherX
  scoreRef.current = score

  useEffect(() => {
    if (!isOpen) setStage('intro')
  }, [isOpen])

  useEffect(() => {
    if (stage !== 'success') return
    const t = setTimeout(() => solve(PUZZLE_ID), 2200)
    return () => clearTimeout(t)
  }, [stage, solve])

  // 목표 점수에 닿으면 시간이 남아 있어도 곧바로 확인 퀴즈로 넘어갑니다
  useEffect(() => {
    if (stage !== 'playing') return
    if (score >= TARGET_SCORE) {
      setQuizWrong(false)
      setStage('quiz')
    }
  }, [score, stage])

  function startGame() {
    setScore(0)
    setTimeLeft(GAME_SECONDS)
    setDrops([])
    setPopups([])
    setQuizWrong(false)
    setCatcherX((GAME_W - CATCHER_W) / 2)
    setStage('playing')
  }

  useEffect(() => {
    if (stage !== 'playing') return
    lastTsRef.current = performance.now()
    startTsRef.current = lastTsRef.current
    spawnMsRef.current = 0

    function finish() {
      setStage((cur) => (cur === 'playing' ? (scoreRef.current >= TARGET_SCORE ? 'quiz' : 'fail') : cur))
    }

    function tick(ts: number) {
      const dt = Math.min(0.05, (ts - lastTsRef.current) / 1000)
      lastTsRef.current = ts

      const elapsed = (ts - startTsRef.current) / 1000
      const remain = GAME_SECONDS - elapsed
      if (remain <= 0) {
        setTimeLeft(0)
        finish()
        return
      }
      setTimeLeft((prev) => (prev === Math.ceil(remain) ? prev : Math.ceil(remain)))

      spawnMsRef.current += dt * 1000
      let spawned: FallingItem | null = null
      if (spawnMsRef.current >= SPAWN_MS) {
        spawnMsRef.current = 0
        const bad = Math.random() < BAD_CHANCE
        spawned = {
          id: nextIdRef.current++,
          x: Math.random() * (GAME_W - ITEM_SIZE),
          y: -ITEM_SIZE,
          type: bad ? 'bad' : 'good',
          icon: bad ? '👹' : GOOD_ICONS[Math.floor(Math.random() * GOOD_ICONS.length)],
          speed: 82 + Math.random() * 52,
        }
      }

      setDrops((prev) => {
        const bx = catcherXRef.current
        const next: FallingItem[] = []
        let delta = 0
        const caught: Popup[] = []
        const source = spawned ? [...prev, spawned] : prev
        for (const d of source) {
          const ny = d.y + d.speed * dt
          const reached = ny + ITEM_SIZE >= CATCHER_Y
          const overlapsX = d.x + ITEM_SIZE > bx && d.x < bx + CATCHER_W
          if (reached && overlapsX) {
            const gain = d.type === 'good' ? 10 : -5
            delta += gain
            caught.push({ id: nextIdRef.current++, x: d.x, text: `${gain > 0 ? '+' : ''}${gain}`, good: gain > 0 })
            continue
          }
          if (ny > GAME_H) continue
          next.push({ ...d, y: ny })
        }
        if (delta !== 0) setScore((s) => Math.max(0, s + delta))
        if (caught.length) {
          setPopups((pp) => [...pp, ...caught])
          caught.forEach((c) => setTimeout(() => setPopups((pp) => pp.filter((x) => x.id !== c.id)), 650))
        }
        return next
      })

      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [stage])

  useEffect(() => {
    if (stage !== 'playing') return
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'ArrowLeft' && e.code !== 'ArrowRight') return
      e.preventDefault()
      e.stopPropagation()
      setCatcherX((x) => {
        const dx = e.code === 'ArrowLeft' ? -28 : 28
        return Math.max(0, Math.min(GAME_W - CATCHER_W, x + dx))
      })
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [stage])

  function onPointerMove(e: React.PointerEvent) {
    if (stage !== 'playing') return
    const rect = areaRef.current?.getBoundingClientRect()
    if (!rect) return
    const scale = GAME_W / rect.width
    const x = (e.clientX - rect.left) * scale - CATCHER_W / 2
    setCatcherX(Math.max(0, Math.min(GAME_W - CATCHER_W, x)))
  }

  function answerQuiz(idx: number) {
    if (idx === 0) {
      setQuizWrong(false)
      setStage('success')
    } else {
      setQuizWrong(true)
    }
  }

  if (!isOpen) return null

  function handleClose() {
    close()
  }

  return (
    <div style={overlay}>
      <div style={sheet}>
        {stage === 'intro' && (
          <div style={{ textAlign: 'center' }}>
            <p style={eyebrow}>정렬사 앞마당 · 의병 훈련</p>
            <div style={{ fontSize: 42, margin: '4px 0' }}>🚩🔥</div>
            <h2 style={{ margin: 0, fontSize: 18 }}>모닥불에 불꽃을 피워 볼까?</h2>
            <p style={bodyText}>
              떨어지는 깃발·횃불을 화살표 키나 드래그로 모닥불을 움직여 받으세요. 왜군 장애물은 피해야 해요!
              <br />
              맞으면 +10점, 왜군을 받으면 -5점! {GAME_SECONDS}초 안에 {TARGET_SCORE}점을 모으면 성공이에요.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'center' }}>
              <button onClick={handleClose} style={ghostBtn}>
                나중에 하기
              </button>
              <button onClick={startGame} style={primaryBtn}>
                시작하기
              </button>
            </div>
          </div>
        )}

        {stage === 'playing' && (
          <>
            <div style={hud}>
              <span>🔥 {score}점</span>
              <span>⏱ {timeLeft}초</span>
              <span style={{ opacity: 0.75 }}>목표 {TARGET_SCORE}점</span>
            </div>
            <div
              ref={areaRef}
              onPointerDown={onPointerMove}
              onPointerMove={onPointerMove}
              style={gameArea}
            >
              {drops.map((d) => (
                <span
                  key={d.id}
                  style={{
                    ...itemStyle,
                    left: `${(d.x / GAME_W) * 100}%`,
                    top: `${(d.y / GAME_H) * 100}%`,
                  }}
                >
                  {d.icon}
                </span>
              ))}
              {popups.map((pp) => (
                <span
                  key={pp.id}
                  style={{
                    ...popupStyle,
                    left: `${(pp.x / GAME_W) * 100}%`,
                    color: pp.good ? '#e0b84a' : '#c1584c',
                  }}
                >
                  {pp.text}
                </span>
              ))}
              <span style={{ ...catcherStyle, left: `${(catcherX / GAME_W) * 100}%` }}>🔥</span>
            </div>
          </>
        )}

        {stage === 'quiz' && (
          <div style={{ textAlign: 'center' }}>
            <p style={eyebrow}>훈련 완료! · 확인 퀴즈</p>
            <p style={{ ...bodyText, fontWeight: 700 }}>
              나주 정렬사는 임진왜란 때 나주에서 호남 최초로 의병을 일으켜 나라를 구한 이 분을 기리기 위한
              사당입니다. 이 의병장의 이름은 무엇일까요?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {['김천일 장군', '이순신 장군', '권율 장군'].map((opt, i) => (
                <button key={opt} onClick={() => answerQuiz(i)} style={optionBtn}>
                  {`①②③`[i]} {opt}
                </button>
              ))}
            </div>
            {quizWrong && (
              <p style={{ ...feedback, color: '#c1584c' }} role="status">
                ❌ 방금 함께 훈련한 그분의 이름을 떠올려 봐.
              </p>
            )}
          </div>
        )}

        {stage === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48 }}>🔥✨</div>
            <p style={eyebrow}>퀘스트 성공!</p>
            <h2 style={{ margin: '4px 0 8px', fontSize: 18 }}>의병의 불꽃을 피웠습니다!</h2>
            <p style={bodyText}>
              김천일 의병장은 나주에서 호남 최초로 의병을 일으켰고, 훗날 제2차 진주성 전투에서 아들
              김상건과 함께 순절했습니다. 정렬사는 그와 뜻을 함께한 이들을 기리는 사당입니다.
            </p>
            <p style={{ ...bodyText, fontSize: 12, opacity: 0.75 }}>
              [{ITEM_NAMES['item-uibyeong-torch']}] 획득! 도감에 등록되었습니다.
            </p>
          </div>
        )}

        {stage === 'fail' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 42 }}>🚩</div>
            <p style={eyebrow}>다시 훈련해 볼까?</p>
            <h2 style={{ margin: '4px 0 8px', fontSize: 17 }}>
              이번엔 {score}점을 모았어요. 목표는 {TARGET_SCORE}점!
            </h2>
            <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'center' }}>
              <button onClick={handleClose} style={ghostBtn}>
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
  background: 'rgba(24,10,8,.6)',
  backdropFilter: 'blur(3px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  pointerEvents: 'auto',
  zIndex: 35,
}

const sheet: React.CSSProperties = {
  width: 'min(460px, 100%)',
  padding: '20px 20px 18px',
  borderRadius: 22,
  border: '3px solid #a83a2e',
  background: '#faf1e6',
  color: '#3a241c',
  boxShadow: '0 18px 60px rgba(0,0,0,.42)',
}

const eyebrow: React.CSSProperties = {
  margin: 0,
  fontSize: 11.5,
  letterSpacing: '.06em',
  color: '#a83a2e',
  fontWeight: 700,
  textAlign: 'center',
}

const bodyText: React.CSSProperties = {
  marginTop: 8,
  fontSize: 13.5,
  lineHeight: 1.6,
  color: '#5c3f2c',
  wordBreak: 'keep-all',
  textAlign: 'center',
}

const hud: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 14,
  fontWeight: 700,
  color: '#3a241c',
  marginBottom: 10,
  padding: '0 4px',
}

const gameArea: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: `${GAME_W} / ${GAME_H}`,
  borderRadius: 14,
  overflow: 'hidden',
  background: 'linear-gradient(180deg, #3a241c 0%, #5c2e22 60%, #2a1712 100%)',
  border: '2px solid #a83a2e',
  touchAction: 'none',
  cursor: 'pointer',
}

const itemStyle: React.CSSProperties = {
  position: 'absolute',
  fontSize: ITEM_SIZE,
  lineHeight: 1,
  transform: 'translate(-2px,-2px)',
  filter: 'drop-shadow(0 3px 3px rgba(0,0,0,.35))',
  pointerEvents: 'none',
}

const catcherStyle: React.CSSProperties = {
  position: 'absolute',
  top: `${(CATCHER_Y / GAME_H) * 100}%`,
  fontSize: CATCHER_H + 14,
  lineHeight: 1,
  pointerEvents: 'none',
  filter: 'drop-shadow(0 3px 3px rgba(0,0,0,.3))',
}

const popupStyle: React.CSSProperties = {
  position: 'absolute',
  top: `${((CATCHER_Y - 18) / GAME_H) * 100}%`,
  fontSize: 15,
  fontWeight: 800,
  pointerEvents: 'none',
  textShadow: '0 1px 2px rgba(0,0,0,.5)',
}

const optionBtn: React.CSSProperties = {
  padding: '11px 14px',
  borderRadius: 10,
  border: '2px solid #d8b8a0',
  background: '#fff6ea',
  color: '#3a241c',
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

const ghostBtn: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: 12,
  border: '1px solid #d8b8a0',
  background: 'transparent',
  color: '#a83a2e',
  fontSize: 13,
  fontFamily: 'inherit',
  cursor: 'pointer',
}

const primaryBtn: React.CSSProperties = {
  padding: '10px 20px',
  borderRadius: 12,
  border: 'none',
  background: '#a83a2e',
  color: '#faf1e6',
  fontSize: 14,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
}
