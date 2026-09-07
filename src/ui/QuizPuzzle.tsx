import { useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { ITEM_NAMES } from '@/game/quest/data'

/**
 * 안내판 퀴즈 — 빛가람동·문평면 거점들이 전부 같은 모양의 객관식 문제라,
 * PearQuizPuzzle처럼 퀴즈마다 파일을 만드는 대신 데이터 하나로 묶었습니다.
 * 새 거점이 늘어나면 아래 QUIZZES에 한 줄만 추가하면 됩니다 — 컴포넌트는
 * 고칠 일이 없습니다.
 *
 * `theme`으로 지역 미술 방향에 맞춥니다 — 빛가람동은 유리·네온의 teal,
 * 문평면은 고재·단청의 amber. 다시면(PearQuizPuzzle)과 같은 계열의 amber를
 * 쓰되 별도 파일로 남겨 둔 건, 그쪽은 문항이 하나뿐이라 데이터화할 이유가
 * 없었기 때문입니다.
 */
type QuizTheme = 'teal' | 'amber' | 'sepia' | 'river'

interface Quiz {
  puzzleId: string
  eyebrow: string
  icon: string
  question: string
  options: string[]
  answer: number
  rewardItem: string
  rewardLine: string
  wrongHint: string
  theme?: QuizTheme
  /**
   * 이 퍼즐 하나가 곧 퀘스트 보상이면 true(기본값) — "[아이템] 획득!" 화면을
   * 보여줍니다. 한 퀘스트 안에 퍼즐이 여러 개(예: 연표 카드 세 장)라면,
   * 마지막 한 장만 남기고 나머지는 false로 둡니다 — 실제로는 NPC에게
   * 퀘스트를 다 마치고 보고해야 아이템이 들어오는데, 카드 한 장 풀 때마다
   * "획득!"이라고 하면 거짓말이 됩니다.
   */
  showReward?: boolean
}

const THEMES: Record<
  QuizTheme,
  {
    border: string
    bg: string
    text: string
    eyebrow: string
    optionBorder: string
    optionBg: string
    wrongBg: string
    wrongBorder: string
    wrongText: string
    reward: string
    ghostBorder: string
    ghostText: string
  }
> = {
  teal: {
    border: '#4fd8c4',
    bg: '#0f2530',
    text: '#eaf9f6',
    eyebrow: '#5fd8c4',
    optionBorder: '#235a5a',
    optionBg: '#123540',
    wrongBg: '#3a1f22',
    wrongBorder: '#c1584c',
    wrongText: '#f5c9c3',
    reward: '#8fe0d0',
    ghostBorder: '#235a5a',
    ghostText: '#8fc9c0',
  },
  amber: {
    border: '#c9a227',
    bg: '#2a2118',
    text: '#f5ecd8',
    eyebrow: '#e0b84a',
    optionBorder: '#5a4a2e',
    optionBg: '#3a3020',
    wrongBg: '#3a1f22',
    wrongBorder: '#a83a2e',
    wrongText: '#f0b8b0',
    reward: '#d8c48a',
    ghostBorder: '#5a4a2e',
    ghostText: '#c9b892',
  },
  // 나주역 — 빛바랜 사진처럼 채도를 낮춘 세피아·차콜. 슬픈 역사를 다루는
  // 자리라 amber보다 한층 더 가라앉힌 톤입니다
  sepia: {
    border: '#a8843f',
    bg: '#292722',
    text: '#e0d8c4',
    eyebrow: '#a8843f',
    optionBorder: '#4a453c',
    optionBg: '#332f28',
    wrongBg: '#332320',
    wrongBorder: '#8a3f36',
    wrongText: '#e0b0a8',
    reward: '#c4b48a',
    ghostBorder: '#4a453c',
    ghostText: '#a89a72',
  },
  // 영산포 — 영산강 물결을 닮은 청록빛. 근대 거리라는 시대감은 sepia로
  // 이미 나주역에 썼으니, 여기는 "강 나루"라는 장소성을 색으로 살립니다
  river: {
    border: '#4a8fb0',
    bg: '#0f2733',
    text: '#e8f4f8',
    eyebrow: '#6fbcd8',
    optionBorder: '#245065',
    optionBg: '#123846',
    wrongBg: '#3a1f22',
    wrongBorder: '#c1584c',
    wrongText: '#f5c9c3',
    reward: '#8fd0e0',
    ghostBorder: '#245065',
    ghostText: '#7fb8cc',
  },
}

const QUIZZES: readonly Quiz[] = [
  {
    puzzleId: 'puzzle-bitgaram-observatory',
    eyebrow: '전망대 퀴즈 · 빛가람 호수공원',
    icon: '🔭',
    question: '빛가람 호수공원 전망대에 오르면 볼 수 있는 것으로 가장 알맞은 것은?',
    options: ['남해 바다의 파도', '빛가람동 전경과 호수공원', '한라산 백록담'],
    answer: 1,
    rewardItem: 'item-bitgaram-telescope',
    rewardLine: '전망대는 높이 39.6m로, 빛가람동에서 가장 높은 자리에서 동네 전체를 내려다볼 수 있습니다.',
    wrongHint: '전망대는 빛가람동 한가운데, 호수공원 옆에 있어.',
  },
  {
    puzzleId: 'puzzle-bitgaram-kepco',
    eyebrow: '한전 퀴즈 · 한국전력공사',
    icon: '⚡',
    question: '전기를 효율적으로 쓰고 남는 전력을 저장하는 미래형 전력망 시스템의 이름은?',
    options: ['와이파이 파워', '스마트 그리드 (Smart Grid)', '화력 스위치'],
    answer: 1,
    rewardItem: 'item-smart-grid-core',
    rewardLine: '스마트 그리드는 전기를 만드는 곳과 쓰는 곳을 실시간으로 연결해 낭비를 줄이는 똑똑한 전력망입니다.',
    wrongHint: '이름에 힌트가 있어 — "똑똑한 전력망"이라는 뜻이야.',
  },
  {
    puzzleId: 'puzzle-bitgaram-kentech',
    eyebrow: 'KENTECH 퀴즈 · 한국에너지공과대학교',
    icon: '🎓',
    question: 'KENTECH에서 연구하는 친환경 미래 에너지 중, 물(H₂O)을 전기분해하여 만드는 에너지는?',
    options: ['석탄 에너지', '수소 에너지', '석유 에너지'],
    answer: 1,
    rewardItem: 'item-kentech-card',
    rewardLine: '물을 전기분해하면 수소와 산소로 나뉘는데, 이 수소를 태우거나 전기로 바꾸면 물만 남는 깨끗한 에너지가 됩니다.',
    wrongHint: '물(H₂O)의 앞글자, 수소(H)를 떠올려 봐.',
  },
  {
    puzzleId: 'puzzle-bitgaram-kpx',
    eyebrow: '전력거래소 퀴즈 · KPX',
    icon: '📊',
    question: '발전소에서 만든 전기와 우리가 쓰는 전기의 양을 24시간 맞추는 일, 전력거래소가 하는 가장 중요한 일은?',
    options: ['가로등을 켜고 끈다', '실시간으로 전력 수요와 공급을 맞춘다', '전기요금 고지서를 보낸다'],
    answer: 1,
    rewardItem: 'item-kpx-badge',
    rewardLine: '전기는 저장하기 어려워서, 만드는 양과 쓰는 양이 항상 균형을 이뤄야 정전이 생기지 않습니다.',
    wrongHint: '전기는 쌓아 두기 어려운 에너지라는 걸 떠올려 봐.',
  },
  {
    puzzleId: 'puzzle-bitgaram-kocca',
    eyebrow: 'KOCCA 퀴즈 · 한국콘텐츠진흥원',
    icon: '🎬',
    question: '한국콘텐츠진흥원(KOCCA)이 하는 일로 가장 알맞은 것은?',
    options: ['영화·게임·웹툰 같은 K-콘텐츠 산업을 지원한다', '도로를 놓는다', '전기를 생산한다'],
    answer: 0,
    rewardItem: 'item-kocca-pen',
    rewardLine: 'KOCCA는 나주 같은 지역의 역사와 이야기가 게임이나 캐릭터로 만들어지도록 돕는 곳입니다.',
    wrongHint: '이름에 힌트가 있어 — "콘텐츠"를 만드는 사람들을 돕는 곳이야.',
  },
  {
    puzzleId: 'puzzle-bitgaram-smart-life',
    eyebrow: '스마트 라이프 퀴즈 · 탄소중립',
    icon: '🌱',
    question: '탄소중립을 위해 우리가 실천할 수 있는 행동으로 가장 알맞은 것은?',
    options: ['가까운 거리도 자동차를 탄다', '대중교통과 자전거를 이용한다', '물건을 쓰고 바로 버린다'],
    answer: 1,
    rewardItem: 'item-carbon-tumbler',
    rewardLine: '자동차 대신 대중교통·자전거·걷기를 이용하면 이산화탄소 배출을 크게 줄일 수 있습니다.',
    wrongHint: '탄소를 "줄이는" 행동을 골라야 해.',
  },
  {
    puzzleId: 'puzzle-munpyeong-birthplace',
    eyebrow: '생가 퀴즈 · 나대용 장군 생가',
    icon: '🏡',
    question: '나대용 장군은 이순신 장군을 만나 어떤 무기를 개발하는 데 핵심 역할을 했을까요?',
    options: ['거북선(구선) 및 판옥선 개량', '비행기', '증기기관차'],
    answer: 0,
    rewardItem: 'item-na-blueprint',
    rewardLine: '나대용 장군은 이순신 장군과 함께 거북선을 설계·개량하는 데 핵심 역할을 했습니다.',
    wrongHint: '이 시대(조선)에는 아직 없던 물건들을 지워 봐.',
    theme: 'amber',
  },
  {
    puzzleId: 'puzzle-munpyeong-sochungsa',
    eyebrow: '소충사 퀴즈 · 昭忠祠',
    icon: '⛩️',
    question: '나대용 장군이 임진왜란 때 거북선을 이끌고 참가한 첫 해전은 어디일까요?',
    options: ['옥포 해전', '살수대첩', '귀주대첩'],
    answer: 0,
    rewardItem: 'item-incense',
    rewardLine: '소충사는 나대용 장군의 호국충절을 기리기 위해 세운 사당으로, 영정과 위패가 모셔져 있습니다.',
    wrongHint: '살수대첩·귀주대첩은 훨씬 오래전, 고구려·고려 때 일이야.',
    theme: 'amber',
  },
  {
    puzzleId: 'puzzle-munpyeong-shipyard',
    eyebrow: '거북선 퀴즈 · 건조 체험장',
    icon: '🐢',
    question: '거북선 덮개 위에 뾰족한 쇠송곳을 박은 가장 큰 이유는 무엇일까요?',
    options: ['왜군이 배 위로 뛰어오르는 것을 막기 위해', '배를 예쁘게 꾸미기 위해', '낚시를 하기 위해'],
    answer: 0,
    rewardItem: 'item-turtle-ship-model',
    rewardLine: '등딱지 모양 덮개와 쇠송곳 덕분에, 적이 배 위로 뛰어올라 백병전을 벌이기 어려웠습니다.',
    wrongHint: '적이 거북선 갑판 위로 "올라타면" 어떻게 될지 생각해 봐.',
    theme: 'amber',
  },
  {
    puzzleId: 'puzzle-munpyeong-changseon',
    eyebrow: '창선 퀴즈 · 신형 군함 연구소',
    icon: '🛡️',
    question: '나대용 장군이 거북선에 이어 칼을 빽빽하게 꽂아 만든 빠른 돌격선의 이름은?',
    options: ['창선 (槍船)', '거북선', '판옥선'],
    answer: 0,
    rewardItem: 'item-mumin-sword',
    rewardLine: '창선은 거북선보다 좁고 빠른 돌격선으로, 뱃전에 칼을 꽂아 적이 오르지 못하게 했습니다.',
    wrongHint: '거북선·판옥선은 이미 보기로 나온 이름이니 골라도 소용없어.',
    theme: 'amber',
  },
  {
    puzzleId: 'puzzle-najustation-timeline-1',
    eyebrow: '연표 퀴즈 1 · 대합실',
    icon: '🚉',
    question: '광주학생독립운동은 언제 일어난 역사적 사건일까요?',
    options: ['1919년', '1929년', '1945년'],
    answer: 1,
    rewardItem: 'item-1920s-album',
    rewardLine: '1929년, 나주역에서 시작된 다툼이 그해 11월 3일 광주 학생들의 대규모 시위로 번졌습니다.',
    wrongHint: '3.1운동(1919)도, 광복(1945)도 아니야. 그 사이 어느 해란다.',
    theme: 'sepia',
    showReward: false,
  },
  {
    puzzleId: 'puzzle-najustation-timeline-2',
    eyebrow: '연표 퀴즈 2 · 대합실',
    icon: '📜',
    question: '일제강점기, 조선인과 일본인 학생을 차별해서 가르치도록 정한 법의 이름은?',
    options: ['조선교육령', '치안유지법', '국가총동원법'],
    answer: 0,
    rewardItem: 'item-1920s-album',
    rewardLine: '조선교육령에 따라 조선인 학생과 일본인 학생은 다른 학교, 다른 교육을 받았습니다.',
    wrongHint: '"교육"이 들어간 이름을 찾아봐.',
    theme: 'sepia',
    showReward: false,
  },
  {
    puzzleId: 'puzzle-najustation-timeline-3',
    eyebrow: '연표 퀴즈 3 · 대합실',
    icon: '📖',
    question: '광주학생독립운동을 이끈 인물로, 성진회·독서회를 만들어 활동한 사람은?',
    options: ['장재성', '안창호', '이봉창'],
    answer: 0,
    rewardItem: 'item-1920s-album',
    rewardLine: '장재성은 성진회·독서회 같은 비밀 학생 조직을 이끌며, 나주역 사건 이후 학생들의 시위를 이끌었습니다.',
    wrongHint: '안창호·이봉창은 훌륭한 독립운동가지만, 이 사건과는 다른 이야기야.',
    theme: 'sepia',
  },
  {
    puzzleId: 'puzzle-najustation-report',
    eyebrow: '편향 분석 리포트 · 승강장',
    icon: '🔍',
    question: '세 사람의 증언을 들어보니, 이 사건을 조사한 학교·경찰의 태도를 가장 잘 나타내는 말은?',
    options: ['#공정한조사', '#조선인학생에게불리한조사', '#아무일도없었음'],
    answer: 1,
    rewardItem: 'item-testimony-record',
    rewardLine: '먼저 희롱한 건 일본 학생이었지만, 학교와 경찰은 조선인 학생에게 더 불리하게 조사했습니다. 이 불공정함에 항의하며 학생들이 거리로 나섰습니다.',
    wrongHint: '박준채와 박기옥, 후쿠다의 이야기가 서로 같았는지 다시 떠올려 봐.',
    theme: 'sepia',
  },
  {
    puzzleId: 'puzzle-yeongsanpo-gallery',
    eyebrow: '역사갤러리 퀴즈 · 영산포 역사갤러리',
    icon: '🏛️',
    question: '영산포 역사갤러리가 있는 이 건물은 일제강점기에 원래 무엇으로 쓰였을까요?',
    options: ['조선식산은행', '기차역 대합실', '초등학교 체육관'],
    answer: 0,
    rewardItem: 'yeongsanpo-gallery',
    rewardLine: '영산포 역사갤러리는 일제강점기 조선식산은행 건물이었던 곳을 나주시가 매입해 새단장한 공간으로, 영산포 등대·오일장·우시장 등 옛 모습을 담은 흑백사진과 전통 음식·문화 자료를 전시합니다.',
    wrongHint: '건물 창이 작고 촘촘한 게, 은행 금고를 지키던 시절의 흔적이라는 걸 떠올려 봐.',
    theme: 'river',
    showReward: false,
  },
  {
    puzzleId: 'puzzle-yeongsanpo-literature',
    eyebrow: '문학관 퀴즈 · 타오르는 강 문학관',
    icon: '📖',
    question: '영산강의 옛 뱃길과 문순태 소설가의 이야기를 만날 수 있는 이곳의 이름은 무엇일까요?',
    options: ['타오르는 강 문학관', '영산포 이야기관', '나주 향토 박물관'],
    answer: 0,
    rewardItem: 'yeongsanpo-literature',
    rewardLine: '타오르는 강 문학관은 문순태 작가의 소설 「타오르는 강」과 영산강 수운의 역사를 함께 소개하는 곳입니다.',
    wrongHint: '문학관 이름은 소설 제목을 그대로 땄어. 강물이 활활 타오르는 듯한 제목이지.',
    theme: 'river',
    showReward: false,
  },
  {
    puzzleId: 'puzzle-najueupseong-geumseonggwan',
    eyebrow: '금성관 퀴즈 · 나주목 관아',
    icon: '🏛️',
    question: '나주목의 중심으로, 지방 관아 중 가장 크고 임금님을 상징하는 전패에 절을 올리던 객사는?',
    options: ['① 금성관', '② 정수루'],
    answer: 0,
    rewardItem: 'najueupseong-geumseonggwan',
    rewardLine: '금성관은 나주목 관아의 중심 객사로, 지방관이 초하루·보름마다 임금을 상징하는 전패 앞에 절을 올리던 가장 격식 높은 건물입니다.',
    wrongHint: '방금 성문을 지나 만난, 이 읍성에서 가장 크고 위엄 있는 건물을 떠올려 봐.',
    theme: 'amber',
    showReward: false,
  },
]

export function QuizPuzzle() {
  const openId = useGameStore((s) => s.puzzle)
  const close = useGameStore((s) => s.closePuzzle)
  const solve = useGameStore((s) => s.solvePuzzle)

  const [picked, setPicked] = useState<number | null>(null)
  const [wrong, setWrong] = useState(false)
  const [done, setDone] = useState(false)

  const quiz = QUIZZES.find((q) => q.puzzleId === openId)
  if (!quiz) return null
  const t = THEMES[quiz.theme ?? 'teal']

  function choose(idx: number) {
    if (!quiz || done) return
    setPicked(idx)
    if (idx === quiz.answer) {
      setWrong(false)
      setDone(true)
      setTimeout(() => {
        solve(quiz.puzzleId)
        setPicked(null)
        setDone(false)
      }, 1800)
    } else {
      setWrong(true)
    }
  }

  function handleClose() {
    setPicked(null)
    setWrong(false)
    close()
  }

  return (
    <div style={overlay}>
      <div style={{ ...sheet, borderColor: t.border, background: t.bg, color: t.text }}>
        {!done ? (
          <>
            <p style={{ ...eyebrow, color: t.eyebrow }}>{quiz.eyebrow}</p>
            <div style={{ fontSize: 40, margin: '6px 0' }}>{quiz.icon}</div>
            <h2 style={{ margin: 0, fontSize: 18 }}>{quiz.question}</h2>
            <div style={optionList}>
              {quiz.options.map((opt, idx) => (
                <button
                  key={opt}
                  onClick={() => choose(idx)}
                  style={{
                    ...optionBtn,
                    borderColor: t.optionBorder,
                    background: t.optionBg,
                    color: t.text,
                    ...(picked === idx && wrong
                      ? { background: t.wrongBg, borderColor: t.wrongBorder, color: t.wrongText }
                      : null),
                  }}
                >
                  {`①②③`[idx]} {opt}
                </button>
              ))}
            </div>
            {wrong && (
              <p style={{ ...feedback, color: t.wrongText }} role="status">
                ❌ {quiz.wrongHint}
              </p>
            )}
            <button
              onClick={handleClose}
              style={{ ...ghostBtn, borderColor: t.ghostBorder, color: t.ghostText }}
            >
              나중에 하기
            </button>
          </>
        ) : quiz.showReward ?? true ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 48 }}>{quiz.icon}✨</div>
            <p style={{ ...eyebrow, color: t.eyebrow }}>정답!</p>
            <h2 style={{ margin: '4px 0 8px', fontSize: 18 }}>
              [{ITEM_NAMES[quiz.rewardItem] ?? quiz.rewardItem}] 획득!
            </h2>
            <p style={{ ...feedback, margin: 0, color: t.reward }}>
              {quiz.rewardLine} 도감에 등록되었습니다.
            </p>
          </div>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 40 }}>{quiz.icon}</div>
            <p style={{ ...eyebrow, color: t.eyebrow }}>정답!</p>
            <p style={{ ...feedback, margin: '6px 0 0', color: t.reward }}>{quiz.rewardLine}</p>
          </div>
        )}
      </div>
    </div>
  )
}

