// Tipos principais da aplicação

export type Categoria = 'trabalho' | 'estudos' | 'pessoal'

export interface Tarefa {
  id: string
  descricao: string
  concluida: boolean
  categoria: Categoria
  mes: number
  ano: number
  created_at: string
}

// Dados para criação de uma nova tarefa
export interface NovaTarefa {
  descricao: string
  categoria: Categoria
  mes: number
  ano: number
}

// Estado do mês navegado
export interface MesAno {
  mes: number
  ano: number
}

// Labels das categorias
export const CATEGORIAS: Record<Categoria, string> = {
  trabalho: 'Trabalho',
  estudos: 'Estudos',
  pessoal: 'Pessoal',
}

// Nomes dos meses em português
export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril',
  'Maio', 'Junho', 'Julho', 'Agosto',
  'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]
