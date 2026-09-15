import { Html, Instances, Instance } from '@react-three/drei'
import { PALETTE } from '@/lib/palette'
import { KimCheonilBody } from '../../bodies'
import { LAYOUT, PINES } from './layout'

/**
 * 정렬사 조형물 — 홍살문·외삼문·유물전시관·사당·동상·사적비.
 * 문평면 소충사와 같은 조선시대 팔레트(흙벽·기와·단청)를 그대로 씁니다.
 */

const label: React.CSSProperties = {
  whiteSpace: 'nowrap',
  color: '#4a3620',
  fontSize: 18,
  fontWeight: 700,
  textShadow: '0 1px 6px rgba(255,247,224,.8)',
  pointerEvents: 'none',
}

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

/**
 * 외삼문 — 홍살문을 지나 안마당으로 들어서는 세 칸 솟을대문.
 * 가운데 어간은 뚫려 있고 양쪽 협칸은 흙벽으로 막혀, 문 사이로만 지나갈 수 있습니다.
 */
export function Oesammun() {
  const g = LAYOUT.oesammun
  const wingX = 2.5
  const wingW = 1.9
  return (
    <group position={[g.x, 0, g.z]}>
      {/* 양쪽 협칸 벽 */}
      {[-wingX, wingX].map((dx) => (
        <mesh key={dx} position={[dx, g.h * 0.42, 0]} castShadow receiveShadow>
          <boxGeometry args={[wingW, g.h * 0.84, g.d]} />
          <meshLambertMaterial color={PALETTE.hanokWall} flatShading />
        </mesh>
      ))}
      {/* 어간(가운데 문) 기둥 */}
      {[-1.3, 1.3].map((dx) => (
        <mesh key={dx} position={[dx, g.h * 0.44, 0]} castShadow>
          <boxGeometry args={[0.32, g.h * 0.88, g.d - 0.2]} />
          <meshLambertMaterial color={PALETTE.dancheongRed} flatShading />
        </mesh>
      ))}
      {/* 문 위 홍살 — 어간 상부를 장식합니다 */}
      <Instances limit={7}>
        <boxGeometry args={[0.05, g.h * 0.32, 0.05]} />
        <meshLambertMaterial color={PALETTE.dancheongRed} flatShading />
        {Array.from({ length: 7 }, (_, i) => (
          <Instance key={i} position={[-1.1 + i * 0.37, g.h * 0.72, 0]} />
        ))}
      </Instances>
      {/* 맞배지붕 — 세 칸 전체를 덮습니다 */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0, g.h + side * -0.02, (side * (g.d + 1.6)) / 4]} rotation={[(side * -Math.PI) / 6.4, 0, 0]} castShadow>
          <boxGeometry args={[g.w + 1, 0.32, (g.d + 1.6) / 2 + 1]} />
          <meshLambertMaterial color={PALETTE.tileRoof} flatShading />
        </mesh>
      ))}
      <mesh position={[0, g.h + 0.3, 0]} castShadow>
        <boxGeometry args={[g.w + 1.2, 0.24, 0.55]} />
        <meshLambertMaterial color={PALETTE.tileRoofLight} flatShading />
      </mesh>
      <Html position={[0, g.h + 1.2, g.d / 2 + 0.4]} center distanceFactor={44} zIndexRange={[10, 0]}>
        <div style={label}>외삼문</div>
      </Html>
    </group>
  )
}

/**
 * 김천일 장군 동상 — 답사 영상에서 확인되는 청동상을 재구성. 갑옷 입은
 * 인물상은 사당 NPC와 같은 KimCheonilBody를 그대로 키워 써서, "그 사람을
 * 기리는 상"이라는 게 한눈에 이어지도록 했습니다. 돌 좌대 위에 세웁니다.
 */
export function KimCheonilStatue() {
  const { x, z, h } = LAYOUT.statue
  return (
    <group position={[x, 0, z]}>
      {/* 돌 좌대 */}
      <mesh position={[0, h * 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, h * 0.44, 1.6]} />
        <meshLambertMaterial color={PALETTE.stone} flatShading />
      </mesh>
      <mesh position={[0, h * 0.46, 0]} castShadow>
        <boxGeometry args={[1.9, h * 0.06, 1.9]} />
        <meshLambertMaterial color={PALETTE.stoneDark} flatShading />
      </mesh>
      {/* 인물상 — 좌대 위에 올려 실제 크기보다 커 보이게 합니다 */}
      <group position={[0, h * 0.49, 0]} scale={1.3}>
        <KimCheonilBody />
      </group>
      <Html position={[0, h + 1.6, 0]} center distanceFactor={44} zIndexRange={[10, 0]}>
        <div style={label}>김천일 장군 동상</div>
      </Html>
    </group>
  )
}

