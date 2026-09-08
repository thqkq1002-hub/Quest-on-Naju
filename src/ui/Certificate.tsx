import { useRef, useState } from 'react'
import { useGameStore } from '@/store/gameStore'

/**
 * 전 퀘스트 완주 수료증 — 교장선생님이 마지막에 보여주는 화면.
 *
 * 이름 입력창은 캡처 대상(certRef) 바깥에 둡니다. html2canvas는 <input>의
 * 현재 값을 항상 정확히 그리지 못하는 경우가 있어서, 캡처 영역 안에는
 * 입력값을 반영한 순수 텍스트(span)만 놓습니다.
 */
const BADGES = [
  { icon: '🎗️', label: '1929 나주역' },
  { icon: '🍐', label: '나주배' },
  { icon: '🏺', label: '복암리 고분' },
  { icon: '⛵', label: '영산포' },
  { icon: '🏯', label: '나주읍성' },
  { icon: '🔥', label: '정렬사 의병' },
]

export function Certificate() {
  const open = useGameStore((s) => s.certificate)
  const close = useGameStore((s) => s.closeCertificate)
  const [name, setName] = useState('')
  const [saving, setSaving] = useState(false)
  const certRef = useRef<HTMLDivElement>(null)

  if (!open) return null

  const today = new Date()
  const dateLabel = `${today.getFullYear()}년 ${today.getMonth() + 1}월 ${today.getDate()}일`
  const displayName = name.trim() || '＿＿＿＿＿＿＿＿'

  async function handleSave() {
    if (!certRef.current || saving) return
    setSaving(true)
    try {
      const { default: html2canvas } = await import('html2canvas')
      const canvas = await html2canvas(certRef.current, {
        backgroundColor: '#fdfbf7',
        scale: 2,
        useCORS: true,
      })
      const link = document.createElement('a')
      link.download = '나주_로컬_익스플로러_수료증.png'
      link.href = canvas.toDataURL('image/png')
      link.click()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div style={overlay}>
      <div style={wrap}>
        <button onClick={close} style={closeBtn} aria-label="닫기">
          ✕
        </button>

        <div ref={certRef} style={certOuter}>
          <div style={certDancheongBand}>
            <div style={certBody}>
              <p style={docNo}>제 2026-NAJU-01호</p>

              <h1 style={titleStyle}>나주 로컬 익스플로러 수료증</h1>
              <p style={subtitleStyle}>NAJU LOCAL EXPLORER CERTIFICATE</p>

              <div style={dividerRow}>
                <span style={dividerLine} />
                <span style={dividerDiamond} />
                <span style={dividerLine} />
              </div>

              <div style={nameRow}>
                <span style={nameLabel}>성 명</span>
                <span style={nameValue}>{displayName}</span>
              </div>

              <p style={bodyText}>
                위 어린이는 나주의 역사, 문화, 생태, 산업 명소를 탐험하는 '나주 로컬
                익스플로러'의 모든 퀘스트를 훌륭하게 완수하여, 고장의 과거와 현재,
                미래를 아우르는 멋진 로컬 탐험가로 인정받았기에 이 수료증을
                수여합니다.
              </p>

              <div style={badgeRow}>
                {BADGES.map((b) => (
                  <div key={b.label} style={badge}>
                    <div style={badgeIcon}>{b.icon}</div>
                    <span style={badgeLabel}>{b.label}</span>
                  </div>
                ))}
              </div>

              <div style={footerRow}>
                <div>
                  <p style={footerLine}>발급일자 : {dateLabel}</p>
                  <p style={footerLine}>발급처 : 나주 로컬 익스플로러 탐험본부</p>
                </div>
                <div style={sealOuter}>
                  <div style={sealInner}>
                    <span style={sealLine}>나주로컬</span>
                    <span style={sealLine}>탐험본부</span>
                    <span style={{ ...sealLine, fontSize: 11 }}>認證</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div style={nameInputRow}>
          <label style={nameInputLabel}>
            이름을 입력하면 수료증에 반영됩니다
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="이름을 입력하세요"
              maxLength={12}
              style={nameInput}
            />
          </label>
        </div>

        <div style={actions}>
          <button onClick={close} style={ghostBtn}>
            더 둘러보기
          </button>
          <button onClick={handleSave} disabled={saving} style={primaryBtn}>
            {saving ? '이미지 만드는 중...' : '수료증 이미지(PNG)로 저장하기'}
          </button>
        </div>
      </div>
    </div>
  )
}

const overlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(8,16,22,.8)',
  backdropFilter: 'blur(4px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  pointerEvents: 'auto',
  zIndex: 50,
  overflowY: 'auto',
}

