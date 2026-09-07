import { setInteractSink } from '@/lib/input'
import { playerPos } from '@/game/player/Player'

/**
 * 상호작용 중재.
 *
 * 예전에는 입력이 래치 하나였고, 매 프레임 먼저 도는 컴포넌트가 그걸
 * 집어갔습니다. 그래서 연구원과 그 옆 전시물처럼 **범위가 겹치면 먼저
 * 마운트된 쪽이 늘 이겼고**, 플레이어는 "눌렀는데 엉뚱한 게 열린다" 를
 * 겪었습니다.
 *
 * 지금은 누른 순간 **가장 가까운 대상**을 골라 그것만 실행합니다.
 * 프레임 순서와 무관하고, 사람이 기대하는 대로 동작합니다.
 */
export interface InteractTarget {
  x: number
  z: number
  range: number
  run: () => void
}

const targets = new Set<InteractTarget>()

export function addTarget(t: InteractTarget): () => void {
  targets.add(t)
  return () => {
    targets.delete(t)
  }
}

function fireInteract() {
  let best: InteractTarget | null = null
  let bestD = Infinity
  for (const t of targets) {
    const d = Math.hypot(playerPos.x - t.x, playerPos.z - t.z)
    if (d <= t.range && d < bestD) {
      bestD = d
      best = t
    }
  }
  best?.run()
}

setInteractSink(fireInteract)

/** 지금 가장 가까운 대상까지의 거리 — 힌트를 누가 띄울지 정할 때 씁니다 */
export function nearestTarget(): InteractTarget | null {
  let best: InteractTarget | null = null
  let bestD = Infinity
  for (const t of targets) {
    const d = Math.hypot(playerPos.x - t.x, playerPos.z - t.z)
    if (d <= t.range && d < bestD) {
      bestD = d
      best = t
    }
  }
  return best
}
