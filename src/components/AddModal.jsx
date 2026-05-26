import { useState, useEffect, useRef } from 'react'
import { X, Plus, Link2, FileText, AlignLeft, ChevronDown, CheckCircle2, FolderPlus, Tag } from 'lucide-react'
import { PROGRAMS } from '../programs'
import styles from './AddModal.module.css'

export default function AddModal({ open, onClose, onAddCategory, onAddReport, defaultProgram, categories }) {
  const [mode, setMode]       = useState('report')  // 'report' | 'category'
  const [program, setProgram] = useState(defaultProgram || 'regencia')
  const [catId, setCatId]     = useState('')
  const [form, setForm]       = useState({ name: '', desc: '', url: '' })
  const [catName, setCatName] = useState('')
  const [errors, setErrors]   = useState({})
  const [success, setSuccess] = useState(false)
  const firstRef = useRef(null)

  const progCats = categories[program] || []

  useEffect(() => {
    if (!open) return
    setMode('report')
    setProgram(defaultProgram || 'regencia')
    setForm({ name: '', desc: '', url: '' })
    setCatName('')
    setErrors({})
    setSuccess(false)
    setTimeout(() => firstRef.current?.focus(), 80)
  }, [open, defaultProgram])

  useEffect(() => {
    // auto-select first category when program changes
    const cats = categories[program] || []
    setCatId(cats.length > 0 ? cats[0].id : '')
  }, [program, categories])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  function validateReport() {
    const errs = {}
    if (!form.name.trim())  errs.name = 'El nombre es obligatorio'
    if (!catId)             errs.cat  = 'Selecciona una categoría'
    if (!form.url.trim())   errs.url  = 'El enlace es obligatorio'
    else if (!form.url.trim().startsWith('http')) errs.url = 'Debe ser una URL válida (https://...)'
    return errs
  }

  function validateCategory() {
    const errs = {}
    if (!catName.trim()) errs.catName = 'El nombre es obligatorio'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (mode === 'category') {
      const errs = validateCategory()
      if (Object.keys(errs).length) { setErrors(errs); return }
      onAddCategory(program, catName)
    } else {
      const errs = validateReport()
      if (Object.keys(errs).length) { setErrors(errs); return }
      onAddReport(program, catId, form)
    }
    setSuccess(true)
    setTimeout(() => onClose(), 900)
  }

  if (!open) return null
  const selectedProg = PROGRAMS.find(p => p.id === program)

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.modal} role="dialog" aria-modal="true">

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.modeSwitcher}>
            <button
              type="button"
              className={`${styles.modeBtn} ${mode === 'report' ? styles.modeBtnActive : ''}`}
              onClick={() => { setMode('report'); setErrors({}) }}
            >
              <FileText size={13} strokeWidth={2} />
              Nuevo reporte
            </button>
            <button
              type="button"
              className={`${styles.modeBtn} ${mode === 'category' ? styles.modeBtnActive : ''}`}
              onClick={() => { setMode('category'); setErrors({}) }}
            >
              <FolderPlus size={13} strokeWidth={2} />
              Nueva categoría
            </button>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        {success ? (
          <div className={styles.successState}>
            <CheckCircle2 size={36} strokeWidth={1.5} color="#68CC87" />
            <p>{mode === 'category' ? 'Categoría creada' : 'Reporte creado'} correctamente</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.body}>

              {/* Program selector */}
              <div className={styles.field}>
                <label className={styles.label}><ChevronDown size={13} strokeWidth={2} /> Programa académico</label>
                <div className={styles.programGrid}>
                  {PROGRAMS.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      className={`${styles.progBtn} ${program === p.id ? styles.progActive : ''}`}
                      style={program === p.id ? {
                        background: p.colorActive,
                        borderColor: p.colorActive,
                        color: p.colorActiveText,
                        boxShadow: `0 4px 14px ${p.accentShadow}`
                      } : {}}
                      onClick={() => setProgram(p.id)}
                    >
                      <span className={styles.progDot} style={{ background: p.color }} />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {mode === 'category' ? (
                /* ── CATEGORY FORM ── */
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="cat-name">
                    <Tag size={13} strokeWidth={2} />
                    Nombre de la categoría <span className={styles.required}>*</span>
                  </label>
                  <input
                    ref={firstRef}
                    id="cat-name"
                    className={`${styles.input} ${errors.catName ? styles.inputError : ''}`}
                    type="text"
                    placeholder="Ej: 2025-1, 2024-2, Especial..."
                    value={catName}
                    onChange={e => { setCatName(e.target.value); if (errors.catName) setErrors(p => ({...p, catName: null})) }}
                    maxLength={40}
                  />
                  {errors.catName && <p className={styles.errorMsg}>{errors.catName}</p>}
                </div>
              ) : (
                /* ── REPORT FORM ── */
                <>
                  {/* Category selector */}
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="r-cat">
                      <Tag size={13} strokeWidth={2} />
                      Categoría <span className={styles.required}>*</span>
                    </label>
                    {progCats.length === 0 ? (
                      <div className={styles.noCats}>
                        No hay categorías en este programa.
                        <button type="button" className={styles.noCatsBtn} onClick={() => setMode('category')}>
                          Crear una ahora
                        </button>
                      </div>
                    ) : (
                      <select
                        id="r-cat"
                        className={`${styles.select} ${errors.cat ? styles.inputError : ''}`}
                        value={catId}
                        onChange={e => { setCatId(e.target.value); if (errors.cat) setErrors(p => ({...p, cat: null})) }}
                      >
                        <option value="">Selecciona una categoría...</option>
                        {progCats.map(c => (
                          <option key={c.id} value={c.id}>{c.name}</option>
                        ))}
                      </select>
                    )}
                    {errors.cat && <p className={styles.errorMsg}>{errors.cat}</p>}
                  </div>

                  {/* Name */}
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="r-name">
                      <FileText size={13} strokeWidth={2} />
                      Nombre del reporte <span className={styles.required}>*</span>
                    </label>
                    <input
                      ref={firstRef}
                      id="r-name"
                      className={`${styles.input} ${errors.name ? styles.inputError : ''}`}
                      type="text"
                      placeholder="Ej: Matrículas activas por periodo"
                      value={form.name}
                      onChange={e => set('name', e.target.value)}
                      maxLength={80}
                    />
                    {errors.name && <p className={styles.errorMsg}>{errors.name}</p>}
                  </div>

                  {/* Description */}
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="r-desc">
                      <AlignLeft size={13} strokeWidth={2} />
                      Descripción
                      <span className={styles.optional}>opcional</span>
                    </label>
                    <textarea
                      id="r-desc"
                      className={styles.textarea}
                      placeholder="Breve descripción de qué mide este reporte"
                      value={form.desc}
                      onChange={e => set('desc', e.target.value)}
                      rows={2}
                      maxLength={160}
                    />
                  </div>

                  {/* URL */}
                  <div className={styles.field}>
                    <label className={styles.label} htmlFor="r-url">
                      <Link2 size={13} strokeWidth={2} />
                      Enlace de Looker Studio <span className={styles.required}>*</span>
                    </label>
                    <input
                      id="r-url"
                      className={`${styles.input} ${styles.inputMono} ${errors.url ? styles.inputError : ''}`}
                      type="url"
                      placeholder="https://datastudio.google.com/reporting/..."
                      value={form.url}
                      onChange={e => set('url', e.target.value)}
                    />
                    {errors.url && <p className={styles.errorMsg}>{errors.url}</p>}
                  </div>
                </>
              )}

            </div>

            <div className={styles.footer}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>Cancelar</button>
              <button
                type="submit"
                className={styles.confirmBtn}
                style={{ background: selectedProg.colorActive, boxShadow: `0 4px 16px ${selectedProg.accentShadow}` }}
              >
                <Plus size={14} strokeWidth={2.2} />
                {mode === 'category' ? 'Crear categoría' : 'Crear reporte'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
