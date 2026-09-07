import { PALETTE } from '@/lib/palette'
import { LAYOUT, PINES, RIVER } from './layout'

/**
 * 드들강 솔밭유원지 조형물 — 소나무 숲, 강, 안성현 선생 노래비.
 * → layout.ts 상단 고증 메모.
 */

/** 드들강 — 솔밭 북쪽을 동서로 흐릅니다 */
export function River() {
  const { xFrom, xTo, zFrom, zTo } = RIVER
  const width = xTo - xFrom
  const depth = zTo - zFrom
  const midX = (xFrom + xTo) / 2
  const midZ = (zFrom + zTo) / 2
  return (
    <group position={[midX, 0, midZ]}>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, depth]} />
        <meshLambertMaterial color={PALETTE.river} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width, depth * 0.4]} />
        <meshLambertMaterial color={PALETTE.riverDark} />
      </mesh>
    </group>
  )
}

/** 소나무 한 그루 — 둥근 수관 두 단, 다시면 향나무보다 짙은 상록수 실루엣 */
function Pine({ x, z, scale }: { x: number; z: number; scale: number }) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.24, 2.2, 6]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
      </mesh>
      <mesh position={[0, 2.6, 0]} castShadow>
        <coneGeometry args={[1.5, 2.6, 7]} />
        <meshLambertMaterial color={PALETTE.pineDark} flatShading />
      </mesh>
      <mesh position={[0, 3.7, 0]} castShadow>
        <coneGeometry args={[1.05, 2.0, 7]} />
        <meshLambertMaterial color={PALETTE.pineMid} flatShading />
      </mesh>
    </group>
  )
}

/** 솔밭 전체 — 인스턴싱으로 draw call을 아낍니다 */
export function PineForest() {
  return (
    <>
      {PINES.map(([x, z, s], i) => (
        <Pine key={i} x={x} z={z} scale={s} />
      ))}
    </>
  )
}

/**
 * 안성현 선생 노래비 — 돌 받침 위에 세운 비석. 앞면에 <엄마야 누나야>
 * 한 소절을 새긴 검은 명판을 넣어, 노래비라는 걸 한눈에 알아보게 합니다.
 */
export function Songbi() {
  const { x, z } = LAYOUT.songbi
  return (
    <group position={[x, 0, z]}>
      {/* 받침 */}
      <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
        <boxGeometry args={[2.6, 0.6, 1.6]} />
        <meshLambertMaterial color={PALETTE.stone} flatShading />
      </mesh>
      {/* 비석 몸체 */}
      <mesh position={[0, 1.7, 0]} castShadow>
        <boxGeometry args={[1.6, 2.4, 0.5]} />
        <meshLambertMaterial color={PALETTE.stoneDark} flatShading />
      </mesh>
      {/* 명판 — 새겨진 가사 한 소절을 암시 */}
      <mesh position={[0, 1.8, 0.26]}>
        <boxGeometry args={[1.2, 1.3, 0.03]} />
        <meshLambertMaterial color="#1c1a16" flatShading />
      </mesh>
      {/* 비석 머리 — 둥글게 다듬은 정상부 */}
      <mesh position={[0, 3.05, 0]} castShadow>
        <cylinderGeometry args={[0.82, 0.82, 0.35, 3]} />
        <meshLambertMaterial color={PALETTE.stoneDark} flatShading />
      </mesh>
    </group>
  )
}
