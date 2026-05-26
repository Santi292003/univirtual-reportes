import { useState } from 'react'
import { ExternalLink, Trash2, FileBarChart2 } from 'lucide-react'
import { getProgram } from '../programs'
import styles from './ReportCard.module.css'

export default function ReportCard({ report, program, onRemove }) {
  const [confirming, setConfirming] = useState(false)
  const prog = getProgram(program)

  function handleRemoveClick(e) {
    e.preventDefault()
    e.stopPropagation()
    if (confirming) {
      onRemove(report.id)
    } else {
      setConfirming(true)
      setTimeout(() => setConfirming(false), 2500)
    }
  }

  return (
    <div className={styles.card} style={{ '--accent': prog.color, '--accent-bg': prog.colorBg, '--accent-text': prog.colorText }}>
      <a
        className={styles.cardLink}
        href={report.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        <div className={styles.iconWrap}>
          <FileBarChart2 size={18} strokeWidth={1.8} />
        </div>

        <div className={styles.body}>
          <p className={styles.name}>{report.name}</p>
          {report.desc && <p className={styles.desc}>{report.desc}</p>}
        </div>

        <div className={styles.footer}>
          <span className={`${styles.source} mono`}>looker studio</span>
          <ExternalLink size={13} strokeWidth={1.8} className={styles.extIcon} />
        </div>
      </a>

      <button
        className={`${styles.deleteBtn} ${confirming ? styles.confirming : ''}`}
        onClick={handleRemoveClick}
        title={confirming ? 'Clic de nuevo para eliminar' : 'Eliminar reporte'}
      >
        <Trash2 size={13} strokeWidth={1.8} />
        {confirming && <span>¿Eliminar?</span>}
      </button>
    </div>
  )
}
