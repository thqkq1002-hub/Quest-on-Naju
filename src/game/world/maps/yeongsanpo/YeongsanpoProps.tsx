import { Html, Instance, Instances } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { PALETTE } from '@/lib/palette'
import { BACKGROUND_HOUSES, BOAT_ROUTE, GARDEN_ROCKS, LAYOUT, RIVER, STREET_TREES } from './layout'

/**
 * 영산포 조형물 — 근대문화유산 거리 + 홍어거리.
 *
 * 세 구역을 색으로 구분합니다: 역사갤러리는 짙은 근대 벽돌, 문학관은
 * 영산강을 닮은 청록 지붕, 홍어거리는 시장 특유의 원색 차양.
 * → layout.ts 상단 고증 메모.
 */

const label: React.CSSProperties = {
  whiteSpace: 'nowrap',
  color: '#243038',
  fontSize: 22,
  fontWeight: 700,
  textShadow: '0 1px 6px rgba(255,255,255,.75)',
  pointerEvents: 'none',
}

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

/** 좌판 하나 — 차양 + 좌판대 + 매달린 홍어(말린 생선 실루엣) + 상호 간판 */
function HongeoStall({ x, z, awning, name }: { x: number; z: number; awning: string; name: string }) {
  return (
    <group position={[x, 0, z]}>
      <Html position={[0, 2.9, 0]} center distanceFactor={40} zIndexRange={[10, 0]}>
        <div
          style={{
            whiteSpace: 'nowrap',
            color: '#fff',
            background: 'rgba(40,30,26,.55)',
            padding: '2px 8px',
            borderRadius: 6,
            fontSize: 14,
            fontWeight: 700,
            pointerEvents: 'none',
          }}
        >
          {name}
        </div>
      </Html>
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
        <HongeoStall key={s.x} x={s.x} z={s.z} awning={awnings[i % awnings.length]} name={s.name} />
      ))}
    </>
  )
}

/**
 * 영산포 등대 — 선착장 옆에서 배를 인도하던 흰 등대. 삼각 콘크리트 받침,
 * 목재 울타리, 위층 붉은 띠, 꼭대기 유리 등롱 순서로 실제 등대의 실루엣을 따릅니다.
 */
export function Lighthouse() {
  const { x, z, h } = LAYOUT.lighthouse
  return (
    <group position={[x, 0, z]}>
      {/* 삼각 콘크리트 받침 */}
      <mesh position={[0, 0.35, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[1.5, 1.9, 0.7, 3]} />
        <meshLambertMaterial color={PALETTE.stoneDark} flatShading />
      </mesh>
      {/* 목재 울타리 — 받침을 두르는 낮은 기둥 6개 */}
      <Instances limit={6}>
        <cylinderGeometry args={[0.05, 0.05, 0.6, 5]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2
          return <Instance key={i} position={[Math.cos(a) * 1.7, 0.6, Math.sin(a) * 1.7]} />
        })}
      </Instances>
      {/* 등탑 몸체 — 위로 갈수록 좁아집니다 */}
      <mesh position={[0, 0.7 + h * 0.42, 0]} castShadow>
        <cylinderGeometry args={[0.62, 0.95, h * 0.84, 10]} />
        <meshLambertMaterial color={PALETTE.lighthouseWhite} flatShading />
      </mesh>
      {/* 상부 붉은 띠 */}
      <mesh position={[0, 0.7 + h * 0.72, 0]}>
        <cylinderGeometry args={[0.66, 0.7, h * 0.16, 10]} />
        <meshLambertMaterial color={PALETTE.lighthouseRed} flatShading />
      </mesh>
      {/* 상부 가로 금속 난간 */}
      <mesh position={[0, 0.7 + h * 0.82, 0]}>
        <cylinderGeometry args={[0.72, 0.72, 0.08, 10]} />
        <meshLambertMaterial color="#3a3a3a" flatShading />
      </mesh>
      {/* 유리 등롱 + 지붕 */}
      <mesh position={[0, 0.7 + h * 0.92, 0]} castShadow>
        <cylinderGeometry args={[0.5, 0.5, h * 0.16, 8]} />
        <meshLambertMaterial color={PALETTE.windowGlass} flatShading />
      </mesh>
      <mesh position={[0, 0.7 + h * 1.02, 0]} castShadow>
        <coneGeometry args={[0.6, 0.45, 8]} />
        <meshLambertMaterial color={PALETTE.lighthouseRed} flatShading />
      </mesh>
      {/* 은은한 등대 불빛 */}
      <pointLight position={[0, 0.7 + h * 0.92, 0]} color="#fff3c4" intensity={0.8} distance={14} />
      <Html position={[0, 0.7 + h + 1.1, 0]} center distanceFactor={50} zIndexRange={[10, 0]}>
        <div style={label}>영산포 등대</div>
      </Html>
    </group>
  )
}

