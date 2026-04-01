'use client'

import { useState, KeyboardEvent } from 'react'

interface AddTaskProps {
  onAdicionar: (descricao: string) => void
}

export default function AddTask({ onAdicionar }: AddTaskProps) {
  const [valor, setValor] = useState('')

  const handleAdicionar = () => {
    if (!valor.trim()) return
    onAdicionar(valor)
    setValor('')
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleAdicionar()
    }
  }

  return (
    <div className="relative mb-6">
      <input
        type="text"
        value={valor}
        onChange={(e) => setValor(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Adicionar tarefa..."
        maxLength={200}
        className="
          w-full pl-4 pr-12 py-3 rounded-xl text-sm
          bg-[#111111] border border-[#222222]
          text-[#f5f5f5] placeholder-[#3f3f46]
          focus:outline-none focus:border-[#6366f1]
          transition-colors duration-150
        "
      />
      <button
        onClick={handleAdicionar}
        disabled={!valor.trim()}
        aria-label="Adicionar tarefa"
        className="
          absolute right-2 top-1/2 -translate-y-1/2
          w-8 h-8 flex items-center justify-center rounded-lg
          bg-[#6366f1] text-white
          hover:bg-[#818cf8] active:scale-95
          disabled:opacity-20 disabled:cursor-not-allowed disabled:hover:bg-[#6366f1] disabled:active:scale-100
          transition-all duration-150 cursor-pointer
        "
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  )
}
