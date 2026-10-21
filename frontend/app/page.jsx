'use client'

import { useState } from 'react'

export default function Home() {
  const [pin, setPin] = useState('')

  return (
    <div className="kahoot-page">
      {/* ====================================================================
          FONDO ORGÁNICO CURVADO ESTILO KAHOOT CON LA PALETA OFICIAL
          ==================================================================== */}
      <div className="kahoot-bg-canvas" aria-hidden="true">
        {/* Curva granate/naranja izquierda */}
        <div className="bg-wave-left" />

        {/* Arco dominante verde oscuro / verde derecho */}
        <div className="bg-arc-right" />

        {/* Resplandor inferior suave amarillo y verde */}
        <div className="bg-sphere-glow" />

        {/* Curvas SVG geométricas tipo Kahoot superpuestas */}
        <svg
          className="bg-curved-svg"
          viewBox="0 0 1440 900"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          {/* Gran onda granate oscura de fondo */}
          <path
            d="M-100 200 C300 120 500 500 1000 350 C1250 270 1400 480 1550 420 L1550 1000 L-100 1000 Z"
            fill="#461020"
            fillOpacity="0.45"
          />

          {/* Gran arco curvado característico de Kahoot (corte diagonal suave) */}
          <path
            d="M-50 780 C320 620 680 720 1100 520 C1300 420 1480 460 1600 410 L1600 950 L-50 950 Z"
            fill="#3e6b32"
            fillOpacity="0.35"
          />

          {/* Onda sutil naranja en la esquina superior izquierda */}
          <path
            d="M-80 -80 C200 -20 320 220 180 440 C80 580 -40 620 -120 600 Z"
            fill="#b03921"
            fillOpacity="0.22"
          />

          {/* Arco circular verde luminoso superior derecho */}
          <circle
            cx="1350"
            cy="150"
            r="480"
            fill="#608841"
            fillOpacity="0.25"
          />
          <circle
            cx="1350"
            cy="150"
            r="340"
            fill="#fdc623"
            fillOpacity="0.08"
          />
        </svg>
      </div>

      {/* ====================================================================
          PARTE SUPERIOR: BOTÓN ACCESO A PROFESIONALES ARRIBA A LA IZQUIERDA
          ==================================================================== */}
      <header className="kahoot-topbar">
        <button
          type="button"
          className="btn-profesores"
          aria-label="Acceso a profesionales"
        >
          <span className="prof-icon-wrap" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18C5 19.94 8.13 22 12 22C15.87 22 19 19.94 19 17.18V13.18L12 17L5 13.18Z" />
            </svg>
          </span>
          <span>Acceso a profesionales</span>
        </button>
      </header>

      {/* ====================================================================
          PARTE DEL MEDIO SUPERIOR: TÍTULO WEB CON FUENTE TALINA DEMO
          Y EN EL CENTRO: DOS SECCIONES CENTRADAS (PIN Y MODO INDIVIDUAL)
          ==================================================================== */}
      <main className="kahoot-main-content">
        {/* Título en texto web tipográfico con Talina DEMO */}
        <div className="kahoot-title-wrapper">
          <h1 className="brand-title" aria-label="Chavales Legales">
            <span className="title-left-col">
              <span className="title-word">CHAVAL</span>
              <span className="title-word">LEGAL</span>
            </span>
            <span className="title-suffix-es">ES</span>
          </h1>
        </div>

        {/* Las dos secciones centradas */}
        <div className="kahoot-sections-stack">
          {/* SECCIÓN 1: ACCESO POR PIN A SESIONES */}
          <section className="pin-section-card" aria-label="Acceso por PIN a sesiones">
            <div className="pin-card-header">
              <span className="pin-badge-title">PIN DE LA SESIÓN</span>
            </div>

            <form
              className="pin-form"
              onSubmit={(e) => {
                e.preventDefault()
                /* Enlaces no funcionales de momento según requerimiento */
              }}
            >
              <div className="pin-input-container">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={9}
                  placeholder="Introduce el PIN"
                  className="pin-input"
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  autoComplete="off"
                  spellCheck="false"
                />
              </div>

              <button
                type="button"
                className="btn-pin-submit"
              >
                <span>Entrar</span>
              </button>
            </form>
          </section>

          {/* SECCIÓN 2: ABAJO PARA JUGAR SIN PIN (ACCESO INDIVIDUAL) */}
          <section className="solo-section-card" aria-label="Jugar sin PIN">
            <h2 className="solo-title">¿No tienes PIN de clase?</h2>

            <button
              type="button"
              className="btn-solo-action"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <rect x="2" y="6" width="20" height="12" rx="6" />
                <path d="M6 12h4" />
                <path d="M8 10v4" />
                <line x1="15" y1="13" x2="15.01" y2="13" />
                <line x1="18" y1="11" x2="18.01" y2="11" />
              </svg>
              <span>Jugar sin PIN</span>
            </button>
          </section>
        </div>
      </main>

      {/* ====================================================================
          PIE DE PÁGINA ESTILO KAHOOT (EDUCATIVO Y SUTIL)
          ==================================================================== */}
      <footer className="kahoot-footer">
        <div className="footer-inner">
          <p className="footer-highlight">
            Chavales Legales · Tu escudo digital
          </p>
          <p className="footer-sub">
            ¿Necesitas ayuda con trampas o acoso online? Llama gratis al <b>017</b> (INCIBE · Confidencial)
          </p>
          <div className="footer-links-row">
            <span>Proyecto Team UCM</span>
            <span>•</span>
            <span>Seguridad Digital Infantil</span>
            <span>•</span>
            <span>AEPD Canal Prioritario</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
