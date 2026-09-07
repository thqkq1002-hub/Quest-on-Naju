import { useEffect } from 'react'
import { useGameStore } from '@/store/gameStore'

/**
 * 대화창.
 *
 * 자막은 옵션이 아니라 기본값입니다 — 교실에서 소리를 끄고 쓰는 경우가
 * 많고, 그게 접근성의 출발점이기도 합니다. → docs/02-GAME-DESIGN.md 7절
 *
 * 여러 줄짜리 이야기는 한 줄씩 넘깁니다. 아무 곳이나 누르거나 Space·Enter.
 */
export function DialogueBox() {
  const dialogue = useGameStore((s) => s.dialogue)
  const advance = useGameStore((s) => s.advanceDialogue)

  // 대화 중에는 Space 가 상호작용이 아니라 "다음 줄" 이어야 합니다.
  // 캡처 단계에서 가로채 input.ts 의 requestInteract 가 불리지 않게 합니다.
  useEffect(() => {
    if (!dialogue) return
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'Space' && e.code !== 'Enter' && e.code !== 'KeyF') return
      e.preventDefault()
      e.stopPropagation()
      advance()
    }
    window.addEventListener('keydown', onKey, true)
    return () => window.removeEventListener('keydown', onKey, true)
  }, [dialogue, advance])

  if (!dialogue) return null

  const line = dialogue.lines[dialogue.index]
  const last = dialogue.index === dialogue.lines.length - 1

  return (
    <div style={wrap} onPointerDown={advance}>
      <div style={box}>
        <div style={speaker}>{line.speaker}</div>
        <p style={text}>{line.text}</p>
        <div style={footer}>
          {dialogue.lines.length > 1 && (
            <span style={dots} aria-hidden="true">
              {dialogue.lines.map((_, i) => (
                <span
                  key={i}
                  style={{
                    ...dot,
                    background: i <= dialogue.index ? '#ffd24a' : 'rgba(255,255,255,.25)',
                  }}
                />
              ))}
            </span>
          )}
          <span style={next}>{last ? '닫기 ▸' : '계속하려면 아무 곳이나 누르세요 ▸'}</span>
        </div>
      </div>
    </div>
  )
}

const wrap: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  padding: '0 16px max(28px, env(safe-area-inset-bottom))',
  pointerEvents: 'auto',
  cursor: 'pointer',
  zIndex: 25,
}

const box: React.CSSProperties = {
  width: 'min(720px, 100%)',
  padding: '18px 22px 14px',
  borderRadius: 14,
  border: '1px solid rgba(140,205,235,.5)',
  background: 'rgba(12,26,36,.92)',
  color: '#eef6fa',
  boxShadow: '0 10px 40px rgba(0,0,0,.45)',
}

const speaker: React.CSSProperties = {
  fontSize: 13,
  fontWeight: 700,
  color: '#ffd24a',
  letterSpacing: '0.03em',
  marginBottom: 7,
}

const text: React.CSSProperties = {
  margin: 0,
  fontSize: 16.5,
  lineHeight: 1.65,
  wordBreak: 'keep-all',
  minHeight: '3.3em',
}

const footer: React.CSSProperties = {
  marginTop: 12,
  display: 'flex',
  alignItems: 'center',
  gap: 10,
}

const dots: React.CSSProperties = { display: 'flex', gap: 5 }

const dot: React.CSSProperties = {
  width: 7,
  height: 7,
  borderRadius: '50%',
  display: 'block',
}

const next: React.CSSProperties = {
  marginLeft: 'auto',
  fontSize: 12,
  opacity: 0.55,
}
