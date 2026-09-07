/**
 * 축 정렬 박스(AABB) 충돌.
 *
 * P0에서는 Rapier를 쓰지 않습니다. 운동장은 평지이고 점프도 없어서
 * 물리 엔진이 하는 일의 대부분이 낭비입니다. WASM 번들(약 1MB)을 아끼는 쪽이
 * "모바일에서 몇 초 만에 뜨는가"라는 P0의 질문에 더 정직합니다.
 *
 * 복암리 고분군의 구릉 지형(경사·계단·고분 내부)으로 넘어갈 때
 * @react-three/rapier 의 KinematicCharacterController 로 교체합니다.
 * 그래서 의존성은 남겨뒀습니다.
 */
export interface Box {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

export function box(cx: number, cz: number, width: number, depth: number): Box {
  return {
    minX: cx - width / 2,
    maxX: cx + width / 2,
    minZ: cz - depth / 2,
    maxZ: cz + depth / 2,
  }
}

function overlaps(b: Box, x: number, z: number, r: number): boolean {
  return x + r > b.minX && x - r < b.maxX && z + r > b.minZ && z - r < b.maxZ
}

/**
 * 축을 분리해서 해결합니다. X를 먼저 시도하고, 막히면 Z만 적용 —
 * 이렇게 하면 벽에 비스듬히 부딪혔을 때 멈추지 않고 미끄러집니다.
 */
export function resolveMove(
  fromX: number,
  fromZ: number,
  dx: number,
  dz: number,
  radius: number,
  boxes: readonly Box[],
): [x: number, z: number] {
  let x = fromX
  let z = fromZ

  const tryX = x + dx
  if (!boxes.some((b) => overlaps(b, tryX, z, radius))) x = tryX

  const tryZ = z + dz
  if (!boxes.some((b) => overlaps(b, x, tryZ, radius))) z = tryZ

  return [x, z]
}

/** 맵 밖으로 나가지 않도록 가두는 경계 */
export interface Bounds {
  minX: number
  maxX: number
  minZ: number
  maxZ: number
}

export function clampToBounds(x: number, z: number, b: Bounds, pad = 0): [number, number] {
  return [
    Math.max(b.minX + pad, Math.min(b.maxX - pad, x)),
    Math.max(b.minZ + pad, Math.min(b.maxZ - pad, z)),
  ]
}
