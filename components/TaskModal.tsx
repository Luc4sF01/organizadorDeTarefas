'use client'

import { useState, useEffect, KeyboardEvent } from 'react'
import { Tarefa, Prioridade, PRIORIDADE_CONFIG } from '@/types'

interface TaskModalProps {
  tarefa: Tarefa
  onSalvar: (campos: Partial<Pick<Tarefa, 'descricao' | 'nota' | 'prioridade' | 'tags' | 'recorrente'>>) => void
  onFechar: () => void
}

export default function TaskModal({ tarefa, onSalvar, onFechar }: TaskModalProps) {
  const [descricao, setDescricao] = useState(tarefa.descricao)
  const [nota, setNota] = useState(tarefa.nota ?? '')
  const [prioridade, setPrioridade] = useState<Prioridade>(tarefa.prioridade)
  const [tags, setTags] = useState<string[]>(tarefa.tags ?? [])
  const [tagInput, setTagInput] = useState('')
  const [recorrente, setRecorrente] = useState(tarefa.recorrente)

  useEffect(() => {
    const handler = (e: globalThis.KeyboardEvent) => {
      if (e.key === 'Escape') onFechar()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onFechar])

  const handleSalvar = () => {
    if (!descricao.trim()) return
    onSalvar({
      descricao: descricao.trim(),
      nota: nota.trim() || null,
      prioridade,
      tags,
      recorrente,
    })
    onFechar()
  }

  const adicionarTag = () => {
    const tag = tagInput.trim().toLowerCase()
    if (tag && !tags.includes(tag)) {
      setTags(prev => [...prev, tag])
    }
    setTagInput('')
  }

  const removerTag = (tag: string) => setTags(prev => prev.filter(t => t !== tag))

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      adicionarTag()
    }
    if (e.key === 'Backspace' && !tagInput && tags.length > 0) {
      setTags(prev => prev.slice(0, -1))
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fade-in"
      onClick={onFechar}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Painel */}
      <div
        className="
          relative w-full sm:max-w-md
          bg-surface border border-bd
          rounded-t-2xl sm:rounded-2xl
          p-6 shadow-2xl animate-slide-up sm:animate-scale-in
        "
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-tx font-semibold text-sm">Editar tarefa</h2>
          <button
            onClick={onFechar}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-tx-4 hover:text-tx hover:bg-hover transition-colors cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {/* Descrição */}
          <div>
            <label className="block text-xs text-tx-4 mb-1.5 font-medium uppercase tracking-wide">Descrição</label>
            <input
              type="text"
              value={descricao}
              onChange={e => setDescricao(e.target.value)}
              className="
                w-full px-3 py-2.5 rounded-lg text-sm
                bg-high border border-bd text-tx placeholder-tx-5
                focus:outline-none focus:border-accent
                transition-colors
              "
            />
          </div>

          {/* Prioridade */}
          <div>
            <label className="block text-xs text-tx-4 mb-1.5 font-medium uppercase tracking-wide">Prioridade</label>
            <div className="flex gap-2">
              {(Object.keys(PRIORIDADE_CONFIG) as Prioridade[]).map(p => {
                const cfg = PRIORIDADE_CONFIG[p]
                const ativa = prioridade === p
                return (
                  <button
                    key={p}
                    onClick={() => setPrioridade(p)}
                    style={ativa ? { borderColor: cfg.cor, color: cfg.cor, backgroundColor: cfg.corBg } : {}}
                    className={`
                      flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs font-medium
                      border transition-all duration-150 cursor-pointer
                      ${ativa ? 'border-opacity-100' : 'border-bd text-tx-4 hover:border-bd-hi hover:text-tx-3'}
                    `}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: cfg.cor }}
                    />
                    {cfg.label}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs text-tx-4 mb-1.5 font-medium uppercase tracking-wide">Tags</label>
            <div className="flex flex-wrap gap-1.5 p-2 rounded-lg bg-high border border-bd min-h-[42px] items-center">
              {tags.map(tag => (
                <span
                  key={tag}
                  className="flex items-center gap-1 px-2 py-0.5 rounded-md text-xs bg-accent-sub text-accent border border-accent/20"
                >
                  {tag}
                  <button onClick={() => removerTag(tag)} className="text-accent/60 hover:text-accent cursor-pointer">×</button>
                </span>
              ))}
              <input
                type="text"
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                onBlur={adicionarTag}
                placeholder={tags.length === 0 ? 'Adicionar tag...' : ''}
                className="flex-1 min-w-[80px] bg-transparent text-xs text-tx placeholder-tx-5 focus:outline-none"
              />
            </div>
            <p className="text-xs text-tx-5 mt-1">Pressione Enter ou vírgula para adicionar</p>
          </div>

          {/* Nota */}
          <div>
            <label className="block text-xs text-tx-4 mb-1.5 font-medium uppercase tracking-wide">Observação</label>
            <textarea
              value={nota}
              onChange={e => setNota(e.target.value)}
              rows={3}
              placeholder="Anotações, links, contexto..."
              className="
                w-full px-3 py-2.5 rounded-lg text-sm resize-none
                bg-high border border-bd text-tx placeholder-tx-5
                focus:outline-none focus:border-accent
                transition-colors
              "
            />
          </div>

          {/* Recorrente */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setRecorrente(r => !r)}
              className={`
                w-10 h-5 rounded-full transition-all duration-200 relative flex-shrink-0
                ${recorrente ? 'bg-accent' : 'bg-high border border-bd'}
              `}
            >
              <div className={`
                w-4 h-4 rounded-full bg-white shadow absolute top-0.5
                transition-all duration-200
                ${recorrente ? 'translate-x-5' : 'translate-x-0.5'}
              `} />
            </div>
            <div>
              <span className="text-sm text-tx">Tarefa recorrente</span>
              <p className="text-xs text-tx-4">Recria automaticamente no próximo mês ao concluir</p>
            </div>
          </label>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={onFechar}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-high border border-bd text-tx-3 hover:text-tx hover:border-bd-hi transition-all cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSalvar}
            disabled={!descricao.trim()}
            className="flex-1 px-4 py-2.5 rounded-xl text-sm font-medium bg-accent text-white hover:bg-accent-hi disabled:opacity-30 transition-all cursor-pointer"
          >
            Salvar
          </button>
        </div>
      </div>
    </div>
  )
}
