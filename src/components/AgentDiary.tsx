import { getAgentDiary } from '@/lib/queries'

function formatTime(iso: string) {
  return new Date(iso).toLocaleString('zh-TW', {
    month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
  })
}

export default async function AgentDiary() {
  const entries = await getAgentDiary()

  return (
    <section>
      <h2 className="text-lg font-semibold text-zinc-800 mb-4">AI 日誌</h2>

      {entries === null ? (
        <p className="text-sm text-zinc-400">agent_diary 表尚未建立。</p>
      ) : entries.length === 0 ? (
        <p className="text-sm text-zinc-400">AI 還沒有留下任何記錄。</p>
      ) : (
        <div className="space-y-3">
          {entries.map((e: any) => (
            <div key={e.id} className="flex gap-4">
              <div className="text-xs text-zinc-400 w-28 shrink-0 pt-0.5">{formatTime(e.created_at)}</div>
              <div className="flex-1 border-l border-zinc-200 pl-4 pb-3">
                <p className="text-xs font-medium text-zinc-500">{e.agent_name}</p>
                <p className="text-sm text-zinc-700 mt-0.5">{e.action}</p>
                {e.result && (
                  <p className="text-xs text-zinc-400 mt-1">{e.result}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
