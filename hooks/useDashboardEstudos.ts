'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'

interface DashboardEstudos {
  streak: number
  horasSemana: number
  totalRegistros: number
  carregando: boolean
}

export function useDashboardEstudos(): DashboardEstudos {
  const [streak, setStreak] = useState(0)
  const [horasSemana, setHorasSemana] = useState(0)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [carregando, setCarregando] = useState(true)

  useEffect(() => {
    async function buscar() {
      setCarregando(true)

      const { data } = await supabase
        .from('registros_estudo')
        .select('estudado_em, duracao_minutos')
        .order('estudado_em', { ascending: false })

      if (!data) { setCarregando(false); return }

      setTotalRegistros(data.length)

      // Horas na semana (últimos 7 dias)
      const semanaAtras = new Date()
      semanaAtras.setDate(semanaAtras.getDate() - 7)
      const semanaStr = semanaAtras.toISOString().slice(0, 10)
      const minutosSemana = data
        .filter(r => r.estudado_em >= semanaStr)
        .reduce((acc, r) => acc + (r.duracao_minutos ?? 0), 0)
      setHorasSemana(Math.round((minutosSemana / 60) * 10) / 10)

      // Streak: dias consecutivos com pelo menos 1 registro
      const diasUnicos = [...new Set(data.map(r => r.estudado_em))].sort().reverse()
      let streakCount = 0
      const hoje = new Date()
      hoje.setHours(0, 0, 0, 0)

      for (let i = 0; i < 365; i++) {
        const dia = new Date(hoje)
        dia.setDate(dia.getDate() - i)
        const diaStr = dia.toISOString().slice(0, 10)
        if (diasUnicos.includes(diaStr)) {
          streakCount++
        } else if (i > 0) {
          break
        }
      }
      setStreak(streakCount)
      setCarregando(false)
    }

    buscar()
  }, [])

  return { streak, horasSemana, totalRegistros, carregando }
}
