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
  C3: 130.81,
  D3: 146.83,
  E3: 164.81,
  G3: 196.0,
  A3: 220.0,
  C4: 261.63,
  D4: 293.66,
  E4: 329.63,
  G4: 392.0,
  A4: 440.0,
  C5: 523.25,
  D5: 587.33,
  C6: 1046.5,
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

/**
 * 복암리 고분군 테마 — 낮은 음역, 느린 템포, 성근 쉼표로 "천 년 전"이라는
 * 시간의 무게를 냅니다. 장조/단조를 가르는 반음이 없는 오단음계 특성상,
 * 으뜸음을 도(C)가 아니라 라(A)에 두는 것만으로 같은 음 다섯 개가
 * 그늘진 단조 느낌으로 들립니다 — 새 음을 늘리지 않고 낸 두 번째 색입니다.
 */
export const BOKAMRI_MELODY: readonly MelodyNote[] = [
  { note: 'A3', dur: 0.7 },
  { note: 'C4', dur: 0.6 },
  { note: 'D4', dur: 0.7 },
  { note: null, dur: 0.3 },
  { note: 'E4', dur: 0.6 },
  { note: 'D4', dur: 0.55 },
  { note: 'C4', dur: 0.7 },
  { note: 'A3', dur: 0.95 },
  { note: null, dur: 0.5 },
  { note: 'G3', dur: 0.7 },
  { note: 'A3', dur: 0.6 },
  { note: 'C4', dur: 0.7 },
  { note: null, dur: 0.3 },
  { note: 'D4', dur: 0.6 },
  { note: 'C4', dur: 0.55 },
  { note: 'A3', dur: 0.7 },
  { note: 'G3', dur: 1.1 },
  { note: null, dur: 0.7 },
] as const

/**
 * 문평면(나대용 장군 유적) 테마 — 또박또박한 4분음 걸음으로 오르내리는
 * 행진곡풍 선율. 칼 대신 자를 든 "군함 과학자"에 어울리게, 씩씩하되
 * EXPLORE_MELODY보다 절도 있고 느립니다.
 */
export const MUNPYEONG_MELODY: readonly MelodyNote[] = [
  { note: 'C4', dur: 0.36 },
  { note: 'E4', dur: 0.36 },
  { note: 'G4', dur: 0.36 },
  { note: 'C5', dur: 0.55 },
  { note: null, dur: 0.15 },
  { note: 'A4', dur: 0.36 },
  { note: 'G4', dur: 0.36 },
  { note: 'E4', dur: 0.36 },
  { note: 'G4', dur: 0.55 },
  { note: null, dur: 0.15 },
  { note: 'C4', dur: 0.36 },
  { note: 'D4', dur: 0.36 },
  { note: 'E4', dur: 0.36 },
  { note: 'G4', dur: 0.55 },
  { note: null, dur: 0.15 },
  { note: 'G4', dur: 0.36 },
  { note: 'E4', dur: 0.36 },
  { note: 'C4', dur: 0.8 },
  { note: null, dur: 0.5 },
] as const

/**
 * 나주읍성 테마 — 금성관·4대문을 두른 관아다운 위엄을 담아, 솔(G)을
 * 으뜸음 삼아 느리고 반듯하게 오르내립니다. 마지막은 라(A)-솔(G)로
 * 낮게 가라앉혀 성곽의 무게감을 냅니다.
 */
export const NAJUEUPSEONG_MELODY: readonly MelodyNote[] = [
  { note: 'G4', dur: 0.48 },
  { note: 'E4', dur: 0.4 },
  { note: 'D4', dur: 0.4 },
  { note: 'C4', dur: 0.6 },
  { note: null, dur: 0.2 },
  { note: 'D4', dur: 0.4 },
  { note: 'E4', dur: 0.4 },
  { note: 'G4', dur: 0.4 },
  { note: 'A4', dur: 0.6 },
  { note: null, dur: 0.2 },
  { note: 'C5', dur: 0.48 },
  { note: 'A4', dur: 0.4 },
  { note: 'G4', dur: 0.4 },
  { note: 'E4', dur: 0.6 },
  { note: null, dur: 0.2 },
  { note: 'D4', dur: 0.4 },
  { note: 'C4', dur: 0.4 },
  { note: 'A3', dur: 0.5 },
  { note: 'G3', dur: 0.95 },
  { note: null, dur: 0.6 },
] as const

/**
 * 영산포 테마 — 근대 거리와 홍어거리를 함께 걷는 느낌으로, 레(D)를
 * 중심으로 통통 튀듯 오가는 선율입니다. EXPLORE_MELODY보다 여유롭고
 * 정렬사·읍성 테마보다는 가볍습니다.
 */
