import { useEffect, useState } from 'react'
import { useMapStore } from '@/store/mapStore'
import { isMuted, setMuted, startAmbientLoop, stopAmbientLoop, unlockAudio } from '@/lib/audio'

/**
 * 배경음악 On/Off 버튼 — 드들강 솔밭유원지에서만 뜹니다.
 *
 * 이 맵에 들어오면 <엄마야 누나야> 오르골 루프가 자동으로 돌기 시작하고,
 * 다른 맵으로 나가면 멈춥니다. 음소거는 루프를 멈추는 게 아니라 볼륨만
 * 0으로 줄입니다 — 다시 켤 때 처음부터 다시 시작하지 않고 이어서 들립니다.
 */
export function BgmToggle() {
  const current = useMapStore((s) => s.current)
  const onThisMap = current === 'ddeuldeulgang'
  const [muted, setMutedState] = useState(isMuted())

  useEffect(() => {
    if (!onThisMap) return
    startAmbientLoop()
    return () => stopAmbientLoop()
  }, [onThisMap])

  if (!onThisMap) return null

  function toggle() {
    unlockAudio()
    const next = !muted
    setMuted(next)
    setMutedState(next)
  }

  return (
    <button onClick={toggle} style={btn} title="배경음악 켜기/끄기">
      {muted ? '🔇 BGM 꺼짐' : '🎵 BGM 켜짐'}
    </button>
  )
}

const btn: React.CSSProperties = {
  position: 'absolute',
  // 우측 상단은 이미 「나주 지도」·「탐험 수첩」이 한 줄을 차지하고 있어
  // 그 아래로 한 칸 내려 스택합니다
  top: 'calc(max(16px, env(safe-area-inset-top)) + 46px)',
  right: 'max(24px, env(safe-area-inset-right))',
  padding: '7px 14px',
  borderRadius: 999,
  border: '1px solid rgba(255,255,255,.4)',
  background: 'rgba(20,46,38,.68)',
  color: '#eafaf0',
  fontSize: 12.5,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
  pointerEvents: 'auto',
  zIndex: 30,
}
