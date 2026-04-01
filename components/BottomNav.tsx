'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex border-t border-bd bg-bg">
      <Link
        href="/"
        className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium transition-colors ${
          pathname === '/' ? 'text-accent' : 'text-tx-4 hover:text-tx-3'
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6"  x2="21" y2="6"  />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6"  x2="3.01" y2="6"  />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        Tarefas
      </Link>

      <Link
        href="/estudos"
        className={`flex flex-1 flex-col items-center justify-center gap-1 py-3 text-[10px] font-medium transition-colors ${
          pathname === '/estudos' ? 'text-accent' : 'text-tx-4 hover:text-tx-3'
        }`}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
          <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
        Estudos
      </Link>
    </nav>
  )
}
