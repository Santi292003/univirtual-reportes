import { useState } from 'react'
import { Plus, LayoutGrid, ExternalLink } from 'lucide-react'
import { PROGRAMS } from './programs'
import { useReports } from './useReports'
import ReportCard from './components/ReportCard'
import AddReportModal from './components/AddReportModal'
import styles from './App.module.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('regencia')
  const [modalOpen, setModalOpen] = useState(false)
  const { reports, addReport, removeReport } = useReports()

  const activeProg = PROGRAMS.find(p => p.id === activeTab)

  function handleAdd(program, data) {
    addReport(program, data)
    setActiveTab(program)
  }

  return (
    <>
      {/* ── HEADER ── */}
      <header className={styles.header}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <rect x="2" y="2" width="6" height="6" rx="1.5" fill="#00B4DD"/>
              <rect x="10" y="2" width="6" height="6" rx="1.5" fill="rgba(255,255,255,0.30)"/>
              <rect x="2" y="10" width="6" height="6" rx="1.5" fill="rgba(255,255,255,0.30)"/>
              <rect x="10" y="10" width="6" height="6" rx="1.5" fill="#00B4DD" opacity="0.55"/>
            </svg>
          </div>
          <div className={styles.brandText}>
            <span className={styles.brandName}>Univirtual</span>
            <span className={styles.brandSub}>Universidad Tecnológica de Pereira</span>
          </div>
        </div>
        <span className={`${styles.headerTag} mono`}>Looker Studio</span>
      </header>

      {/* ── HERO ── */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            Panel de <em>reportes</em> y métricas
          </h1>
          <p className={styles.heroSub}>
            Accede a los dashboards de seguimiento por programa académico.
            Datos actualizados en tiempo real desde Looker Studio.
          </p>
        </div>
      </section>

      {/* ── MAIN ── */}
      <main className={styles.main}>

        {/* Toolbar */}
        <div className={styles.toolbar}>
          <div className={styles.tabs}>
            {PROGRAMS.map(prog => (
              <button
                key={prog.id}
                className={`${styles.tabBtn} ${activeTab === prog.id ? styles.tabActive : ''}`}
                style={activeTab === prog.id ? {
                  background: prog.colorActive,
                  borderColor: prog.colorActive,
                  color: prog.colorActiveText,
                  boxShadow: `0 4px 14px ${prog.accentShadow}`
                } : {}}
                onClick={() => setActiveTab(prog.id)}
              >
                <span className={styles.pip} style={{ background: prog.color }} />
                {prog.label}
                <span
                  className={styles.badge}
                  style={activeTab === prog.id ? {
                    background: 'rgba(255,255,255,0.18)',
                    color: prog.colorActiveText
                  } : {
                    background: prog.colorBg,
                    color: prog.colorText
                  }}
                >
                  {reports[prog.id]?.length || 0}
                </span>
              </button>
            ))}
          </div>

          <button
            className={styles.addBtn}
            onClick={() => setModalOpen(true)}
          >
            <Plus size={15} strokeWidth={2.2} />
            Agregar reporte
          </button>
        </div>

        {/* Panel content */}
        {PROGRAMS.map(prog => (
          <div
            key={prog.id}
            className={`${styles.panel} ${activeTab === prog.id ? styles.panelActive : ''}`}
          >
            <p className={`${styles.panelLabel} mono`}>
              Reportes · {prog.label}
            </p>

            {reports[prog.id]?.length === 0 ? (
              <div className={styles.empty}>
                <div className={styles.emptyIcon}>
                  <LayoutGrid size={22} strokeWidth={1.5} color="var(--muted-lt)" />
                </div>
                <p className={styles.emptyTitle}>Sin reportes aún</p>
                <p className={styles.emptyDesc}>
                  Agrega el primer reporte de {prog.label} con el botón de arriba.
                </p>
                <button
                  className={styles.emptyBtn}
                  style={{ borderColor: prog.color, color: prog.colorText }}
                  onClick={() => setModalOpen(true)}
                >
                  <Plus size={13} strokeWidth={2.2} />
                  Agregar reporte
                </button>
              </div>
            ) : (
              <div className={styles.grid}>
                {reports[prog.id].map(report => (
                  <ReportCard
                    key={report.id}
                    report={report}
                    program={prog.id}
                    onRemove={id => removeReport(prog.id, id)}
                  />
                ))}
              </div>
            )}
          </div>
        ))}

      </main>

      <footer className={`${styles.footer} mono`}>
        univirtual · utp &nbsp;—&nbsp; datos vía looker studio
      </footer>

      <AddReportModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={handleAdd}
        defaultProgram={activeTab}
      />
    </>
  )
}
