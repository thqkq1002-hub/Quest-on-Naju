import { Html, Instance, Instances } from '@react-three/drei'
import { PALETTE } from '@/lib/palette'
import { NaDaeyongBody } from '../../bodies'
import { LAYOUT, PINES } from './layout'

const label: React.CSSProperties = {
  whiteSpace: 'nowrap',
  color: '#4a3620',
  fontSize: 20,
  fontWeight: 700,
  textShadow: '0 1px 6px rgba(255,247,224,.8)',
  pointerEvents: 'none',
}

/**
 * 문평면 조형물 — 나대용 장군 유적.
 *
 * 흙벽·기와·단청의 고재색으로 통일합니다. 다시면의 벽돌·유리와도,
 * 빛가람동의 유리·콘크리트와도 다른 세 번째 미술 방향입니다.
 * → layout.ts 상단 고증 메모.
 */

/** 기와지붕 한 채 분량 — 처마가 살짝 들린 맞배지붕 */
function TileRoof({ w, d, y, color = PALETTE.tileRoof }: { w: number; d: number; y: number; color?: string }) {
  return (
    <>
      {[-1, 1].map((side) => (
        <mesh key={side} position={[0, y, (side * d) / 4]} rotation={[(side * -Math.PI) / 7, 0, 0]} castShadow>
          <boxGeometry args={[w + 1.2, 0.3, d / 2 + 1]} />
          <meshLambertMaterial color={color} flatShading />
        </mesh>
      ))}
      {/* 용마루 — 지붕 꼭대기 능선 */}
      <mesh position={[0, y + 0.28, 0]} castShadow>
        <boxGeometry args={[w + 1.4, 0.22, 0.5]} />
        <meshLambertMaterial color={PALETTE.tileRoofLight} flatShading />
      </mesh>
    </>
  )
}

/** 나대용 장군 생가 — 흙벽 한옥, 마당을 두른 낮은 담장 */
export function Birthplace() {
  const b = LAYOUT.birthplace
  return (
    <group position={[b.x, 0, b.z]}>
      {/* 몸체 */}
      <mesh position={[0, b.h * 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[b.w, b.h * 0.62, b.d]} />
        <meshLambertMaterial color={PALETTE.hanokWall} flatShading />
      </mesh>
      {/* 나무 기둥 — 정면에 드러난 것만 */}
      <Instances limit={5} position={[0, b.h * 0.31, b.d / 2 + 0.05]}>
        <boxGeometry args={[0.34, b.h * 0.66, 0.34]} />
        <meshLambertMaterial color={PALETTE.hanokWood} flatShading />
        {[-b.w / 2 + 0.5, -b.w / 4, 0, b.w / 4, b.w / 2 - 0.5].map((x) => (
          <Instance key={x} position={[x, 0, 0]} />
        ))}
      </Instances>
      <TileRoof w={b.w} d={b.d} y={b.h * 0.72} />
      {/* 마당 담장 — 나지막한 흙담 */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (b.w / 2 + 3), 0.5, b.d / 2 + 3]} castShadow>
          <boxGeometry args={[b.w * 0.5, 1, 0.5]} />
          <meshLambertMaterial color={PALETTE.hanokWall} flatShading />
        </mesh>
      ))}
    </group>
  )
}

/**
 * 소충사 문루 — 답사 영상에서 확인되는 실제 2층 대문. 현판을 건 붉은
 * 문루로, 단순한 홍살문보다 격식 있는 사당 정문입니다. 가운데 어간으로
 * 지나가고, 양쪽 협칸은 벽으로 막혀 있습니다.
 */
export function SochungsaGate() {
  const g = LAYOUT.sochungsaGate
  const wingX = 2.4
  const wingW = 1.8
  return (
    <group position={[g.x, 0, g.z]}>
      {[-wingX, wingX].map((dx) => (
        <mesh key={dx} position={[dx, g.h * 0.4, 0]} castShadow receiveShadow>
          <boxGeometry args={[wingW, g.h * 0.8, g.d]} />
          <meshLambertMaterial color={PALETTE.dancheongRed} flatShading />
        </mesh>
      ))}
      {/* 어간 기둥 */}
      {[-1.1, 1.1].map((dx) => (
        <mesh key={dx} position={[dx, g.h * 0.42, 0]} castShadow>
          <boxGeometry args={[0.3, g.h * 0.84, g.d - 0.3]} />
          <meshLambertMaterial color={PALETTE.hanokWood} flatShading />
        </mesh>
      ))}
      {/* 2층 누각 */}
      <mesh position={[0, g.h * 0.8, 0]} castShadow>
        <boxGeometry args={[g.w * 0.92, g.h * 0.3, g.d * 0.82]} />
        <meshLambertMaterial color={PALETTE.dancheongGreen} flatShading />
      </mesh>
      <TileRoof w={g.w} d={g.d + 1} y={g.h + 0.3} />
      {/* 현판 */}
      <mesh position={[0, g.h * 0.55, g.d / 2 + 0.05]}>
        <boxGeometry args={[1.8, 0.6, 0.06]} />
        <meshLambertMaterial color="#1c1712" flatShading />
      </mesh>
      <Html position={[0, g.h + 1.4, g.d / 2 + 0.4]} center distanceFactor={54} zIndexRange={[10, 0]}>
        <div style={label}>소충사 문루</div>
      </Html>
    </group>
  )
}

