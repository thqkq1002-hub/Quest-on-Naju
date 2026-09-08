import { Html } from '@react-three/drei'
import { PALETTE } from '@/lib/palette'
import { Player } from '@/game/player/Player'
import { QuestNpc } from '../Npc'
import { Interactable } from '../Interactable'
import { CaptainBody, HongiBody } from '../bodies'
import { SignPost } from './bokamri/BokamriProps'
import { setTerrain } from '../terrain'
import { useGameStore } from '@/store/gameStore'
import { BOUNDS, COLLIDERS, LAYOUT } from './yeongsanpo/layout'
import {
  HistoryGallery,
  HongeoStreet,
  HwangpoBoat,
  LiteratureHall,
  River,
  StreetTrees,
  Wharf,
} from './yeongsanpo/YeongsanpoProps'

/**
 * 영산포 — 근대문화유산 거리 + 홍어거리.
 *
 * 다시면(오늘의 학교), 복암리(고대 고분), 문평면(조선시대), 나주역(1929년
 * 근대사)에 이어 다섯 번째 거점입니다. 나주역이 "그날의 사건"이라면
 * 여기는 "그 시절 사람들이 살고 먹던 거리"입니다 — 그래서 나주역의 가라앉은
 * 세피아 대신, 영산강의 푸른 물빛과 홍어거리의 활기찬 원색을 씁니다.
 *
 * 구조는 문평면과 같습니다: 안내판(SignPost)에서 정보를 읽고, 퀘스트를
 * 받은 뒤에만 나타나는 문제 안내판에서 QuizPuzzle을 풉니다. 홍어거리만
 * 예외로, 전용 미니게임(HongeoComboGame)을 씁니다.
 */
const TERRAIN = { bounds: BOUNDS, colliders: COLLIDERS, spawn: LAYOUT.spawn }
setTerrain(TERRAIN)

