import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { getTodayFocus } from '@/lib/queries'

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
    <section>
      <div className="flex items-center gap-3 mb-4">
        <h2 className="text-lg font-semibold text-zinc-800">今日焦點</h2>
        {pendingCount > 0 && (
          <Badge variant="destructive">{pendingCount} 則未處理</Badge>
        )}
      </div>

      {recentInbox.length > 0 && (
        <div className="mb-4 space-y-2">
          <p className="text-xs text-zinc-400 uppercase tracking-wide">最新 Inbox</p>
          {recentInbox.map((item: any) => (
            <Card key={item.id} className="border-zinc-100">
              <CardContent className="py-3 px-4">
                <p className="text-sm text-zinc-700 line-clamp-2">{item.raw_content}</p>
                <p className="text-xs text-zinc-400 mt-1">{timeAgo(item.created_at)} · {item.source}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {highWeightThoughts.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs text-zinc-400 uppercase tracking-wide">高權重想法（近 7 天）</p>
          {highWeightThoughts.map((t: any) => (
            <Card key={t.id} className="border-zinc-100">
              <CardContent className="py-3 px-4">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm text-zinc-700 line-clamp-2">{t.ai_summary || t.raw_content}</p>
                  <Badge variant="outline" className="shrink-0 text-xs">{t.weight}</Badge>
                </div>
                <p className="text-xs text-zinc-400 mt-1">{t.topic ?? t.category} · {timeAgo(t.created_at)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        recentInbox.length === 0 && (
          <p className="text-sm text-zinc-400">近 7 天沒有高權重想法，也沒有未處理 inbox。</p>
        )
      )}
    </section>
  )
}
