import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { ITEM_NAMES } from '@/game/quest/data'
import { PALETTE } from '@/lib/palette'

/**
 * 나주배 따기 체험 — 배나무 밭 팻말 앞에서 하는 미니게임.
 *
 * 이전에는 여기서 객관식 퀴즈를 냈는데, "배밭 체험"이라는 퀘스트 이름에
 * 걸맞게 실제로 배를 따는 체험으로 바꿨습니다. 위에서 떨어지는 잘 익은
 * 배(🍐)는 바구니로 받고, 안 익은 배(🍏)는 피하는 간단한 액션입니다.
 *
 * QuizPuzzle과 같은 `puzzle` 상태를 씁니다 — 오브젝트 하나만 다른, "안내판
 * 근처에서 여는 팝업 하나"라는 자리는 같기 때문입니다.
 */
const PUZZLE_ID = 'puzzle-pear-catch'

const GAME_W = 420
const GAME_H = 320
const BASKET_W = 64
const BASKET_H = 34
const BASKET_Y = GAME_H - BASKET_H - 6
const PEAR_SIZE = 36
const GAME_SECONDS = 30
const TARGET_SCORE = 50
const SPAWN_MS = 750
const BAD_CHANCE = 0.28

type PearType = 'ripe' | 'bad'
interface FallingPear {
  id: number
  x: number
  y: number
  type: PearType
  speed: number
}
interface Popup {
  id: number
  x: number
  text: string
  good: boolean
}

type Stage = 'intro' | 'playing' | 'success' | 'fail'

