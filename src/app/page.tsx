export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import TodayFocus from '@/components/TodayFocus'
import ProgressMap from '@/components/ProgressMap'
import InspirationPool from '@/components/InspirationPool'
import AgentDiary from '@/components/AgentDiary'

function SectionSkeleton({ title }: { title: string }) {
  return (
    <section className="bg-white rounded-2xl p-6 shadow-sm border border-zinc-100">
      <p className="text-xs font-semibold uppercase tracking-widest text-zinc-400 mb-4">{title}</p>
      <div className="space-y-3">
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-14 w-full rounded-xl" />
      </div>
    </section>
  )
}

export default function DashboardPage() {
  const now = new Date().toLocaleString('zh-TW', {
    timeZone: 'Asia/Taipei',
    month: 'long', day: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })

  return (
    <div className="min-h-screen bg-zinc-50">
      <header className="bg-white border-b border-zinc-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-zinc-900 tracking-tight">brain-mirror</h1>
            <p className="text-xs text-zinc-400">第二大腦唯讀儀表板</p>
          </div>
          <p className="text-xs text-zinc-400">更新於 {now}</p>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8 space-y-6">
        <Suspense fallback={<SectionSkeleton title="今日焦點" />}>
          <TodayFocus />
        </Suspense>

        <Suspense fallback={<SectionSkeleton title="進度地圖" />}>
          <ProgressMap />
        </Suspense>

        <Suspense fallback={<SectionSkeleton title="靈感池" />}>
          <InspirationPool />
        </Suspense>

        <Suspense fallback={<SectionSkeleton title="AI 日誌" />}>
          <AgentDiary />
        </Suspense>
      </main>
    </div>
  )
}
