import { Html } from '@react-three/drei'
import { PALETTE } from '@/lib/palette'
import { Player } from '@/game/player/Player'
import { QuestNpc } from '../Npc'
import { Interactable } from '../Interactable'
import { DigLeadBody, ElderBody, ExplorerBody, ResearcherBody } from '../bodies'
import { setTerrain } from '../terrain'
import { useGameStore } from '@/store/gameStore'
import { BOUNDS, COLLIDERS, LAYOUT, MOUNDS, SIGNS, heightAt } from './bokamri/layout'
import {
  BokamriGround,
  BokamriNature,
  DigCamp,
  Dock,
  GoldenShoeDigSite,
  LayerMarker,
  MoundRings,
  OnganJar,
  OnganShelter,
  SignPost,
  Trench,
} from './bokamri/BokamriProps'

/**
 * 복암리 고분군 — 첫 번째 문화유산 맵.
 *
 * 다시초가 "내 일상" 이었다면 여기는 "1500년" 입니다. 그래서 첫인상이
 * 달라야 합니다 — 다시초는 오전의 파란 하늘이었고, 여기는 해가 낮은
 * 늦은 오후입니다. 같은 로우폴리인데 빛이 다르면 다른 시간에 온 것으로 읽힙니다.
 *
 * 안내판 다섯은 장식이 아니라 전부 퍼즐의 단서입니다.
 * → docs/04-CONTENT-bokamri.md 2절
 */
const TERRAIN = { bounds: BOUNDS, colliders: COLLIDERS, spawn: LAYOUT.spawn, heightAt }
setTerrain(TERRAIN)

