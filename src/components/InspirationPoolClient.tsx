'use client'

import { useState, useCallback } from 'react'
import {
  DndContext,
  DragOverlay,
  closestCorners,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDroppable } from '@dnd-kit/core'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('zh-TW', { month: 'short', day: 'numeric' })
}

function ThoughtCard({ thought, overlay = false }: { thought: any; overlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: thought.id,
    data: { topic: thought.topic },
  })

  if (overlay) {
    return (
      <div className="bg-white border-2 border-violet-300 rounded-xl p-4 shadow-xl rotate-2 cursor-grabbing">
        <p className="text-sm text-zinc-700 line-clamp-3">{thought.ai_summary || thought.raw_content}</p>
      </div>
    )
  }

  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      {...attributes}
      {...listeners}
      className={`bg-zinc-50 hover:bg-zinc-100 rounded-xl p-4 flex flex-col gap-3 cursor-grab active:cursor-grabbing select-none transition-colors
        ${isDragging ? 'opacity-40' : ''}`}
    >
      <p className="text-sm text-zinc-700 line-clamp-4 flex-1">{thought.ai_summary || thought.raw_content}</p>
      <span className="text-xs text-zinc-400 self-end">{formatDate(thought.created_at)}</span>
    </div>
  )
}

function TopicColumn({ topic, thoughts }: { topic: string; thoughts: any[] }) {
  const { setNodeRef, isOver } = useDroppable({ id: `col-${topic}`, data: { topic } })

  return (
    <div className="flex-1 min-w-[200px]">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full">{topic}</span>
        <span className="text-xs text-zinc-300">{thoughts.length}</span>
      </div>
      <div
        ref={setNodeRef}
        className={`min-h-[80px] rounded-xl p-2 transition-colors ${isOver ? 'bg-violet-50 ring-2 ring-violet-200' : 'bg-transparent'}`}
      >
        <SortableContext items={thoughts.map(t => t.id)} strategy={rectSortingStrategy}>
          <div className="space-y-2">
            {thoughts.map(t => <ThoughtCard key={t.id} thought={t} />)}
          </div>
        </SortableContext>
        {thoughts.length === 0 && (
          <p className="text-xs text-zinc-300 text-center py-4">拖拉到這裡</p>
        )}
      </div>
    </div>
  )
}

type ThoughtMap = Record<string, any[]>

function groupByTopic(thoughts: any[]): ThoughtMap {
  const map: ThoughtMap = {}
  for (const t of thoughts) {
    const key = t.topic ?? 'others'
    if (!map[key]) map[key] = []
    map[key].push(t)
  }
  return map
}

export default function InspirationPoolClient({ initialThoughts }: { initialThoughts: any[] }) {
  const [groups, setGroups] = useState<ThoughtMap>(() => groupByTopic(initialThoughts))
  const [activeThought, setActiveThought] = useState<any>(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))
  const topics = Object.keys(groups)

  const findTopicOfThought = useCallback((id: string) => {
    return topics.find(topic => groups[topic].some(t => t.id === id))
  }, [groups, topics])

  function handleDragStart(event: DragStartEvent) {
    const topic = findTopicOfThought(event.active.id as string)
    if (!topic) return
    const thought = groups[topic].find(t => t.id === event.active.id)
    setActiveThought(thought)
  }

  function handleDragOver(event: DragOverEvent) {
    const { active, over } = event
    if (!over) return

    const activeTopic = findTopicOfThought(active.id as string)
    const overTopic = over.data.current?.topic ?? findTopicOfThought(over.id as string)

    if (!activeTopic || !overTopic || activeTopic === overTopic) return

    setGroups(prev => {
      const thought = prev[activeTopic].find(t => t.id === active.id)!
      return {
        ...prev,
        [activeTopic]: prev[activeTopic].filter(t => t.id !== active.id),
        [overTopic]: [thought, ...prev[overTopic]],
      }
    })
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    setActiveThought(null)
    if (!over) return

    const activeTopic = findTopicOfThought(active.id as string)
    const overTopic = over.data.current?.topic ?? findTopicOfThought(over.id as string)

    if (!activeTopic) return

    if (activeTopic === overTopic) {
      // Reorder within same column
      setGroups(prev => {
        const items = prev[activeTopic]
        const oldIdx = items.findIndex(t => t.id === active.id)
        const newIdx = items.findIndex(t => t.id === over.id)
        if (oldIdx === newIdx) return prev
        return { ...prev, [activeTopic]: arrayMove(items, oldIdx, newIdx) }
      })
    } else if (overTopic) {
      // Persist topic change to Supabase
      fetch('/api/thoughts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: active.id, topic: overTopic }),
      })
    }
  }

  if (topics.length === 0) {
    return <p className="text-sm text-zinc-400 py-4 text-center">還沒有任何想法</p>
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-2">
        {topics.map(topic => (
          <TopicColumn key={topic} topic={topic} thoughts={groups[topic]} />
        ))}
      </div>
      <DragOverlay>
        {activeThought && <ThoughtCard thought={activeThought} overlay />}
      </DragOverlay>
    </DndContext>
  )
}
