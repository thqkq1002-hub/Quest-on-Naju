import { useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { COLLECTIBLES, type Collectible } from '@/content/codex/collectibles'

/**
 * 탐험 수첩 — 도감(전부) · 가방(들고 있는 것) 두 탭.
 *
 * 목록은 하드코딩하지 않고 `COLLECTIBLES` 데이터와 스토어의
 * `codex`/`items` 배열을 맞춰봐서 해금 여부를 가립니다. 새 유물·아이템은
 * `content/codex/collectibles.ts`에 한 줄 추가하면 여기 자동으로 뜹니다.
 */
export function InventoryButton() {
  const open = useGameStore((s) => s.openInventory)
  return (
    <button onClick={open} style={invBtn} title="탐험 수첩 (I)">
      🎒 탐험 수첩
    </button>
  )
}

export function InventoryModal() {
  const isOpen = useGameStore((s) => s.inventoryOpen)
  const close = useGameStore((s) => s.closeInventory)
  const codex = useGameStore((s) => s.codex)
  const items = useGameStore((s) => s.items)

  const [tab, setTab] = useState<'encyclopedia' | 'inventory'>('encyclopedia')
  const [selectedId, setSelectedId] = useState<string>(COLLECTIBLES[0].id)

  // I 키로도 열고 닫습니다
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.code !== 'KeyI') return
      const s = useGameStore.getState()
      s.inventoryOpen ? s.closeInventory() : s.openInventory()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  if (!isOpen) return null

  const unlocked = new Set([...codex, ...items])
  const list = tab === 'inventory' ? COLLECTIBLES.filter((c) => c.isItem && unlocked.has(c.id)) : COLLECTIBLES
  const selected: Collectible | undefined = COLLECTIBLES.find((c) => c.id === selectedId)
  const selectedUnlocked = selected ? unlocked.has(selected.id) : false

  return (
    <div style={overlay} onPointerDown={close}>
      <div style={sheet} onPointerDown={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <h2 style={{ margin: 0, fontSize: 20 }}>🎒 나주 탐험 수첩</h2>
          <button onClick={close} style={closeBtn} aria-label="수첩 닫기">
            ✕
          </button>
        </div>

        <div style={tabRow}>
          <button
            onClick={() => setTab('encyclopedia')}
            style={{ ...tabBtn, ...(tab === 'encyclopedia' ? tabBtnActive : null) }}
          >
            📜 보물 도감 ({unlocked.size}/{COLLECTIBLES.length})
          </button>
          <button
            onClick={() => setTab('inventory')}
            style={{ ...tabBtn, ...(tab === 'inventory' ? tabBtnActive : null) }}
          >
            🎒 내 가방 ({items.length}개)
          </button>
        </div>

        <div style={body}>
          <div style={grid}>
            {list.length === 0 && <p style={emptyMsg}>아직 가진 게 없어요. 나가서 찾아보렴!</p>}
            {list.map((c) => {
              const has = unlocked.has(c.id)
              const isSelected = selectedId === c.id
              return (
                <button
                  key={c.id}
                  onClick={() => setSelectedId(c.id)}
                  style={{
                    ...card,
                    ...(has ? (isSelected ? cardSelected : null) : cardLocked),
                  }}
                >
                  <div style={{ fontSize: 30 }}>{has ? c.icon : '🔒'}</div>
                  <span style={cardName}>{has ? c.name : '미해금 보물'}</span>
                  <span style={cardLoc}>{c.location}</span>
                </button>
              )
            })}
          </div>

          <div style={detail}>
            {selected ? (
              <>
                <div style={detailIcon}>{selectedUnlocked ? selected.icon : '❓'}</div>
                <span style={badge}>{selected.category}</span>
                <h3 style={{ margin: '8px 0 4px', fontSize: 16 }}>
                  {selectedUnlocked ? selected.name : '🔒 잠긴 보물'}
                </h3>
                <p style={detailDesc}>
                  {selectedUnlocked
                    ? selected.description
                    : `'${selected.location}'에서 찾을 수 있어요.`}
                </p>
              </>
            ) : (
              <p style={{ ...detailDesc, margin: 'auto' }}>항목을 골라 보세요</p>
            )}
          </div>
        </div>

        <div style={footer}>💡 나주 곳곳을 탐험하며 수첩을 채워 보세요!</div>
      </div>
    </div>
  )
}

// ── 스타일 ───────────────────────────────────────────────────────
const invBtn: React.CSSProperties = {
  position: 'absolute',
  right: 'calc(max(24px, env(safe-area-inset-right)) + 148px)',
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
  width: 'min(640px, 100%)',
  maxHeight: '85vh',
  padding: '18px 20px 16px',
  borderRadius: 18,
  border: '1px solid rgba(140,205,235,.45)',
  background: 'rgba(14,30,40,.96)',
  color: '#eaf4f8',
  boxShadow: '0 18px 60px rgba(0,0,0,.5)',
  display: 'flex',
  flexDirection: 'column',
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

const tabRow: React.CSSProperties = {
  display: 'flex',
  gap: 8,
  marginTop: 14,
}

const tabBtn: React.CSSProperties = {
  flex: 1,
  padding: '10px 12px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,.18)',
  background: 'rgba(255,255,255,.06)',
  color: 'rgba(234,244,248,.75)',
  fontSize: 13,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
}

const tabBtnActive: React.CSSProperties = {
  background: 'rgba(255,210,74,.16)',
  borderColor: 'rgba(255,210,74,.5)',
  color: '#ffd24a',
}

const body: React.CSSProperties = {
  marginTop: 14,
  display: 'grid',
  gridTemplateColumns: '3fr 2fr',
  gap: 12,
  overflowY: 'auto',
  minHeight: 0,
}

const grid: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: 8,
  alignContent: 'start',
}

const emptyMsg: React.CSSProperties = {
  gridColumn: '1 / -1',
  fontSize: 12.5,
  opacity: 0.65,
  textAlign: 'center',
  padding: '20px 0',
}

const card: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 3,
  padding: '10px 8px',
  borderRadius: 12,
  border: '1px solid rgba(255,255,255,.14)',
  background: 'rgba(255,255,255,.05)',
  color: '#eaf4f8',
  fontFamily: 'inherit',
  cursor: 'pointer',
  textAlign: 'center',
}

