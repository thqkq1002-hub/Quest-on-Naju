import { Html, Instance, Instances } from '@react-three/drei'
import { PALETTE } from '@/lib/palette'
import { GATE_GAP, HANOK_VILLAGE, LAYOUT, WALL_HALF, type GateId } from './layout'

/**
 * 나주읍성 조형물 — 성곽·4대문·금성관·망화루·동헌·초가 민가.
 *
 * 문평면과 같은 조선시대 팔레트(흙벽·기와·단청)를 그대로 씁니다. 같은
 * 왕조, 같은 재질감이라 새 색을 만들 이유가 없습니다.
 */

const label: React.CSSProperties = {
  whiteSpace: 'nowrap',
  color: '#4a3620',
  fontSize: 20,
  fontWeight: 700,
  textShadow: '0 1px 6px rgba(255,247,224,.8)',
  pointerEvents: 'none',
}

/** 기와지붕 — 처마가 살짝 들린 맞배지붕. 문평면 TileRoof와 같은 형태입니다 */
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

const SEG_LEN = WALL_HALF - GATE_GAP
const SEG_OFF = (WALL_HALF + GATE_GAP) / 2
const WALL_H = 3.6

/** 성곽 벽체 한 토막 — 아랫단 축대(짙은 돌) + 윗단 여장(밝은 돌) */
function WallSeg({ x, z, w, d }: { x: number; z: number; w: number; d: number }) {
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, WALL_H * 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[w, WALL_H * 0.84, d]} />
        <meshLambertMaterial color={PALETTE.stoneDark} flatShading />
      </mesh>
      {/* 여장 — 몸을 가리던 톱니 모양 흉벽을 낮은 띠로 단순화 */}
      <mesh position={[0, WALL_H * 0.92, 0]} castShadow>
        <boxGeometry args={[w, WALL_H * 0.22, d + 0.3]} />
        <meshLambertMaterial color={PALETTE.stone} flatShading />
      </mesh>
    </group>
  )
}

/** 성곽 네 변 — 문이 뚫린 자리를 빼고 여덟 토막을 두릅니다 */
export function FortressWall() {
  return (
    <>
      <WallSeg x={-SEG_OFF} z={WALL_HALF} w={SEG_LEN} d={3} />
      <WallSeg x={SEG_OFF} z={WALL_HALF} w={SEG_LEN} d={3} />
      <WallSeg x={-SEG_OFF} z={-WALL_HALF} w={SEG_LEN} d={3} />
      <WallSeg x={SEG_OFF} z={-WALL_HALF} w={SEG_LEN} d={3} />
      <WallSeg x={WALL_HALF} z={-SEG_OFF} w={3} d={SEG_LEN} />
      <WallSeg x={WALL_HALF} z={SEG_OFF} w={3} d={SEG_LEN} />
      <WallSeg x={-WALL_HALF} z={-SEG_OFF} w={3} d={SEG_LEN} />
      <WallSeg x={-WALL_HALF} z={SEG_OFF} w={3} d={SEG_LEN} />
      {/* 성곽 모서리 네 곳 — 빈틈을 메우는 짧은 토막 */}
      {[
        [-WALL_HALF, -WALL_HALF],
        [WALL_HALF, -WALL_HALF],
        [-WALL_HALF, WALL_HALF],
        [WALL_HALF, WALL_HALF],
      ].map(([cx, cz]) => (
        <WallSeg key={`${cx},${cz}`} x={cx} z={cz} w={4} d={4} />
      ))}
    </>
  )
}

/**
 * 문루 — 축대에 홍예문(무지개 모양 아치)을 내고, 그 위에 단청 기둥과
 * 기와지붕을 올린 2층 누각. 남고문·동점문·서성문·북망문 넷 모두 같은
 * 구조를 쓰되, 남고문만 살짝 크게 잡아 "정문"다운 위계를 줍니다.
 */
