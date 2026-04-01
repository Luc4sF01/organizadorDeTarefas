'use client'

import { useState, useEffect, useRef } from 'react'
import { supabase } from '@/lib/supabase'
import { Tarefa, MESES, CATEGORIAS, PRIORIDADE_CONFIG } from '@/types'

interface SearchBarProps {
  onFechar: () => void
}

export default function SearchBar({ onFechar }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [resultados, setResultados] = useState<Tarefa[]>([])
  const [buscando, setBuscando] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onFechar()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onFechar])

  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current)

    if (!query.trim()) {
      setResultados([])
      return
    }

    timerRef.current = setTimeout(async () => {
      setBuscando(true)
      const { data } = await supabase
        .from('tarefas')
        .select('*')
        .ilike('descricao', `%${query.trim()}%`)
        .order('ano', { ascending: false })
        .order('mes', { ascending: false })
        .limit(20)

      setResultados(data ?? [])
      setBuscando(false)
    }, 300)
  }, [query])

  return (
    <div className="mb-6 animate-slide-down">
      {/* Input de busca */}
      <div className="relative mb-3">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-tx-4">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar em todas as tarefas..."
          className="
            w-full pl-9 pr-10 py-3 rounded-xl text-sm
            bg-surface border border-bd text-tx placeholder-tx-5
            focus:outline-none focus:border-accent
            transition-colors
          "
        />
        <button
          onClick={onFechar}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-tx-4 hover:text-tx transition-colors cursor-pointer"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>

      {/* Resultados */}
      {buscando && (
        <div className="flex items-center gap-2 px-1 py-2 text-xs text-tx-4">
          <div className="w-3 h-3 border border-tx-5 border-t-accent rounded-full animate-spin" />
          Buscando...
        </div>
      )}

      {!buscando && query && resultados.length === 0 && (
        <p className="text-xs text-tx-4 px-1 py-2">Nenhum resultado para "{query}"</p>
      )}

      {resultados.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {resultados.map(t => (
            <li
              key={t.id}
              className="px-4 py-3 rounded-xl bg-surface border border-bd hover:border-bd-hi hover:bg-high transition-all duration-150"
            >
              <div className="flex items-start gap-2">
                <div
                  className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0"
                  style={{ backgroundColor: PRIORIDADE_CONFIG[t.prioridade]?.cor ?? '#52525b' }}
                />
                <div className="flex-1 min-w-0">
                  <p className={`text-sm ${t.concluida ? 'text-tx-4 line-through' : 'text-tx'}`}>
                    {t.descricao}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-tx-4">{CATEGORIAS[t.categoria]}</span>
                    <span className="text-tx-5">·</span>
                    <span className="text-xs text-tx-4">{MESES[t.mes - 1]} {t.ano}</span>
                    {t.tags?.length > 0 && (
                      <>
                        <span className="text-tx-5">·</span>
                        <span className="text-xs text-accent/70">{t.tags.join(', ')}</span>
                      </>
                    )}
                  </div>
                </div>
                {t.concluida && (
                  <div className="w-4 h-4 rounded-sm bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <svg width="8" height="8" viewBox="0 0 12 12" fill="none" stroke="#6366f1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  </div>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