const overlay: React.CSSProperties = {
  position: 'absolute',
  inset: 0,
  background: 'rgba(8,20,26,.6)',
  backdropFilter: 'blur(3px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: 20,
  pointerEvents: 'auto',
  zIndex: 35,
}

const sheet: React.CSSProperties = {
  width: 'min(480px, 100%)',
  padding: '22px 22px 20px',
  borderRadius: 20,
  borderWidth: 3,
  borderStyle: 'solid',
  boxShadow: '0 18px 60px rgba(0,0,0,.45)',
  textAlign: 'center',
}

const eyebrow: React.CSSProperties = {
  margin: 0,
  fontSize: 11.5,
  letterSpacing: '.06em',
  fontWeight: 700,
}

const optionList: React.CSSProperties = {
  marginTop: 14,
  display: 'flex',
  flexDirection: 'column',
  gap: 8,
}

const optionBtn: React.CSSProperties = {
  padding: '13px 14px',
  borderRadius: 12,
  borderWidth: 2,
  borderStyle: 'solid',
  fontSize: 14,
  fontWeight: 700,
  fontFamily: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
  wordBreak: 'keep-all',
}

const feedback: React.CSSProperties = {
  marginTop: 10,
  fontSize: 13,
  lineHeight: 1.6,
  wordBreak: 'keep-all',
}

const ghostBtn: React.CSSProperties = {
  marginTop: 14,
  padding: '10px 16px',
  borderRadius: 12,
  border: '1px solid',
  background: 'transparent',
  fontSize: 13,
  fontFamily: 'inherit',
  cursor: 'pointer',
}
