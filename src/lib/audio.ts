/**
 * 아주 작은 Web Audio 신디사이저 — 오르골/피아노에 가까운 음색으로
 * 음 하나씩을 짧게 튕겨 냅니다.
 *
 * 외부 오디오 파일이나 라이브러리 없이, 오실레이터 두 개(기본음 + 옅은
 * 배음)를 겹쳐 종처럼 감쇠시키는 방식으로 "오르골 톤"을 흉내 냅니다.
 * 드들강 맵에서만 씁니다 — 다른 맵은 이 모듈을 아예 import 하지 않습니다.
 */
import { NOTE_FREQ, OMMAYA_MELODY } from './melody'

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

/** 배경음악 루프 시작 — 이미 돌고 있으면 아무 일도 하지 않습니다 */
export function startAmbientLoop() {
  if (loopRunning) return
  loopRunning = true
  unlockAudio()
  let i = 0
  const step = () => {
    if (!loopRunning) return
    const n = OMMAYA_MELODY[i % OMMAYA_MELODY.length]
    if (n.note) playNote(n.note, 0, n.dur * 0.92)
    i++
    loopHandle = window.setTimeout(step, n.dur * 1000)
  }
  step()
}

export function stopAmbientLoop() {
  loopRunning = false
  window.clearTimeout(loopHandle)
}
