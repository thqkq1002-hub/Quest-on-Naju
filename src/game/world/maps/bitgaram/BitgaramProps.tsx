import { Instance, Instances } from '@react-three/drei'
import { PALETTE } from '@/lib/palette'
import { LAYOUT, TREES } from './layout'

/**
 * 빛가람동 조형물.
 *
 * 다시면(다시초등학교, 복암리)의 흙·벽돌·나무 색과 대비되도록
 * 유리·콘크리트·물의 색으로 통일합니다. → layout.ts 상단 고증 메모.
 */

/** 빛가람 호수공원 — 가운데 인공 호수 */
export function Lake() {
  const l = LAYOUT.lake
  return (
    <group position={[l.x, 0, l.z]}>
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[1, 40]} />
        <meshLambertMaterial color={PALETTE.lake} />
      </mesh>
      {/* 실제로는 원이지만 타원으로 늘립니다 */}
      <mesh
        position={[0, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        scale={[l.rx, l.rz, 1]}
        receiveShadow
      >
        <circleGeometry args={[1, 40]} />
        <meshLambertMaterial color={PALETTE.lake} />
      </mesh>
      {/* 안쪽 짙은 테 — 물의 깊이감 */}
      <mesh position={[0, 0.025, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[l.rx * 0.7, l.rz * 0.7, 1]}>
        <circleGeometry args={[1, 36]} />
        <meshLambertMaterial color={PALETTE.lakeDark} />
      </mesh>
      {/* 산책로 — 호수를 두르는 콘크리트 링 */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]} scale={[l.rx + 4, l.rz + 4, 1]}>
        <ringGeometry args={[0.97, 1, 48]} />
        <meshLambertMaterial color={PALETTE.plaza} />
      </mesh>
    </group>
  )
}

/**
 * 빛가람 호수공원 전망대 — 원기둥 몸체 + 전망 데크 + 첨탑.
 * 실제 높이 39.6m를 이 맵에서 가장 높은 구조물로 살렸습니다.
 */
export function Observatory() {
  const o = LAYOUT.observatory
  return (
    <group position={[o.x, 0, o.z]}>
      {/* 몸체 */}
      <mesh position={[0, o.h * 0.42, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[o.r * 0.62, o.r * 0.8, o.h * 0.84, 14]} />
        <meshLambertMaterial color={PALETTE.concrete} flatShading />
      </mesh>
      {/* 유리 띠 — 층마다 */}
      {[0.22, 0.42, 0.62].map((f) => (
        <mesh key={f} position={[0, o.h * f, 0]} castShadow>
          <cylinderGeometry args={[o.r * (0.63 + f * 0.06), o.r * (0.63 + f * 0.06), o.h * 0.05, 14]} />
          <meshLambertMaterial color={PALETTE.glassBlue} flatShading />
        </mesh>
      ))}
      {/* 전망 데크 — 몸체보다 넓게 튀어나온 원판 */}
      <mesh position={[0, o.h * 0.82, 0]} castShadow>
        <cylinderGeometry args={[o.r, o.r, o.h * 0.1, 16]} />
        <meshLambertMaterial color={PALETTE.concreteDark} flatShading />
      </mesh>
      <mesh position={[0, o.h * 0.9, 0]}>
        <cylinderGeometry args={[o.r * 0.92, o.r * 0.92, o.h * 0.14, 16]} />
        <meshLambertMaterial color={PALETTE.glassTeal} flatShading />
      </mesh>
      {/* 첨탑 */}
      <mesh position={[0, o.h * 1.02, 0]} castShadow>
        <cylinderGeometry args={[0.35, o.r * 0.5, o.h * 0.16, 10]} />
        <meshLambertMaterial color={PALETTE.concrete} flatShading />
      </mesh>
      <mesh position={[0, o.h * 1.14, 0]} castShadow>
        <cylinderGeometry args={[0.06, 0.06, o.h * 0.14, 6]} />
        <meshLambertMaterial color="#8a9098" flatShading />
      </mesh>
    </group>
  )
}

/** 한국전력공사 — 유리 외벽 고층 사옥 */
export function KepcoTower() {
  const k = LAYOUT.kepco
  const floors = 9
  const floorH = k.h / floors

  const windows = Array.from({ length: floors }, (_, f) => f)

  return (
    <group position={[k.x, 0, k.z]}>
      <mesh position={[0, k.h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[k.w, k.h, k.d]} />
        <meshLambertMaterial color={PALETTE.kepcoNavy} flatShading />
      </mesh>
      {/* 유리 커튼월 — 정면·후면 통유리 띠 */}
      {[1, -1].map((side) => (
        <Instances key={side} limit={floors} position={[0, 0, (side * k.d) / 2 + side * 0.1]}>
          <boxGeometry args={[k.w - 1.4, floorH * 0.7, 0.1]} />
          <meshLambertMaterial color={PALETTE.glassBlue} flatShading />
          {windows.map((f) => (
            <Instance key={f} position={[0, f * floorH + floorH * 0.55, 0]} />
          ))}
        </Instances>
      ))}
      {/* 옥상 로고 판 — 회사명 대신 전력 상징(번개) */}
      <mesh position={[0, k.h + 0.9, 0]} castShadow>
        <boxGeometry args={[3.2, 1.8, 0.2]} />
        <meshLambertMaterial color={PALETTE.steelYellow} flatShading />
      </mesh>
    </group>
  )
}

/** KENTECH — 낮고 넓은 캠퍼스 건물. 대학 특유의 좌우 대칭 매스 */
export function KentechCampus() {
  const k = LAYOUT.kentech
  return (
    <group position={[k.x, 0, k.z]}>
      {/* 중앙 본관 */}
      <mesh position={[0, k.h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[k.w, k.h, k.d]} />
        <meshLambertMaterial color={PALETTE.concrete} flatShading />
      </mesh>
      {/* 좌우 날개 — 살짝 낮게 */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (k.w / 2 + 5), k.h * 0.36, 0]} castShadow receiveShadow>
          <boxGeometry args={[10, k.h * 0.72, k.d * 0.8]} />
          <meshLambertMaterial color={PALETTE.concreteDark} flatShading />
        </mesh>
      ))}
      {/* 통유리 로비 — 중앙 정면 */}
      <mesh position={[0, k.h * 0.42, k.d / 2 + 0.08]} castShadow>
        <boxGeometry args={[k.w * 0.42, k.h * 0.7, 0.12]} />
        <meshLambertMaterial color={PALETTE.glassTeal} flatShading />
      </mesh>
      {/* 창 — 정면 그리드 */}
      <Instances limit={10} position={[0, k.h * 0.72, k.d / 2 + 0.09]}>
        <boxGeometry args={[2.2, 1.1, 0.06]} />
        <meshLambertMaterial color={PALETTE.glassBlue} flatShading />
        {[-9, -6, -3, 0, 3, 6, 9].map((x) => (
          <Instance key={x} position={[x, 0, 0]} />
        ))}
      </Instances>
      {/* 태양광 패널 — 옥상, 신재생 에너지 대학다운 디테일 */}
      <Instances limit={8} position={[0, k.h + 0.35, -k.d * 0.15]} rotation={[-0.18, 0, 0]}>
        <boxGeometry args={[2.6, 0.08, 1.6]} />
        <meshLambertMaterial color="#2b3a55" flatShading />
        {[-9, -4.5, 0, 4.5].map((x, i) => (
          <Instance key={x} position={[x, 0, i % 2 === 0 ? 0 : 1.8]} />
        ))}
      </Instances>
    </group>
  )
}

