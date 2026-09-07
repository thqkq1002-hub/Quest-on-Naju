import { Instance, Instances } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import type { Group } from 'three'
import { PALETTE } from '@/lib/palette'
import { taegukgiTexture } from '@/lib/taegukgi'
import { FLOWER_BEDS, LAYOUT } from './layout'

/** 국기게양대 — 태극기 */
export function Flagpole() {
  const flag = useRef<Group>(null)
  const tex = useMemo(taegukgiTexture, [])
  useFrame(({ clock }) => {
    // 깃발이 바람에 흔들리는 정도만. 천 시뮬레이션은 P0에서 과합니다
    if (flag.current) flag.current.rotation.y = Math.sin(clock.elapsedTime * 1.6) * 0.12
  })
  return (
    <group position={[LAYOUT.flagpole.x, 0, LAYOUT.flagpole.z]}>
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <cylinderGeometry args={[0.9, 1.1, 0.5, 8]} />
        <meshLambertMaterial color={PALETTE.band} flatShading />
      </mesh>
      <mesh position={[0, 5.2, 0]} castShadow>
        <cylinderGeometry args={[0.09, 0.12, 10, 6]} />
        <meshLambertMaterial color="#dcdcdc" flatShading />
      </mesh>
      {/* 깃대 끝(10.2)에 바짝 붙입니다 — 예전엔 9였는데 깃대 위로
          장대가 훤히 보여서 국기가 중간에 걸린 것처럼 보였습니다 */}
      <group ref={flag} position={[0, 9.9, 0]}>
        {/* 규격대로 3:2 */}
        <mesh position={[0.98, -0.63, 0]} castShadow>
          <planeGeometry args={[1.95, 1.3]} />
          <meshLambertMaterial map={tex} side={2} />
        </mesh>
      </group>
    </group>
  )
}

/**
 * 책 읽는 소녀상.
 * 1920년에 문을 연 학교라면 거의 반드시 하나쯤 서 있는 조형물입니다.
 * 로우폴리라서 형태만 암시합니다 — 좌대, 앉은 몸, 무릎 위 책.
 */
export function ReadingGirlStatue() {
  const p = LAYOUT.statue
  return (
    <group position={[p.x, 0, p.z]}>
      <mesh position={[0, 0.45, 0]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.9, 2]} />
        <meshLambertMaterial color="#9a958a" flatShading />
      </mesh>
      <mesh position={[0, 1.05, 0]} castShadow>
        <boxGeometry args={[1.5, 0.3, 1.5]} />
        <meshLambertMaterial color="#b8b3a8" flatShading />
      </mesh>
      <mesh position={[0, 1.55, -0.1]} castShadow>
        <boxGeometry args={[0.6, 0.7, 0.45]} />
        <meshLambertMaterial color="#b8b3a8" flatShading />
      </mesh>
      <mesh position={[0, 1.3, 0.3]} castShadow>
        <boxGeometry args={[0.55, 0.28, 0.7]} />
        <meshLambertMaterial color="#b8b3a8" flatShading />
      </mesh>
      <mesh position={[0, 2.08, -0.08]} castShadow>
        <boxGeometry args={[0.42, 0.42, 0.4]} />
        <meshLambertMaterial color="#b8b3a8" flatShading />
      </mesh>
      {/* 무릎 위의 책 */}
      <mesh position={[0, 1.5, 0.42]} rotation={[-0.5, 0, 0]} castShadow>
        <boxGeometry args={[0.5, 0.06, 0.38]} />
        <meshLambertMaterial color="#b8b3a8" flatShading />
      </mesh>
    </group>
  )
}

/** 파란 지붕 창고 — 운동장 남쪽 */
export function BlueShed() {
  const s = LAYOUT.shed
  return (
    <group position={[s.x, 0, s.z]}>
      <mesh position={[0, s.h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[s.w, s.h, s.d]} />
        <meshLambertMaterial color={PALETTE.village} flatShading />
      </mesh>
      {/* 파란 박공지붕 — 기울인 판 두 장 */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[0, s.h + 0.7, (side * s.d) / 4]}
          rotation={[(side * -Math.PI) / 8, 0, 0]}
          castShadow
        >
          <boxGeometry args={[s.w + 0.8, 0.25, s.d / 2 + 0.8]} />
          <meshLambertMaterial color="#4a7fb5" flatShading />
        </mesh>
      ))}
    </group>
  )
}

/**
 * 스쿨버스 한 대.
 *
 * 창고와 다시로 사이 빈 잔디가 등하교 버스가 서는 자리로 자연스러워
 * 그쪽에 세워둡니다. 배경 연출용이라 움직이지 않습니다 — 다니는 버스는
 * 기차·황포돛배처럼 경로가 필요한데, 여기서는 "서 있는" 그림이면 충분합니다.
 */
