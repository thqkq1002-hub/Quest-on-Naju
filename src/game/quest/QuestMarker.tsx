import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { PALETTE } from '@/lib/palette'

/**
 * 퀘스트 표시.
 *
 * WoW의 시각 문법을 그대로 씁니다 — 설명 없이 누구나 이해합니다.
 * 폰트 에셋 없이 박스로 만듭니다. 한글 폰트를 3D로 끌어오면 로딩이
 * 무거워지는데, `!` 하나 때문에 그럴 이유가 없습니다.
 *
 * 금색 `!` = 수락 가능 / 금색 `?` = 보상 받기 / 회색 = 아직 못 받음
 * → docs/02-GAME-DESIGN.md 2.1
 */
export type MarkerKind = 'offer' | 'turnIn' | 'locked'

export function QuestMarker({ y = 3.0, kind = 'offer' }: { y?: number; kind?: MarkerKind }) {
  const group = useRef<Group>(null)

  useFrame(({ clock }) => {
    if (!group.current) return
    // 위아래로 천천히 — 멀리서도 눈에 걸리게 만드는 건 움직임입니다
    group.current.position.y = y + Math.sin(clock.elapsedTime * 2) * 0.18
    group.current.rotation.y = clock.elapsedTime * 1.2
  })

  const color = kind === 'locked' ? PALETTE.questGoldDim : PALETTE.questGold

  return (
    <group ref={group} position={[0, y, 0]}>
      {kind === 'turnIn' ? (
        // 물음표 — 갈고리를 짧은 막대 셋으로 세웁니다
        <>
          <mesh position={[0, 0.42, 0]} castShadow>
            <boxGeometry args={[0.5, 0.22, 0.24]} />
            <meshBasicMaterial color={color} />
          </mesh>
          <mesh position={[0.19, 0.19, 0]} castShadow>
            <boxGeometry args={[0.22, 0.36, 0.24]} />
            <meshBasicMaterial color={color} />
          </mesh>
          <mesh position={[0, 0.02, 0]} castShadow>
            <boxGeometry args={[0.42, 0.22, 0.24]} />
            <meshBasicMaterial color={color} />
          </mesh>
          <mesh position={[0, -0.22, 0]} castShadow>
            <boxGeometry args={[0.22, 0.28, 0.24]} />
            <meshBasicMaterial color={color} />
          </mesh>
          <mesh position={[0, -0.62, 0]} castShadow>
            <boxGeometry args={[0.24, 0.24, 0.24]} />
            <meshBasicMaterial color={color} />
          </mesh>
        </>
      ) : (
        <>
          {/* 느낌표 몸통 */}
          <mesh castShadow>
            <boxGeometry args={[0.26, 0.95, 0.26]} />
            <meshBasicMaterial color={color} />
          </mesh>
          {/* 느낌표 점 */}
          <mesh position={[0, -0.72, 0]} castShadow>
            <boxGeometry args={[0.26, 0.26, 0.26]} />
            <meshBasicMaterial color={color} />
          </mesh>
        </>
      )}
    </group>
  )
}