export function GateTower({ id }: { id: GateId }) {
  const g = LAYOUT.gates[id]
  const big = id === 'namgomun'
  const scale = big ? 1.18 : 1
  // 벽을 마주보도록 회전 — x축 성문은 90도 돌려 문루가 벽과 나란히 서게 합니다
  const rotY = g.axis === 'x' ? Math.PI / 2 : 0
  const archW = GATE_GAP * 2 - 2
  const baseH = WALL_H * 1.05

  return (
    <group position={[g.x, 0, g.z]} rotation={[0, rotY, 0]} scale={scale}>
      {/* 축대 — 가운데 홍예문(아치) 통로를 낸 돌 축대 */}
      <mesh position={[-archW * 0.62, baseH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[archW * 0.75, baseH, 6]} />
        <meshLambertMaterial color={PALETTE.stoneDark} flatShading />
      </mesh>
      <mesh position={[archW * 0.62, baseH / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[archW * 0.75, baseH, 6]} />
        <meshLambertMaterial color={PALETTE.stoneDark} flatShading />
      </mesh>
      <mesh position={[0, baseH * 0.86, 0]} castShadow>
        <boxGeometry args={[archW * 1.9, baseH * 0.3, 6]} />
        <meshLambertMaterial color={PALETTE.stoneDark} flatShading />
      </mesh>
      {/* 아치 통로 안쪽 — 짙게 눌러 굴처럼 보이게 */}
      <mesh position={[0, baseH * 0.35, 0]}>
        <boxGeometry args={[archW * 1.1, baseH * 0.7, 5.8]} />
        <meshLambertMaterial color="#2a241c" flatShading />
      </mesh>

      {/* 문루 — 단청 기둥 + 기와지붕 */}
      <group position={[0, baseH, 0]}>
        <mesh position={[0, 1.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[archW * 1.9, 1.6, 5]} />
          <meshLambertMaterial color={PALETTE.hanokWood} flatShading />
        </mesh>
        {[-archW * 0.8, -archW * 0.27, archW * 0.27, archW * 0.8].map((x) => (
          <mesh key={x} position={[x, 3.4, 2.2]} castShadow>
            <boxGeometry args={[0.32, 2.2, 0.32]} />
            <meshLambertMaterial color={PALETTE.dancheongRed} flatShading />
          </mesh>
        ))}
        <mesh position={[0, 4.6, 0]}>
          <boxGeometry args={[archW * 1.7, 0.4, 4.4]} />
          <meshLambertMaterial color={PALETTE.dancheongGreen} flatShading />
        </mesh>
        <TileRoof w={archW * 1.9} d={6} y={5.4} />
      </group>

      {/* 문 이름 현판 */}
      <mesh position={[0, baseH + 0.4, 3.05]}>
        <boxGeometry args={[2.6, 0.7, 0.08]} />
        <meshLambertMaterial color="#1c1712" flatShading />
      </mesh>
    </group>
  )
}

/**
 * 금성관 — 나주목 관아의 중심 객사. 이 맵에서 가장 큰 단일 건물로,
 * 임금을 상징하는 전패를 모시고 지방관이 절을 올리던 격식 높은 공간입니다.
 */
export function Geumseonggwan() {
  const c = LAYOUT.geumseonggwan
  return (
    <group position={[c.x, 0, c.z]}>
      {/* 월대 — 건물을 한 단 높이는 넓은 기단 */}
      <mesh position={[0, 0.5, 0]} receiveShadow castShadow>
        <boxGeometry args={[c.w + 4, 1, c.d + 4]} />
        <meshLambertMaterial color={PALETTE.stone} flatShading />
      </mesh>
      {/* 몸체 */}
      <mesh position={[0, 1 + c.h * 0.34, 0]} castShadow receiveShadow>
        <boxGeometry args={[c.w, c.h * 0.5, c.d]} />
        <meshLambertMaterial color={PALETTE.hanokWall} flatShading />
      </mesh>
      {/* 정면 기둥 — 격식을 보여 주는 붉은 단청 기둥 줄 */}
      {[-c.w / 2 + 1.2, -c.w / 4, 0, c.w / 4, c.w / 2 - 1.2].map((x) => (
        <mesh key={x} position={[x, 1 + c.h * 0.19, c.d / 2 + 0.06]} castShadow>
          <boxGeometry args={[0.4, c.h * 0.42, 0.4]} />
          <meshLambertMaterial color={PALETTE.dancheongRed} flatShading />
        </mesh>
      ))}
      <mesh position={[0, 1 + c.h * 0.42, 0]}>
        <boxGeometry args={[c.w + 0.4, 0.3, c.d + 0.4]} />
        <meshLambertMaterial color={PALETTE.dancheongGreen} flatShading />
      </mesh>
      {/* 크고 격식 있는 팔작지붕 — 겹처마 느낌으로 두 단을 얹습니다 */}
      <TileRoof w={c.w} d={c.d} y={1 + c.h * 0.62} />
      <TileRoof w={c.w * 0.6} d={c.d * 0.6} y={1 + c.h * 0.86} color={PALETTE.tileRoofLight} />
    </group>
  )
}

/**
 * 나주곰탕집 — 4대문을 다 지키고 나면 금성관 옆에 열리는 보상 가게.
 * 처마 아래 붉은 천 간판을 걸고, 문 앞에 김이 오르는 가마솥을 뒀습니다.
 */
export function GomtangHouse() {
  const g = LAYOUT.gomtangHouse
  return (
    <group position={[g.x, 0, g.z]}>
      <mesh position={[0, g.d * 0.28, 0]} castShadow receiveShadow>
        <boxGeometry args={[g.w, g.d * 0.56, g.d]} />
        <meshLambertMaterial color={PALETTE.hanokWood} flatShading />
      </mesh>
      {/* 통유리 문 */}
      <mesh position={[0, g.d * 0.22, g.d / 2 + 0.03]}>
        <boxGeometry args={[g.w * 0.5, g.d * 0.36, 0.05]} />
        <meshLambertMaterial color={PALETTE.windowGlass} flatShading />
      </mesh>
      <TileRoof w={g.w} d={g.d} y={g.d * 0.6} />
      {/* 처마 아래 걸린 천 간판 — "나주곰탕" */}
      <mesh position={[0, g.d * 0.44, g.d / 2 + 0.1]} castShadow>
        <boxGeometry args={[g.w * 0.62, 0.7, 0.06]} />
        <meshLambertMaterial color={PALETTE.dancheongRed} flatShading />
      </mesh>
      {/* 좌판 가마솥 + 김 */}
      <mesh position={[g.w / 2 + 0.6, 0.5, g.d / 2]} castShadow>
        <cylinderGeometry args={[0.55, 0.65, 0.5, 10]} />
        <meshLambertMaterial color="#2b2b2b" flatShading />
      </mesh>
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[g.w / 2 + 0.55 + (i - 1) * 0.14, 0.95 + i * 0.22, g.d / 2]}>
          <sphereGeometry args={[0.14 - i * 0.025, 6, 6]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.45 - i * 0.1} />
        </mesh>
      ))}
    </group>
  )
}

