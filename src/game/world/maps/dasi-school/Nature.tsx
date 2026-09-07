import { Html, Instance, Instances } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { PALETTE } from '@/lib/palette'
import { BIG_TREES, BOAT_ROUTE, ORCHARD, PINE_ROW, RIVER, VILLAGE } from './layout'

/** 향나무 — 원뿔 3단. 본관 앞에 줄 맞춰 서 있는 그 나무 */
function Pine({ x, z, scale }: { x: number; z: number; scale: number }) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 0.7, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.24, 1.4, 6]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
      </mesh>
      {[
        [1.6, 1.5, 1.7],
        [2.6, 1.2, 1.5],
        [3.5, 0.8, 1.3],
      ].map(([y, r, h], i) => (
        <mesh key={i} position={[0, y, 0]} castShadow>
          <coneGeometry args={[r, h, 7]} />
          <meshLambertMaterial color={i === 0 ? PALETTE.pineDark : PALETTE.pineMid} flatShading />
        </mesh>
      ))}
    </group>
  )
}

/**
 * 교정 한가운데 활엽수.
 *
 * 항공뷰에서 학교 부지의 절반 가까이를 덮고 있는 짙은 초록 덩어리입니다.
 * 100년 넘은 학교라는 걸 가장 잘 보여주는 게 이 나무들이라 크게 잡았습니다.
 */
