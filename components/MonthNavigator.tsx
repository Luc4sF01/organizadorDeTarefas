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
          border border-bd text-tx-4
          hover:border-bd-hi hover:text-tx hover:bg-hover
          transition-all duration-150 cursor-pointer
        "
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      <div className="flex items-baseline gap-2.5">
        <h2 className="text-xl font-semibold text-tx tracking-tight">
          {nomeMes}
        </h2>
        <span className="text-sm text-tx-4 font-normal">{mesAno.ano}</span>
        {ehMesAtual && (
          <span className="text-xs text-accent font-medium px-1.5 py-0.5 rounded bg-accent-sub">
            atual
          </span>
        )}
      </div>

      <button
        onClick={onProximo}
        aria-label="Próximo mês"
        className="
          w-8 h-8 flex items-center justify-center rounded-lg
          border border-bd text-tx-4
          hover:border-bd-hi hover:text-tx hover:bg-hover
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
