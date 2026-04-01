'use client'

import { useState } from 'react'
import { Categoria, MesAno, ViewMode } from '@/types'
import Tabs from '@/components/Tabs'
import MonthNavigator from '@/components/MonthNavigator'
import TaskList from '@/components/TaskList'
import AddTask from '@/components/AddTask'
import SearchBar from '@/components/SearchBar'
import Dashboard from '@/components/Dashboard'
import ThemeToggle from '@/components/ThemeToggle'
import { useTarefas } from '@/hooks/useTarefas'
import { useContadores } from '@/hooks/useContadores'

export default function Home() {
  const agora = new Date()

  const [mesAno, setMesAno] = useState<MesAno>({
    mes: agora.getMonth() + 1,
    ano: agora.getFullYear(),
  })
  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria>('trabalho')
  const [view, setView] = useState<ViewMode>('tarefas')

  const {
    tarefas, carregando, erro,
    adicionarTarefa, alternarConcluida, editarTarefa,
    duplicarTarefa, excluirTarefa, reordenarTarefas,
  } = useTarefas(mesAno, categoriaAtiva)

  const contadores = useContadores(mesAno)

  const irParaMesAnterior = () =>
    setMesAno(prev => prev.mes === 1
      ? { mes: 12, ano: prev.ano - 1 }
      : { mes: prev.mes - 1, ano: prev.ano })

  const irParaProximoMes = () =>
    setMesAno(prev => prev.mes === 12
      ? { mes: 1, ano: prev.ano + 1 }
      : { mes: prev.mes + 1, ano: prev.ano })

  const concluidas = tarefas.filter(t => t.concluida).length
  const total = tarefas.length

  const toggleView = (v: ViewMode) => setView(current => current === v ? 'tarefas' : v)

  return (
    <main className="min-h-screen bg-bg transition-colors duration-200">
      <div className="max-w-lg mx-auto px-4 py-10 sm:py-14">

        {/* ── Header ─────────────────────────────────── */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-semibold text-tx tracking-tight">Organizador</h1>
          <div className="flex items-center gap-1.5">
            {/* Busca */}
            <button
              onClick={() => toggleView('busca')}
              aria-label="Buscar tarefas"
              className={`
                w-8 h-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer
                ${view === 'busca'
                  ? 'border-accent text-accent bg-accent-sub'
                  : 'border-bd text-tx-4 hover:text-tx hover:border-bd-hi hover:bg-hover'}
              `}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>

            {/* Dashboard */}
            <button
              onClick={() => toggleView('dashboard')}
              aria-label="Abrir dashboard"
              className={`
                w-8 h-8 flex items-center justify-center rounded-lg border transition-all cursor-pointer
                ${view === 'dashboard'
                  ? 'border-accent text-accent bg-accent-sub'
                  : 'border-bd text-tx-4 hover:text-tx hover:border-bd-hi hover:bg-hover'}
              `}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="20" x2="18" y2="10" />
                <line x1="12" y1="20" x2="12" y2="4" />
                <line x1="6"  y1="20" x2="6"  y2="14" />
              </svg>
            </button>

            <ThemeToggle />
          </div>
        </header>

        {/* ── Busca ──────────────────────────────────── */}
        {view === 'busca' && (
          <SearchBar onFechar={() => setView('tarefas')} />
        )}

        {/* ── Dashboard ──────────────────────────────── */}
        {view === 'dashboard' && (
          <Dashboard mesAno={mesAno} onFechar={() => setView('tarefas')} />
        )}

        {/* ── View de tarefas ────────────────────────── */}
        {view === 'tarefas' && (
          <>
            <MonthNavigator
              mesAno={mesAno}
              onAnterior={irParaMesAnterior}
              onProximo={irParaProximoMes}
            />

            <Tabs
              categoriaAtiva={categoriaAtiva}
              onMudarCategoria={setCategoriaAtiva}
              contadores={contadores}
            />

            <AddTask onAdicionar={adicionarTarefa} />

            {erro && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 text-sm">
                {erro}
              </div>
            )}

            {/* Barra de progresso */}
            {total > 0 && (
              <div className="flex items-center gap-3 mb-5">
                <div className="flex-1 h-0.5 bg-bd-dim rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{ width: `${(concluidas / total) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-tx-5 tabular-nums">{concluidas} / {total}</span>
              </div>
            )}

            <TaskList
              tarefas={tarefas}
              carregando={carregando}
              onAlternarConcluida={alternarConcluida}
              onExcluir={excluirTarefa}
              onEditar={editarTarefa}
              onDuplicar={duplicarTarefa}
              onReordenar={reordenarTarefas}
            />
          </>
        )}
      </div>
    </main>
  )
}