/** 황포돛배 승선 매표소 — 작은 목조 부스 + 차양 + 매표창 */
export function WharfBooth() {
  const { x, z } = LAYOUT.wharfBooth
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1, 0]} castShadow receiveShadow>
        <boxGeometry args={[2.2, 2, 1.6]} />
        <meshLambertMaterial color={PALETTE.litHallWood} flatShading />
      </mesh>
      {/* 매표창 */}
      <mesh position={[0, 1.15, 0.81]}>
        <boxGeometry args={[1.2, 0.7, 0.04]} />
        <meshLambertMaterial color={PALETTE.windowGlass} flatShading />
      </mesh>
      {/* 앞으로 뻗은 차양 */}
      <mesh position={[0, 2.15, 1.1]} rotation={[0.25, 0, 0]} castShadow>
        <boxGeometry args={[2.6, 0.1, 1.4]} />
        <meshLambertMaterial color={PALETTE.steelBlue} flatShading />
      </mesh>
      <Html position={[0, 2.7, 0]} center distanceFactor={44} zIndexRange={[10, 0]}>
        <div style={{ ...label, fontSize: 15 }}>매표소</div>
      </Html>
    </group>
  )
}

/**
 * 죽전골목 초입의 노포 "삼화홍어" — 흰 정면과 붉은 벽돌 측면이 만나는
 * 랜드마크 상점. 높은 창, 앞으로 뻗은 차양, 건물 모서리의 작은 등대
 * 장식까지 실제 거리 사진에서 확인되는 특징을 옮겼습니다.
 */
export function SamhwaHongeo() {
  const s = LAYOUT.samhwa
  return (
    <group position={[s.x, 0, s.z]}>
      {/* 흰 정면 */}
      <mesh position={[0, s.h * 0.5, s.d * 0.22]} castShadow receiveShadow>
        <boxGeometry args={[s.w, s.h, s.d * 0.56]} />
        <meshLambertMaterial color={PALETTE.riverHouseWall} flatShading />
      </mesh>
      {/* 붉은 벽돌 측면 */}
      <mesh position={[0, s.h * 0.5, -s.d * 0.22]} castShadow receiveShadow>
        <boxGeometry args={[s.w, s.h, s.d * 0.56]} />
        <meshLambertMaterial color={PALETTE.modernBrick} flatShading />
      </mesh>
      {/* 높은 창 두 짝 */}
      {[-s.w * 0.24, s.w * 0.24].map((dx) => (
        <mesh key={dx} position={[dx, s.h * 0.56, s.d / 2 + 0.03]}>
          <boxGeometry args={[s.w * 0.28, s.h * 0.5, 0.05]} />
          <meshLambertMaterial color={PALETTE.windowGlass} flatShading />
        </mesh>
      ))}
      {/* 앞으로 뻗은 차양 */}
      <mesh position={[0, s.h * 0.72, s.d / 2 + 0.9]} rotation={[0.22, 0, 0]} castShadow>
        <boxGeometry args={[s.w * 0.86, 0.1, 1.8]} />
        <meshLambertMaterial color={PALETTE.steelRed} flatShading />
      </mesh>
      <FlatRoof w={s.w} d={s.d} y={s.h + 0.2} color={PALETTE.modernRoof} />
      {/* 모서리의 작은 등대 장식 — 실제 상호 건물 모서리 디테일 */}
      <mesh position={[s.w / 2 - 0.35, s.h + 0.9, -s.d / 2 + 0.35]} castShadow>
        <cylinderGeometry args={[0.22, 0.3, 1.4, 8]} />
        <meshLambertMaterial color={PALETTE.lighthouseWhite} flatShading />
      </mesh>
      <mesh position={[s.w / 2 - 0.35, s.h + 1.7, -s.d / 2 + 0.35]}>
        <coneGeometry args={[0.28, 0.3, 8]} />
        <meshLambertMaterial color={PALETTE.lighthouseRed} flatShading />
      </mesh>
      <Html position={[0, s.h + 0.6, s.d / 2 + 0.3]} center distanceFactor={48} zIndexRange={[10, 0]}>
        <div style={label}>삼화홍어</div>
      </Html>
      {/* "죽전골목" 방향 표시 — 건물 옆 골목 초입 */}
      <Html position={[-s.w / 2 - 0.6, 2, -s.d / 2 - 0.6]} center distanceFactor={40} zIndexRange={[10, 0]}>
        <div
          style={{
            whiteSpace: 'nowrap',
            color: '#fff',
            background: 'rgba(40,30,26,.6)',
            padding: '2px 8px',
            borderRadius: 6,
            fontSize: 13,
            fontWeight: 700,
            pointerEvents: 'none',
          }}
        >
          ← 죽전골목
        </div>
      </Html>
    </group>
  )
}

