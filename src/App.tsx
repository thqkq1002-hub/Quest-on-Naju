import { Canvas } from '@react-three/fiber'
import { Suspense, useEffect, useState } from 'react'
import { attachKeyboard } from '@/lib/input'
import { MAPS } from '@/game/world/registry'
import { useMapStore } from '@/store/mapStore'
import { CameraButtons, LookPad } from '@/ui/CameraControls'
import { DialogueBox } from '@/ui/DialogueBox'
import { Hud } from '@/ui/Hud'
import { Joystick } from '@/ui/Joystick'
import { SailOverlay, WorldMap, WorldMapButton } from '@/ui/WorldMap'
import { StratigraphyPuzzle } from '@/ui/StratigraphyPuzzle'
import { RelicDigGame } from '@/ui/RelicDigGame'
import { HongeoComboGame } from '@/ui/HongeoComboGame'
import { WallStonePuzzle } from '@/ui/WallStonePuzzle'
import { PineNoteRhythmGame } from '@/ui/PineNoteRhythmGame'
import { BgmToggle } from '@/ui/BgmToggle'
import { UibyeongTorchGame } from '@/ui/UibyeongTorchGame'
import { PearCatchGame } from '@/ui/PearCatchGame'
import { QuizPuzzle } from '@/ui/QuizPuzzle'
import { MemorialGuestbook } from '@/ui/MemorialGuestbook'
import { Certificate } from '@/ui/Certificate'
import { InventoryButton, InventoryModal } from '@/ui/InventoryModal'
import { Ending, EndingWatcher } from '@/ui/Ending'
import { resetCamera } from '@/game/player/camera'

/**
 * P1 · 수직 슬라이스 — 다시초등학교에서 복암리 고분군까지.
 *
 * 씬은 레지스트리에서 옵니다. App 은 어느 맵이 있는지 모릅니다 —
 * 맵을 추가할 때 이 파일을 고치게 되면 그건 구조가 잘못된 것입니다.
 * → docs/06-NAJU-WORLD-MAP.md 5절
 */
export default function App() {
  useEffect(attachKeyboard, [])

  const mapId = useMapStore((s) => s.current)
  const Scene = MAPS[mapId].scene

  // 맵이 바뀌면 카메라를 정면으로 돌려놓습니다. 이전 맵에서 옆을 보던
  // 각도 그대로 도착하면 어디에 떨어졌는지 알 수 없습니다.
  useEffect(() => {
    resetCamera()
  }, [mapId])

  // 부팅 화면 걷어내기. 마운트 직후가 아니라 첫 프레임이 그려진 뒤에
  // 없앱니다 — 마운트 시점엔 WebGL이 아직 아무것도 안 그려서, 먼저 지우면
  // 검은 화면이 한 박자 스칩니다.
  useEffect(() => {
    let raf = 0
    raf = requestAnimationFrame(() =>
      requestAnimationFrame(() => {
        const boot = document.getElementById('boot')
        if (!boot) return
        boot.classList.add('gone')
        setTimeout(() => boot.remove(), 600)
      }),
    )
    return () => cancelAnimationFrame(raf)
  }, [])

  // 저사양 모드. 이미지 1의 나주 메타버스에도 "저전력 모드"가 있었습니다 —
  // 학교 태블릿을 상대하려면 없어서는 안 되는 스위치입니다.
  const [lowPower, setLowPower] = useState(false)

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
      <Canvas
        shadows={!lowPower}
        // 레티나에서 픽셀을 4배로 그리면 모바일이 바로 무릎을 꿇습니다.
        // 상한을 두는 것만으로 대부분의 프레임 문제가 사라집니다.
        dpr={lowPower ? 1 : [1, 1.75]}
        camera={{ fov: 52, near: 0.5, far: 700, position: [0, 13.5, 39] }}
        gl={{ antialias: !lowPower, powerPreference: 'high-performance' }}
      >
        {/* key 를 맵마다 다르게 줘서, 맵을 갈아 끼울 때 이전 씬의
            GPU 리소스가 확실히 정리되게 합니다 */}
        <Suspense fallback={null}>
          <Scene key={mapId} shadows={!lowPower} />
        </Suspense>
      </Canvas>

      {/* UI 오버레이 — 전부 DOM입니다 */}
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {/* 화면 빈 곳 드래그 = 카메라 회전. 다른 UI보다 먼저 그려서
            버튼들이 항상 위에 오게 합니다 */}
        <LookPad />
        <Hud />
        <WorldMapButton />
        <InventoryButton />
        <CameraButtons />
        <div style={{ pointerEvents: 'auto' }}>
          <Joystick />
        </div>
        <button onClick={() => setLowPower((v) => !v)} style={lowPowerBtn}>
          {lowPower ? '⚡ 저사양 모드 켜짐' : '⚡ 저사양 모드'}
        </button>
        <DialogueBox />
        <WorldMap />
        <StratigraphyPuzzle />
        <RelicDigGame />
        <HongeoComboGame />
        <WallStonePuzzle />
        <PineNoteRhythmGame />
        <UibyeongTorchGame />
        <BgmToggle />
        <PearCatchGame />
        <QuizPuzzle />
        <MemorialGuestbook />
        <Certificate />
        <InventoryModal />
        <EndingWatcher />
        <Ending />
        <SailOverlay />
      </div>
    </div>
  )
}

const lowPowerBtn: React.CSSProperties = {
  // 화면 위쪽 가운데는 목적지 라벨 자리라 좌하단으로 비켜 둡니다
  position: 'absolute',
  // 조이스틱 오른쪽 옆. 세로가 짧은 가로모드 폰에서도 HUD와 겹치지 않습니다
  left: 'calc(max(24px, env(safe-area-inset-left)) + 148px)',
  bottom: 'max(40px, calc(env(safe-area-inset-bottom) + 12px))',
  padding: '7px 14px',
  borderRadius: 999,
  border: '1px solid rgba(255,255,255,.35)',
  background: 'rgba(16,34,46,.6)',
  color: '#eaf4f8',
  fontSize: 12,
  fontFamily: 'inherit',
  cursor: 'pointer',
  pointerEvents: 'auto',
}
