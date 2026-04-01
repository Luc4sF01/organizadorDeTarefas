'use client'

import { useState } from 'react'
import { useCategorias } from '@/hooks/useCategorias'
import { useEstudos } from '@/hooks/useEstudos'
import { useRevisoesHoje } from '@/hooks/useRevisoes'
import { useDashboardEstudos } from '@/hooks/useDashboardEstudos'
import ThemeToggle from '@/components/ThemeToggle'
import { CategoriaEstudo, RegistroEstudo } from '@/types'

const CONFIANCA_CONFIG = {
  1: { label: 'Não entendi', cor: '#ef4444', bg: 'rgba(239,68,68,0.12)' },
  2: { label: 'Entendi',     cor: '#f59e0b', bg: 'rgba(245,158,11,0.12)' },
  3: { label: 'Dominei',     cor: '#22c55e', bg: 'rgba(34,197,94,0.12)'  },
} as const

export default function EstudosPage() {
  const categorias = useCategorias()
  const [filtroCategoria, setFiltroCategoria] = useState<string | null>(null)
  const [busca, setBusca] = useState('')
  const { registros, carregando, registrar } = useEstudos(filtroCategoria, busca)
  const { revisoes, concluir } = useRevisoesHoje()
  const { streak, horasSemana, totalRegistros, carregando: carregandoDash } = useDashboardEstudos()

  const [form, setForm] = useState({
    titulo: '',
    categoria_id: '',
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
      categoria_id: form.categoria_id || null,
      duracao_minutos: Number(form.duracao_minutos),
      confianca: form.confianca,
      anotacao: form.anotacao,
    })
    setSalvando(false)
    if (ok) {
      setForm({ titulo: '', categoria_id: '', duracao_minutos: '', confianca: 2, anotacao: '' })
      setSucesso(true)
      setTimeout(() => setSucesso(false), 2000)
    }
  }

  const catMap = Object.fromEntries(categorias.map(c => [c.id, c]))

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
              {revisoes.map(r => {
                const cat = r.registros_estudo?.categoria_id ? catMap[r.registros_estudo.categoria_id] : null
                return (
                  <div key={r.id} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-surface border border-bd">
                    {cat && (
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.cor }} />
                    )}
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
                )
              })}
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
              placeholder="Título do que estudou"
              required
              className="w-full bg-transparent text-sm text-tx placeholder:text-tx-5 outline-none border-b border-bd-hi focus:border-accent transition-colors pb-1"
            />

            <div className="flex gap-2">
              <select
                value={form.categoria_id}
                onChange={e => setForm(f => ({ ...f, categoria_id: e.target.value }))}
                className="flex-1 bg-bg border border-bd rounded-lg px-2.5 py-1.5 text-xs text-tx outline-none focus:border-accent transition-colors cursor-pointer"
              >
                <option value="">Sem categoria</option>
                {categorias.map(c => (
                  <option key={c.id} value={c.id}>{c.nome}</option>
                ))}
              </select>

              <div className="relative">
                <input
                  type="number"
                  min="1"
                  value={form.duracao_minutos}
                  onChange={e => setForm(f => ({ ...f, duracao_minutos: e.target.value }))}
                  placeholder="min"
                  required
                  className="w-20 bg-bg border border-bd rounded-lg px-2.5 py-1.5 text-xs text-tx placeholder:text-tx-5 outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

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
              rows={2}
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

        {/* Filtros */}
        <div className="flex gap-2 mb-4 flex-wrap">
          <input
            value={busca}
            onChange={e => setBusca(e.target.value)}
            placeholder="Buscar..."
            className="flex-1 min-w-0 bg-surface border border-bd rounded-lg px-3 py-1.5 text-xs text-tx placeholder:text-tx-5 outline-none focus:border-accent transition-colors"
          />
          <button
            onClick={() => setFiltroCategoria(null)}
            className={`px-3 py-1.5 rounded-lg text-xs border transition-all cursor-pointer ${
              filtroCategoria === null
                ? 'border-accent text-accent bg-accent-sub'
                : 'border-bd text-tx-4 hover:border-bd-hi'
            }`}
          >
            Todos
          </button>
          {categorias.map(c => (
            <button
              key={c.id}
              onClick={() => setFiltroCategoria(filtroCategoria === c.id ? null : c.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-all cursor-pointer"
              style={filtroCategoria === c.id
                ? { borderColor: c.cor, color: c.cor, backgroundColor: c.cor + '20' }
                : { borderColor: 'var(--border)', color: 'var(--tx-4)' }
              }
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: c.cor }} />
              {c.nome}
            </button>
          ))}
        </div>

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
              <RegistroItem key={r.id} registro={r} cat={catMap[r.categoria_id ?? ''] ?? null} />
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

function RegistroItem({ registro, cat }: { registro: RegistroEstudo; cat: CategoriaEstudo | null }) {
  const [expandido, setExpandido] = useState(false)
  const cfg = CONFIANCA_CONFIG[registro.confianca]
  const horas = registro.duracao_minutos >= 60
    ? `${Math.floor(registro.duracao_minutos / 60)}h${registro.duracao_minutos % 60 > 0 ? `${registro.duracao_minutos % 60}m` : ''}`
    : `${registro.duracao_minutos}min`

  const data = new Date(registro.estudado_em + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })

  return (
    <li className="bg-surface border border-bd rounded-xl px-4 py-3 list-item-in">
      <div className="flex items-start gap-2">
        {cat && <span className="w-2 h-2 rounded-full flex-shrink-0 mt-1.5" style={{ backgroundColor: cat.cor }} />}
        <div className="flex-1 min-w-0">
          <p className="text-sm text-tx leading-snug">{registro.titulo}</p>
          <div className="flex items-center gap-2 mt-1 flex-wrap">
            <span className="text-[10px] text-tx-5">{data}</span>
            <span className="text-[10px] text-tx-4">{horas}</span>
            {cat && <span className="text-[10px]" style={{ color: cat.cor }}>{cat.nome}</span>}
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
            <p className="mt-2 text-xs text-tx-3 leading-relaxed border-l-2 border-bd-hi pl-2 animate-slide-down">
              {registro.anotacao}
            </p>
          )}
        </div>
      </div>
    </li>
  )
}
