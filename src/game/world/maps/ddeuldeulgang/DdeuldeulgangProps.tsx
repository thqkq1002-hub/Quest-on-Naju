import { Html, Instance, Instances } from '@react-three/drei'
import { PALETTE } from '@/lib/palette'
import { BENCHES, LAYOUT, PINES, REEDS, RIVER } from './layout'

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

/**
 * 정자 — 답사 영상 속 솔밭 한가운데 트인 잔디밭에 선 육각 정자.
 * 기둥 사이로 걸어 들어가 마루에 올라 쉴 수 있습니다.
 */
export function Pavilion() {
  const { x, z, r, h } = LAYOUT.pavilion
  const posts = Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2
    return [Math.cos(a) * (r - 0.3), Math.sin(a) * (r - 0.3)] as const
  })
  return (
    <group position={[x, 0, z]}>
      {/* 마루 — 한 단 높인 육각 나무 바닥 */}
      <mesh position={[0, 0.22, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow castShadow>
        <cylinderGeometry args={[r, r, 0.44, 6]} />
        <meshLambertMaterial color={PALETTE.litHallWood} flatShading />
      </mesh>
      {/* 기둥 여섯 */}
      <Instances limit={6}>
        <cylinderGeometry args={[0.14, 0.16, h, 6]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
        {posts.map(([px, pz], i) => (
          <Instance key={i} position={[px, 0.44 + h / 2, pz]} />
        ))}
      </Instances>
      {/* 난간 — 마루 둘레를 낮게 두릅니다 */}
      <Instances limit={6}>
        <boxGeometry args={[r * 0.95, 0.5, 0.08]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
        {posts.map((_, i) => {
          const a = (i / 6) * Math.PI * 2 + Math.PI / 6
          return (
            <Instance
              key={i}
              position={[Math.cos(a) * (r - 0.3), 0.7, Math.sin(a) * (r - 0.3)]}
              rotation={[0, -a + Math.PI / 2, 0]}
            />
          )
        })}
      </Instances>
      {/* 육각 기와지붕 — 겹처마를 두 단으로 표현 */}
      <mesh position={[0, 0.44 + h + 0.5, 0]} castShadow>
        <coneGeometry args={[r + 1.1, 1.1, 6]} />
        <meshLambertMaterial color={PALETTE.tileRoof} flatShading />
      </mesh>
      <mesh position={[0, 0.44 + h + 1.3, 0]} castShadow>
        <coneGeometry args={[r * 0.55, 0.9, 6]} />
        <meshLambertMaterial color={PALETTE.tileRoofLight} flatShading />
      </mesh>
      <mesh position={[0, 0.44 + h + 1.85, 0]}>
        <sphereGeometry args={[0.12, 6, 6]} />
        <meshLambertMaterial color={PALETTE.dragonGold} flatShading />
      </mesh>
      <Html position={[0, 0.44 + h + 2.6, 0]} center distanceFactor={48} zIndexRange={[10, 0]}>
        <div
          style={{
            whiteSpace: 'nowrap',
            color: '#22402c',
            fontSize: 20,
            fontWeight: 700,
            textShadow: '0 1px 6px rgba(240,255,244,.8)',
            pointerEvents: 'none',
          }}
        >
          정자
        </div>
      </Html>
    </group>
  )
}

/** 산책로 벤치 하나 — 나무 판 좌판 + 등받이 */
function Bench({ x, z, rotY }: { x: number; z: number; rotY: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      <mesh position={[0, 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, 0.08, 0.5]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
      </mesh>
      <mesh position={[0, 0.72, -0.22]} castShadow>
        <boxGeometry args={[1.6, 0.5, 0.06]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
      </mesh>
      {[-0.65, 0.65].map((dx) => (
        <mesh key={dx} position={[dx, 0.2, 0]} castShadow>
          <boxGeometry args={[0.1, 0.4, 0.46]} />
          <meshLambertMaterial color={PALETTE.stoneDark} flatShading />
        </mesh>
      ))}
    </group>
  )
}

/** 산책로를 따라 놓인 쉼터 벤치들 */
export function Benches() {
  return (
    <>
      {BENCHES.map(([x, z, rotY], i) => (
        <Bench key={i} x={x} z={z} rotY={rotY} />
      ))}
    </>
  )
}

/** 강가 갈대 한 무리 — 가는 잎 여러 장을 부채꼴로 세웁니다 */
function ReedClump({ x, z, s }: { x: number; z: number; s: number }) {
  const blades = [-0.3, -0.1, 0.1, 0.3]
  return (
    <group position={[x, 0, z]} scale={s}>
      {blades.map((dx, i) => (
        <mesh key={dx} position={[dx, 0.55, 0]} rotation={[0, 0, dx * 0.6]} castShadow>
          <coneGeometry args={[0.05, 1.1 + (i % 2) * 0.3, 4]} />
          <meshLambertMaterial color={i % 2 ? PALETTE.pineMid : PALETTE.grassDark} flatShading />
        </mesh>
      ))}
    </group>
  )
}

/** 강가를 따라 흩어진 갈대 무리 전체 */
export function Reeds() {
  return (
    <>
      {REEDS.map(([x, z, s], i) => (
        <ReedClump key={i} x={x} z={z} s={s} />
      ))}
    </>
  )
}
