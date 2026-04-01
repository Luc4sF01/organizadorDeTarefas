'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { CategoriaEstudo } from '@/types'

export function useCategorias() {
  const [categorias, setCategorias] = useState<CategoriaEstudo[]>([])

  useEffect(() => {
    supabase
      .from('categorias')
      .select('*')
      .order('nome')
      .then(({ data }) => setCategorias(data ?? []))
  }, [])

  return categorias
}
