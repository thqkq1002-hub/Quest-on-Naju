import { useEffect, useRef, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { ITEM_NAMES } from '@/game/quest/data'

/**
 * 홍어삼합 만들기 — 영산포 홍어거리 좌판에서 하는 순서 맞추기 미니게임.
 *
 * 위에서 알려 주는 재료(홍어 → 묵은지 → 수육) 순서대로 버튼을 눌러
 * 점수를 쌓습니다. 목표 점수를 채우면, 삼합을 다 만든 뒤에 어울리는
 * 확인 퀴즈 두 문항을 잇달아 냅니다 — RelicDigGame의 "발견 즉시 확인"과
 * 같은 자리이되, 여기서는 게임이 끝난 뒤 한 번에 묻습니다.
 */
const PUZZLE_ID = 'puzzle-hongeo-combo'

type Ingredient = 'hongeo' | 'kimchi' | 'suyuk'
interface IngredientMeta {
  key: Ingredient
  icon: string
  name: string
  prompt: string
  color: string
}

const INGREDIENTS: IngredientMeta[] = [
  { key: 'hongeo', icon: '🐟', name: '숙성 홍어', prompt: '알싸하게 잘 익은 홍어!', color: '#4a8fb0' },
  { key: 'kimchi', icon: '🥬', name: '묵은지', prompt: '아삭한 묵은지!', color: '#5a9a4a' },
  { key: 'suyuk', icon: '🍖', name: '수육', prompt: '고소한 수육!', color: '#c17f2c' },
]
const ORDER: Ingredient[] = ['hongeo', 'kimchi', 'suyuk']

const GAME_SECONDS = 30
const TARGET_SCORE = 50
const GOOD_GAIN = 10
const BAD_LOSS = 5

interface Quiz {
  question: string
  options: string[]
  answer: number
  hint: string
  rewardLine: string
}
const QUIZZES: Quiz[] = [
  {
    question:
      "흑산도에서 잡힌 홍어가 영산강 배를 타고 영산포까지 오면서 자연스럽게 '이것'이 되어 별미가 되었습니다. 무엇일까요?",
    options: ['① 냉동', '② 숙성(삭힘)', '③ 건조'],
    answer: 1,
    hint: '냉장 시설이 없던 시절, 뱃길로 오는 며칠 동안 홍어에게 무슨 일이 생겼을지 떠올려 봐.',
    rewardLine: '냉장 시설이 없던 시절, 흑산도에서 영산포까지 오는 며칠 동안 홍어가 자연스럽게 삭으며 특유의 알싸한 맛이 생겼습니다.',
  },
  {
    question: '영산포 근대 거리에서 영산강의 역사와 수운 문화를 둘러볼 수 있는 문학관의 이름은 무엇일까요?',
    options: ['① 영산포 이야기관', '② 나주 향토관', '③ 타오르는 강 문학관'],
    answer: 2,
    hint: '아까 근대 거리에서 문순태 작가의 소설 이름을 그대로 딴 문학관에 다녀왔지?',
    rewardLine: '타오르는 강 문학관은 문순태 작가의 소설 「타오르는 강」과 영산강 수운의 역사를 소개하는 곳입니다.',
  },
]

type Stage = 'intro' | 'playing' | 'quiz' | 'success' | 'fail'

export function HongeoComboGame() {
  const isOpen = useGameStore((s) => s.puzzle) === PUZZLE_ID
  const close = useGameStore((s) => s.closePuzzle)
  const solve = useGameStore((s) => s.solvePuzzle)

  const [stage, setStage] = useState<Stage>('intro')
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_SECONDS)
  const [stepIdx, setStepIdx] = useState(0)
  const [flash, setFlash] = useState<'good' | 'bad' | null>(null)
  const [combosDone, setCombosDone] = useState(0)

  const [quizIdx, setQuizIdx] = useState(0)
  const [quizWrong, setQuizWrong] = useState(false)

  const scoreRef = useRef(score)
  scoreRef.current = score

  useEffect(() => {
    if (!isOpen) setStage('intro')
  }, [isOpen])

  function startGame() {
    setScore(0)
    setTimeLeft(GAME_SECONDS)
    setStepIdx(0)
    setCombosDone(0)
    setFlash(null)
    setStage('playing')
  }

  // 타이머
  useEffect(() => {
    if (stage !== 'playing') return
    const id = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(id)
          setStage((cur) => (cur === 'playing' && scoreRef.current < TARGET_SCORE ? 'fail' : cur))
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => clearInterval(id)
  }, [stage])

  // 목표 점수 달성 즉시 확인 퀴즈로 전환
  useEffect(() => {
    if (stage !== 'playing') return
    if (score >= TARGET_SCORE) {
      setQuizIdx(0)
      setQuizWrong(false)
      setStage('quiz')
    }
  }, [score, stage])

  useEffect(() => {
    if (stage !== 'success') return
    const t = setTimeout(() => solve(PUZZLE_ID), 2200)
    return () => clearTimeout(t)
  }, [stage, solve])

  function tap(key: Ingredient) {
    if (stage !== 'playing') return
    if (key === ORDER[stepIdx]) {
      setScore((s) => s + GOOD_GAIN)
      setFlash('good')
      setStepIdx((i) => {
        const next = i + 1
        if (next >= ORDER.length) {
          setCombosDone((c) => c + 1)
          return 0
        }
        return next
      })
    } else {
      setScore((s) => Math.max(0, s - BAD_LOSS))
      setFlash('bad')
    }
    setTimeout(() => setFlash(null), 220)
  }

  function answerQuiz(idx: number) {
    const q = QUIZZES[quizIdx]
    if (idx === q.answer) {
      setQuizWrong(false)
      if (quizIdx + 1 < QUIZZES.length) {
        setQuizIdx((i) => i + 1)
      } else {
        setStage('success')
      }
    } else {
      setQuizWrong(true)
    }
  }

  if (!isOpen) return null

  const target = INGREDIENTS.find((i) => i.key === ORDER[stepIdx])!

  return (
    <div style={overlay}>
      <div style={sheet}>
        {stage === 'intro' && (
          <div style={{ textAlign: 'center' }}>
            <p style={eyebrow}>홍어거리 · 홍어삼합 만들기</p>
            <div style={{ fontSize: 42, margin: '4px 0' }}>🐟🥬🍖</div>
            <h2 style={{ margin: 0, fontSize: 18 }}>삼합을 맞춰 볼까?</h2>
            <p style={bodyText}>
              위에서 알려 주는 재료 순서(홍어 → 묵은지 → 수육) 그대로 아래 버튼을 눌러요.
              <br />
              맞으면 +{GOOD_GAIN}점, 틀리면 -{BAD_LOSS}점! {GAME_SECONDS}초 안에 {TARGET_SCORE}점을
              모으면 성공이에요.
            </p>
            <div style={{ display: 'flex', gap: 8, marginTop: 14, justifyContent: 'center' }}>
              <button onClick={close} style={ghostBtn}>
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
              <span>🥢 {score}점</span>
              <span>⏱ {timeLeft}초</span>
              <span style={{ opacity: 0.75 }}>목표 {TARGET_SCORE}점</span>
            </div>
            <div style={{ ...promptBox, borderColor: target.color }}>
              <span style={{ fontSize: 26 }}>{target.icon}</span>
              <span style={promptText}>{target.prompt}</span>
            </div>
            <div style={comboRow}>
              {Array.from({ length: ORDER.length }).map((_, i) => (
                <span key={i} style={{ ...comboDot, opacity: i < stepIdx ? 1 : 0.25 }} />
              ))}
              <span style={{ fontSize: 11, opacity: 0.6, marginLeft: 6 }}>완성 {combosDone}회</span>
            </div>
            <div style={ingredientGrid}>
              {INGREDIENTS.map((ing) => (
                <button
                  key={ing.key}
                  onClick={() => tap(ing.key)}
                  style={{
                    ...ingredientBtn,
                    borderColor: ing.color,
                    background: `${ing.color}22`,
                  }}
                >
                  <span style={{ fontSize: 30 }}>{ing.icon}</span>
                  <span style={{ fontSize: 12.5, fontWeight: 700 }}>{ing.name}</span>
                </button>
              ))}
            </div>
            {flash && (
              <p style={{ ...feedback, color: flash === 'good' ? '#4a8f3f' : '#c1584c', textAlign: 'center' }}>
                {flash === 'good' ? `+${GOOD_GAIN}` : `-${BAD_LOSS}`}
              </p>
            )}
          </>
        )}

        {stage === 'quiz' && (
          <div style={{ textAlign: 'center' }}>
            <p style={eyebrow}>확인 퀴즈 {quizIdx + 1} / {QUIZZES.length}</p>
            <p style={{ ...bodyText, fontWeight: 700 }}>{QUIZZES[quizIdx].question}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 12 }}>
              {QUIZZES[quizIdx].options.map((opt, i) => (
                <button key={opt} onClick={() => answerQuiz(i)} style={optionBtn}>
                  {opt}
                </button>
              ))}
            </div>
            {quizWrong && (
              <p style={{ ...feedback, color: '#c1584c' }} role="status">
                ❌ {QUIZZES[quizIdx].hint}
              </p>
            )}
          </div>
        )}

        {stage === 'success' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48 }}>🐟🥬🍖✨</div>
            <p style={eyebrow}>퀘스트 성공!</p>
            <h2 style={{ margin: '4px 0 8px', fontSize: 18 }}>영산포 홍어삼합을 완성했습니다!</h2>
            <div style={summaryCard}>
              {QUIZZES.map((q) => (
                <p key={q.question} style={summaryLine}>
                  {q.rewardLine}
                </p>
              ))}
            </div>
            <p style={{ ...bodyText, fontSize: 12, opacity: 0.75 }}>
              [{ITEM_NAMES['item-hongeo-samhap']}] 획득! 도감에 등록되었습니다.
            </p>
          </div>
        )}

        {stage === 'fail' && (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 42 }}>🥢</div>
            <p style={eyebrow}>다시 만들어 볼까?</p>
            <h2 style={{ margin: '4px 0 8px', fontSize: 17 }}>
              이번엔 {score}점을 모았어요. 목표는 {TARGET_SCORE}점!
            </h2>
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
  background: 'rgba(10,24,30,.6)',
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
  border: '3px solid #4a8fb0',
  background: '#fbf6ea',
  color: '#3a2e1e',
  boxShadow: '0 18px 60px rgba(0,0,0,.42)',
}

