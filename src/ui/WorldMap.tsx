import { useEffect, useState } from 'react'
import { MAPS, MAP_ORDER, isUnlocked, type MapId } from '@/game/world/registry'
import { SAIL_MS, useMapStore } from '@/store/mapStore'
import { useGameStore } from '@/store/gameStore'

/**
 * 나주 월드맵.
 *
 * **3D 오픈월드가 아닙니다.** 기울인 지도판 위에 지역 아이콘을 얹은
 * 화면입니다 — 가볍고, 지리 관계가 한눈에 들어옵니다.
 * → docs/06-NAJU-WORLD-MAP.md 3절
 *
 * 지역을 고르면 나룻배가 영산강을 따라 갑니다(나주역만 기차 — 아래
 * SailOverlay 참고). 그 3.6초 동안 다음 씬 청크가 내려오고, 플레이어는
 * "영산강이 나주를 이었다" 를 매번 봅니다.
 */

/** 영산강 — 지도판 위를 북서에서 남동으로 가로지릅니다 (0~1 좌표) */
const RIVER = 'M 0.06,0.13 C 0.26,0.24 0.30,0.36 0.44,0.42 C 0.58,0.48 0.62,0.62 0.72,0.72 C 0.80,0.80 0.88,0.86 0.96,0.92'

/**
 * 호남선 기찻길 — 다시역(다시초등학교 자리)에서 나주역으로 남쪽으로 곧게
 * 내려갑니다. 강과 겹치면 "이것도 강인가" 싶어지므로, 강 곡선에서 서쪽으로
 * 비켜 따로 그립니다. 나주역 좌표(worldMapPos)는 이 선의 끝점과 맞춥니다.
 */
const RAILWAY = 'M 0.30,0.26 C 0.33,0.35 0.33,0.46 0.37,0.55 C 0.39,0.60 0.40,0.63 0.41,0.66'

/**
 * 드들강 지선 — 다시역에서 북동쪽으로 갈라지는 별도 기찻길입니다.
 * 나주역 방면(RAILWAY)과 같은 다시역에서 시작하지만 반대쪽으로 뻗어서,
 * 다시역이 두 노선이 만나는 분기점이라는 걸 한눈에 보여줍니다.
 */
const RAILWAY_DDEULDEULGANG =
  'M 0.30,0.26 C 0.42,0.20 0.55,0.16 0.65,0.14 C 0.72,0.13 0.77,0.13 0.82,0.12'

export function WorldMapButton() {
  const open = useGameStore((s) => s.openWorldMap)
  const sailing = useMapStore((s) => s.sailing)

  // 항상 켜 둡니다 — 아직 못 가는 곳이 있어도, 지도를 열어 어디로 가면
  // 열리는지 미리 보여주는 편이 좋습니다. 잠긴 곳은 지도 안에서 🔒로 표시됩니다.
  if (sailing) return null

  return (
    <button onClick={open} style={mapBtn} title="나주 지도 (M)">
      🗺️ 나주 지도
    </button>
  )
}

