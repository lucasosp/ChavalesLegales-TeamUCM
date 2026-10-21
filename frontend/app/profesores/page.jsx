'use client'

import Link from 'next/link'

export default function ApartadoProfesores() {
  return (
    <div className="kahoot-page">
      {/* Fondo orgánico con curvas dinámicas de la paleta activa */}
      <div className="kahoot-bg-canvas" aria-hidden="true">
        <div className="bg-wave-left" />
        <div className="bg-arc-right" />
        <div className="bg-sphere-glow" />

        <svg
          className="bg-curved-svg"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M-100 200 C300 120 500 500 1000 350 C1250 270 1400 480 1550 420 L1550 1000 L-100 1000 Z"
            fill="var(--granate)"
            fillOpacity="0.45"
          />
          <path
            d="M-50 780 C320 620 680 720 1100 520 C1300 420 1480 460 1600 410 L1600 950 L-50 950 Z"
            fill="var(--verde-oscuro)"
            fillOpacity="0.35"
          />
          <path
            d="M-80 -80 C200 -20 320 220 180 440 C80 580 -40 620 -120 600 Z"
            fill="var(--naranja)"
            fillOpacity="0.22"
          />
          <circle cx="1350" cy="150" r="480" fill="var(--verde)" fillOpacity="0.25" />
          <circle cx="1350" cy="150" r="340" fill="var(--amarillo)" fillOpacity="0.12" />
        </svg>
      </div>

      {/* Barra superior con botón para volver al inicio */}
      <header className="kahoot-topbar">
        <Link href="/" className="btn-back-home" aria-label="Volver a la página principal">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Inicio</span>
        </Link>
      </header>

      {/* Contenido principal del apartado de profesores */}
      <main className="kahoot-main-content">
        <div className="teacher-panel-container">
          {/* Cabecera del panel docente */}
          <div className="teacher-header-box">
            <span className="teacher-badge-tag">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18C5 19.94 8.13 22 12 22C15.87 22 19 19.94 19 17.18V13.18L12 17L5 13.18Z" />
              </svg>
              Apartado de profesores
            </span>
            <h1 className="teacher-title">Actividades para el aula</h1>
            <p className="teacher-subtitle">
              Selecciona una dinámica para proyectar en clase o dinamizar con tus alumnos.
            </p>
          </div>

          {/* ====================================================================
              LOS BOTONES GRANDES DE JUEGOS:
              1. Superior: "Modo historieta"
              2. Centro: "Modo juicio"
              3. Inferior: "Juzgado de Legalín"
              ==================================================================== */}
          <div className="teacher-buttons-stack">
            {/* BOTÓN SUPERIOR: MODO HISTORIETA */}
            <Link
              href="/historia"
              className="teacher-game-btn teacher-game-btn--historia"
              aria-label="Abrir Modo historieta"
            >
              <div className="game-btn-left">
                <div className="game-btn-icon-wrapper" aria-hidden="true">
                  📖
                </div>
                <div className="game-btn-text-group">
                  <span className="game-btn-badge">Narrativa & Toma de decisiones</span>
                  <span className="game-btn-title">Modo historieta</span>
                  <span className="game-btn-desc">
                    Aventura interactiva donde la clase debate y toma decisiones frente a trampas digitales, suplantación y estafas.
                  </span>
                </div>
              </div>
              <div className="game-btn-action" aria-hidden="true">
                <span>Jugar</span>
                <span>→</span>
              </div>
            </Link>

            {/* BOTÓN INFERIOR: MODO JUICIO */}
            <Link
              href="/juicio"
              className="teacher-game-btn teacher-game-btn--juicio"
              aria-label="Abrir Modo juicio"
            >
              <div className="game-btn-left">
                <div className="game-btn-icon-wrapper" aria-hidden="true">
                  ⚖️
                </div>
                <div className="game-btn-text-group">
                  <span className="game-btn-badge">Tribunal Digital & Veredicto</span>
                  <span className="game-btn-title">Modo juicio</span>
                  <span className="game-btn-desc">
                    Simulación de juicios rápidos. La clase analiza casos reales de menores y tecnología para dictar sentencia con el Código Penal.
                  </span>
                </div>
              </div>
              <div className="game-btn-action" aria-hidden="true">
                <span>Jugar</span>
                <span>→</span>
              </div>
            </Link>

            {/* BOTÓN INFERIOR: JUZGADO DE LEGALÍN */}
            <Link
              href="/juzgado"
              className="teacher-game-btn teacher-game-btn--juzgado"
              aria-label="Abrir Juzgado de Legalín"
            >
              <div className="game-btn-left">
                <div className="game-btn-icon-wrapper" aria-hidden="true">
                  🐒
                </div>
                <div className="game-btn-text-group">
                  <span className="game-btn-badge">Mesa del juez</span>
                  <span className="game-btn-title">Juzgado de Legalín</span>
                  <span className="game-btn-desc">
                    Revisa el caso, pide lo que falta y sella LEGAL o ILEGAL. Luego elige a quién acudir. De 7 a 16 años.
                  </span>
                </div>
              </div>
              <div className="game-btn-action" aria-hidden="true">
                <span>Jugar</span>
                <span>→</span>
              </div>
            </Link>
          </div>
        </div>
      </main>

      {/* Pie de página */}
      <footer className="kahoot-footer">
        <div className="footer-inner">
          <p className="footer-highlight">Chavales Legales · Tu escudo digital</p>
          <div className="footer-links-row">
            <a href="https://www.ucm.es/" target="_blank" rel="noopener noreferrer" className="footer-link">UCM</a>
            <span>•</span>
            <a href="https://www.juventudinfancia.gob.es/" target="_blank" rel="noopener noreferrer" className="footer-link">Infancia y juventud</a>
            <span>•</span>
            <a href="https://www.administraciondejusticia.gob.es/" target="_blank" rel="noopener noreferrer" className="footer-link">Administración de Justicia</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