/** 소충사 — 나대용 장군의 위패를 모신 사당. 단청 기둥 + 문루 */
export function Sochungsa() {
  const s = LAYOUT.sochungsa
  return (
    <group position={[s.x, 0, s.z]}>
      {/* 사당 몸체 */}
      <mesh position={[0, s.h * 0.42, 0]} castShadow receiveShadow>
        <boxGeometry args={[s.w, s.h * 0.5, s.d]} />
        <meshLambertMaterial color={PALETTE.dancheongGreen} flatShading />
      </mesh>
      {/* 단청 기둥 */}
      <Instances limit={4} position={[0, s.h * 0.21, s.d / 2 + 0.04]}>
        <boxGeometry args={[0.36, s.h * 0.46, 0.36]} />
        <meshLambertMaterial color={PALETTE.dancheongRed} flatShading />
        {[-s.w / 2 + 0.5, -s.w / 6, s.w / 6, s.w / 2 - 0.5].map((x) => (
          <Instance key={x} position={[x, 0, 0]} />
        ))}
      </Instances>
      <TileRoof w={s.w} d={s.d} y={s.h * 0.6} />
      {/* 위패를 암시하는 작은 단 */}
      <mesh position={[0, 0.5, s.d / 2 - 1]} castShadow>
        <boxGeometry args={[1.6, 1, 0.6]} />
        <meshLambertMaterial color={PALETTE.hanokWood} flatShading />
      </mesh>
    </group>
  )
}

