import { Html } from '@react-three/drei'
import { PALETTE } from '@/lib/palette'
import { Player } from '@/game/player/Player'
import { AssemblyHall, SchoolBuilding } from './dasi-school/SchoolBuilding'
import { Playground } from './dasi-school/Playground'
import { BlueShed, Flagpole, FlowerBeds, ReadingGirlStatue, SchoolBuses } from './dasi-school/SchoolProps'
import { HwangpoBoat, PearOrchard, River, Trees, Village, Wharf } from './dasi-school/Nature'
import { DasiStation, Railway, StationPlatform, Train } from './dasi-school/Station'
import { QuestNpc } from '../Npc'
import { Interactable } from '../Interactable'
import { BoatmanBody, ElderBody, PrincipalBody, StationmasterBody, TeacherBody } from '../bodies'
import { setTerrain } from '../terrain'
import { useGameStore } from '@/store/gameStore'
import { BOUNDS, COLLIDERS, LAYOUT, ORCHARD, STATION } from './dasi-school/layout'

/**
 * 다시초등학교 — 게임의 시작 맵.
 *
 * 나주 전역을 한 씬에 담지 않습니다. 지역마다 별도 맵으로 만들고
 * 맵 이동으로 잇습니다. → docs/06-NAJU-WORLD-MAP.md
 *
 * 여기서 시작하는 이유: 다시초등학교는 나주시 **다시면** 다시로 203에 있고,
 * 복암리 고분군도 같은 다시면 복암리에 있습니다. 걸어서 볼 수 있는 거리는
 * 아니지만 **같은 동네**입니다. 그래서 이 게임은 "먼 옛날 어딘가"가 아니라
 * 학생이 매일 다니는 자기 학교에서 시작합니다.
 *
 * 배치는 오너가 제공한 항공 영상(2024-10-30)을 근거로 했습니다. → layout.ts
 */
// 씬을 그리기 전에 땅을 등록합니다. Player 가 마운트될 때 이미 여기 값을
// 보고 spawn 을 잡아야 하므로, 컴포넌트 본문(렌더 중)에서 부릅니다.
setTerrain({ bounds: BOUNDS, colliders: COLLIDERS, spawn: LAYOUT.spawn })

