import { Html, Instance, Instances } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { PALETTE } from '@/lib/palette'
import { BOAT_ROUTE, LAYOUT, RIVER, STREET_TREES } from './layout'

/**
 * 영산포 조형물 — 근대문화유산 거리 + 홍어거리.
 *
 * 세 구역을 색으로 구분합니다: 역사갤러리는 짙은 근대 벽돌, 문학관은
 * 영산강을 닮은 청록 지붕, 홍어거리는 시장 특유의 원색 차양.
 * → layout.ts 상단 고증 메모.
 */

/** 영산강 — 거리 북쪽을 동서로 가로지릅니다 */
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

/**
 * 나루터 — 문학관에서 강가로 내려가는 나무 선착장. 흑산도 홍어도,
 * 영산강 수운도 결국 이 자리에서 배를 내리고 실었습니다.
 * 강이 동서로 흐르는 영산포에서는 나루터가 남북으로 뻗어 강 안쪽까지
 * 걸칩니다 — 다시면 나루터(강이 남북으로 흐름)와는 축이 90도 다릅니다.
 */
export function Wharf() {
  const { x: px, nearZ, farZ, w: width } = LAYOUT.wharf
  const length = Math.abs(nearZ - farZ)
  const cz = (nearZ + farZ) / 2

  return (
    <group position={[px, 0, cz]}>
      {/* 나무 갑판 */}
      <mesh position={[0, 0.14, 0]} receiveShadow castShadow>
        <boxGeometry args={[width, 0.14, length]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
      </mesh>
      {/* 널빤지 이음매 — 길이 방향 줄무늬로 암시 */}
      {[-4, -1.3, 1.3, 4].map((dx) => (
        <mesh key={dx} position={[dx, 0.22, 0]}>
          <boxGeometry args={[0.12, 0.02, length - 0.4]} />
          <meshLambertMaterial color={PALETTE.boatHullDark} flatShading />
        </mesh>
      ))}
      {/* 계류주 — 배를 매어 두는 기둥 4개 */}
      {[
        [width / 2 - 1.2, length / 2 - 1.2],
        [-(width / 2 - 1.2), length / 2 - 1.2],
        [width / 2 - 1.2, -(length / 2 - 1.2)],
        [-(width / 2 - 1.2), -(length / 2 - 1.2)],
      ].map(([dx, dz], i) => (
        <mesh key={i} position={[dx, 0.55, dz]} castShadow>
          <cylinderGeometry args={[0.13, 0.15, 0.9, 6]} />
          <meshLambertMaterial color={PALETTE.boatHullDark} flatShading />
        </mesh>
      ))}
      <Html position={[0, 0.5, length / 2 + 1.6]} center distanceFactor={30} zIndexRange={[10, 0]}>
        <div
          style={{
            whiteSpace: 'nowrap',
            color: '#243038',
            fontSize: 22,
            fontWeight: 700,
            textShadow: '0 1px 6px rgba(255,255,255,.75)',
            pointerEvents: 'none',
          }}
        >
          나루터
        </div>
      </Html>
    </group>
  )
}

/**
 * 황포돛배 — 영산강 뱃길을 오가던 전통 배. 영산포는 실제 이 뱃길의
 * 종착 나루였던 곳이라, 강 위를 동서로 천천히 왕복합니다.
 */
export function HwangpoBoat() {
  const group = useRef<Group>(null)
  const sail = useRef<Group>(null)
  const bandZ = (RIVER.zFrom + RIVER.zTo) / 2

  useFrame(({ clock }) => {
    const g = group.current
    if (!g) return
    const t = clock.elapsedTime
    const { xFrom, xTo, period } = BOAT_ROUTE
    const mid = (xFrom + xTo) / 2
    const half = (xTo - xFrom) / 2
    const phase = (t / period) * Math.PI * 2
    g.position.set(mid + Math.sin(phase) * half, 0.15 + Math.sin(t * 1.4) * 0.06, bandZ)
    g.rotation.y = (Math.cos(phase) < 0 ? Math.PI : 0) + Math.PI / 2
    if (sail.current) sail.current.rotation.z = Math.sin(t * 0.9) * 0.05
  })

  return (
    <group ref={group}>
      {/* 선체 — 긴 축이 이동 방향(X)과 나란하도록 90도 돌려 둡니다 */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2.4, 1, 8]} />
        <meshLambertMaterial color={PALETTE.boatHull} flatShading />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[2.7, 0.3, 8.3]} />
        <meshLambertMaterial color={PALETTE.boatHullDark} flatShading />
      </mesh>
      {/* 이물 · 고물 */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0, 0.85, side * 4.3]} rotation={[side * 0.5, 0, 0]} castShadow>
          <boxGeometry args={[2.2, 0.7, 1.4]} />
          <meshLambertMaterial color={PALETTE.boatHull} flatShading />
        </mesh>
      ))}
      {/* 돛대 */}
      <mesh position={[0, 3, -0.5]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 5, 6]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
      </mesh>
      {/* 돛 — 황포(黃布) */}
      <group ref={sail} position={[0, 3.6, -0.5]}>
        <mesh position={[0, 0, 0.05]} castShadow>
          <planeGeometry args={[2.4, 3]} />
          <meshLambertMaterial color={PALETTE.sail} side={2} />
        </mesh>
        {[0.9, 0, -0.9].map((y) => (
          <mesh key={y} position={[0, y, 0.07]}>
            <boxGeometry args={[2.4, 0.08, 0.02]} />
            <meshLambertMaterial color={PALETTE.sailDark} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  )
}

/** 근대식 평지붕 — 처마 없이 수평으로 두른 콘크리트 지붕 */
function FlatRoof({ w, d, y, color }: { w: number; d: number; y: number; color: string }) {
  return (
    <mesh position={[0, y, 0]} castShadow>
      <boxGeometry args={[w + 0.8, 0.4, d + 0.8]} />
      <meshLambertMaterial color={color} flatShading />
    </mesh>
  )
}

/**
 * [구역 1] 영산포 역사갤러리 (구 조선식산은행 건물) — 짙은 벽돌 2층 근대 건축.
 * 은행다운 위엄이 느껴지도록 창을 작고 촘촘하게 줄지어 넣었습니다.
 */
export function HistoryGallery() {
  const g = LAYOUT.gallery
  return (
    <group position={[g.x, 0, g.z]}>
      <mesh position={[0, g.h * 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[g.w, g.h, g.d]} />
        <meshLambertMaterial color={PALETTE.modernBrick} flatShading />
      </mesh>
      {/* 밑단 — 살짝 짙게, 건물이 땅에 붙어 보이도록 */}
      <mesh position={[0, 0.5, g.d / 2 + 0.02]} castShadow>
        <boxGeometry args={[g.w, 1, 0.06]} />
        <meshLambertMaterial color={PALETTE.modernBrickDark} flatShading />
      </mesh>
      {/* 창 — 작고 촘촘하게 두 줄 */}
      <Instances limit={12}>
        <boxGeometry args={[0.9, 1.1, 0.05]} />
        <meshLambertMaterial color={PALETTE.windowGlass} flatShading />
        {[2.4, 4.6].map((y) =>
          [-5, -2.6, -0.2, 2.2, 4.6].map((x) => (
            <Instance key={`${x},${y}`} position={[x, y, g.d / 2 + 0.03]} />
          )),
        )}
      </Instances>
      <FlatRoof w={g.w} d={g.d} y={g.h + 0.2} color={PALETTE.modernRoof} />
      {/* 정문 계단 */}
      <mesh position={[0, 0.3, g.d / 2 + 1.4]} receiveShadow castShadow>
        <boxGeometry args={[3.2, 0.6, 2.4]} />
        <meshLambertMaterial color={PALETTE.stone} flatShading />
      </mesh>
    </group>
  )
}

/**
 * [구역 2] 타오르는 강 문학관 — 나지막한 목재 건물에 청록빛 박공지붕.
 * 문순태의 소설과 영산강 수운 역사를 소개하는 자리라, 갤러리보다
 * 밝고 정갈한 인상을 줍니다.
 */
export function LiteratureHall() {
  const l = LAYOUT.literature
  return (
    <group position={[l.x, 0, l.z]}>
      <mesh position={[0, l.h * 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[l.w, l.h * 0.72, l.d]} />
        <meshLambertMaterial color={PALETTE.litHallWood} flatShading />
      </mesh>
      {/* 통유리 정면 */}
      <mesh position={[0, l.h * 0.42, l.d / 2 + 0.03]}>
        <boxGeometry args={[l.w * 0.6, l.h * 0.5, 0.04]} />
        <meshLambertMaterial color={PALETTE.windowGlass} flatShading />
      </mesh>
      {/* 박공지붕 — 삼각 단면 */}
      <mesh position={[0, l.h * 0.86, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[l.w * 0.72, l.h * 0.5, 4]} />
        <meshLambertMaterial color={PALETTE.litHallRoof} flatShading />
      </mesh>
      {/* 강가 산책로 느낌의 낮은 데크 */}
      <mesh position={[0, 0.14, l.d / 2 + 1.6]} receiveShadow castShadow>
        <boxGeometry args={[l.w * 0.8, 0.28, 3]} />
        <meshLambertMaterial color={PALETTE.litHallWood} flatShading />
      </mesh>
    </group>
  )
}

/** 좌판 하나 — 차양 + 좌판대 + 매달린 홍어(말린 생선 실루엣) */
function HongeoStall({ x, z, awning }: { x: number; z: number; awning: string }) {
  return (
    <group position={[x, 0, z]}>
      {/* 기둥 넷 */}
      {[
        [-1.6, -1.1],
        [1.6, -1.1],
        [-1.6, 1.1],
        [1.6, 1.1],
      ].map(([px, pz]) => (
        <mesh key={`${px},${pz}`} position={[px, 1.1, pz]} castShadow>
          <cylinderGeometry args={[0.07, 0.07, 2.2, 6]} />
          <meshLambertMaterial color={PALETTE.trunk} flatShading />
        </mesh>
      ))}
      {/* 차양 지붕 */}
      <mesh position={[0, 2.3, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[2.6, 0.9, 4]} />
        <meshLambertMaterial color={awning} flatShading />
      </mesh>
      {/* 좌판대 */}
      <mesh position={[0, 0.75, 0]} castShadow receiveShadow>
        <boxGeometry args={[3, 0.14, 2]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
      </mesh>
      {/* 매달아 말리는 홍어 — 납작한 마름모 실루엣 셋 */}
      {[-0.9, 0, 0.9].map((dx, i) => (
        <mesh key={dx} position={[dx, 1.6, -0.8]} rotation={[0, 0, i % 2 ? 0.15 : -0.15]} castShadow>
          <boxGeometry args={[0.6, 0.4, 0.04]} />
          <meshLambertMaterial color={PALETTE.driedFish} flatShading />
        </mesh>
      ))}
    </group>
  )
}

/** [구역 3] 영산포 홍어거리 — 좌판 셋이 늘어선 짧은 시장 골목 */
export function HongeoStreet() {
  const awnings = [PALETTE.steelRed, PALETTE.steelBlue, PALETTE.steelYellow]
  return (
    <>
      {LAYOUT.hongeoStalls.map((s, i) => (
        <HongeoStall key={s.x} x={s.x} z={s.z} awning={awnings[i % awnings.length]} />
      ))}
    </>
  )
}

/** 거리를 두르는 가로수 — 근대 거리 느낌의 밝은 활엽수 */
export function StreetTrees() {
  return (
    <>
      <Instances limit={STREET_TREES.length}>
        <cylinderGeometry args={[0.22, 0.28, 1.8, 6]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
        {STREET_TREES.map(([x, z, s], i) => (
          <Instance key={i} position={[x, 0.9 * s, z]} scale={s} />
        ))}
      </Instances>
      <Instances limit={STREET_TREES.length}>
        <icosahedronGeometry args={[1.8, 0]} />
        <meshLambertMaterial color={PALETTE.broadleaf} flatShading />
        {STREET_TREES.map(([x, z, s], i) => (
          <Instance key={i} position={[x, 2.6 * s, z]} scale={s} />
        ))}
      </Instances>
    </>
  )
}
