'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { RegistroEstudo } from '@/types'

interface NovoRegistro {
  titulo: string
  categoria_id: string | null
  duracao_minutos: number
  confianca: 1 | 2 | 3
  anotacao: string
}

export function useEstudos(filtroCategoria: string | null, busca: string) {
  const [registros, setRegistros] = useState<RegistroEstudo[]>([])
  const [carregando, setCarregando] = useState(true)

  const buscar = useCallback(async () => {
    setCarregando(true)
    let query = supabase
      .from('registros_estudo')
      .select('*')
      .order('estudado_em', { ascending: false })

    if (filtroCategoria) query = query.eq('categoria_id', filtroCategoria)
    if (busca.trim()) query = query.ilike('titulo', `%${busca.trim()}%`)

    const { data } = await query
    setRegistros(data ?? [])
    setCarregando(false)
  }, [filtroCategoria, busca])

  useEffect(() => { buscar() }, [buscar])

  const registrar = useCallback(async (novo: NovoRegistro) => {
    const hoje = new Date().toISOString().slice(0, 10)
    const { data, error } = await supabase
      .from('registros_estudo')
      .insert([{ ...novo, estudado_em: hoje, anotacao: novo.anotacao || null }])
      .select()
      .single()

    if (error || !data) return false

    setRegistros(prev => [data, ...prev])

    // Cria revisões automáticas para confiança 1 ou 2
    if (novo.confianca < 3) {
      const diasRevisao = [1, 3, 7]
      const revisoes = diasRevisao.map(dias => {
        const data_revisao = new Date()
        data_revisao.setDate(data_revisao.getDate() + dias)
        return { registro_id: data.id, revisar_em: data_revisao.toISOString().slice(0, 10) }
      })
      await supabase.from('revisoes').insert(revisoes)
    }

    return true
  }, [])

  return { registros, carregando, registrar }
}
