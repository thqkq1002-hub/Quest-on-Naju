import { Html } from '@react-three/drei'
import { PALETTE } from '@/lib/palette'
import { Player } from '@/game/player/Player'
import { QuestNpc } from '../Npc'
import { Interactable } from '../Interactable'
import { GomtangLadyBody, MayorBody } from '../bodies'
import { setTerrain } from '../terrain'
import { useGameStore } from '@/store/gameStore'
import { BOUNDS, COLLIDERS, LAYOUT, gateMarker, type GateId } from './najueupseong/layout'
import { FortressWall, GateTower, Geumseonggwan, GomtangHouse } from './najueupseong/NajueupseongProps'

/**
 * 나주읍성 — 금성관과 남고문·동점문·서성문·북망문 4대문.
 *
 * 문평면(조선시대 유적)과 같은 팔레트를 쓰지만, 여기는 "무덤"이 아니라
 * "다스리던 곳" 입니다. 그래서 색은 같아도 배치는 다릅니다 — 성곽으로
 * 둘러싸인 정사각형 안에 금성관을 두고, 네 성문이 그 정사각형의
 * 네 변 한가운데를 지킵니다. 유튜브 [나주읍성 4대문] 영상이 보여 준
 * "성문을 지나면 관아가 나온다"는 공간감을 그대로 옮겼습니다.
 * → najueupseong/layout.ts 상단 고증 메모.
 */
const TERRAIN = { bounds: BOUNDS, colliders: COLLIDERS, spawn: LAYOUT.spawn }
setTerrain(TERRAIN)

const GATE_IDS: GateId[] = ['namgomun', 'dongjeommun', 'seoseongmun', 'bukmangmun']

