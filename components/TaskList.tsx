'use client'

import { useState } from 'react'
import { Tarefa } from '@/types'
import TaskItem from './TaskItem'

interface TaskListProps {
  tarefas: Tarefa[]
  carregando: boolean
  onAlternarConcluida: (id: string, concluida: boolean) => void
  onExcluir: (id: string) => void
  onEditar: (id: string, campos: Partial<Pick<Tarefa, 'descricao' | 'nota' | 'prioridade' | 'tags' | 'recorrente'>>) => void
  onDuplicar: (id: string) => void
  onReordenar: (tarefas: Tarefa[]) => void
}

export default function TaskList({
  tarefas,
  carregando,
  onAlternarConcluida,
  onExcluir,
  onEditar,
  onDuplicar,
  onReordenar,
}: TaskListProps) {
  const [draggingId, setDraggingId] = useState<string | null>(null)
  const [overIdx, setOverIdx] = useState<number | null>(null)

  // Carregando — skeleton
  if (carregando) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-14 rounded-xl bg-surface border border-bd animate-pulse" />
        ))}
      </div>
    )
  }

  // Vazio
  if (tarefas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-12 h-12 rounded-full bg-surface border border-bd flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--tx-5)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
          </svg>
        </div>
        <p className="text-sm text-tx-5">Nenhuma tarefa neste mês</p>
      </div>
    )
  }

  const pendentes  = tarefas.filter(t => !t.concluida)
  const concluidas = tarefas.filter(t =>  t.concluida)

  // ─── Handlers de drag & drop (só nas pendentes) ─────────────
  const handleDragStart = (e: React.DragEvent, id: string) => {
    setDraggingId(id)
    e.dataTransfer.effectAllowed = 'move'
  }

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    setOverIdx(idx)
  }

  const handleDrop = (e: React.DragEvent, dropIdx: number) => {
    e.preventDefault()
    if (!draggingId) return

    const srcIdx = pendentes.findIndex(t => t.id === draggingId)
    if (srcIdx === -1 || srcIdx === dropIdx) return

    const nova = [...pendentes]
    const [moved] = nova.splice(srcIdx, 1)
    nova.splice(dropIdx, 0, moved)

    // Reordena mantendo as concluídas no final
    onReordenar([...nova, ...concluidas])
    setDraggingId(null)
    setOverIdx(null)
  }

  const handleDragEnd = () => {
    setDraggingId(null)
    setOverIdx(null)
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Pendentes */}
      {pendentes.length > 0 && (
        <section>
          <ul className="flex flex-col gap-2">
            {pendentes.map((tarefa, idx) => (
              <TaskItem
                key={tarefa.id}
                tarefa={tarefa}
                onAlternarConcluida={onAlternarConcluida}
                onExcluir={onExcluir}
                onEditar={onEditar}
                onDuplicar={onDuplicar}
                draggable
                onDragStart={e => handleDragStart(e, tarefa.id)}
                onDragOver={e => handleDragOver(e, idx)}
                onDrop={e => handleDrop(e, idx)}
                onDragEnd={handleDragEnd}
              />
            ))}
          </ul>
        </section>
      )}

      {/* Concluídas */}
      {concluidas.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-2 px-1">
            <span className="text-[10px] font-medium text-tx-5 uppercase tracking-wider">
              Concluídas
            </span>
            <div className="flex-1 h-px bg-bd-dim" />
            <span className="text-[10px] text-tx-5 tabular-nums">{concluidas.length}</span>
          </div>
          <ul className="flex flex-col gap-2">
            {concluidas.map(tarefa => (
              <TaskItem
                key={tarefa.id}
                tarefa={tarefa}
                onAlternarConcluida={onAlternarConcluida}
                onExcluir={onExcluir}
                onEditar={onEditar}
                onDuplicar={onDuplicar}
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
