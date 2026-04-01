'use client'

import { useState, KeyboardEvent } from 'react'
import { Prioridade, PRIORIDADE_CONFIG } from '@/types'

interface AddTaskProps {
  onAdicionar: (descricao: string, prioridade: Prioridade, tags: string[], recorrente: boolean) => void
}

export default function AddTask({ onAdicionar }: AddTaskProps) {
  const [valor, setValor] = useState('')
  const [prioridade, setPrioridade] = useState<Prioridade>('media')
  const [recorrente, setRecorrente] = useState(false)
  const [expandido, setExpandido] = useState(false)

  const handleAdicionar = () => {
    if (!valor.trim()) return
    onAdicionar(valor, prioridade, [], recorrente)
    setValor('')
    setPrioridade('media')
    setRecorrente(false)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleAdicionar()
    if (e.key === 'Escape') setExpandido(false)
  }

  return (
    <div className="mb-6">
      {/* Input principal */}
      <div className="relative flex items-center">
        <input
          type="text"
          value={valor}
          onChange={e => setValor(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => setExpandido(true)}
          placeholder="Adicionar tarefa..."
          maxLength={200}
          className="
            w-full pl-4 pr-20 py-3 rounded-xl text-sm
            bg-surface border border-bd text-tx placeholder-tx-5
            focus:outline-none focus:border-accent
            transition-colors duration-150
          "
        />
        {/* Indicador de prioridade + opções */}
        <div className="absolute right-2 flex items-center gap-1">
          {/* Dot de prioridade (clicável para alternar) */}
          <button
            type="button"
            onClick={() => {
              const ordem: Prioridade[] = ['baixa', 'media', 'urgente']
              const idx = ordem.indexOf(prioridade)
              setPrioridade(ordem[(idx + 1) % 3])
            }}
            title={`Prioridade: ${PRIORIDADE_CONFIG[prioridade].label}`}
            className="w-6 h-6 flex items-center justify-center rounded-md hover:bg-hover transition-colors cursor-pointer"
          >
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: PRIORIDADE_CONFIG[prioridade].cor }}
            />
          </button>

          {/* Botão recorrente */}
          <button
            type="button"
            onClick={() => setRecorrente(r => !r)}
            title={recorrente ? 'Tarefa recorrente (ativada)' : 'Tornar recorrente'}
            className={`w-6 h-6 flex items-center justify-center rounded-md transition-colors cursor-pointer ${recorrente ? 'text-accent' : 'text-tx-5 hover:text-tx-3'}`}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M23 4v6h-6" />
              <path d="M1 20v-6h6" />
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
          </button>

          {/* Botão adicionar */}
          <button
            onClick={handleAdicionar}
            disabled={!valor.trim()}
            aria-label="Adicionar tarefa"
            className="
              w-7 h-7 flex items-center justify-center rounded-lg
              bg-accent text-white
              hover:bg-accent-hi active:scale-95
              disabled:opacity-20 disabled:cursor-not-allowed disabled:active:scale-100
              transition-all duration-150 cursor-pointer
            "
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14" />
            </svg>
          </button>
        </div>
      </div>

      {/* Dica rápida de atalhos */}
      {expandido && valor && (
        <p className="text-[10px] text-tx-5 mt-1.5 px-1 animate-fade-in">
          Enter para adicionar · dot colorido = prioridade · ↺ = recorrente
        </p>
      )}
    </div>
  )
}