export function NajueupseongSite({ shadows }: { shadows: boolean }) {
  setTerrain(TERRAIN)
  const openPuzzle = useGameStore((s) => s.openPuzzle)
  const active = useGameStore((s) => s.active)
  const completed = useGameStore((s) => s.completedQuests)
  const items = useGameStore((s) => s.items)

  const given = (id: string) => id in active || completed.includes(id)
  const geumseonggwanGiven = given('najueupseong-00-geumseonggwan')
  const gatesGiven = given('najueupseong-01-four-gates')
  // 4대문을 다 지키고 마패를 받아야 열리는 보상 가게
  const gomtangOpen = items.includes('item-guardian-token')
  const gomtangGiven = given('najueupseong-02-gomtang')

  return (
    <>
      {/* 늦가을 오후, 성곽의 돌빛이 살아나는 낮은 볕 */}
      <hemisphereLight args={['#f2dfb0', '#5c5340', 1.0]} />
      <directionalLight
        position={[60, 55, 40]}
        intensity={1.5}
        color="#ffe6b0"
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
      <fog attach="fog" args={['#e8dcb8', 150, 480]} />
      <color attach="background" args={['#efe3bf']} />

      {/* 지면 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[900, 900]} />
        <meshLambertMaterial color={PALETTE.grassDark} flatShading />
      </mesh>
      {/* 성 안마당 — 흙바닥 광장 */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <circleGeometry args={[48, 40]} />
        <meshLambertMaterial color={PALETTE.path} flatShading />
      </mesh>

      <FortressWall />
      {GATE_IDS.map((id) => (
        <GateTower key={id} id={id} />
      ))}

      {/* 금성관 */}
      <Geumseonggwan />
      <Html
        position={[LAYOUT.geumseonggwan.x, LAYOUT.geumseonggwan.h + 2.4, LAYOUT.geumseonggwan.z]}
        center
        distanceFactor={58}
        zIndexRange={[10, 0]}
      >
        <div style={label}>금성관</div>
      </Html>
      {geumseonggwanGiven && (
        <Interactable
          targetId="puzzle-najueupseong-geumseonggwan"
          kind="interact"
          once={false}
          x={LAYOUT.geumseonggwanInfo.x}
          z={LAYOUT.geumseonggwanInfo.z}
          label="금성관 문제 풀기"
          range={3.4}
          onFirst={() => openPuzzle('puzzle-najueupseong-geumseonggwan')}
        >
          <mesh position={[0, 0.6, 0]} castShadow>
            <boxGeometry args={[0.08, 1.2, 0.08]} />
            <meshLambertMaterial color={PALETTE.trunk} flatShading />
          </mesh>
          <mesh position={[0, 1.15, 0]} castShadow>
            <boxGeometry args={[0.9, 0.55, 0.06]} />
            <meshLambertMaterial color={PALETTE.hanokWood} flatShading />
          </mesh>
        </Interactable>
      )}

      {/* 나주곰탕집 — 수호대장 마패를 받아야 문을 엽니다 */}
      {gomtangOpen && (
        <>
          <GomtangHouse />
          <Html
            position={[LAYOUT.gomtangHouse.x, LAYOUT.gomtangHouse.d * 0.9, LAYOUT.gomtangHouse.z]}
            center
            distanceFactor={52}
            zIndexRange={[10, 0]}
          >
            <div style={label}>나주곰탕집</div>
          </Html>
          <QuestNpc
            id="npc-gomtang-lady"
            name="곰탕집 할머니"
            x={LAYOUT.gomtangLady.x}
            z={LAYOUT.gomtangLady.z}
            gives={['najueupseong-02-gomtang']}
            turnsIn={['najueupseong-02-gomtang']}
            idle="따끈한 나주곰탕 잘 먹었지? 또 놀러 오렴~"
          >
            <GomtangLadyBody />
          </QuestNpc>
          {gomtangGiven && (
            <Interactable
              targetId="puzzle-najueupseong-gomtang"
              kind="interact"
              once={false}
              x={LAYOUT.gomtangQuiz.x}
              z={LAYOUT.gomtangQuiz.z}
              label="곰탕집 문제 풀기"
              range={3}
              onFirst={() => openPuzzle('puzzle-najueupseong-gomtang')}
            >
              <mesh position={[0, 0.5, 0]} castShadow>
                <boxGeometry args={[0.07, 1, 0.07]} />
                <meshLambertMaterial color={PALETTE.trunk} flatShading />
              </mesh>
              <mesh position={[0, 0.98, 0]} castShadow>
                <boxGeometry args={[0.75, 0.46, 0.05]} />
                <meshLambertMaterial color={PALETTE.hanokWood} flatShading />
              </mesh>
            </Interactable>
          )}
        </>
      )}

      {/* 4대문 — 이름표 + (퀘스트를 받은 뒤에만) 수문장 문제 표지 */}
      {GATE_IDS.map((id) => {
        const g = LAYOUT.gates[id]
        const m = gateMarker(id)
        return (
          <group key={id}>
            <Html position={[g.x, 6.4, g.z]} center distanceFactor={58} zIndexRange={[10, 0]}>
              <div style={label}>{g.label}</div>
            </Html>
            {gatesGiven && (
              <Interactable
                targetId={`puzzle-wall-${id}`}
                kind="interact"
                once={false}
                x={m.x}
                z={m.z}
                label={`${g.name} 수문장에게 문제 받기`}
                range={3.4}
                onFirst={() => openPuzzle(`puzzle-wall-${id}`)}
              >
                <mesh position={[0, 0.6, 0]} castShadow>
                  <boxGeometry args={[0.08, 1.2, 0.08]} />
                  <meshLambertMaterial color={PALETTE.trunk} flatShading />
                </mesh>
                <mesh position={[0, 1.15, 0]} castShadow>
                  <boxGeometry args={[0.9, 0.55, 0.06]} />
                  <meshLambertMaterial color={PALETTE.hanokWood} flatShading />
                </mesh>
              </Interactable>
            )}
          </group>
        )
      })}

      {/* 나주목사 김 목사님 — 진입로 초입에서 맞아 줍니다 */}
      <QuestNpc
        id="npc-mayor"
        name="나주목사 김 목사님"
        x={LAYOUT.mayor.x}
        z={LAYOUT.mayor.z}
        gives={['najueupseong-00-geumseonggwan', 'najueupseong-01-four-gates']}
        turnsIn={['najueupseong-00-geumseonggwan', 'najueupseong-01-four-gates']}
        idle="나주읍성 4대문을 다 돌아보았는가? 남고문, 동점문, 서성문, 북망문 모두 저마다의 사연이 있다네."
      >
        <MayorBody />
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
