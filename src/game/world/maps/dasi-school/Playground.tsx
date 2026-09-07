import { PALETTE } from '@/lib/palette'
import { LAYOUT } from './layout'

/**
 * 운동장.
 *
 * 항공뷰를 보고 통째로 고친 부분입니다. 처음엔 "시골 학교 = 흙 운동장 하나"로
 * 만들었는데, 실제 다시초는 운동장이 **둘**입니다.
 *
 *   · 본관 앞: 넓은 **잔디 운동장**
 *   · 그 동쪽: **빨간 우레탄 트랙 + 파란 안쪽 띠 + 흙 인필드**를 갖춘 정식 트랙
 *
 * 이 대비(초록 - 빨강)가 항공뷰에서 학교를 알아보게 하는 가장 강한 신호라
 * 색과 배치를 최대한 살렸습니다.
 */
export function Playground() {
  const t = LAYOUT.turf
  const k = LAYOUT.track

  // 트랙을 타원으로 만들기 위해 링을 X축으로 늘립니다
  const stretch: [number, number, number] = [k.rx / k.rz, 1, 1]

  return (
    <group>
      {/* 잔디 운동장 */}
      <mesh position={[t.x, 0.02, t.z]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[t.w, t.d]} />
        <meshLambertMaterial color={PALETTE.turf} />
      </mesh>

      <group position={[k.x, 0, k.z]}>
        {/* 흙 인필드 */}
        <group scale={stretch}>
          <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
            <circleGeometry args={[k.rz - k.laneWidth - k.apronWidth, 40]} />
            <meshLambertMaterial color={PALETTE.dirt} />
          </mesh>

          {/* 파란 안쪽 띠 */}
          <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry
              args={[k.rz - k.laneWidth - k.apronWidth, k.rz - k.laneWidth, 44]}
            />
            <meshBasicMaterial color={PALETTE.trackApron} />
          </mesh>

          {/* 빨간 우레탄 레인 */}
          <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[k.rz - k.laneWidth, k.rz, 44]} />
            <meshBasicMaterial color={PALETTE.track} />
          </mesh>

          {/* 레인 구분선 */}
          {[0.25, 0.5, 0.75].map((f) => (
            <mesh key={f} position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry
                args={[
                  k.rz - k.laneWidth + k.laneWidth * f,
                  k.rz - k.laneWidth + k.laneWidth * f + 0.14,
                  44,
                ]}
              />
              <meshBasicMaterial color="#f0ece4" />
            </mesh>
          ))}
        </group>

        {/* 인필드 센터서클 */}
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[6.2, 6.5, 32]} />
          <meshBasicMaterial color="#f0ece4" />
        </mesh>
      </group>

      {LAYOUT.goals.map((g, i) => (
        <SoccerGoal key={i} x={g.x} z={g.z} facing={g.facing} />
      ))}
      {LAYOUT.hoops.map((h, i) => (
        <BasketballHoop key={i} x={h.x} z={h.z} />
      ))}
    </group>
  )
}

function SoccerGoal({ x, z, facing }: { x: number; z: number; facing: number }) {
  const W = 7.3
  const H = 2.44
  return (
    <group position={[x, 0, z]} rotation={[0, facing > 0 ? 0 : Math.PI, 0]}>
      {[-W / 2, W / 2].map((px) => (
        <mesh key={px} position={[px, H / 2, 0]} castShadow>
          <boxGeometry args={[0.16, H, 0.16]} />
          <meshLambertMaterial color="#f2f2f2" flatShading />
        </mesh>
      ))}
      <mesh position={[0, H, 0]} castShadow>
        <boxGeometry args={[W + 0.16, 0.16, 0.16]} />
        <meshLambertMaterial color="#f2f2f2" flatShading />
      </mesh>
      {/* 그물 — 반투명 판 한 장으로 암시만 합니다 */}
      <mesh position={[0, H / 2, -0.9]} rotation={[-0.25, 0, 0]}>
        <planeGeometry args={[W, H + 0.6]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.22} depthWrite={false} side={2} />
      </mesh>
    </group>
  )
}

function BasketballHoop({ x, z }: { x: number; z: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, 1.6, 0]} castShadow>
        <boxGeometry args={[0.18, 3.2, 0.18]} />
        <meshLambertMaterial color="#5b8fb0" flatShading />
      </mesh>
      <mesh position={[0, 3.05, 0.5]} castShadow>
        <boxGeometry args={[1.8, 1.05, 0.1]} />
        <meshLambertMaterial color="#f0ece4" flatShading />
      </mesh>
      <mesh position={[0, 2.75, 0.72]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.32, 0.045, 6, 14]} />
        <meshLambertMaterial color="#d4623f" flatShading />
      </mesh>
    </group>
  )
}
