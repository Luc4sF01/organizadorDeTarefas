'use client'

import { MesAno, MESES } from '@/types'

interface MonthNavigatorProps {
  mesAno: MesAno
  onAnterior: () => void
  onProximo: () => void
}

export default function MonthNavigator({ mesAno, onAnterior, onProximo }: MonthNavigatorProps) {
  const nomeMes = MESES[mesAno.mes - 1]

  const agora = new Date()
  const ehMesAtual = mesAno.mes === agora.getMonth() + 1 && mesAno.ano === agora.getFullYear()

  return (
    <div className="flex items-center justify-between mb-6">
      <button
        onClick={onAnterior}
        aria-label="Mês anterior"
        className="
          w-8 h-8 flex items-center justify-center rounded-lg
          border border-[#222222] text-[#52525b]
          hover:border-[#3a3a3a] hover:text-[#a1a1aa] hover:bg-[#161616]
          transition-all duration-150 cursor-pointer
        "
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="flex items-baseline gap-2.5">
        <h2 className="text-xl font-semibold text-[#f5f5f5] tracking-tight">
          {nomeMes}
        </h2>
        <span className="text-sm text-[#3f3f46] font-normal">
          {mesAno.ano}
        </span>
        {ehMesAtual && (
          <span className="text-xs text-[#6366f1] font-medium px-1.5 py-0.5 rounded bg-[#6366f115]">
            atual
          </span>
        )}
      </div>

      <button
        onClick={onProximo}
        aria-label="Próximo mês"
        className="
          w-8 h-8 flex items-center justify-center rounded-lg
          border border-[#222222] text-[#52525b]
          hover:border-[#3a3a3a] hover:text-[#a1a1aa] hover:bg-[#161616]
          transition-all duration-150 cursor-pointer
        "
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  )
}