/** 거북선 — 등딱지 모양 덮개(쇠송곳 점점이) + 용머리 이물 */
function TurtleShip() {
  const len = 9
  const beam = 3.2
  return (
    <group position={[0, 0.9, 0]}>
      {/* 선체 */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[len, 1.3, beam]} />
        <meshLambertMaterial color={PALETTE.changseonHull} flatShading />
      </mesh>
      {/* 등딱지 덮개 — 둥근 지붕 */}
      <mesh position={[0, 1.15, 0]} castShadow>
        <cylinderGeometry args={[beam / 2 + 0.2, beam / 2 + 0.2, len - 1, 10, 1, false, 0, Math.PI]} />
        <meshLambertMaterial color={PALETTE.turtleShell} flatShading side={2} />
      </mesh>
      {/* 쇠송곳 — 덮개 위에 점점이 */}
      <Instances limit={18}>
        <coneGeometry args={[0.09, 0.34, 5]} />
        <meshLambertMaterial color="#2b2b2b" flatShading />
        {Array.from({ length: 18 }, (_, i) => {
          const row = Math.floor(i / 6)
          const col = i % 6
          const a = (col / 5) * Math.PI
          const r = beam / 2 + 0.22
          return (
            <Instance
              key={i}
              position={[-3.2 + row * 3.2, 1.15 + Math.cos(a) * r, Math.sin(a) * r]}
              rotation={[0, 0, a]}
            />
          )
        })}
      </Instances>
      {/* 용머리 이물 */}
      <mesh position={[len / 2 + 0.7, 0.5, 0]} castShadow>
        <boxGeometry args={[1.4, 1.1, 1]} />
        <meshLambertMaterial color={PALETTE.turtleShellDark} flatShading />
      </mesh>
      <mesh position={[len / 2 + 1.5, 0.55, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <coneGeometry args={[0.5, 1.2, 6]} />
        <meshLambertMaterial color={PALETTE.dragonGold} flatShading />
      </mesh>
      {/* 고물 — 살짝 치켜든 꼬리 */}
      <mesh position={[-len / 2 - 0.4, 0.75, 0]} rotation={[0, 0, 0.4]} castShadow>
        <boxGeometry args={[1, 0.9, beam - 0.4]} />
        <meshLambertMaterial color={PALETTE.changseonHull} flatShading />
      </mesh>
    </group>
  )
}

/** 거북선 건조 체험장 — 작은 개천 위에 거북선을 띄워 뒀습니다 */
export function Shipyard() {
  const s = LAYOUT.shipyard
  return (
    <group position={[s.x, 0, s.z]}>
      <mesh position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[s.pondR, 36]} />
        <meshLambertMaterial color={PALETTE.river} flatShading />
      </mesh>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={0.75}>
        <circleGeometry args={[s.pondR, 36]} />
        <meshLambertMaterial color={PALETTE.riverDark} flatShading />
      </mesh>
      {/* 목재 선착 데크 — 남쪽 가장자리 */}
      <mesh position={[0, 0.4, s.pondR - 1]} receiveShadow castShadow>
        <boxGeometry args={[8, 0.5, 3]} />
        <meshLambertMaterial color={PALETTE.hanokWood} flatShading />
      </mesh>
      <TurtleShip />
    </group>
  )
}

/** 창선 — 판옥선보다 좁고 낮은, 칼날을 꽂은 돌격선 */
function ChangseonBoat() {
  const len = 6.4
  const beam = 1.7
  return (
    <group position={[0, 0.6, 0]}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={[len, 0.9, beam]} />
        <meshLambertMaterial color={PALETTE.changseonHull} flatShading />
      </mesh>
      {/* 뱃전에 꽂은 칼날 — 양옆으로 촘촘히 */}
      {[-beam / 2 - 0.03, beam / 2 + 0.03].map((dz) => (
        <Instances key={dz} limit={9} position={[0, 0.75, dz]}>
          <coneGeometry args={[0.08, 0.5, 4]} />
          <meshLambertMaterial color="#c8ccd0" flatShading />
          {Array.from({ length: 9 }, (_, i) => (
            <Instance key={i} position={[-2.8 + i * 0.7, 0, 0]} rotation={[Math.PI / 2, 0, 0]} />
          ))}
        </Instances>
      ))}
      {/* 낮은 돛대 */}
      <mesh position={[0, 2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.1, 3, 6]} />
        <meshLambertMaterial color={PALETTE.hanokWood} flatShading />
      </mesh>
      <mesh position={[len / 2 + 0.3, 0.55, 0]} rotation={[0, 0, -Math.PI / 2]} castShadow>
        <coneGeometry args={[0.35, 0.9, 6]} />
        <meshLambertMaterial color={PALETTE.dragonGold} flatShading />
      </mesh>
    </group>
  )
}

/** 신형 군함 창선 연구소 — 작업장 한 채 + 완성된 창선 한 척 */
export function ChangseonWorkshop() {
  const c = LAYOUT.changseon
  return (
    <group position={[c.x, 0, c.z]}>
      <mesh position={[0, c.h * 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[c.w, c.h * 0.6, c.d]} />
        <meshLambertMaterial color={PALETTE.hanokWall} flatShading />
      </mesh>
      <Instances limit={4} position={[0, c.h * 0.3, c.d / 2 + 0.04]}>
        <boxGeometry args={[0.34, c.h * 0.64, 0.34]} />
        <meshLambertMaterial color={PALETTE.hanokWood} flatShading />
        {[-c.w / 2 + 0.5, -c.w / 6, c.w / 6, c.w / 2 - 0.5].map((x) => (
          <Instance key={x} position={[x, 0, 0]} />
        ))}
      </Instances>
      <TileRoof w={c.w} d={c.d} y={c.h * 0.68} />
      {/* 작업장 앞마당에 세워 둔 완성품 */}
      <group position={[0, 0, c.d / 2 + 7]}>
        <ChangseonBoat />
      </group>
    </group>
  )
}

/** 소나무 — 다시면 향나무보다 짙고 옹이진 실루엣 */
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

/**
 * 나대용 장군 동상 — 답사·관련 영상에서 확인되는 장군상을 재구성.
 * 사당의 살아 있는 NPC들과 달리 장군 본인은 이 동상으로만 등장합니다.
 */
export function NaDaeyongStatue() {
  const { x, z, h } = LAYOUT.statue
  return (
    <group position={[x, 0, z]}>
      <mesh position={[0, h * 0.22, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.6, h * 0.44, 1.6]} />
        <meshLambertMaterial color={PALETTE.stone} flatShading />
      </mesh>
      <mesh position={[0, h * 0.46, 0]} castShadow>
        <boxGeometry args={[1.9, h * 0.06, 1.9]} />
        <meshLambertMaterial color={PALETTE.stoneDark} flatShading />
      </mesh>
      <group position={[0, h * 0.49, 0]} scale={1.3}>
        <NaDaeyongBody />
      </group>
      <Html position={[0, h + 1.6, 0]} center distanceFactor={44} zIndexRange={[10, 0]}>
        <div style={label}>나대용 장군 동상</div>
      </Html>
    </group>
  )
}

/** 소충사 진입 돌계단 — 답사 영상 속, 문루까지 이어지는 넓은 돌길을 재구성 */
export function SochungsaStair() {
  const g = LAYOUT.sochungsaGate
  const len = 14
  return (
    <mesh position={[g.x, 0.03, g.z + g.d / 2 + len / 2]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[5, len]} />
      <meshLambertMaterial color={PALETTE.stone} flatShading />
    </mesh>
  )
}
