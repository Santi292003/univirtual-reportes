import { useState } from 'react'
import { Plus, LayoutGrid, RefreshCw, WifiOff } from 'lucide-react'
import { PROGRAMS } from './programs'
import { useReports } from './useReports'
import CategoryAccordion from './components/CategoryAccordion'
import AddModal from './components/AddModal'
import styles from './App.module.css'

export default function App() {
  const [activeTab, setActiveTab] = useState('regencia')
  const [modalOpen, setModalOpen] = useState(false)
  const { data, loading, error, addCategory, removeCategory, toggleCategory, addReport, removeReport } = useReports()

  const categoriesMap = Object.fromEntries(
    PROGRAMS.map(p => [p.id, data[p.id]?.categories || []])
  )

  function totalReports(progId) {
    return (data[progId]?.categories || []).reduce((sum, c) => sum + c.reports.length, 0)
  }

  return (
    <>
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

      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>Panel de <em>reportes</em> y métricas</h1>
          <p className={styles.heroSub}>
            Accede a los dashboards de seguimiento por programa académico,
            organizados por categoría y periodo.
          </p>
        </div>
      </section>

      <main className={styles.main}>

        {/* Error banner */}
        {error && (
          <div className={styles.errorBanner}>
            <WifiOff size={15} strokeWidth={2} />
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className={styles.loadingState}>
            <RefreshCw size={20} strokeWidth={1.8} className={styles.spinner} />
            <p>Cargando reportes...</p>
          </div>
        ) : (
          <>
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
                      {totalReports(prog.id)}
                    </span>
                  </button>
                ))}
              </div>
              <button className={styles.addBtn} onClick={() => setModalOpen(true)}>
                <Plus size={14} strokeWidth={2.2} />
                Agregar
              </button>
            </div>

            {PROGRAMS.map(prog => (
              <div
                key={prog.id}
                className={`${styles.panel} ${activeTab === prog.id ? styles.panelActive : ''}`}
              >
                <p className={`${styles.panelLabel} mono`}>
                  {prog.label} · {(data[prog.id]?.categories || []).length} categorías
                </p>

                {(data[prog.id]?.categories || []).length === 0 ? (
                  <div className={styles.empty}>
                    <div className={styles.emptyIcon}>
                      <LayoutGrid size={22} strokeWidth={1.5} color="var(--muted-lt)" />
                    </div>
                    <p className={styles.emptyTitle}>Sin categorías aún</p>
                    <p className={styles.emptyDesc}>
                      Crea una categoría (ej: 2025-1) para empezar a organizar los reportes de {prog.label}.
                    </p>
                    <button
                      className={styles.emptyBtn}
                      style={{ borderColor: prog.color, color: prog.colorText }}
                      onClick={() => setModalOpen(true)}
                    >
                      <Plus size={13} strokeWidth={2.2} />
                      Crear categoría
                    </button>
                  </div>
                ) : (
                  <div className={styles.accordionList}>
                    {(data[prog.id]?.categories || []).map(cat => (
                      <CategoryAccordion
                        key={cat.id}
                        category={cat}
                        program={prog.id}
                        onToggle={id => toggleCategory(prog.id, id)}
                        onRemoveCategory={id => removeCategory(prog.id, id)}
                        onRemoveReport={(catId, repId) => removeReport(prog.id, catId, repId)}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </main>

      <footer className={`${styles.footer} mono`}>
        univirtual · utp &nbsp;—&nbsp; datos vía looker studio
      </footer>

      <AddModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onAddCategory={(prog, name) => { addCategory(prog, name); setActiveTab(prog) }}
        onAddReport={(prog, catId, form) => { addReport(prog, catId, form); setActiveTab(prog) }}
        defaultProgram={activeTab}
        categories={categoriesMap}
      />
    </>
  )
}