export function DasiSchoolField({ shadows }: { shadows: boolean }) {
  setTerrain({ bounds: BOUNDS, colliders: COLLIDERS, spawn: LAYOUT.spawn })
  const openPuzzle = useGameStore((s) => s.openPuzzle)
  const active = useGameStore((s) => s.active)
  const completed = useGameStore((s) => s.completedQuests)
  const pearQuestGiven = 'dasi-01-pear-quiz' in active || completed.includes('dasi-01-pear-quiz')

  return (
    <>
      {/* 조명 — 오전의 낮은 해. 그림자가 길어야 형태가 읽힙니다 */}
      {/* 해를 남동쪽에 둡니다. 처음엔 동쪽에 뒀는데 본관 남쪽 정면이
          역광이 되어 분홍 벽돌이 갈색으로 죽어 보였습니다.
          정면이 이 학교의 얼굴이라 거기에 빛이 들어야 합니다. */}
      <hemisphereLight args={[PALETTE.skyTop, PALETTE.grassDark, 1.0]} />
      <directionalLight
        position={[52, 66, 78]}
        intensity={1.55}
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-95}
        shadow-camera-right={95}
        shadow-camera-top={95}
        shadow-camera-bottom={-95}
        shadow-camera-near={1}
        shadow-camera-far={220}
        shadow-bias={-0.0008}
      />
      <fog attach="fog" args={[PALETTE.fog, 150, 480]} />
      <color attach="background" args={[PALETTE.skyBottom]} />

      {/* 지면 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[900, 900]} />
        <meshLambertMaterial color={PALETTE.grass} />
      </mesh>

      {/* 학교 */}
      <SchoolBuilding />
      <AssemblyHall />
      <Playground />
      <Flagpole />
      <ReadingGirlStatue />
      <BlueShed />
      <SchoolBuses />
      <FlowerBeds />
      <Trees />

      {/* 학교 밖 — 다시면 소재지 */}
      <Village />

      {/* 학교 서쪽 — 영산강과 황포돛배 */}
      <River />
      <Wharf />
      <HwangpoBoat />
      <QuestNpc
        id="npc-boatman"
        name="뱃사공"
        x={-188}
        z={67}
        idle={
          '영산강은 예로부터 나주의 젖줄이었어. 나주평야에서 거둔 쌀이며 물건들이 죄다 이 물길을 타고 목포까지 오갔지.\n' +
          '저 배 돛이 누런 것도 이유가 있단다. 누런 흙물을 먹인 천이라 황포(黃布)라 불렀는데, 그래야 물이 잘 배지 않고 오래 버텼거든.\n' +
          '1980년대에 강 어귀에 둑을 쌓은 뒤로는 큰 배가 못 다니게 됐어. 지금 저 배는 그 시절을 기억하려고 띄워 둔 거란다.'
        }
      >
        <BoatmanBody />
      </QuestNpc>

      {/* 학교 남쪽 — 철로와 다시역 */}
      <Railway />
      <Train />
      <StationPlatform />
      <DasiStation />
      <QuestNpc
        id="npc-stationmaster"
        name="역장"
        x={STATION.x}
        z={STATION.z - STATION.d / 2 - 2.5}
        idle={
          '어서 오렴. 여기가 다시역이야. 호남선 열차가 서는 역이지.\n' +
          '예전엔 이 역에서 나주평야 쌀이며 특산물을 실어 날랐다고 하더구나. 영산강 뱃길이랑 같이 나주 물건을 밖으로 보내는 길이었지.\n' +
          '기차 지나갈 때는 승강장 노란 선 안쪽에 서 있어야 한다. 알겠지?'
        }
      >
        <StationmasterBody />
      </QuestNpc>

      {/* 학교 동쪽 — 배나무 밭 (나주배) */}
      <PearOrchard />
      <QuestNpc
        id="npc-orchard-elder"
        name="과수원 할머니"
        x={ORCHARD.xFrom - 4}
        z={0}
        gives={['dasi-01-pear-quiz']}
        turnsIn={['dasi-01-pear-quiz']}
        idle="저 팻말 앞에서 나주배 따기 체험을 해보렴."
      >
        <ElderBody />
      </QuestNpc>
      {pearQuestGiven && (
        <Interactable
          targetId="puzzle-pear-catch"
          kind="interact"
          once={false}
          x={ORCHARD.xFrom + 2}
          z={4}
          label="팻말 앞에서 나주배 따기 체험하기"
          range={3}
          onFirst={() => openPuzzle('puzzle-pear-catch')}
        >
          <mesh position={[0, 0.6, 0]} castShadow>
            <boxGeometry args={[0.08, 1.2, 0.08]} />
            <meshLambertMaterial color={PALETTE.trunk} flatShading />
          </mesh>
          <mesh position={[0, 1.15, 0]} castShadow>
            <boxGeometry args={[0.9, 0.55, 0.06]} />
            <meshLambertMaterial color={PALETTE.band} flatShading />
          </mesh>
        </Interactable>
      )}

      {/* 학교 이름. 한글이라 3D 텍스트(SDF) 대신 DOM 오버레이를 씁니다 —
          폰트 에셋을 받지 않아도 되고 어떤 기기에서도 깨지지 않습니다 */}
      <Html position={[15, 10.6, -15.2]} center distanceFactor={58} zIndexRange={[10, 0]}>
        <div
          style={{
            whiteSpace: 'nowrap',
            color: '#5c4038',
            fontSize: 26,
            fontWeight: 700,
            textShadow: '0 1px 6px rgba(255,255,255,.6)',
            pointerEvents: 'none',
          }}
        >
          다시초등학교
        </div>
      </Html>

      <QuestNpc
        id="npc-principal"
        name="교장선생님"
        x={LAYOUT.principal.x}
        z={LAYOUT.principal.z}
        idle={
          '어서 오렴, 우리 학교에 온 걸 환영한다. 이 학교는 1920년에 문을 연 뒤로 백 년 넘게 이 자리를 지켜왔단다.\n' +
          '나주에는 배울 것도, 둘러볼 것도 참 많아. 선생님들과 이웃 어르신들 말씀 잘 듣고, 나주 곳곳을 부지런히 다녀 보렴.'
        }
      >
        <PrincipalBody />
      </QuestNpc>
      <QuestNpc
        id="npc-teacher"
        name="담임 선생님"
        x={LAYOUT.teacher.x}
        z={LAYOUT.teacher.z}
        gives={['dasi-00-meet-teacher']}
        turnsIn={['dasi-00-meet-teacher']}
        idle="복암리는 지도를 열면 갈 수 있어. 오른쪽 위 「나주 지도」를 눌러 보렴."
      >
        <TeacherBody />
      </QuestNpc>
      <Player />
    </>
  )
}
