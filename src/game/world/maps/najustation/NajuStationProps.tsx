import { Html, Instance, Instances } from '@react-three/drei'
import { PALETTE } from '@/lib/palette'
import { LAYOUT, GINKGOES } from './layout'

/**
 * 나주역 조형물 — 1929년 나주역 사건 재현.
 *
 * 슬픈 역사를 다루는 자리라 화려하게 꾸미지 않습니다. 세피아빛 벽돌,
 * 차콜 톤 지붕, 톤 다운된 금색·붉은색만 포인트로 씁니다.
 * → layout.ts 상단 고증 메모.
 */

/** 옛 나주역 역사(驛舍) — 근대 서양식 벽돌 역 건물 */
export function StationBuilding() {
  const s = LAYOUT.station
  return (
    <group position={[s.x, 0, s.z]}>
      {/* 벽돌 몸체 */}
      <mesh position={[0, s.h * 0.5, 0]} castShadow receiveShadow>
        <boxGeometry args={[s.w, s.h, s.d]} />
        <meshLambertMaterial color={PALETTE.stationBrickOld} flatShading />
      </mesh>
      {/* 하단 걸레받이 */}
      <mesh position={[0, 0.4, 0]}>
        <boxGeometry args={[s.w + 0.2, 0.8, s.d + 0.2]} />
        <meshLambertMaterial color={PALETTE.stationCharcoal} flatShading />
      </mesh>
      {/* 박공지붕 */}
      {[-1, 1].map((side) => (
        <mesh
          key={side}
          position={[0, s.h + 0.7, (side * s.d) / 4]}
          rotation={[(side * -Math.PI) / 7, 0, 0]}
          castShadow
        >
          <boxGeometry args={[s.w + 1.2, 0.3, s.d / 2 + 1]} />
          <meshLambertMaterial color={PALETTE.stationCharcoal} flatShading />
        </mesh>
      ))}
      {/* 창 — 남/북 양면 */}
      {[1, -1].map((side) => (
        <Instances key={side} limit={8} position={[0, 0, (side * s.d) / 2 + side * 0.08]}>
          <boxGeometry args={[1.8, 2.4, 0.1]} />
          <meshLambertMaterial color={PALETTE.windowGlass} flatShading />
          {[-10, -6, -2, 2, 6, 10].map((x) => (
            <Instance key={x} position={[x, s.h * 0.5, 0]} />
          ))}
        </Instances>
      ))}
      {/* 남쪽 정면 — 아치형 출입구 + 처마 캐노피 */}
      <mesh position={[0, 2.2, s.d / 2 + 0.06]}>
        <boxGeometry args={[4, 4.4, 0.12]} />
        <meshLambertMaterial color={PALETTE.stationCharcoal} flatShading />
      </mesh>
      <mesh position={[0, s.h + 1.1, s.d / 2 + 1.7]} castShadow>
        <boxGeometry args={[7, 0.3, 3.4]} />
        <meshLambertMaterial color={PALETTE.stationCharcoal} flatShading />
      </mesh>
      {/* 역명판 — "나주역" 현판. 톤 다운된 금색 글씨 */}
      <Html position={[0, s.h + 1.9, s.d / 2 + 0.1]} center distanceFactor={30} zIndexRange={[10, 0]}>
        <div
          style={{
            background: PALETTE.stationCharcoal,
            color: PALETTE.mutedGold,
            padding: '5px 18px',
            borderRadius: 2,
            fontSize: 22,
            fontWeight: 700,
            letterSpacing: '.1em',
            whiteSpace: 'nowrap',
            border: `2px solid ${PALETTE.mutedGold}`,
          }}
        >
          羅州驛 나주역
        </div>
      </Html>
    </group>
  )
}

