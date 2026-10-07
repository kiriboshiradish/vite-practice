import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [temperature, setTemperature] = useState<number | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Open-Meteo API から東京（緯度: 35.6895, 経度: 139.6917）の現在の天気を取得
    fetch('https://api.open-meteo.com/v1/forecast?latitude=35.6895&longitude=139.6917&current_weather=true')
      .then((response) => response.json())
      .then((data) => {
        setTemperature(data.current_weather.temperature)
        setLoading(false)
      })
      .catch((error) => {
        console.error('データの取得に失敗しました:', error)
        setLoading(false)
      })
  }, [])

  return (
    <div className="bg-slate-900 text-white min-h-screen flex flex-col justify-center items-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl text-center max-w-sm w-full">
        <h1 className="text-2xl font-bold mb-4 text-blue-400">東京の現在の天気</h1>
        {loading ? (
          <p className="text-gray-400 animate-pulse">データを読み込み中...</p>
        ) : temperature !== null ? (
          <div className="my-6">
            <span className="text-6xl font-extrabold">{temperature}</span>
            <span className="text-2xl font-bold ml-2 text-blue-300">℃</span>
          </div>
        ) : (
          <p className="text-red-400">データの取得に失敗しました</p>
        )}
      </div>
    </div>
  )
}

export default App