'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Categoria, MesAno } from '@/types'

type Contadores = Record<Categoria, number>

export function useContadores(mesAno: MesAno) {
  const [contadores, setContadores] = useState<Contadores>({ trabalho: 0, estudos: 0, pessoal: 0 })

  useEffect(() => {
    async function buscar() {
      const { data } = await supabase
        .from('tarefas')
        .select('categoria')
        .eq('mes', mesAno.mes)
        .eq('ano', mesAno.ano)
        .eq('concluida', false)

      if (data) {
        const counts: Contadores = { trabalho: 0, estudos: 0, pessoal: 0 }
        data.forEach(t => { counts[t.categoria as Categoria]++ })
        setContadores(counts)
      }
    }
    buscar()
  }, [mesAno.mes, mesAno.ano])

  return contadores
}
