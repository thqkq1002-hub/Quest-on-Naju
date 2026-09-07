import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { ITEM_NAMES } from '@/game/quest/data'
import { OMMAYA_NOTES } from '@/lib/melody'
import { playNote, unlockAudio } from '@/lib/audio'

/**
 * 안성현 선생의 리듬 악보 완성하기 — 드들강에 떠내려오는 솔방울 음표를
 * 박자에 맞춰 건반(바구니)으로 받는 미니게임.
 *
 * 하나 맞힐 때마다 <엄마야 누나야> 음을 한 음씩 재생합니다 — 성공적으로
 * 게임을 마치면 그 사이 곡 전체를 한 바퀴 들은 셈이 됩니다. 구조는
 * PearCatchGame과 같고(낙하 + 바구니 캐치), RelicDigGame처럼 게임 뒤에
 * 확인 퀴즈를 붙였습니다 — 둘 다 이미 검증된 패턴이라 그대로 재사용합니다.
 */
const PUZZLE_ID = 'puzzle-pine-rhythm'

const GAME_W = 420
const GAME_H = 320
const BASKET_W = 68
const BASKET_H = 30
const BASKET_Y = GAME_H - BASKET_H - 6
const NOTE_SIZE = 34
const GAME_SECONDS = 30
const TARGET_SCORE = 50
const SPAWN_MS = 780
const GOOD_GAIN = 10
const MISS_LOSS = 5

interface FallingNote {
  id: number
  x: number
  y: number
  speed: number
}
interface Popup {
  id: number
  x: number
  text: string
  good: boolean
}

type Stage = 'intro' | 'playing' | 'quiz' | 'success' | 'fail'

export function PineNoteRhythmGame() {
  const isOpen = useGameStore((s) => s.puzzle) === PUZZLE_ID
  const close = useGameStore((s) => s.closePuzzle)
  const solve = useGameStore((s) => s.solvePuzzle)

  const [stage, setStage] = useState<Stage>('intro')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS)
  const [basketX, setBasketX] = useState((GAME_W - BASKET_W) / 2)
  const [notes, setNotes] = useState<FallingNote[]>([])
  const [popups, setPopups] = useState<Popup[]>([])
  const [phrasesFilled, setPhrasesFilled] = useState(0)
  const [quizWrong, setQuizWrong] = useState(false)

  const areaRef = useRef<HTMLDivElement>(null)
  const basketXRef = useRef(basketX)
  const scoreRef = useRef(score)
  const noteIdxRef = useRef(0)
  const nextIdRef = useRef(0)
  const rafRef = useRef(0)
  const lastTsRef = useRef(0)
  const startTsRef = useRef(0)
  const spawnMsRef = useRef(0)

  basketXRef.current = basketX
  scoreRef.current = score

  useEffect(() => {
    if (!isOpen) setStage('intro')
  }, [isOpen])

  // 목표 점수에 닿으면 시간이 남아 있어도 곧바로 확인 퀴즈로 넘어갑니다
  useEffect(() => {
    if (stage !== 'playing') return
    if (score >= TARGET_SCORE) {
      setQuizWrong(false)
      setStage('quiz')
    }
  }, [score, stage])

  useEffect(() => {
    if (stage !== 'success') return
    const t = setTimeout(() => solve(PUZZLE_ID), 2200)
    return () => clearTimeout(t)
  }, [stage, solve])

  function startGame() {
    unlockAudio()
    setScore(0)
    setTimeLeft(GAME_SECONDS)
    setNotes([])
    setPopups([])
    setPhrasesFilled(0)
    setQuizWrong(false)
    setBasketX((GAME_W - BASKET_W) / 2)
    noteIdxRef.current = 0
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
      let spawned: FallingNote | null = null
      if (spawnMsRef.current >= SPAWN_MS) {
        spawnMsRef.current = 0
        spawned = {
          id: nextIdRef.current++,
          x: Math.random() * (GAME_W - NOTE_SIZE),
          y: -NOTE_SIZE,
          speed: 78 + Math.random() * 46,
        }
      }

      setNotes((prev) => {
        const bx = basketXRef.current
        const next: FallingNote[] = []
        let delta = 0
        const caught: Popup[] = []
        let caughtCount = 0
        let missedCount = 0
        const source = spawned ? [...prev, spawned] : prev
        for (const n of source) {
          const ny = n.y + n.speed * dt
          const reachedBasket = ny + NOTE_SIZE >= BASKET_Y
          const overlapsX = n.x + NOTE_SIZE > bx && n.x < bx + BASKET_W
          if (reachedBasket && overlapsX) {
            delta += GOOD_GAIN
            caughtCount++
            caught.push({ id: nextIdRef.current++, x: n.x, text: `+${GOOD_GAIN}`, good: true })
            continue
          }
          if (ny > GAME_H) {
            delta -= MISS_LOSS
            missedCount++
            caught.push({ id: nextIdRef.current++, x: n.x, text: `-${MISS_LOSS}`, good: false })
            continue
          }
          next.push({ ...n, y: ny })
        }
        if (delta !== 0) setScore((s) => Math.max(0, s + delta))
        if (caughtCount > 0) {
          setPhrasesFilled((f) => Math.min(OMMAYA_NOTES.length, f + caughtCount))
          for (let k = 0; k < caughtCount; k++) {
            const note = OMMAYA_NOTES[noteIdxRef.current % OMMAYA_NOTES.length]
            playNote(note, k * 0.05, 0.35)
            noteIdxRef.current++
          }
        }
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
            <p style={eyebrow}>솔밭길 · 안성현 선생의 리듬 악보</p>
            <div style={{ fontSize: 42, margin: '4px 0' }}>🌲🎵</div>
            <h2 style={{ margin: 0, fontSize: 18 }}>솔방울 음표를 받아 볼까?</h2>
            <p style={bodyText}>
              강물 위로 떠내려오는 솔방울 음표를, 화살표 키나 드래그로 건반을 움직여 받으세요.
              <br />
              맞히면 +{GOOD_GAIN}점, 놓치면 -{MISS_LOSS}점! {GAME_SECONDS}초 안에 {TARGET_SCORE}점을
              모으면 성공이에요.
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
              <span>🎵 {score}점</span>
              <span>⏱ {timeLeft}초</span>
              <span style={{ opacity: 0.75 }}>목표 {TARGET_SCORE}점</span>
            </div>
            <div style={staffRow}>
              {OMMAYA_NOTES.map((_, i) => (
                <span key={i} style={{ ...staffDot, opacity: i < phrasesFilled ? 1 : 0.25 }} />
              ))}
            </div>
            <div
              ref={areaRef}
              onPointerDown={onPointerMove}
              onPointerMove={onPointerMove}
              style={gameArea}
            >
              {notes.map((n) => (
                <span
                  key={n.id}
                  style={{
                    ...noteStyle,
                    left: `${(n.x / GAME_W) * 100}%`,
                    top: `${(n.y / GAME_H) * 100}%`,
                  }}
                >
                  🎵
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
              <span style={{ ...basketStyle, left: `${(basketX / GAME_W) * 100}%` }}>🪵</span>
            </div>
          </>
        )}

        {stage === 'quiz' && (
          <div style={{ textAlign: 'center' }}>
            <p style={eyebrow}>악보 완성! · 확인 퀴즈</p>
            <p style={{ ...bodyText, fontWeight: 700 }}>
              드들강 솔밭유원지에 노래비가 서 있는 천재 작곡가로, '엄마야 누나야', '부용산' 등을
              만드신 분은 누구일까요?
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {['① 안성현 선생', '② 윤동주 시인', '③ 김소월 시인'].map((opt, i) => (
                <button key={opt} onClick={() => answerQuiz(i)} style={optionBtn}>
                  {opt}
                </button>
              ))}
            </div>
            {quizWrong && (
              <p style={{ ...feedback, color: '#c1584c' }} role="status">
                ❌ 방금 걸어온 솔밭길에 서 있던 노래비를 떠올려 봐.
              </p>
            )}
          </div>
        )}

        {stage === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48 }}>🎼✨</div>
            <p style={eyebrow}>퀘스트 성공!</p>
            <h2 style={{ margin: '4px 0 8px', fontSize: 18 }}>
              &lt;엄마야 누나야&gt; 악보를 완성했습니다!
            </h2>
            <p style={bodyText}>
              안성현 선생은 김소월의 시 '엄마야 누나야'와 박기동의 시 '부용산'에 곡을 붙인
              작곡가입니다.
            </p>
            <p style={{ ...bodyText, fontSize: 12, opacity: 0.75 }}>
              [{ITEM_NAMES['item-ansunghyeon-songbook']}] 획득! 도감에 등록되었습니다.
            </p>
          </div>
        )}

        {stage === 'fail' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 42 }}>🍃</div>
            <p style={eyebrow}>다시 들어 볼까?</p>
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
  background: 'rgba(8,26,20,.6)',
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
  border: '3px solid #4a8f6c',
  background: '#f2f8f1',
  color: '#2c3a2f',
  boxShadow: '0 18px 60px rgba(0,0,0,.42)',
}