function SchoolBus({ x, z, rotY = 0 }: { x: number; z: number; rotY?: number }) {
  const len = 6.6
  const w = 2.3
  const h = 2.3
  const wheelR = 0.46

  return (
    <group position={[x, wheelR, z]} rotation={[0, rotY, 0]}>
      {/* 몸체 */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[len, h, w]} />
        <meshLambertMaterial color={PALETTE.busYellow} flatShading />
      </mesh>
      {/* 지붕 — 살짝 더 밝고 좁게 얹어 입체감 */}
      <mesh position={[0, h + 0.14, 0]} castShadow>
        <boxGeometry args={[len - 0.3, 0.28, w - 0.2]} />
        <meshLambertMaterial color={PALETTE.busYellow} flatShading />
      </mesh>
      {/* 허리 반사띠 */}
      <mesh position={[0, h * 0.42, 0]}>
        <boxGeometry args={[len + 0.02, 0.16, w + 0.02]} />
        <meshLambertMaterial color={PALETTE.busYellowDark} flatShading />
      </mesh>
      {/* 창문 — 옆면 한 줄 */}
      {[-w / 2 - 0.02, w / 2 + 0.02].map((dz) => (
        <Instances key={dz} limit={6} position={[0, h * 0.72, dz]}>
          <boxGeometry args={[0.85, 0.62, 0.05]} />
          <meshLambertMaterial color={PALETTE.windowGlass} flatShading />
          {[-2.3, -1.15, 0, 1.15, 2.3].map((wx) => (
            <Instance key={wx} position={[wx, 0, 0]} />
          ))}
        </Instances>
      ))}
      {/* 앞유리 */}
      <mesh position={[len / 2 + 0.02, h * 0.7, 0]}>
        <boxGeometry args={[0.05, 0.7, w - 0.4]} />
        <meshLambertMaterial color={PALETTE.windowGlass} flatShading />
      </mesh>
      {/* 앞뒤 범퍼 */}
      {[-len / 2 - 0.06, len / 2 + 0.06].map((dx) => (
        <mesh key={dx} position={[dx, 0.28, 0]}>
          <boxGeometry args={[0.14, 0.4, w + 0.1]} />
          <meshLambertMaterial color="#3a3a3a" flatShading />
        </mesh>
      ))}
      {/* 바퀴 */}
      {[-1, 1].map((sx) =>
        [-1, 1].map((sz) => (
          <mesh
            key={`${sx}-${sz}`}
            position={[sx * (len / 2 - 1.1), -wheelR + 0.1, sz * (w / 2 + 0.06)]}
            rotation={[Math.PI / 2, 0, 0]}
            castShadow
          >
            <cylinderGeometry args={[wheelR, wheelR, 0.36, 10]} />
            <meshLambertMaterial color="#2b2b2b" flatShading />
          </mesh>
        )),
      )}
    </group>
  )
}

/** 등하교 스쿨버스 두 대 */
export function SchoolBuses() {
  return (
    <>
      {LAYOUT.buses.map((b, i) => (
        <SchoolBus key={i} x={b.x} z={b.z} rotY={b.rotY} />
      ))}
    </>
  )
}

/** 화단 */
export function FlowerBeds() {
  return (
    <group>
      {FLOWER_BEDS.map(([x, z, w, d], i) => (
        <group key={i} position={[x, 0, z]}>
          <mesh position={[0, 0.2, 0]} receiveShadow>
            <boxGeometry args={[w, 0.4, d]} />
            <meshLambertMaterial color="#b8b3a8" flatShading />
          </mesh>
          <mesh position={[0, 0.44, 0]}>
            <boxGeometry args={[w - 0.5, 0.12, d - 0.5]} />
            <meshLambertMaterial color="#6b4f37" flatShading />
          </mesh>
          <Flowers width={w - 1} depth={d - 1} seed={i} />
        </group>
      ))}
    </group>
  )
}

function Flowers({ width, depth, seed }: { width: number; depth: number; seed: number }) {
  const colors = [PALETTE.flowerRed, PALETTE.flowerYellow, PALETTE.flowerPink]
  const count = Math.max(8, Math.round(width * 1.6))
  return (
    <>
      {colors.map((color, ci) => (
        <Instances key={color} limit={32} position={[0, 0.62, 0]}>
          <sphereGeometry args={[0.16, 5, 4]} />
          <meshLambertMaterial color={color} flatShading />
          {Array.from({ length: count }, (_, i) => {
            // 결정적 의사난수 — Math.random()을 쓰면 리렌더마다 꽃이 튑니다
            const h = Math.sin((i + 1) * 12.9898 + seed * 78.233 + ci * 3.7) * 43758.5453
            const r1 = h - Math.floor(h)
            const h2 = Math.sin((i + 1) * 39.346 + seed * 11.135 + ci * 9.1) * 24634.6345
            const r2 = h2 - Math.floor(h2)
            if (Math.floor(r1 * 3) !== ci) return null
            return (
              <Instance
                key={i}
                position={[(r1 - 0.5) * width, 0, (r2 - 0.5) * depth]}
                scale={0.8 + r2 * 0.5}
              />
            )
          })}
        </Instances>
      ))}
    </>
  )
}
