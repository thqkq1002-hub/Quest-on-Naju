/**
 * 카메라 상태.
 *
 * 매 프레임 바뀌는 값이라 zustand에 넣지 않습니다 — 리렌더가 프레임을
 * 깎습니다. 모듈 스코프의 가변 객체를 두고 useFrame 안에서 직접 읽습니다.
 * → docs/03-TECH-ARCHITECTURE.md 4절
 *
 * 탑뷰 여부만 UI 버튼이 눌린 상태를 표시해야 해서 스토어에도 복제해 둡니다.
 */
export const cameraState = {
  /** 플레이어를 중심으로 한 카메라 방위(라디안). 0 = 남쪽에서 북쪽을 봄 */
  yaw: 0,
  /** 탑뷰 목표값 (0 = 어깨너머, 1 = 위에서 내려다봄) */
  topTarget: 0,
  /** 실제 적용값. topTarget으로 부드럽게 따라갑니다 */
  top: 0,
}

/** 어깨너머 시점 */
const SHOULDER = { dist: 24, height: 11.5, lookAhead: 6, lookHeight: 2.5 }
/**
 * 탑뷰 — 학교 배치가 한눈에 들어와야 의미가 있습니다.
 * 62m로 잡았다가 잔디밭 일부만 보여서 올렸습니다. fov 52° 기준으로
 * 105m 높이면 가로 약 175m가 들어오고, 교정 폭이 대략 그만합니다.
 */
const TOP = { dist: 8, height: 105, lookAhead: 0, lookHeight: 0 }

export interface CameraRig {
  dist: number
  height: number
  lookAhead: number
  lookHeight: number
}

/** 두 시점 사이를 부드럽게 잇습니다 */
export function currentRig(): CameraRig {
  // 시작과 끝에서 느려지도록 — 선형으로 옮기면 뚝 끊겨 보입니다
  const t = cameraState.top
  const e = t * t * (3 - 2 * t)
  return {
    dist: SHOULDER.dist + (TOP.dist - SHOULDER.dist) * e,
    height: SHOULDER.height + (TOP.height - SHOULDER.height) * e,
    lookAhead: SHOULDER.lookAhead + (TOP.lookAhead - SHOULDER.lookAhead) * e,
    lookHeight: SHOULDER.lookHeight + (TOP.lookHeight - SHOULDER.lookHeight) * e,
  }
}

export function rotateCamera(deltaRadians: number) {
  cameraState.yaw += deltaRadians
}

export function toggleTopView(): boolean {
  cameraState.topTarget = cameraState.topTarget > 0.5 ? 0 : 1
  return cameraState.topTarget > 0.5
}

export function resetCamera() {
  cameraState.yaw = 0
  cameraState.topTarget = 0
}

/** 카메라 회전 버튼을 누르고 있는 동안의 방향. -1 좌 / 0 / 1 우 */
export const rotateHold = { dir: 0 }

/** 초당 회전 속도(라디안) */
export const ROTATE_SPEED = 1.5
