'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Subtarefa } from '@/types'

export function useSubtarefas(tarefaId: string, ativo: boolean) {
  const [subtarefas, setSubtarefas] = useState<Subtarefa[]>([])
  const [carregando, setCarregando] = useState(false)

  const buscar = useCallback(async () => {
    setCarregando(true)
    const { data } = await supabase
      .from('subtarefas')
      .select('*')
      .eq('tarefa_id', tarefaId)
      .order('created_at', { ascending: true })
    setSubtarefas(data ?? [])
    setCarregando(false)
  }, [tarefaId])

  useEffect(() => {
    if (ativo) buscar()
  }, [ativo, buscar])

  const adicionar = useCallback(async (descricao: string) => {
    if (!descricao.trim()) return
    const { data, error } = await supabase
      .from('subtarefas')
      .insert([{ tarefa_id: tarefaId, descricao: descricao.trim() }])
      .select()
      .single()
    if (!error && data) setSubtarefas(prev => [...prev, data])
  }, [tarefaId])

  const alternarConcluida = useCallback(async (id: string, concluida: boolean) => {
    setSubtarefas(prev => prev.map(s => s.id === id ? { ...s, concluida: !concluida } : s))
    await supabase.from('subtarefas').update({ concluida: !concluida }).eq('id', id)
  }, [])

  const excluir = useCallback(async (id: string) => {
    setSubtarefas(prev => prev.filter(s => s.id !== id))
    await supabase.from('subtarefas').delete().eq('id', id)
  }, [])

  return { subtarefas, carregando, adicionar, alternarConcluida, excluir }
}
