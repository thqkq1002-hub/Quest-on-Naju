import { Html } from '@react-three/drei'
import { PALETTE } from '@/lib/palette'
import { Player } from '@/game/player/Player'
import { QuestNpc } from '../Npc'
import { Interactable } from '../Interactable'
import { KimCheonilBody } from '../bodies'
import { setTerrain } from '../terrain'
import { useGameStore } from '@/store/gameStore'
import { BOUNDS, COLLIDERS, LAYOUT } from './jeongryeolsa/layout'
import { Bonfire, ExhibitHall, Hongsalmun, Shrine } from './jeongryeolsa/JeongryeolsaProps'

/**
 * 정렬사 — 김천일 의병장과 충절 5위를 기리는 사당. 아홉 번째 거점입니다.
 *
 * 문평면(조선시대 유적)과 같은 팔레트를 쓰지만, 여기는 "장군이 다스리던
 * 곳"이 아니라 "장군을 기리는 곳"입니다. 그래서 무덤도 관아도 아닌
 * 사당 한 채와 그 앞마당이 이야기의 전부입니다 — 작게, 붉게, 단단하게.
 * → jeongryeolsa/layout.ts 상단 고증 메모.
 */
const TERRAIN = { bounds: BOUNDS, colliders: COLLIDERS, spawn: LAYOUT.spawn }
setTerrain(TERRAIN)

export function JeongryeolsaSite({ shadows }: { shadows: boolean }) {
  setTerrain(TERRAIN)
  const openPuzzle = useGameStore((s) => s.openPuzzle)
  const active = useGameStore((s) => s.active)
  const completed = useGameStore((s) => s.completedQuests)

  const given = (id: string) => id in active || completed.includes(id)
  const torchGiven = given('jeongryeolsa-01-torch')

  return (
    <>
      {/* 늦가을 오후, 단청의 붉은빛이 짙게 살아나는 낮은 볕 */}
      <hemisphereLight args={['#f2dfb0', '#5c5340', 1.0]} />
      <directionalLight
        position={[-50, 55, 40]}
        intensity={1.5}
        color="#ffe0b0"
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-70}
        shadow-camera-right={70}
        shadow-camera-top={70}
        shadow-camera-bottom={-70}
        shadow-camera-near={1}
        shadow-camera-far={200}
        shadow-bias={-0.0008}
      />
      <fog attach="fog" args={['#e8dcb8', 120, 400]} />
      <color attach="background" args={['#efe3bf']} />

      {/* 지면 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[700, 700]} />
        <meshLambertMaterial color={PALETTE.grassDark} flatShading />
      </mesh>
      {/* 참배로 — 홍살문에서 사당까지 이어지는 길 */}
      <mesh position={[0, 0.01, -6]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 92]} />
        <meshLambertMaterial color={PALETTE.path} flatShading />
      </mesh>

      <Hongsalmun />

      {/* [구역 1] 유물전시관 */}
      <ExhibitHall />
      <Html
        position={[LAYOUT.exhibit.x, LAYOUT.exhibit.h + 1.6, LAYOUT.exhibit.z]}
        center
        distanceFactor={50}
        zIndexRange={[10, 0]}
      >
        <div style={label}>유물전시관</div>
      </Html>
      <Interactable
        targetId="info-exhibit"
        x={LAYOUT.exhibitInfo.x}
        z={LAYOUT.exhibitInfo.z}
        label="유물전시관 살펴보기"
        title="유물전시관"
        body="김천일 의병장의 유품과 의병 활동 기록을 전시합니다. 나주에서 모인 의병들이 남긴 자취를 살펴볼 수 있습니다."
        range={3.2}
      />

      {/* [구역 2] 사당(정렬사) */}
      <Shrine />
      <Html
        position={[LAYOUT.shrine.x, LAYOUT.shrine.h + 2.2, LAYOUT.shrine.z]}
        center
        distanceFactor={54}
        zIndexRange={[10, 0]}
      >
        <div style={label}>정렬사</div>
      </Html>
      <Interactable
        targetId="info-shrine"
        x={LAYOUT.shrineInfo.x}
        z={LAYOUT.shrineInfo.z}
        label="사당 위패 살펴보기"
        title="정렬사(旌烈祠)"
        body="김천일 의병장과 아들 김상건, 양산숙, 임회, 이용재 등 충절 5위의 위패를 모신 사당입니다."
        range={3.4}
      />

      {/* 의병 훈련 모닥불 — 사당 앞마당 */}
      <Bonfire />
      {torchGiven && (
        <Interactable
          targetId="puzzle-uibyeong-torch"
          kind="interact"
          once={false}
          x={LAYOUT.bonfire.x}
          z={LAYOUT.bonfire.z + 3}
          label="모닥불 앞에서 의병 훈련하기"
          range={3.4}
          onFirst={() => openPuzzle('puzzle-uibyeong-torch')}
        />
      )}

      {/* 김천일 의병장 */}
      <QuestNpc
        id="npc-kimcheonil"
        name="김천일 의병장"
        x={LAYOUT.kimCheonil.x}
        z={LAYOUT.kimCheonil.z}
        gives={['jeongryeolsa-00-exhibit', 'jeongryeolsa-01-torch']}
        turnsIn={['jeongryeolsa-00-exhibit', 'jeongryeolsa-01-torch']}
        idle="나라가 위태로울 때 가만히 있을 수야 있나. 그 마음 하나면 누구든 의병일세."
      >
        <KimCheonilBody />
      </QuestNpc>

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
