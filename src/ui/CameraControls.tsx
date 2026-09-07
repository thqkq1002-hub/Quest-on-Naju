import { useCallback, useEffect, useRef, useState } from 'react'
import { cameraState, resetCamera, rotateHold, toggleTopView } from '@/game/player/camera'

/**
 * 카메라 조작 UI.
 *
 * 초등학생이 쓸 화면이라 **드래그만으로는 부족합니다** — 드래그는 알아야
 * 쓸 수 있지만 버튼은 보이면 눌러집니다. 그래서 셋 다 넣습니다:
 *   · 화면 빈 곳 드래그 (아는 사람이 빠르게)
 *   · 화살표 버튼 (누구나)
 *   · Q / E 키 (데스크톱)
 */

/** 화면 빈 곳을 끌면 카메라가 돕니다. HUD 버튼들보다 아래에 깔립니다 */
export function LookPad() {
  const active = useRef<number | null>(null)
  const lastX = useRef(0)

  const onDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (active.current !== null) return
    active.current = e.pointerId
    lastX.current = e.clientX
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (active.current !== e.pointerId) return
    const dx = e.clientX - lastX.current
    lastX.current = e.clientX
    // 화면을 오른쪽으로 끌면 세상이 왼쪽으로 도는 감각
    cameraState.yaw += dx * 0.006
  }
  const onUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (active.current !== e.pointerId) return
    active.current = null
  }

  return (
    <div
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerCancel={onUp}
      style={{ position: 'absolute', inset: 0, touchAction: 'none', pointerEvents: 'auto' }}
      aria-hidden="true"
    />
  )
}

export function CameraButtons() {
  const [top, setTop] = useState(false)

  // 키보드도 같은 상태를 건드려야 버튼 표시가 어긋나지 않습니다
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.repeat) return
      if (e.code === 'KeyQ') rotateHold.dir = -1
      else if (e.code === 'KeyE') rotateHold.dir = 1
      else if (e.code === 'KeyT') setTop(toggleTopView())
      else if (e.code === 'KeyR') {
        resetCamera()
        setTop(false)
      }
    }
    const up = (e: KeyboardEvent) => {
      if (e.code === 'KeyQ' || e.code === 'KeyE') rotateHold.dir = 0
    }
    // 탭이 바뀌면 keyup을 놓쳐 카메라가 계속 돕니다
    const blur = () => {
      rotateHold.dir = 0
    }
    window.addEventListener('keydown', down)
    window.addEventListener('keyup', up)
    window.addEventListener('blur', blur)
    return () => {
      window.removeEventListener('keydown', down)
      window.removeEventListener('keyup', up)
      window.removeEventListener('blur', blur)
      rotateHold.dir = 0
    }
  }, [])

  const hold = useCallback((dir: number) => (e: React.PointerEvent<HTMLButtonElement>) => {
    e.preventDefault()
    rotateHold.dir = dir
    const release = () => {
      rotateHold.dir = 0
      window.removeEventListener('pointerup', release)
      window.removeEventListener('pointercancel', release)
    }
    // 버튼 밖에서 손을 떼도 회전이 멈춰야 합니다.
    // 버튼의 onPointerUp만 쓰면 끌다가 벗어났을 때 계속 돕니다.
    window.addEventListener('pointerup', release)
    window.addEventListener('pointercancel', release)
  }, [])

  return (
    <div style={wrap}>
      <button
        style={btn}
        onPointerDown={hold(-1)}
        aria-label="카메라 왼쪽으로 돌리기"
        title="왼쪽으로 돌리기 (Q)"
      >
        ↺
      </button>
      <button
        style={{ ...btn, ...(top ? btnOn : null), width: 'auto', padding: '0 15px' }}
        onPointerDown={(e) => {
          e.preventDefault()
          setTop(toggleTopView())
        }}
        aria-pressed={top}
        title="위에서 내려다보기 (T)"
      >
        탑뷰
      </button>
      <button
        style={btn}
        onPointerDown={hold(1)}
        aria-label="카메라 오른쪽으로 돌리기"
        title="오른쪽으로 돌리기 (E)"
      >
        ↻
      </button>
      <button
        style={{ ...btn, fontSize: 15 }}
        onPointerDown={(e) => {
          e.preventDefault()
          resetCamera()
          setTop(false)
        }}
        aria-label="카메라 원래대로"
        title="원래대로 (R)"
      >
        ⟲
      </button>
    </div>
  )
}

const wrap: React.CSSProperties = {
  position: 'absolute',
  right: 'max(24px, env(safe-area-inset-right))',
  bottom: 'max(104px, calc(env(safe-area-inset-bottom) + 76px))',
  display: 'flex',
  gap: 8,
  pointerEvents: 'auto',
}

const btn: React.CSSProperties = {
  width: 46,
  height: 46,
  display: 'grid',
  placeItems: 'center',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,.4)',
  background: 'rgba(16,34,46,.6)',
  backdropFilter: 'blur(4px)',
  color: '#eaf4f8',
  fontSize: 21,
  fontFamily: 'inherit',
  lineHeight: 1,
  cursor: 'pointer',
  touchAction: 'none',
  userSelect: 'none',
}

const btnOn: React.CSSProperties = {
  background: 'rgba(255,210,74,.9)',
  color: '#1a2b21',
  fontWeight: 700,
  borderColor: 'rgba(255,210,74,1)',
}
