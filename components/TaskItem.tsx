'use client'

import { useState, useRef } from 'react'
import { Tarefa, PRIORIDADE_CONFIG } from '@/types'
import ConfirmModal from './ConfirmModal'
import TaskModal from './TaskModal'

interface TaskItemProps {
  tarefa: Tarefa
  onAlternarConcluida: (id: string, concluida: boolean) => void
  onExcluir: (id: string) => void
  onEditar: (id: string, campos: Partial<Pick<Tarefa, 'descricao' | 'nota' | 'prioridade' | 'tags' | 'recorrente'>>) => void
  onDuplicar: (id: string) => void
  // Drag & drop
  draggable?: boolean
  onDragStart?: (e: React.DragEvent) => void
  onDragOver?: (e: React.DragEvent) => void
  onDrop?: (e: React.DragEvent) => void
  onDragEnd?: (e: React.DragEvent) => void
}

export default function TaskItem({
  tarefa,
  onAlternarConcluida,
  onExcluir,
  onEditar,
  onDuplicar,
  draggable,
  onDragStart,
  onDragOver,
  onDrop,
  onDragEnd,
}: TaskItemProps) {
  const [confirmando, setConfirmando] = useState(false)
  const [editando, setEditando] = useState(false)
  const [notaExpandida, setNotaExpandida] = useState(false)

  const priorCfg = PRIORIDADE_CONFIG[tarefa.prioridade]
  const borderColor = tarefa.concluida ? 'var(--border-dim)' : priorCfg.cor

  return (
    <>
      <li
        draggable={draggable}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDrop={onDrop}
        onDragEnd={onDragEnd}
        className="group relative list-item-in"
        style={{ '--item-border': borderColor } as React.CSSProperties}
      >
        <div
          className={`
            flex items-start gap-3 px-4 py-3.5 rounded-xl
            border border-l-2 border-bd-dim
            transition-all duration-150
            ${tarefa.concluida
              ? 'bg-bg opacity-60'
              : 'bg-surface hover:border-bd hover:bg-high'
            }
          `}
          style={{ borderLeftColor: borderColor }}
        >
          {/* Drag handle */}
          {draggable && (
            <div className="flex-shrink-0 mt-0.5 text-tx-5 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing">
              <svg width="10" height="14" viewBox="0 0 10 14" fill="currentColor">
                <circle cx="3" cy="2.5" r="1.2" /><circle cx="7" cy="2.5" r="1.2" />
                <circle cx="3" cy="7"   r="1.2" /><circle cx="7" cy="7"   r="1.2" />
                <circle cx="3" cy="11.5" r="1.2" /><circle cx="7" cy="11.5" r="1.2" />
              </svg>
            </div>
          )}

          {/* Checkbox */}
          <button
            onClick={() => onAlternarConcluida(tarefa.id, tarefa.concluida)}
            aria-label={tarefa.concluida ? 'Marcar como pendente' : 'Marcar como concluída'}
            className="flex-shrink-0 mt-0.5 cursor-pointer"
          >
            <div
              className={`
                w-[18px] h-[18px] rounded-md border-2 flex items-center justify-center
                transition-all duration-200
                ${tarefa.concluida
                  ? 'border-accent'
                  : 'border-bd-hi hover:border-accent'
                }
              `}
              style={tarefa.concluida ? { backgroundColor: priorCfg.cor, borderColor: priorCfg.cor } : {}}
            >
              {tarefa.concluida && (
                <svg
                  className="animate-check-pop"
                  width="10" height="10" viewBox="0 0 12 12"
                  fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
                >
                  <path d="M2 6l3 3 5-5" />
                </svg>
              )}
            </div>
          </button>

          {/* Conteúdo */}
          <div className="flex-1 min-w-0">
            {/* Descrição */}
            <span className={`
              text-sm leading-relaxed block
              transition-all duration-200
              ${tarefa.concluida ? 'text-tx-4 line-through decoration-tx-5' : 'text-tx'}
            `}>
              {tarefa.descricao}
            </span>

            {/* Tags */}
            {tarefa.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-1.5">
                {tarefa.tags.map(tag => (
                  <span
                    key={tag}
                    className="px-1.5 py-0.5 rounded text-[10px] font-medium bg-accent-sub text-accent/80"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Nota (expandível) */}
            {tarefa.nota && notaExpandida && (
              <p className="mt-2 text-xs text-tx-3 leading-relaxed border-l-2 border-bd-hi pl-2 animate-slide-down">
                {tarefa.nota}
              </p>
            )}

            {/* Indicadores de metadados */}
            <div className="flex items-center gap-2 mt-1.5">
              {tarefa.recorrente && (
                <span className="flex items-center gap-1 text-[10px] text-tx-5">
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M23 4v6h-6M1 20v-6h6" />
                    <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                  </svg>
                  recorrente
                </span>
              )}
              {tarefa.nota && (
                <button
                  onClick={() => setNotaExpandida(n => !n)}
                  className="flex items-center gap-1 text-[10px] text-tx-5 hover:text-tx-3 transition-colors cursor-pointer"
                >
                  <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                  {notaExpandida ? 'ocultar nota' : 'ver nota'}
                </button>
              )}
            </div>
          </div>

          {/* Ações (hover) */}
          <div className="flex items-center gap-0.5 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
            {/* Duplicar */}
            <button
              onClick={() => onDuplicar(tarefa.id)}
              aria-label="Duplicar tarefa"
              className="w-6 h-6 flex items-center justify-center rounded-md text-tx-5 hover:text-tx-2 hover:bg-hover transition-all cursor-pointer"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </button>

            {/* Editar */}
            <button
              onClick={() => setEditando(true)}
              aria-label="Editar tarefa"
              className="w-6 h-6 flex items-center justify-center rounded-md text-tx-5 hover:text-tx-2 hover:bg-hover transition-all cursor-pointer"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>

            {/* Excluir */}
            <button
              onClick={() => setConfirmando(true)}
              aria-label="Excluir tarefa"
              className="w-6 h-6 flex items-center justify-center rounded-md text-tx-5 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </li>

      {/* Modal de confirmação de exclusão */}
      {confirmando && (
        <ConfirmModal
          mensagem={`Excluir "${tarefa.descricao}"?`}
          onConfirmar={() => { setConfirmando(false); onExcluir(tarefa.id) }}
          onCancelar={() => setConfirmando(false)}
        />
      )}

      {/* Modal de edição */}
      {editando && (
        <TaskModal
          tarefa={tarefa}
          onSalvar={(campos) => onEditar(tarefa.id, campos)}
          onFechar={() => setEditando(false)}
        />
      )}
    </>
  )
}
