import { useState, useEffect } from 'react'

const STORAGE_KEY = 'univirtual_reports_v2'

const DEFAULT_DATA = {
  pregrado:  { categories: [] },
  regencia:  {
    categories: [
      {
        id: 'reg-cat-default',
        name: '2025-1',
        expanded: true,
        reports: [
          {
            id: 'default-reg-1',
            name: 'Cancelaciones de matrícula',
            desc: 'Análisis de estudiantes con proceso de cancelación activo en el programa',
            url: 'https://datastudio.google.com/reporting/67b76d63-c830-452e-9f7f-4f36435eb4ad',
            createdAt: Date.now()
          }
        ]
      }
    ]
  },
  ilex:      { categories: [] },
  extension: { categories: [] }
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_DATA
    return JSON.parse(raw)
  } catch {
    return DEFAULT_DATA
  }
}

function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    console.error('Error guardando en localStorage')
  }
}

export function useReports() {
  const [data, setData] = useState(load)

  useEffect(() => { save(data) }, [data])

  // ── CATEGORIES ──
  function addCategory(program, name) {
    const cat = {
      id: `cat-${Date.now()}-${Math.random().toString(36).slice(2,5)}`,
      name: name.trim(),
      expanded: true,
      reports: []
    }
    setData(prev => ({
      ...prev,
      [program]: {
        ...prev[program],
        categories: [...prev[program].categories, cat]
      }
    }))
    return cat
  }

  function removeCategory(program, catId) {
    setData(prev => ({
      ...prev,
      [program]: {
        ...prev[program],
        categories: prev[program].categories.filter(c => c.id !== catId)
      }
    }))
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
  function addReport(program, catId, { name, desc, url }) {
    const report = {
      id: `rep-${Date.now()}-${Math.random().toString(36).slice(2,5)}`,
      name: name.trim(),
      desc: desc.trim(),
      url: url.trim(),
      createdAt: Date.now()
    }
    setData(prev => ({
      ...prev,
      [program]: {
        ...prev[program],
        categories: prev[program].categories.map(c =>
          c.id === catId ? { ...c, reports: [...c.reports, report] } : c
        )
      }
    }))
    return report
  }

  function removeReport(program, catId, reportId) {
    setData(prev => ({
      ...prev,
      [program]: {
        ...prev[program],
        categories: prev[program].categories.map(c =>
          c.id === catId
            ? { ...c, reports: c.reports.filter(r => r.id !== reportId) }
            : c
        )
      }
    }))
  }

  return { data, addCategory, removeCategory, toggleCategory, addReport, removeReport }
}
