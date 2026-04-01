'use client'

import { Tarefa } from '@/types'
import TaskItem from './TaskItem'

interface TaskListProps {
  tarefas: Tarefa[]
  carregando: boolean
  onAlternarConcluida: (id: string, concluida: boolean) => void
  onExcluir: (id: string) => void
}

export default function TaskList({ tarefas, carregando, onAlternarConcluida, onExcluir }: TaskListProps) {
  // Estado de carregamento
  if (carregando) {
    return (
      <div className="flex flex-col gap-2">
        {[1, 2, 3].map(i => (
          <div
            key={i}
            className="h-14 rounded-xl bg-[#111111] border border-[#1c1c1c] animate-pulse"
          />
        ))}
      </div>
    )
  }

  // Lista vazia
  if (tarefas.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-12 h-12 rounded-full bg-[#111111] border border-[#1c1c1c] flex items-center justify-center">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3f3f46" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
            <rect x="9" y="3" width="6" height="4" rx="1" />
          </svg>
        </div>
        <p className="text-sm text-[#3f3f46]">Nenhuma tarefa neste mês</p>
      </div>
    )
  }

  // Separa pendentes e concluídas
  const pendentes = tarefas.filter(t => !t.concluida)
  const concluidas = tarefas.filter(t => t.concluida)

  return (
    <div className="flex flex-col gap-6">
      {/* Tarefas pendentes */}
      {pendentes.length > 0 && (
        <section>
          <ul className="flex flex-col gap-2">
            {pendentes.map(tarefa => (
              <TaskItem
                key={tarefa.id}
                tarefa={tarefa}
                onAlternarConcluida={onAlternarConcluida}
                onExcluir={onExcluir}
              />
            ))}
          </ul>
        </section>
      )}

      {/* Tarefas concluídas (separadas visualmente) */}
      {concluidas.length > 0 && (
        <section>
          <div className="flex items-center gap-3 mb-2 px-1">
            <span className="text-xs font-medium text-[#3f3f46] uppercase tracking-wider">
              Concluídas
            </span>
            <div className="flex-1 h-px bg-[#1c1c1c]" />
            <span className="text-xs text-[#3f3f46]">{concluidas.length}</span>
          </div>
          <ul className="flex flex-col gap-2">
            {concluidas.map(tarefa => (
              <TaskItem
                key={tarefa.id}
                tarefa={tarefa}
                onAlternarConcluida={onAlternarConcluida}
                onExcluir={onExcluir}
              />
            ))}
          </ul>
        </section>
      )}
    </div>
  )
}
