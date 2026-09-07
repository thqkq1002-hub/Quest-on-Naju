import { Html } from '@react-three/drei'
import { PALETTE } from '@/lib/palette'
import { Player } from '@/game/player/Player'
import { QuestNpc } from '../Npc'
import { Interactable } from '../Interactable'
import { ElderBody, FukudaBody, NajuGuideBody, ParkGiokBody, ParkJunchaeBody, StationmasterBody } from '../bodies'
import { setTerrain } from '../terrain'
import { useGameStore } from '@/store/gameStore'
import { BOUNDS, COLLIDERS, LAYOUT } from './najustation/layout'
import {
  Ginkgoes,
  GuestbookStand,
  ManseiPost,
  Memorial,
  PeriodTrain,
  Platform,
  StationBuilding,
  TimelineCard,
} from './najustation/NajuStationProps'

/**
 * 나주역 — 1929년 나주역 사건(광주학생독립운동의 발단지). 다시면·빛가람동·
 * 문평면 다음, 다섯 번째 읍·면·동입니다.
 *
 * 앞선 세 지역이 각자의 색(다시면의 아침 흙빛, 빛가람동의 한낮 유리빛,
 * 문평면의 늦가을 금빛)으로 다른 시대를 알렸다면, 여기는 **색을 뺍니다.**
 * 슬픈 역사를 다루는 자리라 화려하게 꾸미지 않습니다 — 빛바랜 흑백사진처럼
 * 채도를 낮춘 세피아·차콜 톤에, 톤 다운된 금색·붉은색만 포인트로 씁니다.
 *
 * 구조는 네 단계입니다 — ① 광장(안내) ② 대합실(1920년대 연표 퀴즈)
 * ③ 승강장(세 증인의 증언 + 편향 분석 리포트) ④ 기념관(만세·방명록).
 * 앞뒤로 이어지는 이야기라 다른 지역과 달리 퀘스트에 선행조건을 걸어
 * 순서대로만 진행되게 했습니다 — 복암리 1차 호(弧)와 같은 방식입니다.
 * → docs/06-NAJU-WORLD-MAP.md, 나주시 발간 학습자료(자료목록 7-1·8·10-1) 참고
 */
const TERRAIN = { bounds: BOUNDS, colliders: COLLIDERS, spawn: LAYOUT.spawn }
setTerrain(TERRAIN)

