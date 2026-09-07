import { useFrame, useThree } from '@react-three/fiber'
import { useRef, useState } from 'react'
import { Group, MathUtils, Vector3 } from 'three'
import { PALETTE } from '@/lib/palette'
import { clampToBounds, resolveMove } from '@/lib/collision'
import { moveInput } from '@/lib/input'
import { activeTerrain, groundAt } from '@/game/world/terrain'
import { ROTATE_SPEED, cameraState, currentRig, rotateHold } from './camera'

const SPEED = 18.144 // 12.96 대비 1.4배 (원래 7.2 대비 2.52배)
const RADIUS = 0.45

/**
 * 다른 시스템이 매 프레임 읽는 플레이어 위치. 스토어에 넣지 않습니다.
 * y 는 발이 닿은 땅의 높이입니다 — 복암리 구릉에서 NPC 와 거리를 잴 때 씁니다.
 */
export const playerPos = new Vector3(0, 0, 0)

// 자동 플레이 테스트가 캐릭터 위치를 읽는 창구입니다. 읽기 전용이고,
// 게임 로직은 이 값을 쓰지 않습니다 — 지우면 테스트만 눈이 멉니다.
declare global {
  interface Window {
    __najuPlayer?: Vector3
  }
}
if (typeof window !== 'undefined') window.__najuPlayer = playerPos

const camTarget = new Vector3()

/**
 * 플레이어 — 다시초등학교 학생.
 *
 * P0에서는 glTF를 쓰지 않고 박스로 조립합니다. 걷기 애니메이션도
 * sin 함수로 팔다리를 흔드는 절차적 방식입니다. 로우폴리 스타일에서는
 * 이 정도로도 충분히 읽히고, "모바일에서 몇 초 만에 뜨는가"를 재는
 * P0에 모델 파일을 끼워 넣으면 측정값이 오염됩니다.
 *
 * 복장은 Lv.1 「다시초 탐험대」 — 낡은 체육복. 레벨이 오르면 슬롯별로
 * 메시를 교체합니다. → docs/02-GAME-DESIGN.md 4.3
 */