/**
 * 정렬사 사적비 — 임진왜란과 김천일의 의병 창의를 새긴 번역비.
 * 뒤로는 나지막한 돌 축대를 둘러, 답사 영상 속 비석 배경을 재구성했습니다.
 */
export function Stele() {
  const { x, z, h } = LAYOUT.stele
  const wall = LAYOUT.steleWall
  return (
    <group>
      {/* 비석 뒤 돌 축대 */}
      <Instances limit={5} position={[wall.x, 0, wall.z]}>
        <boxGeometry args={[wall.w / 5, 1.2, 0.5]} />
        <meshLambertMaterial color={PALETTE.stoneDark} flatShading />
        {[0, 1, 2, 3, 4].map((i) => (
          <Instance key={i} position={[-wall.w / 2 + (i + 0.5) * (wall.w / 5), 0.6, 0]} />
        ))}
      </Instances>
      <group position={[x, 0, z]}>
        {/* 비석 좌대 */}
        <mesh position={[0, 0.2, 0]} castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.4, 0.7]} />
          <meshLambertMaterial color={PALETTE.stoneDark} flatShading />
        </mesh>
        {/* 비신 — 위가 살짝 둥근 화강암 비석 */}
        <mesh position={[0, 0.4 + h * 0.45, 0]} castShadow>
          <boxGeometry args={[0.7, h * 0.9, 0.24]} />
          <meshLambertMaterial color={PALETTE.stone} flatShading />
        </mesh>
        <mesh position={[0, 0.4 + h * 0.92, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
          <coneGeometry args={[0.5, 0.3, 4]} />
          <meshLambertMaterial color={PALETTE.stone} flatShading />
        </mesh>
      </group>
    </group>
  )
}

/**
 * 「제2차 진주성 전투도」 — 유물전시관 옆면에 거는 모사도. 김천일이
 * 순절한 마지막 전투를 색면으로 추상화했습니다(불·연기·의병 깃발).
 */
export function ExhibitMural() {
  const { x, z } = LAYOUT.exhibitMural
  return (
    <group position={[x, 2.6, z]} rotation={[0, Math.PI / 2, 0]}>
      {/* 액자 틀 */}
      <mesh castShadow>
        <boxGeometry args={[3.6, 2.4, 0.08]} />
        <meshLambertMaterial color={PALETTE.hanokWood} flatShading />
      </mesh>
      {/* 색면 배경 — 짙은 연기 하늘 */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[3.3, 2.1]} />
        <meshLambertMaterial color={PALETTE.stationCharcoal} flatShading />
      </mesh>
      {/* 불길 */}
      {[-1.1, -0.3, 0.6].map((dx, i) => (
        <mesh key={dx} position={[dx, -0.5 + (i % 2) * 0.2, 0.06]}>
          <planeGeometry args={[0.9, 0.7]} />
          <meshLambertMaterial color={i % 2 ? PALETTE.mutedRed : PALETTE.steelYellow} flatShading />
        </mesh>
      ))}
      {/* 성벽 실루엣 */}
      <mesh position={[0, -0.85, 0.06]}>
        <planeGeometry args={[3.1, 0.6]} />
        <meshLambertMaterial color={PALETTE.tileRoof} flatShading />
      </mesh>
      {/* 의병 깃발 무리 */}
      {[-1.2, -0.5, 0.3, 1.1].map((dx, i) => (
        <group key={dx} position={[dx, 0.2, 0.07]}>
          <mesh>
            <boxGeometry args={[0.03, 1, 0.02]} />
            <meshLambertMaterial color={PALETTE.hanokWood} flatShading />
          </mesh>
          <mesh position={[0.16, 0.3, 0]}>
            <planeGeometry args={[0.32, 0.22]} />
            <meshLambertMaterial color={i % 2 ? PALETTE.dragonGold : PALETTE.uniformNavy} flatShading />
          </mesh>
        </group>
      ))}
      <Html position={[0, -1.35, 0.1]} center distanceFactor={40} zIndexRange={[10, 0]}>
        <div style={{ ...label, fontSize: 14 }}>제2차 진주성 전투도</div>
      </Html>
    </group>
  )
}

/** 사당 뒷산 소나무 숲 */
export function PineTrees() {
  return (
    <Instances limit={PINES.length}>
      <coneGeometry args={[1.3, 3.2, 6]} />
      <meshLambertMaterial color={PALETTE.pineDark} flatShading />
      {PINES.map(([x, z, s], i) => (
        <Instance key={i} position={[x, 1.6 * s, z]} scale={s} />
      ))}
    </Instances>
  )
}
