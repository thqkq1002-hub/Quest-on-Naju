/**
 * 아주 작은 Web Audio 신디사이저 — 오르골/피아노에 가까운 음색으로
 * 음 하나씩을 짧게 튕겨 냅니다.
 *
 * 외부 오디오 파일이나 라이브러리 없이, 오실레이터 두 개(기본음 + 옅은
 * 배음)를 겹쳐 종처럼 감쇠시키는 방식으로 "오르골 톤"을 흉내 냅니다.
 * 게임 전체에서 탐험 테마(EXPLORE_MELODY)가 기본으로 돌고, 드들강에서만
 * <엄마야 누나야>로 바뀝니다 — src/ui/Bgm.tsx 참고.
 */
import { EXPLORE_MELODY, NOTE_FREQ, type MelodyNote } from './melody'

let ctx: AudioContext | null = null
let masterGain: GainNode | null = null
let muted = false

function getCtx(): AudioContext {
  if (!ctx) {
    const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    ctx = new Ctor()
  }
  return ctx
}

function getMasterGain(): GainNode {
  const c = getCtx()
  if (!masterGain) {
    masterGain = c.createGain()
    masterGain.gain.value = muted ? 0 : 0.45
    masterGain.connect(c.destination)
  }
  return masterGain
}

/** 브라우저 자동재생 정책 — 사용자 제스처(버튼 클릭 등) 안에서 불러야 풀립니다 */
export function unlockAudio() {
  const c = getCtx()
  if (c.state === 'suspended') void c.resume()
  getMasterGain()
}

export function isMuted() {
  return muted
}

export function setMuted(next: boolean) {
  muted = next
  if (masterGain) masterGain.gain.setTargetAtTime(muted ? 0 : 0.45, getCtx().currentTime, 0.05)
}

/** 음 하나 — 사인파 기본음 + 옅은 배음, 짧은 어택·지수 감쇠로 오르골처럼 튕깁니다 */
export function playNote(note: string, whenSec = 0, duration = 0.4) {
  const freq = NOTE_FREQ[note]
  if (!freq) return
  const c = getCtx()
  const gain = getMasterGain()
  const t0 = c.currentTime + Math.max(0, whenSec)

  const osc = c.createOscillator()
  osc.type = 'sine'
  osc.frequency.value = freq
  const env = c.createGain()
  env.gain.setValueAtTime(0.0001, t0)
  env.gain.linearRampToValueAtTime(0.5, t0 + 0.015)
  env.gain.exponentialRampToValueAtTime(0.0005, t0 + duration)
  osc.connect(env)
  env.connect(gain)
  osc.start(t0)
  osc.stop(t0 + duration + 0.05)

  // 배음 — 한 옥타브 위, 더 여리고 더 빨리 사라짐 (오르골 특유의 쨍한 끝맛)
  const osc2 = c.createOscillator()
  osc2.type = 'sine'
  osc2.frequency.value = freq * 2
  const env2 = c.createGain()
  env2.gain.setValueAtTime(0.0001, t0)
  env2.gain.linearRampToValueAtTime(0.12, t0 + 0.01)
  env2.gain.exponentialRampToValueAtTime(0.0003, t0 + duration * 0.55)
  osc2.connect(env2)
  env2.connect(gain)
  osc2.start(t0)
  osc2.stop(t0 + duration * 0.55 + 0.05)
}

let loopHandle = 0
let loopRunning = false
let activeMelody: readonly MelodyNote[] | null = null

/**
 * 배경음악 루프 시작. 이미 같은 멜로디가 돌고 있으면 아무 일도 하지
 * 않습니다 — 곡 중간에 처음부터 다시 시작하며 끊기지 않게 합니다.
 * 다른 멜로디가 넘어오면(맵 이동 등) 그쪽으로 자연스럽게 갈아탑니다.
 */
export function startAmbientLoop(melody: readonly MelodyNote[] = EXPLORE_MELODY) {
  unlockAudio()
  if (loopRunning && activeMelody === melody) return
  window.clearTimeout(loopHandle)
  loopRunning = true
  activeMelody = melody
  let i = 0
  const step = () => {
    if (!loopRunning || activeMelody !== melody) return
    const n = melody[i % melody.length]
    if (n.note) playNote(n.note, 0, n.dur * 0.92)
    i++
    loopHandle = window.setTimeout(step, n.dur * 1000)
  }
  step()
}

export function stopAmbientLoop() {
  loopRunning = false
  activeMelody = null
  window.clearTimeout(loopHandle)
}
