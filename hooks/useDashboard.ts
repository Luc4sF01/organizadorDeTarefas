'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { MesAno, MESES_CURTO } from '@/types'

export interface DashboardStats {
  total: number
  concluidas: number
  pendentes: number
  taxa: number
}

export interface ChartBar {
  label: string
  total: number
  concluidas: number
}

export interface DashboardData {
  stats: DashboardStats
  streak: number
  chart: ChartBar[]
  carregando: boolean
}

function getUltimos6Meses(mesAno: MesAno): MesAno[] {
  const result: MesAno[] = []
  let { mes, ano } = mesAno

  for (let i = 0; i < 6; i++) {
    result.unshift({ mes, ano })
    mes--
    if (mes === 0) { mes = 12; ano-- }
  }
  return result
}

export function useDashboard(mesAno: MesAno): DashboardData {
  const [stats, setStats] = useState<DashboardStats>({ total: 0, concluidas: 0, pendentes: 0, taxa: 0 })
  const [streak, setStreak] = useState(0)
  const [chart, setChart] = useState<ChartBar[]>([])
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function buscar() {
      setCarregando(true)

      const periodos = getUltimos6Meses(mesAno)
      const primeiro = periodos[0]

      try {
        // Busca todos os dados dos últimos 6 meses em uma query
        const { data: todasTarefas } = await supabase
          .from('tarefas')
          .select('mes, ano, concluida, concluida_em')
          .or(
            periodos.map(p => `and(mes.eq.${p.mes},ano.eq.${p.ano})`).join(',')
          )

        if (!todasTarefas) return

        // Stats do mês atual
        const doMes = todasTarefas.filter(t => t.mes === mesAno.mes && t.ano === mesAno.ano)
        const concluidas = doMes.filter(t => t.concluida).length
        const total = doMes.length
        setStats({
          total,
          concluidas,
          pendentes: total - concluidas,
          taxa: total > 0 ? Math.round((concluidas / total) * 100) : 0,
        })

        // Chart dos últimos 6 meses
        const bars: ChartBar[] = periodos.map(p => {
          const do_periodo = todasTarefas.filter(t => t.mes === p.mes && t.ano === p.ano)
          return {
            label: MESES_CURTO[p.mes - 1],
            total: do_periodo.length,
            concluidas: do_periodo.filter(t => t.concluida).length,
          }
        })
        setChart(bars)

        // Streak: dias consecutivos com ao menos 1 tarefa concluída
        const datas = todasTarefas
          .filter(t => t.concluida_em)
          .map(t => t.concluida_em!.slice(0, 10)) // "YYYY-MM-DD"

        const datasUnicas = [...new Set(datas)].sort().reverse()

        let streakCount = 0
        const hoje = new Date()
        hoje.setHours(0, 0, 0, 0)

        for (let i = 0; i < 365; i++) {
          const dia = new Date(hoje)
          dia.setDate(dia.getDate() - i)
          const diaStr = dia.toISOString().slice(0, 10)

          if (datasUnicas.includes(diaStr)) {
            streakCount++
          } else if (i > 0) {
            break
          }
        }
        setStreak(streakCount)

      } catch (err) {
        console.error('Erro no dashboard:', err)
      } finally {
        setCarregando(false)
      }
    }

    buscar()
  }, [mesAno.mes, mesAno.ano])

  return { stats, streak, chart, carregando }
}
