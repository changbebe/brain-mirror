import { getAgentDiary } from '@/lib/queries'

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('zh-TW', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

export default async function AgentDiary() {
  const entries = await getAgentDiary()

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-5">AI 日誌</p>

      {entries === null ? (
        <p className="text-sm text-zinc-400 py-4 text-center">agent_diary 表尚未建立</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-zinc-400 py-4 text-center">AI 還沒有留下任何記錄</p>
      ) : (
        <div className="space-y-0">
          {entries.map((e: any, i: number) => (
            <div key={e.id} className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className="w-2 h-2 rounded-full bg-zinc-300 group-first:bg-zinc-600 mt-1 shrink-0" />
                {i < entries.length - 1 && <div className="w-px flex-1 bg-zinc-100 my-1" />}
              </div>
              <div className="flex-1 pb-4">
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-medium text-zinc-600">{e.agent_name}</span>
                  <span className="text-xs text-zinc-300">{formatTime(e.created_at)}</span>
                </div>
                <p className="text-sm text-zinc-700">{e.action}</p>
                {e.result && <p className="text-xs text-zinc-400 mt-1">{e.result}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