/**
 * 망화루 — 금성관(객사)의 정문. 답사 영상 속 "객사의 정문인 망화루로
 * 들어가고 있습니다"라는 설명을 그대로 옮겼습니다. 가운데 어간으로
 * 지나가고, 양쪽 협칸은 벽으로 막혀 있습니다.
 */
export function Manghwaru() {
  const g = LAYOUT.manghwaru
  const wingX = 3.6
  const wingW = 2.6
  return (
    <group position={[g.x, 0, g.z]}>
      {/* 양쪽 협칸 벽 */}
      {[-wingX, wingX].map((dx) => (
        <mesh key={dx} position={[dx, g.h * 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[wingW, g.h * 0.8, g.d]} />
          <meshLambertMaterial color={PALETTE.hanokWall} flatShading />
        </mesh>
      ))}
      {/* 어간 기둥 — 단청 */}
      {[-1.7, 1.7].map((dx) => (
        <mesh key={dx} position={[dx, g.h * 0.42, 0]} castShadow>
          <boxGeometry args={[0.4, g.h * 0.84, g.d - 0.3]} />
          <meshLambertMaterial color={PALETTE.dancheongRed} flatShading />
        </mesh>
      ))}
      {/* 2층 누각 — 문루 */}
      <mesh position={[0, g.h * 0.82, 0]} castShadow>
        <boxGeometry args={[g.w * 0.94, g.h * 0.28, g.d * 0.86]} />
        <meshLambertMaterial color={PALETTE.dancheongGreen} flatShading />
      </mesh>
      <TileRoof w={g.w} d={g.d + 1} y={g.h + 0.3} />
      <Html position={[0, g.h + 1.4, g.d / 2 + 0.4]} center distanceFactor={54} zIndexRange={[10, 0]}>
        <div style={label}>망화루</div>
      </Html>
    </group>
  )
}

/** 동헌 — 목사가 정무를 보던 건물. 금성관보다 낮고 수수합니다 */
export function Dongheon() {
  const d = LAYOUT.dongheon
  return (
    <group position={[d.x, 0, d.z]}>
      <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
        <boxGeometry args={[d.w + 2, 0.6, d.d + 2]} />
        <meshLambertMaterial color={PALETTE.stone} flatShading />
      </mesh>
      <mesh position={[0, 0.6 + d.h * 0.36, 0]} castShadow receiveShadow>
        <boxGeometry args={[d.w, d.h * 0.5, d.d]} />
        <meshLambertMaterial color={PALETTE.hanokWall} flatShading />
      </mesh>
      {[-d.w / 2 + 1, -d.w / 6, d.w / 6, d.w / 2 - 1].map((x) => (
        <mesh key={x} position={[x, 0.6 + d.h * 0.19, d.d / 2 + 0.06]} castShadow>
          <boxGeometry args={[0.34, d.h * 0.42, 0.34]} />
          <meshLambertMaterial color={PALETTE.dancheongRed} flatShading />
        </mesh>
      ))}
      <TileRoof w={d.w} d={d.d} y={0.6 + d.h * 0.62} />
      <Html position={[0, 0.6 + d.h + 1, 0]} center distanceFactor={54} zIndexRange={[10, 0]}>
        <div style={label}>동헌</div>
      </Html>
    </group>
  )
}

/** 초가 민가 한 채 — 흙벽에 둥글게 얹은 볏짚 지붕 */
function HanokHouse({ x, z, rotY }: { x: number; z: number; rotY: number }) {
  return (
    <group position={[x, 0, z]} rotation={[0, rotY, 0]}>
      <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.4, 1.4, 2.6]} />
        <meshLambertMaterial color={PALETTE.hanokWall} flatShading />
      </mesh>
      {/* 볏짚 처마 — 벽보다 넓게 둘러 그늘을 드리웁니다 */}
      <mesh position={[0, 1.55, 0]} castShadow>
        <boxGeometry args={[4.1, 0.16, 3.3]} />
        <meshLambertMaterial color={PALETTE.thatchRoofDark} flatShading />
      </mesh>
      {/* 둥근 볏짚 지붕 */}
      <mesh position={[0, 2.15, 0]} castShadow>
        <coneGeometry args={[2.5, 1.5, 9]} />
        <meshLambertMaterial color={PALETTE.thatchRoof} flatShading />
      </mesh>
      {/* 작은 사립문 */}
      <mesh position={[0, 0.55, 1.32]}>
        <boxGeometry args={[0.9, 1.1, 0.06]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
      </mesh>
    </group>
  )
}

