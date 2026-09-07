/**
 * dist-artifact 를 단일 HTML 파일로 합칩니다.
 *
 * 아티팩트는 <!doctype>/<html>/<head>/<body> 를 배포 시점에 감싸주므로
 * 여기서는 페이지 내용만 씁니다. 외부 호스트 요청이 CSP로 전부 막히기
 * 때문에 JS도 링크가 아니라 인라인이어야 합니다.
 */
import { readFile, writeFile, mkdir, readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const assetsDir = join(root, 'dist-artifact/assets')

const files = await readdir(assetsDir)
const jsFile = files.find((f) => f.endsWith('.js'))
if (!jsFile) throw new Error('dist-artifact/assets 에서 JS 번들을 찾지 못했습니다.')

const js = await readFile(join(assetsDir, jsFile), 'utf8')
// 번들 안의 문자열 리터럴에 </script 가 들어 있으면 태그가 조기에 닫힙니다
const safeJs = js.replaceAll('</script', '<\\/script')

const html = `<title>나주 문화유산 퀘스트 — 다시초등학교와 복암리</title>

<style>
  /* 오전 10시의 운동장에는 다크모드가 없습니다. 단일 테마는 의도된 선택입니다. */
  html, body { margin: 0; padding: 0; height: 100%; overflow: hidden; background: #0d1512; }
  #root { position: relative; width: 100%; height: 100dvh; overflow: hidden; }
  * { -webkit-tap-highlight-color: transparent; }

  #boot {
    position: absolute; inset: 0; z-index: 50;
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 26px;
    background: linear-gradient(180deg, #cfe6f0 0%, #eaf6fb 62%, #93ab72 62%, #7cc46b 100%);
    font-family: system-ui, -apple-system, 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif;
    transition: opacity .5s ease;
  }
  #boot.gone { opacity: 0; pointer-events: none; }

  /* 이 학교를 알아보게 하는 형태 — 분홍 벽돌 원형 탑 위의 은색 돔 */
  .tower { position: relative; width: 92px; height: 116px; }
  .tower .dome {
    position: absolute; top: 0; left: -8px; width: 108px; height: 54px;
    border-radius: 108px 108px 0 0;
    background: linear-gradient(160deg, #dfe4e8, #b4bcc4);
  }
  .tower .shaft {
    position: absolute; top: 50px; left: 0; width: 92px; height: 66px;
    background: linear-gradient(100deg, #e3ada2 62%, #cf988c);
  }
  .tower .band {
    position: absolute; left: -3px; width: 98px; height: 7px; background: #f2efe8;
  }
  .tower .band.a { top: 68px; } .tower .band.b { top: 92px; }
  .tower .mast {
    position: absolute; top: -22px; left: 45px; width: 3px; height: 24px; background: #b4bcc4;
  }

  .boot-title {
    margin: 0; font-size: 25px; font-weight: 700; letter-spacing: -.01em; color: #2f4a41;
    text-align: center;
  }
  .boot-sub {
    margin: 0; font-size: 13px; color: #4a6b5e; letter-spacing: .04em; text-align: center;
  }
  .bar { width: 172px; height: 4px; border-radius: 3px; background: rgba(47,74,65,.18); overflow: hidden; }
  .bar i { display: block; width: 40%; height: 100%; border-radius: 3px; background: #2f4a41;
           animation: slide 1.15s ease-in-out infinite; }
  @keyframes slide { 0% { transform: translateX(-105%); } 100% { transform: translateX(255%); } }
  @media (prefers-reduced-motion: reduce) {
    .bar i { animation: none; width: 100%; opacity: .5; }
    #boot { transition: none; }
  }
</style>

<div id="root">
  <div id="boot">
    <div class="tower">
      <div class="mast"></div>
      <div class="dome"></div>
      <div class="shaft"></div>
      <div class="band a"></div>
      <div class="band b"></div>
    </div>
    <div style="display:flex;flex-direction:column;align-items:center;gap:7px">
      <p class="boot-title">나주 문화유산 퀘스트</p>
      <p class="boot-sub">다시초등학교에서 복암리 고분군까지 · 전남 나주시 다시면</p>
    </div>
    <div class="bar"><i></i></div>
  </div>
</div>

<script type="module">
${safeJs}
</script>
`

await mkdir(join(root, 'artifact'), { recursive: true })
const out = join(root, 'artifact/dasi-school.html')
await writeFile(out, html)
console.log(`${out}  ${(Buffer.byteLength(html) / 1024 / 1024).toFixed(2)} MB`)
