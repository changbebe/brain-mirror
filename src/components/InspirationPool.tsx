import { getInspirationPool } from '@/lib/queries'
import InspirationPoolClient from './InspirationPoolClient'

export default async function InspirationPool() {
  const thoughts = await getInspirationPool()

  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
      <div className="flex items-center justify-between mb-5">
        <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400">靈感池</p>
        <p className="text-xs text-zinc-300">拖拉卡片可換分類</p>
      </div>
      <InspirationPoolClient initialThoughts={thoughts} />
    </section>
  )
}
