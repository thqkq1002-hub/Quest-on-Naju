import { useCallback, useRef, useState } from 'react'
import { releaseJoystick, setJoystick } from '@/lib/input'

const BASE = 132
const KNOB = 58
const MAX = (BASE - KNOB) / 2

/**
 * 가상 조이스틱 (좌하단). 레퍼런스 이미지 3의 그것.
 *
 * 3D 씬 안이 아니라 **DOM 오버레이**로 만듭니다 — 터치 이벤트 처리도,
 * 화면 해상도 대응도, 접근성도 전부 DOM 쪽이 낫습니다.
 * 3D 안에 UI를 넣어야 할 이유는 대개 없습니다.
 */
export function Joystick() {
  const [knob, setKnob] = useState({ x: 0, y: 0 })
  const pointerId = useRef<number | null>(null)
  const origin = useRef({ x: 0, y: 0 })

  const update = useCallback((clientX: number, clientY: number) => {
    const dx = clientX - origin.current.x
    const dy = clientY - origin.current.y
    const dist = Math.hypot(dx, dy)
    const clamped = Math.min(dist, MAX)
    const angle = Math.atan2(dy, dx)
    const kx = Math.cos(angle) * clamped
    const ky = Math.sin(angle) * clamped
    setKnob({ x: kx, y: ky })
    // 화면 위쪽(-y)이 전진(+y)입니다
    setJoystick(kx / MAX, -ky / MAX)
  }, [])

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== null) return
    pointerId.current = e.pointerId
    e.currentTarget.setPointerCapture(e.pointerId)
    const rect = e.currentTarget.getBoundingClientRect()
    origin.current = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 }
    update(e.clientX, e.clientY)
  }

  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== e.pointerId) return
    update(e.clientX, e.clientY)
  }

  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerId.current !== e.pointerId) return
    pointerId.current = null
    setKnob({ x: 0, y: 0 })
    releaseJoystick()
  }

  return (
    <div
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      style={{
        position: 'absolute',
        left: 'max(24px, env(safe-area-inset-left))',
        bottom: 'max(28px, env(safe-area-inset-bottom))',
        width: BASE,
        height: BASE,
        borderRadius: '50%',
        border: '2px solid rgba(255,255,255,.5)',
        background: 'rgba(255,255,255,.14)',
        backdropFilter: 'blur(3px)',
        touchAction: 'none',
        display: 'grid',
        placeItems: 'center',
        pointerEvents: 'auto',
        userSelect: 'none',
      }}
    >
      <div
        style={{
          width: KNOB,
          height: KNOB,
          borderRadius: '50%',
          background: 'rgba(255,255,255,.82)',
          boxShadow: '0 3px 12px rgba(0,0,0,.28)',
          transform: `translate(${knob.x}px, ${knob.y}px)`,
          transition: pointerId.current === null ? 'transform .16s ease-out' : 'none',
        }}
      />
      <span
        style={{
          position: 'absolute',
          bottom: -24,
          fontSize: 12,
          color: 'rgba(255,255,255,.85)',
          textShadow: '0 1px 4px rgba(0,0,0,.6)',
        }}
      >
        이동
      </span>
    </div>
  )
}