export const YEONGSANPO_MELODY: readonly MelodyNote[] = [
  { note: 'E4', dur: 0.3 },
  { note: 'G4', dur: 0.3 },
  { note: 'A4', dur: 0.3 },
  { note: 'G4', dur: 0.45 },
  { note: 'E4', dur: 0.3 },
  { note: 'D4', dur: 0.5 },
  { note: null, dur: 0.2 },
  { note: 'C4', dur: 0.3 },
  { note: 'D4', dur: 0.3 },
  { note: 'E4', dur: 0.3 },
  { note: 'D4', dur: 0.45 },
  { note: 'C4', dur: 0.3 },
  { note: 'A3', dur: 0.55 },
  { note: null, dur: 0.25 },
  { note: 'D4', dur: 0.3 },
  { note: 'E4', dur: 0.3 },
  { note: 'G4', dur: 0.3 },
  { note: 'D4', dur: 0.5 },
  { note: null, dur: 0.3 },
] as const

/**
 * 정렬사 테마 — 충절 5위를 기리는 사당답게, 가장 느리고 가장 낮은
 * 음역만 씁니다. 쉼표를 길게 두어 향을 피우고 절하는 사이의 정적을 냅니다.
 */
export const JEONGRYEOLSA_MELODY: readonly MelodyNote[] = [
  { note: 'A3', dur: 1.0 },
  { note: null, dur: 0.35 },
  { note: 'G3', dur: 0.9 },
  { note: null, dur: 0.3 },
  { note: 'A3', dur: 0.8 },
  { note: 'C4', dur: 1.05 },
  { note: null, dur: 0.4 },
  { note: 'D4', dur: 1.1 },
  { note: null, dur: 0.35 },
  { note: 'C4', dur: 0.9 },
  { note: 'A3', dur: 1.3 },
  { note: null, dur: 0.8 },
] as const

/**
 * 나주역 테마 — 1929년 나주역 사건(광주학생독립운동의 발단)을 기립니다.
 * 슬픈 역사라 화려하게 꾸미지 않는다는 이 맵의 원칙(→ palette.ts)을
 * 그대로 음악에도 적용해, 라(A) 단조 오단음계로 낮고 절제된 걸음을 걷되
 * 정렬사보다는 조금 빠르게 — 플랫폼을 향해 걷는 발걸음처럼 — 흐릅니다.
 */
export const NAJUSTATION_MELODY: readonly MelodyNote[] = [
  { note: 'E4', dur: 0.38 },
  { note: 'D4', dur: 0.38 },
  { note: 'C4', dur: 0.55 },
  { note: null, dur: 0.2 },
  { note: 'A3', dur: 0.38 },
  { note: 'C4', dur: 0.38 },
  { note: 'D4', dur: 0.55 },
  { note: null, dur: 0.2 },
  { note: 'E4', dur: 0.38 },
  { note: 'D4', dur: 0.38 },
  { note: 'C4', dur: 0.38 },
  { note: 'A3', dur: 0.65 },
  { note: null, dur: 0.35 },
  { note: 'G3', dur: 0.38 },
  { note: 'A3', dur: 0.38 },
  { note: 'C4', dur: 0.85 },
  { note: null, dur: 0.55 },
] as const

/**
 * 빛가람동 테마 — 유리·콘크리트의 혁신도시답게, 높은 음역에서 짧고
 * 또렷하게 튕기는 스타카토 선율입니다. 다른 테마보다 빠르고 밝으며,
 * 유일하게 한 옥타브 위 도(C6)까지 올라가 "새로 지은 도시"의 반짝임을 냅니다.
 */
export const BITGARAM_MELODY: readonly MelodyNote[] = [
  { note: 'G4', dur: 0.18 },
  { note: 'C5', dur: 0.18 },
  { note: 'D5', dur: 0.18 },
  { note: 'C5', dur: 0.3 },
  { note: null, dur: 0.12 },
  { note: 'A4', dur: 0.18 },
  { note: 'C5', dur: 0.18 },
  { note: 'D5', dur: 0.18 },
  { note: 'C6', dur: 0.34 },
  { note: null, dur: 0.14 },
  { note: 'G4', dur: 0.18 },
  { note: 'A4', dur: 0.18 },
  { note: 'C5', dur: 0.18 },
  { note: 'D5', dur: 0.45 },
  { note: null, dur: 0.2 },
  { note: 'C5', dur: 0.18 },
  { note: 'A4', dur: 0.18 },
  { note: 'G4', dur: 0.3 },
  { note: 'C5', dur: 0.5 },
  { note: null, dur: 0.3 },
] as const
