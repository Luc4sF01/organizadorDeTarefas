'use client'

import { Categoria, CATEGORIAS } from '@/types'

interface TabsProps {
  categoriaAtiva: Categoria
  onMudarCategoria: (categoria: Categoria) => void
  contadores: Record<Categoria, number>
}

const icones: Record<Categoria, JSX.Element> = {
  trabalho: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  ),
  estudos: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
    </svg>
  ),
  pessoal: (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  ),
}

export default function Tabs({ categoriaAtiva, onMudarCategoria, contadores }: TabsProps) {
  const categorias = Object.keys(CATEGORIAS) as Categoria[]

  return (
    <nav className="flex mb-6 border-b border-bd-dim">
      {categorias.map((categoria) => {
        const ativa = categoriaAtiva === categoria
        const count = contadores[categoria]

        return (
          <button
            key={categoria}
            onClick={() => onMudarCategoria(categoria)}
            className={`
              flex items-center gap-2 px-4 py-2.5 text-sm font-medium
              border-b-2 -mb-px
              transition-all duration-200 cursor-pointer
              ${ativa
                ? 'border-accent text-tx'
                : 'border-transparent text-tx-4 hover:text-tx-3 hover:border-bd-hi'
              }
            `}
          >
            <span>{icones[categoria]}</span>
            <span>{CATEGORIAS[categoria]}</span>
            {count > 0 && (
              <span className={`
                px-1.5 py-0.5 rounded-full text-[10px] font-semibold leading-none tabular-nums
                ${ativa ? 'bg-accent text-white' : 'bg-bd text-tx-4'}
              `}>
                {count}
              </span>
            )}
          </button>
        )
      })}
    </nav>
  )
}
