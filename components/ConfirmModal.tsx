'use client'

import { useEffect } from 'react'

interface ConfirmModalProps {
  mensagem?: string
  onConfirmar: () => void
  onCancelar: () => void
}

export default function ConfirmModal({
  mensagem = 'Tem certeza que quer excluir esta tarefa?',
  onConfirmar,
  onCancelar,
}: ConfirmModalProps) {
  // Fecha com Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCancelar()
      if (e.key === 'Enter') onConfirmar()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onCancelar, onConfirmar])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      onClick={onCancelar}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Painel */}
      <div
        className="
          relative w-full max-w-sm p-6 rounded-2xl
          bg-surface border border-bd
          shadow-2xl animate-scale-in
        "
        onClick={e => e.stopPropagation()}
      >
        {/* Ícone de aviso */}
        <div className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-4 mx-auto">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="3 6 5 6 21 6" />
            <path d="M19 6l-1 14H6L5 6" />
            <path d="M10 11v6M14 11v6" />
            <path d="M9 6V4h6v2" />
          </svg>
        </div>

        <p className="text-center text-tx text-sm mb-6 leading-relaxed">
          {mensagem}
        </p>

        <div className="flex gap-2">
          <button
            onClick={onCancelar}
            className="
              flex-1 px-4 py-2.5 rounded-xl text-sm font-medium
              bg-high border border-bd text-tx-3
              hover:text-tx hover:border-bd-hi
              transition-all duration-150 cursor-pointer
            "
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            className="
              flex-1 px-4 py-2.5 rounded-xl text-sm font-medium
              bg-red-600 text-white
              hover:bg-red-500 active:scale-95
              transition-all duration-150 cursor-pointer
            "
          >
            Excluir
          </button>
        </div>
      </div>
    </div>
  )
}
