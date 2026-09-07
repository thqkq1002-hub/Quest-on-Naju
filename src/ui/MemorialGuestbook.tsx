import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'

/**
 * 나주역 기념관 방명록 — 학생독립운동을 기린 학생들에게 남기는 짧은 메시지.
 *
 * 서버가 없는 게임이라 이 방명록은 **이 기기에만** 남습니다(localStorage).
 * 그래서 "전 세계 참배객이 함께 보는 방명록"이라 부풀리지 않고, 안내
 * 문구에도 정직하게 "이 기기에 남는다"고 씁니다.
 *
 * QuizPuzzle과 같은 `puzzle` 상태를 씁니다 — 퀴즈가 아니라 글쓰기라는 점만
 * 다르지, "안내판 근처에서 여는 팝업 하나"라는 자리는 같기 때문입니다.
 */
const PUZZLE_ID = 'puzzle-najustation-guestbook'

export function MemorialGuestbook() {
  const isOpen = useGameStore((s) => s.puzzle) === PUZZLE_ID
  const close = useGameStore((s) => s.closePuzzle)
  const solve = useGameStore((s) => s.solvePuzzle)
  const messages = useGameStore((s) => s.memorialMessages)
  const addMessage = useGameStore((s) => s.addMemorialMessage)

  const [draft, setDraft] = useState('')
  const [justSent, setJustSent] = useState(false)

  if (!isOpen) return null

  function submit() {
    if (!draft.trim()) return
    addMessage(draft)
    setDraft('')
    setJustSent(true)
    setTimeout(() => solve(PUZZLE_ID), 1400)
  }

  return (
    <div style={overlay}>
      <div style={sheet}>
        {!justSent ? (
          <>
            <p style={eyebrow}>방명록 · 학생독립운동기념관</p>
            <div style={{ fontSize: 40, margin: '6px 0' }}>🕊️</div>
            <h2 style={{ margin: 0, fontSize: 18 }}>
              그날의 학생들에게 짧은 인사를 남겨 보렴
            </h2>
            <p style={hint}>이 메시지는 이 기기에만 저장됩니다.</p>

            {messages.length > 0 && (
              <ul style={list}>
                {messages
                  .slice(-5)
                  .reverse()
                  .map((m, i) => (
                    <li key={i} style={listItem}>
                      “{m}”
                    </li>
                  ))}
              </ul>
            )}

            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              maxLength={80}
              rows={3}
              placeholder="예) 여러분 덕분에 오늘의 우리가 있어요. 고맙습니다."
              style={textarea}
            />
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button onClick={close} style={ghostBtn}>
                나중에 하기
              </button>
              <button
                onClick={submit}
                disabled={!draft.trim()}
                style={{ ...submitBtn, opacity: draft.trim() ? 1 : 0.5, cursor: draft.trim() ? 'pointer' : 'default' }}
              >
                방명록에 남기기
              </button>
            </div>
          </>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48 }}>🕊️✨</div>
            <p style={eyebrow}>마음이 전해졌습니다</p>
            <p style={{ ...hint, marginTop: 8 }}>방명록에 메시지를 남겼습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}

const overlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(8,20,26,.6)',
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
  padding: '22px 22px 20px',
  borderRadius: 20,
  border: '3px solid #a8843f',
  background: '#292722',
  color: '#e0d8c4',
  boxShadow: '0 18px 60px rgba(0,0,0,.45)',
  textAlign: 'center',
}

const eyebrow: React.CSSProperties = {
  margin: 0,
  fontSize: 11.5,
  letterSpacing: '.06em',
  color: '#a8843f',
  fontWeight: 700,
}

const hint: React.CSSProperties = {
  margin: '6px 0 0',
  fontSize: 12,
  color: '#a89a72',
}

const list: React.CSSProperties = {
  listStyle: 'none',
  margin: '14px 0 0',
  padding: 0,
  display: 'flex',
  flexDirection: 'column',
  gap: 6,
  maxHeight: 130,
  overflowY: 'auto',
}

const listItem: React.CSSProperties = {
  fontSize: 12.5,
  lineHeight: 1.5,
  color: '#c4b48a',
  padding: '7px 10px',
  borderRadius: 9,
  background: 'rgba(168,132,63,.12)',
  textAlign: 'left',
  wordBreak: 'break-word',
}

const textarea: React.CSSProperties = {
  width: '100%',
  marginTop: 14,
  padding: '10px 12px',
  borderRadius: 12,
  border: '2px solid #4a453c',
  background: '#332f28',
  color: '#e0d8c4',
  fontSize: 13.5,
  fontFamily: 'inherit',
  resize: 'none',
  boxSizing: 'border-box',
}

const ghostBtn: React.CSSProperties = {
  flex: 1,
  padding: '10px 16px',
  borderRadius: 12,
  border: '1px solid #4a453c',
  background: 'transparent',
  color: '#a89a72',
  fontSize: 13,
  fontFamily: 'inherit',
  cursor: 'pointer',
}

const submitBtn: React.CSSProperties = {
  flex: 2,
  padding: '10px 16px',
  borderRadius: 12,
  border: '1px solid #a8843f',
  background: '#a8843f',
  color: '#292722',
  fontSize: 13.5,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
}
