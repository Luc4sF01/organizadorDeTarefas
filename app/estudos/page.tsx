'use client'

import { useState } from 'react'
import { useEstudos } from '@/hooks/useEstudos'
import { useRevisoesHoje } from '@/hooks/useRevisoes'
import { useDashboardEstudos } from '@/hooks/useDashboardEstudos'
import ThemeToggle from '@/components/ThemeToggle'
import { RegistroEstudo } from '@/types'

const CONFIANCA_CONFIG = {
  1: { label: 'Não entendi', cor: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  2: { label: 'Entendi',     cor: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  3: { label: 'Dominei',     cor: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
} as const

export default function EstudosPage() {
  const [busca, setBusca] = useState('')
  const { registros, carregando, registrar, editar, excluir } = useEstudos(null, busca)
  const { revisoes, concluir } = useRevisoesHoje()
  const { streak, horasSemana, totalRegistros, carregando: carregandoDash } = useDashboardEstudos()

  const [form, setForm] = useState({
    titulo: '',
    duracao_minutos: '',
    confianca: 2 as 1 | 2 | 3,
    anotacao: '',
  })
  const [salvando, setSalvando] = useState(false)
  const [sucesso, setSucesso] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.titulo.trim() || !form.duracao_minutos) return
    setSalvando(true)
    const ok = await registrar({
      titulo: form.titulo.trim(),
      categoria_id: null,
      duracao_minutos: Number(form.duracao_minutos),
      confianca: form.confianca,
      anotacao: form.anotacao,
    })
    setSalvando(false)
    if (ok) {
      setForm({ titulo: '', duracao_minutos: '', confianca: 2, anotacao: '' })
      setSucesso(true)
      setTimeout(() => setSucesso(false), 2000)
    }
  }

  return (
    <main className="min-h-screen bg-bg transition-colors duration-200">
      <div className="max-w-lg mx-auto px-4 py-10 sm:py-14">

        {/* Header */}
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-lg font-semibold text-tx tracking-tight">Estudos</h1>
          <ThemeToggle />
        </header>

        {/* Dashboard */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {carregandoDash ? (
            [1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-surface border border-bd animate-pulse" />)
          ) : (
            <>
              <DashCard valor={streak > 0 ? `${streak}d` : '—'} label="Streak" destaque={streak > 0} />
              <DashCard valor={`${horasSemana}h`} label="Esta semana" />
              <DashCard valor={String(totalRegistros)} label="Total" />
            </>
          )}
        </div>

        {/* Revisões de hoje */}
        {revisoes.length > 0 && (
          <section className="mb-6">
            <p className="text-xs font-medium text-tx-4 uppercase tracking-wide mb-2">
              Revisões de hoje ({revisoes.length})
            </p>
            <div className="space-y-2">
              {revisoes.map(r => (
                <div key={r.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-bd">
                  <span className="flex-1 text-sm text-tx truncate">
                    {r.registros_estudo?.titulo ?? '—'}
                  </span>
                  <button
                    onClick={() => concluir(r.id)}
                    className="flex-shrink-0 w-6 h-6 flex items-center justify-center rounded-md border border-bd-hi hover:border-accent hover:text-accent text-tx-4 transition-all cursor-pointer"
                  >
                    <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M2 6l3 3 5-5" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Formulário */}
        <section className="mb-6">
          <p className="text-xs font-medium text-tx-4 uppercase tracking-wide mb-2">Registrar estudo</p>
          <form onSubmit={handleSubmit} className="bg-surface border border-bd rounded-xl p-4 space-y-3">
            <input
              value={form.titulo}
              onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
              placeholder="O que você estudou?"
              required
              className="w-full bg-transparent text-sm text-tx placeholder:text-tx-5 outline-none border-b border-bd-hi focus:border-accent transition-colors pb-1"
            />

            <input
              type="number"
              min="1"
              value={form.duracao_minutos}
              onChange={e => setForm(f => ({ ...f, duracao_minutos: e.target.value }))}
              placeholder="Duração em minutos"
              required
              className="w-full bg-bg border border-bd rounded-lg px-2.5 py-1.5 text-xs text-tx placeholder:text-tx-5 outline-none focus:border-accent transition-colors"
            />

            {/* Confiança */}
            <div className="flex gap-2">
              {([1, 2, 3] as const).map(n => {
                const cfg = CONFIANCA_CONFIG[n]
                const ativo = form.confianca === n
                return (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setForm(f => ({ ...f, confianca: n }))}
                    className="flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer"
                    style={ativo
                      ? { borderColor: cfg.cor, color: cfg.cor, backgroundColor: cfg.bg }
                      : { borderColor: 'var(--border)', color: 'var(--tx-4)' }
                    }
                  >
                    {cfg.label}
                  </button>
                )
              })}
            </div>

            <textarea
              value={form.anotacao}
              onChange={e => setForm(f => ({ ...f, anotacao: e.target.value }))}
              placeholder="Anotação (opcional)"
              rows={4}
              className="w-full bg-transparent text-xs text-tx-3 placeholder:text-tx-5 outline-none border border-bd rounded-lg px-3 py-2 focus:border-accent transition-colors resize-none"
            />

            <button
              type="submit"
              disabled={salvando}
              className="w-full py-2 rounded-lg bg-accent text-white text-sm font-medium hover:opacity-90 transition-opacity cursor-pointer disabled:opacity-50"
            >
              {salvando ? 'Salvando...' : sucesso ? 'Salvo!' : 'Registrar'}
            </button>
          </form>
        </section>

        {/* Busca */}
        <input
          value={busca}
          onChange={e => setBusca(e.target.value)}
          placeholder="Buscar registros..."
          className="w-full bg-surface border border-bd rounded-lg px-3 py-2 text-xs text-tx placeholder:text-tx-5 outline-none focus:border-accent transition-colors mb-4"
        />

        {/* Lista de registros */}
        {carregando ? (
          <div className="space-y-2">
            {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-surface border border-bd animate-pulse" />)}
          </div>
        ) : registros.length === 0 ? (
          <p className="text-sm text-tx-5 text-center py-8">Nenhum registro encontrado.</p>
        ) : (
          <ul className="space-y-2">
            {registros.map(r => (
              <RegistroItem key={r.id} registro={r} onEditar={editar} onExcluir={excluir} />
            ))}
          </ul>
        )}

      </div>
    </main>
  )
}

function DashCard({ valor, label, destaque }: { valor: string; label: string; destaque?: boolean }) {
  return (
    <div className={`px-3 py-3 rounded-xl border ${destaque ? 'bg-accent-sub border-accent/20' : 'bg-surface border-bd'}`}>
      <p className={`text-xl font-semibold ${destaque ? 'text-accent' : 'text-tx'}`}>{valor}</p>
      <p className="text-[10px] text-tx-4 mt-0.5">{label}</p>
    </div>
  )
}

function RegistroItem({
  registro,
  onEditar,
  onExcluir,
}: {
  registro: RegistroEstudo
  onEditar: (id: string, campos: Partial<Pick<RegistroEstudo, 'titulo' | 'duracao_minutos' | 'confianca' | 'anotacao'>>) => void
  onExcluir: (id: string) => void
}) {
  const [expandido, setExpandido] = useState(false)
  const [editando, setEditando] = useState(false)
  const [form, setForm] = useState({
    titulo: registro.titulo,
    duracao_minutos: String(registro.duracao_minutos),
    confianca: registro.confianca,
    anotacao: registro.anotacao ?? '',
  })

  const cfg = CONFIANCA_CONFIG[registro.confianca]
  const horas = registro.duracao_minutos >= 60
    ? `${Math.floor(registro.duracao_minutos / 60)}h${registro.duracao_minutos % 60 > 0 ? `${registro.duracao_minutos % 60}m` : ''}`
    : `${registro.duracao_minutos}min`
  const data = new Date(registro.estudado_em + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

  const salvarEdicao = () => {
    onEditar(registro.id, {
      titulo: form.titulo.trim(),
      duracao_minutos: Number(form.duracao_minutos),
      confianca: form.confianca,
      anotacao: form.anotacao || null,
    })
    setEditando(false)
  }

  if (editando) {
    return (
      <li className="bg-surface border border-accent/40 rounded-xl px-4 py-3 list-item-in space-y-2">
        <input
          value={form.titulo}
          onChange={e => setForm(f => ({ ...f, titulo: e.target.value }))}
          className="w-full bg-transparent text-sm text-tx outline-none border-b border-bd-hi focus:border-accent transition-colors pb-1"
        />
        <input
          type="number"
          min="1"
          value={form.duracao_minutos}
          onChange={e => setForm(f => ({ ...f, duracao_minutos: e.target.value }))}
          className="w-full bg-bg border border-bd rounded-lg px-2.5 py-1.5 text-xs text-tx outline-none focus:border-accent transition-colors"
        />
        <div className="flex gap-2">
          {([1, 2, 3] as const).map(n => {
            const c = CONFIANCA_CONFIG[n]
            const ativo = form.confianca === n
            return (
              <button
                key={n}
                type="button"
                onClick={() => setForm(f => ({ ...f, confianca: n }))}
                className="flex-1 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer"
                style={ativo
                  ? { borderColor: c.cor, color: c.cor, backgroundColor: c.bg }
                  : { borderColor: 'var(--border)', color: 'var(--tx-4)' }
                }
              >
                {c.label}
              </button>
            )
          })}
        </div>
        <textarea
          value={form.anotacao}
          onChange={e => setForm(f => ({ ...f, anotacao: e.target.value }))}
          placeholder="Anotação (opcional)"
          rows={4}
          className="w-full bg-transparent text-xs text-tx-3 placeholder:text-tx-5 outline-none border border-bd rounded-lg px-3 py-2 focus:border-accent transition-colors resize-none"
        />
        <div className="flex gap-2">
          <button
            onClick={salvarEdicao}
            className="flex-1 py-1.5 rounded-lg bg-accent text-white text-xs font-medium hover:opacity-90 transition-opacity cursor-pointer"
          >
            Salvar
          </button>
          <button
            onClick={() => setEditando(false)}
            className="flex-1 py-1.5 rounded-lg border border-bd text-tx-4 text-xs hover:border-bd-hi transition-colors cursor-pointer"
          >
            Cancelar
          </button>
        </div>
      </li>
    )
  }

  return (
    <li className="group bg-surface border border-bd rounded-xl px-4 py-3 list-item-in">
      <div className="flex items-start gap-2">
        <div className="flex-1 min-w-0">
          <p className="text-sm text-tx leading-snug">{registro.titulo}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-[10px] text-tx-5">{data}</span>
            <span className="text-[10px] text-tx-4">{horas}</span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-medium"
              style={{ color: cfg.cor, backgroundColor: cfg.bg }}
            >
              {cfg.label}
            </span>
            {registro.anotacao && (
              <button
                onClick={() => setExpandido(v => !v)}
                className="text-[10px] text-tx-5 hover:text-tx-3 transition-colors cursor-pointer"
              >
                {expandido ? 'ocultar nota' : 'ver nota'}
              </button>
            )}
          </div>
          {expandido && registro.anotacao && (
            <p className="mt-2 text-xs text-tx-3 leading-relaxed border-l-2 border-bd-hi pl-2 animate-slide-down whitespace-pre-wrap">
              {registro.anotacao}
            </p>
          )}
        </div>
        <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
          <button
            onClick={() => setEditando(true)}
            className="w-6 h-6 flex items-center justify-center rounded-md text-tx-5 hover:text-tx-2 hover:bg-hover transition-all cursor-pointer"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
          </button>
          <button
            onClick={() => onExcluir(registro.id)}
            className="w-6 h-6 flex items-center justify-center rounded-md text-tx-5 hover:text-red-400 hover:bg-red-500/10 transition-all cursor-pointer"
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>
    </li>
  )
}
