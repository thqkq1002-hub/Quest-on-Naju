import { Html, Instance, Instances } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import { PALETTE } from '@/lib/palette'
import { PLATFORM, RAILWAY, STATION, TRAIN_ROUTE } from './layout'

/** 기차 몸체 배율 — 요청대로 3배 키웠습니다 */
const TRAIN_SCALE = 3

/**
 * 철로 — 자갈 노반 + 침목 + 레일 2줄. 학교 남쪽, 실제 호남선 자리를
 * 동서로 곧게 뻗은 선 하나로 단순화했습니다.
 */
export function Railway() {
  const { z, width, xFrom, xTo } = RAILWAY
  const length = xTo - xFrom
  const tieGap = 2.2
  const tieCount = Math.round(length / tieGap)

  return (
    <group position={[0, 0, z]}>
      {/* 자갈 노반 */}
      <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[length, width]} />
        <meshLambertMaterial color={PALETTE.ballast} flatShading />
      </mesh>
      {/* 침목 */}
      <Instances limit={tieCount + 1} position={[0, 0.09, 0]}>
        <boxGeometry args={[1.2, 0.12, width - 1]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
        {Array.from({ length: tieCount }, (_, i) => (
          <Instance key={i} position={[xFrom + i * tieGap, 0, 0]} />
        ))}
      </Instances>
      {/* 레일 2줄 */}
      {[-width / 2 + 1, width / 2 - 1].map((dz) => (
        <mesh key={dz} position={[0, 0.16, dz]}>
          <boxGeometry args={[length, 0.12, 0.14]} />
          <meshLambertMaterial color={PALETTE.rail} flatShading />
        </mesh>
      ))}
    </group>
  )
}

/**
 * 기차 — 철로 위를 동서로 오갑니다. 정박지 없이 배경 연출용이라
 * 구간 끝에서 방향만 바뀝니다 (황포돛배와 같은 방식).
 */
export function Train() {
  const group = useRef<Group>(null)

  useFrame(({ clock }) => {
    const g = group.current
    if (!g) return
    const t = clock.elapsedTime
    const { xFrom, xTo, period } = TRAIN_ROUTE
    const mid = (xFrom + xTo) / 2
    const half = (xTo - xFrom) / 2
    const phase = (t / period) * Math.PI * 2
    // 열차 몸체를 3배로 키운 만큼, 바닥에 닿도록 y도 3배로 올립니다
    g.position.set(mid + Math.sin(phase) * half, 0.62 * TRAIN_SCALE, RAILWAY.z)
  })

  const carLen = 5.4
  const gap = 0.3
  const cars = [0, -(carLen + gap), -2 * (carLen + gap)]

  return (
    <group ref={group} scale={TRAIN_SCALE}>
      {cars.map((dx, i) => (
        <group key={dx} position={[dx, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[carLen, 1.7, 2.3]} />
            <meshLambertMaterial
              color={i === 0 ? PALETTE.trainEngine : PALETTE.trainCar}
              flatShading
            />
          </mesh>
          {/* 지붕 */}
          <mesh position={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[carLen + 0.1, 0.25, 2.5]} />
            <meshLambertMaterial color="#2b2f33" flatShading />
          </mesh>
          {/* 창 — 양옆 */}
          {[-1.16, 1.16].map((dz) => (
            <Instances key={dz} limit={5} position={[0, 0.35, dz]}>
              <boxGeometry args={[0.7, 0.55, 0.06]} />
              <meshLambertMaterial color={PALETTE.windowGlass} flatShading />
              {[-1.8, -0.9, 0, 0.9, 1.8].map((wx) => (
                <Instance key={wx} position={[wx, 0, 0]} />
              ))}
            </Instances>
          ))}
        </group>
      ))}
    </group>
  )
}

/**
 * 다시역 — 철로 북쪽(학교 쪽) 승강장 옆에 선 벽돌 역사.
 * 실제로 다시초등학교 남쪽에 다시역이 있습니다 — 붉은 벽돌에 박공지붕,
 * 파란 역명판이 있는 작은 간이역입니다.
 */
export function DasiStation() {
  const { x, z, w, h, d } = STATION

  return (
    <group position={[x, 0, z]}>
      {/* 벽돌 몸체 */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshLambertMaterial color={PALETTE.stationBrick} flatShading />
      </mesh>
      <mesh position={[0, 0.3, 0]}>
        <boxGeometry args={[w + 0.1, 0.6, d + 0.1]} />
        <meshLambertMaterial color={PALETTE.baseboard} flatShading />
      </mesh>

      {/* 박공지붕 — 기울인 판 두 장 */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[0, h + 0.55, (side * d) / 4]}
          rotation={[(side * -Math.PI) / 7, 0, 0]}
          castShadow
        >
          <boxGeometry args={[w + 1, 0.25, d / 2 + 1.1]} />
          <meshLambertMaterial color={PALETTE.stationRoof} flatShading />
        </mesh>
      ))}

      {/* 정면(북쪽, 철로 반대쪽) — 역명판 · 출입문 · 창 */}
      <mesh position={[0, 1.35, -d / 2 - 0.03]}>
        <boxGeometry args={[3.4, 2.5, 0.06]} />
        <meshLambertMaterial color="#2b2320" flatShading />
      </mesh>
      <Instances limit={2} position={[0, 1.5, -d / 2 - 0.03]}>
        <boxGeometry args={[2, 1.6, 0.05]} />
        <meshLambertMaterial color={PALETTE.windowGlass} flatShading />
        {[-4.6, 4.6].map((wx) => (
          <Instance key={wx} position={[wx, 0, 0]} />
        ))}
      </Instances>
      {/* 역명판 */}
      <Html position={[0, h + 1.3, -d / 2 - 0.1]} center distanceFactor={26} zIndexRange={[10, 0]}>
        <div
          style={{
            background: '#2b5fa8',
            color: '#fff',
            padding: '4px 14px',
            borderRadius: 3,
            fontSize: 20,
            fontWeight: 700,
            whiteSpace: 'nowrap',
            border: '2px solid #fff',
          }}
        >
          다시역
        </div>
      </Html>
    </group>
  )
}

/** 역사와 철로 사이 승강장 — 가장자리에 노란 안전선 */
export function StationPlatform() {
  const { x, z, w, d } = PLATFORM
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 0.15, 0]} receiveShadow castShadow>
        <boxGeometry args={[w, 0.3, d]} />
        <meshLambertMaterial color={PALETTE.platform} flatShading />
      </mesh>
      {/* 철로 쪽 가장자리 안전선 */}
      <mesh position={[0, 0.31, d / 2 - 0.4]}>
        <boxGeometry args={[w, 0.02, 0.3]} />
        <meshLambertMaterial color={PALETTE.questGold} flatShading />
      </mesh>
    </group>
  )
}
