'use client'

import { useState, useEffect } from 'react'
import AvatarGeometrico from './AvatarGeometrico'

const TOTAL_SEATS = 12

const NOMBRES_MOCK = [
  'Lucía M.',
  'Mateo G.',
  'Sofía R.',
  'Hugo V.',
  'Martina D.',
  'Alejandro P.',
  'Valeria S.',
  'Lucas B.',
  'Emma C.',
  'Daniel T.',
  'Carla N.',
  'Pablo J.',
]

const OPCIONES_PELO = [
  { label: 'Castaño', hex: '#4A2810' },
  { label: 'Rubio', hex: '#FACC15' },
  { label: 'Oscuro', hex: '#18181B' },
  { label: 'Pelirrojo', hex: '#B03921' },
  { label: 'Verde', hex: '#86EFAC' },
  { label: 'Rosa', hex: '#F472B6' },
]

const OPCIONES_ROPA = [
  { label: 'Granate', hex: '#4A1A1C' },
  { label: 'Verde bosque', hex: '#3D4A27' },
  { label: 'Amarillo', hex: '#FACC15' },
  { label: 'Verde claro', hex: '#86EFAC' },
  { label: 'Naranja', hex: '#B03921' },
  { label: 'Azul', hex: '#1E3A8A' },
]

// Genera un avatar aleatorio con la paleta de colores corporativa
function generarAvatarAleatorio(nombre = 'Tú') {
  const baseType = Math.floor(Math.random() * 3) + 1
  const colorPelo = OPCIONES_PELO[Math.floor(Math.random() * OPCIONES_PELO.length)].hex
  const tieneGorro = Math.random() > 0.5
  const colorRopa = OPCIONES_ROPA[Math.floor(Math.random() * OPCIONES_ROPA.length)].hex

  return {
    nombre,
    baseType,
    colorPelo,
    tieneGorro,
    colorRopa,
  }
}

// Coordenadas fijas para las 12 sillas en 3 filas de 4
const SEAT_COORDS = [
  // Fila 1 (fondo)
  { id: 0, x: 155, y: 195, row: 1 },
  { id: 1, x: 370, y: 195, row: 1 },
  { id: 2, x: 590, y: 195, row: 1 },
  { id: 3, x: 805, y: 195, row: 1 },
  // Fila 2 (centro)
  { id: 4, x: 155, y: 330, row: 2 },
  { id: 5, x: 370, y: 330, row: 2 },
  { id: 6, x: 590, y: 330, row: 2 },
  { id: 7, x: 805, y: 330, row: 2 },
  // Fila 3 (frente)
  { id: 8, x: 155, y: 465, row: 3 },
  { id: 9, x: 370, y: 465, row: 3 },
  { id: 10, x: 590, y: 465, row: 3 },
  { id: 11, x: 805, y: 465, row: 3 },
]

