'use client'

import { useState } from 'react'
import { Categoria, MesAno } from '@/types'
import Tabs from '@/components/Tabs'
import MonthNavigator from '@/components/MonthNavigator'
import TaskList from '@/components/TaskList'
import AddTask from '@/components/AddTask'
import { useTarefas } from '@/hooks/useTarefas'

export default function Home() {
  const agora = new Date()

  // Estado do mês/ano navegado (começa no mês atual)
  const [mesAno, setMesAno] = useState<MesAno>({
    mes: agora.getMonth() + 1,
    ano: agora.getFullYear(),
  })

  // Categoria selecionada (aba ativa)
  const [categoriaAtiva, setCategoriaAtiva] = useState<Categoria>('trabalho')

  // Hook com toda a lógica de dados
  const { tarefas, carregando, erro, adicionarTarefa, alternarConcluida, excluirTarefa } =
    useTarefas(mesAno, categoriaAtiva)

  // Navega para o mês anterior
  const irParaMesAnterior = () => {
    setMesAno(prev => {
      if (prev.mes === 1) {
        return { mes: 12, ano: prev.ano - 1 }
      }
      return { mes: prev.mes - 1, ano: prev.ano }
    })
  }

  // Navega para o próximo mês
  const irParaProximoMes = () => {
    setMesAno(prev => {
      if (prev.mes === 12) {
        return { mes: 1, ano: prev.ano + 1 }
      }
      return { mes: prev.mes + 1, ano: prev.ano }
    })
  }

  // Contagem de tarefas concluídas e pendentes
  const concluidas = tarefas.filter(t => t.concluida).length
  const total = tarefas.length

  return (
    <main className="min-h-screen bg-[#0a0a0a]">
      <div className="max-w-lg mx-auto px-4 py-10 sm:py-14">

        {/* Cabeçalho */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-semibold text-[#f5f5f5] tracking-tight">
            Organizador
          </h1>
          <span className="text-xs text-[#3f3f46]">
            Lucas
          </span>
        </header>

        {/* Navegação de mês */}
        <MonthNavigator
          mesAno={mesAno}
          onAnterior={irParaMesAnterior}
          onProximo={irParaProximoMes}
        />

        {/* Abas de categoria */}
        <Tabs
          categoriaAtiva={categoriaAtiva}
          onMudarCategoria={setCategoriaAtiva}
        />

        {/* Campo para adicionar nova tarefa */}
        <AddTask onAdicionar={adicionarTarefa} />

        {/* Mensagem de erro */}
        {erro && (
          <div className="mb-4 px-4 py-3 rounded-lg bg-red-950/30 border border-red-900/50 text-red-400 text-sm">
            {erro}
          </div>
        )}

        {/* Progresso de tarefas */}
        {total > 0 && (
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-0.5 bg-[#1c1c1c] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#6366f1] rounded-full transition-all duration-500"
                style={{ width: `${(concluidas / total) * 100}%` }}
              />
            </div>
            <span className="text-xs text-[#3f3f46] tabular-nums whitespace-nowrap">
              {concluidas} / {total}
            </span>
          </div>
        )}

        {/* Lista de tarefas */}
        <TaskList
          tarefas={tarefas}
          carregando={carregando}
          onAlternarConcluida={alternarConcluida}
          onExcluir={excluirTarefa}
        />
      </div>
    </main>
  )
}
