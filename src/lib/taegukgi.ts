import { LinearFilter, SRGBColorSpace, TextureLoader, type Texture } from 'three'
import taegukgiUrl from '@/assets/taegukgi.png'

/**
 * 태극기 텍스처.
 *
 * `src/assets/taegukgi.png`를 불러옵니다. 한때는 런타임 캔버스로 직접
 * 그렸는데(4괘 회전·태극 색 배치에서 버그가 반복돼), 실제 국기 이미지를
 * 그대로 쓰는 쪽이 더 정직합니다. 규격(3:2, 태극 지름 = 세로의 1/2,
 * 건 좌상·리 좌하·감 우상·곤 우하)은 이 PNG 자체에 이미 반영되어 있습니다.
 *
 * `public/`이 아니라 `src/`에서 import 하는 이유: 아티팩트 빌드
 * (`vite.config.artifact.ts`)는 `assetsInlineLimit`을 키워 소스에서 import한
 * 에셋만 HTML에 인라인합니다. `public/`은 항상 별도 파일로 복사되어
 * 외부 요청이 막힌 아티팩트 환경에서 국기가 안 뜨게 됩니다.
 */

let cached: Texture | null = null

export function taegukgiTexture(): Texture {
  if (cached) return cached

  const tex = new TextureLoader().load(taegukgiUrl)
  tex.colorSpace = SRGBColorSpace
  tex.minFilter = LinearFilter
  tex.magFilter = LinearFilter
  tex.anisotropy = 4
  cached = tex
  return tex
}
