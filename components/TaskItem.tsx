'use client'

import { Tarefa } from '@/types'

interface TaskItemProps {
  tarefa: Tarefa
  onAlternarConcluida: (id: string, concluida: boolean) => void
  onExcluir: (id: string) => void
}

export default function TaskItem({ tarefa, onAlternarConcluida, onExcluir }: TaskItemProps) {
  return (
    <li className={`
      group flex items-center gap-3 px-4 py-3.5 rounded-xl
      border border-l-2 animate-slide-in
      transition-all duration-150
      ${tarefa.concluida
        ? 'bg-[#0e0e0e] border-[#1a1a1a] border-l-[#1a1a1a]'
        : 'bg-[#111111] border-[#1c1c1c] border-l-[#6366f1] hover:border-[#2a2a2a] hover:bg-[#161616]'
      }
    `}>
      {/* Checkbox customizado */}
      <button
        onClick={() => onAlternarConcluida(tarefa.id, tarefa.concluida)}
        aria-label={tarefa.concluida ? 'Marcar como pendente' : 'Marcar como concluída'}
        className="flex-shrink-0 cursor-pointer"
      >
        <div className={`
          w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center
          transition-all duration-200
          ${tarefa.concluida
            ? 'bg-[#6366f1] border-[#6366f1]'
            : 'border-[#3f3f46] hover:border-[#6366f1]'
          }
        `}>
          {tarefa.concluida && (
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 6l3 3 5-5" />
            </svg>
          )}
        </div>
      </button>

      {/* Descrição da tarefa */}
      <span className={`
        flex-1 text-sm leading-relaxed
        transition-all duration-200
        ${tarefa.concluida
          ? 'text-[#3f3f46] line-through decoration-[#2a2a2a]'
          : 'text-[#d4d4d8]'
        }
      `}>
        {tarefa.descricao}
      </span>

      {/* Botão de excluir — sempre visível, realça no hover */}
      <button
        onClick={() => onExcluir(tarefa.id)}
        aria-label="Excluir tarefa"
        className="
          flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md
          text-[#2a2a2a] group-hover:text-[#52525b] hover:!text-[#ef4444] hover:bg-[#ef444412]
          transition-all duration-150 cursor-pointer
        "
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>
    </li>
  )
}
