import { useState } from 'react'
import './App.css'
import { Weather } from './components/Weather'
import { SnakeGame } from './components/SnakeGame'

type ActiveMenu = 'weather' | 'snake'

function App() {
  const [activeMenu, setActiveMenu] = useState<ActiveMenu>('weather')
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false)

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col relative">
      {/* ヘッダー */}
      <header className="bg-slate-800 p-4 border-b border-slate-700 flex items-center justify-between">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="bg-slate-700 hover:bg-slate-600 p-2 rounded-lg text-xl flex items-center gap-2 transition"
        >
          <span>☰</span>
          <span className="text-sm font-bold">メニュー</span>
        </button>
        <h1 className="text-lg font-bold text-slate-300">My Dashboard</h1>
        <div className="w-16" /> {/* 中央寄せ用のスペース */}
      </header>

      {/* サイドバー（メニュー） */}
      {isMenuOpen && (
        <div className="absolute top-16 left-0 bottom-0 w-64 bg-slate-800 border-r border-slate-700 p-4 z-50 shadow-2xl animate-fade-in">
          <p className="text-xs font-bold text-slate-400 mb-4 tracking-wider">APP MENU</p>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => {
                setActiveMenu('weather')
                setIsMenuOpen(false)
              }}
              className={`p-3 rounded-lg text-left font-bold transition flex items-center gap-3 ${
                activeMenu === 'weather' ? 'bg-blue-600 text-white' : 'hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>☀️</span> 天気予報
            </button>
            <button
              onClick={() => {
                setActiveMenu('snake')
                setIsMenuOpen(false)
              }}
              className={`p-3 rounded-lg text-left font-bold transition flex items-center gap-3 ${
                activeMenu === 'snake' ? 'bg-emerald-600 text-white' : 'hover:bg-slate-700 text-slate-300'
              }`}
            >
              <span>🐍</span> スネークゲーム
            </button>
          </div>
        </div>
      )}

      {/* メイン画面コンテンツ */}
      <main className="flex-1 flex justify-center items-center p-4">
        {activeMenu === 'weather' && <Weather />}
        {activeMenu === 'snake' && <SnakeGame />}
      </main>
    </div>
  )
}

export default App