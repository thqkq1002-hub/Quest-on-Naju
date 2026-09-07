import { useMemo } from 'react'
import { Instance, Instances } from '@react-three/drei'
import { PALETTE } from '@/lib/palette'
import { LAYOUT } from './layout'

/**
 * 본관 날개 한 짝.
 *
 * 항공뷰의 특징을 그대로 가져옵니다 — 분홍(살구)빛 벽돌 3층, 층마다
 * 흰 수평 띠, 균일한 창 그리드, 밝은 색 옥상.
 *
 * 창문 수십 개를 각각 mesh로 두면 그것만으로 draw call이 100을 넘습니다.
 * InstancedMesh(drei <Instances>)로 한 벽면의 창을 draw call 하나에 담습니다.
 * → docs/03-TECH-ARCHITECTURE.md 5절 성능 예산
 */
function Wing({
  w,
  d,
  h,
  floors,
  entrance = false,
}: {
  w: number
  d: number
  h: number
  floors: number
  entrance?: boolean
}) {
  const floorH = h / floors

  const windows = useMemo(() => {
    const out: Array<[x: number, y: number]> = []
    const cols = Math.max(6, Math.round(w / 3.6))
    const spacing = (w - 5) / (cols - 1)
    for (let f = 0; f < floors; f++) {
      const y = f * floorH + floorH * 0.55
      for (let c = 0; c < cols; c++) {
        const x = -(w - 5) / 2 + c * spacing
        if (entrance && f === 0 && Math.abs(x) < spacing * 1.3) continue
        out.push([x, y])
      }
    }
    return out
  }, [w, floors, floorH, entrance])

  return (
    <group>
      {/* 벽돌 몸체 */}
      <mesh position={[0, h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, h, d]} />
        <meshLambertMaterial color={PALETTE.brick} flatShading />
      </mesh>

      {/* 하단 걸레받이 */}
      <mesh position={[0, 0.65, 0]} receiveShadow>
        <boxGeometry args={[w + 0.12, 1.3, d + 0.12]} />
        <meshLambertMaterial color={PALETTE.baseboard} flatShading />
      </mesh>

      {/* 층 사이 흰 띠 — 이 건물의 인상을 만드는 요소입니다.
          항공뷰에서 분홍 벽돌과 흰 띠가 층마다 번갈아 보입니다 */}
      {Array.from({ length: floors }, (_, i) => (
        <mesh key={i} position={[0, i * floorH + floorH * 0.06, 0]} castShadow>
          <boxGeometry args={[w + 0.18, floorH * 0.16, d + 0.18]} />
          <meshLambertMaterial color={PALETTE.band} flatShading />
        </mesh>
      ))}

      {/* 옥상 — 밝은 색 방수층 + 낮은 파라펫 */}
      <mesh position={[0, h + 0.4, 0]} castShadow>
        <boxGeometry args={[w + 0.6, 0.8, d + 0.6]} />
        <meshLambertMaterial color={PALETTE.roof} flatShading />
      </mesh>

      {/* 창 — 남/북 양면 */}
      {[1, -1].map((side) => (
        <Instances key={side} limit={96} position={[0, 0, (side * d) / 2 + side * 0.08]}>
          <boxGeometry args={[2.2, 1.5, 0.1]} />
          <meshLambertMaterial color={PALETTE.windowGlass} flatShading />
          {windows.map(([x, y], i) => (
            <Instance key={i} position={[x, y, 0]} />
          ))}
        </Instances>
      ))}

      {entrance && (
        <group position={[0, 0, d / 2]}>
          <mesh position={[0, 3.4, 1.7]} castShadow>
            <boxGeometry args={[11, 0.4, 3.6]} />
            <meshLambertMaterial color={PALETTE.roofDark} flatShading />
          </mesh>
          {[-4.8, 4.8].map((x) => (
            <mesh key={x} position={[x, 1.7, 3.1]} castShadow>
              <boxGeometry args={[0.45, 3.4, 0.45]} />
              <meshLambertMaterial color={PALETTE.pillar} flatShading />
            </mesh>
          ))}
          <mesh position={[0, 1.5, 0.08]}>
            <boxGeometry args={[6.5, 3, 0.12]} />
            <meshLambertMaterial color={PALETTE.windowGlass} flatShading />
          </mesh>
          {[0, 1, 2].map((i) => (
            <mesh key={i} position={[0, 0.12 + i * 0.16, 2.3 + i * 0.5]} receiveShadow>
              <boxGeometry args={[10 - i * 0.4, 0.16, 1]} />
              <meshLambertMaterial color={PALETTE.band} flatShading />
            </mesh>
          ))}
        </group>
      )}
    </group>
  )
}

/**
 * 본관 전체 — 동쪽 날개 + 원형 돔 탑 + 살짝 꺾인 서쪽 날개.
 *
 * 일자형 판상 건물로 만들었다가 항공뷰를 보고 고쳤습니다.
 * 두 날개가 만나는 자리의 **은색 돔 탑**이 이 학교를 알아보게 하는
 * 가장 강한 신호라서, 형태가 단순해도 이건 반드시 넣어야 합니다.
 */
