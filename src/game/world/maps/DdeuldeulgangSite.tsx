import { Html } from '@react-three/drei'
import { PALETTE } from '@/lib/palette'
import { Player } from '@/game/player/Player'
import { QuestNpc } from '../Npc'
import { Interactable } from '../Interactable'
import { SoliBody } from '../bodies'
import { setTerrain } from '../terrain'
import { useGameStore } from '@/store/gameStore'
import { BOUNDS, COLLIDERS, LAYOUT } from './ddeuldeulgang/layout'
import { PineForest, River, Songbi } from './ddeuldeulgang/DdeuldeulgangProps'

/**
 * 드들강 솔밭유원지 — 남평읍. 다시역에서 기차로 이어지는 여섯 번째 거점.
 *
 * 다른 맵들과 달리 "유적을 배운다"가 아니라 "숲을 걷고 노래를 완성한다"는
 * 결이라, 빛도 색도 더 맑게 갑니다 — 짙은 상록의 소나무와 드들강의
 * 잔잔한 물빛. 배경음악(BgmToggle)이 붙는 유일한 맵이기도 합니다.
 * → ddeuldeulgang/layout.ts 상단 고증 메모.
 */
const TERRAIN = { bounds: BOUNDS, colliders: COLLIDERS, spawn: LAYOUT.spawn }
setTerrain(TERRAIN)

export function DdeuldeulgangSite({ shadows }: { shadows: boolean }) {
  setTerrain(TERRAIN)
  const openPuzzle = useGameStore((s) => s.openPuzzle)
  const active = useGameStore((s) => s.active)
  const completed = useGameStore((s) => s.completedQuests)

  const melodyGiven = 'ddeuldeulgang-01-melody' in active || completed.includes('ddeuldeulgang-01-melody')

  return (
    <>
      {/* 맑은 한낮의 숲빛 — 짙은 상록수와 강물이 또렷하게 살아나야 합니다 */}
      <hemisphereLight args={[PALETTE.skyTop, '#3f6b4a', 1.05]} />
      <directionalLight
        position={[45, 60, 35]}
        intensity={1.5}
        color="#f5fff0"
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-85}
        shadow-camera-right={85}
        shadow-camera-top={85}
        shadow-camera-bottom={-85}
        shadow-camera-near={1}
        shadow-camera-far={200}
        shadow-bias={-0.0008}
      />
      <fog attach="fog" args={['#dcece0', 130, 420]} />
      <color attach="background" args={[PALETTE.skyBottom]} />

      {/* 지면 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[900, 900]} />
        <meshLambertMaterial color={PALETTE.grass} flatShading />
      </mesh>
      {/* 산책로 */}
      <mesh position={[0, 0.01, -4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 92]} />
        <meshLambertMaterial color={PALETTE.path} flatShading />
      </mesh>

      <River />
      <PineForest />

      {/* 안성현 선생 노래비 */}
      <Songbi />
      <Html position={[LAYOUT.songbi.x, 3.6, LAYOUT.songbi.z]} center distanceFactor={50} zIndexRange={[10, 0]}>
        <div style={label}>안성현 선생 노래비</div>
      </Html>
      <Interactable
        targetId="info-songbi"
        x={LAYOUT.songbiInfo.x}
        z={LAYOUT.songbiInfo.z}
        label="노래비 읽기"
        title="안성현 선생 노래비"
        body="작곡가 안성현(1920~2006) 선생을 기리는 노래비입니다. 김소월의 시에 곡을 붙인 '엄마야 누나야', 박기동의 시에 곡을 붙인 '부용산' 등을 남겼습니다."
        range={3.2}
      />

      {/* 리듬 악보 완성 — 퀘스트를 받은 뒤에만 열립니다 */}
      {melodyGiven && (
        <Interactable
          targetId="puzzle-pine-rhythm"
          kind="interact"
          once={false}
          x={LAYOUT.rhythmTrigger.x}
          z={LAYOUT.rhythmTrigger.z}
          label="강가에서 리듬 악보 완성하기"
          range={3.4}
          onFirst={() => openPuzzle('puzzle-pine-rhythm')}
        >
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[0.08, 1.1, 0.08]} />
            <meshLambertMaterial color={PALETTE.trunk} flatShading />
          </mesh>
          <mesh position={[0, 1.05, 0]} castShadow>
            <boxGeometry args={[0.85, 0.5, 0.06]} />
            <meshLambertMaterial color={PALETTE.pineDark} flatShading />
          </mesh>
        </Interactable>
      )}

      {/* 솔바람 요정 솔이 — 진입로 초입에서 맞아 줍니다 */}
      <QuestNpc
        id="npc-soli"
        name="솔바람 요정 솔이"
        x={LAYOUT.soli.x}
        z={LAYOUT.soli.z}
        gives={['ddeuldeulgang-01-melody']}
        turnsIn={['ddeuldeulgang-01-melody']}
        idle="솔솔~ 숲길 걷다가 힘들면 잠깐 쉬었다 가렴. 드들강 물소리가 참 좋지?"
      >
        <SoliBody />
      </QuestNpc>

      <Player />
    </>
  )
}

const label: React.CSSProperties = {
  whiteSpace: 'nowrap',
  color: '#22402c',
  fontSize: 22,
  fontWeight: 700,
  textShadow: '0 1px 6px rgba(240,255,244,.8)',
  pointerEvents: 'none',
}
