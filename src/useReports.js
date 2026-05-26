import { useState, useEffect, useCallback } from 'react'
import pb from './pb'

const DEFAULT_STATE = {
  pregrado:  { categories: [] },
  regencia:  { categories: [] },
  ilex:      { categories: [] },
  extension: { categories: [] }
}

function buildState(categories, reports) {
  const state = {
    pregrado:  { categories: [] },
    regencia:  { categories: [] },
    ilex:      { categories: [] },
    extension: { categories: [] }
  }

  categories.forEach(cat => {
    if (!state[cat.program]) return
    state[cat.program].categories.push({
      id: cat.id,
      name: cat.name,
      expanded: true,
      reports: reports
        .filter(r => r.category_id === cat.id)
        .map(r => ({
          id: r.id,
          name: r.name,
          desc: r.desc,
          url: r.url,
          createdAt: r.created
        }))
    })
  })

  return state
}

export function useReports() {
  const [data, setData]       = useState(DEFAULT_STATE)
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(null)

  const fetchAll = useCallback(async () => {
    try {
      const [cats, reps] = await Promise.all([
        pb.collection('categories').getFullList({ sort: 'created' }),
        pb.collection('reports').getFullList({ sort: 'created' })
      ])
      setData(buildState(cats, reps))
      setError(null)
    } catch (e) {
      setError('No se pudo conectar con el servidor. Verifica la conexión.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchAll()

    // realtime subscriptions
    let unsubCats, unsubReps
    pb.collection('categories').subscribe('*', () => fetchAll()).then(u => unsubCats = u)
    pb.collection('reports').subscribe('*', () => fetchAll()).then(u => unsubReps = u)

    return () => {
      unsubCats?.()
      unsubReps?.()
    }
  }, [fetchAll])

  // ── CATEGORIES ──
  async function addCategory(program, name) {
    await pb.collection('categories').create({ program, name })
  }

  async function removeCategory(program, catId) {
    // delete all reports in category first
    const reps = await pb.collection('reports').getFullList({
      filter: `category_id = "${catId}"`
    })
    await Promise.all(reps.map(r => pb.collection('reports').delete(r.id)))
    await pb.collection('categories').delete(catId)
  }

  function toggleCategory(program, catId) {
    setData(prev => ({
      ...prev,
      [program]: {
        ...prev[program],
        categories: prev[program].categories.map(c =>
          c.id === catId ? { ...c, expanded: !c.expanded } : c
        )
      }
    }))
  }

  // ── REPORTS ──
  async function addReport(program, catId, { name, desc, url }) {
    await pb.collection('reports').create({
      category_id: catId,
      program,
      name,
      desc,
      url
    })
  }

  async function removeReport(program, catId, reportId) {
    await pb.collection('reports').delete(reportId)
  }

  return { data, loading, error, addCategory, removeCategory, toggleCategory, addReport, removeReport }
}
