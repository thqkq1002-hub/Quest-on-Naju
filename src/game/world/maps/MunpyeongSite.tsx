import { Html } from '@react-three/drei'
import { PALETTE } from '@/lib/palette'
import { Player } from '@/game/player/Player'
import { QuestNpc } from '../Npc'
import { Interactable } from '../Interactable'
import { BlacksmithBody, ElderBody, ShipwrightBody, ShrineKeeperBody } from '../bodies'
import { SignPost } from './bokamri/BokamriProps'
import { setTerrain } from '../terrain'
import { useGameStore } from '@/store/gameStore'
import { BOUNDS, COLLIDERS, LAYOUT } from './munpyeong/layout'
import { Birthplace, ChangseonWorkshop, PineTrees, Shipyard, Sochungsa } from './munpyeong/MunpyeongProps'

/**
 * 문평면 — 무민공 나대용 장군 유적. 다시면·빛가람동 다음 세 번째 읍·면·동.
 *
 * 다시면이 "오늘의 학교", 빛가람동이 "오늘의 혁신도시"라면 여기는
 * "조선시대 유적"입니다. 그래서 빛도 색도 또 한 번 다르게 갑니다 —
 * 다시면의 아침 하늘, 빛가람동의 한낮 유리색과 달리, 여기는 늦가을
 * 오후의 낮은 금빛 햇살과 흙벽·기와·단청의 고재색입니다.
 *
 * 안내판(나무 팻말)은 복암리의 `SignPost`를 그대로 재사용합니다 — 둘 다
 * "옛터에 세운 나무 팻말"이라 새로 만들 이유가 없습니다.
 *
 * 거점 넷(생가·소충사·거북선 건조 체험장·창선 연구소) 모두 같은 구조입니다
 * — NPC에게 말을 걸어 퀘스트를 받고, 안내판 앞에서 문제를 풉니다.
 * → docs/06-NAJU-WORLD-MAP.md
 */
const TERRAIN = { bounds: BOUNDS, colliders: COLLIDERS, spawn: LAYOUT.spawn }
setTerrain(TERRAIN)

