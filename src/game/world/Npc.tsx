import { useFrame } from '@react-three/fiber'
import { useEffect, useRef, useState, type ReactNode } from 'react'
import type { Group } from 'three'
import { QuestMarker, type MarkerKind } from '@/game/quest/QuestMarker'
import { playerPos } from '@/game/player/Player'
import { addTarget } from '@/game/world/interaction'
import { groundAt } from '@/game/world/terrain'
import { questById } from '@/game/quest/data'
import { useGameStore, questPhase } from '@/store/gameStore'
import { PALETTE } from '@/lib/palette'

const INTERACT_RANGE = 4.2

/**
 * 퀘스트를 주고받는 NPC.
 *
 * 이 컴포넌트는 특정 인물을 모릅니다 — 맡은 퀘스트 id 목록과 생김새를
 * 받아서, 상태에 맞는 `!` / `?` 를 띄우고 알맞은 대사를 꺼냅니다.
 * 대사도 퀘스트 JSON 에서 옵니다. 새 NPC 를 만들 때 이 파일은 안 고칩니다.
 * → docs/02-GAME-DESIGN.md 2.1 / 2.3
 */
export function QuestNpc({
  id,
  name,
  x,
  z,
  /** 이 NPC 가 주는 퀘스트 (앞에서부터 조건이 맞는 것 하나를 씁니다) */
  gives = [],
  /** 이 NPC 에게 완료 보고하는 퀘스트 */
  turnsIn = [],
  /** 퀘스트와 무관한 평상시 대사 */
  idle = '오늘 날씨가 참 좋구나.',
  /**
   * 퀘스트가 진행 중일 때 할 대사. 비워 두면 퀘스트 JSON의
   * `dialogue.progress`를 씁니다 — 증인이 한 명뿐인 보통의 경우엔
   * 그걸로 충분합니다. 하지만 나주역 승강장처럼 **증인이 여럿**이라
   * 각자 다른 이야기를 해야 할 때는, 셋이 똑같은 진행 대사를 반복하면
   * "할 얘기가 없다"는 느낌만 남습니다 — 이럴 때 이 NPC만의 증언을
   * 채워 넣습니다.
   */
  activeLine,
  /** 평상시 대사(idle)가 끝났을 때 실행할 동작 — 퀘스트가 아닌 일회성 연출용 탈출구입니다 */
  onIdleDialogueEnd,
  /** 자동 계산 대신 강제로 띄울 머리 위 표시 — 퀘스트가 없는 NPC에도 눈에 띄는 신호를 줄 때 씁니다 */
  forceMarker,
  children,
}: {
  id: string
  name: string
  x: number
  z: number
  gives?: string[]
  turnsIn?: string[]
  idle?: string
  activeLine?: string
  onIdleDialogueEnd?: () => void
  forceMarker?: MarkerKind
  children: ReactNode
}) {
  const root = useRef<Group>(null)
  const [inRange, setInRange] = useState(false)

  const y = groundAt(x, z)

  useFrame(({ clock }) => {
    if (!root.current) return

    // 항상 플레이어를 바라봅니다 — 살아 있다는 느낌은 여기서 대부분 나옵니다
    const dx = playerPos.x - x
    const dz = playerPos.z - z
    root.current.rotation.y = Math.atan2(dx, dz)
    root.current.position.y = y + Math.sin(clock.elapsedTime * 1.4) * 0.03

    const near = Math.hypot(dx, dz) < INTERACT_RANGE
    if (near !== inRange) {
      setInRange(near)
      useGameStore.getState().setHint(near ? `${name}과(와) 이야기하기` : '')
    }
  })

  // 상호작용 후보로 등록합니다. 누가 실행될지는 거리로 정해집니다.
  const talkRef = useRef<() => void>(() => {})
  talkRef.current = () => talk()
  useEffect(
    () => addTarget({ x, z, range: INTERACT_RANGE, run: () => talkRef.current() }),
    [x, z],
  )

  /** 대사 한 덩어리를 줄 단위로 쪼갭니다 — 긴 이야기는 JSON 에서 줄바꿈으로 씁니다 */
  const say = (text: string) => text.split('\n').map((t) => ({ speaker: name, text: t }))

  function talk() {
    const s = useGameStore.getState()

    // 1) 보고할 게 있으면 그것부터. 다 채우고 온 사람을 기다리게 하지 않습니다.
    const ready = turnsIn.find((q) => questPhase(s, q) === 'ready')
    if (ready) {
      const quest = questById(ready)
      s.showDialogue(say(quest.dialogue.complete), () => {
        useGameStore.getState().turnInQuest(ready)
      })
      return
    }

    // 2) 진행 중이면 진행 대사를 합니다.
    //    이 대사가 곧 그 퀘스트의 해설이라, 「NPC 의 설명 듣기」 류 목표는
    //    여기서 채워집니다 (target 규칙: `<npc id>-explain`).
    const running = turnsIn.find((q) => questPhase(s, q) === 'active')
    if (running) {
      s.showDialogue(say(activeLine ?? questById(running).dialogue.progress), () => {
        useGameStore.getState().questEvent('dialogue', `${id}-explain`)
      })
      return
    }

    // 3) 줄 수 있는 새 퀘스트.
    const offer = gives.find((q) => questPhase(s, q) === 'available')
    if (offer) {
      const quest = questById(offer)
      s.showDialogue(say(quest.dialogue.offer), () => {
        const st = useGameStore.getState()
        st.acceptQuest(offer)
        // 대화만으로 끝나는 목표는 여기서 채웁니다
        st.questEvent('dialogue', `${id}-intro`)
      })
      return
    }

    s.showDialogue(say(idle), onIdleDialogueEnd)
  }

  // 머리 위 표시 — 보고할 게 있으면 `?`, 새 퀘스트가 있으면 `!`
  const level = useGameStore((st) => st.level)
  const active = useGameStore((st) => st.active)
  const completed = useGameStore((st) => st.completedQuests)
  const view = { level, active, completedQuests: completed }

  const readyHere = turnsIn.some((q) => questPhase(view, q) === 'ready')
  const offerHere = gives.some((q) => questPhase(view, q) === 'available')
  const lockedHere = gives.some((q) => questPhase(view, q) === 'locked')

  return (
    <group ref={root} position={[x, y, z]}>
      {children}

      {forceMarker ? (
        <QuestMarker y={2.9} kind={forceMarker} />
      ) : (
        <>
          {readyHere && <QuestMarker y={2.9} kind="turnIn" />}
          {!readyHere && offerHere && <QuestMarker y={2.9} kind="offer" />}
          {!readyHere && !offerHere && lockedHere && <QuestMarker y={2.9} kind="locked" />}
        </>
      )}

      {/* 상호작용 범위 표시 — 가까이 갔을 때만 */}
      {inRange && (
        <mesh position={[0, 0.06, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[INTERACT_RANGE - 0.15, INTERACT_RANGE, 32]} />
          <meshBasicMaterial color={PALETTE.questGold} transparent opacity={0.5} />
        </mesh>
      )}
    </group>
  )
}
