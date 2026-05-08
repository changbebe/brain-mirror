import { getProgressMap } from '@/lib/queries'

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const d = Math.floor(diff / 86400000)
  if (d > 30) return `${Math.floor(d / 30)} 個月前`
  if (d > 0) return `${d} 天前`
  return '今天'
}

const MAX_COUNT = 30

export default async function ProgressMap() {
  const topics = await getProgressMap()

  if (topics.length === 0) {
    return (
      <section>
        <h2 className="text-lg font-semibold text-zinc-800 mb-4">進度地圖</h2>
        <p className="text-sm text-zinc-400">尚無帶有 topic 標籤的想法。</p>
      </section>
    )
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-zinc-800 mb-4">進度地圖</h2>
      <div className="space-y-3">
        {topics.map(({ topic, count, latest }) => {
          const pct = Math.min(100, Math.round((count / MAX_COUNT) * 100))
          return (
            <div key={topic} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-zinc-700">{topic}</span>
                <span className="text-xs text-zinc-400">{count} 則 · {timeAgo(latest)}</span>
              </div>
              <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                <div
                  className="h-full rounded-full bg-zinc-700 transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-xs text-zinc-400 mt-3">進度條以活躍筆記數為代理指標（滿格 = {MAX_COUNT} 則）</p>
    </section>
  )
}