export default function SalaEsperaAlumnos({ pin = '734 912', onVolver }) {
  // Modal de personalización: cerrado al entrar (se genera uno random automáticamente estilo Kahoot)
  const [mostrarPersonalizador, setMostrarPersonalizador] = useState(false)

  // Configuración del avatar del alumno actual (generado aleatoriamente al inicio)
  const [miAvatar, setMiAvatar] = useState(() => generarAvatarAleatorio('Tú'))

  // Estado local para los alumnos: el alumno actual ya ocupa la Silla 1 con su avatar aleatorio
  const [students, setStudents] = useState(() => {
    const avatarInicial = generarAvatarAleatorio('Tú')
    return [
      {
        id: 'player-1',
        nombre: avatarInicial.nombre,
        seatIndex: 0,
        baseType: avatarInicial.baseType,
        colorPelo: avatarInicial.colorPelo,
        tieneGorro: avatarInicial.tieneGorro,
        colorRopa: avatarInicial.colorRopa,
        isPlayer: true,
      },
    ]
  })

  // Sincronizar miAvatar con el avatar inicial colocado en el asiento 0
  useEffect(() => {
    if (students.length > 0 && students[0].isPlayer) {
      setMiAvatar({
        nombre: students[0].nombre,
        baseType: students[0].baseType,
        colorPelo: students[0].colorPelo,
        tieneGorro: students[0].tieneGorro,
        colorRopa: students[0].colorRopa,
      })
    }
  }, [])

  // Al confirmar el avatar modificado, actualiza el primer pupitre (asiento 0)
  const confirmarMiAvatar = () => {
    setMostrarPersonalizador(false)
    setStudents((prev) => {
      const alumnoJugador = {
        id: 'player-1',
        nombre: miAvatar.nombre || 'Tú',
        seatIndex: 0,
        baseType: miAvatar.baseType,
        colorPelo: miAvatar.colorPelo,
        tieneGorro: miAvatar.tieneGorro,
        colorRopa: miAvatar.colorRopa,
        isPlayer: true,
      }
      const sinAsientoCero = prev.filter((s) => s.seatIndex !== 0)
      return [alumnoJugador, ...sinAsientoCero]
    })
  }

  // Genera otro avatar aleatorio dentro del modal
  const aleatorizarMiAvatar = () => {
    const nuevo = generarAvatarAleatorio(miAvatar.nombre || 'Tú')
    setMiAvatar(nuevo)
  }

  // Simulación de entrada paulatina de compañeros bots cada 2-3 segundos
  useEffect(() => {
    if (students.length >= TOTAL_SEATS) return

    const timer = setTimeout(() => {
      setStudents((prev) => {
        if (prev.length >= TOTAL_SEATS) return prev

        // Buscar siguiente asiento libre
        const asientosOcupados = prev.map((s) => s.seatIndex)
        let siguienteAsiento = 0
        for (let i = 0; i < TOTAL_SEATS; i++) {
          if (!asientosOcupados.includes(i)) {
            siguienteAsiento = i
            break
          }
        }

        // Generar alumno ficticio con avatar paramétrico aleatorio
        const nuevo = {
          id: `bot-${siguienteAsiento + 1}`,
          nombre: NOMBRES_MOCK[siguienteAsiento] || `Alumno ${siguienteAsiento + 1}`,
          seatIndex: siguienteAsiento,
          baseType: (siguienteAsiento % 3) + 1,
          colorPelo: OPCIONES_PELO[siguienteAsiento % OPCIONES_PELO.length].hex,
          tieneGorro: siguienteAsiento % 2 === 0,
          colorRopa: OPCIONES_ROPA[(siguienteAsiento + 1) % OPCIONES_ROPA.length].hex,
          isPlayer: false,
        }
        return [...prev, nuevo]
      })
    }, 2400)

    return () => clearTimeout(timer)
  }, [students.length])

  // Helpers para testing rápido
  const reiniciarAula = () => {
    // Mantener al jugador en el asiento 0 y vaciar el resto
    const jugador = students.find((s) => s.isPlayer)
    setStudents(jugador ? [jugador] : [])
  }

  const llenarAula = () => {
    const todos = SEAT_COORDS.map((seat, idx) => {
      if (idx === 0) {
        return {
          id: 'player-1',
          nombre: miAvatar.nombre || 'Tú',
          seatIndex: 0,
          baseType: miAvatar.baseType,
          colorPelo: miAvatar.colorPelo,
          tieneGorro: miAvatar.tieneGorro,
          colorRopa: miAvatar.colorRopa,
          isPlayer: true,
        }
      }
      return {
        id: `bot-${idx + 1}`,
        nombre: NOMBRES_MOCK[idx] || `Alumno ${idx + 1}`,
        seatIndex: idx,
        baseType: (idx % 3) + 1,
        colorPelo: OPCIONES_PELO[idx % OPCIONES_PELO.length].hex,
        tieneGorro: idx % 2 === 0,
        colorRopa: OPCIONES_ROPA[idx % OPCIONES_ROPA.length].hex,
        isPlayer: false,
      }
    })
    setStudents(todos)
  }

  const porcentajeLleno = Math.round((students.length / TOTAL_SEATS) * 100)

  return (
    <div className="sala-page-wrapper">
      <style>{`
        .sala-page-wrapper {
          min-height: 100vh;
          width: 100%;
          background: radial-gradient(circle at 50% 25%, #461020 0%, #2a0712 65%, #1d040c 100%);
          color: #18181B;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 24px 16px 40px;
          box-sizing: border-box;
          position: relative;
        }

        .sala-card-container {
          width: 100%;
          max-width: 1080px;
          background: #FFFFFF;
          border-radius: 28px;
          box-shadow: 0 24px 48px rgba(0, 0, 0, 0.35), 0 4px 16px rgba(0, 0, 0, 0.2);
          overflow: hidden;
          border: 4px solid #18181B;
          display: flex;
          flex-direction: column;
        }

        .sala-top-banner {
          background: #4A1A1C;
          color: #FFFFFF;
          padding: 18px 28px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-bottom: 4px solid #18181B;
        }

        .sala-badge-live {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #3D4A27;
          border: 2px solid #86EFAC;
          padding: 6px 14px;
          border-radius: 999px;
          font-size: 13px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .sala-dot-pulse {
          width: 9px;
          height: 9px;
          background: #86EFAC;
          border-radius: 50%;
          box-shadow: 0 0 10px #86EFAC;
          animation: pulseAnim 1.6s infinite ease-in-out;
        }

        .sala-title-main {
          font-size: 24px;
          font-weight: 800;
          margin: 6px 0 2px;
          color: #FFFFFF;
        }

        .sala-subtitle {
          font-size: 14px;
          color: #FACC15;
          font-weight: 500;
          margin: 0;
        }

        .sala-pin-pill {
          background: #FFFFFF;
          color: #18181B;
          border: 3px solid #18181B;
          border-radius: 16px;
          padding: 8px 18px;
          text-align: center;
          box-shadow: 0 4px 0 #18181B;
        }

        .sala-pin-label {
          display: block;
          font-size: 11px;
          font-weight: 800;
          color: #3D4A27;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .sala-pin-value {
          display: block;
          font-size: 22px;
          font-weight: 900;
          letter-spacing: 0.08em;
          color: #4A1A1C;
        }

        .sala-subbar {
          background: #FDFBF7;
          padding: 12px 28px;
          border-bottom: 2px solid #E2D9CC;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
        }

        .sala-counter-wrap {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .sala-counter-text {
          font-size: 14px;
          font-weight: 700;
          color: #18181B;
        }

        .sala-progress-track {
          width: 140px;
          height: 12px;
          background: #E5E7EB;
          border-radius: 999px;
          overflow: hidden;
          border: 2px solid #18181B;
        }

        .sala-progress-fill {
          height: 100%;
          background: #86EFAC;
          transition: width 0.4s ease;
        }

        .sala-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .btn-sala-pill {
          background: #FFFFFF;
          border: 2px solid #18181B;
          padding: 6px 12px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          color: #18181B;
          cursor: pointer;
          transition: transform 0.1s ease, background 0.15s ease;
        }

        .btn-sala-pill:hover {
          background: #FACC15;
          transform: translateY(-1px);
        }

        .btn-sala-pill:active {
          transform: translateY(1px);
        }

        .btn-avatar-edit {
          background: #FACC15;
          border: 2.5px solid #18181B;
          padding: 6px 14px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 800;
          color: #18181B;
          cursor: pointer;
          box-shadow: 0 3px 0 #18181B;
          transition: transform 0.1s ease, background 0.15s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .btn-avatar-edit:hover {
          background: #fed857;
          transform: translateY(-1px);
        }

        .btn-sala-volver {
          background: #4A1A1C;
          color: #FFFFFF;
          border: 2px solid #18181B;
          padding: 6px 14px;
          border-radius: 12px;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }

        .btn-sala-volver:hover {
          background: #3D4A27;
        }

        .sala-canvas-stage {
          background: #FBF9F5;
          position: relative;
          width: 100%;
          padding: 10px 10px 20px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .classroom-svg {
          width: 100%;
          height: auto;
          display: block;
          max-height: 640px;
        }

        .sala-footer-legal {
          background: #FFFFFF;
          border-top: 3px solid #18181B;
          padding: 14px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 12px;
          font-size: 13px;
          color: #4B5563;
        }

        .sala-tip-badge {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
          color: #3D4A27;
        }

        /* ==============================================================
           MODAL DE PERSONALIZACIÓN DE AVATAR (ESTILO KAHOOT / DUOLINGO)
           ============================================================== */
        .avatar-modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(29, 4, 12, 0.78);
          backdrop-filter: blur(6px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 16px;
        }

        .avatar-modal-card {
          background: #FFFFFF;
          width: 100%;
          max-width: 480px;
          border-radius: 28px;
          border: 4px solid #18181B;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4), 0 6px 0 #18181B;
          overflow: hidden;
          animation: popModal 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          flex-direction: column;
        }

        .modal-header {
          background: #4A1A1C;
          color: #FFFFFF;
          padding: 16px 22px;
          border-bottom: 3px solid #18181B;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .modal-title {
          font-size: 20px;
          font-weight: 900;
          margin: 0;
          color: #FFFFFF;
        }

        .modal-subtitle {
          font-size: 13px;
          color: #FACC15;
          margin-top: 2px;
          font-weight: 600;
        }

        .btn-modal-close {
          background: rgba(255, 255, 255, 0.15);
          border: 2px solid #FFFFFF;
          color: #FFFFFF;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          font-size: 14px;
          font-weight: 900;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease, transform 0.1s ease;
        }

        .btn-modal-close:hover {
          background: #B03921;
          transform: scale(1.08);
        }

        .modal-body {
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
        }

        .preview-box {
          background: #FAF6EE;
          border: 3px solid #18181B;
          border-radius: 22px;
          padding: 12px 24px 10px;
          display: flex;
          flex-direction: column;
          align-items: center;
          width: 100%;
          max-width: 240px;
          box-shadow: inset 0 2px 6px rgba(0,0,0,0.06);
          position: relative;
        }

        .btn-randomize-pill {
          background: #FACC15;
          border: 2px solid #18181B;
          color: #18181B;
          font-size: 11px;
          font-weight: 800;
          padding: 5px 12px;
          border-radius: 999px;
          margin-top: 6px;
          cursor: pointer;
          box-shadow: 0 2px 0 #18181B;
          transition: transform 0.1s ease, background 0.15s ease;
        }

        .btn-randomize-pill:hover {
          background: #fed857;
          transform: scale(1.05);
        }

        .selector-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .selector-label {
          font-size: 12px;
          font-weight: 800;
          color: #4A1A1C;
          text-transform: uppercase;
          letter-spacing: 0.06em;
        }

        .base-tabs-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 8px;
          width: 100%;
        }

        .btn-base-tab {
          background: #F4F1EA;
          border: 2.5px solid #18181B;
          border-radius: 14px;
          padding: 8px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          cursor: pointer;
          font-weight: 800;
          font-size: 11px;
          color: #18181B;
          transition: transform 0.1s ease, background 0.15s ease;
        }

        .btn-base-tab.active {
          background: #FACC15;
          box-shadow: 0 3px 0 #18181B;
          transform: translateY(-2px);
        }

        .swatches-row {
          display: flex;
          gap: 10px;
          justify-content: center;
          flex-wrap: wrap;
        }

        .btn-swatch {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: 3px solid #18181B;
          cursor: pointer;
          box-shadow: 0 2px 0 #18181B;
          transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-swatch.active {
          transform: scale(1.18);
          border-color: #18181B;
          box-shadow: 0 4px 0 #18181B;
        }

        .btn-toggle-hat {
          background: #F4F1EA;
          border: 2.5px solid #18181B;
          border-radius: 14px;
          padding: 10px 14px;
          font-weight: 800;
          font-size: 13px;
          color: #18181B;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          transition: transform 0.1s ease, background 0.15s ease;
        }

        .btn-toggle-hat.active {
          background: #86EFAC;
          box-shadow: 0 3px 0 #18181B;
        }

        .btn-confirm-avatar {
          background: #3D4A27;
          color: #FFFFFF;
          border: 3px solid #18181B;
          border-radius: 16px;
          padding: 12px 24px;
          font-size: 15px;
          font-weight: 800;
          cursor: pointer;
          width: 100%;
          box-shadow: 0 4px 0 #18181B;
          transition: transform 0.1s ease, background 0.15s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 4px;
        }

        .btn-confirm-avatar:hover {
          background: #4D5E33;
          transform: translateY(-2px);
        }

        .btn-confirm-avatar:active {
          transform: translateY(2px);
          box-shadow: 0 1px 0 #18181B;
        }

        @keyframes pulseAnim {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.6; }
        }

        @keyframes popModal {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes popAvatar {
          0% {
            transform: scale(0.3) translateY(24px);
            opacity: 0;
          }
          70% {
            transform: scale(1.08) translateY(-4px);
            opacity: 1;
          }
          100% {
            transform: scale(1) translateY(0);
            opacity: 1;
          }
        }

        @keyframes nameFloat {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }

        .anim-pop-avatar {
          animation: popAvatar 0.45s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }

        .anim-name-float {
          animation: nameFloat 3s ease-in-out infinite;
        }
      `}</style>

      {/* ==============================================================
          MODAL DE PERSONALIZACIÓN DE AVATAR (ABIERTO SOLO SI EL USUARIO QUIERE)
          ============================================================== */}
      {mostrarPersonalizador && (
        <div className="avatar-modal-overlay" onClick={() => setMostrarPersonalizador(false)}>
          <div className="avatar-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">🎨 Personaliza tu Personaje</h2>
                <p className="modal-subtitle">Modifica tu estilo o genera otro aleatorio</p>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={() => setMostrarPersonalizador(false)}
                title="Cerrar sin guardar"
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              {/* Previsualización en tiempo real y botón de re-roll aleatorio */}
              <div className="preview-box">
                <AvatarGeometrico
                  standalone
                  size={120}
                  baseType={miAvatar.baseType}
                  colorPelo={miAvatar.colorPelo}
                  tieneGorro={miAvatar.tieneGorro}
                  colorRopa={miAvatar.colorRopa}
                />
                <button
                  type="button"
                  className="btn-randomize-pill"
                  onClick={aleatorizarMiAvatar}
                  title="Generar otro avatar al azar estilo Kahoot"
                >
                  🎲 Generar aleatorio
                </button>
              </div>

              {/* Selector de tipo de base (1, 2 o 3) */}
              <div className="selector-section">
                <span className="selector-label">1. Elige tu base de personaje</span>
                <div className="base-tabs-grid">
                  <button
                    type="button"
                    className={`btn-base-tab ${miAvatar.baseType === 1 ? 'active' : ''}`}
                    onClick={() => setMiAvatar((prev) => ({ ...prev, baseType: 1 }))}
                  >
                    <span>Curioso</span>
                    <span style={{ fontSize: '10px', color: '#6B7280' }}>Base 1</span>
                  </button>

                  <button
                    type="button"
                    className={`btn-base-tab ${miAvatar.baseType === 2 ? 'active' : ''}`}
                    onClick={() => setMiAvatar((prev) => ({ ...prev, baseType: 2 }))}
                  >
                    <span>Skater</span>
                    <span style={{ fontSize: '10px', color: '#6B7280' }}>Base 2</span>
                  </button>

                  <button
                    type="button"
                    className={`btn-base-tab ${miAvatar.baseType === 3 ? 'active' : ''}`}
                    onClick={() => setMiAvatar((prev) => ({ ...prev, baseType: 3 }))}
                  >
                    <span>Sabio</span>
                    <span style={{ fontSize: '10px', color: '#6B7280' }}>Base 3</span>
                  </button>
                </div>
              </div>

              {/* Controles dinámicos según el baseType seleccionado */}
              <div className="selector-section">
                {miAvatar.baseType === 1 && (
                  <div>
                    <span className="selector-label" style={{ display: 'block', marginBottom: '8px' }}>
                      2. Color de pelo
                    </span>
                    <div className="swatches-row">
                      {OPCIONES_PELO.map((pelo) => (
                        <button
                          key={pelo.hex}
                          type="button"
                          className={`btn-swatch ${miAvatar.colorPelo === pelo.hex ? 'active' : ''}`}
                          style={{ background: pelo.hex }}
                          title={pelo.label}
                          onClick={() => setMiAvatar((prev) => ({ ...prev, colorPelo: pelo.hex }))}
                        >
                          {miAvatar.colorPelo === pelo.hex && (
                            <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold' }}>✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {miAvatar.baseType === 2 && (
                  <div>
                    <span className="selector-label" style={{ display: 'block', marginBottom: '8px' }}>
                      2. Accesorio de cabeza
                    </span>
                    <button
                      type="button"
                      className={`btn-toggle-hat ${miAvatar.tieneGorro ? 'active' : ''}`}
                      onClick={() => setMiAvatar((prev) => ({ ...prev, tieneGorro: !prev.tieneGorro }))}
                    >
                      <span>{miAvatar.tieneGorro ? '🧢 Con gorra hacia atrás' : '✂️ Sin gorra (Pelo moderno)'}</span>
                      <span style={{ fontSize: '11px', fontWeight: 'bold' }}>
                        {miAvatar.tieneGorro ? '(Puesto)' : '(Quitado)'}
                      </span>
                    </button>
                  </div>
                )}

                {miAvatar.baseType === 3 && (
                  <div>
                    <span className="selector-label" style={{ display: 'block', marginBottom: '8px' }}>
                      2. Color de sudadera
                    </span>
                    <div className="swatches-row">
                      {OPCIONES_ROPA.map((ropa) => (
                        <button
                          key={ropa.hex}
                          type="button"
                          className={`btn-swatch ${miAvatar.colorRopa === ropa.hex ? 'active' : ''}`}
                          style={{ background: ropa.hex }}
                          title={ropa.label}
                          onClick={() => setMiAvatar((prev) => ({ ...prev, colorRopa: ropa.hex }))}
                        >
                          {miAvatar.colorRopa === ropa.hex && (
                            <span style={{ color: '#FFFFFF', fontSize: '14px', fontWeight: 'bold' }}>✓</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Botón de confirmación */}
              <button
                type="button"
                className="btn-confirm-avatar"
                onClick={confirmarMiAvatar}
              >
                <span>Guardar cambios</span>
                <span>✨</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor blanco principal de la sala */}
      <div className="sala-card-container">
        {/* Cabecera superior con estado y PIN */}
        <div className="sala-top-banner">
          <div>
            <div className="sala-badge-live">
              <span className="sala-dot-pulse" />
              <span>SALA DE ESPERA ACTIVA</span>
            </div>
            <h1 className="sala-title-main">Aula Virtual de Chavales Legales</h1>
            <p className="sala-subtitle">Los pupitres se están ocupando. ¡La partida comenzará en breve!</p>
          </div>

          <div className="sala-pin-pill">
            <span className="sala-pin-label">PIN DE CLASE</span>
            <span className="sala-pin-value">{pin || '734 912'}</span>
          </div>
        </div>

        {/* Barra de progreso y acciones */}
        <div className="sala-subbar">
          <div className="sala-counter-wrap">
            <span className="sala-counter-text">
              Alumnos en el aula: <b>{students.length}</b> / {TOTAL_SEATS}
            </span>
            <div className="sala-progress-track">
              <div
                className="sala-progress-fill"
                style={{ width: `${porcentajeLleno}%` }}
              />
            </div>
          </div>

          <div className="sala-actions">
            <button
              type="button"
              className="btn-avatar-edit"
              onClick={() => setMostrarPersonalizador(true)}
              title="Personalizar mi personaje"
            >
              🎨 Personalizar mi avatar
            </button>
            <button
              type="button"
              className="btn-sala-pill"
              onClick={reiniciarAula}
              title="Vaciar las sillas para volver a ver la animación"
            >
              🔄 Reiniciar
            </button>
            <button
              type="button"
              className="btn-sala-pill"
              onClick={llenarAula}
              title="Llenar todos los pupitres de inmediato"
            >
              ⚡ Llenar aula
            </button>
            {onVolver && (
              <button
                type="button"
                className="btn-sala-volver"
                onClick={onVolver}
              >
                Volver
              </button>
            )}
          </div>
        </div>

        {/* Escenario del aula en SVG puro */}
        <div className="sala-canvas-stage">
          <svg
            className="classroom-svg"
            viewBox="0 0 960 560"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <filter id="cardShadow" x="-10%" y="-10%" width="120%" height="130%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#18181B" floodOpacity="0.18" />
              </filter>
              <filter id="deskShadow" x="-20%" y="-20%" width="140%" height="150%">
                <feDropShadow dx="0" dy="4" stdDeviation="3" floodColor="#18181B" floodOpacity="0.12" />
              </filter>
            </defs>

            {/* SUELO Y PARED POLIGONAL DEL AULA */}
            <rect x="0" y="0" width="960" height="130" fill="#EFE8DD" />
            <line x1="0" y1="130" x2="960" y2="130" stroke="#4A1A1C" strokeWidth="6" />

            <rect x="0" y="133" width="960" height="427" fill="#F8F4EC" />
            <line x1="0" y1="260" x2="960" y2="260" stroke="#ECE2D0" strokeWidth="2" strokeDasharray="6 6" />
            <line x1="0" y1="395" x2="960" y2="395" stroke="#ECE2D0" strokeWidth="2" strokeDasharray="6 6" />
            <line x1="240" y1="133" x2="160" y2="560" stroke="#EFE5D5" strokeWidth="1.5" />
            <line x1="480" y1="133" x2="480" y2="560" stroke="#EFE5D5" strokeWidth="1.5" />
            <line x1="720" y1="133" x2="800" y2="560" stroke="#EFE5D5" strokeWidth="1.5" />

            {/* PIZARRA DIGITAL FRONTAL */}
            <g transform="translate(240, 18)">
              <rect x="0" y="0" width="480" height="96" rx="14" fill="#3D4A27" stroke="#18181B" strokeWidth="3" />
              <rect x="10" y="10" width="460" height="76" rx="10" fill="#1F2E22" />
              <text x="240" y="34" textAnchor="middle" fill="#FACC15" fontSize="13" fontWeight="800" letterSpacing="2">
                CHAVALES LEGALES · AULA 4B
              </text>
              <text x="240" y="58" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="900" letterSpacing="1">
                SALA DE ESPERA
              </text>
              <g transform="translate(140, 66)">
                <circle cx="8" cy="8" r="4" fill="#86EFAC" />
                <text x="22" y="12" fill="#86EFAC" fontSize="11" fontWeight="700">
                  Esperando a que el profesor inicie la partida...
                </text>
              </g>
            </g>

            {/* DECORACIÓN IZQUIERDA: MESA DE PROFESOR CON MARTILLO DE JUEZ */}
            <g transform="translate(40, 36)">
              <polygon points="0,50 140,50 130,85 10,85" fill="#DDD2C0" stroke="#18181B" strokeWidth="2.5" />
              <polygon points="10,85 130,85 125,92 15,92" fill="#C5B7A1" stroke="#18181B" strokeWidth="2.5" />
              <rect x="25" y="40" width="34" height="10" rx="2" fill="#4A1A1C" stroke="#18181B" strokeWidth="1.5" />
              <rect x="27" y="32" width="30" height="9" rx="2" fill="#3D4A27" stroke="#18181B" strokeWidth="1.5" />
              <rect x="29" y="25" width="26" height="8" rx="2" fill="#FACC15" stroke="#18181B" strokeWidth="1.5" />
              <g transform="translate(85, 34)">
                <ellipse cx="20" cy="16" rx="14" ry="4" fill="#4A1A1C" stroke="#18181B" strokeWidth="1.5" />
                <line x1="8" y1="14" x2="28" y2="4" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
                <rect x="22" y="-2" width="12" height="7" rx="2" fill="#4A1A1C" stroke="#18181B" strokeWidth="1.5" transform="rotate(-30 26 2)" />
              </g>
            </g>

            {/* DECORACIÓN DERECHA: PLANTA POLIGONAL Y RELOJ */}
            <g transform="translate(840, 28)">
              <polygon points="20,0 40,0 52,12 52,32 40,44 20,44 8,32 8,12" fill="#3D4A27" stroke="#18181B" strokeWidth="2.5" />
              <circle cx="30" cy="22" r="14" fill="#FFFFFF" />
              <line x1="30" y1="22" x2="30" y2="13" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
              <line x1="30" y1="22" x2="37" y2="22" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
              <polygon points="12,85 48,85 42,108 18,108" fill="#4A1A1C" stroke="#18181B" strokeWidth="2" />
              <polygon points="30,85 15,65 30,75" fill="#3D4A27" />
              <polygon points="30,85 45,65 30,75" fill="#86EFAC" />
              <polygon points="30,75 30,55 35,70" fill="#3D4A27" />
            </g>

            {/* ==========================================================
                RENDERIZADO DE LOS 12 PUPITRES / SILLAS
                (Renderizados de atrás hacia adelante para correcta oclusión)
               ========================================================== */}
            {SEAT_COORDS.map((seat) => {
              const student = students.find((s) => s.seatIndex === seat.id)
              const { x, y } = seat

              return (
                <g
                  key={`seat-${seat.id}`}
                  id={`desk-group-${seat.id}`}
                  onClick={student && student.isPlayer ? () => setMostrarPersonalizador(true) : undefined}
                  style={{ cursor: student && student.isPlayer ? 'pointer' : 'default' }}
                >
                  {/* --- SILLA VACÍA (SIEMPRE DETRÁS DEL PUPITRE) --- */}
                  <g>
                    <polygon
                      points={`${x - 22},${y - 28} ${x + 22},${y - 28} ${x + 18},${y - 4} ${x - 18},${y - 4}`}
                      fill={student ? '#3D4A27' : '#D8D1C4'}
                      stroke="#18181B"
                      strokeWidth="2.2"
                    />
                    <polygon
                      points={`${x - 22},${y - 28} ${x + 22},${y - 28} ${x + 18},${y - 22} ${x - 18},${y - 22}`}
                      fill={student ? '#4D5E33' : '#E8E2D6'}
                    />
                    <polygon
                      points={`${x - 18},${y - 4} ${x + 18},${y - 4} ${x + 14},${y + 8} ${x - 14},${y + 8}`}
                      fill={student ? '#2A3519' : '#C2BAAC'}
                      stroke="#18181B"
                      strokeWidth="1.8"
                    />
                  </g>

                  {/* --- AVATAR GEOMÉTRICO (ESTILO DUOLINGO SIN CONTORNOS) --- */}
                  {student && (
                    <g
                      className="anim-pop-avatar"
                      style={{ transformOrigin: `${x}px ${y}px` }}
                    >
                      <AvatarGeometrico
                        standalone={false}
                        x={x}
                        y={y}
                        baseType={student.baseType || 1}
                        colorPelo={student.colorPelo}
                        tieneGorro={student.tieneGorro}
                        colorRopa={student.colorRopa}
                      />
                    </g>
                  )}

                  {/* --- PUPITRE DE MADERA (EN FRENTE DEL ALUMNO) --- */}
                  <g filter="url(#deskShadow)">
                    <line x1={x - 46} y1={y + 40} x2={x - 46} y2={y + 60} stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />
                    <line x1={x + 46} y1={y + 40} x2={x + 46} y2={y + 60} stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />

                    <polygon
                      points={`${x - 64},${y + 4} ${x + 64},${y + 4} ${x + 54},${y + 36} ${x - 54},${y + 36}`}
                      fill="#FAF7F0"
                      stroke="#18181B"
                      strokeWidth="2.5"
                    />

                    <polygon
                      points={`${x - 54},${y + 36} ${x + 54},${y + 36} ${x + 50},${y + 44} ${x - 50},${y + 44}`}
                      fill="#DFD7C7"
                      stroke="#18181B"
                      strokeWidth="2.5"
                    />
                  </g>

                  {/* --- ELEMENTO ENCIMA DEL PUPITRE (VACÍO O CON UTENSILIOS) --- */}
                  {!student ? (
                    <g>
                      <rect
                        x={x - 30}
                        y={y + 12}
                        width="60"
                        height="18"
                        rx="6"
                        fill="#F3EFE7"
                        stroke="#B8B0A2"
                        strokeWidth="1.5"
                        strokeDasharray="3 3"
                      />
                      <text
                        x={x}
                        y={y + 24}
                        textAnchor="middle"
                        fontSize="10"
                        fontWeight="700"
                        fill="#8A8274"
                      >
                        Silla {seat.id + 1}
                      </text>
                    </g>
                  ) : (
                    <g>
                      {/* Manos apoyadas en la mesa estilo flat */}
                      <ellipse cx={x - 20} cy={y + 14} rx="4.5" ry="3.5" fill="#FDE0C5" />
                      <ellipse cx={x + 20} cy={y + 14} rx="4.5" ry="3.5" fill="#FDE0C5" />

                      {/* Utensilio sobre el pupitre */}
                      {renderDeskItem(x, y, seat.id)}
                    </g>
                  )}

                  {/* --- CARTEL FLOTANTE CON NOMBRE DEL ALUMNO --- */}
                  {student && (
                    <g
                      className="anim-name-float"
                      style={{ transformOrigin: `${x}px ${y - 60}px` }}
                    >
                      <rect
                        x={x - (student.isPlayer ? 54 : 48)}
                        y={y - 74}
                        width={student.isPlayer ? 108 : 96}
                        height={23}
                        rx={11.5}
                        fill={student.isPlayer ? '#FACC15' : '#FFFFFF'}
                        stroke="#18181B"
                        strokeWidth="2.2"
                        filter="url(#cardShadow)"
                      />
                      <circle
                        cx={x - (student.isPlayer ? 40 : 36)}
                        cy={y - 62.5}
                        r={3.5}
                        fill={student.isPlayer ? '#4A1A1C' : '#22C55E'}
                      />
                      <text
                        x={x + 5}
                        y={y - 58.5}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight="800"
                        fill="#18181B"
                        letterSpacing="0.02em"
                      >
                        {student.isPlayer ? `⭐ ${student.nombre}` : student.nombre}
                      </text>
                    </g>
                  )}
                </g>
              )
            })}
          </svg>
        </div>

        {/* Pie informativo de la sala */}
        <div className="sala-footer-legal">
          <div className="sala-tip-badge">
            <span>💡</span>
            <span><b>Consejo Legalín:</b> Nadie puede obligarte a compartir fotos privadas ni contraseñas. ¡Juega limpio y seguro!</span>
          </div>

          <div>
            <span>Ayuda ante dudas o acoso: <b>017</b> (INCIBE · Gratuito)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

function renderDeskItem(x, y, id) {
  const itemVariant = id % 3

  if (itemVariant === 0) {
    return (
      <g>
        <polygon points={`${x - 14},${y + 7} ${x + 14},${y + 7} ${x + 11},${y + 24} ${x - 11},${y + 24}`} fill="#18181B" />
        <polygon points={`${x - 11},${y + 9} ${x + 11},${y + 9} ${x + 9},${y + 21} ${x - 9},${y + 21}`} fill="#86EFAC" />
      </g>
    )
  }

  if (itemVariant === 1) {
    return (
      <g>
        <rect
          x={x - 14}
          y={y + 11}
          width="24"
          height="17"
          rx="2"
          fill="#FFFFFF"
          stroke="#3D4A27"
          strokeWidth="1.5"
          transform={`rotate(-5 ${x - 2} ${y + 19})`}
        />
        <line x1={x + 13} y1={y + 11} x2={x + 19} y2={y + 25} stroke="#FACC15" strokeWidth="2.8" strokeLinecap="round" />
      </g>
    )
  }

  return (
    <g>
      <rect x={x - 16} y={y + 10} width="32" height="19" rx="3" fill="#4A1A1C" stroke="#18181B" strokeWidth="1.5" />
      <rect x={x - 13} y={y + 12} width="26" height="15" rx="2" fill="#FACC15" />
      <text x={x} y={y + 23} textAnchor="middle" fontSize="8" fontWeight="900" fill="#4A1A1C">
        § LEX
      </text>
    </g>
  )
}
