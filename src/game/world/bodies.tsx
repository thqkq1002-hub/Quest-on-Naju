import { PALETTE } from '@/lib/palette'

/**
 * NPC 몸통.
 *
 * 로우폴리라 박스 몇 개면 사람으로 읽힙니다. 중요한 건 실루엣과 색이라,
 * 인물마다 "한눈에 다른 점" 을 하나씩 줍니다 — 선생님은 안경과 조끼,
 * 어르신은 굽은 등과 지팡이, 발굴단장은 안전모, 연구원은 서류판.
 *
 * 각 몸통은 발이 원점(0,0,0)에 오도록 세웁니다. NPC 컴포넌트가 그 원점을
 * 땅 높이에 얹습니다.
 */

function Legs({ color = '#4a4a52' }: { color?: string }) {
  return (
    <>
      {[-0.16, 0.16].map((px) => (
        <mesh key={px} position={[px, 0.4, 0]} castShadow>
          <boxGeometry args={[0.24, 0.8, 0.24]} />
          <meshLambertMaterial color={color} flatShading />
        </mesh>
      ))}
    </>
  )
}

function Head({ hair = '#3a3330', y = 1.78 }: { hair?: string; y?: number }) {
  return (
    <>
      <mesh position={[0, y, 0]} castShadow>
        <boxGeometry args={[0.42, 0.44, 0.4]} />
        <meshLambertMaterial color={PALETTE.skin} flatShading />
      </mesh>
      <mesh position={[0, y + 0.21, -0.02]} castShadow>
        <boxGeometry args={[0.46, 0.16, 0.44]} />
        <meshLambertMaterial color={hair} flatShading />
      </mesh>
    </>
  )
}

function Arms({ color, y = 1.14 }: { color: string; y?: number }) {
  return (
    <>
      {[-0.4, 0.4].map((px) => (
        <mesh key={px} position={[px, y, 0]} castShadow>
          <boxGeometry args={[0.17, 0.72, 0.17]} />
          <meshLambertMaterial color={color} flatShading />
        </mesh>
      ))}
    </>
  )
}

/** 담임 선생님 — 셔츠에 조끼, 안경 */
export function TeacherBody() {
  return (
    <>
      <Legs />
      <mesh position={[0, 1.18, 0]} castShadow>
        <boxGeometry args={[0.62, 0.8, 0.36]} />
        <meshLambertMaterial color="#dfe4ea" flatShading />
      </mesh>
      <mesh position={[0, 1.14, 0]} castShadow>
        <boxGeometry args={[0.64, 0.5, 0.38]} />
        <meshLambertMaterial color="#6b7f9e" flatShading />
      </mesh>
      <Arms color="#dfe4ea" />
      <Head />
      {/* 안경 */}
      <mesh position={[0, 1.78, 0.21]}>
        <boxGeometry args={[0.34, 0.07, 0.02]} />
        <meshBasicMaterial color="#2b2320" />
      </mesh>
    </>
  )
}

