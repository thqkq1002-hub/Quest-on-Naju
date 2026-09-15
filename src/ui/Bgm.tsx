import { useEffect, useRef, useState } from 'react'
import { useMapStore } from '@/store/mapStore'
import type { MapId } from '@/game/world/registry'
import { isMuted, setMuted, startAmbientLoop, unlockAudio } from '@/lib/audio'
import {
  BITGARAM_MELODY,
  BOKAMRI_MELODY,
  JEONGRYEOLSA_MELODY,
  MUNPYEONG_MELODY,
  NAJUEUPSEONG_MELODY,
  NAJUSTATION_MELODY,
  OMMAYA_MELODY,
  YEONGSANPO_MELODY,
  type MelodyNote,
} from '@/lib/melody'

/**
 * 지역별 테마 — 다시초(오늘의 학교)만 기본 EXPLORE_MELODY를 그대로 쓰고,
 * 나머지 여덟 지역은 저마다의 색을 가진 멜로디를 씁니다. 드들강의
 * <엄마야 누나야>만은 이 게임에서 유일한 "실제 곡"이라 그대로 둡니다.
 * → src/lib/melody.ts 각 테마 주석에 고른 이유를 적어 뒀습니다.
 */
const MAP_MELODY: Partial<Record<MapId, readonly MelodyNote[]>> = {
  bokamri: BOKAMRI_MELODY,
  munpyeong: MUNPYEONG_MELODY,
  najueupseong: NAJUEUPSEONG_MELODY,
  yeongsanpo: YEONGSANPO_MELODY,
  jeongryeolsa: JEONGRYEOLSA_MELODY,
  najustation: NAJUSTATION_MELODY,
  bitgaram: BITGARAM_MELODY,
  ddeuldeulgang: OMMAYA_MELODY,
}

/**
 * 배경음악 — 지역마다 다른 테마가 흐릅니다.
 *
 * 브라우저는 사용자 제스처 없이는 소리를 내지 않습니다. 페이지가 뜨자마자
 * 재생을 시도는 하되, 실제로 들리는 건 사용자가 뭔가(클릭·키 입력)를 한
 * 다음부터입니다 — 그래서 문서 전체에 한 번짜리 리스너를 걸어 첫 입력에
 * 오디오 컨텍스트를 풀어 줍니다.
 */
export function Bgm() {
  const current = useMapStore((s) => s.current)
  const [muted, setMutedState] = useState(isMuted())
  const unlockedRef = useRef(false)

  useEffect(() => {
    startAmbientLoop(MAP_MELODY[current])
  }, [current])

  // 첫 사용자 입력에 오디오 잠금을 풉니다 — 이후로는 필요 없으니 스스로 떼어 냅니다
  useEffect(() => {
    if (unlockedRef.current) return
    const onFirstInput = () => {
      unlockedRef.current = true
      unlockAudio()
      window.removeEventListener('pointerdown', onFirstInput)
      window.removeEventListener('keydown', onFirstInput)
    }
    window.addEventListener('pointerdown', onFirstInput)
    window.addEventListener('keydown', onFirstInput)
    return () => {
      window.removeEventListener('pointerdown', onFirstInput)
      window.removeEventListener('keydown', onFirstInput)
    }
  }, [])

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
