import {
  currentQuest,
  titleForLevel,
  useGameStore,
  xpForLevel,
} from '@/store/gameStore'
import { requestInteract } from '@/lib/input'
import { MAPS } from '@/game/world/registry'
import { useMapStore } from '@/store/mapStore'
import { ITEM_ICONS, ITEM_NAMES } from '@/game/quest/data'

/**
 * HUD. 레퍼런스 이미지 3의 배치를 따릅니다 —
 * 좌상단 정보 패널, 좌하단 조이스틱, 우하단 액션 버튼, 하단 조작 안내.
 *
 * 이미지 3의 HP 바 자리에는 **경험치 바**가 들어갑니다.
 * 이 게임에는 전투가 없고, 플레이어가 지켜보는 숫자는 체력이 아니라 성장입니다.
 *
 * 퀘스트 로그는 진행 중인 퀘스트의 목표를 **데이터에서** 읽어 그립니다.
 * 하드코딩된 문구는 여기 없습니다.
 */
export function Hud() {
  const level = useGameStore((s) => s.level)
  const xp = useGameStore((s) => s.xp)
  const hint = useGameStore((s) => s.hint)
  const items = useGameStore((s) => s.items)
  const active = useGameStore((s) => s.active)
  const dialogueOpen = useGameStore((s) => s.dialogue !== null)
  const mapId = useMapStore((s) => s.current)

  const map = MAPS[mapId]
  const need = xpForLevel(level)
  const pct = Math.min(100, (xp / need) * 100)

  const quest = currentQuest({ active })
  const run = quest ? active[quest.id] : null

  return (
    <>
      {/* 좌상단 정보 패널 */}
      <div style={panel}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <strong style={{ fontSize: 17, letterSpacing: '-0.01em' }}>{map.name}</strong>
          <span style={{ fontSize: 12, opacity: 0.75 }}>나주시 {map.region}</span>
        </div>
        <div style={{ fontSize: 13, opacity: 0.85, marginTop: 4 }}>
          Lv.{level} · {titleForLevel(level)}
        </div>
        <div style={xpTrack}>
          <div style={{ ...xpFill, width: `${pct}%` }} />
        </div>
        <div style={{ fontSize: 11, opacity: 0.6, marginTop: 3 }}>
          경험치 {xp} / {need}
        </div>
        {items.length > 0 && (
          <div style={itemRow}>
            {items.map((i) => (
              <span key={i} style={itemChip}>
                {ITEM_ICONS[i] ?? '🔧'} {ITEM_NAMES[i] ?? i}
              </span>
            ))}
          </div>
        )}
        <div style={learnBadge}>학습내용: 초등 사회 5-2 · 우리 지역의 문화유산</div>
      </div>

      {/* 우상단 퀘스트 로그 — 목표와 진행도를 데이터에서 그립니다 */}
      {quest && run && (
        <div style={questLog}>
          <div style={{ fontSize: 11, color: '#ffd24a', letterSpacing: '0.06em' }}>퀘스트</div>
          <div style={{ fontSize: 15, fontWeight: 700, marginTop: 3 }}>{quest.title}</div>
          <ul style={objList}>
            {quest.objectives.map((o) => {
              const have = run.progress[o.id] ?? 0
              const need2 = o.count ?? 1
              const ok = have >= need2
              return (
                <li key={o.id} style={{ ...objItem, opacity: ok ? 0.55 : 1 }}>
                  <span style={{ color: ok ? '#7fe0a8' : '#ffd24a' }}>{ok ? '✓' : '·'}</span>
                  <span style={{ textDecoration: ok ? 'line-through' : 'none' }}>
                    {o.label}
                    {need2 > 1 && ` (${Math.min(have, need2)}/${need2})`}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {/* 하단 중앙 상호작용 힌트 */}
      {hint && !dialogueOpen && (
        <div style={hintPill}>
          <kbd style={kbdStyle}>Space</kbd> {hint}
        </div>
      )}

      {/* 우하단 액션 버튼 — 이미지 3의 스킬 버튼 자리 */}
      <button
        onPointerDown={(e) => {
          e.preventDefault()
          requestInteract()
        }}
        style={actionBtn}
      >
        말 걸기 · 살펴보기
      </button>

      {/* 하단 조작 안내 */}
      <div style={controlsHint}>
        이동: 조이스틱 · WASD &nbsp;|&nbsp; 카메라: 화면 끌기 · Q E · 탑뷰 T &nbsp;|&nbsp;
        지도: M &nbsp;|&nbsp; 수첩: I &nbsp;|&nbsp; 상호작용: Space · F
      </div>
    </>
  )
}

const panel: React.CSSProperties = {
  position: 'absolute',
  top: 'max(16px, env(safe-area-inset-top))',
  left: 'max(16px, env(safe-area-inset-left))',
  padding: '10px 14px',
  minWidth: 236,
  borderRadius: 12,
  border: '1px solid rgba(140,205,235,.45)',
  background: 'rgba(16,34,46,.68)',
  backdropFilter: 'blur(6px)',
  color: '#eaf4f8',
  pointerEvents: 'none',
}

const xpTrack: React.CSSProperties = {
  marginTop: 8,
  height: 7,
  borderRadius: 4,
  background: 'rgba(255,255,255,.16)',
  overflow: 'hidden',
}

const xpFill: React.CSSProperties = {
  height: '100%',
  background: 'linear-gradient(90deg, #7fe0a8, #ffd24a)',
  transition: 'width .35s ease-out',
}

const itemRow: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 5,
  marginTop: 8,
}

const itemChip: React.CSSProperties = {
  fontSize: 11,
  padding: '3px 8px',
  borderRadius: 999,
  background: 'rgba(255,210,74,.18)',
  border: '1px solid rgba(255,210,74,.4)',
}

const learnBadge: React.CSSProperties = {
  marginTop: 9,
  paddingTop: 8,
  borderTop: '1px solid rgba(255,255,255,.14)',
  fontSize: 11.5,
  opacity: 0.8,
}

const questLog: React.CSSProperties = {
  position: 'absolute',
  // 「나주 지도」 버튼이 화면 오른쪽 위에 있으므로 그 아래로 내립니다
  top: 'max(72px, calc(env(safe-area-inset-top) + 72px))',
  right: 'max(16px, env(safe-area-inset-right))',
  padding: '11px 15px',
  maxWidth: 268,
  borderRadius: 12,
  border: '1px solid rgba(255,210,74,.35)',
  background: 'rgba(16,34,46,.68)',
  backdropFilter: 'blur(6px)',
  color: '#eaf4f8',
  pointerEvents: 'none',
}

const objList: React.CSSProperties = {
  listStyle: 'none',
  padding: 0,
  margin: '7px 0 0',
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
}

const objItem: React.CSSProperties = {
  display: 'flex',
  gap: 7,
  fontSize: 12,
  lineHeight: 1.5,
  wordBreak: 'keep-all',
}

const hintPill: React.CSSProperties = {
  position: 'absolute',
  bottom: 'max(112px, calc(env(safe-area-inset-bottom) + 112px))',
  left: '50%',
  transform: 'translateX(-50%)',
  padding: '9px 18px',
  borderRadius: 999,
  background: 'rgba(16,34,46,.82)',
  color: '#fff',
  fontSize: 14,
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  border: '1px solid rgba(255,210,74,.5)',
}

const kbdStyle: React.CSSProperties = {
  padding: '2px 7px',
  marginRight: 6,
  borderRadius: 5,
  background: 'rgba(255,255,255,.16)',
  fontSize: 12,
  fontFamily: 'inherit',
}

const actionBtn: React.CSSProperties = {
  position: 'absolute',
  right: 'max(24px, env(safe-area-inset-right))',
  bottom: 'max(34px, calc(env(safe-area-inset-bottom) + 6px))',
  padding: '14px 22px',
  borderRadius: 14,
  border: '1px solid rgba(255,255,255,.4)',
  background: 'rgba(255,255,255,.17)',
  backdropFilter: 'blur(4px)',
  color: '#fff',
  fontSize: 15,
  fontWeight: 600,
  fontFamily: 'inherit',
  cursor: 'pointer',
  touchAction: 'none',
  pointerEvents: 'auto',
}

const controlsHint: React.CSSProperties = {
  position: 'absolute',
  bottom: 'max(8px, env(safe-area-inset-bottom))',
  left: '50%',
  transform: 'translateX(-50%)',
  fontSize: 11.5,
  color: 'rgba(255,255,255,.72)',
  textShadow: '0 1px 4px rgba(0,0,0,.6)',
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
}
