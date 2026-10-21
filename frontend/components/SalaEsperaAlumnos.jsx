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

const BASES_DISPONIBLES = [1, 3, 4, 5, 6]

const BASES_CATALOGO = [
  { id: 1, label: 'Curioso' },
  { id: 3, label: 'Sabio' },
  { id: 4, label: 'Coleta' },
  { id: 5, label: 'Diadema' },
  { id: 6, label: 'Legalín' },
]

// Genera un avatar aleatorio con la paleta de colores corporativa
function generarAvatarAleatorio(nombre = 'Tú') {
  const baseType = BASES_DISPONIBLES[Math.floor(Math.random() * BASES_DISPONIBLES.length)]
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

// Generación dinámica de coordenadas de asientos para cualquier capacidad
function getSeatCoords(totalSeats) {
  const X_COLS = [155, 370, 590, 805]
  const Y_START = 195
  const Y_STEP = 135
  const seats = []
  for (let i = 0; i < totalSeats; i++) {
    const col = i % 4
    const row = Math.floor(i / 4) + 1
    seats.push({
      id: i,
      x: X_COLS[col],
      y: Y_START + (row - 1) * Y_STEP,
      row,
    })
  }
  return seats
}

export default function SalaEsperaAlumnos({
  pin = '734 912',
  cleanPin: rawCleanPin,
  students: externalStudents,
  onVolver,
  onIniciar,
  customActions,
  isHost = false,
  currentSeat = null,
  roomUrl = '',
  onUpdateAvatar,
}) {
  const isLive = Array.isArray(externalStudents)
  const cleanPin = rawCleanPin || (pin ? String(pin).replace(/\s+/g, '') : '')
  const displayUrl = roomUrl || (cleanPin ? `http://localhost:3001/profesores/sala/${cleanPin}` : '')

  // Modal de personalización: cerrado al entrar (se genera uno random automáticamente estilo Kahoot)
    // Estado para la capacidad del aula y modo infinito
  const [capacidadAula, setCapacidadAula] = useState(TOTAL_SEATS)
  const [modoInfinito, setModoInfinito] = useState(false)

  const aumentarCapacidad = () => {
    setCapacidadAula((prev) => prev + 4)
  }

  const disminuirCapacidad = () => {
    setCapacidadAula((prev) => {
      const minOcupado = Math.ceil(students.length / 4) * 4 || 4
      return Math.max(minOcupado, prev - 4)
    })
  }

  const [mostrarPersonalizador, setMostrarPersonalizador] = useState(false)

  // Configuración del avatar del alumno actual (recupera de localStorage o genera aleatorio)
  const [miAvatar, setMiAvatar] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const guardado = localStorage.getItem('chavales_mi_avatar')
        if (guardado) return JSON.parse(guardado)
      } catch {}
    }
    return generarAvatarAleatorio('Tú')
  })

  // Estado del avatar confirmado que se visualiza en el pupitre
  const [avatarConfirmado, setAvatarConfirmado] = useState(miAvatar)

  const miAsiento = currentSeat !== null && currentSeat !== undefined ? currentSeat : 0

  // Estado local para los alumnos en la sala de espera simulada
  const [mockStudents, setMockStudents] = useState(() => {
    return [
      {
        id: 'player-1',
        nombre: miAvatar.nombre || 'Tú',
        seatIndex: miAsiento,
        baseType: miAvatar.baseType,
        colorPelo: miAvatar.colorPelo,
        tieneGorro: miAvatar.tieneGorro,
        colorRopa: miAvatar.colorRopa,
        isPlayer: true,
      },
    ]
  })

  // Al confirmar el avatar modificado, actualiza el pupitre y notifica cambios
  const confirmarMiAvatar = () => {
    setMostrarPersonalizador(false)
    setAvatarConfirmado(miAvatar)

    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('chavales_mi_avatar', JSON.stringify(miAvatar))
      } catch {}
    }

    if (onUpdateAvatar) {
      onUpdateAvatar(miAvatar)
    }

    setMockStudents((prev) => {
      const alumnoJugador = {
        id: 'player-1',
        nombre: miAvatar.nombre || 'Tú',
        seatIndex: miAsiento,
        baseType: miAvatar.baseType,
        colorPelo: miAvatar.colorPelo,
        tieneGorro: miAvatar.tieneGorro,
        colorRopa: miAvatar.colorRopa,
        isPlayer: true,
      }
      const sinMiAsiento = prev.filter((s) => s.seatIndex !== miAsiento)
      return [alumnoJugador, ...sinMiAsiento]
    })
  }

  // Cancelar personalización y revertir a la versión confirmada
  const cancelarPersonalizacion = () => {
    setMostrarPersonalizador(false)
    setMiAvatar(avatarConfirmado)
  }

  // Abrir modal asegurando sincronización con el confirmado
  const abrirPersonalizador = () => {
    setMiAvatar(avatarConfirmado)
    setMostrarPersonalizador(true)
  }

  // Genera otro avatar aleatorio dentro del modal
  const aleatorizarMiAvatar = () => {
    const nuevo = generarAvatarAleatorio(miAvatar.nombre || 'Tú')
    setMiAvatar(nuevo)
  }

  // Simulación de entrada paulatina de compañeros bots cada 2-3 segundos solo si NO estamos en vivo
  useEffect(() => {
    if (isLive) return
    if (mockStudents.length >= capacidadAula) return

    const timer = setTimeout(() => {
      setMockStudents((prev) => {
        if (prev.length >= capacidadAula) return prev

        // Buscar siguiente asiento libre
        const asientosOcupados = prev.map((s) => s.seatIndex)
        let siguienteAsiento = 0
        for (let i = 0; i < capacidadAula; i++) {
          if (!asientosOcupados.includes(i)) {
            siguienteAsiento = i
            break
          }
        }

        // Generar alumno ficticio con avatar paramétrico aleatorio
        const nuevo = {
          id: `bot-${siguienteAsiento + 1}`,
          nombre: NOMBRES_MOCK[siguienteAsiento % NOMBRES_MOCK.length] || `Alumno ${siguienteAsiento + 1}`,
          seatIndex: siguienteAsiento,
          baseType: BASES_DISPONIBLES[siguienteAsiento % BASES_DISPONIBLES.length],
          colorPelo: OPCIONES_PELO[siguienteAsiento % OPCIONES_PELO.length].hex,
          tieneGorro: siguienteAsiento % 2 === 0,
          colorRopa: OPCIONES_ROPA[(siguienteAsiento + 1) % OPCIONES_ROPA.length].hex,
          isPlayer: false,
        }
        return [...prev, nuevo]
      })
    }, 2400)

    return () => clearTimeout(timer)
  }, [isLive, mockStudents.length, capacidadAula])

  // Helpers para testing rápido
  const reiniciarAula = () => {
    // Mantener al jugador en el asiento 0 y vaciar el resto
    const jugador = mockStudents.find((s) => s.isPlayer)
    setMockStudents(jugador ? [jugador] : [])
  }

  const llenarAula = () => {
    const currentCoords = getSeatCoords(capacidadAula)
    const todos = currentCoords.map((seat, idx) => {
      if (idx === miAsiento) {
        const activo = avatarConfirmado || miAvatar
        return {
          id: 'player-1',
          nombre: activo.nombre || 'Tú',
          seatIndex: miAsiento,
          baseType: activo.baseType,
          colorPelo: activo.colorPelo,
          tieneGorro: activo.tieneGorro,
          colorRopa: activo.colorRopa,
          isPlayer: true,
        }
      }
      return {
        id: `bot-${idx + 1}`,
        nombre: NOMBRES_MOCK[idx % NOMBRES_MOCK.length] || `Alumno ${idx + 1}`,
        seatIndex: idx,
        baseType: BASES_DISPONIBLES[idx % BASES_DISPONIBLES.length],
        colorPelo: OPCIONES_PELO[idx % OPCIONES_PELO.length].hex,
        tieneGorro: idx % 2 === 0,
        colorRopa: OPCIONES_ROPA[idx % OPCIONES_ROPA.length].hex,
        isPlayer: false,
      }
    })
    setMockStudents(todos)
  }

  const students = isLive ? externalStudents : mockStudents
  const porcentajeLleno = Math.min(100, Math.round((students.length / capacidadAula) * 100))
  const seatCoords = getSeatCoords(capacidadAula)
  const numRows = Math.max(3, Math.ceil(capacidadAula / 4))
  const svgHeight = 195 + (numRows - 1) * 135 + 95

  // Modo Infinito: añade automáticamente una fila de pupitres vacíos cuando se llena el aforo
  useEffect(() => {
    if (modoInfinito && students.length >= capacidadAula) {
      setCapacidadAula((prev) => prev + 4)
    }
  }, [modoInfinito, students.length, capacidadAula])

  return (
    <div className="sala-page-wrapper">
      <style>{`
        .sala-page-wrapper {
          min-height: 100vh;
          width: 100%;
          background: #F8F4EC;
          color: #18181B;
          font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
          display: flex;
          flex-direction: column;
          align-items: stretch;
          padding: 0;
          box-sizing: border-box;
          position: relative;
        }

        .sala-card-container {
          width: 100%;
          max-width: 100%;
          min-height: 100vh;
          background: #F8F4EC;
          border-radius: 0;
          box-shadow: none;
          overflow: hidden;
          border: none;
          display: flex;
          flex-direction: column;
        }

        .sala-top-banner {
          background: #4A1A1C;
          color: #FFFFFF;
          padding: 16px 28px;
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.2);
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

        .btn-sala-iniciar {
          background: #22C55E;
          color: #0F172A;
          border: 2px solid #18181B;
          padding: 8px 18px;
          border-radius: 14px;
          font-size: 13px;
          font-weight: 800;
          cursor: pointer;
          box-shadow: 0 4px 0 #18181B;
          transition: transform 0.1s ease, filter 0.15s ease;
        }

        .btn-sala-iniciar:hover:not(:disabled) {
          background: #4ADE80;
          transform: translateY(-2px);
          box-shadow: 0 6px 0 #18181B;
        }

        .btn-sala-iniciar:disabled {
          background: #94A3B8;
          color: #475569;
          cursor: not-allowed;
          box-shadow: none;
        }

        .sala-canvas-stage {
          background: #F8F4EC;
          position: relative;
          width: 100%;
          flex: 1;
          padding: 14px 20px 24px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          overflow-y: auto;
          max-height: min(72vh, 660px);
        }

        .sala-canvas-stage::-webkit-scrollbar {
          width: 8px;
        }
        .sala-canvas-stage::-webkit-scrollbar-track {
          background: #EFE8DD;
          border-radius: 4px;
        }
        .sala-canvas-stage::-webkit-scrollbar-thumb {
          background: #C5B7A1;
          border-radius: 4px;
        }
        .sala-canvas-stage::-webkit-scrollbar-thumb:hover {
          background: #4A1A1C;
        }

        .classroom-svg {
          width: 100%;
          max-width: 1100px;
          height: auto;
          display: block;
        }

        .sala-aforo-controls {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #FFFFFF;
          border: 2px solid #18181B;
          border-radius: 12px;
          padding: 3px 8px;
          box-shadow: 0 2px 0 #18181B;
        }

        .sala-aforo-label {
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          color: #4A1A1C;
        }

        .btn-aforo-stepper {
          width: 24px;
          height: 24px;
          border-radius: 6px;
          border: 1.5px solid #18181B;
          background: #F4F1EA;
          color: #18181B;
          font-weight: 900;
          font-size: 14px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          line-height: 1;
          transition: background 0.15s ease, transform 0.1s ease;
        }

        .btn-aforo-stepper:hover:not(:disabled) {
          background: #FACC15;
          transform: translateY(-1px);
        }

        .btn-aforo-stepper:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .sala-aforo-val {
          font-size: 13px;
          font-weight: 900;
          color: #18181B;
          min-width: 20px;
          text-align: center;
        }

        .btn-aforo-infinito {
          background: #F4F1EA;
          border: 1.5px solid #18181B;
          border-radius: 8px;
          padding: 3px 8px;
          font-size: 11px;
          font-weight: 800;
          color: #18181B;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          margin-left: 2px;
          transition: all 0.15s ease;
        }

        .btn-aforo-infinito:hover {
          background: #FACC15;
        }

        .btn-aforo-infinito.active {
          background: #86EFAC;
          box-shadow: 0 1px 0 #18181B;
        }

        .sala-footer-legal {
          background: #FFFFFF;
          border-top: 1px solid #E2D9CC;
          padding: 12px 28px;
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
          max-width: 490px;
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
          padding: 5px 14px;
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

        /* Galería visual con las caras de los 5 avatares */
        .base-faces-gallery {
          display: grid;
          grid-template-columns: repeat(5, 1fr);
          gap: 8px;
          width: 100%;
        }

        .btn-face-card {
          background: #F4F1EA;
          border: 2.5px solid #18181B;
          border-radius: 16px;
          padding: 6px 4px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: 0 2px 0 #18181B;
          transition: transform 0.15s cubic-bezier(0.175, 0.885, 0.32, 1.275), background 0.15s ease, box-shadow 0.15s ease;
        }

        .btn-face-card:hover {
          background: #FFFBEB;
          transform: translateY(-2px);
        }

        .btn-face-card.active {
          background: #FACC15;
          box-shadow: 0 4px 0 #18181B;
          transform: translateY(-3px);
          border-color: #18181B;
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

        .swatch-indicator {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #FFFFFF;
          border: 1.5px solid #18181B;
          box-shadow: 0 1px 2px rgba(0,0,0,0.3);
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
        <div className="avatar-modal-overlay" onClick={cancelarPersonalizacion}>
          <div className="avatar-modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">Personaliza tu Personaje</h2>
                <p className="modal-subtitle">Modifica tu estilo o genera otro aleatorio</p>
              </div>
              <button
                type="button"
                className="btn-modal-close"
                onClick={cancelarPersonalizacion}
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
                  Generar aleatorio
                </button>
              </div>

              {/* Selector de tipo de base con galería visual de las 5 caras */}
              <div className="selector-section">
                <span className="selector-label">1. Elige tu base de personaje</span>
                <div className="base-faces-gallery">
                  {BASES_CATALOGO.map((b) => (
                    <button
                      key={b.id}
                      type="button"
                      className={`btn-face-card ${miAvatar.baseType === b.id ? 'active' : ''}`}
                      onClick={() => setMiAvatar((prev) => ({ ...prev, baseType: b.id }))}
                      title={b.label}
                      aria-label={b.label}
                    >
                      <AvatarGeometrico
                        standalone
                        size={46}
                        baseType={b.id}
                        colorPelo={miAvatar.colorPelo}
                        colorRopa={miAvatar.colorRopa}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Opciones fijas de personalización para todos los avatares */}
              <div className="selector-section">
                <div>
                  <span className="selector-label" style={{ display: 'block', marginBottom: '8px' }}>
                    2. Color de sudadera/ropa
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
                          <span className="swatch-indicator" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="selector-label" style={{ display: 'block', marginBottom: '8px' }}>
                    3. Color de pelo
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
                          <span className="swatch-indicator" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Botón de confirmación */}
              <button
                type="button"
                className="btn-confirm-avatar"
                onClick={confirmarMiAvatar}
              >
                Guardar cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenedor blanco principal de la sala */}
      <div className="sala-card-container">
        {/* Cabecera superior con estado, URL de acceso y PIN */}
        <div className="sala-top-banner">
          <div>
            <div className="sala-badge-live">
              <span className="sala-dot-pulse" />
              <span>{isHost ? 'SALA DE AULA ACTIVA' : 'SALA DE ESPERA'}</span>
            </div>
            <h1 className="sala-title-main" style={{ fontSize: 22, margin: '6px 0 0' }}>
              Aula Virtual · Chavales Legales
            </h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            {displayUrl && (
              <div
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1.5px solid rgba(255, 255, 255, 0.25)',
                  borderRadius: 14,
                  padding: '6px 14px',
                  textAlign: 'right',
                }}
              >
                <span style={{ display: 'block', fontSize: 10, fontWeight: 800, color: '#FACC15', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                  Enlace de sala
                </span>
                <span style={{ fontSize: 13, fontWeight: 700, color: '#FFFFFF', letterSpacing: '0.02em', fontFamily: 'monospace' }}>
                  {displayUrl}
                </span>
              </div>
            )}

            <div className="sala-pin-pill">
              <span className="sala-pin-label">CÓDIGO PIN</span>
              <span className="sala-pin-value">{pin || cleanPin}</span>
            </div>
          </div>
        </div>

        {/* Barra de progreso y acciones */}
        <div className="sala-subbar">
          <div className="sala-counter-wrap">
            <span className="sala-counter-text">
              Alumnos en el aula: <b>{students.length}</b> / {capacidadAula}
            </span>
            <div className="sala-progress-track">
              <div
                className="sala-progress-fill"
                style={{ width: `${porcentajeLleno}%` }}
              />
            </div>

            {/* Controles de gestión de aforo para el profesor */}
            {(isHost || !isLive) && (
              <div className="sala-aforo-controls">
                <span className="sala-aforo-label">Aforo:</span>
                <button
                  type="button"
                  className="btn-aforo-stepper"
                  onClick={disminuirCapacidad}
                  disabled={capacidadAula <= Math.max(4, students.length)}
                  title="Reducir pupitres (-4)"
                >
                  -
                </button>
                <span className="sala-aforo-val">{capacidadAula}</span>
                <button
                  type="button"
                  className="btn-aforo-stepper"
                  onClick={aumentarCapacidad}
                  title="Añadir pupitres (+4)"
                >
                  +
                </button>
                <button
                  type="button"
                  className={`btn-aforo-infinito ${modoInfinito ? 'active' : ''}`}
                  onClick={() => setModoInfinito((prev) => !prev)}
                  title={modoInfinito ? 'Modo Infinito activo (añade filas automáticamente)' : 'Activar Modo Infinito (∞)'}
                >
                  ∞ Modo Infinito
                </button>
              </div>
            )}

            {/* Indicador de pupitre y botón de personalización para el alumno */}
            {!isHost && currentSeat !== null && (
              <span
                style={{
                  background: '#FEF08A',
                  color: '#854D0E',
                  border: '1.5px solid #EAB308',
                  borderRadius: 999,
                  padding: '3px 12px',
                  fontSize: 12,
                  fontWeight: 800,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                Tu pupitre: #{currentSeat + 1}
              </span>
            )}

            {!isHost && (
              <button
                type="button"
                className="btn-avatar-edit"
                onClick={abrirPersonalizador}
                title="Personalizar mi personaje"
              >
                Personalizar avatar
              </button>
            )}
          </div>

          <div className="sala-actions">
            {!isLive ? (
              <>
                <button
                  type="button"
                  className="btn-sala-pill"
                  onClick={reiniciarAula}
                  title="Vaciar las sillas para volver a ver la animación"
                >
                  Reiniciar
                </button>
                <button
                  type="button"
                  className="btn-sala-pill"
                  onClick={llenarAula}
                  title="Llenar todos los pupitres de inmediato"
                >
                  Llenar aula
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
              </>
            ) : customActions ? (
              customActions
            ) : isHost && onIniciar ? (
              <button
                type="button"
                className="btn-sala-iniciar"
                onClick={onIniciar}
                disabled={students.length === 0}
                title={students.length === 0 ? 'Esperando alumnos' : 'Iniciar la actividad'}
              >
                Iniciar partida ({students.length})
              </button>
            ) : !isHost ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>
                  Esperando a que el profesor inicie la partida...
                </span>
                {onVolver && (
                  <button
                    type="button"
                    className="btn-sala-volver"
                    style={{ background: '#EF4444', borderColor: '#DC2626' }}
                    onClick={onVolver}
                  >
                    Salir
                  </button>
                )}
              </div>
            ) : null}

            {isLive && isHost && onVolver && (
              <button
                type="button"
                className="btn-sala-volver"
                onClick={onVolver}
              >
                Cerrar sala
              </button>
            )}
          </div>
        </div>

        {/* Escenario del aula en SVG puro */}
        <div className="sala-canvas-stage">
          <svg
            className="classroom-svg"
            viewBox={`0 0 960 ${svgHeight}`}
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

            <rect x="0" y="133" width="960" height={svgHeight - 133} fill="#F8F4EC" />
            {Array.from({ length: numRows - 1 }, (_, i) => {
              const lineY = 260 + i * 135
              return (
                <line
                  key={`floor-line-${i}`}
                  x1="0"
                  y1={lineY}
                  x2="960"
                  y2={lineY}
                  stroke="#ECE2D0"
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />
              )
            })}
            <line x1="240" y1="133" x2="160" y2={svgHeight} stroke="#EFE5D5" strokeWidth="1.5" />
            <line x1="480" y1="133" x2="480" y2={svgHeight} stroke="#EFE5D5" strokeWidth="1.5" />
            <line x1="720" y1="133" x2="800" y2={svgHeight} stroke="#EFE5D5" strokeWidth="1.5" />

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
            {seatCoords.map((seat) => {
              const student = students.find((s) => s.seatIndex === seat.id)
              const { x, y } = seat
              const isMe = student && ((!isHost && (currentSeat !== null && currentSeat !== undefined ? seat.id === currentSeat : seat.id === 0)) || Boolean(student.isPlayer))
              const activeAvatar = isMe ? (avatarConfirmado || miAvatar) : student
              const activeBase = (activeAvatar && activeAvatar.baseType) || (student && student.avatarTipo !== undefined ? BASES_DISPONIBLES[student.avatarTipo % BASES_DISPONIBLES.length] : 1)
              const activePelo = (activeAvatar && activeAvatar.colorPelo) || OPCIONES_PELO[seat.id % OPCIONES_PELO.length].hex
              const activeRopa = (activeAvatar && activeAvatar.colorRopa) || OPCIONES_ROPA[(seat.id + 1) % OPCIONES_ROPA.length].hex
              const activeGorro = activeAvatar ? Boolean(activeAvatar.tieneGorro) : false

              return (
                <g
                  key={`seat-${seat.id}`}
                  id={`desk-group-${seat.id}`}
                  onClick={isMe ? abrirPersonalizador : undefined}
                  style={{ cursor: isMe ? 'pointer' : 'default' }}
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
                        baseType={activeBase}
                        colorPelo={activePelo}
                        tieneGorro={activeGorro}
                        colorRopa={activeRopa}
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
                      {/* Fondo blanco puro o dorado si es el alumno actual */}
                      <rect
                        x={x - (isMe ? 54 : 48)}
                        y={y - 74}
                        width={isMe ? 108 : 96}
                        height={24}
                        rx={12}
                        fill={isMe ? '#FEF08A' : '#FFFFFF'}
                        stroke={isMe ? '#CA8A04' : '#18181B'}
                        strokeWidth={isMe ? '2.8' : '2.2'}
                        filter="url(#cardShadow)"
                      />
                      {/* Punto verde de conexión */}
                      <circle cx={x - (isMe ? 40 : 36)} cy={y - 62} r={3.5} fill={isMe ? '#CA8A04' : '#22C55E'} />
                      {/* Nombre del alumno */}
                      <text
                        x={x + 4}
                        y={y - 58}
                        textAnchor="middle"
                        fontSize="11"
                        fontWeight={isMe ? '900' : '800'}
                        fill="#18181B"
                        letterSpacing="0.02em"
                      >
                        {isMe ? `${student.nombre || 'Tú'} (Tú)` : student.nombre}
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