export function NajuStationSite({ shadows }: { shadows: boolean }) {
  setTerrain(TERRAIN)
  const openPuzzle = useGameStore((s) => s.openPuzzle)
  const active = useGameStore((s) => s.active)
  const completed = useGameStore((s) => s.completedQuests)

  const given = (id: string) => id in active || completed.includes(id)
  const waitingRoomGiven = given('najustation-02-waiting-room')
  const platformGiven = given('najustation-03-platform')
  const memorialGiven = given('najustation-04-memorial')

  // 리포트는 세 증언을 다 들어야 열립니다 — 한쪽 말만 듣고 결론부터
  // 쓰게 하지 않습니다
  const platformRun = active['najustation-03-platform']
  const testimoniesGathered =
    !!platformRun &&
    ['o1', 'o2', 'o3'].every((oid) => (platformRun.progress[oid] ?? 0) >= 1)

  return (
    <>
      {/* 흐린 날의 낮은 채도 빛 — 빛바랜 옛 사진 같은 톤입니다.
          다른 세 지역의 선명한 하늘과 뚜렷이 대비됩니다 */}
      <hemisphereLight args={['#d8d2bc', '#4a463c', 0.85]} />
      <directionalLight
        position={[40, 60, -20]}
        intensity={1.15}
        color="#e8e0c8"
        castShadow={shadows}
        shadow-mapSize={[1024, 1024]}
        shadow-camera-left={-90}
        shadow-camera-right={90}
        shadow-camera-top={90}
        shadow-camera-bottom={-90}
        shadow-camera-near={1}
        shadow-camera-far={200}
        shadow-bias={-0.0008}
      />
      <fog attach="fog" args={['#c9c2ac', 110, 400]} />
      <color attach="background" args={['#c9c2ac']} />

      {/* 지면 — 채도를 낮춘 흙빛 광장 */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[700, 700]} />
        <meshLambertMaterial color={PALETTE.stationSepia} />
      </mesh>

      <Ginkgoes />

      {/* ① 광장 */}
      <QuestNpc
        id="npc-station-guide"
        name="나주역 안내원"
        x={LAYOUT.guide.x}
        z={LAYOUT.guide.z}
        gives={['najustation-01-plaza']}
        turnsIn={['najustation-01-plaza']}
        idle="대합실로 가서 그 시절 이야기를 더 살펴보렴."
      >
        <NajuGuideBody />
      </QuestNpc>

      {/* ② 대합실 */}
      <StationBuilding />
      <QuestNpc
        id="npc-station-clerk"
        name="역무원"
        x={LAYOUT.clerk.x}
        z={LAYOUT.clerk.z}
        gives={['najustation-02-waiting-room']}
        turnsIn={['najustation-02-waiting-room']}
        idle="연표 카드 세 장을 다 풀어보렴."
      >
        <StationmasterBody />
      </QuestNpc>
      {waitingRoomGiven &&
        LAYOUT.timelineCards.map((c, i) => (
          <Interactable
            key={c.x}
            targetId={`puzzle-najustation-timeline-${i + 1}`}
            kind="interact"
            once={false}
            x={c.x}
            z={c.z}
            label={`연표 카드 ${i + 1} 문제 풀기`}
            range={2.8}
            onFirst={() => openPuzzle(`puzzle-najustation-timeline-${i + 1}`)}
          >
            <TimelineCard />
          </Interactable>
        ))}

      {/* ③ 승강장 — 1929.10.30 */}
      <Platform />
      <PeriodTrain />
      <QuestNpc
        id="npc-park-junchae"
        name="박준채"
        x={LAYOUT.parkJunchae.x}
        z={LAYOUT.parkJunchae.z}
        gives={['najustation-03-platform']}
        turnsIn={['najustation-03-platform']}
        idle={
          '그날, 후쿠다가 기옥이의 댕기머리를 잡아당기며 놀리는 걸 보고 참을 수가 없었습니다.\n' +
          '"명색이 학생이면서 어찌 여학생을 희롱하는가" 하고 따졌지요. 그게 다툼의 시작이었습니다.'
        }
        activeLine={
          '그날, 후쿠다가 기옥이 누이의 댕기머리를 잡아당기며 놀리는 걸 보고 더는 참을 수가 없었습니다.\n' +
          '"당장 사과해라! 이건 단순히 학생들의 다툼이 아니다. 불평등한 차별에 맞서는 우리 민족의 자존심이다!"\n' +
          '제가 그렇게 소리쳤지요. 저와 후쿠다, 그리고 기옥이 누이의 이야기가 서로 다를 겁니다 — 다 들어 보고 판단해 주세요.'
        }
      >
        <ParkJunchaeBody />
      </QuestNpc>
      <QuestNpc
        id="npc-park-giok"
        name="박기옥"
        x={LAYOUT.parkGiok.x}
        z={LAYOUT.parkGiok.z}
        turnsIn={['najustation-03-platform']}
        idle={
          '기차에서 내리는데 일본 학생들이 제 댕기머리를 잡아당기며 놀렸어요. 무섭고 부끄러웠습니다.\n' +
          '준채 오라버니가 나서 주지 않았다면 저는 아무 말도 못 했을 거예요.'
        }
        activeLine={
          '휴… 너무 속상하고 화가 나요. 우리가 조선인 학생이라는 이유만으로, 일본인 학생들이 매일 통학열차에서 제 댕기머리를 잡아당기며 놀려요.\n' +
          '그날도 그랬어요. 무섭고 부끄러웠는데, 준채 오라버니가 나서 주지 않았다면 저는 아무 말도 못 했을 거예요.'
        }
      >
        <ParkGiokBody />
      </QuestNpc>
      <QuestNpc
        id="npc-fukuda"
        name="후쿠다"
        x={LAYOUT.fukuda.x}
        z={LAYOUT.fukuda.z}
        turnsIn={['najustation-03-platform']}
        idle={
          '그냥 장난이었을 뿐이오. 조선인 학생이 먼저 대들었지 않소.\n' +
          '학교와 경찰도 우리 말을 먼저 들어줬으니, 잘못은 저쪽에 있는 것 아니겠소.'
        }
        activeLine={
          '뭐라고? 우리가 장난 좀 친 거 갖고 왜 이렇게 화를 내는 거야?\n' +
          '경찰도 우리 편이니까 소용없어. 조선인 학생이 먼저 대들었으니, 잘못은 저쪽에 있는 것 아니겠소.'
        }
      >
        <FukudaBody />
      </QuestNpc>
      {platformGiven && (
        <Interactable
          targetId="puzzle-najustation-report"
          kind="interact"
          once={false}
          x={LAYOUT.report.x}
          z={LAYOUT.report.z}
          label={testimoniesGathered ? '조사 기록 살펴보기' : '조사 기록 — 아직 세 사람의 이야기를 다 듣지 못했다'}
          range={3}
          onFirst={() => testimoniesGathered && openPuzzle('puzzle-najustation-report')}
        >
          <mesh position={[0, 0.55, 0]} rotation={[-0.2, 0, 0]} castShadow>
            <boxGeometry args={[0.9, 0.06, 0.6]} />
            <meshLambertMaterial color={PALETTE.stationSepia} flatShading />
          </mesh>
          <mesh position={[0, 0.5, -0.02]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 1, 6]} />
            <meshLambertMaterial color={PALETTE.trunk} flatShading />
          </mesh>
        </Interactable>
      )}

      {/* ④ 기념관 */}
      <Memorial />
      <QuestNpc
        id="npc-memorial-keeper"
        name="기념관 지킴이"
        x={LAYOUT.memorialKeeper.x}
        z={LAYOUT.memorialKeeper.z}
        gives={['najustation-04-memorial']}
        turnsIn={['najustation-04-memorial']}
        idle="11월 3일은 오늘날 학생독립운동기념일이란다. 만세비 앞에서 그날을 기려 보렴."
      >
        <ElderBody />
      </QuestNpc>
      <Interactable
        targetId="mansei-monument"
        kind="interact"
        once={false}
        x={LAYOUT.mansei.x}
        z={LAYOUT.mansei.z}
        label="만세비 앞에서 만세 외치기"
        title="만세비"
        body="만세! 조선 독립 만세!"
        range={2.6}
      >
        <ManseiPost />
      </Interactable>
      {memorialGiven && (
        <Interactable
          targetId="puzzle-najustation-guestbook"
          kind="interact"
          once={false}
          x={LAYOUT.guestbook.x}
          z={LAYOUT.guestbook.z}
          label="방명록에 메시지 남기기"
          range={2.6}
          onFirst={() => openPuzzle('puzzle-najustation-guestbook')}
        >
          <GuestbookStand />
        </Interactable>
      )}

      {/* 나주역 이름 — 광장에서도 보이도록 */}
      <Html position={[0, 11, LAYOUT.station.z + LAYOUT.station.d / 2 + 4]} center distanceFactor={62} zIndexRange={[10, 0]}>
        <div
          style={{
            whiteSpace: 'nowrap',
            color: PALETTE.stationCharcoal,
            fontSize: 22,
            fontWeight: 700,
            textShadow: '0 1px 6px rgba(255,250,235,.7)',
            pointerEvents: 'none',
          }}
        >
          옛 나주역 · 1929
        </div>
      </Html>

      <Player />
    </>
  )
}