const cardSelected: React.CSSProperties = {
  background: 'rgba(255,210,74,.16)',
  borderColor: 'rgba(255,210,74,.55)',
}

const cardLocked: React.CSSProperties = {
  opacity: 0.55,
}

const cardName: React.CSSProperties = {
  fontSize: 11.5,
  fontWeight: 700,
  wordBreak: 'keep-all',
}

const cardLoc: React.CSSProperties = {
  fontSize: 10,
  opacity: 0.6,
  wordBreak: 'keep-all',
}

const detail: React.CSSProperties = {
  padding: 14,
  borderRadius: 12,
  background: 'rgba(255,255,255,.05)',
  border: '1px solid rgba(255,255,255,.12)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
}

const detailIcon: React.CSSProperties = {
  width: 56,
  height: 56,
  display: 'grid',
  placeItems: 'center',
  fontSize: 30,
  borderRadius: 14,
  background: 'rgba(255,255,255,.08)',
}

const badge: React.CSSProperties = {
  marginTop: 8,
  padding: '2px 9px',
  borderRadius: 999,
  fontSize: 10.5,
  fontWeight: 700,
  background: 'rgba(255,210,74,.16)',
  color: '#ffd24a',
}

const detailDesc: React.CSSProperties = {
  fontSize: 12.5,
  lineHeight: 1.6,
  opacity: 0.82,
  wordBreak: 'keep-all',
}

const footer: React.CSSProperties = {
  marginTop: 12,
  paddingTop: 10,
  borderTop: '1px solid rgba(255,255,255,.12)',
  fontSize: 11.5,
  textAlign: 'center',
  opacity: 0.75,
}
