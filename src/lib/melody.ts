/**
 * <엄마야 누나야> 신디사이저 편곡용 멜로디 데이터.
 *
 * 안성현 선생이 곡을 붙인 동요의 유명한 도입부("엄마야 누나야 강변 살자")를
 * 계이름 미-솔-라-솔-미 그대로 살려 시작합니다. 그 뒤는 오르골 반주에
 * 어울리도록 오단음계(도레미솔라)로 이어 붙인 **게임용 편곡**입니다 —
 * 실제 악보의 정밀한 채보가 아닙니다.
 * → src/lib/audio.ts 에서 오실레이터로 재생합니다.
 */

export interface MelodyNote {
  /** 음이름. null이면 쉼표 */
  note: string | null
  /** 초 단위 길이 */
  dur: number
}

export const NOTE_FREQ: Record<string, number> = {
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  G4: 392.0,
  A4: 440.0,
  C5: 523.25,
  D5: 587.33,
}

/** 엄마야 누나야 강변 살자 / 뜰에는 반짝이는 금모래빛 — 두 소절 루프 */
export const OMMAYA_MELODY: readonly MelodyNote[] = [
  // 엄마야 누나야
  { note: 'E4', dur: 0.42 },
  { note: 'G4', dur: 0.42 },
  { note: 'A4', dur: 0.42 },
  { note: 'G4', dur: 0.42 },
  { note: 'E4', dur: 0.6 },
  // 강변 살자
  { note: 'D4', dur: 0.42 },
  { note: 'E4', dur: 0.42 },
  { note: 'G4', dur: 0.42 },
  { note: 'E4', dur: 0.42 },
  { note: 'D4', dur: 0.42 },
  { note: 'C4', dur: 0.7 },
  { note: null, dur: 0.3 },
  // 뜰에는 반짝이는
  { note: 'E4', dur: 0.42 },
  { note: 'G4', dur: 0.42 },
  { note: 'A4', dur: 0.42 },
  { note: 'C5', dur: 0.42 },
  { note: 'A4', dur: 0.42 },
  { note: 'G4', dur: 0.6 },
  // 금모래빛
  { note: 'E4', dur: 0.42 },
  { note: 'D4', dur: 0.42 },
  { note: 'E4', dur: 0.42 },
  { note: 'D4', dur: 0.42 },
  { note: 'C4', dur: 0.9 },
  { note: null, dur: 0.5 },
] as const

/** 미니게임에서 음표를 하나 맞힐 때마다 순서대로 재생할 실제 음(쉼표 제외) */
export const OMMAYA_NOTES: readonly string[] = OMMAYA_MELODY.filter((n) => n.note).map(
  (n) => n.note as string,
)

/**
 * 탐험 테마 — 다시초를 포함한 모든 지역에서 기본으로 흐르는 배경음악.
 *
 * <엄마야 누나야>는 드들강 한 곳만의 특별한 순간으로 남겨 두고 싶어서,
 * 게임 전체를 도는 동안에는 이 곡을 씁니다. 씩씩하게 오르는 첫 소절과
 * 두리번거리듯 호기심 어린 둘째 소절 — "새로운 곳에 막 도착한 기분"을
 * 오단음계(도레미솔라)로 담았습니다. 실존 곡이 아닌 이 프로젝트를 위한
 * 창작 멜로디입니다.
 */
export const EXPLORE_MELODY: readonly MelodyNote[] = [
  // 문을 나서는 첫 걸음 — 씩씩하게 오릅니다
  { note: 'C4', dur: 0.26 },
  { note: 'E4', dur: 0.26 },
  { note: 'G4', dur: 0.26 },
  { note: 'C5', dur: 0.4 },
  { note: 'A4', dur: 0.26 },
  { note: 'G4', dur: 0.26 },
  { note: 'E4', dur: 0.26 },
  { note: 'G4', dur: 0.5 },
  { note: null, dur: 0.2 },
  // 두리번거리듯 — 호기심 어린 대답구
  { note: 'A4', dur: 0.26 },
  { note: 'G4', dur: 0.26 },
  { note: 'E4', dur: 0.26 },
  { note: 'D4', dur: 0.4 },
  { note: 'E4', dur: 0.26 },
  { note: 'D4', dur: 0.26 },
  { note: 'C4', dur: 0.26 },
  { note: 'D4', dur: 0.5 },
  { note: null, dur: 0.2 },
  // 다시 씩씩하게 — 한 번 더 오르며 마무리
  { note: 'E4', dur: 0.26 },
  { note: 'G4', dur: 0.26 },
  { note: 'A4', dur: 0.5 },
  { note: 'C5', dur: 0.75 },
  { note: null, dur: 0.6 },
] as const
