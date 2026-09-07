import { Html } from '@react-three/drei'
import { PALETTE } from '@/lib/palette'
import { Player } from '@/game/player/Player'
import { QuestNpc } from '../Npc'
import { Interactable } from '../Interactable'
import {
  KepcoStaffBody,
  KoccaCreatorBody,
  KpxOperatorBody,
  ParkGuideBody,
  ResearcherBody,
  SmartLifeCoordinatorBody,
} from '../bodies'
import { setTerrain } from '../terrain'
import { useGameStore } from '@/store/gameStore'
import { BOUNDS, COLLIDERS, LAYOUT } from './bitgaram/layout'
import {
  CitySkyline,
  InfoBoard,
  KentechCampus,
  KepcoTower,
  KoccaStudio,
  KpxCenter,
  Lake,
  Observatory,
  SmartLifeCenter,
  TreeLine,
} from './bitgaram/BitgaramProps'

/**
 * 빛가람동 — 다시면(다시초등학교, 복암리) 다음으로 여는 두 번째 읍·면·동.
 *
 * 다시면이 "오래된 마을"이라면 여기는 "계획도시"입니다. 그래서 빛도, 색도
 * 다시 갑니다 — 다시면의 낮은 아침 해와 흙빛 대신, 여기는 한낮의 높은 해와
 * 유리·콘크리트·물의 차가운 색입니다. 같은 로우폴리인데 다른 동네로 읽혀야
 * 합니다.
 *
 * 거점 여섯(전망대·한전·KENTECH·전력거래소·KOCCA·스마트 라이프 센터) 모두
 * 같은 구조입니다 — NPC에게 말을 걸어 퀘스트를 받고, 안내판 앞에서 문제를
 * 풉니다. → docs/06-NAJU-WORLD-MAP.md
 */
const TERRAIN = { bounds: BOUNDS, colliders: COLLIDERS, spawn: LAYOUT.spawn }
setTerrain(TERRAIN)