/** 마을 어르신 — 등이 굽고 지팡이를 짚었습니다. 흰 머리 */
export function ElderBody() {
  return (
    <>
      <Legs color="#6b6357" />
      <mesh position={[0, 1.1, 0.05]} rotation={[0.16, 0, 0]} castShadow>
        <boxGeometry args={[0.6, 0.78, 0.34]} />
        <meshLambertMaterial color="#cfc6b4" flatShading />
      </mesh>
      <Arms color="#cfc6b4" y={1.08} />
      <Head hair="#e8e4dc" y={1.68} />
      {/* 지팡이 */}
      <mesh position={[0.46, 0.62, 0.16]} rotation={[0, 0, 0.06]} castShadow>
        <cylinderGeometry args={[0.045, 0.05, 1.24, 6]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
      </mesh>
    </>
  )
}

/** 교장선생님 — 정장 스커트와 재킷, 쪽진 머리에 금색 브로치 */
export function PrincipalBody() {
  return (
    <>
      {/* 구두 끝 — 치마 아래로 살짝 보입니다 */}
      <mesh position={[0, 0.14, 0.02]} castShadow>
        <boxGeometry args={[0.4, 0.28, 0.28]} />
        <meshLambertMaterial color="#2b2320" flatShading />
      </mesh>
      {/* 정장 치마 — 허리부터 퍼지는 실루엣 */}
      <mesh position={[0, 0.86, 0]} castShadow>
        <cylinderGeometry args={[0.22, 0.4, 1.0, 8]} />
        <meshLambertMaterial color="#2f3a52" flatShading />
      </mesh>
      {/* 재킷 */}
      <mesh position={[0, 1.37, 0]} castShadow>
        <boxGeometry args={[0.6, 0.66, 0.36]} />
        <meshLambertMaterial color="#3a4766" flatShading />
      </mesh>
      {/* 안에 입은 블라우스 */}
      <mesh position={[0, 1.4, 0.19]}>
        <boxGeometry args={[0.3, 0.46, 0.02]} />
        <meshLambertMaterial color="#f3ede0" flatShading />
      </mesh>
      <Arms color="#3a4766" y={1.34} />
      <Head hair="#2b2320" y={1.94} />
      {/* 쪽진 머리 */}
      <mesh position={[0, 2.03, -0.2]} castShadow>
        <sphereGeometry args={[0.13, 8, 6]} />
        <meshLambertMaterial color="#2b2320" flatShading />
      </mesh>
      {/* 브로치 — 교장선생님임을 알아보는 장신구 */}
      <mesh position={[0.16, 1.5, 0.2]}>
        <boxGeometry args={[0.08, 0.08, 0.02]} />
        <meshBasicMaterial color={PALETTE.questGold} />
      </mesh>
    </>
  )
}

/** 발굴단장 — 조끼에 안전모. 현장 사람이라 색이 강합니다 */
export function DigLeadBody() {
  return (
    <>
      <Legs color="#5a5348" />
      <mesh position={[0, 1.18, 0]} castShadow>
        <boxGeometry args={[0.64, 0.8, 0.38]} />
        <meshLambertMaterial color="#d8cdb6" flatShading />
      </mesh>
      {/* 형광 조끼 */}
      <mesh position={[0, 1.16, 0]} castShadow>
        <boxGeometry args={[0.66, 0.52, 0.4]} />
        <meshLambertMaterial color="#e8b53f" flatShading />
      </mesh>
      <Arms color="#d8cdb6" />
      <Head hair="#2f2a26" />
      {/* 안전모 */}
      <mesh position={[0, 2.05, 0]} castShadow>
        <sphereGeometry args={[0.27, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshLambertMaterial color="#e0673c" flatShading />
      </mesh>
      <mesh position={[0, 1.99, 0.12]} castShadow>
        <boxGeometry args={[0.5, 0.05, 0.3]} />
        <meshLambertMaterial color="#e0673c" flatShading />
      </mesh>
    </>
  )
}

/** 나루터 뱃사공 — 삿갓을 쓰고 삿대를 짚었습니다 */
export function BoatmanBody() {
  return (
    <>
      <Legs color="#8a7355" />
      <mesh position={[0, 1.16, 0]} castShadow>
        <boxGeometry args={[0.62, 0.8, 0.36]} />
        <meshLambertMaterial color="#c9a876" flatShading />
      </mesh>
      <Arms color="#c9a876" />
      <Head hair="#2f2a26" />
      {/* 삿갓 */}
      <mesh position={[0, 2.02, 0]} castShadow>
        <coneGeometry args={[0.42, 0.2, 10]} />
        <meshLambertMaterial color="#c4b184" flatShading />
      </mesh>
      {/* 삿대 — 짚고 서 있습니다 */}
      <mesh position={[0.46, 0.75, 0.14]} rotation={[0, 0, 0.1]} castShadow>
        <cylinderGeometry args={[0.04, 0.045, 1.5, 6]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
      </mesh>
      <mesh position={[0.53, 0.06, 0.14]} rotation={[0, 0, 0.1]} castShadow>
        <boxGeometry args={[0.22, 0.4, 0.045]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
      </mesh>
    </>
  )
}

/** 다시역 역장 — 감색 제복에 정모, 손에는 수신호기 */
export function StationmasterBody() {
  return (
    <>
      <Legs color="#1f2946" />
      <mesh position={[0, 1.18, 0]} castShadow>
        <boxGeometry args={[0.62, 0.8, 0.36]} />
        <meshLambertMaterial color="#243056" flatShading />
      </mesh>
      {/* 금색 단추 줄 */}
      <mesh position={[0, 1.18, 0.19]}>
        <boxGeometry args={[0.07, 0.7, 0.02]} />
        <meshLambertMaterial color={PALETTE.questGold} flatShading />
      </mesh>
      <Arms color="#243056" />
      <Head hair="#2b2320" />
      {/* 정모 */}
      <mesh position={[0, 2.03, 0]} castShadow>
        <cylinderGeometry args={[0.27, 0.27, 0.16, 10]} />
        <meshLambertMaterial color="#1c2440" flatShading />
      </mesh>
      <mesh position={[0, 1.96, 0.09]} castShadow>
        <boxGeometry args={[0.5, 0.04, 0.32]} />
        <meshLambertMaterial color="#111726" flatShading />
      </mesh>
      {/* 수신호기 — 깃발 든 신호봉 */}
      <mesh position={[0.42, 1.5, 0.1]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.9, 6]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
      </mesh>
      <mesh position={[0.62, 1.85, 0.1]} rotation={[0, 0, -0.3]} castShadow>
        <boxGeometry args={[0.32, 0.22, 0.02]} />
        <meshLambertMaterial color={PALETTE.steelRed} flatShading />
      </mesh>
    </>
  )
}

/** 빛가람 호수공원 안내원 — 조끼에 챙모자, 목에 쌍안경 */
export function ParkGuideBody() {
  return (
    <>
      <Legs color="#3a4a52" />
      <mesh position={[0, 1.18, 0]} castShadow>
        <boxGeometry args={[0.62, 0.8, 0.36]} />
        <meshLambertMaterial color="#eef2f0" flatShading />
      </mesh>
      {/* 청록 조끼 — 빛가람의 색 */}
      <mesh position={[0, 1.16, 0]} castShadow>
        <boxGeometry args={[0.66, 0.52, 0.4]} />
        <meshLambertMaterial color={PALETTE.glassTeal} flatShading />
      </mesh>
      <Arms color="#eef2f0" />
      <Head hair="#33302c" />
      {/* 챙모자 */}
      <mesh position={[0, 2.03, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.14, 10]} />
        <meshLambertMaterial color={PALETTE.glassTeal} flatShading />
      </mesh>
      <mesh position={[0, 1.98, 0.12]} castShadow>
        <boxGeometry args={[0.46, 0.04, 0.28]} />
        <meshLambertMaterial color={PALETTE.glassTeal} flatShading />
      </mesh>
      {/* 쌍안경 — 목에 걸려 있습니다 */}
      <mesh position={[0, 1.36, 0.2]} castShadow>
        <boxGeometry args={[0.26, 0.14, 0.12]} />
        <meshLambertMaterial color="#2b2b2b" flatShading />
      </mesh>
    </>
  )
}

/** 한국전력공사 직원 — 감색 정장 조끼에 사원증, 전력망을 다루는 사람이라
 *  안전을 상징하는 노란 헬멧을 하나 곁들입니다 */
export function KepcoStaffBody() {
  return (
    <>
      <Legs color="#26314d" />
      <mesh position={[0, 1.18, 0]} castShadow>
        <boxGeometry args={[0.62, 0.8, 0.36]} />
        <meshLambertMaterial color="#eef1f5" flatShading />
      </mesh>
      <mesh position={[0, 1.14, 0]} castShadow>
        <boxGeometry args={[0.64, 0.5, 0.38]} />
        <meshLambertMaterial color={PALETTE.kepcoNavy} flatShading />
      </mesh>
      {/* 사원증 */}
      <mesh position={[0.16, 1.28, 0.2]}>
        <boxGeometry args={[0.12, 0.16, 0.02]} />
        <meshLambertMaterial color="#eef1f5" flatShading />
      </mesh>
      <Arms color="#eef1f5" />
      <Head hair="#2b2320" />
      {/* 안전모 */}
      <mesh position={[0, 2.04, 0]} castShadow>
        <sphereGeometry args={[0.26, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshLambertMaterial color={PALETTE.steelYellow} flatShading />
      </mesh>
    </>
  )
}

/** 전력거래소 관제 요원 — 짙은 제복에 헤드셋, 손에 태블릿 */
export function KpxOperatorBody() {
  return (
    <>
      <Legs color="#2b2f36" />
      <mesh position={[0, 1.18, 0]} castShadow>
        <boxGeometry args={[0.62, 0.8, 0.36]} />
        <meshLambertMaterial color="#3a4048" flatShading />
      </mesh>
      <Arms color="#3a4048" />
      <Head hair="#2b2320" />
      {/* 헤드셋 */}
      <mesh position={[0, 1.82, 0]} rotation={[0, 0, 0]}>
        <torusGeometry args={[0.24, 0.03, 6, 12, Math.PI]} />
        <meshLambertMaterial color="#1c1f24" flatShading />
      </mesh>
      <mesh position={[0.23, 1.68, 0]}>
        <boxGeometry args={[0.08, 0.1, 0.08]} />
        <meshLambertMaterial color="#1c1f24" flatShading />
      </mesh>
      {/* 태블릿 — 들고 있습니다 */}
      <mesh position={[0.28, 1.1, 0.24]} rotation={[0.3, -0.3, 0]} castShadow>
        <boxGeometry args={[0.32, 0.42, 0.03]} />
        <meshLambertMaterial color="#1c1f24" flatShading />
      </mesh>
      <mesh position={[0.28, 1.1, 0.255]} rotation={[0.3, -0.3, 0]}>
        <boxGeometry args={[0.26, 0.34, 0.01]} />
        <meshBasicMaterial color={PALETTE.kpxScreen} />
      </mesh>
    </>
  )
}

/** KOCCA 크리에이터 — 캐주얼한 컬러 재킷에 카메라를 목에 걸었습니다 */
export function KoccaCreatorBody() {
  return (
    <>
      <Legs color="#2b2320" />
      <mesh position={[0, 1.18, 0]} castShadow>
        <boxGeometry args={[0.62, 0.8, 0.36]} />
        <meshLambertMaterial color="#eef1f5" flatShading />
      </mesh>
      <mesh position={[0, 1.14, 0]} castShadow>
        <boxGeometry args={[0.64, 0.5, 0.38]} />
        <meshLambertMaterial color={PALETTE.koccaMagenta} flatShading />
      </mesh>
      <Arms color={PALETTE.koccaMagenta} />
      <Head hair="#4a2f52" />
      {/* 카메라 — 목에 걸려 있습니다 */}
      <mesh position={[0, 1.34, 0.22]} castShadow>
        <boxGeometry args={[0.28, 0.2, 0.16]} />
        <meshLambertMaterial color="#2b2320" flatShading />
      </mesh>
      <mesh position={[0, 1.34, 0.32]}>
        <cylinderGeometry args={[0.06, 0.06, 0.08, 10]} />
        <meshLambertMaterial color={PALETTE.koccaPurple} flatShading />
      </mesh>
    </>
  )
}

/** 스마트 라이프 코디네이터 — 연두색 앞치마에 텀블러, 친환경 생활을 안내합니다 */
export function SmartLifeCoordinatorBody() {
  return (
    <>
      <Legs color="#4a5340" />
      <mesh position={[0, 1.18, 0]} castShadow>
        <boxGeometry args={[0.62, 0.8, 0.36]} />
        <meshLambertMaterial color="#eef2ec" flatShading />
      </mesh>
      {/* 연두 앞치마 */}
      <mesh position={[0, 1.06, 0.16]} castShadow>
        <boxGeometry args={[0.5, 0.58, 0.06]} />
        <meshLambertMaterial color={PALETTE.smartLifeLeaf} flatShading />
      </mesh>
      <Arms color="#eef2ec" />
      <Head hair="#33302c" />
      {/* 텀블러 — 들고 있습니다 */}
      <mesh position={[0.32, 1.05, 0.1]} castShadow>
        <cylinderGeometry args={[0.09, 0.08, 0.32, 8]} />
        <meshLambertMaterial color={PALETTE.smartLifeWood} flatShading />
      </mesh>
    </>
  )
}

/** 소충사 관리인 — 흰 도포에 갓, 향을 들었습니다 */
export function ShrineKeeperBody() {
  return (
    <>
      <Legs color="#e8e4dc" />
      <mesh position={[0, 1.16, 0]} castShadow>
        <boxGeometry args={[0.66, 0.86, 0.4]} />
        <meshLambertMaterial color="#eef0ea" flatShading />
      </mesh>
      {/* 도포 허리끈 */}
      <mesh position={[0, 1.02, 0]}>
        <boxGeometry args={[0.7, 0.1, 0.42]} />
        <meshLambertMaterial color={PALETTE.dancheongRed} flatShading />
      </mesh>
      <Arms color="#eef0ea" y={1.16} />
      <Head hair="#1c1a18" y={1.78} />
      {/* 갓 — 챙 넓은 검은 모자 */}
      <mesh position={[0, 2.06, 0]} castShadow>
        <cylinderGeometry args={[0.44, 0.44, 0.05, 12]} />
        <meshLambertMaterial color="#1c1a18" flatShading />
      </mesh>
      <mesh position={[0, 2.2, 0]} castShadow>
        <cylinderGeometry args={[0.18, 0.2, 0.24, 10]} />
        <meshLambertMaterial color="#1c1a18" flatShading />
      </mesh>
      {/* 향 — 두 손에 받쳐 든 향불 */}
      <mesh position={[0, 1.28, 0.22]} rotation={[0.5, 0, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.3, 5]} />
        <meshLambertMaterial color="#8a7248" flatShading />
      </mesh>
    </>
  )
}

/** 조선공 — 작업복에 머리띠, 손에 자귀(목공 도구) */
export function ShipwrightBody() {
  return (
    <>
      <Legs color="#5a4a34" />
      <mesh position={[0, 1.16, 0]} castShadow>
        <boxGeometry args={[0.62, 0.8, 0.36]} />
        <meshLambertMaterial color="#c9b892" flatShading />
      </mesh>
      <Arms color="#c9b892" />
      <Head hair="#2b2320" />
      {/* 머리띠 */}
      <mesh position={[0, 1.9, 0]}>
        <boxGeometry args={[0.44, 0.08, 0.44]} />
        <meshLambertMaterial color={PALETTE.dancheongRed} flatShading />
      </mesh>
      {/* 자귀 — 목공 손도끼, 들고 있습니다 */}
      <mesh position={[0.32, 1.1, 0.1]} rotation={[0, 0, 0.5]} castShadow>
        <cylinderGeometry args={[0.03, 0.03, 0.5, 6]} />
        <meshLambertMaterial color={PALETTE.hanokWood} flatShading />
      </mesh>
      <mesh position={[0.5, 1.28, 0.1]} castShadow>
        <boxGeometry args={[0.2, 0.1, 0.05]} />
        <meshLambertMaterial color="#8a9098" flatShading />
      </mesh>
    </>
  )
}

/** 대장장이 — 가죽 앞치마에 망치, 창선을 만드는 장인 */
export function BlacksmithBody() {
  return (
    <>
      <Legs color="#3a2f26" />
      <mesh position={[0, 1.16, 0]} castShadow>
        <boxGeometry args={[0.62, 0.8, 0.36]} />
        <meshLambertMaterial color="#8a7358" flatShading />
      </mesh>
      {/* 가죽 앞치마 */}
      <mesh position={[0, 1.02, 0.17]} castShadow>
        <boxGeometry args={[0.5, 0.6, 0.06]} />
        <meshLambertMaterial color="#5a3d28" flatShading />
      </mesh>
      <Arms color="#8a7358" />
      <Head hair="#2b2320" />
      {/* 망치 — 어깨에 걸쳤습니다 */}
      <mesh position={[0.4, 1.5, 0]} rotation={[0, 0, -0.4]} castShadow>
        <cylinderGeometry args={[0.035, 0.035, 0.6, 6]} />
        <meshLambertMaterial color={PALETTE.hanokWood} flatShading />
      </mesh>
      <mesh position={[0.58, 1.72, 0]} rotation={[0, 0, -0.4]} castShadow>
        <boxGeometry args={[0.28, 0.14, 0.14]} />
        <meshLambertMaterial color="#4a4d52" flatShading />
      </mesh>
    </>
  )
}

/** 나주역 안내원 — 차분한 차콜 정장에 금색 배지. 화려하지 않게 */
export function NajuGuideBody() {
  return (
    <>
      <Legs color="#2b2823" />
      <mesh position={[0, 1.18, 0]} castShadow>
        <boxGeometry args={[0.62, 0.8, 0.36]} />
        <meshLambertMaterial color={PALETTE.stationCharcoal} flatShading />
      </mesh>
      <mesh position={[0, 1.14, 0]} castShadow>
        <boxGeometry args={[0.64, 0.5, 0.38]} />
        <meshLambertMaterial color="#4a453c" flatShading />
      </mesh>
      {/* 배지 */}
      <mesh position={[0.16, 1.3, 0.2]}>
        <boxGeometry args={[0.09, 0.09, 0.02]} />
        <meshBasicMaterial color={PALETTE.mutedGold} />
      </mesh>
      <Arms color={PALETTE.stationCharcoal} />
      <Head hair="#1c1a18" />
    </>
  )
}

/** 박준채 — 검정 교복에 학생모, 항의하러 나선 학생 */
export function ParkJunchaeBody() {
  return (
    <>
      <Legs color="#1c1e24" />
      <mesh position={[0, 1.16, 0]} castShadow>
        <boxGeometry args={[0.6, 0.82, 0.36]} />
        <meshLambertMaterial color={PALETTE.uniformNavy} flatShading />
      </mesh>
      {/* 교복 깃 */}
      <mesh position={[0, 1.5, 0.17]}>
        <boxGeometry args={[0.36, 0.14, 0.03]} />
        <meshLambertMaterial color={PALETTE.stationSepia} flatShading />
      </mesh>
      <Arms color={PALETTE.uniformNavy} />
      <Head hair="#1c1a18" />
      {/* 학생모 */}
      <mesh position={[0, 2.02, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.24, 0.16, 10]} />
        <meshLambertMaterial color={PALETTE.uniformNavy} flatShading />
      </mesh>
      <mesh position={[0, 1.97, 0.1]}>
        <boxGeometry args={[0.44, 0.04, 0.26]} />
        <meshLambertMaterial color="#111318" flatShading />
      </mesh>
    </>
  )
}

/** 박기옥 — 흰 저고리에 검정 치마, 댕기머리. 사건 당일 희롱당한 학생 */
export function ParkGiokBody() {
  return (
    <>
      <Legs color="#1c1a18" />
      <mesh position={[0, 1.1, 0]} castShadow>
        <boxGeometry args={[0.58, 0.9, 0.36]} />
        <meshLambertMaterial color="#1c1a18" flatShading />
      </mesh>
      <mesh position={[0, 1.42, 0]} castShadow>
        <boxGeometry args={[0.62, 0.42, 0.4]} />
        <meshLambertMaterial color={PALETTE.uniformCream} flatShading />
      </mesh>
      <Arms color={PALETTE.uniformCream} y={1.36} />
      <Head hair="#1c1a18" y={1.72} />
      {/* 댕기머리 — 뒤로 길게 땋은 머리에 붉은 댕기 */}
      <mesh position={[0, 1.55, -0.24]} castShadow>
        <boxGeometry args={[0.12, 0.7, 0.12]} />
        <meshLambertMaterial color="#1c1a18" flatShading />
      </mesh>
      <mesh position={[0, 1.18, -0.24]}>
        <boxGeometry args={[0.14, 0.14, 0.03]} />
        <meshLambertMaterial color={PALETTE.mutedRed} flatShading />
      </mesh>
    </>
  )
}

/** 후쿠다 — 일본인 학생. 다른 학교 제복(밝은 색)이라 한눈에 구별됩니다 */
export function FukudaBody() {
  return (
    <>
      <Legs color="#3a3f4a" />
      <mesh position={[0, 1.16, 0]} castShadow>
        <boxGeometry args={[0.6, 0.82, 0.36]} />
        <meshLambertMaterial color="#5a6270" flatShading />
      </mesh>
      <mesh position={[0, 1.5, 0.17]}>
        <boxGeometry args={[0.36, 0.14, 0.03]} />
        <meshLambertMaterial color={PALETTE.uniformCream} flatShading />
      </mesh>
      <Arms color="#5a6270" />
      <Head hair="#2b2320" />
      {/* 각모 — 각진 학생모, 박준채와 다른 형태 */}
      <mesh position={[0, 2.03, 0]} castShadow>
        <boxGeometry args={[0.44, 0.16, 0.44]} />
        <meshLambertMaterial color="#3a3f4a" flatShading />
      </mesh>
      <mesh position={[0, 1.97, 0.1]}>
        <boxGeometry args={[0.44, 0.04, 0.26]} />
        <meshLambertMaterial color="#22262e" flatShading />
      </mesh>
    </>
  )
}

/** 기록 담당 연구원 — 흰 가운에 서류판 */
/** 박물관 탐험가 박사님 — 카키색 조끼에 탐험모(사파리 헬멧), 손엔 발굴용 붓 */
export function ExplorerBody() {
  return (
    <>
      <Legs color="#7a6a48" />
      <mesh position={[0, 1.16, 0]} castShadow>
        <boxGeometry args={[0.6, 0.86, 0.34]} />
        <meshLambertMaterial color="#c9b088" flatShading />
      </mesh>
      {/* 카키 조끼 */}
      <mesh position={[0, 1.14, 0]} castShadow>
        <boxGeometry args={[0.64, 0.52, 0.38]} />
        <meshLambertMaterial color="#8a7a4a" flatShading />
      </mesh>
      <Arms color="#c9b088" />
      <Head hair="#4a3f30" />
      {/* 사파리(탐험모) — 챙 넓은 모자 */}
      <mesh position={[0, 2.03, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.06, 12]} />
        <meshLambertMaterial color="#d9c69a" flatShading />
      </mesh>
      <mesh position={[0, 2.13, 0]} castShadow>
        <sphereGeometry args={[0.24, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshLambertMaterial color="#d9c69a" flatShading />
      </mesh>
      {/* 손에 든 발굴용 붓 */}
      <mesh position={[0.42, 0.9, 0.14]} rotation={[0.5, 0, 0.3]} castShadow>
        <cylinderGeometry args={[0.025, 0.025, 0.5, 5]} />
        <meshLambertMaterial color="#8a6f4f" flatShading />
      </mesh>
      <mesh position={[0.48, 1.1, 0.22]} rotation={[0.5, 0, 0.3]} castShadow>
        <coneGeometry args={[0.05, 0.16, 6]} />
        <meshLambertMaterial color="#e8dcc4" flatShading />
      </mesh>
    </>
  )
}

export function ResearcherBody() {
  return (
    <>
      <Legs color="#46506b" />
      <mesh position={[0, 1.16, 0]} castShadow>
        <boxGeometry args={[0.6, 0.86, 0.34]} />
        <meshLambertMaterial color="#f1f3f5" flatShading />
      </mesh>
      <Arms color="#f1f3f5" />
      <Head hair="#33302c" />
      {/* 서류판 */}
      <mesh position={[0.3, 1.12, 0.26]} rotation={[0.3, -0.2, 0]} castShadow>
        <boxGeometry args={[0.34, 0.44, 0.03]} />
        <meshLambertMaterial color="#c9a86a" flatShading />
      </mesh>
    </>
  )
}

/** 영산강 선장 할아버지 — 감색 선장 코트에 흰 정모(닻 장식), 흰 수염. 손엔 파이프 */
export function CaptainBody() {
  return (
    <>
      <Legs color="#22314a" />
      <mesh position={[0, 1.18, 0]} castShadow>
        <boxGeometry args={[0.64, 0.82, 0.38]} />
        <meshLambertMaterial color="#2b3d5c" flatShading />
      </mesh>
      {/* 금색 단추 두 줄 */}
      {[-0.14, 0.14].map((px) => (
        <mesh key={px} position={[px, 1.18, 0.2]}>
          <boxGeometry args={[0.05, 0.7, 0.02]} />
          <meshLambertMaterial color={PALETTE.questGold} flatShading />
        </mesh>
      ))}
      <Arms color="#2b3d5c" />
      <Head hair="#e8e4dc" />
      {/* 흰 수염 */}
      <mesh position={[0, 1.66, 0.19]} castShadow>
        <boxGeometry args={[0.3, 0.14, 0.1]} />
        <meshLambertMaterial color="#eceae4" flatShading />
      </mesh>
      {/* 흰 정모 */}
      <mesh position={[0, 2.02, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.28, 0.15, 10]} />
        <meshLambertMaterial color="#f2efe6" flatShading />
      </mesh>
      <mesh position={[0, 1.95, 0.09]} castShadow>
        <boxGeometry args={[0.5, 0.05, 0.32]} />
        <meshLambertMaterial color="#14304a" flatShading />
      </mesh>
      {/* 닻 장식 */}
      <mesh position={[0, 2.03, 0.15]}>
        <boxGeometry args={[0.12, 0.1, 0.02]} />
        <meshBasicMaterial color={PALETTE.questGold} />
      </mesh>
      {/* 파이프 */}
      <mesh position={[0.36, 1.42, 0.18]} rotation={[0, 0, -0.2]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.22, 5]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
      </mesh>
      <mesh position={[0.45, 1.36, 0.18]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.08, 6]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
      </mesh>
    </>
  )
}

/**
 * 홍어거리 마스코트 "홍이" — 사람이 아니라 넓적하고 둥근 홍어 그 자체입니다.
 * 그래서 Legs/Arms/Head를 쓰지 않고, 마름모꼴 몸통 하나로 실루엣을 만듭니다.
 * 머리에는 조선시대 뱃사람의 방한모 남바위(귀덮개 + 털 테두리)를 씌워
 * "영산강을 오간 홍어" 라는 설정을 한눈에 읽히게 했습니다.
 */
export function HongiBody() {
  return (
    <>
      {/* 몸통 — 마름모꼴(팔각면체를 눌러서) 홍어 실루엣 */}
      <mesh position={[0, 0.5, 0]} scale={[1.5, 0.5, 1.15]} castShadow receiveShadow>
        <octahedronGeometry args={[0.85, 0]} />
        <meshLambertMaterial color={PALETTE.hongiPink} flatShading />
      </mesh>
      {/* 배 쪽 — 살짝 짙은 분홍으로 입체감 */}
      <mesh position={[0, 0.28, 0]} scale={[1.3, 0.3, 1]} castShadow>
        <octahedronGeometry args={[0.8, 0]} />
        <meshLambertMaterial color={PALETTE.hongiPinkDark} flatShading />
      </mesh>
      {/* 꼬리 */}
      <mesh position={[0, 0.42, -1.05]} rotation={[Math.PI / 2, 0, 0]} castShadow>
        <coneGeometry args={[0.1, 0.6, 5]} />
        <meshLambertMaterial color={PALETTE.hongiPinkDark} flatShading />
      </mesh>
      {/* 눈 둘 — 동글동글, 표정의 8할 */}
      {[-0.22, 0.22].map((px) => (
        <mesh key={px} position={[px, 0.78, 0.5]}>
          <sphereGeometry args={[0.09, 8, 6]} />
          <meshBasicMaterial color="#241c18" />
        </mesh>
      ))}
      {/* 볼 — 발그레하게, 발랄한 성격을 색으로 */}
      {[-0.42, 0.42].map((px) => (
        <mesh key={px} position={[px, 0.66, 0.4]}>
          <circleGeometry args={[0.08, 8]} />
          <meshBasicMaterial color="#f2b8c0" />
        </mesh>
      ))}
      {/* 남바위 — 정수리 방한모 */}
      <mesh position={[0, 0.98, 0.05]} castShadow>
        <sphereGeometry args={[0.42, 10, 7, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshLambertMaterial color={PALETTE.hongiNambawi} flatShading />
      </mesh>
      {/* 털 테두리 */}
      <mesh position={[0, 0.94, 0.05]} rotation={[-Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.38, 0.09, 6, 16]} />
        <meshLambertMaterial color={PALETTE.hongiFurTrim} flatShading />
      </mesh>
      {/* 귀덮개 — 양옆으로 늘어뜨린 방한모 자락 */}
      {[-0.42, 0.42].map((px) => (
        <mesh key={px} position={[px, 0.68, 0.1]} castShadow>
          <boxGeometry args={[0.14, 0.32, 0.1]} />
          <meshLambertMaterial color={PALETTE.hongiNambawi} flatShading />
        </mesh>
      ))}
    </>
  )
}

/** 나주목사 김 목사님 — 남색 관복에 사모(관모), 가슴에 흉배. 손엔 접선(접부채) */
export function MayorBody() {
  return (
    <>
      <Legs color="#1c2e42" />
      {/* 관복 — 길게 떨어지는 포(袍) */}
      <mesh position={[0, 1.02, 0]} castShadow>
        <cylinderGeometry args={[0.24, 0.42, 1.3, 8]} />
        <meshLambertMaterial color="#2f5088" flatShading />
      </mesh>
      <mesh position={[0, 1.5, 0]} castShadow>
        <boxGeometry args={[0.62, 0.66, 0.36]} />
        <meshLambertMaterial color="#2f5088" flatShading />
      </mesh>
      {/* 흉배 — 품계를 나타내는 가슴 장식 */}
      <mesh position={[0, 1.55, 0.19]}>
        <boxGeometry args={[0.26, 0.26, 0.02]} />
        <meshLambertMaterial color={PALETTE.questGold} flatShading />
      </mesh>
      {/* 각띠 */}
      <mesh position={[0, 1.24, 0]}>
        <cylinderGeometry args={[0.34, 0.34, 0.14, 8]} />
        <meshLambertMaterial color="#1c1712" flatShading />
      </mesh>
      <Arms color="#2f5088" y={1.46} />
      <Head hair="#2b2320" y={2.02} />
      {/* 사모 — 검은 관모, 뒤로 뻗은 양쪽 날개(뿔) */}
      <mesh position={[0, 2.32, 0]} castShadow>
        <cylinderGeometry args={[0.26, 0.3, 0.34, 8]} />
        <meshLambertMaterial color="#1c1712" flatShading />
      </mesh>
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.32, 2.28, -0.08]} rotation={[0, 0, s * 0.15]} castShadow>
          <boxGeometry args={[0.36, 0.06, 0.16]} />
          <meshLambertMaterial color="#1c1712" flatShading />
        </mesh>
      ))}
      {/* 접부채 — 쥐고 있는 손 */}
      <mesh position={[0.42, 1.18, 0.16]} rotation={[0, 0, -0.4]} castShadow>
        <coneGeometry args={[0.22, 0.05, 3]} />
        <meshLambertMaterial color="#e8dcc4" flatShading />
      </mesh>
    </>
  )
}

/** 솔밭유원지 마스코트 "솔이" — 동글동글한 민트빛 요정, 솔잎 모자에 나뭇가지 팔 */
export function SoliBody() {
  return (
    <>
      {/* 몸통 */}
      <mesh position={[0, 0.55, 0]} scale={[1, 1.05, 1]} castShadow receiveShadow>
        <sphereGeometry args={[0.5, 10, 8]} />
        <meshLambertMaterial color={PALETTE.soliMint} flatShading />
      </mesh>
      {/* 배 — 밝은 민트 */}
      <mesh position={[0, 0.46, 0.34]} scale={[0.6, 0.58, 0.28]}>
        <sphereGeometry args={[0.42, 8, 6]} />
        <meshLambertMaterial color={PALETTE.soliMintLight} flatShading />
      </mesh>
      {/* 눈 */}
      {[-0.16, 0.16].map((px) => (
        <mesh key={px} position={[px, 0.63, 0.45]}>
          <sphereGeometry args={[0.055, 8, 6]} />
          <meshBasicMaterial color="#241c18" />
        </mesh>
      ))}
      {/* 볼 */}
      {[-0.3, 0.3].map((px) => (
        <mesh key={px} position={[px, 0.52, 0.42]}>
          <circleGeometry args={[0.06, 8]} />
          <meshBasicMaterial color="#f2b8c0" />
        </mesh>
      ))}
      {/* 솔잎 모자 — 정수리에서 뾰족뾰족 뻗은 솔잎 다발 */}
      <mesh position={[0, 0.94, 0]} castShadow>
        <sphereGeometry args={[0.17, 8, 6]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
      </mesh>
      {Array.from({ length: 6 }, (_, i) => {
        const a = (i / 6) * Math.PI * 2
        return (
          <mesh key={i} position={[Math.cos(a) * 0.13, 1.04, Math.sin(a) * 0.13]} rotation={[0.35, -a, 0]} castShadow>
            <coneGeometry args={[0.06, 0.4, 4]} />
            <meshLambertMaterial color={PALETTE.pineDark} flatShading />
          </mesh>
        )
      })}
      {/* 나뭇가지 팔 */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.46, 0.5, 0]} rotation={[0, 0, s * 0.5]} castShadow>
          <cylinderGeometry args={[0.04, 0.05, 0.4, 5]} />
          <meshLambertMaterial color={PALETTE.trunk} flatShading />
        </mesh>
      ))}
      {/* 솔방울 — 오른손에 든 */}
      <mesh position={[0.6, 0.3, 0.12]} castShadow>
        <sphereGeometry args={[0.1, 8, 6]} />
        <meshLambertMaterial color={PALETTE.pineconeBrown} flatShading />
      </mesh>
    </>
  )
}

/** 나주읍성 곰탕집 할머니 — 붉은 앞치마에 머리수건, 손엔 국자 */
export function GomtangLadyBody() {
  return (
    <>
      <Legs color="#5a4a3a" />
      <mesh position={[0, 1.14, 0]} castShadow>
        <boxGeometry args={[0.6, 0.8, 0.34]} />
        <meshLambertMaterial color="#e8dcc4" flatShading />
      </mesh>
      {/* 앞치마 */}
      <mesh position={[0, 1.0, 0.19]}>
        <boxGeometry args={[0.5, 0.6, 0.03]} />
        <meshLambertMaterial color={PALETTE.steelRed} flatShading />
      </mesh>
      <Arms color="#e8dcc4" />
      <Head hair="#8a8078" />
      {/* 머리수건 */}
      <mesh position={[0, 2.02, 0]} castShadow>
        <boxGeometry args={[0.46, 0.14, 0.46]} />
        <meshLambertMaterial color="#e0673c" flatShading />
      </mesh>
      {/* 국자 */}
      <mesh position={[0.42, 1.15, 0.16]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.02, 0.02, 0.4, 5]} />
        <meshLambertMaterial color={PALETTE.pineconeBrown} flatShading />
      </mesh>
      <mesh position={[0.56, 0.98, 0.16]} castShadow>
        <sphereGeometry args={[0.09, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshLambertMaterial color="#c8ccd0" flatShading />
      </mesh>
    </>
  )
}

/** 정렬사 김천일 의병장 — 짙은 갑옷에 붉은 전포, 어깨 장식과 투구, 손엔 칼 */
export function KimCheonilBody() {
  return (
    <>
      <Legs color="#2b2f38" />
      {/* 갑옷 몸통 */}
      <mesh position={[0, 1.16, 0]} castShadow>
        <boxGeometry args={[0.64, 0.82, 0.36]} />
        <meshLambertMaterial color="#3a3f4a" flatShading />
      </mesh>
      {/* 붉은 전포 자락 — 등 뒤로 늘어뜨린 망토 */}
      <mesh position={[0, 0.95, -0.22]} castShadow>
        <boxGeometry args={[0.56, 1.1, 0.1]} />
        <meshLambertMaterial color={PALETTE.mutedRed} flatShading />
      </mesh>
      {/* 갑옷 미늘 줄 — 가로 띠 세 줄 */}
      {[0.98, 1.16, 1.34].map((y) => (
        <mesh key={y} position={[0, y, 0.185]}>
          <boxGeometry args={[0.6, 0.05, 0.02]} />
          <meshLambertMaterial color="#565f6e" flatShading />
        </mesh>
      ))}
      {/* 어깨 장식 */}
      {[-1, 1].map((s) => (
        <mesh key={s} position={[s * 0.36, 1.5, 0]} castShadow>
          <boxGeometry args={[0.2, 0.16, 0.4]} />
          <meshLambertMaterial color={PALETTE.dragonGold} flatShading />
        </mesh>
      ))}
      <Arms color="#3a3f4a" />
      <Head hair="#1c1712" />
      {/* 투구 */}
      <mesh position={[0, 2.05, 0]} castShadow>
        <sphereGeometry args={[0.26, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshLambertMaterial color="#3a3f4a" flatShading />
      </mesh>
      <mesh position={[0, 1.97, 0.1]} castShadow>
        <boxGeometry args={[0.48, 0.06, 0.3]} />
        <meshLambertMaterial color={PALETTE.dragonGold} flatShading />
      </mesh>
      {/* 투구 깃 장식 */}
      <mesh position={[0, 2.32, -0.05]} rotation={[0.3, 0, 0]} castShadow>
        <coneGeometry args={[0.05, 0.34, 5]} />
        <meshLambertMaterial color={PALETTE.mutedRed} flatShading />
      </mesh>
      {/* 칼 — 허리에 찬 */}
      <mesh position={[-0.4, 0.85, 0.05]} rotation={[0, 0, 0.3]} castShadow>
        <boxGeometry args={[0.08, 0.9, 0.04]} />
        <meshLambertMaterial color="#8a6f4f" flatShading />
      </mesh>
      <mesh position={[-0.36, 1.28, 0.05]} rotation={[0, 0, 0.3]}>
        <boxGeometry args={[0.2, 0.06, 0.06]} />
        <meshLambertMaterial color={PALETTE.dragonGold} flatShading />
      </mesh>
    </>
  )
}
