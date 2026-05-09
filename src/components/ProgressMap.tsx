import { getProgressMap } from '@/lib/queries'

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const d = Math.floor(diff / 86400000)
  if (d > 30) return `${Math.floor(d / 30)} 個月前`
  if (d > 0) return `${d} 天前`
  return '今天'
}

const MAX_COUNT = 30

const BAR_COLORS = [
  'bg-violet-400', 'bg-blue-400', 'bg-emerald-400',
  'bg-amber-400', 'bg-rose-400', 'bg-cyan-400',
  'bg-pink-400', 'bg-indigo-400', 'bg-teal-400', 'bg-orange-400',
]

export default async function ProgressMap() {
  const topics = await getProgressMap()

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-5">進度地圖</p>

      {topics.length === 0 ? (
        <p className="text-sm text-zinc-400 py-4 text-center">尚無帶有 topic 標籤的想法</p>
      ) : (
        <>
          <div className="space-y-4">
            {topics.map(({ topic, count, latest }, i) => {
              const pct = Math.min(100, Math.round((count / MAX_COUNT) * 100))
              const color = BAR_COLORS[i % BAR_COLORS.length]
              return (
                <div key={topic}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm font-medium text-zinc-700">{topic}</span>
                    <span className="text-xs text-zinc-400">{count} 則 · {timeAgo(latest)}</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-100 overflow-hidden">
                    <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
                  </div>
                </div>
              )
            })}
          </div>
          <p className="text-xs text-zinc-300 mt-4">以活躍筆記數為代理指標（滿格 = {MAX_COUNT} 則）</p>
        </>
      )}
    </section>
  )
}