/** 승강장 — 자갈 노반 + 침목 + 레일, 승강장 데크 */
export function Platform() {
  const p = LAYOUT.platform
  const r = LAYOUT.railway
  const length = r.xTo - r.xFrom
  const tieGap = 2.2
  const tieCount = Math.round(length / tieGap)

  return (
    <group>
      <group position={[0, 0, r.z]}>
        <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[length, r.width]} />
          <meshLambertMaterial color={PALETTE.ballast} flatShading />
        </mesh>
        <Instances limit={tieCount + 1} position={[0, 0.09, 0]}>
          <boxGeometry args={[1.2, 0.12, r.width - 1]} />
          <meshLambertMaterial color={PALETTE.trunk} flatShading />
          {Array.from({ length: tieCount }, (_, i) => (
            <Instance key={i} position={[r.xFrom + i * tieGap, 0, 0]} />
          ))}
        </Instances>
        {[-r.width / 2 + 1, r.width / 2 - 1].map((dz) => (
          <mesh key={dz} position={[0, 0.16, dz]}>
            <boxGeometry args={[length, 0.12, 0.14]} />
            <meshLambertMaterial color={PALETTE.rail} flatShading />
          </mesh>
        ))}
      </group>
      {/* 승강장 데크 */}
      <mesh position={[p.x, 0.15, p.z]} receiveShadow castShadow>
        <boxGeometry args={[p.w, 0.3, p.d]} />
        <meshLambertMaterial color={PALETTE.platform} flatShading />
      </mesh>
      {/* 철로 쪽 가장자리 안전선 */}
      <mesh position={[p.x, 0.31, p.z - p.d / 2 + 0.4]}>
        <boxGeometry args={[p.w, 0.02, 0.3]} />
        <meshLambertMaterial color={PALETTE.mutedGold} flatShading />
      </mesh>
    </group>
  )
}

/** 1920년대 통학열차 — 승강장 뒤에 정차한 증기기관차풍 열차 */
export function PeriodTrain() {
  const r = LAYOUT.railway
  const carLen = 6
  const cars = [0, -(carLen + 0.4), -2 * (carLen + 0.4)]
  return (
    <group position={[-6, 0.62, r.z - r.width / 2 - 1.6]}>
      {cars.map((dx) => (
        <group key={dx} position={[dx, 0, 0]}>
          <mesh castShadow receiveShadow>
            <boxGeometry args={[carLen, 1.8, 2.4]} />
            <meshLambertMaterial color={PALETTE.retroTrainBody} flatShading />
          </mesh>
          <mesh position={[0, 0.15, 0]} castShadow>
            <boxGeometry args={[carLen + 0.1, 0.25, 2.6]} />
            <meshLambertMaterial color={PALETTE.stationCharcoal} flatShading />
          </mesh>
          {/* 창 띠 — 톤 다운된 금색 라인 */}
          <mesh position={[0, 0.35, 1.21]}>
            <boxGeometry args={[carLen - 0.4, 0.1, 0.02]} />
            <meshLambertMaterial color={PALETTE.retroTrainTrim} flatShading />
          </mesh>
          {[-1.14, 1.14].map((dz) => (
            <Instances key={dz} limit={4} position={[0, 0.35, dz]}>
              <boxGeometry args={[0.7, 0.55, 0.06]} />
              <meshLambertMaterial color={PALETTE.windowGlass} flatShading />
              {[-1.8, -0.6, 0.6, 1.8].map((wx) => (
                <Instance key={wx} position={[wx, 0, 0]} />
              ))}
            </Instances>
          ))}
        </group>
      ))}
    </group>
  )
}

