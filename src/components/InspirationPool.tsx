import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { getInspirationPool } from '@/lib/queries'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })
}

export default async function InspirationPool() {
  const thoughts = await getInspirationPool()

  if (thoughts.length === 0) {
    return (
      <section>
        <h2 className="text-lg font-semibold text-zinc-800 mb-4">靈感池</h2>
        <p className="text-sm text-zinc-400">還沒有靈感類的想法。</p>
      </section>
    )
  }

  return (
    <section>
      <h2 className="text-lg font-semibold text-zinc-800 mb-4">靈感池</h2>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {thoughts.map((t: any) => (
          <Card key={t.id} className="border-zinc-100 hover:border-zinc-300 transition-colors">
            <CardContent className="py-3 px-4 space-y-2">
              <p className="text-sm text-zinc-700 line-clamp-4">
                {t.ai_summary || t.raw_content}
              </p>
              <div className="flex items-center justify-between">
                {t.topic && <Badge variant="outline" className="text-xs">{t.topic}</Badge>}
                <span className="text-xs text-zinc-400 ml-auto">{formatDate(t.created_at)}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