export function Player() {
  const root = useRef<Group>(null)
  // 맵이 바뀌면 그 맵의 spawn 에서 다시 시작합니다. 씬이 마운트될 때
  // setTerrain 이 이미 불려 있으므로 여기서 읽으면 늘 현재 맵의 값입니다.
  useState(() => {
    playerPos.set(activeTerrain.spawn.x, groundAt(activeTerrain.spawn.x, activeTerrain.spawn.z), activeTerrain.spawn.z)
    return null
  })
  const rig = useRef<Group>(null)
  const legL = useRef<Group>(null)
  const legR = useRef<Group>(null)
  const armL = useRef<Group>(null)
  const armR = useRef<Group>(null)

  const camera = useThree((s) => s.camera)
  const walkPhase = useRef(0)
  const facing = useRef(Math.PI) // 처음엔 북쪽(본관)을 바라봅니다

  useFrame((_, rawDelta) => {
    // 탭 전환 후 복귀 시 delta가 튀어 캐릭터가 순간이동하는 것을 막습니다
    const delta = Math.min(rawDelta, 0.05)
    if (!root.current) return

    // 카메라 회전 — 버튼을 누르고 있는 동안 계속 돕니다
    if (rotateHold.dir !== 0) cameraState.yaw += rotateHold.dir * ROTATE_SPEED * delta
    // 탑뷰 전환을 부드럽게
    cameraState.top = MathUtils.damp(cameraState.top, cameraState.topTarget, 4.5, delta)

    const yaw = cameraState.yaw
    const cam = currentRig()

    // 카메라가 도는 이상 입력도 카메라 기준이어야 합니다.
    // 조이스틱 위 = 화면 안쪽(카메라 반대편), 오른쪽 = 화면 오른쪽.
    const fwdX = -Math.sin(yaw)
    const fwdZ = -Math.cos(yaw)
    const rgtX = Math.cos(yaw)
    const rgtZ = -Math.sin(yaw)

    const ix = moveInput.x * rgtX + moveInput.y * fwdX
    const iz = moveInput.x * rgtZ + moveInput.y * fwdZ
    const mag = Math.min(1, Math.hypot(ix, iz))

    if (mag > 0.01) {
      const dx = (ix / (mag || 1)) * mag * SPEED * delta
      const dz = (iz / (mag || 1)) * mag * SPEED * delta

      const [nx, nz] = resolveMove(
        playerPos.x, playerPos.z, dx, dz, RADIUS, activeTerrain.colliders,
      )
      const [cx, cz] = clampToBounds(nx, nz, activeTerrain.bounds, 2)
      playerPos.x = cx
      playerPos.z = cz

      facing.current = Math.atan2(ix, iz)
      walkPhase.current += delta * (6 + mag * 5)
    } else {
      // 멈추면 팔다리를 부드럽게 원위치로
      walkPhase.current = MathUtils.lerp(walkPhase.current % (Math.PI * 2), 0, 0.2)
    }

    // 언덕을 오르내립니다. 높이를 바로 대입하면 계단처럼 튀므로 살짝 따라갑니다.
    playerPos.y = MathUtils.damp(playerPos.y, groundAt(playerPos.x, playerPos.z), 14, delta)

    root.current.position.set(playerPos.x, playerPos.y, playerPos.z)
    root.current.rotation.y = dampAngle(root.current.rotation.y, facing.current, 0.22)

    // 걷기 — 팔다리 반대 위상
    const swing = Math.sin(walkPhase.current) * (mag > 0.01 ? 0.75 : 0)
    if (legL.current) legL.current.rotation.x = swing
    if (legR.current) legR.current.rotation.x = -swing
    if (armL.current) armL.current.rotation.x = -swing * 0.8
    if (armR.current) armR.current.rotation.x = swing * 0.8
    // 걸을 때 몸이 살짝 위아래로
    if (rig.current) rig.current.position.y = Math.abs(Math.sin(walkPhase.current)) * 0.07 * mag

    // 카메라 추적 — 즉시 붙지 않고 따라옵니다
    const dirX = Math.sin(yaw)
    const dirZ = Math.cos(yaw)
    camTarget.set(
      playerPos.x + dirX * cam.dist,
      playerPos.y + cam.height,
      playerPos.z + dirZ * cam.dist,
    )
    camera.position.lerp(camTarget, 1 - Math.pow(0.0015, delta))
    camera.lookAt(
      playerPos.x - dirX * cam.lookAhead,
      playerPos.y + cam.lookHeight,
      playerPos.z - dirZ * cam.lookAhead,
    )
  })

  return (
    <group ref={root} position={[playerPos.x, playerPos.y, playerPos.z]} rotation={[0, Math.PI, 0]}>
      <group ref={rig}>
        {/* 다리 — 축을 엉덩이에 두려고 그룹 안에서 메시를 아래로 내립니다 */}
        <group ref={legL} position={[-0.16, 0.72, 0]}>
          <mesh position={[0, -0.36, 0]} castShadow>
            <boxGeometry args={[0.22, 0.72, 0.22]} />
            <meshLambertMaterial color={PALETTE.gymPants} flatShading />
          </mesh>
          <mesh position={[0, -0.76, 0.05]} castShadow>
            <boxGeometry args={[0.24, 0.14, 0.34]} />
            <meshLambertMaterial color={PALETTE.shoe} flatShading />
          </mesh>
        </group>
        <group ref={legR} position={[0.16, 0.72, 0]}>
          <mesh position={[0, -0.36, 0]} castShadow>
            <boxGeometry args={[0.22, 0.72, 0.22]} />
            <meshLambertMaterial color={PALETTE.gymPants} flatShading />
          </mesh>
          <mesh position={[0, -0.76, 0.05]} castShadow>
            <boxGeometry args={[0.24, 0.14, 0.34]} />
            <meshLambertMaterial color={PALETTE.shoe} flatShading />
          </mesh>
        </group>

        {/* 몸통 — 낡은 체육복 상의 */}
        <mesh position={[0, 1.06, 0]} castShadow>
          <boxGeometry args={[0.54, 0.68, 0.32]} />
          <meshLambertMaterial color={PALETTE.gymTop} flatShading />
        </mesh>
        {/* 체육복 가슴 줄무늬 */}
        <mesh position={[0, 1.0, 0.17]}>
          <boxGeometry args={[0.54, 0.1, 0.02]} />
          <meshLambertMaterial color={PALETTE.gymPants} flatShading />
        </mesh>

        {/* 팔 */}
        <group ref={armL} position={[-0.34, 1.32, 0]}>
          <mesh position={[0, -0.28, 0]} castShadow>
            <boxGeometry args={[0.16, 0.56, 0.16]} />
            <meshLambertMaterial color={PALETTE.gymTop} flatShading />
          </mesh>
          <mesh position={[0, -0.62, 0]} castShadow>
            <boxGeometry args={[0.15, 0.16, 0.15]} />
            <meshLambertMaterial color={PALETTE.skin} flatShading />
          </mesh>
        </group>
        <group ref={armR} position={[0.34, 1.32, 0]}>
          <mesh position={[0, -0.28, 0]} castShadow>
            <boxGeometry args={[0.16, 0.56, 0.16]} />
            <meshLambertMaterial color={PALETTE.gymTop} flatShading />
          </mesh>
          <mesh position={[0, -0.62, 0]} castShadow>
            <boxGeometry args={[0.15, 0.16, 0.15]} />
            <meshLambertMaterial color={PALETTE.skin} flatShading />
          </mesh>
        </group>

        {/* 머리 */}
        <mesh position={[0, 1.62, 0]} castShadow>
          <boxGeometry args={[0.4, 0.4, 0.38]} />
          <meshLambertMaterial color={PALETTE.skin} flatShading />
        </mesh>
        {/* 머리카락 */}
        <mesh position={[0, 1.8, -0.02]} castShadow>
          <boxGeometry args={[0.44, 0.16, 0.42]} />
          <meshLambertMaterial color={PALETTE.hair} flatShading />
        </mesh>
        <mesh position={[0, 1.66, -0.2]} castShadow>
          <boxGeometry args={[0.42, 0.3, 0.06]} />
          <meshLambertMaterial color={PALETTE.hair} flatShading />
        </mesh>
        {/* 눈 — 두 점만 찍어도 방향이 읽힙니다 */}
        {[-0.1, 0.1].map((x) => (
          <mesh key={x} position={[x, 1.62, 0.2]}>
            <boxGeometry args={[0.06, 0.08, 0.02]} />
            <meshBasicMaterial color="#2b2320" />
          </mesh>
        ))}

        {/* 책가방 — 「back」 슬롯의 첫 아이템 */}
        <mesh position={[0, 1.1, -0.26]} castShadow>
          <boxGeometry args={[0.42, 0.5, 0.2]} />
          <meshLambertMaterial color={PALETTE.backpack} flatShading />
        </mesh>
      </group>
    </group>
  )
}

/** 최단 회전 방향으로 각도를 보간합니다 (−π/π 경계를 넘어갈 때 튀지 않게) */
function dampAngle(current: number, target: number, t: number): number {
  let diff = target - current
  while (diff > Math.PI) diff -= Math.PI * 2
  while (diff < -Math.PI) diff += Math.PI * 2
  return current + diff * t
}
