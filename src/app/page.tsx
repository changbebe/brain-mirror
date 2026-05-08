export const dynamic = 'force-dynamic'

import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import TodayFocus from '@/components/TodayFocus'
import ProgressMap from '@/components/ProgressMap'
import InspirationPool from '@/components/InspirationPool'
import AgentDiary from '@/components/AgentDiary'

function SectionSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-20 w-full" />
      <Skeleton className="h-20 w-full" />
    </div>
  )
}

export default function DashboardPage() {
  const now = new Date().toLocaleString('zh-TW', { timeZone: 'Asia/Taipei' })

  return (
    <main className="max-w-5xl mx-auto px-6 py-8 space-y-10">
      <header className="flex items-end justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-900">brain-mirror</h1>
          <p className="text-sm text-zinc-500 mt-1">第二大腦唯讀儀表板</p>
        </div>
        <p className="text-xs text-zinc-400">{now}</p>
      </header>

      <Suspense fallback={<SectionSkeleton />}>
        <TodayFocus />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <ProgressMap />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <InspirationPool />
      </Suspense>

      <Suspense fallback={<SectionSkeleton />}>
        <AgentDiary />
      </Suspense>
    </main>
  )
}
