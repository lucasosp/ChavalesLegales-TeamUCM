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

        {/* Elementos geométricos y de ciberseguridad flotantes estilo Kahoot */}
        <div className="floating-elements">
          {/* Triángulo amarillo */}
          <div className="float-item item-1">
            <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
              <polygon points="22,6 38,38 6,38" fill="#fdc623" fillOpacity="0.4" />
            </svg>
          </div>

          {/* Rombo naranja */}
          <div className="float-item item-2">
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
              <polygon points="24,4 44,24 24,44 4,24" fill="#b03921" fillOpacity="0.45" />
            </svg>
          </div>

          {/* Escudo protector verde */}
          <div className="float-item item-3">
            <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="#608841" strokeWidth="2.5">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" fill="#608841" fillOpacity="0.35" />
            </svg>
          </div>

          {/* Candado de ciberseguridad amarillo */}
          <div className="float-item item-4">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#fdc623" strokeWidth="2.2">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" fill="#fdc623" fillOpacity="0.3" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>

          {/* Cuadrado rotado verde oscuro */}
          <div className="float-item item-5">
            <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
              <rect x="6" y="6" width="24" height="24" rx="4" fill="#3e6b32" fillOpacity="0.5" />
            </svg>
          </div>

          {/* Círculo granate luminoso */}
          <div className="float-item item-6">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <circle cx="20" cy="20" r="16" fill="#461020" stroke="#b03921" strokeWidth="2" fillOpacity="0.6" />
            </svg>
          </div>
        </div>
      </div>

      {/* ====================================================================
          PARTE SUPERIOR: SOLO UN BOTÓN QUE DICE ACCESO A PROFESORES
          ==================================================================== */}
      <header className="kahoot-topbar">
        <button
          type="button"
          className="btn-profesores"
          aria-label="Acceso a profesores"
        >
          <span className="prof-icon-wrap" aria-hidden="true">
            <svg viewBox="0 0 24 24">
              <path d="M12 3L1 9L12 15L21 10.09V17H23V9M5 13.18V17.18C5 19.94 8.13 22 12 22C15.87 22 19 19.94 19 17.18V13.18L12 17L5 13.18Z" />
            </svg>
          </span>
          <span>Acceso a profesores</span>
        </button>
      </header>

      {/* ====================================================================
          PARTE DEL MEDIO SUPERIOR: LOGO DE CHAVALES LEGALES
          Y EN EL CENTRO: DOS SECCIONES CENTRADAS (PIN Y MODO INDIVIDUAL)
          ==================================================================== */}
      <main className="kahoot-main-content">
        {/* Logo oficial de Chavales Legales */}
        <div className="kahoot-logo-wrapper">
          <img
            src="/logo.png"
            alt="Logo de Chavales Legales"
            className="kahoot-logo-img"
          />
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
          <section className="solo-section-card" aria-label="Jugar sin PIN - Acceso individual">
            <div className="solo-header">
              <div className="solo-badge">
                <span className="solo-badge-dot" />
                <span>Acceso individual</span>
              </div>
            </div>

            <div className="solo-content-row">
              <div className="solo-mascot-avatar" title="Legalín">
                <img
                  src="/mascota.jpg"
                  alt="Legalín, la mascota de Chavales Legales"
                />
              </div>

              <div className="solo-texts">
                <h2 className="solo-title">¿No tienes PIN de clase?</h2>
                <p className="solo-desc">
                  Juega por libre y conviértete en un Chaval Legal entrenando contra el ciberacoso y fraudes.
                </p>
              </div>
            </div>

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

            {/* Micro-chips de los modos individuales disponibles */}
            <div className="solo-modes-pills">
              <span className="mode-chip">
                <span>📖</span> Modo Historia
              </span>
              <span className="mode-chip">
                <span>⚡</span> Desafío Preguntas
              </span>
              <span className="mode-chip">
                <span>🤝</span> Cooperativo
              </span>
            </div>
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