export function YeongsanpoSite({ shadows }: { shadows: boolean }) {
  setTerrain(TERRAIN)
  const openPuzzle = useGameStore((s) => s.openPuzzle)
  const active = useGameStore((s) => s.active)
  const completed = useGameStore((s) => s.completedQuests)

  const given = (id: string) => id in active || completed.includes(id)
  const heritageGiven = given('yeongsanpo-01-heritage')
  const hongeoGiven = given('yeongsanpo-02-hongeo')

  return (
    <>
      {/* 흐린 오후 강가 — 다습하고 차분한 빛. 근대 거리의 회색·벽돌색이
          너무 화사하지 않게, 그러면서도 홍어거리 차양의 원색은 살아나게 */}
      <hemisphereLight args={['#cfe0e8', '#4a5850', 1.0]} />
      <directionalLight
        position={[40, 55, 50]}
        intensity={1.4}
        color="#eef2f0"
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
      <fog attach="fog" args={['#d8e4e6', 130, 420]} />
      <color attach="background" args={['#dde8e8']} />

      {/* 지면 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[900, 900]} />
        <meshLambertMaterial color={PALETTE.asphalt} flatShading />
      </mesh>
      {/* 거리 — 가운데 넓은 포장길 */}
      <mesh position={[0, 0.01, -8]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[130, 40]} />
        <meshLambertMaterial color={PALETTE.path} flatShading />
      </mesh>

      <River />
      <Wharf />
      <HwangpoBoat />
      <StreetTrees />

      {/* [구역 1] 영산포 역사갤러리 */}
      <HistoryGallery />
      <Html
        position={[LAYOUT.gallery.x, LAYOUT.gallery.h + 1.6, LAYOUT.gallery.z]}
        center
        distanceFactor={56}
        zIndexRange={[10, 0]}
      >
        <div style={label}>영산포 역사갤러리</div>
      </Html>
      <Interactable
        targetId="info-yeongsanpo-gallery"
        x={LAYOUT.galleryInfo.x}
        z={LAYOUT.galleryInfo.z}
        label="역사갤러리 안내판 읽기"
        title="영산포 역사갤러리 (구 조선식산은행 건물)"
        body="일제강점기 조선식산은행 건물로 쓰였던 곳을 나주시가 매입해 새단장했습니다. 영산포 등대·오일장·우시장 등 옛 모습을 담은 흑백사진과 전통 음식·문화 모형을 전시합니다."
        range={3}
      >
        <SignPost rotY={Math.PI / 2} />
      </Interactable>
      {heritageGiven && (
        <Interactable
          targetId="puzzle-yeongsanpo-gallery"
          kind="interact"
          once={false}
          x={LAYOUT.galleryQuiz.x}
          z={LAYOUT.galleryQuiz.z}
          label="역사갤러리 문제 풀기"
          range={3}
          onFirst={() => openPuzzle('puzzle-yeongsanpo-gallery')}
        >
          <SignPost rotY={Math.PI / 2} />
        </Interactable>
      )}

      {/* [구역 2] 타오르는 강 문학관 */}
      <LiteratureHall />
      <Html
        position={[LAYOUT.literature.x, LAYOUT.literature.h + 1.8, LAYOUT.literature.z]}
        center
        distanceFactor={56}
        zIndexRange={[10, 0]}
      >
        <div style={label}>타오르는 강 문학관</div>
      </Html>
      <Interactable
        targetId="info-yeongsanpo-literature"
        x={LAYOUT.literatureInfo.x}
        z={LAYOUT.literatureInfo.z}
        label="문학관 안내판 읽기"
        title="타오르는 강 문학관"
        body="소설가 문순태의 「타오르는 강」과 영산강 수운(水運)의 역사를 함께 소개하는 문학관입니다."
        range={3}
      >
        <SignPost rotY={-Math.PI / 2} />
      </Interactable>
      {heritageGiven && (
        <Interactable
          targetId="puzzle-yeongsanpo-literature"
          kind="interact"
          once={false}
          x={LAYOUT.literatureQuiz.x}
          z={LAYOUT.literatureQuiz.z}
          label="문학관 문제 풀기"
          range={3}
          onFirst={() => openPuzzle('puzzle-yeongsanpo-literature')}
        >
          <SignPost rotY={-Math.PI / 2} />
        </Interactable>
      )}

      {/* [구역 3] 영산포 홍어거리 */}
      <HongeoStreet />
      <Html position={[38, 4.6, -20]} center distanceFactor={56} zIndexRange={[10, 0]}>
        <div style={label}>영산포 홍어거리</div>
      </Html>

      {/* 홍어거리 마스코트 "홍이" — 퀘스트와 무관하게 언제든 유래 이야기를 들려줍니다 */}
      <QuestNpc
        id="npc-hongi"
        name="홍이"
        x={LAYOUT.hongiMascot.x}
        z={LAYOUT.hongiMascot.z}
        idle={
          '안녕! 나는 영산포의 마스코트, 홍어 요정 홍이야~ 코가 뻥 뚫릴 준비됐니?\n' +
          "혹시 톡 쏘는 홍어 냄새를 맡고 '으악, 이게 무슨 냄새야!' 하고 놀란 적 있어? 그 뒤엔 아주 지혜롭고 흥미진진한 옛날이야기가 숨어 있단다!\n" +
          '옛날 고려 시대, 저 바다 멀리 흑산도라는 섬에 살던 사람들이 자꾸 쳐들어오는 왜구를 피해 배를 타고 영산강을 거슬러 영산포까지 이사를 왔어.\n' +
          '흑산도에서 영산포까지는 뱃길로 꼬박 열흘이 넘게 걸리는 아주 먼 길이었지. 냉장고도 아이스박스도 없던 시절이라, 배에 실은 생선들은 오는 동안 다 상해버렸단다.\n' +
          '그런데 신기하게도, 다른 생선은 다 썩었는데 배 밑바닥에 놓아둔 홍어만은 썩지 않고 알싸하게 삭아 있었던 거야!\n' +
          "배고팠던 사람들이 '에라 모르겠다!' 하고 먹어봤는데... 배도 안 아프고 코만 뻥 뚫리면서 어찌나 맛있던지!\n" +
          "홍어는 몸속에 세균이 자라지 못하게 막아주는 특별한 성분이 있어서, 썩는 대신 맛있게 '숙성(삭힘)'되었던 거란다.\n" +
          "그때부터 영산포 사람들은 흑산도 홍어를 이곳의 바람과 정성으로 삭혀 먹기 시작했고, 지금은 대한민국에서 제일 유명한 '영산포 숙성 홍어'가 되었지!\n" +
          '알싸하고 맛있는 우리 영산포 홍어 이야기, 신기하지?'
        }
      >
        <HongiBody />
      </QuestNpc>

      {hongeoGiven && (
        <Interactable
          targetId="puzzle-hongeo-combo"
          kind="interact"
          once={false}
          x={LAYOUT.hongeoTrigger.x}
          z={LAYOUT.hongeoTrigger.z}
          label="홍어삼합 만들기"
          range={3.4}
          onFirst={() => openPuzzle('puzzle-hongeo-combo')}
        >
          <mesh position={[0, 0.5, 0]} castShadow>
            <boxGeometry args={[1.2, 0.9, 0.7]} />
            <meshLambertMaterial color={PALETTE.trunk} flatShading />
          </mesh>
        </Interactable>
      )}

      {/* 영산강 선장 할아버지 — 진입로 초입에서 맞아 줍니다 */}
      <QuestNpc
        id="npc-captain"
        name="영산강 선장 할아버지"
        x={LAYOUT.captain.x}
        z={LAYOUT.captain.z}
        gives={['yeongsanpo-01-heritage', 'yeongsanpo-02-hongeo']}
        turnsIn={['yeongsanpo-01-heritage', 'yeongsanpo-02-hongeo']}
        idle="영산포는 예로부터 배가 드나들던 나루였지. 근대 거리도, 홍어거리도 다 그 뱃길에서 태어났단다."
      >
        <CaptainBody />
      </QuestNpc>

      <Player />
    </>
  )
}

const label: React.CSSProperties = {
  whiteSpace: 'nowrap',
  color: '#243038',
  fontSize: 22,
  fontWeight: 700,
  textShadow: '0 1px 6px rgba(255,255,255,.75)',
  pointerEvents: 'none',
}