/** 전력거래소(KPX) — 낮고 각진 관제센터. 정면에 상황판(발광 스크린)을 얹습니다 */
export function KpxCenter() {
  const k = LAYOUT.kpx
  return (
    <group position={[k.x, 0, k.z]}>
      <mesh position={[0, k.h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[k.w, k.h, k.d]} />
        <meshLambertMaterial color={PALETTE.kpxGraphite} flatShading />
      </mesh>
      {/* 상황판 — 정면 전체를 덮는 발광 스크린 */}
      <mesh position={[0, k.h * 0.55, k.d / 2 + 0.06]} castShadow>
        <boxGeometry args={[k.w * 0.78, k.h * 0.5, 0.1]} />
        <meshBasicMaterial color={PALETTE.kpxScreen} />
      </mesh>
      {/* 스크린 안 그리드 선 — 전력망 다이어그램 느낌만 */}
      <Instances limit={4} position={[0, k.h * 0.55, k.d / 2 + 0.12]}>
        <boxGeometry args={[k.w * 0.7, 0.05, 0.02]} />
        <meshBasicMaterial color="#2b1a0f" />
        {[-0.14, -0.05, 0.05, 0.14].map((f) => (
          <Instance key={f} position={[0, k.h * f, 0]} />
        ))}
      </Instances>
      {/* 옥상 통신탑 — 관제센터다운 안테나 */}
      <mesh position={[k.w / 2 - 1.5, k.h + 1.2, 0]} castShadow>
        <cylinderGeometry args={[0.08, 0.08, 2.4, 6]} />
        <meshLambertMaterial color="#8a9098" flatShading />
      </mesh>
      <mesh position={[k.w / 2 - 1.5, k.h + 2.4, 0]}>
        <sphereGeometry args={[0.22, 8, 6]} />
        <meshBasicMaterial color={PALETTE.kpxScreen} />
      </mesh>
    </group>
  )
}

/** 한국콘텐츠진흥원(KOCCA) — 미디어 파사드가 있는 건물. K-콘텐츠다운 색을 씁니다 */
export function KoccaStudio() {
  const k = LAYOUT.kocca
  return (
    <group position={[k.x, 0, k.z]}>
      <mesh position={[0, k.h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[k.w, k.h, k.d]} />
        <meshLambertMaterial color={PALETTE.concrete} flatShading />
      </mesh>
      {/* 대형 미디어 파사드 — 정면을 감싸는 마젠타 스크린 */}
      <mesh position={[0, k.h * 0.5, k.d / 2 + 0.07]} castShadow>
        <boxGeometry args={[k.w * 0.85, k.h * 0.72, 0.12]} />
        <meshLambertMaterial color={PALETTE.koccaMagenta} flatShading />
      </mesh>
      <mesh position={[0, k.h * 0.5, k.d / 2 + 0.13]}>
        <boxGeometry args={[k.w * 0.7, k.h * 0.5, 0.02]} />
        <meshBasicMaterial color={PALETTE.koccaPurple} />
      </mesh>
      {/* 지붕 챙 — 무대·스튜디오 건물다운 캔틸레버 */}
      <mesh position={[0, k.h + 0.3, k.d * 0.1]} castShadow>
        <boxGeometry args={[k.w + 1.4, 0.5, k.d * 0.85]} />
        <meshLambertMaterial color={PALETTE.concreteDark} flatShading />
      </mesh>
    </group>
  )
}

/** 스마트 라이프 센터 & 도서관 — 목재+유리의 낮고 친근한 시민 공간 */
export function SmartLifeCenter() {
  const s = LAYOUT.smartLife
  return (
    <group position={[s.x, 0, s.z]}>
      <mesh position={[0, s.h / 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[s.w, s.h, s.d]} />
        <meshLambertMaterial color={PALETTE.smartLifeWood} flatShading />
      </mesh>
      {/* 통유리 파사드 */}
      <mesh position={[0, s.h * 0.45, s.d / 2 + 0.06]}>
        <boxGeometry args={[s.w * 0.7, s.h * 0.65, 0.1]} />
        <meshLambertMaterial color={PALETTE.glassTeal} flatShading />
      </mesh>
      {/* 경사 지붕 — 태양광 패널 */}
      <mesh position={[0, s.h + 0.3, 0]} rotation={[-0.12, 0, 0]} castShadow>
        <boxGeometry args={[s.w + 0.6, 0.2, s.d + 0.6]} />
        <meshLambertMaterial color="#2b3a55" flatShading />
      </mesh>
      {/* 입구 옆 화단 — 탄소중립을 상징하는 초록 */}
      {[-1, 1].map((side) => (
        <mesh key={side} position={[side * (s.w / 2 - 1), 0.4, s.d / 2 + 1.2]} castShadow>
          <sphereGeometry args={[0.6, 8, 6]} />
          <meshLambertMaterial color={PALETTE.smartLifeLeaf} flatShading />
        </mesh>
      ))}
    </group>
  )
}

/**
 * 배경 스카이라인 — 실제로 걸어갈 수 있는 범위(BOUNDS) 밖에, 도시 느낌만
 * 주려고 둘러 세운 건물들입니다. 혁신도시는 여기 여섯 거점 말고도 아파트·
 * 오피스가 훨씬 많은 동네라, 배경이 비어 있으면 "도시"가 아니라 "공원"으로
 * 보입니다. 안개 밖으로 잘리지 않을 만큼만(반경 130~230) 두르고, 걸어서는
 * 닿지 않으므로 충돌 박스를 넣지 않습니다.
 *
 * 결정적 의사난수(사인 해시)로 배치합니다 — 다시면의 나무 배치와 같은 이유로,
 * 리렌더마다 건물이 튀면 안 되기 때문입니다.
 */
function hash(n: number): number {
  const h = Math.sin(n * 12.9898) * 43758.5453
  return h - Math.floor(h)
}

const SKYLINE_COLORS = [
  PALETTE.glassBlue,
  PALETTE.glassTeal,
  PALETTE.concrete,
  PALETTE.concreteDark,
  PALETTE.kepcoNavy,
  PALETTE.kpxGraphite,
] as const

const SKYLINE_COUNT = 56

/** [x, z, 가로폭, 높이, 색 인덱스] */
const SKYLINE: ReadonlyArray<[x: number, z: number, w: number, h: number, ci: number]> = Array.from(
  { length: SKYLINE_COUNT },
  (_, i) => {
    const a = (i / SKYLINE_COUNT) * Math.PI * 2 + (hash(i * 3.1) - 0.5) * 0.35
    const r = 130 + hash(i * 7.7) * 100
    const x = Math.cos(a) * r
    const z = Math.sin(a) * r * 0.78
    const w = 9 + hash(i * 5.3) * 9
    const h = 11 + hash(i * 9.1) * 34
    const ci = Math.floor(hash(i * 13.7) * SKYLINE_COLORS.length)
    return [x, z, w, h, ci]
  },
)

export function CitySkyline() {
  return (
    <>
      {SKYLINE_COLORS.map((color, ci) => (
        <Instances key={color} limit={SKYLINE_COUNT}>
          <boxGeometry args={[1, 1, 1]} />
          <meshLambertMaterial color={color} flatShading />
          {SKYLINE.filter(([, , , , c]) => c === ci).map(([x, z, w, h], i) => (
            <Instance key={i} position={[x, h / 2, z]} scale={[w, h, w * 0.82]} />
          ))}
        </Instances>
      ))}
      {/* 옥상 파라펫 — 실루엣에 층이 있어 보이게 하는 얇은 캡 */}
      <Instances limit={SKYLINE_COUNT}>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial color={PALETTE.concreteDark} flatShading />
        {SKYLINE.map(([x, z, w, h], i) => (
          <Instance key={i} position={[x, h + 0.3, z]} scale={[w + 0.6, 0.5, w * 0.82 + 0.6]} />
        ))}
      </Instances>
    </>
  )
}

/** 가로수 — 다시면의 활엽수보다 정돈된 원뿔형 조경수 */
export function TreeLine() {
  return (
    <Instances limit={TREES.length}>
      <coneGeometry args={[1.1, 2.6, 7]} />
      <meshLambertMaterial color={PALETTE.kentechGreen} flatShading />
      {TREES.map(([x, z, s], i) => (
        <Instance key={i} position={[x, 1.3 * s, z]} scale={s} />
      ))}
    </Instances>
  )
}

/** 안내판 — 콘크리트·유리 프레임. 다시면 안내판(나무 기둥)과 대비되는 재질 */
export function InfoBoard({ rotY = 0 }: { rotY?: number }) {
  return (
    <group rotation={[0, rotY, 0]}>
      {[-0.75, 0.75].map((px) => (
        <mesh key={px} position={[px, 0.65, 0]} castShadow>
          <boxGeometry args={[0.14, 1.3, 0.14]} />
          <meshLambertMaterial color={PALETTE.concreteDark} flatShading />
        </mesh>
      ))}
      <mesh position={[0, 1.45, 0]} castShadow>
        <boxGeometry args={[2.1, 1.2, 0.1]} />
        <meshLambertMaterial color={PALETTE.kepcoNavy} flatShading />
      </mesh>
      <mesh position={[0, 1.45, 0.06]}>
        <boxGeometry args={[1.9, 1.0, 0.02]} />
        <meshLambertMaterial color={PALETTE.glassTeal} flatShading />
      </mesh>
    </group>
  )
}
