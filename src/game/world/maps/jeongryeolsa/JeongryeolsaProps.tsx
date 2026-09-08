import { Instances, Instance } from '@react-three/drei'
import { PALETTE } from '@/lib/palette'
import { LAYOUT } from './layout'

/**
 * 정렬사 조형물 — 홍살문·유물전시관·사당.
 * 문평면 소충사와 같은 조선시대 팔레트(흙벽·기와·단청)를 그대로 씁니다.
 */

/** 기와지붕 — 처마가 살짝 들린 맞배지붕. 다른 맵의 TileRoof와 같은 형태입니다 */
function TileRoof({ w, d, y, color = PALETTE.tileRoof }: { w: number; d: number; y: number; color?: string }) {
  return (
    <>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0, y, (side * d) / 4]} rotation={[(side * -Math.PI) / 7, 0, 0]} castShadow>
          <boxGeometry args={[w + 1.2, 0.3, d / 2 + 1]} />
          <meshLambertMaterial color={color} flatShading />
        </mesh>
      ))}
      <mesh position={[0, y + 0.28, 0]} castShadow>
        <boxGeometry args={[w + 1.4, 0.22, 0.5]} />
        <meshLambertMaterial color={PALETTE.tileRoofLight} flatShading />
      </mesh>
    </>
  )
}

/** 홍살문 — 사당·서원 입구에 세우는 붉은 화살 문. 기둥 사이로 지나갈 수 있습니다 */
export function Hongsalmun() {
  const { x, z } = LAYOUT.hongsalmun
  return (
    <group position={[x, 0, z]}>
      {[-1.6, 1.6].map((dx) => (
        <mesh key={dx} position={[dx, 2.2, 0]} castShadow>
          <boxGeometry args={[0.28, 4.4, 0.28]} />
          <meshLambertMaterial color={PALETTE.dancheongRed} flatShading />
        </mesh>
      ))}
      <mesh position={[0, 4.3, 0]} castShadow>
        <boxGeometry args={[3.6, 0.16, 0.16]} />
        <meshLambertMaterial color={PALETTE.dancheongRed} flatShading />
      </mesh>
      <Instances limit={9}>
        <boxGeometry args={[0.06, 1.7, 0.06]} />
        <meshLambertMaterial color={PALETTE.dancheongRed} flatShading />
        {Array.from({ length: 9 }, (_, i) => (
          <Instance key={i} position={[-1.4 + i * 0.35, 3.5, 0]} />
        ))}
      </Instances>
      <mesh position={[0, 4.55, 0]}>
        <coneGeometry args={[0.12, 0.5, 4]} />
        <meshLambertMaterial color={PALETTE.dancheongRed} flatShading />
      </mesh>
    </group>
  )
}

/** [구역 1] 유물전시관 — 김천일 선생의 유품과 의병 기록을 전시합니다 */
export function ExhibitHall() {
  const e = LAYOUT.exhibit
  return (
    <group position={[e.x, 0, e.z]}>
      <mesh position={[0, e.h * 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[e.w, e.h * 0.62, e.d]} />
        <meshLambertMaterial color={PALETTE.hanokWall} flatShading />
      </mesh>
      <Instances limit={4} position={[0, e.h * 0.31, e.d / 2 + 0.05]}>
        <boxGeometry args={[0.34, e.h * 0.66, 0.34]} />
        <meshLambertMaterial color={PALETTE.hanokWood} flatShading />
        {[-e.w / 2 + 0.5, -e.w / 6, e.w / 6, e.w / 2 - 0.5].map((x) => (
          <Instance key={x} position={[x, 0, 0]} />
        ))}
      </Instances>
      {/* 유물장 — 전면 유리 진열장을 암시 */}
      <mesh position={[0, e.h * 0.28, e.d / 2 + 0.07]}>
        <boxGeometry args={[e.w * 0.5, e.h * 0.28, 0.03]} />
        <meshLambertMaterial color={PALETTE.windowGlass} flatShading />
      </mesh>
      <TileRoof w={e.w} d={e.d} y={e.h * 0.72} />
    </group>
  )
}

/**
 * [구역 2] 사당(정렬사) — 김천일 의병장과 아들 김상건, 양산숙, 임회,
 * 이용재 등 충절 5위의 위패를 모신 본전. 5개의 위패를 나란히 두어
 * "다섯 분"이라는 걸 눈으로 세어 볼 수 있게 했습니다.
 */
export function Shrine() {
  const s = LAYOUT.shrine
  return (
    <group position={[s.x, 0, s.z]}>
      {/* 단 — 한 계단 높인 기단 */}
      <mesh position={[0, 0.4, 0]} receiveShadow castShadow>
        <boxGeometry args={[s.w + 2, 0.8, s.d + 2]} />
        <meshLambertMaterial color={PALETTE.stone} flatShading />
      </mesh>
      <mesh position={[0, 0.8 + s.h * 0.34, 0]} castShadow receiveShadow>
        <boxGeometry args={[s.w, s.h * 0.5, s.d]} />
        <meshLambertMaterial color={PALETTE.dancheongGreen} flatShading />
      </mesh>
      {/* 단청 기둥 */}
      {[-s.w / 2 + 1, -s.w / 4, 0, s.w / 4, s.w / 2 - 1].map((x) => (
        <mesh key={x} position={[x, 0.8 + s.h * 0.19, s.d / 2 + 0.06]} castShadow>
          <boxGeometry args={[0.4, s.h * 0.42, 0.4]} />
          <meshLambertMaterial color={PALETTE.dancheongRed} flatShading />
        </mesh>
      ))}
      <TileRoof w={s.w} d={s.d} y={0.8 + s.h * 0.62} />
      {/* 위패 5기 — 나란히 */}
      {[-2, -1, 0, 1, 2].map((i) => (
        <group key={i} position={[i * 1.4, 0.8, s.d / 2 - 1.5]}>
          <mesh position={[0, 0.55, 0]} castShadow>
            <boxGeometry args={[0.06, 1.1, 0.4]} />
            <meshLambertMaterial color={PALETTE.hanokWood} flatShading />
          </mesh>
          <mesh position={[0, 1.16, 0]} castShadow>
            <boxGeometry args={[0.08, 0.12, 0.44]} />
            <meshLambertMaterial color={PALETTE.dragonGold} flatShading />
          </mesh>
        </group>
      ))}
    </group>
  )
}

/**
 * 의병 훈련 모닥불 — 사당 앞마당. 미니게임을 받기 전에는 그냥 모닥불이고,
 * 받은 뒤에는 이 자리에서 깃발·횃불 모으기 게임이 열립니다.
 */
export function Bonfire() {
  const { x, z } = LAYOUT.bonfire
  return (
    <group position={[x, 0, z]}>
      {[0, 1, 2, 3].map((i) => (
        <mesh key={i} position={[0, 0.15, 0]} rotation={[0, (i / 4) * Math.PI, 0]} castShadow>
          <boxGeometry args={[1.6, 0.14, 0.16]} />
          <meshLambertMaterial color={PALETTE.trunk} flatShading />
        </mesh>
      ))}
      <mesh position={[0, 0.55, 0]} castShadow>
        <coneGeometry args={[0.36, 0.9, 8]} />
        <meshBasicMaterial color={PALETTE.steelYellow} />
      </mesh>
      <mesh position={[0, 0.4, 0]} castShadow>
        <coneGeometry args={[0.44, 0.6, 8]} />
        <meshBasicMaterial color={PALETTE.mutedRed} />
      </mesh>
    </group>
  )
}
