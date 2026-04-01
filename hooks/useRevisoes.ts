'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Revisao } from '@/types'

export function useRevisoesHoje() {
  const [revisoes, setRevisoes] = useState<Revisao[]>([])
  const [carregando, setCarregando] = useState(true)

  const hoje = new Date().toISOString().slice(0, 10)

  const buscar = useCallback(async () => {
    setCarregando(true)
    const { data } = await supabase
      .from('revisoes')
      .select('*, registros_estudo(titulo, categoria_id)')
      .eq('revisar_em', hoje)
      .eq('concluida', false)
      .order('created_at')
    setRevisoes(data ?? [])
    setCarregando(false)
  }, [hoje])

  useEffect(() => { buscar() }, [buscar])

  const concluir = useCallback(async (id: string) => {
    setRevisoes(prev => prev.filter(r => r.id !== id))
    await supabase.from('revisoes').update({ concluida: true }).eq('id', id)
  }, [])

  return { revisoes, carregando, concluir }
}