const eyebrow: React.CSSProperties = {
  margin: 0,
  fontSize: 11.5,
  letterSpacing: '.06em',
  color: '#3a7a9a',
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
  color: '#3a2e1e',
  marginBottom: 10,
  padding: '0 4px',
}

const promptBox: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
  padding: '12px 14px',
  borderRadius: 14,
  border: '2px solid',
  background: 'rgba(0,0,0,.04)',
  marginBottom: 10,
}

const promptText: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 800,
}

const comboRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 6,
  marginBottom: 12,
}

const comboDot: React.CSSProperties = {
  width: 9,
  height: 9,
  borderRadius: '50%',
  background: '#4a8f3f',
}

const ingredientGrid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: 8,
}

const ingredientBtn: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 4,
  padding: '14px 6px',
  borderRadius: 14,
  borderWidth: 2,
  borderStyle: 'solid',
  fontFamily: 'inherit',
  color: '#3a2e1e',
  cursor: 'pointer',
}

const feedback: React.CSSProperties = {
  marginTop: 8,
  fontSize: 13,
  fontWeight: 800,
  lineHeight: 1.5,
}

const optionBtn: React.CSSProperties = {
  padding: '11px 14px',
  borderRadius: 10,
  border: '2px solid #bcd8e2',
  background: '#eef7fa',
  color: '#1f3a44',
  fontSize: 13.5,
  fontWeight: 700,
  fontFamily: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
}

const summaryCard: React.CSSProperties = {
  marginTop: 10,
  padding: '12px 14px',
  borderRadius: 12,
  background: 'rgba(74,143,176,.12)',
  textAlign: 'left',
}

const summaryLine: React.CSSProperties = {
  margin: '6px 0 0',
  fontSize: 12.5,
  lineHeight: 1.6,
  color: '#3a5a68',
  wordBreak: 'keep-all',
}

const ghostBtn: React.CSSProperties = {
  padding: '10px 16px',
  borderRadius: 12,
  border: '1px solid #bcd8e2',
  background: 'transparent',
  color: '#3a7a9a',
  fontSize: 13,
  fontFamily: 'inherit',
  cursor: 'pointer',
}

const primaryBtn: React.CSSProperties = {
  padding: '10px 20px',
  borderRadius: 12,
  border: 'none',
  background: '#4a8fb0',
  color: '#fdf9ea',
  fontSize: 14,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
}