const wrap: React.CSSProperties = {
  position: 'relative',
  width: 'min(880px, 94vw)',
  display: 'flex',
  flexDirection: 'column',
  gap: 14,
}

const closeBtn: React.CSSProperties = {
  position: 'absolute',
  top: -14,
  right: -14,
  width: 34,
  height: 34,
  borderRadius: '50%',
  border: '1px solid rgba(255,255,255,.4)',
  background: 'rgba(16,34,46,.85)',
  color: '#fdf8ee',
  fontSize: 15,
  cursor: 'pointer',
  zIndex: 1,
}

// 금빛 테두리 — 가장 바깥
const certOuter: React.CSSProperties = {
  padding: 9,
  borderRadius: 14,
  background: 'linear-gradient(135deg, #caa049 0%, #f2e0a8 45%, #b8873a 100%)',
  boxShadow: '0 24px 70px rgba(0,0,0,.55)',
}

// 금빛-단청 융합 띠 — 전통 오방색 스트라이프를 가늘게
const certDancheongBand: React.CSSProperties = {
  padding: 6,
  borderRadius: 9,
  background:
    'repeating-linear-gradient(135deg, #8c2f2f 0 6px, #c9a24b 6px 12px, #2f4f8c 12px 18px, #c9a24b 18px 24px, #2f6b4f 24px 30px, #c9a24b 30px 36px)',
}

// 한지 질감 본문
const certBody: React.CSSProperties = {
  position: 'relative',
  borderRadius: 5,
  padding: 'clamp(24px, 4vw, 46px) clamp(24px, 5.5vw, 60px)',
  background:
    'radial-gradient(circle at 18% 24%, rgba(120,95,50,.045) 0, transparent 42%), ' +
    'radial-gradient(circle at 82% 66%, rgba(120,95,50,.04) 0, transparent 46%), ' +
    'radial-gradient(circle at 50% 92%, rgba(120,95,50,.03) 0, transparent 40%), ' +
    '#fdfbf7',
  color: '#3b2a1a',
  fontFamily: "'Nanum Myeongjo', 'Batang', 'Noto Serif KR', serif",
}

const docNo: React.CSSProperties = {
  position: 'absolute',
  top: 'clamp(14px, 2.4vw, 22px)',
  right: 'clamp(20px, 4.5vw, 40px)',
  margin: 0,
  fontSize: 12.5,
  letterSpacing: '.03em',
  color: '#a1743a',
  fontWeight: 600,
}

const titleStyle: React.CSSProperties = {
  margin: '10px 0 0',
  textAlign: 'center',
  fontSize: 'clamp(24px, 4.4vw, 36px)',
  fontWeight: 800,
  letterSpacing: '.02em',
  wordBreak: 'keep-all',
  color: '#2c2013',
}

const subtitleStyle: React.CSSProperties = {
  margin: '6px 0 0',
  textAlign: 'center',
  fontSize: 11,
  letterSpacing: '.28em',
  fontWeight: 600,
  color: '#a1743a',
}

const dividerRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 10,
  margin: '18px auto 0',
  width: 'min(320px, 70%)',
}

const dividerLine: React.CSSProperties = {
  flex: 1,
  height: 1,
  background: 'linear-gradient(90deg, transparent, #c9a24b, transparent)',
}

