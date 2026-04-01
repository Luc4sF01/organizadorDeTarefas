export type Categoria = 'trabalho' | 'estudos' | 'pessoal'
export type Prioridade = 'urgente' | 'media' | 'baixa'
export type ViewMode = 'tarefas' | 'dashboard' | 'busca'

export interface Tarefa {
  id: string
  descricao: string
  concluida: boolean
  categoria: Categoria
  mes: number
  ano: number
  created_at: string
  nota: string | null
  prioridade: Prioridade
  tags: string[]
  recorrente: boolean
  ordem: number | null
  concluida_em: string | null
}

export interface Subtarefa {
  id: string
  tarefa_id: string
  descricao: string
  concluida: boolean
  created_at: string
}

export interface NovaTarefa {
  descricao: string
  categoria: Categoria
  mes: number
  ano: number
  prioridade?: Prioridade
  tags?: string[]
  recorrente?: boolean
}

export interface MesAno {
  mes: number
  ano: number
}

export const CATEGORIAS: Record<Categoria, string> = {
  trabalho: 'Trabalho',
  estudos: 'Estudos',
  pessoal: 'Pessoal',
}

export const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril',
  'Maio', 'Junho', 'Julho', 'Agosto',
  'Setembro', 'Outubro', 'Novembro', 'Dezembro',
]

export const MESES_CURTO = [
  'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
  'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez',
]

export const PRIORIDADE_CONFIG: Record<Prioridade, { label: string; cor: string; corBg: string }> = {
  urgente: { label: 'Urgente', cor: '#ef4444', corBg: 'rgba(239,68,68,0.12)' },
  media:   { label: 'Média',   cor: '#f59e0b', corBg: 'rgba(245,158,11,0.12)' },
  baixa:   { label: 'Baixa',   cor: '#22c55e', corBg: 'rgba(34,197,94,0.12)' },
}
