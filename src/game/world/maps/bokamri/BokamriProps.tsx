import { useMemo } from 'react'
import { Instance, Instances } from '@react-three/drei'
import { PlaneGeometry } from 'three'
import { PALETTE } from '@/lib/palette'
import { BOUNDS, LAYOUT, MOUNDS, heightAt } from './layout'

/**
 * 복암리의 지형과 시설물.
 *
 * 고분은 "언덕처럼 보이는 무덤" 이라, 이 맵에서는 **땅 자체가 전시물**입니다.
 * 그래서 지면을 평면이 아니라 높이 함수로 밀어 올린 메시로 그립니다 —
 * 걷는 높이(layout.heightAt)와 보이는 높이가 같은 식에서 나와야
 * 언덕을 오를 때 발이 뜨거나 잠기지 않습니다.
 */

/** 구릉 지면. 세그먼트는 형태가 읽히는 선에서 가장 적게 잡았습니다 */
export function BokamriGround() {
  const geo = useMemo(() => {
    const w = BOUNDS.maxX - BOUNDS.minX + 60
    const d = BOUNDS.maxZ - BOUNDS.minZ + 60
    const g = new PlaneGeometry(w, d, 96, 96)
    const cx = (BOUNDS.maxX + BOUNDS.minX) / 2
    const cz = (BOUNDS.maxZ + BOUNDS.minZ) / 2
    const pos = g.attributes.position
    for (let i = 0; i < pos.count; i++) {
      // 아직 눕히기 전이라 로컬 y 가 월드 z 에 해당합니다
      const x = pos.getX(i) + cx
      const z = -pos.getY(i) + cz
      pos.setZ(i, heightAt(x, z))
    }
    g.rotateX(-Math.PI / 2)
    g.translate(cx, 0, cz)
    g.computeVertexNormals()
    return g
  }, [])

  return (
    <mesh geometry={geo} receiveShadow>
      <meshLambertMaterial color={PALETTE.grassDark} flatShading />
    </mesh>
  )
}

/** 분구 위의 잔디 결 — 무덤이 인공물임을 알려 주는 등고선 띠 */
export function MoundRings() {
  return (
    <>
      {MOUNDS.map((m) => (
        <mesh
          key={m.id}
          position={[m.x, heightAt(m.x, m.z) - m.h * 0.42, m.z]}
          rotation={[-Math.PI / 2, 0, 0]}
        >
          <ringGeometry args={[Math.min(m.rx, m.rz) * 0.52, Math.min(m.rx, m.rz) * 0.62, 40]} />
          <meshBasicMaterial color={PALETTE.grass} transparent opacity={0.35} />
        </mesh>
      ))}
    </>
  )
}

/** 발굴 캠프 천막 */
export function DigCamp() {
  const { x, z } = LAYOUT.camp
  const y = heightAt(x, z)
  return (
    <group position={[x, y, z]}>
      {/* 기둥 넷 */}
      {[[-3, -2.5], [3, -2.5], [-3, 2.5], [3, 2.5]].map(([px, pz]) => (
        <mesh key={`${px},${pz}`} position={[px, 1.2, pz]} castShadow>
          <cylinderGeometry args={[0.09, 0.09, 2.4, 6]} />
          <meshLambertMaterial color="#8d8477" flatShading />
        </mesh>
      ))}
      {/* 천막 지붕 — 가운데가 솟은 사각뿔 */}
      <mesh position={[0, 2.9, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[5.2, 1.3, 4]} />
        <meshLambertMaterial color="#e8e0cd" flatShading />
      </mesh>
      {/* 작업대 */}
      <mesh position={[0, 0.86, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 0.12, 1.6]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
      </mesh>
      {[[-1.5, -0.65], [1.5, -0.65], [-1.5, 0.65], [1.5, 0.65]].map(([px, pz]) => (
        <mesh key={`l${px},${pz}`} position={[px, 0.4, pz]}>
          <boxGeometry args={[0.1, 0.8, 0.1]} />
          <meshLambertMaterial color={PALETTE.trunk} flatShading />
        </mesh>
      ))}
      {/* 작업대 위 토기 조각들 */}
      {[-1.1, -0.4, 0.35, 1.1].map((px, i) => (
        <mesh key={px} position={[px, 0.99, i % 2 ? 0.3 : -0.25]} rotation={[0.2, i, 0.1]} castShadow>
          <boxGeometry args={[0.34, 0.06, 0.28]} />
          <meshLambertMaterial color={i % 2 ? '#a9754f' : '#946246'} flatShading />
        </mesh>
      ))}
    </group>
  )
}

/**
 * 3호 트렌치 — 좁고 길게 파 내려간 조사 구덩이.
 * 벽면에 층이 색으로 드러나 있습니다. 층위 퍼즐의 정답 근거가 여기 있습니다.
 */
export const LAYER_COLORS = ['#6b5a41', '#8a7350', '#a68a5f', '#c2a374'] as const

export function Trench() {
  const { x, z, w, d } = LAYOUT.trench
  const y = heightAt(x, z)
  const depth = 2.6
  return (
    <group position={[x, y, z]}>
      {/* 구덩이 바닥 */}
      <mesh position={[0, -depth, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[w, d]} />
        <meshLambertMaterial color="#7a6549" />
      </mesh>
      {/* 네 벽 — 북/남 벽에 층을 색으로 드러냅니다 */}
      {LAYER_COLORS.map((c, i) => {
        const h = depth / LAYER_COLORS.length
        const yy = -depth + h / 2 + i * h
        return (
          <group key={c}>
            <mesh position={[0, yy, -d / 2]}>
              <boxGeometry args={[w, h, 0.25]} />
              <meshLambertMaterial color={c} flatShading />
            </mesh>
            <mesh position={[0, yy, d / 2]}>
              <boxGeometry args={[w, h, 0.25]} />
              <meshLambertMaterial color={c} flatShading />
            </mesh>
            <mesh position={[-w / 2, yy, 0]}>
              <boxGeometry args={[0.25, h, d]} />
              <meshLambertMaterial color={c} flatShading />
            </mesh>
            <mesh position={[w / 2, yy, 0]}>
              <boxGeometry args={[0.25, h, d]} />
              <meshLambertMaterial color={c} flatShading />
            </mesh>
          </group>
        )
      })}
      {/* 가장자리 밧줄 — 들어가면 안 되는 곳임을 알립니다 */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[0, 0.5, (s * d) / 2 - s * 0.5]}>
          <boxGeometry args={[w + 1, 0.05, 0.05]} />
          <meshBasicMaterial color="#e8b53f" />
        </mesh>
      ))}
    </group>
  )
}