const eyebrow: React.CSSProperties = {
  margin: 0,
  fontSize: 11.5,
  letterSpacing: '.06em',
  color: '#3f8a5f',
  fontWeight: 700,
  textAlign: 'center',
}

const bodyText: React.CSSProperties = {
  marginTop: 8,
  fontSize: 13.5,
  lineHeight: 1.6,
  color: '#3c4a3f',
  wordBreak: 'keep-all',
  textAlign: 'center',
}

const hud: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  fontSize: 14,
  fontWeight: 700,
  color: '#2c3a2f',
  marginBottom: 6,
  padding: '0 4px',
}

const staffRow: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 3,
  marginBottom: 8,
  padding: '0 2px',
}

const staffDot: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: '50%',
  background: '#4a8f6c',
}

const gameArea: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: `${GAME_W} / ${GAME_H}`,
  borderRadius: 14,
  overflow: 'hidden',
  background: `linear-gradient(180deg, #cfe8de 0%, #8fbccb 60%, #5f9dc4 100%)`,
  border: '2px solid #7fbf9c',
  touchAction: 'none',
  cursor: 'pointer',
}

const noteStyle: React.CSSProperties = {
  position: 'absolute',
  fontSize: NOTE_SIZE,
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
  pointerEvents: 'none',
  filter: 'drop-shadow(0 3px 3px rgba(0,0,0,.25))',
}

const popupStyle: React.CSSProperties = {
  position: 'absolute',
  top: `${((BASKET_Y - 18) / GAME_H) * 100}%`,
  fontSize: 15,
  fontWeight: 800,
  pointerEvents: 'none',
  textShadow: '0 1px 2px rgba(255,255,255,.8)',
}

const optionBtn: React.CSSProperties = {
  padding: '11px 14px',
  borderRadius: 10,
  border: '2px solid #a8d4bc',
  background: '#eaf6ef',
  color: '#2c3a2f',
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
  border: '1px solid #a8d4bc',
  background: 'transparent',
  color: '#3f8a5f',
  fontSize: 13,
  fontFamily: 'inherit',
  cursor: 'pointer',
}

const primaryBtn: React.CSSProperties = {
  padding: '10px 20px',
  borderRadius: 12,
  border: 'none',
  background: '#3f8a5f',
  color: '#f2f8f1',
  fontSize: 14,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
}