export function PearCatchGame() {
  const isOpen = useGameStore((s) => s.puzzle) === PUZZLE_ID
  const close = useGameStore((s) => s.closePuzzle)
  const solve = useGameStore((s) => s.solvePuzzle)

  const [stage, setStage] = useState<Stage>('intro')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS)
  const [basketX, setBasketX] = useState((GAME_W - BASKET_W) / 2)
  const [pears, setPears] = useState<FallingPear[]>([])
  const [popups, setPopups] = useState<Popup[]>([])

  const areaRef = useRef<HTMLDivElement>(null)
  const basketXRef = useRef(basketX)
  const scoreRef = useRef(score)
  const nextIdRef = useRef(0)
  const rafRef = useRef(0)
  const lastTsRef = useRef(0)
  const startTsRef = useRef(0)
  const spawnMsRef = useRef(0)

  basketXRef.current = basketX
  scoreRef.current = score

  // 닫혔다가 다시 열리면 처음(안내 화면)부터 시작합니다
  useEffect(() => {
    if (!isOpen) setStage('intro')
  }, [isOpen])

  // 성공 화면을 잠깐 보여준 뒤 실제로 퀘스트 목표를 채웁니다 —
  // 다른 퍼즐들과 같은 리듬입니다
  useEffect(() => {
    if (stage !== 'success') return
    const timer = setTimeout(() => solve(PUZZLE_ID), 1800)
    return () => clearTimeout(timer)
  }, [stage, solve])

  function startGame() {
    setScore(0)
    setTimeLeft(GAME_SECONDS)
    setPears([])
    setPopups([])
    setBasketX((GAME_W - BASKET_W) / 2)
    setStage('playing')
  }

  // 게임 루프 — 배가 떨어지고, 바구니와 겹치면 점수가 바뀝니다
  useEffect(() => {
    if (stage !== 'playing') return
    lastTsRef.current = performance.now()
    startTsRef.current = lastTsRef.current
    spawnMsRef.current = 0

    function finish() {
      setStage(scoreRef.current >= TARGET_SCORE ? 'success' : 'fail')
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
      let spawned: FallingPear | null = null
      if (spawnMsRef.current >= SPAWN_MS) {
        spawnMsRef.current = 0
        spawned = {
          id: nextIdRef.current++,
          x: Math.random() * (GAME_W - PEAR_SIZE),
          y: -PEAR_SIZE,
          type: Math.random() < BAD_CHANCE ? 'bad' : 'ripe',
          speed: 85 + Math.random() * 55,
        }
      }

      setPears((prev) => {
        const bx = basketXRef.current
        const next: FallingPear[] = []
        let delta = 0
        const caught: Popup[] = []
        const source = spawned ? [...prev, spawned] : prev
        for (const p of source) {
          const ny = p.y + p.speed * dt
          const reachedBasket = ny + PEAR_SIZE >= BASKET_Y
          const overlapsX = p.x + PEAR_SIZE > bx && p.x < bx + BASKET_W
          if (reachedBasket && overlapsX) {
            const gain = p.type === 'ripe' ? 10 : -5
            delta += gain
            caught.push({ id: nextIdRef.current++, x: p.x, text: `${gain > 0 ? '+' : ''}${gain}`, good: gain > 0 })
            continue
          }
          if (ny > GAME_H) continue
          next.push({ ...p, y: ny })
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

  // 조작 — 화살표 키. 대화창과 같은 방식으로, 게임 중엔 캡처 단계에서
  // 가로채 input.ts 의 플레이어 이동으로 새지 않게 합니다.
  useEffect(() => {
    if (stage !== 'playing') return
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'ArrowLeft' && e.code !== 'ArrowRight') return
      e.preventDefault()
      e.stopPropagation()
      setBasketX((x) => {
        const dx = e.code === 'ArrowLeft' ? -28 : 28
        return Math.max(0, Math.min(GAME_W - BASKET_W, x + dx))
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
    const x = (e.clientX - rect.left) * scale - BASKET_W / 2
    setBasketX(Math.max(0, Math.min(GAME_W - BASKET_W, x)))
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
            <p style={eyebrow}>배밭 체험 · 배나무 밭</p>
            <div style={{ fontSize: 44, margin: '4px 0' }}>👵🍐</div>
            <h2 style={{ margin: 0, fontSize: 18 }}>나주배 따기</h2>
            <p style={bodyText}>
              노랗게 잘 익은 배(🍐)는 바구니로 받고, 아직 안 익은 배(🍏)는 피하세요!
              <br />
              {GAME_SECONDS}초 안에 {TARGET_SCORE}점을 모으면 성공이에요.
            </p>
            <p style={{ ...bodyText, fontSize: 12, opacity: 0.75 }}>
              ← → 키 또는 화면을 눌러서 바구니를 움직여요
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
              <span>🍐 {score}점</span>
              <span>⏱ {timeLeft}초</span>
              <span style={{ opacity: 0.7 }}>목표 {TARGET_SCORE}점</span>
            </div>
            <div
              ref={areaRef}
              onPointerDown={onPointerMove}
              onPointerMove={onPointerMove}
              style={gameArea}
            >
              {pears.map((p) => (
                <span
                  key={p.id}
                  style={{
                    ...pearStyle,
                    left: `${(p.x / GAME_W) * 100}%`,
                    top: `${(p.y / GAME_H) * 100}%`,
                  }}
                >
                  {p.type === 'ripe' ? '🍐' : '🍏'}
                </span>
              ))}
              {popups.map((pp) => (
                <span
                  key={pp.id}
                  style={{
                    ...popupStyle,
                    left: `${(pp.x / GAME_W) * 100}%`,
                    color: pp.good ? '#4a8f3f' : '#c1584c',
                  }}
                >
                  {pp.text}
                </span>
              ))}
              <span style={{ ...basketStyle, left: `${(basketX / GAME_W) * 100}%` }}>🧺</span>
            </div>
          </>
        )}

        {stage === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48 }}>🍐✨</div>
            <p style={eyebrow}>퀘스트 성공!</p>
            <h2 style={{ margin: '4px 0 8px', fontSize: 18 }}>
              할머니가 맛있는 나주배 한 상자를 선물하셨습니다!
            </h2>
            <p style={bodyText}>[{ITEM_NAMES['item-golden-pear']}] 획득! 도감에 등록되었습니다.</p>
            <p style={{ ...bodyText, fontSize: 12, opacity: 0.7 }}>이번 점수: {score}점</p>
          </div>
        )}

        {stage === 'fail' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 44 }}>🍏</div>
            <p style={eyebrow}>다시 도전해 볼까?</p>
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
  background: 'rgba(20,30,10,.55)',
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
  border: `3px solid ${PALETTE.pearLeaf}`,
  background: '#fdf9ea',
  color: '#4a3f20',
  boxShadow: '0 18px 60px rgba(0,0,0,.4)',
}

const eyebrow: React.CSSProperties = {
  margin: 0,
  fontSize: 11.5,
  letterSpacing: '.06em',
  color: '#7a9a3f',
  fontWeight: 700,
  textAlign: 'center',
}

const bodyText: React.CSSProperties = {
  marginTop: 8,
  fontSize: 13.5,
  lineHeight: 1.6,
  color: '#5c5230',
  wordBreak: 'keep-all',
}

const hud: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 14,
  fontWeight: 700,
  color: '#5c5230',
  marginBottom: 10,
  padding: '0 4px',
}

const gameArea: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: `${GAME_W} / ${GAME_H}`,
  borderRadius: 14,
  overflow: 'hidden',
  background: `linear-gradient(180deg, ${PALETTE.skyBottom} 0%, #eef6d8 70%, #e2edc4 100%)`,
  border: `2px solid ${PALETTE.pearLeafLight}`,
  touchAction: 'none',
  cursor: 'pointer',
}

const pearStyle: React.CSSProperties = {
  position: 'absolute',
  fontSize: PEAR_SIZE,
  lineHeight: 1,
  transform: 'translate(-2px,-2px)',
  filter: 'drop-shadow(0 3px 3px rgba(0,0,0,.2))',
  pointerEvents: 'none',
}

const basketStyle: React.CSSProperties = {
  position: 'absolute',
  top: `${(BASKET_Y / GAME_H) * 100}%`,
  fontSize: BASKET_H + 12,
  lineHeight: 1,
  transform: 'translateX(0)',
  filter: 'drop-shadow(0 3px 3px rgba(0,0,0,.25))',
  pointerEvents: 'none',
}

const popupStyle: React.CSSProperties = {
  position: 'absolute',
  top: `${((BASKET_Y - 18) / GAME_H) * 100}%`,
  fontSize: 15,
  fontWeight: 800,
  pointerEvents: 'none',
  textShadow: '0 1px 2px rgba(255,255,255,.8)',
}

const ghostBtn: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: 12,
  border: `1px solid ${PALETTE.pearLeafLight}`,
  background: 'transparent',
  color: '#7a9a3f',
  fontSize: 13,
  fontFamily: 'inherit',
  cursor: 'pointer',
}

const primaryBtn: React.CSSProperties = {
  padding: '10px 20px',
  borderRadius: 12,
  border: 'none',
  background: PALETTE.pearLeaf,
  color: '#fdf9ea',
  fontSize: 14,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
}