export function MunpyeongSite({ shadows }: { shadows: boolean }) {
  setTerrain(TERRAIN)
  const openPuzzle = useGameStore((s) => s.openPuzzle)
  const active = useGameStore((s) => s.active)
  const completed = useGameStore((s) => s.completedQuests)

  const given = (id: string) => id in active || completed.includes(id)
  const birthplaceGiven = given('munpyeong-01-birthplace')
  const sochungsaGiven = given('munpyeong-02-sochungsa')
  const shipyardGiven = given('munpyeong-03-shipyard')
  const changseonGiven = given('munpyeong-04-changseon')

  return (
    <>
      {/* 늦가을 오후의 낮은 금빛 해 — 기와·단청 색이 진하게 살아나야 합니다 */}
      <hemisphereLight args={['#f2dfb0', '#5c5340', 1.0]} />
      <directionalLight
        position={[-55, 50, 35]}
        intensity={1.5}
        color="#ffe6b0"
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-90}
        shadow-camera-right={90}
        shadow-camera-top={90}
        shadow-camera-bottom={-90}
        shadow-camera-near={1}
        shadow-camera-far={220}
        shadow-bias={-0.0008}
      />
      <fog attach="fog" args={['#e8dcb8', 140, 460]} />
      <color attach="background" args={['#efe3bf']} />

      {/* 지면 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[900, 900]} />
        <meshLambertMaterial color={PALETTE.grassDark} />
      </mesh>

      <PineTrees />

      {/* 나대용 장군 생가 */}
      <Birthplace />
      <Html
        position={[LAYOUT.birthplace.x, LAYOUT.birthplace.h + 2.6, LAYOUT.birthplace.z]}
        center
        distanceFactor={56}
        zIndexRange={[10, 0]}
      >
        <div style={label}>나대용 장군 생가</div>
      </Html>
      <QuestNpc
        id="npc-birthplace-caretaker"
        name="생가 관리인"
        x={LAYOUT.caretaker.x}
        z={LAYOUT.caretaker.z}
        gives={['munpyeong-01-birthplace']}
        turnsIn={['munpyeong-01-birthplace']}
        idle="이 댁에서 나대용 장군께서 나고 자라셨지. 안내판 문제부터 풀어 보렴."
      >
        <ElderBody />
      </QuestNpc>
      <Interactable
        targetId="info-birthplace"
        x={LAYOUT.caretaker.x + 3}
        z={LAYOUT.caretaker.z - 1.5}
        label="생가 안내판 읽기"
        title="나대용 장군 생가"
        body="조선 최고의 군함 과학자 무민공 나대용 장군이 태어나 학문과 무예를 익힌 곳입니다."
        range={3}
      >
        <SignPost rotY={Math.PI / 2} />
      </Interactable>
      {birthplaceGiven && (
        <Interactable
          targetId="puzzle-munpyeong-birthplace"
          kind="interact"
          once={false}
          x={LAYOUT.caretaker.x + 3}
          z={LAYOUT.caretaker.z + 2}
          label="생가 문제 풀기"
          range={3}
          onFirst={() => openPuzzle('puzzle-munpyeong-birthplace')}
        >
          <SignPost rotY={Math.PI / 2} />
        </Interactable>
      )}

      {/* 소충사 */}
      <Sochungsa />
      <Html
        position={[LAYOUT.sochungsa.x, LAYOUT.sochungsa.h + 3.2, LAYOUT.sochungsa.z]}
        center
        distanceFactor={56}
        zIndexRange={[10, 0]}
      >
        <div style={label}>소충사 (昭忠祠)</div>
      </Html>
      <QuestNpc
        id="npc-shrine-keeper"
        name="소충사 관리인"
        x={LAYOUT.shrineKeeper.x}
        z={LAYOUT.shrineKeeper.z}
        gives={['munpyeong-02-sochungsa']}
        turnsIn={['munpyeong-02-sochungsa']}
        idle="이곳에 장군의 영정과 위패를 모셨네. 안내판 문제부터 풀어 보렴."
      >
        <ShrineKeeperBody />
      </QuestNpc>
      <Interactable
        targetId="info-sochungsa"
        x={LAYOUT.shrineKeeper.x - 3}
        z={LAYOUT.shrineKeeper.z - 1.5}
        label="소충사 안내판 읽기"
        title="소충사 (昭忠祠)"
        body="나대용 장군의 호국충절을 기리기 위해 세운 사당으로, 장군의 영정과 위패가 모셔져 있습니다."
        range={3}
      >
        <SignPost rotY={-Math.PI / 2} />
      </Interactable>
      {sochungsaGiven && (
        <Interactable
          targetId="puzzle-munpyeong-sochungsa"
          kind="interact"
          once={false}
          x={LAYOUT.shrineKeeper.x - 3}
          z={LAYOUT.shrineKeeper.z + 2}
          label="소충사 문제 풀기"
          range={3}
          onFirst={() => openPuzzle('puzzle-munpyeong-sochungsa')}
        >
          <SignPost rotY={-Math.PI / 2} />
        </Interactable>
      )}

      {/* 거북선 건조 체험장 */}
      <Shipyard />
      <Html
        position={[LAYOUT.shipyard.x, 6, LAYOUT.shipyard.z - LAYOUT.shipyard.pondR - 2]}
        center
        distanceFactor={56}
        zIndexRange={[10, 0]}
      >
        <div style={label}>거북선 건조 체험장</div>
      </Html>
      <QuestNpc
        id="npc-shipwright"
        name="조선공"
        x={LAYOUT.shipwright.x}
        z={LAYOUT.shipwright.z}
        gives={['munpyeong-03-shipyard']}
        turnsIn={['munpyeong-03-shipyard']}
        idle="이 배가 거북선일세. 나대용 장군께서 이순신 장군과 함께 개량하셨지. 안내판 문제부터 풀어 보렴."
      >
        <ShipwrightBody />
      </QuestNpc>
      <Interactable
        targetId="info-shipyard"
        x={LAYOUT.shipwright.x + 3}
        z={LAYOUT.shipwright.z - 1.5}
        label="거북선 안내판 읽기"
        title="거북선 건조 체험장"
        body="거북선의 용머리, 덮개의 쇠송곳, 노의 위치를 직접 살펴볼 수 있는 자리입니다. (체험을 위해 재구성한 공간입니다)"
        range={3}
      >
        <SignPost rotY={Math.PI} />
      </Interactable>
      {shipyardGiven && (
        <Interactable
          targetId="puzzle-munpyeong-shipyard"
          kind="interact"
          once={false}
          x={LAYOUT.shipwright.x - 3}
          z={LAYOUT.shipwright.z + 1.5}
          label="거북선 문제 풀기"
          range={3}
          onFirst={() => openPuzzle('puzzle-munpyeong-shipyard')}
        >
          <SignPost rotY={Math.PI} />
        </Interactable>
      )}

      {/* 신형 군함 창선 연구소 */}
      <ChangseonWorkshop />
      <Html
        position={[LAYOUT.changseon.x, LAYOUT.changseon.h + 2.6, LAYOUT.changseon.z]}
        center
        distanceFactor={56}
        zIndexRange={[10, 0]}
      >
        <div style={label}>신형 군함 창선 연구소</div>
      </Html>
      <QuestNpc
        id="npc-blacksmith"
        name="대장장이"
        x={LAYOUT.blacksmith.x}
        z={LAYOUT.blacksmith.z}
        gives={['munpyeong-04-changseon']}
        turnsIn={['munpyeong-04-changseon']}
        idle="장군께서 거북선 다음으로 벼리신 배가 하나 더 있다네. 안내판 문제부터 풀어 보렴."
      >
        <BlacksmithBody />
      </QuestNpc>
      <Interactable
        targetId="info-changseon"
        x={LAYOUT.blacksmith.x + 3}
        z={LAYOUT.blacksmith.z - 1.5}
        label="창선 연구소 안내판 읽기"
        title="신형 군함 창선 연구소"
        body="나대용 장군이 거북선 이후에 만든 좁고 빠른 칼날 돌격선 '창선(槍船)'을 살펴볼 수 있는 자리입니다. (체험을 위해 재구성한 공간입니다)"
        range={3}
      >
        <SignPost rotY={-Math.PI / 2} />
      </Interactable>
      {changseonGiven && (
        <Interactable
          targetId="puzzle-munpyeong-changseon"
          kind="interact"
          once={false}
          x={LAYOUT.blacksmith.x + 3}
          z={LAYOUT.blacksmith.z + 2}
          label="창선 연구소 문제 풀기"
          range={3}
          onFirst={() => openPuzzle('puzzle-munpyeong-changseon')}
        >
          <SignPost rotY={-Math.PI / 2} />
        </Interactable>
      )}

      <Player />
    </>
  )
}

const label: React.CSSProperties = {
  whiteSpace: 'nowrap',
  color: '#4a3620',
  fontSize: 22,
  fontWeight: 700,
  textShadow: '0 1px 6px rgba(255,247,224,.8)',
  pointerEvents: 'none',
}
