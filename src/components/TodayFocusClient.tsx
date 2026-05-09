'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

const WEIGHT_COLOR: Record<string, string> = {
  core_belief: 'bg-red-100 text-red-700',
  principle:   'bg-amber-100 text-amber-700',
  note:        'bg-zinc-100 text-zinc-500',
  fleeting:    'bg-zinc-100 text-zinc-400',
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const h = Math.floor(diff / 3600000)
  const d = Math.floor(diff / 86400000)
  if (d > 0) return `${d} 天前`
  if (h > 0) return `${h} 小時前`
  return '剛剛'
}

function SortableThought({ thought }: { thought: any }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: thought.id,
  })

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      className={`bg-zinc-50 rounded-xl px-4 py-3 flex items-start justify-between gap-3 select-none
        ${isDragging ? 'opacity-50 shadow-lg' : ''}`}
    >
      <div
        {...attributes}
        {...listeners}
        className="mt-1 cursor-grab active:cursor-grabbing text-zinc-300 hover:text-zinc-400 shrink-0"
        title="拖拉排序"
      >
        ⠿
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-zinc-700 line-clamp-2">{thought.ai_summary || thought.raw_content}</p>
        <p className="text-xs text-zinc-400 mt-1.5">{thought.topic ?? thought.category} · {timeAgo(thought.created_at)}</p>
      </div>
      <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${WEIGHT_COLOR[thought.weight] ?? WEIGHT_COLOR.note}`}>
        {thought.weight}
      </span>
    </div>
  )
}

// Quick add input
function QuickAddTodo({ onAdd }: { onAdd: (t: any) => void }) {
  const [value, setValue] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter' || !value.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/thoughts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: value.trim() }),
      })
      if (res.ok) {
        const newThought = await res.json()
        onAdd(newThought)
        setValue('')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-3">
      <input
        type="text"
        value={value}
        onChange={e => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={loading}
        placeholder="快速新增待辦事項..."
        className="w-full bg-transparent border border-dashed border-zinc-300 rounded-xl px-4 py-2.5 text-sm text-zinc-600 placeholder:text-zinc-300 outline-none focus:border-zinc-400 disabled:opacity-50 transition-colors"
      />
    </div>
  )
}

export default function TodayFocusClient({
  initialThoughts,
}: {
  initialThoughts: any[]
}) {
  const [thoughts, setThoughts] = useState(initialThoughts)

  const sensors = useSensors(useSensor(PointerSensor, {
    activationConstraint: { distance: 8 },
  }))

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event
    if (!over || active.id === over.id) return

    setThoughts(prev => {
      const oldIndex = prev.findIndex(t => t.id === active.id)
      const newIndex = prev.findIndex(t => t.id === over.id)
      const next = arrayMove(prev, oldIndex, newIndex)

      // Persist new order
      fetch('/api/thoughts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          updates: next.map((t, i) => ({ id: t.id, sort_order: i })),
        }),
      })

      return next
    })
  }, [])

  return (
    <>
      {thoughts.length > 0 && (
        <div>
          <p className="text-xs text-zinc-400 mb-2">近 7 天想法</p>
          <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <SortableContext items={thoughts.map(t => t.id)} strategy={verticalListSortingStrategy}>
              <div className="space-y-2">
                {thoughts.map(t => <SortableThought key={t.id} thought={t} />)}
              </div>
            </SortableContext>
          </DndContext>
          <QuickAddTodo onAdd={t => setThoughts(prev => [t, ...prev])} />
        </div>
      )}

      {thoughts.length === 0 && (
        <>
          <p className="text-sm text-zinc-400 py-2 text-center">近 7 天沒有新想法</p>
          <QuickAddTodo onAdd={t => setThoughts([t])} />
        </>
      )}
    </>
  )
}