/** 기념비 — 학생독립운동을 기리는 검박한 화강암 비. 화려한 장식 없이 */
export function Memorial() {
  const m = LAYOUT.memorial
  return (
    <group position={[m.x, 0, m.z]}>
      <mesh position={[0, 0.3, 0]} receiveShadow castShadow>
        <boxGeometry args={[m.w + 1, 0.6, m.d + 1]} />
        <meshLambertMaterial color={PALETTE.stationSepiaDark} flatShading />
      </mesh>
      <mesh position={[0, m.h / 2 + 0.6, 0]} castShadow>
        <boxGeometry args={[1.6, m.h, 0.9]} />
        <meshLambertMaterial color="#5a564c" flatShading />
      </mesh>
      {/* 비문 — 톤 다운된 금색 글씨 */}
      <Html position={[0, m.h * 0.55 + 0.6, 0.5]} center distanceFactor={34} zIndexRange={[10, 0]}>
        <div
          style={{
            color: PALETTE.mutedGold,
            fontSize: 15,
            fontWeight: 700,
            textAlign: 'center',
            lineHeight: 1.6,
            whiteSpace: 'pre-line',
            textShadow: '0 1px 3px rgba(0,0,0,.6)',
            pointerEvents: 'none',
          }}
        >
          {'학생독립운동\n기념비'}
        </div>
      </Html>
    </group>
  )
}

/** 은행나무 — 근대 관공서·역 앞에 흔한 가로수 */
export function Ginkgoes() {
  return (
    <Instances limit={GINKGOES.length}>
      <coneGeometry args={[1.5, 3.6, 8]} />
      <meshLambertMaterial color="#8a8654" flatShading />
      {GINKGOES.map(([x, z, s], i) => (
        <Instance key={i} position={[x, 1.8 * s, z]} scale={s} />
      ))}
    </Instances>
  )
}

/** 연표 카드 — 대합실 앞에 세운 안내판. 안내판(SignPost)과 형태는 같지만
 *  세피아 톤으로 다시 칠했습니다 */
export function TimelineCard({ rotY = 0 }: { rotY?: number }) {
  return (
    <group rotation={[0, rotY, 0]}>
      {[-0.7, 0.7].map((px) => (
        <mesh key={px} position={[px, 0.7, 0]} castShadow>
          <boxGeometry args={[0.12, 1.4, 0.12]} />
          <meshLambertMaterial color={PALETTE.stationCharcoal} flatShading />
        </mesh>
      ))}
      <mesh position={[0, 1.5, 0]} rotation={[-0.32, 0, 0]} castShadow>
        <boxGeometry args={[1.9, 1.15, 0.09]} />
        <meshLambertMaterial color={PALETTE.mutedRed} flatShading />
      </mesh>
      <mesh position={[0, 1.5, 0.055]} rotation={[-0.32, 0, 0]}>
        <boxGeometry args={[1.7, 0.95, 0.02]} />
        <meshLambertMaterial color={PALETTE.stationSepia} flatShading />
      </mesh>
    </group>
  )
}

/** 만세비 — 세 번 다가가 만세를 외치는 자리 */
export function ManseiPost() {
  return (
    <group>
      <mesh position={[0, 0.9, 0]} castShadow>
        <cylinderGeometry args={[0.3, 0.36, 1.8, 8]} />
        <meshLambertMaterial color={PALETTE.stationSepiaDark} flatShading />
      </mesh>
      <mesh position={[0, 1.95, 0]}>
        <boxGeometry args={[0.9, 0.3, 0.06]} />
        <meshLambertMaterial color={PALETTE.mutedRed} flatShading />
      </mesh>
    </group>
  )
}

/** 방명록 — 나무 받침대 위 노트 */
export function GuestbookStand() {
  return (
    <group>
      <mesh position={[0, 0.55, 0]} rotation={[-0.25, 0, 0]} castShadow>
        <boxGeometry args={[1.1, 0.08, 0.8]} />
        <meshLambertMaterial color={PALETTE.trunk} flatShading />
      </mesh>
      <mesh position={[0, 0.62, 0.05]} rotation={[-0.25, 0, 0]}>
        <boxGeometry args={[0.9, 0.03, 0.6]} />
        <meshLambertMaterial color={PALETTE.stationSepia} flatShading />
      </mesh>
      {[-0.35, 0.35].map((x) => (
        <mesh key={x} position={[x, 0.28, -0.3]} castShadow>
          <boxGeometry args={[0.08, 0.56, 0.08]} />
          <meshLambertMaterial color={PALETTE.trunk} flatShading />
        </mesh>
      ))}
    </group>
  )
}