const dividerDiamond: React.CSSProperties = {
  width: 7,
  height: 7,
  background: '#c9a24b',
  transform: 'rotate(45deg)',
  flexShrink: 0,
}

const nameRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'baseline',
  justifyContent: 'center',
  gap: 14,
  marginTop: 22,
}

const nameLabel: React.CSSProperties = {
  fontSize: 15,
  fontWeight: 700,
  letterSpacing: '.15em',
  color: '#5c4634',
}

const nameValue: React.CSSProperties = {
  fontSize: 'clamp(19px, 3vw, 24px)',
  fontWeight: 800,
  padding: '0 6px 4px',
  borderBottom: '2px solid #c9a24b',
  minWidth: 160,
  textAlign: 'center',
  wordBreak: 'keep-all',
}

const bodyText: React.CSSProperties = {
  margin: '24px auto 0',
  maxWidth: 640,
  fontSize: 'clamp(13.5px, 1.6vw, 15.5px)',
  lineHeight: 1.9,
  textAlign: 'center',
  wordBreak: 'keep-all',
  color: '#3b2a1a',
}

const badgeRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  flexWrap: 'wrap',
  gap: 'clamp(10px, 2.2vw, 22px)',
  marginTop: 26,
}

const badge: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 5,
  width: 74,
}

const badgeIcon: React.CSSProperties = {
  width: 46,
  height: 46,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: 20,
  background: 'radial-gradient(circle at 32% 28%, #fff4d6, #e9c877 65%, #c9a24b 100%)',
  border: '1.5px solid #b8873a',
  boxShadow: '0 3px 8px rgba(120,90,40,.28)',
}

const badgeLabel: React.CSSProperties = {
  fontSize: 10.5,
  fontWeight: 700,
  textAlign: 'center',
  color: '#5c4634',
  wordBreak: 'keep-all',
  lineHeight: 1.3,
}

const footerRow: React.CSSProperties = {
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'space-between',
  marginTop: 34,
  paddingTop: 16,
  borderTop: '1px solid rgba(161,116,58,.3)',
}

const footerLine: React.CSSProperties = {
  margin: '2px 0',
  fontSize: 12.5,
  color: '#5c4634',
  fontWeight: 600,
}

const sealOuter: React.CSSProperties = {
  width: 84,
  height: 84,
  borderRadius: '50%',
  border: '3px solid #b5342f',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transform: 'rotate(-9deg)',
  opacity: 0.86,
  mixBlendMode: 'multiply',
  flexShrink: 0,
}

const sealInner: React.CSSProperties = {
  width: 70,
  height: 70,
  borderRadius: '50%',
  border: '1px solid #b5342f',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 1,
}

const sealLine: React.CSSProperties = {
  fontSize: 12,
  fontWeight: 800,
  color: '#b5342f',
  lineHeight: 1.15,
}

const nameInputRow: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
}

const nameInputLabel: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 6,
  fontSize: 12.5,
  color: '#dfe9ee',
  opacity: 0.85,
}

const nameInput: React.CSSProperties = {
  width: 220,
  padding: '9px 12px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,.35)',
  background: 'rgba(255,255,255,.92)',
  color: '#2c2013',
  fontSize: 14,
  fontFamily: 'inherit',
  textAlign: 'center',
}

const actions: React.CSSProperties = {
  display: 'flex',
  gap: 10,
}

const primaryBtn: React.CSSProperties = {
  flex: 1,
  padding: '14px 18px',
  borderRadius: 13,
  border: 'none',
  background: '#33291d',
  color: '#fdf8ee',
  fontSize: 15,
  fontWeight: 700,
  fontFamily: 'inherit',
  cursor: 'pointer',
}

const ghostBtn: React.CSSProperties = {
  padding: '14px 18px',
  borderRadius: 13,
  border: '1px solid rgba(255,255,255,.35)',
  background: 'transparent',
  color: '#fdf8ee',
  fontSize: 14,
  fontFamily: 'inherit',
  cursor: 'pointer',
}
