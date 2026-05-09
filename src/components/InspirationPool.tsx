import { getInspirationPool } from '@/lib/queries'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })
}

export default async function InspirationPool() {
  const thoughts = await getInspirationPool()

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-5">靈感池</p>

      {thoughts.length === 0 ? (
        <p className="text-sm text-zinc-400 py-4 text-center">還沒有任何想法</p>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {thoughts.map((t: any) => (
            <div key={t.id} className="bg-zinc-50 hover:bg-zinc-100 transition-colors rounded-xl p-4 flex flex-col gap-3">
              <p className="text-sm text-zinc-700 line-clamp-4 flex-1">
                {t.ai_summary || t.raw_content}
              </p>
              <div className="flex items-center justify-between gap-2">
                {t.topic && (
                  <span className="text-xs bg-white border border-zinc-200 text-zinc-500 px-2 py-0.5 rounded-full truncate max-w-[80px]">
                    {t.topic}
                  </span>
                )}
                <span className="text-xs text-zinc-400 ml-auto shrink-0">{formatDate(t.created_at)}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
