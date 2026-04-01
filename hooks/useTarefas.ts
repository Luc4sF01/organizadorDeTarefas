'use client'

import { useState, useEffect, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import { Tarefa, Categoria, MesAno, NovaTarefa, Prioridade } from '@/types'

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
      const { error } = await supabase
        .from('tarefas')
        .update({ mes: mesAtual, ano: anoAtual })
        .eq('concluida', false)
        .or(`ano.lt.${anoAtual},and(ano.eq.${anoAtual},mes.lt.${mesAtual})`)

      if (error) throw error
    } catch (err) {
      console.error('Erro ao migrar tarefas:', err)
    }
  }, [])

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
        .order('ordem', { ascending: true, nullsFirst: false })
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
  const adicionarTarefa = useCallback(async (
    descricao: string,
    prioridade: Prioridade = 'media',
    tags: string[] = [],
    recorrente: boolean = false
  ) => {
    if (!descricao.trim()) return

    const nova: NovaTarefa = {
      descricao: descricao.trim(),
      categoria,
      mes: mesAno.mes,
      ano: mesAno.ano,
      prioridade,
      tags,
      recorrente,
    }

    try {
      const { data, error } = await supabase
        .from('tarefas')
        .insert([nova])
        .select()
        .single()

      if (error) throw error
      setTarefas(prev => [...prev, data])
    } catch (err) {
      setErro('Erro ao adicionar tarefa.')
      console.error(err)
    }
  }, [categoria, mesAno.mes, mesAno.ano])

  // Alterna conclusão. Se recorrente, cria cópia pro próximo mês ao concluir.
  const alternarConcluida = useCallback(async (id: string, concluida: boolean) => {
    const tarefa = tarefas.find(t => t.id === id)
    if (!tarefa) return

    const novoEstado = !concluida
    const agora = new Date().toISOString()

    setTarefas(prev => prev.map(t => t.id === id
      ? { ...t, concluida: novoEstado, concluida_em: novoEstado ? agora : null }
      : t
    ))

    try {
      const { error } = await supabase
        .from('tarefas')
        .update({
          concluida: novoEstado,
          concluida_em: novoEstado ? agora : null,
        })
        .eq('id', id)

      if (error) throw error

      // Se tarefa recorrente foi concluída, cria cópia no próximo mês
      if (novoEstado && tarefa.recorrente) {
        const proximoMes = tarefa.mes === 12
          ? { mes: 1, ano: tarefa.ano + 1 }
          : { mes: tarefa.mes + 1, ano: tarefa.ano }

        await supabase.from('tarefas').insert([{
          descricao: tarefa.descricao,
          categoria: tarefa.categoria,
          prioridade: tarefa.prioridade,
          tags: tarefa.tags,
          recorrente: true,
          nota: tarefa.nota,
          mes: proximoMes.mes,
          ano: proximoMes.ano,
        }])
      }
    } catch (err) {
      setTarefas(prev => prev.map(t => t.id === id ? { ...t, concluida, concluida_em: tarefa.concluida_em } : t))
      setErro('Erro ao atualizar tarefa.')
      console.error(err)
    }
  }, [tarefas])

  // Edita campos de uma tarefa
  const editarTarefa = useCallback(async (
    id: string,
    campos: Partial<Pick<Tarefa, 'descricao' | 'nota' | 'prioridade' | 'tags' | 'recorrente'>>
  ) => {
    setTarefas(prev => prev.map(t => t.id === id ? { ...t, ...campos } : t))

    try {
      const { error } = await supabase.from('tarefas').update(campos).eq('id', id)
      if (error) throw error
    } catch (err) {
      setErro('Erro ao editar tarefa.')
      console.error(err)
      await buscarTarefas()
    }
  }, [buscarTarefas])

  // Duplica uma tarefa
  const duplicarTarefa = useCallback(async (id: string) => {
    const original = tarefas.find(t => t.id === id)
    if (!original) return

    try {
      const { data, error } = await supabase
        .from('tarefas')
        .insert([{
          descricao: original.descricao,
          categoria: original.categoria,
          mes: original.mes,
          ano: original.ano,
          prioridade: original.prioridade,
          tags: original.tags,
          recorrente: original.recorrente,
          nota: original.nota,
        }])
        .select()
        .single()

      if (error) throw error
      setTarefas(prev => [...prev, data])
    } catch (err) {
      setErro('Erro ao duplicar tarefa.')
      console.error(err)
    }
  }, [tarefas])

  // Exclui uma tarefa
  const excluirTarefa = useCallback(async (id: string) => {
    const backup = tarefas.find(t => t.id === id)
    setTarefas(prev => prev.filter(t => t.id !== id))

    try {
      const { error } = await supabase.from('tarefas').delete().eq('id', id)
      if (error) throw error
    } catch (err) {
      if (backup) {
        setTarefas(prev =>
          [...prev, backup].sort((a, b) =>
            new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          )
        )
      }
      setErro('Erro ao excluir tarefa.')
      console.error(err)
    }
  }, [tarefas])

  // Reordena tarefas via drag & drop
  const reordenarTarefas = useCallback(async (tarefasOrdenadas: Tarefa[]) => {
    setTarefas(tarefasOrdenadas)

    try {
      const updates = tarefasOrdenadas.map((t, i) => ({ id: t.id, ordem: i }))
      for (const upd of updates) {
        await supabase.from('tarefas').update({ ordem: upd.ordem }).eq('id', upd.id)
      }
    } catch (err) {
      console.error('Erro ao reordenar:', err)
    }
  }, [])

  useEffect(() => {
    migrarTarefasAntigas()
  }, [migrarTarefasAntigas])

  useEffect(() => {
    buscarTarefas()
  }, [buscarTarefas])

  return {
    tarefas,
    carregando,
    erro,
    adicionarTarefa,
    alternarConcluida,
    editarTarefa,
    duplicarTarefa,
    excluirTarefa,
    reordenarTarefas,
  }
}