export function SchoolBuilding() {
  const e = LAYOUT.eastWing
  const w = LAYOUT.westWing
  const t = LAYOUT.tower

  return (
    <group>
      <group position={[e.x, 0, e.z]}>
        <Wing w={e.w} d={e.d} h={e.h} floors={e.floors} />
      </group>

      <group position={[w.x, 0, w.z]} rotation={[0, w.rotY, 0]}>
        <Wing w={w.w} d={w.d} h={w.h} floors={w.floors} entrance />
      </group>

      {/* 원형 탑 + 은색 돔 */}
      <group position={[t.x, 0, t.z]}>
        <mesh position={[0, t.h / 2, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[t.r, t.r, t.h, 14]} />
          <meshLambertMaterial color={PALETTE.brick} flatShading />
        </mesh>
        {/* 탑을 두르는 흰 띠 */}
        {[0.34, 0.67].map((f) => (
          <mesh key={f} position={[0, t.h * f, 0]} castShadow>
            <cylinderGeometry args={[t.r + 0.15, t.r + 0.15, 0.7, 14]} />
            <meshLambertMaterial color={PALETTE.band} flatShading />
          </mesh>
        ))}
        {/* 탑 창 — 둘레를 따라 */}
        <Instances limit={28}>
          <boxGeometry args={[1.5, 2.2, 0.25]} />
          <meshLambertMaterial color={PALETTE.windowGlass} flatShading />
          {Array.from({ length: 20 }, (_, i) => {
            const ring = Math.floor(i / 10)
            const a = ((i % 10) / 10) * Math.PI * 2
            return (
              <Instance
                key={i}
                position={[
                  Math.sin(a) * (t.r + 0.05),
                  t.h * (0.2 + ring * 0.33),
                  Math.cos(a) * (t.r + 0.05),
                ]}
                rotation={[0, a, 0]}
              />
            )
          })}
        </Instances>
        {/* 은색 돔 */}
        <mesh position={[0, t.h, 0]} castShadow>
          <sphereGeometry args={[t.r + 0.6, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
          <meshLambertMaterial color={PALETTE.dome} flatShading />
        </mesh>
        <mesh position={[0, t.h + t.r + 1.4, 0]} castShadow>
          <cylinderGeometry args={[0.12, 0.12, 2.4, 6]} />
          <meshLambertMaterial color={PALETTE.dome} flatShading />
        </mesh>
      </group>
    </group>
  )
}

/**
 * 강당 — 빨간 반원통(아치) 지붕 별동.
 *
 * 항공뷰에서 학교 서북쪽에 있는 그 빨간 통 지붕입니다.
 * 이 형태 하나로 "체육관/강당"이라는 게 바로 읽힙니다.
 */
export function AssemblyHall() {
  const h = LAYOUT.hall
  return (
    <group position={[h.x, 0, h.z]} rotation={[0, h.rotY ?? 0, 0]}>
      <mesh position={[0, h.h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[h.w, h.h, h.d]} />
        <meshLambertMaterial color={PALETTE.hallWall} flatShading />
      </mesh>
      <mesh position={[0, 0.6, 0]}>
        <boxGeometry args={[h.w + 0.1, 1.2, h.d + 0.1]} />
        <meshLambertMaterial color={PALETTE.baseboard} flatShading />
      </mesh>

      {/* 반원통 지붕 — 원기둥을 반만 잘라 눕힙니다.
          축이 X를 향하도록 Z축으로 90° 돌립니다 */}
      <mesh
        position={[0, h.h, 0]}
        rotation={[0, 0, Math.PI / 2]}
        castShadow
      >
        <cylinderGeometry args={[h.d / 2 + 0.5, h.d / 2 + 0.5, h.w + 1, 16, 1, false, 0, Math.PI]} />
        <meshLambertMaterial color={PALETTE.hallRoof} flatShading side={2} />
      </mesh>

      <Instances limit={12} position={[0, 0, h.d / 2 + 0.07]}>
        <boxGeometry args={[2.4, 1.6, 0.1]} />
        <meshLambertMaterial color={PALETTE.windowGlass} flatShading />
        {[-9, -3, 3, 9].map((x) => (
          <Instance key={x} position={[x, 5.2, 0]} />
        ))}
      </Instances>

      {/* 남쪽 정면 입구 — 캐노피 + 유리문 + 계단.
          hall 은 rotY 로 90° 돌아가 있어, 이 그룹의 -X 면이 실제 남쪽입니다. */}
      <group position={[-h.w / 2, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        {/* 캐노피 지붕 */}
        <mesh position={[0, 3.4, 1.7]} castShadow>
          <boxGeometry args={[9, 0.4, 3.4]} />
          <meshLambertMaterial color={PALETTE.roofDark} flatShading />
        </mesh>
        {/* 캐노피를 받치는 기둥 */}
        {[-3.6, 3.6].map((x) => (
          <mesh key={x} position={[x, 1.7, 3.0]} castShadow>
            <boxGeometry args={[0.4, 3.4, 0.4]} />
            <meshLambertMaterial color={PALETTE.pillar} flatShading />
          </mesh>
        ))}
        {/* 유리 출입문 */}
        <mesh position={[0, 1.5, 0.08]}>
          <boxGeometry args={[4.2, 3, 0.12]} />
          <meshLambertMaterial color={PALETTE.windowGlass} flatShading />
        </mesh>
        {/* 문 옆 창 */}
        {[-6, 6].map((x) => (
          <mesh key={x} position={[x, 2, 0.06]}>
            <boxGeometry args={[2.4, 2.6, 0.1]} />
            <meshLambertMaterial color={PALETTE.windowGlass} flatShading />
          </mesh>
        ))}
        {/* 계단 */}
        {[0, 1, 2].map((i) => (
          <mesh key={i} position={[0, 0.12 + i * 0.16, 2.3 + i * 0.5]} receiveShadow>
            <boxGeometry args={[8 - i * 0.4, 0.16, 1]} />
            <meshLambertMaterial color={PALETTE.band} flatShading />
          </mesh>
        ))}
      </group>
    </group>
  )
}
