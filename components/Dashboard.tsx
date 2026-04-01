'use client'

import { useDashboard } from '@/hooks/useDashboard'
import { MesAno, MESES, CATEGORIAS } from '@/types'
import { supabase } from '@/lib/supabase'
import { useState } from 'react'

interface DashboardProps {
  mesAno: MesAno
  onFechar: () => void
}

export default function Dashboard({ mesAno, onFechar }: DashboardProps) {
  const { stats, streak, chart, carregando } = useDashboard(mesAno)
  const [exportando, setExportando] = useState(false)

  const maxBarra = Math.max(...chart.map(b => b.total), 1)

  const exportarTXT = async () => {
    setExportando(true)
    try {
      const { data } = await supabase
        .from('tarefas')
        .select('*')
        .eq('mes', mesAno.mes)
        .eq('ano', mesAno.ano)
        .order('categoria')
        .order('concluida')

      if (!data) return

      let txt = `ORGANIZADOR DE TAREFAS — ${MESES[mesAno.mes - 1]} ${mesAno.ano}\n`
      txt += '='.repeat(50) + '\n\n'

      const grupos = ['trabalho', 'estudos', 'pessoal'] as const
      for (const cat of grupos) {
        const tarefasCat = data.filter(t => t.categoria === cat)
        if (tarefasCat.length === 0) continue
        txt += `${CATEGORIAS[cat].toUpperCase()}\n${'-'.repeat(20)}\n`
        tarefasCat.forEach(t => {
          txt += `${t.concluida ? '[✓]' : '[ ]'} ${t.descricao}`
          if (t.tags?.length) txt += ` [${t.tags.join(', ')}]`
          if (t.nota) txt += `\n     → ${t.nota}`
          txt += '\n'
        })
        txt += '\n'
      }

      txt += `\nGerado em ${new Date().toLocaleDateString('pt-BR')}\n`

      const blob = new Blob([txt], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tarefas-${MESES[mesAno.mes - 1].toLowerCase()}-${mesAno.ano}.txt`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExportando(false)
    }
  }

  return (
    <div className="mb-6 animate-slide-down">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-sm font-semibold text-tx">Dashboard — {MESES[mesAno.mes - 1]}</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={exportarTXT}
            disabled={exportando}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-tx-3 border border-bd hover:text-tx hover:border-bd-hi transition-all cursor-pointer disabled:opacity-50"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Exportar TXT
          </button>
          <button
            onClick={onFechar}
            className="w-7 h-7 flex items-center justify-center rounded-lg text-tx-4 hover:text-tx hover:bg-hover transition-colors cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {carregando ? (
        <div className="grid grid-cols-2 gap-2 mb-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 rounded-xl bg-surface border border-bd animate-pulse" />
          ))}
        </div>
      ) : (
        <>
          {/* Cards de stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <StatCard label="Total" value={stats.total} icon="📋" />
            <StatCard label="Concluídas" value={stats.concluidas} icon="✅" accent />
            <StatCard label="Pendentes" value={stats.pendentes} icon="⏳" />
            <StatCard label="Conclusão" value={`${stats.taxa}%`} icon="📊" accent />
          </div>

          {/* Streak */}
          {streak > 0 && (
            <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-bd mb-4">
              <span className="text-2xl">🔥</span>
              <div>
                <p className="text-sm font-semibold text-tx">{streak} dia{streak > 1 ? 's' : ''} seguido{streak > 1 ? 's' : ''}</p>
                <p className="text-xs text-tx-4">completando tarefas</p>
              </div>
            </div>
          )}

          {/* Gráfico de barras — últimos 6 meses */}
          <div className="p-4 rounded-xl bg-surface border border-bd">
            <p className="text-xs text-tx-4 font-medium uppercase tracking-wide mb-4">Últimos 6 meses</p>
            <div className="flex items-end justify-between gap-2 h-24">
              {chart.map((bar, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col justify-end gap-0.5" style={{ height: '80px' }}>
                    {/* Barra total (fundo) */}
                    <div
                      className="w-full rounded-t-sm bg-bd transition-all duration-500"
                      style={{ height: `${Math.round((bar.total / maxBarra) * 80)}px`, minHeight: bar.total > 0 ? '4px' : '0' }}
                    />
                  </div>
                  {/* Sobreposição das concluídas — reimplementado como barra absoluta */}
                  <span className="text-[10px] text-tx-4">{bar.label}</span>
                </div>
              ))}
            </div>
            {/* Legenda alternativa: lista */}
            <div className="mt-3 flex flex-col gap-1">
              {chart.map((bar, i) => (
                <div key={i} className="flex items-center gap-2 text-xs">
                  <span className="w-8 text-tx-4 flex-shrink-0">{bar.label}</span>
                  <div className="flex-1 h-1.5 bg-bd rounded-full overflow-hidden">
                    <div
                      className="h-full bg-accent rounded-full transition-all duration-500"
                      style={{ width: bar.total > 0 ? `${(bar.concluidas / bar.total) * 100}%` : '0%' }}
                    />
                  </div>
                  <span className="text-tx-4 w-12 text-right">{bar.concluidas}/{bar.total}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({ label, value, icon, accent }: { label: string; value: string | number; icon: string; accent?: boolean }) {
  return (
    <div className={`px-4 py-3 rounded-xl border ${accent ? 'bg-accent-sub border-accent/20' : 'bg-surface border-bd'}`}>
      <div className="flex items-center gap-2 mb-1">
        <span className="text-sm">{icon}</span>
        <span className="text-xs text-tx-4">{label}</span>
      </div>
      <p className={`text-xl font-semibold ${accent ? 'text-accent' : 'text-tx'}`}>{value}</p>
    </div>
  )
}
