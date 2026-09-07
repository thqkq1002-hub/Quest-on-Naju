/**
 * 이동 입력.
 *
 * 매 프레임 바뀌는 값이므로 **zustand 스토어에 넣지 않습니다.**
 * React 리렌더가 발생해 프레임이 떨어집니다. 모듈 스코프의 가변 객체를
 * 두고 useFrame 안에서 직접 읽습니다.
 * → docs/03-TECH-ARCHITECTURE.md 4절
 */
export const moveInput = {
  /** -1(좌) ~ 1(우) */
  x: 0,
  /** -1(뒤) ~ 1(앞) */
  y: 0,
  /** 조이스틱이 눌려 있는 동안 true. 키보드와 우선순위를 가릅니다 */
  fromJoystick: false,
}

/**
 * 상호작용 키.
 *
 * 누른 즉시 처리합니다. 래치에 담아 뒀다가 나중에 누가 집어가게 하면,
 * 허공에 대고 누른 입력이 남아 있다가 NPC 에게 다가가는 순간 대화가
 * 저절로 열립니다 — 실제로 그런 버그가 있었습니다.
 *
 * 무엇을 실행할지는 `game/world/interaction.ts` 가 정합니다 (가장 가까운 대상).
 * 여기서는 그쪽으로 넘기기만 합니다 — 입력이 세계를 알 필요는 없습니다.
 */
let sink: (() => void) | null = null

export function setInteractSink(fn: () => void) {
  sink = fn
}

export function requestInteract() {
  sink?.()
}

const pressed = new Set<string>()

const KEY_MAP: Record<string, [axis: 'x' | 'y', value: number]> = {
  KeyW: ['y', 1],
  ArrowUp: ['y', 1],
  KeyS: ['y', -1],
  ArrowDown: ['y', -1],
  KeyA: ['x', -1],
  ArrowLeft: ['x', -1],
  KeyD: ['x', 1],
  ArrowRight: ['x', 1],
}

function recomputeFromKeyboard() {
  if (moveInput.fromJoystick) return
  let x = 0
  let y = 0
  for (const code of pressed) {
    const mapped = KEY_MAP[code]
    if (mapped) {
      if (mapped[0] === 'x') x += mapped[1]
      else y += mapped[1]
    }
  }
  // 대각선이 빨라지지 않도록 정규화
  const len = Math.hypot(x, y)
  moveInput.x = len > 1 ? x / len : x
  moveInput.y = len > 1 ? y / len : y
}

export function attachKeyboard(): () => void {
  const onDown = (e: KeyboardEvent) => {
    if (e.code === 'Space' || e.code === 'KeyF' || e.code === 'Enter') {
      requestInteract()
      e.preventDefault()
      return
    }
    if (KEY_MAP[e.code]) {
      pressed.add(e.code)
      recomputeFromKeyboard()
      e.preventDefault()
    }
  }
  const onUp = (e: KeyboardEvent) => {
    if (pressed.delete(e.code)) recomputeFromKeyboard()
  }
  // 탭 전환 등으로 keyup을 놓치면 캐릭터가 계속 걸어갑니다
  const onBlur = () => {
    pressed.clear()
    recomputeFromKeyboard()
  }

  window.addEventListener('keydown', onDown)
  window.addEventListener('keyup', onUp)
  window.addEventListener('blur', onBlur)
  return () => {
    window.removeEventListener('keydown', onDown)
    window.removeEventListener('keyup', onUp)
    window.removeEventListener('blur', onBlur)
    pressed.clear()
  }
}

export function setJoystick(x: number, y: number) {
  moveInput.fromJoystick = true
  moveInput.x = x
  moveInput.y = y
}

export function releaseJoystick() {
  moveInput.fromJoystick = false
  moveInput.x = 0
  moveInput.y = 0
  recomputeFromKeyboard()
}