export function BokamriSite({ shadows }: { shadows: boolean }) {
  setTerrain(TERRAIN)
  const openPuzzle = useGameStore((s) => s.openPuzzle)
  const active = useGameStore((s) => s.active)
  const completed = useGameStore((s) => s.completedQuests)

  // '3호 트렌치로 가기'를 위치만으로 판정하면, 층위 표지처럼 트렌치에서
  // 살짝 떨어진 대상을 먼 쪽 경계에서 살펴봤을 때 반경 밖으로 새 나갈 수
  // 있습니다. 그래서 트렌치 안의 무언가와 실제로 상호작용한 순간에도
  // 같이 채웁니다 — 거리 계산이 아니라 행동 자체가 증거가 되게.
  const markTrenchReached = () => useGameStore.getState().questEvent('reach', 'trench-3')

  const digging = 'bokamri-01-first-dig' in active || completed.includes('bokamri-01-first-dig')
  const diggingShoe =
    'bokamri-03-golden-shoe' in active || completed.includes('bokamri-03-golden-shoe')

  return (
    <>
      {/* 늦은 오후의 낮은 해. 그림자가 길어야 분구의 부피가 읽힙니다 */}
      <hemisphereLight args={['#f3d9b8', '#5c6b4a', 0.95]} />
      <directionalLight
        position={[-70, 48, 40]}
        intensity={1.5}
        color="#ffe8c4"
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-80}
        shadow-camera-right={80}
        shadow-camera-top={80}
        shadow-camera-bottom={-80}
        shadow-camera-near={1}
        shadow-camera-far={200}
        shadow-bias={-0.0008}
      />
      <fog attach="fog" args={['#e8d5bb', 120, 400]} />
      <color attach="background" args={['#f0dcc0']} />

      <BokamriGround />
      <MoundRings />
      <BokamriNature />
      <Dock />
      <DigCamp />
      <OnganShelter />
      <Trench />
      <GoldenShoeDigSite />

      {/* 고분 이름표 — 한글이라 3D 텍스트 대신 DOM 오버레이 */}
      {MOUNDS.map((m) => (
        <Html
          key={m.id}
          position={[m.x, heightAt(m.x, m.z) + 1.6, m.z]}
          center
          distanceFactor={46}
          zIndexRange={[10, 0]}
        >
          <div
            style={{
              whiteSpace: 'nowrap',
              color: '#4a3b2a',
              fontSize: 22,
              fontWeight: 700,
              textShadow: '0 1px 6px rgba(255,255,255,.65)',
              pointerEvents: 'none',
            }}
          >
            {m.label}
          </div>
        </Html>
      ))}

      {/* 안내판 다섯 — 읽은 것만 퍼즐에서 쓸 수 있습니다 */}
      {SIGNS.map((s) => (
        <Interactable
          key={s.id}
          targetId={s.id}
          x={s.x}
          z={s.z}
          label={`${s.title} 읽기`}
          title={s.title}
          body={s.body}
          range={3.4}
        >
          <SignPost rotY={s.rotY} />
        </Interactable>
      ))}

      {/* 3호분 정상 — 도착하면 전경이 열립니다 */}
      <Interactable
        targetId="viewpoint-hilltop"
        kind="reach"
        x={LAYOUT.viewpoint.x}
        z={LAYOUT.viewpoint.z}
        label="언덕 위 — 고분군 전경"
        range={5}
      >
        <mesh position={[0, 0.08, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[4.4, 5, 32]} />
          <meshBasicMaterial color={PALETTE.questGold} transparent opacity={0.28} />
        </mesh>
      </Interactable>

      {/* 3호 트렌치 — 도착 목표이자 퍼즐 입구.
          트렌치 중앙에 놓고 반경을 넓게 잡습니다 — 층위 표지나 퍼즐
          안내판을 살피려면 어차피 이 안에 들어와야 하니, 어느 방향에서
          다가오든(서쪽 발굴 캠프 경유 포함) 놓치지 않습니다. */}
      <Interactable
        targetId="trench-3"
        kind="reach"
        x={LAYOUT.trench.x}
        z={LAYOUT.trench.z}
        label="3호 트렌치"
        range={7}
      />

      {/* 층위 표지 셋 — 세 개를 다 확인해야 층의 순서를 알 수 있습니다 */}
      {[-4, 0, 4].map((off, i) => (
        <Interactable
          key={off}
          targetId="layer-marker"
          x={LAYOUT.trench.x + off}
          z={LAYOUT.trench.z - LAYOUT.trench.d / 2 - 1.2}
          label={`층위 표지 ${i + 1} 확인`}
          title={`층위 표지 ${i + 1}`}
          body={
            [
              '맨 아래 짙은 층. 가장 먼저 쌓인 흙입니다.',
              '가운데 층. 위아래 사이에 놓여 있습니다.',
              '맨 위 밝은 층. 가장 나중에 쌓인 흙입니다.',
            ][i]
          }
          range={2.6}
          onFirst={markTrenchReached}
        >
          <LayerMarker index={i} />
        </Interactable>
      ))}

      {/* 층위 퍼즐 — 흙손을 받은 뒤에만 열립니다 (장비 = 열쇠) */}
      {digging && (
        <Interactable
          targetId="puzzle-stratigraphy"
          kind="interact"
          once={false}
          x={LAYOUT.trench.x}
          z={LAYOUT.trench.z + 1}
          label="흙손으로 층위 살펴보기"
          range={3.2}
          onFirst={() => {
            markTrenchReached()
            openPuzzle('puzzle-stratigraphy')
          }}
        >
          <mesh position={[0, 0.4, 0]} castShadow>
            <boxGeometry args={[0.5, 0.1, 0.14]} />
            <meshLambertMaterial color="#d8d8d8" flatShading />
          </mesh>
        </Interactable>
      )}

      {/* 옹관 둘 — 입을 맞댄 항아리. 이 유적의 훅입니다 */}
      {[-1.5, 1.5].map((off) => (
        <Interactable
          key={off}
          targetId="ongan-exhibit"
          x={LAYOUT.onganShelter.x + off}
          z={LAYOUT.onganShelter.z + 2.6}
          label="옹관 살펴보기"
          title="옹관(甕棺)"
          body={
            off < 0
              ? '항아리 하나의 길이가 어른 키만 합니다. 이 안에 사람을 눕혔습니다.'
              : '두 항아리의 입을 맞대어 놓았습니다. 관 하나를 만들려고 항아리 둘을 쓴 것입니다.'
          }
          range={2.8}
        >
          <group position={[0, 0.36 + 0.8, -2.6]}>
            <OnganJar flip={off > 0} />
          </group>
        </Interactable>
      ))}

      {/* 96호 돌방무덤 발굴 — 박사님에게 퀘스트를 받은 뒤에만 열립니다 */}
      {diggingShoe && (
        <Interactable
          targetId="puzzle-golden-shoe-dig"
          kind="interact"
          once={false}
          x={LAYOUT.goldenShoeDig.x}
          z={LAYOUT.goldenShoeDig.z}
          label="붓으로 96호 발굴지 흙 털어내기"
          range={3.4}
          onFirst={() => openPuzzle('puzzle-golden-shoe-dig')}
        />
      )}

      {/* NPC 넷 */}
      <QuestNpc
        id="npc-village-elder"
        name="마을 어르신"
        x={LAYOUT.elder.x}
        z={LAYOUT.elder.z}
        gives={['bokamri-00-arrival']}
        idle="나는 여기서 나고 자랐네. 저 언덕은 어릴 적부터 그냥 언덕인 줄 알았지."
      >
        <ElderBody />
      </QuestNpc>

      <QuestNpc
        id="npc-excavation-lead"
        name="발굴단장"
        x={LAYOUT.digLead.x}
        z={LAYOUT.digLead.z}
        gives={['bokamri-01-first-dig']}
        turnsIn={['bokamri-00-arrival', 'bokamri-01-first-dig']}
        idle="함부로 파면 안 되네. 층을 읽을 줄 알아야 해."
      >
        <DigLeadBody />
      </QuestNpc>

      <QuestNpc
        id="npc-researcher"
        name="연구원"
        x={LAYOUT.researcher.x}
        z={LAYOUT.researcher.z}
        gives={['bokamri-02-jar-coffin']}
        turnsIn={['bokamri-02-jar-coffin']}
        idle="기록이 없으면 발굴은 파괴랑 다를 게 없어요. 그래서 이렇게 다 적습니다."
      >
        <ResearcherBody />
      </QuestNpc>

      <QuestNpc
        id="npc-explorer"
        name="탐험가 박사님"
        x={LAYOUT.explorer.x}
        z={LAYOUT.explorer.z}
        gives={['bokamri-03-golden-shoe']}
        turnsIn={['bokamri-03-golden-shoe']}
        idle="이 아래 96호 돌방무덤에서 정말 놀라운 게 나왔단다. 궁금하지 않니?"
      >
        <ExplorerBody />
      </QuestNpc>

      <Player />
    </>
  )
}
