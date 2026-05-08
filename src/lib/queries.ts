import { createServerSupabaseClient } from './supabase-server'

export async function getTodayFocus() {
  const supabase = await createServerSupabaseClient()

  const [inboxRes, thoughtsRes] = await Promise.all([
    supabase
      .from('inbox')
      .select('id, raw_content, source, status, created_at')
      .eq('status', 'raw')
      .order('created_at', { ascending: false })
      .limit(5),

    supabase
      .from('thoughts')
      .select('id, raw_content, ai_summary, category, topic, weight, created_at')
      .in('weight', ['principle', 'core_belief'])
      .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(10),
  ])

  const pendingCount = inboxRes.data?.length ?? 0
  const totalInboxRes = await supabase
    .from('inbox')
    .select('id', { count: 'exact', head: true })
    .eq('status', 'raw')

  return {
    pendingCount: totalInboxRes.count ?? pendingCount,
    recentInbox: inboxRes.data ?? [],
    highWeightThoughts: thoughtsRes.data ?? [],
  }
}

export async function getProgressMap() {
  const supabase = await createServerSupabaseClient()

  const { data } = await supabase
    .from('thoughts')
    .select('id, topic, category, created_at, updated_at')
    .not('topic', 'is', null)
    .order('created_at', { ascending: false })

  if (!data) return []

  const topicMap = new Map<string, { count: number; latest: string }>()
  for (const t of data) {
    const topic = t.topic as string
    const existing = topicMap.get(topic)
    if (!existing || t.created_at > existing.latest) {
      topicMap.set(topic, {
        count: (existing?.count ?? 0) + 1,
        latest: t.created_at as string,
      })
    } else {
      topicMap.set(topic, { ...existing, count: existing.count + 1 })
    }
  }

  return Array.from(topicMap.entries())
    .map(([topic, { count, latest }]) => ({ topic, count, latest }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10)
}

export async function getInspirationPool() {
  const supabase = await createServerSupabaseClient()

  const { data } = await supabase
    .from('thoughts')
    .select('id, raw_content, ai_summary, category, topic, created_at')
    .eq('category', '靈感類')
    .order('created_at', { ascending: false })
    .limit(20)

  if (!data || data.length === 0) {
    // fallback: 取最新的筆記類
    const { data: fallback } = await supabase
      .from('thoughts')
      .select('id, raw_content, ai_summary, category, topic, created_at')
      .order('created_at', { ascending: false })
      .limit(20)
    return fallback ?? []
  }

  return data
}

export async function getAgentDiary() {
  const supabase = await createServerSupabaseClient()

  // Check if agent_diary table exists by attempting a query
  const { data, error } = await supabase
    .from('agent_diary')
    .select('id, agent_name, action, result, created_at')
    .order('created_at', { ascending: false })
    .limit(30)

  if (error) return null  // table doesn't exist
  return data ?? []
}