export function WorldMap() {
  const isOpen = useGameStore((s) => s.worldMapOpen)
  const close = useGameStore((s) => s.closeWorldMap)
  const completed = useGameStore((s) => s.completedQuests)
  const current = useMapStore((s) => s.current)
  const travelTo = useMapStore((s) => s.travelTo)
  const [hover, setHover] = useState<MapId | null>(null)

  // M 키로도 열고 닫습니다 — 데스크톱에서 손이 마우스로 가지 않게
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'KeyM') return
      const s = useGameStore.getState()
      s.worldMapOpen ? s.closeWorldMap() : s.openWorldMap()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!isOpen) return null

  const shown = hover ?? current

  function go(id: MapId) {
    if (id === current) return
    close()
    travelTo(id)
  }

  return (
    <div style={overlay} onPointerDown={close}>
      <div style={sheet} onPointerDown={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}>
          <h2 style={{ margin: 0, fontSize: 21 }}>나주 지도</h2>
          <span style={{ fontSize: 12.5, opacity: 0.7 }}>영산강을 따라 지역이 이어집니다</span>
          <button onClick={close} style={closeBtn} aria-label="지도 닫기">✕</button>
        </div>

        {/* 지도판 — 기울여서 판처럼 보이게 합니다 */}
        <div style={boardWrap}>
          <div style={board}>
            <svg viewBox="0 0 1 1" preserveAspectRatio="none" style={svgFill} aria-hidden="true">
              {/* 논밭 결 */}
              {Array.from({ length: 9 }, (_, i) => (
                <line
                  key={i}
                  x1={0} y1={i / 9 + 0.05} x2={1} y2={i / 9 + 0.02}
                  stroke="rgba(80,110,70,.16)" strokeWidth={0.004}
                />
              ))}
              {/* 영산강 */}
              <path d={RIVER} fill="none" stroke="#6ba3c9" strokeWidth={0.045} strokeLinecap="round" opacity={0.55} />
              <path d={RIVER} fill="none" stroke="#8fc6e6" strokeWidth={0.022} strokeLinecap="round" />
              {/* 호남선 기찻길 — 다시역에서 나주역으로 */}
              <path d={RAILWAY} fill="none" stroke="#7a7568" strokeWidth={0.016} strokeLinecap="round" opacity={0.6} />
              <path
                d={RAILWAY}
                fill="none"
                stroke="#e8e0c8"
                strokeWidth={0.016}
                strokeLinecap="round"
                strokeDasharray="0.011 0.013"
              />
              {/* 드들강 지선 — 다시역에서 북동쪽 드들강 솔밭유원지로 */}
              <path
                d={RAILWAY_DDEULDEULGANG}
                fill="none"
                stroke="#7a7568"
                strokeWidth={0.016}
                strokeLinecap="round"
                opacity={0.6}
              />
              <path
                d={RAILWAY_DDEULDEULGANG}
                fill="none"
                stroke="#e8e0c8"
                strokeWidth={0.016}
                strokeLinecap="round"
                strokeDasharray="0.011 0.013"
              />
            </svg>

            <span style={riverLabel}>영산강</span>
            <span style={railLabel}>기찻길</span>
            <span style={railLabelDdeuldeulgang}>드들강 지선</span>

            {MAP_ORDER.map((id) => {
              const def = MAPS[id]
              const unlocked = isUnlocked(def, completed)
              const here = id === current
              const [px, py] = def.worldMapPos
              return (
                <button
                  key={id}
                  onClick={() => unlocked && go(id)}
                  onPointerEnter={() => unlocked && setHover(id)}
                  onPointerLeave={() => setHover(null)}
                  disabled={!unlocked}
                  style={{
                    ...pin,
                    left: `${px * 100}%`,
                    top: `${py * 100}%`,
                    opacity: unlocked ? 1 : 0.42,
                    cursor: unlocked && !here ? 'pointer' : 'default',
                    borderColor: here ? '#ffd24a' : 'rgba(255,255,255,.5)',
                    background: here ? 'rgba(255,210,74,.92)' : 'rgba(20,40,52,.82)',
                    color: here ? '#22301f' : '#eaf4f8',
                  }}
                  aria-label={`${def.name}${here ? ' (지금 여기)' : ''}`}
                >
                  <span style={{ fontSize: 17, lineHeight: 1 }}>{unlocked ? (here ? '📍' : '⛩️') : '🔒'}</span>
                  <span style={{ fontSize: 12, fontWeight: 700, whiteSpace: 'nowrap' }}>{def.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* 고른 지역 설명 */}
        <div style={info}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
            <strong style={{ fontSize: 16 }}>{MAPS[shown].name}</strong>
            <span style={{ fontSize: 12, opacity: 0.7 }}>{MAPS[shown].region} · {MAPS[shown].era}</span>
          </div>
          <p style={{ margin: '5px 0 0', fontSize: 13, opacity: 0.85, lineHeight: 1.55 }}>
            {isUnlocked(MAPS[shown], completed)
              ? MAPS[shown].blurb
              : '아직 갈 수 없는 곳입니다. 퀘스트를 진행하면 열립니다.'}
          </p>
        </div>
      </div>
    </div>
  )
}

/**
 * 이동 연출. 지도 위를 나룻배(또는 기차)가 지나가는 3.6초.
 *
 * 나주역이 출발지든 도착지든(왕복 다) 기차입니다 — 갈 때 기차를 탔으면
 * 돌아올 때도 기차를 타야 앞뒤가 맞으니까요. 그 외에는 전부 나룻배입니다.
 */
export function SailOverlay() {
  const sailing = useMapStore((s) => s.sailing)
  const arrive = useMapStore((s) => s.arrive)
  const [t, setT] = useState(0)

  useEffect(() => {
    if (!sailing) return
    let raf = 0
    const tick = () => {
      const p = Math.min(1, (performance.now() - sailing.startedAt) / SAIL_MS)
      setT(p)
      if (p < 1) raf = requestAnimationFrame(tick)
      else arrive()
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [sailing, arrive])

  if (!sailing) return null

  const from = MAPS[sailing.from]
  const to = MAPS[sailing.to]
  const isTrain = from.travelMode === 'train' || to.travelMode === 'train'
  const isDdeuldeulgang = sailing.from === 'ddeuldeulgang' || sailing.to === 'ddeuldeulgang'
  const railwayPath = isDdeuldeulgang ? RAILWAY_DDEULDEULGANG : RAILWAY
  // 부드럽게 출발하고 부드럽게 섭니다
  const e = t * t * (3 - 2 * t)
  const [x0, y0] = from.worldMapPos
  const [x1, y1] = to.worldMapPos
  const bx = x0 + (x1 - x0) * e
  // 배는 강을 따라가는 느낌을 주려고 가운데를 살짝 늘어뜨리고,
  // 기차는 철길이니 곧게 직진합니다
  const by = y0 + (y1 - y0) * e + (isTrain ? 0 : Math.sin(Math.PI * e) * 0.05)
  const heading = x1 >= x0 ? 1 : -1

  return (
    <div style={sailWrap} role="status" aria-live="polite">
      <div style={sailBoard}>
        <svg viewBox="0 0 1 1" preserveAspectRatio="none" style={svgFill} aria-hidden="true">
          {isTrain ? (
            <>
              <path d={railwayPath} fill="none" stroke="#8a9098" strokeWidth={0.022} strokeLinecap="round" opacity={0.7} />
              <path
                d={railwayPath}
                fill="none"
                stroke="#e8e4dc"
                strokeWidth={0.016}
                strokeLinecap="round"
                strokeDasharray="0.013 0.015"
              />
            </>
          ) : (
            <>
              <path d={RIVER} fill="none" stroke="#5f9dc4" strokeWidth={0.05} strokeLinecap="round" opacity={0.5} />
              <path d={RIVER} fill="none" stroke="#a9dcf5" strokeWidth={0.024} strokeLinecap="round" />
            </>
          )}
        </svg>
        {[from, to].map((m, i) => (
          <span
            key={m.id}
            style={{
              ...sailPin,
              left: `${m.worldMapPos[0] * 100}%`,
              top: `${m.worldMapPos[1] * 100}%`,
              opacity: i === 1 ? 0.55 + e * 0.45 : 1,
            }}
          >
            {i === 1 ? '⛩️' : '📍'} {m.name}
          </span>
        ))}
        <span
          style={{
            ...boat,
            left: `${bx * 100}%`,
            top: `${by * 100}%`,
            transform: `translate(-50%,-50%) scaleX(${heading})`,
          }}
        >
          {isTrain ? '🚂' : '⛵'}
        </span>
      </div>

      <div style={{ textAlign: 'center' }}>
        <p style={{ margin: 0, fontSize: 19, fontWeight: 700, color: '#eaf4f8' }}>
          {isTrain ? `호남선 기차 — ${to.name}(으)로` : `영산강 뱃길 — ${to.name}(으)로`}
        </p>
        <p style={{ margin: '7px 0 0', fontSize: 13, color: 'rgba(234,244,248,.75)' }}>
          {isTrain
            ? `${from.name}에서 ${to.name}까지, 기찻길로 이어져 있습니다.`
            : '옛날 나주는 이 강으로 이어져 있었습니다.'}
        </p>
        <div style={progressTrack} aria-hidden="true">
          <div
            style={{
              ...progressFill,
              width: `${e * 100}%`,
              background: isTrain
                ? 'linear-gradient(90deg, #8a9098, #e0b84a)'
                : progressFill.background,
            }}
          />
        </div>
      </div>
    </div>
  )
}

// ── 스타일 ───────────────────────────────────────────────────────
const overlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(8,16,22,.62)',
  backdropFilter: 'blur(3px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  pointerEvents: 'auto',
  zIndex: 30,
}

const sheet: React.CSSProperties = {
  width: 'min(720px, 100%)',
  padding: '18px 20px 20px',
  borderRadius: 18,
  border: '1px solid rgba(140,205,235,.45)',
  background: 'rgba(14,30,40,.95)',
  color: '#eaf4f8',
  boxShadow: '0 18px 60px rgba(0,0,0,.5)',
}

const closeBtn: React.CSSProperties = {
  marginLeft: 'auto',
  width: 32,
  height: 32,
  borderRadius: 9,
  border: '1px solid rgba(255,255,255,.3)',
  background: 'rgba(255,255,255,.1)',
  color: '#eaf4f8',
  fontSize: 15,
  cursor: 'pointer',
  fontFamily: 'inherit',
}

const boardWrap: React.CSSProperties = {
  marginTop: 14,
  perspective: 900,
}

const board: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  aspectRatio: '16 / 10',
  borderRadius: 14,
  // 기울인 지도판
  transform: 'rotateX(16deg)',
  transformStyle: 'preserve-3d',
  background: 'linear-gradient(160deg, #cfe0bc 0%, #bcd3a6 55%, #a9c393 100%)',
  border: '2px solid rgba(90,120,80,.5)',
  boxShadow: '0 22px 40px rgba(0,0,0,.42)',
  overflow: 'hidden',
}

const svgFill: React.CSSProperties = { position: 'absolute', inset: 0, width: '100%', height: '100%' }

const riverLabel: React.CSSProperties = {
  position: 'absolute',
  left: '52%',
  top: '54%',
  fontSize: 12,
  fontWeight: 700,
  color: '#2f5d7a',
  transform: 'rotate(30deg)',
  pointerEvents: 'none',
}

const railLabel: React.CSSProperties = {
  position: 'absolute',
  left: '25%',
  top: '43%',
  fontSize: 12,
  fontWeight: 700,
  color: '#5a5548',
  transform: 'rotate(66deg)',
  pointerEvents: 'none',
}

const railLabelDdeuldeulgang: React.CSSProperties = {
  position: 'absolute',
  left: '54%',
  top: '13%',
  fontSize: 12,
  fontWeight: 700,
  color: '#5a5548',
  transform: 'rotate(-10deg)',
  pointerEvents: 'none',
}

const pin: React.CSSProperties = {
  position: 'absolute',
  transform: 'translate(-50%,-50%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 3,
  padding: '7px 10px',
  borderRadius: 12,
  border: '2px solid',
  fontFamily: 'inherit',
  boxShadow: '0 6px 16px rgba(0,0,0,.3)',
}

const info: React.CSSProperties = {
  marginTop: 16,
  padding: '11px 14px',
  borderRadius: 12,
  background: 'rgba(255,255,255,.07)',
  border: '1px solid rgba(255,255,255,.12)',
}

const mapBtn: React.CSSProperties = {
  position: 'absolute',
  right: 'max(24px, env(safe-area-inset-right))',
  top: 'max(16px, env(safe-area-inset-top))',
  padding: '9px 15px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,.4)',
  background: 'rgba(16,34,46,.72)',
  backdropFilter: 'blur(4px)',
  color: '#eaf4f8',
  fontSize: 14,
  fontWeight: 600,
  fontFamily: 'inherit',
  cursor: 'pointer',
  pointerEvents: 'auto',
  zIndex: 12,
}

const sailWrap: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'linear-gradient(180deg, #0d2230 0%, #123245 100%)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 22,
  padding: 24,
  pointerEvents: 'auto',
  zIndex: 40,
}

const sailBoard: React.CSSProperties = {
  position: 'relative',
  width: 'min(620px, 92%)',
  aspectRatio: '16 / 10',
  borderRadius: 14,
  background: 'linear-gradient(160deg, #b9cfa6 0%, #a6c091 100%)',
  border: '2px solid rgba(90,120,80,.5)',
  boxShadow: '0 18px 44px rgba(0,0,0,.45)',
  overflow: 'hidden',
  transform: 'rotateX(14deg)',
}

const sailPin: React.CSSProperties = {
  position: 'absolute',
  transform: 'translate(-50%,-50%)',
  fontSize: 12,
  fontWeight: 700,
  color: '#22301f',
  background: 'rgba(255,255,255,.8)',
  padding: '3px 8px',
  borderRadius: 9,
  whiteSpace: 'nowrap',
}

const boat: React.CSSProperties = {
  position: 'absolute',
  fontSize: 30,
  filter: 'drop-shadow(0 3px 6px rgba(0,0,0,.35))',
}

const progressTrack: React.CSSProperties = {
  width: 260,
  height: 5,
  margin: '14px auto 0',
  borderRadius: 4,
  background: 'rgba(255,255,255,.18)',
  overflow: 'hidden',
}

const progressFill: React.CSSProperties = {
  height: '100%',
  background: 'linear-gradient(90deg, #7fe0a8, #ffd24a)',
}
