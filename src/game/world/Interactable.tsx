import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Group } from 'three'
import { playerPos } from '@/game/player/Player'
import { addTarget } from '@/game/world/interaction'
import { groundAt } from '@/game/world/terrain'
import { useGameStore } from '@/store/gameStore'
import { PALETTE } from '@/lib/palette'

/**
 * 다가가서 살펴볼 수 있는 것 — 안내판, 유물, 트렌치.
 *
 * NPC 와 같은 규칙(범위 안 + 상호작용 키)으로 동작하되, 대화 대신
 * 설명 카드를 띄우고 퀘스트 목표를 채웁니다. 씬은 이 컴포넌트로 감싸기만
 * 하면 되고, 무엇을 가르치는지는 전부 props 로 들어옵니다.
 */
export function Interactable({
  targetId,
  kind = 'interact',
  label,
  title,
  body,
  /** 한 번만 반응할지 (안내판은 여러 번 읽어도 목표는 한 번만 오릅니다) */
  once = true,
  range = 3.6,
  x,
  z,
  onFirst,
  children,
}: {
  targetId: string
  kind?: 'interact' | 'reach' | 'collect' | 'dialogue'
  label: string
  title?: string
  body?: string
  once?: boolean
  range?: number
  x: number
  z: number
  onFirst?: () => void
  /** 눈에 보이는 몸체. 바닥의 도착 지점처럼 형체가 없는 것은 생략합니다 */
  children?: ReactNode
}) {
  const root = useRef<Group>(null)
  const used = useRef(false)
  const [inRange, setInRange] = useState(false)
  const y = groundAt(x, z)

  useFrame(() => {
    const near = Math.hypot(playerPos.x - x, playerPos.z - z) < range
    if (near !== inRange) {
      setInRange(near)
      useGameStore.getState().setHint(near ? label : '')
    }
    // reach 목표는 도착한 것만으로 채워집니다 — 버튼을 찾게 만들지 않습니다
    if (near && kind === 'reach' && !used.current) {
      used.current = true
      useGameStore.getState().questEvent('reach', targetId)
      onFirst?.()
    }
  })

  // 상호작용 후보 등록. reach 는 다가가는 것만으로 끝나므로 등록하지 않습니다 —
  // 등록하면 옆에 있는 진짜 대상의 차례를 뺏습니다.
  const fire = useRef<() => void>(() => {})
  fire.current = () => {
    const s = useGameStore.getState()
    if (!once || !used.current) {
      used.current = true
      s.questEvent(kind === 'reach' ? 'reach' : kind, targetId)
      onFirst?.()
    }
    if (title) s.showDialogue([{ speaker: title, text: body ?? '' }])
  }
  useEffect(() => {
    if (kind === 'reach') return
    return addTarget({ x, z, range, run: () => fire.current() })
  }, [x, z, range, kind])

  return (
    <group ref={root} position={[x, y, z]}>
      {children}
      {inRange && (
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[range - 0.12, range, 28]} />
          <meshBasicMaterial color={PALETTE.questGold} transparent opacity={0.34} />
        </mesh>
      )}
    </group>
  )
}
