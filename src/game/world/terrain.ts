/**
 * 지형 계약.
 *
 * 맵마다 다른 것: 걸어다닐 수 있는 범위, 막힌 곳, 시작 지점, 그리고 땅의 높이.
 * 플레이어는 이 세 가지만 알면 어느 맵에서나 똑같이 움직입니다.
 * 그래서 `Player.tsx` 가 특정 맵의 layout 을 직접 import 하지 않습니다 —
 * 그렇게 두면 맵이 둘째만 돼도 조건문이 붙기 시작합니다.
 *
 * 매 프레임 읽는 값이라 zustand 가 아니라 모듈 스코프의 가변 객체입니다.
 * → docs/03-TECH-ARCHITECTURE.md 4절, docs/06-NAJU-WORLD-MAP.md 5절
 */
import type { Bounds, Box } from '@/lib/collision'

export interface Terrain {
  bounds: Bounds
  colliders: readonly Box[]
  spawn: { x: number; z: number }
  /**
   * 그 좌표의 땅 높이(m). 평지 맵은 생략합니다.
   * 복암리처럼 구릉이 있는 맵만 채웁니다 — 물리엔진 없이 언덕을 걷는 방법입니다.
   */
  heightAt?: (x: number, z: number) => number
}

const FLAT: Terrain = {
  bounds: { minX: -50, maxX: 50, minZ: -50, maxZ: 50 },
  colliders: [],
  spawn: { x: 0, z: 0 },
}

/** 지금 밟고 있는 땅. 씬이 마운트될 때 갈아 끼웁니다 */
export let activeTerrain: Terrain = FLAT

export function setTerrain(t: Terrain) {
  activeTerrain = t
}

/** 높이 함수가 없는 맵은 0 — 평지입니다 */
export function groundAt(x: number, z: number): number {
  return activeTerrain.heightAt?.(x, z) ?? 0
}
