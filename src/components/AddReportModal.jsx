import { useState, useEffect, useRef } from 'react'
import { X, Plus, Link2, FileText, AlignLeft, ChevronDown, CheckCircle2 } from 'lucide-react'
import { PROGRAMS } from '../programs'
import styles from './AddReportModal.module.css'

const EMPTY = { name: '', desc: '', url: '', program: 'regencia' }

export default function AddReportModal({ open, onClose, onConfirm, defaultProgram }) {
  const [form, setForm] = useState({ ...EMPTY, program: defaultProgram || 'regencia' })
  const [errors, setErrors] = useState({})
  const [success, setSuccess] = useState(false)
  const nameRef = useRef(null)

  useEffect(() => {
    if (open) {
      setForm({ ...EMPTY, program: defaultProgram || 'regencia' })
      setErrors({})
      setSuccess(false)
      setTimeout(() => nameRef.current?.focus(), 80)
    }
  }, [open, defaultProgram])

  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose() }
    if (open) window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  function set(field, value) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: null }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim())    errs.name = 'El nombre es obligatorio'
    if (!form.url.trim())     errs.url  = 'El enlace es obligatorio'
    else if (!form.url.trim().startsWith('http')) errs.url = 'Debe ser una URL válida (https://...)'
    return errs
  }

  function handleSubmit(e) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }

    onConfirm(form.program, { name: form.name, desc: form.desc, url: form.url })
    setSuccess(true)
    setTimeout(() => onClose(), 900)
  }

  if (!open) return null

  const selectedProg = PROGRAMS.find(p => p.id === form.program)

  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className={styles.modal} role="dialog" aria-modal="true" aria-label="Agregar reporte">

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.headerIcon}>
              <Plus size={16} strokeWidth={2} />
            </div>
            <div>
              <p className={styles.headerTitle}>Nuevo reporte</p>
              <p className={styles.headerSub}>Se guardará en el panel de tu programa</p>
            </div>
          </div>
          <button className={styles.closeBtn} onClick={onClose} aria-label="Cerrar">
            <X size={16} strokeWidth={2} />
          </button>
        </div>

        {success ? (
          <div className={styles.successState}>
            <CheckCircle2 size={36} strokeWidth={1.5} color="#68CC87" />
            <p>Reporte creado correctamente</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.body}>

              {/* Program selector */}
              <div className={styles.field}>
                <label className={styles.label}>
                  <ChevronDown size={13} strokeWidth={2} />
                  Programa académico
                </label>
                <div className={styles.programGrid}>
                  {PROGRAMS.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      className={`${styles.progBtn} ${form.program === p.id ? styles.progActive : ''}`}
                      style={form.program === p.id ? {
                        background: p.colorActive,
                        borderColor: p.colorActive,
                        color: p.colorActiveText,
                        boxShadow: `0 4px 14px ${p.accentShadow}`
                      } : {}}
                      onClick={() => set('program', p.id)}
                    >
                      <span
                        className={styles.progDot}
                        style={{ background: p.color }}
                      />
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div className={styles.field}>
                <label className={styles.label} htmlFor="r-name">
                  <FileText size={13} strokeWidth={2} />
                  Nombre del reporte <span className={styles.required}>*</span>
                </label>
                <input
                  ref={nameRef}
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

            </div>

            {/* Footer */}
            <div className={styles.footer}>
              <button type="button" className={styles.cancelBtn} onClick={onClose}>
                Cancelar
              </button>
              <button
                type="submit"
                className={styles.confirmBtn}
                style={{ background: selectedProg.colorActive, boxShadow: `0 4px 16px ${selectedProg.accentShadow}` }}
              >
                <Plus size={15} strokeWidth={2.2} />
                Crear tarjeta
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  )
}
