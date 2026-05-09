import { getTodayFocus } from '@/lib/queries'
import TodayFocusClient from './TodayFocusClient'

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (d > 0) return `${d} 天前`
  if (h > 0) return `${h} 小時前`
  return '剛剛'
}

export default async function TodayFocus() {
  const { pendingCount, recentInbox, highWeightThoughts } = await getTodayFocus()

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">今日焦點</p>
        {pendingCount > 0 && (
          <span className="inline-flex items-center gap-1 bg-red-50 text-red-600 text-xs font-medium px-2.5 py-1 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {pendingCount} 則待處理
          </span>
        )}
      </div>

      {recentInbox.length > 0 && (
        <div className="mb-5">
          <p className="text-xs text-zinc-400 mb-2">最新 Inbox</p>
          <div className="space-y-2">
            {recentInbox.map((item: any) => (
              <div key={item.id} className="bg-zinc-50 rounded-xl px-4 py-3">
                <p className="text-sm text-zinc-700 line-clamp-2">{item.raw_content}</p>
                <p className="text-xs text-zinc-400 mt-1.5">{timeAgo(item.created_at)} · {item.source}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <TodayFocusClient initialThoughts={highWeightThoughts} />
    </section>
  )
}
