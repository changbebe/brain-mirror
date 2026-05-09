import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

// POST /api/thoughts — quick add a todo
export async function POST(request: NextRequest) {
  const { content } = await request.json()
  if (!content?.trim()) return NextResponse.json({ error: 'empty' }, { status: 400 })

  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('thoughts')
    .insert({
      raw_content: content.trim(),
      category: 'urgent',
      topic: 'urgent',
      weight: 'note',
      status: 'new',
    })
    .select('id, raw_content, category, topic, weight, created_at')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

// PATCH /api/thoughts — update sort_order or topic for items
export async function PATCH(request: NextRequest) {
  const body = await request.json()
  const supabase = createAdminClient()

  // Single topic update: { id, topic }
  if (body.id && body.topic !== undefined) {
    const { error } = await supabase
      .from('thoughts')
      .update({ topic: body.topic, category: body.topic })
      .eq('id', body.id)
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true })
  }

  // Batch sort_order update: { updates: [{ id, sort_order }] }
  const { updates } = body
  if (!Array.isArray(updates)) return NextResponse.json({ error: 'invalid' }, { status: 400 })

  const results = await Promise.all(
    updates.map(({ id, sort_order }: { id: string; sort_order: number }) =>
      supabase.from('thoughts').update({ sort_order }).eq('id', id)
    )
  )
  const failed = results.find(r => r.error)
  if (failed?.error) return NextResponse.json({ error: failed.error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