/** 거리 이름표 하나 — 낮은 기둥 + 세로 팻말 */
function StreetSign({ x, z, rotY, name }: { x: number; z: number; rotY: number; name: string }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, 1.8, 6]} />
        <meshLambertMaterial color="#8a8f92" flatShading />
      </mesh>
      <mesh position={[0, 1.55, 0]} castShadow>
        <boxGeometry args={[1.3, 0.34, 0.05]} />
        <meshLambertMaterial color={PALETTE.steelBlue} flatShading />
      </mesh>
      <Html position={[0, 1.55, 0.04]} center distanceFactor={26} zIndexRange={[10, 0]}>
        <div style={{ color: '#fff', fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap', pointerEvents: 'none' }}>
          {name}
        </div>
      </Html>
    </group>
  )
}

/** 등대길·선창길·영산3길 이름표 */
export function StreetSigns() {
  return (
    <>
      {LAYOUT.streetSigns.map((s) => (
        <StreetSign key={s.name} x={s.x} z={s.z} rotY={s.rotY} name={s.name} />
      ))}
    </>
  )
}

/** 기와 지붕 민가 한 채 — 배경용 저층 주택 */
function TileHouse({ w, d, h }: { w: number; d: number; h: number }) {
  return (
    <>
      <mesh position={[0, h * 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h * 0.8, d]} />
        <meshLambertMaterial color={PALETTE.village} flatShading />
      </mesh>
      <mesh position={[0, h * 0.5, d / 2 + 0.03]}>
        <boxGeometry args={[w * 0.4, h * 0.4, 0.04]} />
        <meshLambertMaterial color={PALETTE.windowGlass} flatShading />
      </mesh>
      <mesh position={[0, h * 0.95, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[Math.max(w, d) * 0.72, h * 0.4, 4]} />
        <meshLambertMaterial color={PALETTE.tileRoof} flatShading />
      </mesh>
    </>
  )
}

/** 파란 지붕 창고 한 채 — 긴 박공지붕 + 큰 금속문 */
function BlueRoofHouse({ w, d, h }: { w: number; d: number; h: number }) {
  return (
    <>
      <mesh position={[0, h * 0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h * 0.8, d]} />
        <meshLambertMaterial color={PALETTE.riverHouseWall} flatShading />
      </mesh>
      {/* 큰 금속문 */}
      <mesh position={[0, h * 0.3, d / 2 + 0.03]}>
        <boxGeometry args={[w * 0.5, h * 0.5, 0.04]} />
        <meshLambertMaterial color="#5a6068" flatShading />
      </mesh>
      {/* 높은 환기창 */}
      <mesh position={[0, h * 0.72, d / 2 + 0.03]}>
        <boxGeometry args={[w * 0.7, h * 0.16, 0.03]} />
        <meshLambertMaterial color={PALETTE.windowGlass} flatShading />
      </mesh>
      <mesh position={[0, h * 0.98, 0]} rotation={[0, Math.PI / 2, 0]} castShadow>
        <cylinderGeometry args={[0, Math.max(w, d) * 0.42, h * 0.44, 4, 1]} />
        <meshLambertMaterial color={PALETTE.warehouseRoof} flatShading />
      </mesh>
    </>
  )
}

/** 외부 계단이 달린 흰 2층 주택 — 크림빛 담장, 작은 기와 출입문, 대나무를 곁들입니다 */
function White2fHouse({ w, d, h }: { w: number; d: number; h: number }) {
  return (
    <>
      <mesh position={[0, h * 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshLambertMaterial color={PALETTE.riverHouseWall} flatShading />
      </mesh>
      {/* 2층 창 줄 */}
      <Instances limit={3}>
        <boxGeometry args={[0.7, 0.8, 0.04]} />
        <meshLambertMaterial color={PALETTE.windowGlass} flatShading />
        {[-w * 0.28, 0, w * 0.28].map((dx) => (
          <Instance key={dx} position={[dx, h * 0.68, d / 2 + 0.03]} />
        ))}
      </Instances>
      {/* 외부 계단 */}
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[w / 2 + 0.5, 0.15 + i * 0.24, d / 2 - 1.2 + i * 0.42]} castShadow>
          <boxGeometry args={[0.9, 0.15, 0.42]} />
          <meshLambertMaterial color={PALETTE.stoneDark} flatShading />
        </mesh>
      ))}
      {/* 평지붕 */}
      <mesh position={[0, h + 0.15, 0]} castShadow>
        <boxGeometry args={[w + 0.4, 0.3, d + 0.4]} />
        <meshLambertMaterial color={PALETTE.concreteDark} flatShading />
      </mesh>
      {/* 크림빛 담장 + 작은 기와 출입문 */}
      <mesh position={[0, 0.5, d / 2 + 1.6]} castShadow>
        <boxGeometry args={[w * 0.9, 1, 0.14]} />
        <meshLambertMaterial color={PALETTE.riverHouseFence} flatShading />
      </mesh>
      <mesh position={[0, 1.05, d / 2 + 1.6]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[0.9, 0.5, 4]} />
        <meshLambertMaterial color={PALETTE.tileRoof} flatShading />
      </mesh>
      {/* 대나무 무리 */}
      <Instances limit={5}>
        <cylinderGeometry args={[0.05, 0.06, 3, 6]} />
        <meshLambertMaterial color={PALETTE.bamboo} flatShading />
        {[-0.6, -0.3, 0, 0.3, 0.6].map((dx, i) => (
          <Instance key={dx} position={[-w / 2 - 0.8, 1.5, dx + (i % 2 ? 0.3 : -0.3)]} />
        ))}
      </Instances>
    </>
  )
}

