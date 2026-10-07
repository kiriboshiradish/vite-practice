import { useEffect, useState } from 'react'

type Position = { x: number; y: number }
type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'

type KeyConfig = {
  UP: string
  DOWN: string
  LEFT: string
  RIGHT: string
}

const DEFAULT_KEY_CONFIG: KeyConfig = {
  UP: 'ArrowUp',
  DOWN: 'ArrowDown',
  LEFT: 'ArrowLeft',
  RIGHT: 'ArrowRight',
}

const GRID_SIZE = 15
const INITIAL_SNAKE: Position[] = [
  { x: 7, y: 7 },
  { x: 7, y: 8 },
]
const INITIAL_FOOD: Position = { x: 3, y: 3 }

export function SnakeGame() {
  const [snake, setSnake] = useState<Position[]>(INITIAL_SNAKE)
  const [food, setFood] = useState<Position>(INITIAL_FOOD)
  const [direction, setDirection] = useState<Direction>('UP')
  const [gameOver, setGameOver] = useState<boolean>(false)
  const [score, setScore] = useState<number>(0)
  const [isPaused, setIsPaused] = useState<boolean>(true)

  // キーコンフィグ用の状態
  const [keyConfig, setKeyConfig] = useState<KeyConfig>(DEFAULT_KEY_CONFIG)
  const [editingKey, setEditingKey] = useState<Direction | null>(null)

  // キーボード操作の読み取り
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // キー設定中の場合はゲーム操作を抑止
      if (editingKey) {
        setKeyConfig((prev) => ({ ...prev, [editingKey]: e.key }))
        setEditingKey(null)
        return
      }

      if (e.key === keyConfig.UP && direction !== 'DOWN') setDirection('UP')
      if (e.key === keyConfig.DOWN && direction !== 'UP') setDirection('DOWN')
      if (e.key === keyConfig.LEFT && direction !== 'RIGHT') setDirection('LEFT')
      if (e.key === keyConfig.RIGHT && direction !== 'LEFT') setDirection('RIGHT')
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [direction, keyConfig, editingKey])

  // ゲームループ
  useEffect(() => {
    if (gameOver || isPaused || editingKey) return

    const timer = setInterval(() => {
      setSnake((prevSnake) => {
        const head = { ...prevSnake[0] }

        if (direction === 'UP') head.y -= 1
        if (direction === 'DOWN') head.y += 1
        if (direction === 'LEFT') head.x -= 1
        if (direction === 'RIGHT') head.x += 1

        if (
          head.x < 0 ||
          head.x >= GRID_SIZE ||
          head.y < 0 ||
          head.y >= GRID_SIZE ||
          prevSnake.some((segment) => segment.x === head.x && segment.y === head.y)
        ) {
          setGameOver(true)
          return prevSnake
        }

        const newSnake = [head, ...prevSnake]

        if (head.x === food.x && head.y === food.y) {
          setScore((s) => s + 10)
          setFood({
            x: Math.floor(Math.random() * GRID_SIZE),
            y: Math.floor(Math.random() * GRID_SIZE),
          })
        } else {
          newSnake.pop()
        }

        return newSnake
      })
    }, 200)

    return () => clearInterval(timer)
  }, [direction, food, gameOver, isPaused, editingKey])

  const restartGame = () => {
    setSnake(INITIAL_SNAKE)
    setFood(INITIAL_FOOD)
    setDirection('UP')
    setGameOver(false)
    setScore(0)
    setIsPaused(false)
  }

  // 表示用のキー名称変換
  const formatKeyName = (key: string) => {
    if (key === 'ArrowUp') return '↑ (ArrowUp)'
    if (key === 'ArrowDown') return '↓ (ArrowDown)'
    if (key === 'ArrowLeft') return '← (ArrowLeft)'
    if (key === 'ArrowRight') return '→ (ArrowRight)'
    if (key === ' ') return 'Space'
    return key
  }

  return (
    <div className="bg-slate-800 p-6 rounded-2xl shadow-xl flex flex-col items-center max-w-md w-full">
      <h1 className="text-2xl font-bold mb-2 text-emerald-400">🐍 スネークゲーム</h1>
      <p className="text-gray-300 mb-4 font-bold">スコア: {score}</p>

      {/* ゲーム盤 */}
      <div
        className="grid gap-0.5 bg-slate-900 p-2 rounded-lg border-2 border-slate-700"
        style={{
          gridTemplateColumns: `repeat(${GRID_SIZE}, minmax(0, 1fr))`,
          width: '280px',
          height: '280px',
        }}
      >
        {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
          const x = index % GRID_SIZE
          const y = Math.floor(index / GRID_SIZE)
          const isSnakeHead = snake[0].x === x && snake[0].y === y
          const isSnakeBody = snake.slice(1).some((s) => s.x === x && s.y === y)
          const isFood = food.x === x && food.y === y

          let bgColor = 'bg-slate-800/40'
          if (isSnakeHead) bgColor = 'bg-emerald-400'
          else if (isSnakeBody) bgColor = 'bg-emerald-600'
          else if (isFood) bgColor = 'bg-rose-500 animate-pulse'

          return <div key={index} className={`rounded-sm ${bgColor}`} />
        })}
      </div>

      {gameOver && <p className="text-rose-400 font-bold mt-4">Game Over!</p>}

      <div className="mt-4 flex gap-2">
        <button
          onClick={restartGame}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold px-4 py-2 rounded-lg transition"
        >
          {gameOver ? 'もう一度遊ぶ' : isPaused ? 'スタート' : 'リセット'}
        </button>
      </div>

      {/* キーコンフィグエリア */}
      <div className="mt-6 w-full bg-slate-900/60 p-4 rounded-xl border border-slate-700">
        <h2 className="text-sm font-bold text-slate-300 mb-3 text-center">⚙️ キー設定（変更したい方向をタップ）</h2>
        <div className="grid grid-cols-2 gap-2 text-xs">
          {(['UP', 'DOWN', 'LEFT', 'RIGHT'] as Direction[]).map((dir) => (
            <button
              key={dir}
              onClick={() => setEditingKey(dir)}
              className={`p-2 rounded flex justify-between items-center border transition ${
                editingKey === dir
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 animate-pulse'
                  : 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span className="font-bold">{dir}:</span>
              <span>{editingKey === dir ? 'キーを押して...' : formatKeyName(keyConfig[dir])}</span>
            </button>
          ))}
        </div>
      </div>

      {/* スマホ用タッチ操作ボタン */}
      <div className="mt-6 grid grid-cols-3 gap-2 w-48 text-center md:hidden">
        <div />
        <button
          onClick={() => direction !== 'DOWN' && setDirection('UP')}
          className="bg-slate-700 active:bg-slate-600 p-3 rounded-lg text-lg font-bold"
        >
          ▲
        </button>
        <div />
        <button
          onClick={() => direction !== 'RIGHT' && setDirection('LEFT')}
          className="bg-slate-700 active:bg-slate-600 p-3 rounded-lg text-lg font-bold"
        >
          ◀
        </button>
        <button
          onClick={() => direction !== 'UP' && setDirection('DOWN')}
          className="bg-slate-700 active:bg-slate-600 p-3 rounded-lg text-lg font-bold"
        >
          ▼
        </button>
        <button
          onClick={() => direction !== 'LEFT' && setDirection('RIGHT')}
          className="bg-slate-700 active:bg-slate-600 p-3 rounded-lg text-lg font-bold"
        >
          ▶
        </button>
      </div>
    </div>
  )
}