/** 층위 표지 — 트렌치 벽에 꽂힌 번호표 3개 */
export function LayerMarker({ index }: { index: number }) {
  return (
    <group>
      <mesh position={[0, 0.55, 0]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 1.1, 5]} />
        <meshLambertMaterial color="#d8d8d8" flatShading />
      </mesh>
      <mesh position={[0, 1.16, 0]} castShadow>
        <boxGeometry args={[0.42, 0.3, 0.03]} />
        <meshLambertMaterial color="#fdfaf2" flatShading />
      </mesh>
      <mesh position={[0, 1.16, 0.02]}>
        <boxGeometry args={[0.1 + index * 0.08, 0.09, 0.02]} />
        <meshBasicMaterial color="#2b2320" />
      </mesh>
    </group>
  )
}

/**
 * 옹관 — 큰 항아리 두 개의 입을 맞대어 놓은 관.
 * 이 게임에서 가장 강한 "어?" 를 만드는 물건이라 크게, 눈높이에 둡니다.
 */
export function OnganJar({ flip = false }: { flip?: boolean }) {
  return (
    <group rotation={[0, 0, flip ? -Math.PI / 2 : Math.PI / 2]}>
      {/* 몸통 */}
      <mesh castShadow>
        <sphereGeometry args={[0.78, 12, 9]} />
        <meshLambertMaterial color="#a9754f" flatShading />
      </mesh>
      {/* 아가리 */}
      <mesh position={[0, 0.82, 0]} castShadow>
        <cylinderGeometry args={[0.46, 0.62, 0.5, 12]} />
        <meshLambertMaterial color="#946246" flatShading />
      </mesh>
      <mesh position={[0, 1.07, 0]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <torusGeometry args={[0.46, 0.07, 6, 14]} />
        <meshLambertMaterial color="#7d5238" flatShading />
      </mesh>
    </group>
  )
}

/** 옹관 전시 가림막 — 야외 전시라 지붕만 있습니다 */
export function OnganShelter() {
  const { x, z } = LAYOUT.onganShelter
  const y = heightAt(x, z)
  return (
    <group position={[x, y, z]}>
      {[[-3.2, -1.9], [3.2, -1.9], [-3.2, 1.9], [3.2, 1.9]].map(([px, pz]) => (
        <mesh key={`${px},${pz}`} position={[px, 1.45, pz]} castShadow>
          <boxGeometry args={[0.16, 2.9, 0.16]} />
          <meshLambertMaterial color="#6f665a" flatShading />
        </mesh>
      ))}
      <mesh position={[0, 3.05, 0]} castShadow>
        <boxGeometry args={[7.4, 0.22, 4.6]} />
        <meshLambertMaterial color="#8d7f6d" flatShading />
      </mesh>
      {/* 받침 단 */}
      <mesh position={[0, 0.18, 0]} receiveShadow castShadow>
        <boxGeometry args={[6, 0.36, 3.4]} />
        <meshLambertMaterial color={PALETTE.stone} flatShading />
      </mesh>
    </group>
  )
}

/**
 * 96호 돌방무덤 발굴지 — 금동신발이 나온 자리를 표시합니다.
 * 트렌치처럼 깊이 파진 않고, 얕게 드러난 사각 구덩이 + 번호 깃발로 표현합니다.
 */
export function GoldenShoeDigSite() {
  const { x, z } = LAYOUT.goldenShoeDig
  const y = heightAt(x, z)
  return (
    <group position={[x, y, z]}>
      {/* 얕게 파낸 흙 자리 */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[3, 3]} />
        <meshLambertMaterial color="#8a6f4a" flatShading />
      </mesh>
      {/* 나무 테두리 */}
      {[
        [0, -1.5, 3, 0.14],
        [0, 1.5, 3, 0.14],
        [-1.5, 0, 0.14, 3],
        [1.5, 0, 0.14, 3],
      ].map(([px, pz, w, d], i) => (
        <mesh key={i} position={[px, 0.1, pz]} castShadow>
          <boxGeometry args={[w, 0.12, d]} />
          <meshLambertMaterial color="#6f5133" flatShading />
        </mesh>
      ))}
      {/* 번호 깃발 — "96" */}
      <mesh position={[1.3, 0.66, -1.3]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 1.2, 5]} />
        <meshLambertMaterial color="#8a6f4f" flatShading />
      </mesh>
      <mesh position={[1.53, 1.12, -1.3]} castShadow>
        <boxGeometry args={[0.46, 0.32, 0.02]} />
        <meshLambertMaterial color="#e8b53f" flatShading />
      </mesh>
    </group>
  )
}