export function BitgaramSite({ shadows }: { shadows: boolean }) {
  setTerrain(TERRAIN)
  const openPuzzle = useGameStore((s) => s.openPuzzle)
  const active = useGameStore((s) => s.active)
  const completed = useGameStore((s) => s.completedQuests)

  const given = (id: string) => id in active || completed.includes(id)
  const observatoryGiven = given('bitgaram-01-observatory')
  const kepcoGiven = given('bitgaram-02-kepco')
  const kentechGiven = given('bitgaram-03-kentech')
  const kpxGiven = given('bitgaram-04-kpx')
  const koccaGiven = given('bitgaram-05-kocca')
  const smartLifeGiven = given('bitgaram-06-smart-life')

  return (
    <>
      {/* 한낮의 높은 해 — 다시면의 낮은 아침 해와 대비됩니다.
          그림자가 짧고 색이 선명해야 "새로 지은 동네"처럼 보입니다 */}
      <hemisphereLight args={['#bfe8f5', '#7a8a92', 1.05]} />
      <directionalLight
        position={[30, 85, 20]}
        intensity={1.5}
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-100}
        shadow-camera-right={100}
        shadow-camera-top={100}
        shadow-camera-bottom={-100}
        shadow-camera-near={1}
        shadow-camera-far={240}
        shadow-bias={-0.0008}
      />
      <fog attach="fog" args={['#dcf0f5', 160, 500]} />
      <color attach="background" args={['#cfeaf3']} />

      {/* 지면 — 다시면의 잔디 대신 정돈된 광장 콘크리트 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[900, 900]} />
        <meshLambertMaterial color={PALETTE.plaza} />
      </mesh>
      {/* 잔디 띠 — 광장이 온통 콘크리트만은 아니게 */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <ringGeometry args={[46, 300, 48]} />
        <meshLambertMaterial color={PALETTE.grass} />
      </mesh>

      {/* 실제로 걸어갈 수 있는 범위 밖의 배경 스카이라인 — 혁신도시다운
          밀도를 줍니다. 여섯 거점만 있으면 도시가 아니라 공원처럼 보입니다 */}
      <CitySkyline />

      <Lake />
      <TreeLine />

      {/* 빛가람 호수공원 전망대 */}
      <Observatory />
      <Html
        position={[LAYOUT.observatory.x, LAYOUT.observatory.h * 1.05, LAYOUT.observatory.z]}
        center
        distanceFactor={60}
        zIndexRange={[10, 0]}
      >
        <div style={label}>빛가람 호수공원 전망대</div>
      </Html>
      <QuestNpc
        id="npc-bitgaram-guide"
        name="공원 안내원"
        x={LAYOUT.guide.x}
        z={LAYOUT.guide.z}
        gives={['bitgaram-01-observatory']}
        turnsIn={['bitgaram-01-observatory']}
        idle="전망대에 오르면 빛가람동이 한눈에 들어온단다. 안내판 문제부터 풀어 보렴."
      >
        <ParkGuideBody />
      </QuestNpc>
      <Interactable
        targetId="info-observatory"
        x={LAYOUT.guide.x + 3}
        z={LAYOUT.guide.z + 1.5}
        label="전망대 안내판 읽기"
        title="빛가람 호수공원 전망대"
        body="높이 39.6m. 호수공원과 빛가람동 전체를 내려다볼 수 있습니다."
        range={3}
      >
        <InfoBoard rotY={Math.PI} />
      </Interactable>
      {observatoryGiven && (
        <Interactable
          targetId="puzzle-bitgaram-observatory"
          kind="interact"
          once={false}
          x={LAYOUT.guide.x - 3}
          z={LAYOUT.guide.z + 1.5}
          label="전망대 문제 풀기"
          range={3}
          onFirst={() => openPuzzle('puzzle-bitgaram-observatory')}
        >
          <InfoBoard rotY={Math.PI} />
        </Interactable>
      )}

      {/* 한국전력공사 */}
      <KepcoTower />
      <Html
        position={[LAYOUT.kepco.x, LAYOUT.kepco.h + 2.4, LAYOUT.kepco.z]}
        center
        distanceFactor={60}
        zIndexRange={[10, 0]}
      >
        <div style={label}>한국전력공사</div>
      </Html>
      <QuestNpc
        id="npc-kepco-staff"
        name="한전 직원"
        x={LAYOUT.kepcoStaff.x}
        z={LAYOUT.kepcoStaff.z}
        gives={['bitgaram-02-kepco']}
        turnsIn={['bitgaram-02-kepco']}
        idle="여기서 대한민국 전기를 관리해요. 안내판 문제부터 풀어 볼래요?"
      >
        <KepcoStaffBody />
      </QuestNpc>
      <Interactable
        targetId="info-kepco"
        x={LAYOUT.kepcoStaff.x + 3}
        z={LAYOUT.kepcoStaff.z - 1.5}
        label="한전 안내판 읽기"
        title="한국전력공사"
        body="대한민국의 전력을 관리하고, 친환경 스마트 그리드 기술을 이끄는 공공기관입니다."
        range={3}
      >
        <InfoBoard rotY={Math.PI / 2} />
      </Interactable>
      {kepcoGiven && (
        <Interactable
          targetId="puzzle-bitgaram-kepco"
          kind="interact"
          once={false}
          x={LAYOUT.kepcoStaff.x + 3}
          z={LAYOUT.kepcoStaff.z + 2}
          label="한전 문제 풀기"
          range={3}
          onFirst={() => openPuzzle('puzzle-bitgaram-kepco')}
        >
          <InfoBoard rotY={Math.PI / 2} />
        </Interactable>
      )}

      {/* KENTECH */}
      <KentechCampus />
      <Html
        position={[LAYOUT.kentech.x, LAYOUT.kentech.h + 2.4, LAYOUT.kentech.z]}
        center
        distanceFactor={60}
        zIndexRange={[10, 0]}
      >
        <div style={label}>KENTECH · 한국에너지공과대학교</div>
      </Html>
      <QuestNpc
        id="npc-kentech-researcher"
        name="KENTECH 연구원"
        x={LAYOUT.kentechResearcher.x}
        z={LAYOUT.kentechResearcher.z}
        gives={['bitgaram-03-kentech']}
        turnsIn={['bitgaram-03-kentech']}
        idle="우리는 수소·태양광 같은 미래 에너지를 연구해요. 안내판 문제부터 풀어 볼래요?"
      >
        <ResearcherBody />
      </QuestNpc>
      <Interactable
        targetId="info-kentech"
        x={LAYOUT.kentechResearcher.x - 3}
        z={LAYOUT.kentechResearcher.z - 1.5}
        label="KENTECH 안내판 읽기"
        title="KENTECH"
        body="수소·태양광·ESS 같은 미래 신재생 에너지를 연구하는 세계 유일의 에너지 특화 공과대학입니다."
        range={3}
      >
        <InfoBoard rotY={-Math.PI / 2} />
      </Interactable>
      {kentechGiven && (
        <Interactable
          targetId="puzzle-bitgaram-kentech"
          kind="interact"
          once={false}
          x={LAYOUT.kentechResearcher.x - 3}
          z={LAYOUT.kentechResearcher.z + 2}
          label="KENTECH 문제 풀기"
          range={3}
          onFirst={() => openPuzzle('puzzle-bitgaram-kentech')}
        >
          <InfoBoard rotY={-Math.PI / 2} />
        </Interactable>
      )}

      {/* 전력거래소(KPX) */}
      <KpxCenter />
      <Html
        position={[LAYOUT.kpx.x, LAYOUT.kpx.h + 2.4, LAYOUT.kpx.z]}
        center
        distanceFactor={60}
        zIndexRange={[10, 0]}
      >
        <div style={label}>전력거래소 (KPX)</div>
      </Html>
      <QuestNpc
        id="npc-kpx-operator"
        name="관제 요원"
        x={LAYOUT.kpxOperator.x}
        z={LAYOUT.kpxOperator.z}
        gives={['bitgaram-04-kpx']}
        turnsIn={['bitgaram-04-kpx']}
        idle="전기는 저장이 어려워서, 만드는 양과 쓰는 양을 여기서 실시간으로 맞춰요. 안내판 문제부터 풀어 볼래요?"
      >
        <KpxOperatorBody />
      </QuestNpc>
      <Interactable
        targetId="info-kpx"
        x={LAYOUT.kpxOperator.x + 3}
        z={LAYOUT.kpxOperator.z - 1.5}
        label="전력거래소 안내판 읽기"
        title="전력거래소 (KPX)"
        body="전국의 전력 거래와 실시간 전력망을 조절하는, 대한민국 전력의 컨트롤타워입니다."
        range={3}
      >
        <InfoBoard rotY={Math.PI / 2} />
      </Interactable>
      {kpxGiven && (
        <Interactable
          targetId="puzzle-bitgaram-kpx"
          kind="interact"
          once={false}
          x={LAYOUT.kpxOperator.x + 3}
          z={LAYOUT.kpxOperator.z + 2}
          label="전력거래소 문제 풀기"
          range={3}
          onFirst={() => openPuzzle('puzzle-bitgaram-kpx')}
        >
          <InfoBoard rotY={Math.PI / 2} />
        </Interactable>
      )}

      {/* 한국콘텐츠진흥원(KOCCA) */}
      <KoccaStudio />
      <Html
        position={[LAYOUT.kocca.x, LAYOUT.kocca.h + 2.4, LAYOUT.kocca.z]}
        center
        distanceFactor={60}
        zIndexRange={[10, 0]}
      >
        <div style={label}>한국콘텐츠진흥원 (KOCCA)</div>
      </Html>
      <QuestNpc
        id="npc-kocca-creator"
        name="KOCCA 크리에이터"
        x={LAYOUT.koccaCreator.x}
        z={LAYOUT.koccaCreator.z}
        gives={['bitgaram-05-kocca']}
        turnsIn={['bitgaram-05-kocca']}
        idle="우리는 영화·게임·웹툰 같은 K-콘텐츠를 만드는 사람들을 도와요. 안내판 문제부터 풀어 볼래요?"
      >
        <KoccaCreatorBody />
      </QuestNpc>
      <Interactable
        targetId="info-kocca"
        x={LAYOUT.koccaCreator.x - 3}
        z={LAYOUT.koccaCreator.z - 1.5}
        label="KOCCA 안내판 읽기"
        title="한국콘텐츠진흥원 (KOCCA)"
        body="영화·게임·웹툰 같은 K-콘텐츠 산업을 지원하는 기관입니다. 나주의 이야기도 좋은 소재가 됩니다."
        range={3}
      >
        <InfoBoard rotY={-Math.PI / 2} />
      </Interactable>
      {koccaGiven && (
        <Interactable
          targetId="puzzle-bitgaram-kocca"
          kind="interact"
          once={false}
          x={LAYOUT.koccaCreator.x - 3}
          z={LAYOUT.koccaCreator.z + 2}
          label="KOCCA 문제 풀기"
          range={3}
          onFirst={() => openPuzzle('puzzle-bitgaram-kocca')}
        >
          <InfoBoard rotY={-Math.PI / 2} />
        </Interactable>
      )}

      {/* 스마트 라이프 센터 & 도서관 */}
      <SmartLifeCenter />
      <Html
        position={[LAYOUT.smartLife.x, LAYOUT.smartLife.h + 2.2, LAYOUT.smartLife.z]}
        center
        distanceFactor={60}
        zIndexRange={[10, 0]}
      >
        <div style={label}>스마트 라이프 센터 & 도서관</div>
      </Html>
      <QuestNpc
        id="npc-smart-life-coordinator"
        name="스마트 라이프 코디네이터"
        x={LAYOUT.smartLifeCoordinator.x}
        z={LAYOUT.smartLifeCoordinator.z}
        gives={['bitgaram-06-smart-life']}
        turnsIn={['bitgaram-06-smart-life']}
        idle="여기서는 탄소중립 생활을 배우고 실천해요. 안내판 문제부터 풀어 볼래요?"
      >
        <SmartLifeCoordinatorBody />
      </QuestNpc>
      <Interactable
        targetId="info-smart-life"
        x={LAYOUT.smartLifeCoordinator.x + 3}
        z={LAYOUT.smartLifeCoordinator.z - 1.5}
        label="스마트 라이프 센터 안내판 읽기"
        title="스마트 라이프 센터 & 도서관"
        body="탄소중립 생활을 배우고 실천하는 시민 공간입니다. 로컬푸드 식당과 도서관을 함께 갖췄습니다."
        range={3}
      >
        <InfoBoard rotY={Math.PI} />
      </Interactable>
      {smartLifeGiven && (
        <Interactable
          targetId="puzzle-bitgaram-smart-life"
          kind="interact"
          once={false}
          x={LAYOUT.smartLifeCoordinator.x - 3}
          z={LAYOUT.smartLifeCoordinator.z - 1.5}
          label="스마트 라이프 센터 문제 풀기"
          range={3}
          onFirst={() => openPuzzle('puzzle-bitgaram-smart-life')}
        >
          <InfoBoard rotY={Math.PI} />
        </Interactable>
      )}

      <Player />
    </>
  )
}

const label: React.CSSProperties = {
  whiteSpace: 'nowrap',
  color: '#1f3a4a',
  fontSize: 22,
  fontWeight: 700,
  textShadow: '0 1px 6px rgba(255,255,255,.7)',
  pointerEvents: 'none',
}
