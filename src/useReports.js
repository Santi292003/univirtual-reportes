import { useState, useEffect } from 'react'

const STORAGE_KEY = 'univirtual_reports_v1'

const DEFAULT_REPORTS = {
  pregrado: [],
  regencia: [
    {
      id: 'default-reg-1',
      name: 'Cancelaciones de matrícula',
      desc: 'Análisis de estudiantes con proceso de cancelación activo en el programa',
      url: 'https://datastudio.google.com/reporting/67b76d63-c830-452e-9f7f-4f36435eb4ad',
      createdAt: Date.now()
    }
  ],
  ilex: []
}

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_REPORTS
    return JSON.parse(raw)
  } catch {
    return DEFAULT_REPORTS
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
  const [reports, setReports] = useState(load)

  useEffect(() => { save(reports) }, [reports])

  function addReport(program, { name, desc, url }) {
    const report = {
      id: `${program}-${Date.now()}-${Math.random().toString(36).slice(2,6)}`,
      name: name.trim(),
      desc: desc.trim(),
      url: url.trim(),
      createdAt: Date.now()
    }
    setReports(prev => ({
      ...prev,
      [program]: [...prev[program], report]
    }))
    return report
  }

  function removeReport(program, id) {
    setReports(prev => ({
      ...prev,
      [program]: prev[program].filter(r => r.id !== id)
    }))
  }

  return { reports, addReport, removeReport }
}