/** 안내판 */
export function SignPost({ rotY = 0 }: { rotY?: number }) {
  return (
    <group rotation={[0, rotY, 0]}>
      {[-0.7, 0.7].map((px) => (
        <mesh key={px} position={[px, 0.7, 0]} castShadow>
          <boxGeometry args={[0.12, 1.4, 0.12]} />
          <meshLambertMaterial color={PALETTE.trunk} flatShading />
        </mesh>
      ))}
      <mesh position={[0, 1.5, 0]} rotation={[-0.32, 0, 0]} castShadow>
        <boxGeometry args={[1.9, 1.15, 0.09]} />
        <meshLambertMaterial color="#4a4f45" flatShading />
      </mesh>
      <mesh position={[0, 1.5, 0.055]} rotation={[-0.32, 0, 0]}>
        <boxGeometry args={[1.7, 0.95, 0.02]} />
        <meshLambertMaterial color="#e9e4d6" flatShading />
      </mesh>
    </group>
  )
}

/** 나룻배와 선착장 — 영산강에서 여기로 들어옵니다 */
export function Dock() {
  const { x, z } = LAYOUT.dock
  return (
    <group position={[x, 0, z]}>
      {/* 강물 */}
      <mesh position={[0, 0.02, 14]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[260, 40]} />
        <meshLambertMaterial color="#5b8fb0" />
      </mesh>
      {/* 나무 데크 */}
      <mesh position={[0, 0.42, 2]} castShadow receiveShadow>
        <boxGeometry args={[5, 0.22, 9]} />
        <meshLambertMaterial color="#9c7a52" flatShading />
      </mesh>
      {[-2, 2].map((px) =>
        [-1.5, 2, 5.5].map((pz) => (
          <mesh key={`${px},${pz}`} position={[px, 0.15, pz]}>
            <boxGeometry args={[0.2, 0.6, 0.2]} />
            <meshLambertMaterial color="#7a5f42" flatShading />
          </mesh>
        )),
      )}
      {/* 배 */}
      <group position={[3.6, 0.3, 5]} rotation={[0, 0.2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.6, 0.5, 5]} />
          <meshLambertMaterial color="#8a6440" flatShading />
        </mesh>
        <mesh position={[0, 0.3, 0]}>
          <boxGeometry args={[1.3, 0.3, 4.4]} />
          <meshLambertMaterial color="#6f5133" flatShading />
        </mesh>
      </group>
    </group>
  )
}

/** 구릉의 나무와 풀 — 인스턴싱으로 draw call 을 아낍니다 */
const TREES: Array<[number, number, number]> = [
  [-58, 30, 1.2], [-50, -46, 1.05], [-62, -20, 1.15], [-44, 44, 1.0],
  [56, 26, 1.1], [62, -12, 1.2], [50, -50, 1.0], [34, 40, 0.95],
  [-28, -52, 1.1], [8, -52, 1.05], [-16, 48, 0.9], [30, 52, 1.0],
]

export function BokamriNature() {
  return (
    <>
      <Instances limit={TREES.length} castShadow>
        <coneGeometry args={[2.4, 7, 7]} />
        <meshLambertMaterial color={PALETTE.pineDark} flatShading />
        {TREES.map(([x, z, s]) => (
          <Instance key={`${x},${z}`} position={[x, heightAt(x, z) + 3.6 * s, z]} scale={s} />
        ))}
      </Instances>
      <Instances limit={TREES.length}>
        <cylinderGeometry args={[0.28, 0.34, 2.2, 6]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
        {TREES.map(([x, z, s]) => (
          <Instance key={`t${x},${z}`} position={[x, heightAt(x, z) + 1.1 * s, z]} scale={s} />
        ))}
      </Instances>
    </>
  )
}
