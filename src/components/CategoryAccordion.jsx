import { useState } from 'react'
import { ChevronDown, Trash2, FolderOpen, Folder } from 'lucide-react'
import { getProgram } from '../programs'
import ReportCard from './ReportCard'
import styles from './CategoryAccordion.module.css'

export default function CategoryAccordion({ category, program, onToggle, onRemoveCategory, onRemoveReport }) {
  const [confirmDel, setConfirmDel] = useState(false)
  const prog = getProgram(program)
  const count = category.reports.length

  function handleDeleteCat(e) {
    e.stopPropagation()
    if (confirmDel) {
      onRemoveCategory(category.id)
    } else {
      setConfirmDel(true)
      setTimeout(() => setConfirmDel(false), 2500)
    }
  }

  return (
    <div className={styles.accordion} style={{ '--accent': prog.color, '--accent-bg': prog.colorBg }}>
      {/* ── HEADER ── */}
      <button
        className={styles.trigger}
        onClick={() => onToggle(category.id)}
        aria-expanded={category.expanded}
      >
        <div className={styles.triggerLeft}>
          <span className={styles.folderIcon}>
            {category.expanded
              ? <FolderOpen size={15} strokeWidth={1.8} />
              : <Folder size={15} strokeWidth={1.8} />
            }
          </span>
          <span className={styles.catName}>{category.name}</span>
          <span className={styles.countBadge} style={{ background: prog.colorBg, color: prog.colorText }}>
            {count} {count === 1 ? 'reporte' : 'reportes'}
          </span>
        </div>
        <div className={styles.triggerRight}>
          <button
            className={`${styles.delBtn} ${confirmDel ? styles.delConfirm : ''}`}
            onClick={handleDeleteCat}
            title={confirmDel ? 'Clic de nuevo para eliminar' : 'Eliminar categoría'}
          >
            <Trash2 size={12} strokeWidth={1.8} />
            {confirmDel && <span>¿Eliminar?</span>}
          </button>
          <span
            className={styles.chevron}
            style={{ transform: category.expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <ChevronDown size={15} strokeWidth={2} />
          </span>
        </div>
      </button>

      {/* ── CONTENT ── */}
      {category.expanded && (
        <div className={styles.content}>
          {count === 0 ? (
            <div className={styles.emptySlot}>
              <span>Sin reportes en esta categoría</span>
            </div>
          ) : (
            <div className={styles.grid}>
              {category.reports.map(report => (
                <ReportCard
                  key={report.id}
                  report={report}
                  program={program}
                  onRemove={id => onRemoveReport(category.id, id)}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