/**
 * 배경 민가 — 강변 거리에서 확인되는 파란 지붕 창고, 기와 민가, 외부 계단이 달린
 * 흰 2층 주택을 재구성한 배경 건물입니다. → layout.ts BACKGROUND_HOUSES
 */
export function BackgroundHouses() {
  return (
    <>
      {BACKGROUND_HOUSES.map((h, i) => (
        <group key={i} position={[h.x, 0, h.z]}>
          {h.roof === 'blue' && <BlueRoofHouse w={h.w} d={h.d} h={h.h} />}
          {h.roof === 'tile' && <TileHouse w={h.w} d={h.d} h={h.h} />}
          {h.roof === 'white2f' && <White2fHouse w={h.w} d={h.d} h={h.h} />}
        </group>
      ))}
    </>
  )
}

/** 타오르는 강 문학관 앞 돌·자갈 정원 */
export function GardenRocks() {
  return (
    <Instances limit={GARDEN_ROCKS.length}>
      <icosahedronGeometry args={[0.4, 0]} />
      <meshLambertMaterial color={PALETTE.stone} flatShading />
      {GARDEN_ROCKS.map(([x, z, s], i) => (
        <Instance key={i} position={[x, 0.18 * s, z]} scale={s} />
      ))}
    </Instances>
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
