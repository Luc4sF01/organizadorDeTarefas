'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Tarefa, Categoria, MesAno, NovaTarefa } from '@/types'

export function useTarefas(mesAno: MesAno, categoria: Categoria) {
  const [tarefas, setTarefas] = useState<Tarefa[]>([])
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState<string | null>(null)

  // Migra tarefas não concluídas de meses anteriores para o mês atual
  const migrarTarefasAntigas = useCallback(async () => {
    const agora = new Date()
    const mesAtual = agora.getMonth() + 1
    const anoAtual = agora.getFullYear()

    try {
      // Busca tarefas não concluídas de meses anteriores ao atual
      const { data, error } = await supabase
        .from('tarefas')
        .select('*')
        .eq('concluida', false)
        .or(`ano.lt.${anoAtual},and(ano.eq.${anoAtual},mes.lt.${mesAtual})`)

      if (error) throw error

      if (data && data.length > 0) {
        // Atualiza cada tarefa para o mês/ano atual
        const { error: updateError } = await supabase
          .from('tarefas')
          .update({ mes: mesAtual, ano: anoAtual })
          .eq('concluida', false)
          .or(`ano.lt.${anoAtual},and(ano.eq.${anoAtual},mes.lt.${mesAtual})`)

        if (updateError) throw updateError
      }
    } catch (err) {
      console.error('Erro ao migrar tarefas:', err)
    }
  }, [])

  // Busca tarefas do mês/categoria selecionados
  const buscarTarefas = useCallback(async () => {
    setCarregando(true)
    setErro(null)

    try {
      const { data, error } = await supabase
        .from('tarefas')
        .select('*')
        .eq('mes', mesAno.mes)
        .eq('ano', mesAno.ano)
        .eq('categoria', categoria)
        .order('created_at', { ascending: true })

      if (error) throw error

      setTarefas(data || [])
    } catch (err) {
      setErro('Erro ao carregar tarefas. Tente novamente.')
      console.error(err)
    } finally {
      setCarregando(false)
    }
  }, [mesAno.mes, mesAno.ano, categoria])

  // Adiciona nova tarefa
  const adicionarTarefa = useCallback(async (descricao: string) => {
    if (!descricao.trim()) return

    const novaTarefa: NovaTarefa = {
      descricao: descricao.trim(),
      categoria,
      mes: mesAno.mes,
      ano: mesAno.ano,
    }

    try {
      const { data, error } = await supabase
        .from('tarefas')
        .insert([novaTarefa])
        .select()
        .single()

      if (error) throw error

      // Adiciona otimisticamente à lista local
      setTarefas(prev => [...prev, data])
    } catch (err) {
      setErro('Erro ao adicionar tarefa.')
      console.error(err)
    }
  }, [categoria, mesAno.mes, mesAno.ano])

  // Alterna o status de conclusão de uma tarefa
  const alternarConcluida = useCallback(async (id: string, concluida: boolean) => {
    // Atualização otimista: reflete na UI imediatamente
    setTarefas(prev =>
      prev.map(t => t.id === id ? { ...t, concluida: !concluida } : t)
    )

    try {
      const { error } = await supabase
        .from('tarefas')
        .update({ concluida: !concluida })
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      // Reverte em caso de erro
      setTarefas(prev =>
        prev.map(t => t.id === id ? { ...t, concluida } : t)
      )
      setErro('Erro ao atualizar tarefa.')
      console.error(err)
    }
  }, [])

  // Exclui uma tarefa
  const excluirTarefa = useCallback(async (id: string) => {
    // Remoção otimista
    const backup = tarefas.find(t => t.id === id)
    setTarefas(prev => prev.filter(t => t.id !== id))

    try {
      const { error } = await supabase
        .from('tarefas')
        .delete()
        .eq('id', id)

      if (error) throw error
    } catch (err) {
      // Reverte em caso de erro
      if (backup) {
        setTarefas(prev => [...prev, backup].sort(
          (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
        ))
      }
      setErro('Erro ao excluir tarefa.')
      console.error(err)
    }
  }, [tarefas])

  // Migra tarefas antigas apenas uma vez ao montar o componente
  useEffect(() => {
    migrarTarefasAntigas()
  }, [migrarTarefasAntigas])

  // Busca tarefas sempre que mês, ano ou categoria mudar
  useEffect(() => {
    buscarTarefas()
  }, [buscarTarefas])

  return {
    tarefas,
    carregando,
    erro,
    adicionarTarefa,
    alternarConcluida,
    excluirTarefa,
  }
}