function Broadleaf({ x, z, scale }: { x: number; z: number; scale: number }) {
  return (
    <group position={[x, 0, z]} scale={scale}>
      <mesh position={[0, 2.4, 0]} castShadow>
        <cylinderGeometry args={[0.35, 0.62, 4.8, 7]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
      </mesh>
      {/* 수관을 덩어리 셋으로 — 구 하나보다 훨씬 나무처럼 보입니다 */}
      <mesh position={[0, 7, 0]} castShadow>
        <icosahedronGeometry args={[3.6, 0]} />
        <meshLambertMaterial color={PALETTE.broadleaf} flatShading />
      </mesh>
      <mesh position={[2.1, 5.8, 1.2]} castShadow>
        <icosahedronGeometry args={[2.4, 0]} />
        <meshLambertMaterial color={PALETTE.broadleafLight} flatShading />
      </mesh>
      <mesh position={[-2, 6.1, -1.4]} castShadow>
        <icosahedronGeometry args={[2.2, 0]} />
        <meshLambertMaterial color={PALETTE.broadleafLight} flatShading />
      </mesh>
    </group>
  )
}

/**
 * 이정표 — 나무 기둥 + 화살표 팻말. `rotY` 방향(로컬 +X, 화살촉 쪽)을
 * 목적지 쪽으로 돌려서 세웁니다.
 */
function Signpost({
  x,
  z,
  rotY,
  label,
}: {
  x: number
  z: number
  rotY: number
  label: string
}) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]} scale={1.5}>
      <mesh position={[0, 1.1, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.11, 2.2, 6]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
      </mesh>
      {/* 화살표 팻말 — 몸통 + 뾰족한 촉 */}
      <mesh position={[0, 1.9, 0]} castShadow>
        <boxGeometry args={[1.7, 0.36, 0.06]} />
        <meshLambertMaterial color={PALETTE.band} flatShading />
      </mesh>
      <mesh position={[1.02, 1.9, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
        <boxGeometry args={[0.32, 0.32, 0.055]} />
        <meshLambertMaterial color={PALETTE.band} flatShading />
      </mesh>
      <Html position={[0, 1.9, 0.04]} center distanceFactor={30} zIndexRange={[10, 0]}>
        <div
          style={{
            whiteSpace: 'nowrap',
            color: '#3d3226',
            fontSize: 20,
            fontWeight: 700,
            pointerEvents: 'none',
          }}
        >
          {label}
        </div>
      </Html>
    </group>
  )
}

export function Trees() {
  return (
    <group>
      {PINE_ROW.map(([x, z, s], i) => (
        <Pine key={`p${i}`} x={x} z={z} scale={s} />
      ))}
      {BIG_TREES.map(([x, z, s], i) => (
        <Broadleaf key={`b${i}`} x={x} z={z} scale={s} />
      ))}
    </group>
  )
}

/**
 * 학교 밖 — 다시면 소재지.
 *
 * 처음엔 학교 밖을 온통 논밭으로 깔고 저 멀리 복암리 고분군을 세워뒀는데
 * 둘 다 틀렸습니다. 항공뷰의 다시초는 **마을 한복판**에 있고,
 * 복암리 고분군은 여기서 보이는 거리가 아닙니다.
 * 고분군은 별도 맵으로 분리했습니다. → docs/06-NAJU-WORLD-MAP.md
 */
export function Village() {
  const roofs = PALETTE.roofPalette

  return (
    <group>
      {/* 집 몸체 */}
      <Instances limit={40}>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial color={PALETTE.village} flatShading />
        {VILLAGE.map(([x, z, w, d, h], i) => (
          <Instance key={i} position={[x, h / 2, z]} scale={[w, h, d]} />
        ))}
      </Instances>

      {/* 지붕 — 색깔별로 인스턴스 묶음을 나눕니다 */}
      {roofs.map((color, ci) => (
        <Instances key={color} limit={20}>
          <boxGeometry args={[1, 1, 1]} />
          <meshLambertMaterial color={color} flatShading />
          {VILLAGE.filter(([, , , , , r]) => r === ci).map(([x, z, w, d, h], i) => (
            <Instance key={i} position={[x, h + 0.5, z]} scale={[w + 1.2, 1, d + 1.2]} />
          ))}
        </Instances>
      ))}

      {/* 학교 앞 도로 (다시로) */}
      <mesh position={[0, 0.02, 60]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[420, 9]} />
        <meshLambertMaterial color={PALETTE.asphalt} />
      </mesh>
      <mesh position={[-96, 0.02, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 2]}>
        <planeGeometry args={[300, 8]} />
        <meshLambertMaterial color={PALETTE.asphalt} />
      </mesh>

      {/* 사거리 이정표 — 서쪽 영산강 방향을 가리킵니다 */}
      <Signpost x={-89} z={68} rotY={Math.PI} label="황포돛배 타러가는 길" />

      {/* 마을 너머 논 — 영산강 유역 평야 */}
      <Instances limit={24} position={[0, 0.03, 0]}>
        <boxGeometry args={[1, 0.06, 1]} />
        <meshLambertMaterial color={PALETTE.paddy} flatShading />
        {Array.from({ length: 18 }, (_, i) => {
          const col = i % 6
          const row = Math.floor(i / 6)
          return (
            <Instance
              key={i}
              position={[(col - 2.5) * 60, 0, -150 - row * 44]}
              scale={[52 + ((col * 7) % 11), 1, 38]}
            />
          )
        })}
      </Instances>

      {/* 원경 산줄기 */}
      {[
        [-260, -330, 95, 40],
        [-60, -370, 130, 52],
        [190, -340, 105, 36],
        [370, -360, 85, 30],
      ].map(([x, z, r, h], i) => (
        <mesh key={i} position={[x, 0, z]} scale={[1, h / r, 1]}>
          <sphereGeometry args={[r, 8, 5, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshLambertMaterial color="#7ba888" flatShading />
        </mesh>
      ))}
    </group>
  )
}

/**
 * 영산강 — 마을 서쪽. 남북으로 길게 흐르는 강 하나로 단순화했습니다.
 * 가운데 짙은 띠는 물살(유심선)을 암시합니다.
 */
export function River() {
  const { x, width, zFrom, zTo } = RIVER
  const length = zTo - zFrom
  const midZ = (zFrom + zTo) / 2
  return (
    <group position={[x, 0, midZ]}>
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[width, length]} />
        <meshLambertMaterial color={PALETTE.river} />
      </mesh>
      <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[width * 0.35, length]} />
        <meshLambertMaterial color={PALETTE.riverDark} />
      </mesh>
    </group>
  )
}

/**
 * 나루터 — 다시로가 영산강과 만나는 자리에 놓은 나무 선착장.
 * 도로가 강 한복판에서 끊기므로, 도로 쪽 기슭에서 강 안쪽까지 걸쳐 놓아
 * 황포돛배를 타고 내리는 자리로 씁니다.
 */
export function Wharf() {
  const pz = 60
  // 강 가장자리(RIVER.x + width/2 = -191)에 살짝 걸치도록 — 풀밭과 이어져 보입니다
  const nearX = -190 // 도로·풀밭 쪽
  const farX = -208 // 강 안쪽 — 배가 닿는 쪽
  const length = nearX - farX
  const width = 14
  const cx = (nearX + farX) / 2

  return (
    <group position={[cx, 0, pz]}>
      {/* 나무 갑판 */}
      <mesh position={[0, 0.14, 0]} receiveShadow castShadow>
        <boxGeometry args={[length, 0.14, width]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
      </mesh>
      {/* 널빤지 이음매 — 폭 방향 줄무늬로 암시 */}
      {[-4, -1.3, 1.3, 4].map((dz) => (
        <mesh key={dz} position={[0, 0.22, dz]}>
          <boxGeometry args={[length - 0.4, 0.02, 0.12]} />
          <meshLambertMaterial color={PALETTE.boatHullDark} flatShading />
        </mesh>
      ))}
      {/* 계류주 — 배를 매어 두는 기둥 4개 */}
      {[
        [length / 2 - 1.2, width / 2 - 1.2],
        [length / 2 - 1.2, -(width / 2 - 1.2)],
        [-(length / 2 - 1.2), width / 2 - 1.2],
        [-(length / 2 - 1.2), -(width / 2 - 1.2)],
      ].map(([dx, dz], i) => (
        <mesh key={i} position={[dx, 0.55, dz]} castShadow>
          <cylinderGeometry args={[0.13, 0.15, 0.9, 6]} />
          <meshLambertMaterial color={PALETTE.boatHullDark} flatShading />
        </mesh>
      ))}
      <Html position={[0, 0.5, width / 2 + 1.4]} center distanceFactor={26} zIndexRange={[10, 0]}>
        <div
          style={{
            whiteSpace: 'nowrap',
            color: '#3d3226',
            fontSize: 22,
            fontWeight: 700,
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
 * 황포돛배 — 영산강 뱃길을 오가던 전통 배. 누런 무명(黃布) 돛이 특징입니다.
 * 강 위를 남북으로 천천히 오갑니다 — 정박지 없이 배경 연출용이라
 * 구간 끝에서 방향만 돌립니다.
 */
export function HwangpoBoat() {
  const group = useRef<Group>(null)
  const sail = useRef<Group>(null)

  useFrame(({ clock }) => {
    const g = group.current
    if (!g) return
    const t = clock.elapsedTime
    const { zFrom, zTo, period } = BOAT_ROUTE
    const mid = (zFrom + zTo) / 2
    const half = (zTo - zFrom) / 2
    const phase = (t / period) * Math.PI * 2
    g.position.set(RIVER.x, 0.15 + Math.sin(t * 1.4) * 0.06, mid + Math.sin(phase) * half)
    g.rotation.y = Math.cos(phase) < 0 ? Math.PI : 0
    if (sail.current) sail.current.rotation.z = Math.sin(t * 0.9) * 0.05
  })

  return (
    <group ref={group}>
      {/* 선체 */}
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[2.4, 1, 8]} />
        <meshLambertMaterial color={PALETTE.boatHull} flatShading />
      </mesh>
      <mesh position={[0, 0.35, 0]}>
        <boxGeometry args={[2.7, 0.3, 8.3]} />
        <meshLambertMaterial color={PALETTE.boatHullDark} flatShading />
      </mesh>
      {/* 이물 · 고물 — 양끝을 살짝 들어 올립니다 */}
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

/**
 * 배나무 밭 — 학교 동쪽. 나주배는 나주를 대표하는 특산물입니다.
 * 실제 배 과수원처럼 덕(수평 시렁)에 낮고 납작하게 다듬은 수관으로
 * 표현했고, 줄 맞춰 심어 밭이라는 인상을 줍니다.
 */
/** 나무 크기 배율 — 요청대로 2배로 키웠습니다 */
const PEAR_SCALE = 2

export function PearOrchard() {
  const { xFrom, xTo, zFrom, zTo } = ORCHARD
  // 나무가 2배로 커진 만큼 줄 간격도 넓혀 수관끼리 심하게 겹치지 않게 합니다
  const spacing = 6 * PEAR_SCALE
  const cols = Math.max(1, Math.round((xTo - xFrom) / spacing))
  const rows = Math.max(1, Math.round((zTo - zFrom) / spacing))

  const trees: Array<[x: number, z: number, scale: number]> = []
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const i = r * cols + c
      // 결정적 의사난수 — 줄은 맞추되 나무마다 살짝 다르게
      const h = Math.sin((i + 1) * 12.9898 + 45.164) * 43758.5453
      const jitter = (h - Math.floor(h)) - 0.5
      const h2 = Math.sin((i + 1) * 78.233 + 3.7) * 24634.6345
      const scale = (0.85 + (h2 - Math.floor(h2)) * 0.35) * PEAR_SCALE
      trees.push([
        xFrom + spacing / 2 + c * spacing + jitter * 1.4,
        zFrom + spacing / 2 + r * spacing + jitter * 1.1,
        scale,
      ])
    }
  }

  return (
    <group>
      {/* 밑동 */}
      <Instances limit={trees.length}>
        <cylinderGeometry args={[0.09, 0.13, 1.2, 6]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
        {trees.map(([x, z, s], i) => (
          <Instance key={i} position={[x, 0.6 * s, z]} scale={s} />
        ))}
      </Instances>
      {/* 수평으로 다듬은 수관 — 배나무 특유의 납작한 덕식 재배 */}
      <Instances limit={trees.length}>
        <cylinderGeometry args={[1.3, 1.5, 0.5, 8]} />
        <meshLambertMaterial color={PALETTE.pearLeaf} flatShading />
        {trees.map(([x, z, s], i) => (
          <Instance key={i} position={[x, 1.35 * s, z]} scale={s} />
        ))}
      </Instances>
      {/* 잎끝 하이라이트 — 덩어리 하나보다 나무처럼 보이게 */}
      <Instances limit={trees.length}>
        <cylinderGeometry args={[1.05, 1.05, 0.16, 8]} />
        <meshLambertMaterial color={PALETTE.pearLeafLight} flatShading />
        {trees.map(([x, z, s], i) => (
          <Instance key={i} position={[x, 1.62 * s, z]} scale={s} />
        ))}
      </Instances>
      {/* 열매 — 덕 아래로 매달린 나주배. 나무마다 몇 개씩 원 둘레를 따라
          붙여서, 멀리서도 "배나무"라는 걸 잎 색만으로가 아니라 열매로
          알아볼 수 있게 합니다 */}
      <PearFruits trees={trees} />
    </group>
  )
}

const FRUITS_PER_TREE = 6

/** 0~1 결정적 의사난수 — 나무 배치와 같은 해시 방식 */
function rand01(seed: number) {
  const h = Math.sin(seed * 12.9898 + 78.233) * 43758.5453
  return h - Math.floor(h)
}

function PearFruits({ trees }: { trees: Array<[x: number, z: number, s: number]> }) {
  const fruits: Array<[x: number, y: number, z: number, scale: number, blush: boolean]> = []
  const stems: Array<[x: number, y: number, z: number, scale: number]> = []

  trees.forEach(([x, z, s], ti) => {
    for (let k = 0; k < FRUITS_PER_TREE; k++) {
      const seed = ti * 97 + k * 13.7
      const angle = (k / FRUITS_PER_TREE) * Math.PI * 2 + rand01(seed) * 0.9
      // 덕(수관) 바깥 둘레 — 지름선 안쪽에 두면 잎에 가려 안 보입니다.
      // 덕 가장자리(반지름 1.3~1.5*s)를 살짝 넘겨 매달아야 잎 그늘 밖으로 나와 보입니다
      const radius = (1.28 + rand01(seed + 1) * 0.4) * s
      const fx = x + Math.cos(angle) * radius
      const fz = z + Math.sin(angle) * radius
      const fy = (0.78 + rand01(seed + 2) * 0.28) * s
      const fScale = (0.85 + rand01(seed + 3) * 0.32) * s * 0.15
      fruits.push([fx, fy, fz, fScale, rand01(seed + 4) > 0.65])
      stems.push([fx, fy + fScale * 1.3, fz, fScale * 0.55])
    }
  })

  return (
    <>
      <Instances limit={fruits.length}>
        <icosahedronGeometry args={[1, 0]} />
        <meshLambertMaterial color={PALETTE.pearFruit} flatShading />
        {fruits
          .filter((f) => !f[4])
          .map(([x, y, z, s], i) => (
            <Instance key={i} position={[x, y, z]} scale={s} />
          ))}
      </Instances>
      <Instances limit={fruits.length}>
        <icosahedronGeometry args={[1, 0]} />
        <meshLambertMaterial color={PALETTE.pearFruitBlush} flatShading />
        {fruits
          .filter((f) => f[4])
          .map(([x, y, z, s], i) => (
            <Instance key={i} position={[x, y, z]} scale={s} />
          ))}
      </Instances>
      {/* 꼭지 — 열매가 가지에 매달린 느낌을 살립니다 */}
      <Instances limit={stems.length}>
        <cylinderGeometry args={[0.5, 0.7, 1, 5]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
        {stems.map(([x, y, z, s], i) => (
          <Instance key={i} position={[x, y, z]} scale={s} />
        ))}
      </Instances>
    </>
  )
}