/**
 * 초가 민가 마을 — 답사 영상의 항공 재현 장면에서 성 안이 초가지붕
 * 민가로 빽빽했던 모습을 재구성합니다. → layout.ts HANOK_VILLAGE
 */
export function HanokVillage() {
  return (
    <>
      {HANOK_VILLAGE.map((h, i) => (
        <HanokHouse key={i} x={h.x} z={h.z} rotY={h.rotY} />
      ))}
    </>
  )
}

/**
 * 당간지주 — 동점문 안쪽에 남은 돌 깃대 받침 한 쌍. 답사 영상에서
 * "당(깃발)을 걸어 두는 기둥"이라 소개하는 실제 유구를 재구성했습니다.
 */
export function Dangganjiju() {
  const { x, z } = LAYOUT.dangganjiju
  return (
    <group position={[x, 0, z]}>
      <Instances limit={2}>
        <boxGeometry args={[0.4, 2.6, 0.3]} />
        <meshLambertMaterial color={PALETTE.stoneDark} flatShading />
        {[-0.9, 0.9].map((dx) => (
          <Instance key={dx} position={[dx, 1.3, 0]} rotation={[0, 0, dx > 0 ? -0.03 : 0.03]} />
        ))}
      </Instances>
      <Html position={[0, 3, 0]} center distanceFactor={54} zIndexRange={[10, 0]}>
        <div style={{ ...label, fontSize: 16 }}>당간지주</div>
      </Html>
    </group>
  )
}
