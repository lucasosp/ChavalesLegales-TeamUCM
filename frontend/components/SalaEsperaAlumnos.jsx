'use client'

import { useState, useEffect } from 'react'

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
}) {
  const isLive = Array.isArray(externalStudents)
  const cleanPin = rawCleanPin || (pin ? String(pin).replace(/\s+/g, '') : '')
  const displayUrl = roomUrl || (cleanPin ? `http://localhost:3001/profesores/sala/${cleanPin}` : '')
  // Estado local para los alumnos en la sala de espera simulada
  const [mockStudents, setMockStudents] = useState([])

  // Simulación de entrada paulatina de alumnos solo si NO estamos en modo en vivo
  useEffect(() => {
    if (isLive) return
    if (mockStudents.length >= TOTAL_SEATS) return

    const timer = setTimeout(() => {
      setMockStudents((prev) => {
        if (prev.length >= TOTAL_SEATS) return prev
        const nextIndex = prev.length
        const nuevo = {
          id: `alumno-${nextIndex + 1}`,
          nombre: NOMBRES_MOCK[nextIndex] || `Alumno ${nextIndex + 1}`,
          seatIndex: nextIndex,
          avatarTipo: nextIndex % 6,
        }
        return [...prev, nuevo]
      })
    }, 2400)

    return () => clearTimeout(timer)
  }, [isLive, mockStudents.length])

  // Helpers para testing rápido
  const reiniciarAula = () => setMockStudents([])
  const llenarAula = () => {
    const todos = SEAT_COORDS.map((seat, idx) => ({
      id: `alumno-${idx + 1}`,
      nombre: NOMBRES_MOCK[idx] || `Alumno ${idx + 1}`,
      seatIndex: idx,
      avatarTipo: idx % 6,
    }))
    setMockStudents(todos)
  }

  const students = isLive ? externalStudents : mockStudents
  const porcentajeLleno = Math.min(100, Math.round((students.length / TOTAL_SEATS) * 100))

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
          padding: 14px 20px 20px;
          box-sizing: border-box;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        .classroom-svg {
          width: 100%;
          max-width: 1100px;
          height: auto;
          display: block;
          max-height: calc(100vh - 180px);
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

        @keyframes pulseAnim {
          0%, 100% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.3); opacity: 0.6; }
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
              Alumnos en el aula: <b>{students.length}</b> / {TOTAL_SEATS}
            </span>
            <div className="sala-progress-track">
              <div
                className="sala-progress-fill"
                style={{ width: `${porcentajeLleno}%` }}
              />
            </div>
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
                ⭐ Tu pupitre: #{currentSeat + 1}
              </span>
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
                🚀 Iniciar partida ({students.length})
              </button>
            ) : !isHost ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 13, color: '#64748B', fontWeight: 600 }}>
                  ⏳ Esperando a que el profesor inicie la partida...
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

            {isHost && onVolver && (
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
            {/* Pared trasera con paneles */}
            <rect x="0" y="0" width="960" height="130" fill="#EFE8DD" />
            <line x1="0" y1="130" x2="960" y2="130" stroke="#4A1A1C" strokeWidth="6" />

            {/* Suelo poligonal estilo Duolingo con baldosas sutiles */}
            <rect x="0" y="133" width="960" height="427" fill="#F8F4EC" />
            {/* Líneas geométricas de la perspectiva del suelo */}
            <line x1="0" y1="260" x2="960" y2="260" stroke="#ECE2D0" strokeWidth="2" strokeDasharray="6 6" />
            <line x1="0" y1="395" x2="960" y2="395" stroke="#ECE2D0" strokeWidth="2" strokeDasharray="6 6" />
            <line x1="240" y1="133" x2="160" y2="560" stroke="#EFE5D5" strokeWidth="1.5" />
            <line x1="480" y1="133" x2="480" y2="560" stroke="#EFE5D5" strokeWidth="1.5" />
            <line x1="720" y1="133" x2="800" y2="560" stroke="#EFE5D5" strokeWidth="1.5" />

            {/* ==========================================================
                PIZARRA DIGITAL FRONTAL
               ========================================================== */}
            <g transform="translate(240, 18)">
              {/* Marco de madera de la pizarra */}
              <rect x="0" y="0" width="480" height="96" rx="14" fill="#3D4A27" stroke="#18181B" strokeWidth="3" />
              {/* Superficie pizarra */}
              <rect x="10" y="10" width="460" height="76" rx="10" fill="#1F2E22" />
              {/* Título y estado en la pizarra */}
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
              {/* Mesa docente */}
              <polygon points="0,50 140,50 130,85 10,85" fill="#DDD2C0" stroke="#18181B" strokeWidth="2.5" />
              <polygon points="10,85 130,85 125,92 15,92" fill="#C5B7A1" stroke="#18181B" strokeWidth="2.5" />
              {/* Pila de libros legales */}
              <rect x="25" y="40" width="34" height="10" rx="2" fill="#4A1A1C" stroke="#18181B" strokeWidth="1.5" />
              <rect x="27" y="32" width="30" height="9" rx="2" fill="#3D4A27" stroke="#18181B" strokeWidth="1.5" />
              <rect x="29" y="25" width="26" height="8" rx="2" fill="#FACC15" stroke="#18181B" strokeWidth="1.5" />
              {/* Martillo de juez (Legal Gavel) poligonal */}
              <g transform="translate(85, 34)">
                {/* Base sonora */}
                <ellipse cx="20" cy="16" rx="14" ry="4" fill="#4A1A1C" stroke="#18181B" strokeWidth="1.5" />
                {/* Mango */}
                <line x1="8" y1="14" x2="28" y2="4" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
                {/* Cabeza del martillo */}
                <rect x="22" y="-2" width="12" height="7" rx="2" fill="#4A1A1C" stroke="#18181B" strokeWidth="1.5" transform="rotate(-30 26 2)" />
              </g>
            </g>

            {/* DECORACIÓN DERECHA: PLANTA POLIGONAL Y RELOJ */}
            <g transform="translate(840, 28)">
              {/* Reloj de pared octogonal */}
              <polygon points="20,0 40,0 52,12 52,32 40,44 20,44 8,32 8,12" fill="#3D4A27" stroke="#18181B" strokeWidth="2.5" />
              <circle cx="30" cy="22" r="14" fill="#FFFFFF" />
              <line x1="30" y1="22" x2="30" y2="13" stroke="#18181B" strokeWidth="2" strokeLinecap="round" />
              <line x1="30" y1="22" x2="37" y2="22" stroke="#FACC15" strokeWidth="2" strokeLinecap="round" />
              {/* Maceta poligonal con planta */}
              <polygon points="12,85 48,85 42,108 18,108" fill="#4A1A1C" stroke="#18181B" strokeWidth="2" />
              {/* Hojas geométricas */}
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
                <g key={`seat-${seat.id}`} id={`desk-group-${seat.id}`}>
                  {/* --- SILLA VACÍA (SIEMPRE DETRÁS DEL PUPITRE) --- */}
                  <g>
                    {/* Respaldo de la silla */}
                    <polygon
                      points={`${x - 22},${y - 28} ${x + 22},${y - 28} ${x + 18},${y - 4} ${x - 18},${y - 4}`}
                      fill={student ? '#3D4A27' : '#D8D1C4'}
                      stroke="#18181B"
                      strokeWidth="2.2"
                    />
                    {/* Faceta superior con brillo */}
                    <polygon
                      points={`${x - 22},${y - 28} ${x + 22},${y - 28} ${x + 18},${y - 22} ${x - 18},${y - 22}`}
                      fill={student ? '#4D5E33' : '#E8E2D6'}
                    />
                    {/* Asiento */}
                    <polygon
                      points={`${x - 18},${y - 4} ${x + 18},${y - 4} ${x + 14},${y + 8} ${x - 14},${y + 8}`}
                      fill={student ? '#2A3519' : '#C2BAAC'}
                      stroke="#18181B"
                      strokeWidth="1.8"
                    />
                  </g>

                  {/* --- AVATAR POLIGONAL DEL ALUMNO (SI ESTÁ SENTADO) --- */}
                  {student && (
                    <g
                      className="anim-pop-avatar"
                      style={{ transformOrigin: `${x}px ${y}px` }}
                    >
                      {/* Cuerpo / Sudadera poligonal */}
                      {renderAvatarBody(x, y, student.avatarTipo)}

                      {/* Cabeza poligonal y cara Duolingo */}
                      {renderAvatarHead(x, y, student.avatarTipo)}
                    </g>
                  )}

                  {/* --- PUPITRE DE MADERA POLIGONAL (EN FRENTE DEL ALUMNO) --- */}
                  <g filter="url(#deskShadow)">
                    {/* Patas metálicas oscuras */}
                    <line x1={x - 46} y1={y + 40} x2={x - 46} y2={y + 60} stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />
                    <line x1={x + 46} y1={y + 40} x2={x + 46} y2={y + 60} stroke="#18181B" strokeWidth="3.5" strokeLinecap="round" />

                    {/* Superficie superior del pupitre (Trapecio con perspectiva) */}
                    <polygon
                      points={`${x - 64},${y + 4} ${x + 64},${y + 4} ${x + 54},${y + 36} ${x - 54},${y + 36}`}
                      fill="#FAF7F0"
                      stroke="#18181B"
                      strokeWidth="2.5"
                    />

                    {/* Canto frontal biselado */}
                    <polygon
                      points={`${x - 54},${y + 36} ${x + 54},${y + 36} ${x + 50},${y + 44} ${x - 50},${y + 44}`}
                      fill="#DFD7C7"
                      stroke="#18181B"
                      strokeWidth="2.5"
                    />
                  </g>

                  {/* --- ELEMENTO ENCIMA DEL PUPITRE (VACÍO O CON UTENSILIOS) --- */}
                  {!student ? (
                    // Indicador de pupitre vacío
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
                    // Manos del alumno y utensilio sobre el pupitre
                    <g>
                      {/* Manos apoyadas en la mesa */}
                      <ellipse cx={x - 24} cy={y + 16} rx="4.5" ry="3.5" fill="#FCD5B5" stroke="#18181B" strokeWidth="1.2" />
                      <ellipse cx={x + 24} cy={y + 16} rx="4.5" ry="3.5" fill="#FCD5B5" stroke="#18181B" strokeWidth="1.2" />

                      {/* Objeto sobre el pupitre según avatarTipo */}
                      {renderDeskItem(x, y, student.avatarTipo)}
                    </g>
                  )}

                  {/* --- CARTEL FLOTANTE CON NOMBRE DEL ALUMNO --- */}
                  {student && (() => {
                    const isMe = !isHost && (seat.id === currentSeat)
                    return (
                      <g
                        className="anim-name-float"
                        style={{ transformOrigin: `${x}px ${y - 60}px` }}
                      >
                        {/* Fondo blanco puro o dorado si es el alumno actual */}
                        <rect
                          x={x - 52}
                          y={y - 74}
                          width="104"
                          height="24"
                          rx="12"
                          fill={isMe ? '#FEF08A' : '#FFFFFF'}
                          stroke={isMe ? '#CA8A04' : '#18181B'}
                          strokeWidth={isMe ? '2.8' : '2.2'}
                          filter="url(#cardShadow)"
                        />
                        {/* Punto verde de conexión */}
                        <circle cx={x - 40} cy={y - 62} r="3.5" fill={isMe ? '#CA8A04' : '#22C55E'} />
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
                          {isMe ? `⭐ ${student.nombre}` : student.nombre}
                        </text>
                      </g>
                    )
                  })()}
                </g>
              )
            })}
          </svg>
        </div>
      </div>
    </div>
  )
}

// ============================================================================
// HELPERS SVG POLIGONALES PARA AVATARES (ESTILO DUOLINGO)
// ============================================================================

function renderAvatarBody(x, y, tipo) {
  // Paleta corporativa: Granate (#4A1A1C), Verde oliva (#3D4A27), Amarillo (#FACC15), Verde claro (#86EFAC)
  const COLORES_TORSO = [
    { base: '#4A1A1C', sombra: '#320F11', detalle: '#FACC15' }, // Granate
    { base: '#3D4A27', sombra: '#273117', detalle: '#86EFAC' }, // Verde oliva
    { base: '#FACC15', sombra: '#D4A808', detalle: '#4A1A1C' }, // Amarillo
    { base: '#86EFAC', sombra: '#5BC285', detalle: '#3D4A27' }, // Verde claro
    { base: '#4A1A1C', sombra: '#320F11', detalle: '#86EFAC' }, // Granate + verde
    { base: '#3D4A27', sombra: '#273117', detalle: '#FACC15' }, // Verde + amarillo
  ]

  const color = COLORES_TORSO[tipo % COLORES_TORSO.length]

  return (
    <g>
      {/* Torso poligonal (trapecio) */}
      <polygon
        points={`${x - 26},${y + 4} ${x + 26},${y + 4} ${x + 20},${y - 24} ${x - 20},${y - 24}`}
        fill={color.base}
        stroke="#18181B"
        strokeWidth="2.2"
      />
      {/* Sombra lateral para efecto facetado 2.5D */}
      <polygon
        points={`${x + 10},${y + 4} ${x + 26},${y + 4} ${x + 20},${y - 24} ${x + 8},${y - 24}`}
        fill={color.sombra}
      />
      {/* Cuello / cremallera */}
      <line x1={x} y1={y - 24} x2={x} y2={y - 6} stroke={color.detalle} strokeWidth="2.5" strokeLinecap="round" />
    </g>
  )
}

function renderAvatarHead(x, y, tipo) {
  // Cuello
  const cuello = (
    <polygon
      points={`${x - 6},${y - 24} ${x + 6},${y - 24} ${x + 4},${y - 19} ${x - 4},${y - 19}`}
      fill="#FCD5B5"
      stroke="#18181B"
      strokeWidth="1.5"
    />
  )

  // Cara poligonal geométrica
  const cara = (
    <g>
      {cuello}
      <polygon
        points={`${x - 16},${y - 36} ${x - 12},${y - 22} ${x + 12},${y - 22} ${x + 16},${y - 36} ${x + 10},${y - 48} ${x - 10},${y - 48}`}
        fill="#FDE0C5"
        stroke="#18181B"
        strokeWidth="2"
      />
      {/* Ojos estilo Duolingo (círculos oscuros con brillo blanco) */}
      <circle cx={x - 6} cy={y - 34} r="2.8" fill="#18181B" />
      <circle cx={x - 5.2} cy={y - 35} r="0.9" fill="#FFFFFF" />
      <circle cx={x + 6} cy={y - 34} r="2.8" fill="#18181B" />
      <circle cx={x + 6.8} cy={y - 35} r="0.9" fill="#FFFFFF" />
      {/* Sonrisa amigable */}
      <path
        d={`M ${x - 4} ${y - 27} Q ${x} ${y - 24} ${x + 4} ${y - 27}`}
        stroke="#18181B"
        strokeWidth="1.8"
        fill="none"
        strokeLinecap="round"
      />
      {/* Mejillas sonrosadas */}
      <ellipse cx={x - 9} cy={y - 29} rx="2.5" ry="1.5" fill="#F43F5E" opacity="0.45" />
      <ellipse cx={x + 9} cy={y - 29} rx="2.5" ry="1.5" fill="#F43F5E" opacity="0.45" />
    </g>
  )

  // Peinado o accesorios distintivos según el tipo
  switch (tipo) {
    case 0:
      // Moño alto / coleta poligonal con detalle amarillo
      return (
        <g>
          {cara}
          <polygon points={`${x - 14},${y - 44} ${x + 14},${y - 44} ${x + 12},${y - 38} ${x - 12},${y - 38}`} fill="#4A2810" stroke="#18181B" strokeWidth="1.8" />
          <circle cx={x} cy={y - 53} r="7" fill="#4A2810" stroke="#18181B" strokeWidth="2" />
          <rect x={x - 4} y={y - 47} width="8" height="3" rx="1.5" fill="#FACC15" />
        </g>
      )
    case 1:
      // Pelo corto angular con gafas poligonales
      return (
        <g>
          {cara}
          <polygon points={`${x - 14},${y - 46} ${x - 6},${y - 52} ${x + 8},${y - 50} ${x + 14},${y - 42} ${x - 12},${y - 42}`} fill="#18181B" />
          {/* Gafas poligonales */}
          <rect x={x - 11} y={y - 38} width="9" height="7" rx="1.5" fill="none" stroke="#18181B" strokeWidth="2" />
          <rect x={x + 2} y={y - 38} width="9" height="7" rx="1.5" fill="none" stroke="#18181B" strokeWidth="2" />
          <line x1={x - 2} y1={y - 35} x2={x + 2} y2={y - 35} stroke="#18181B" strokeWidth="2" />
        </g>
      )
    case 2:
      // Gorra verde bosque hacia atrás con visera amarilla
      return (
        <g>
          {cara}
          <polygon points={`${x - 14},${y - 42} ${x + 14},${y - 42} ${x + 12},${y - 52} ${x - 12},${y - 52}`} fill="#3D4A27" stroke="#18181B" strokeWidth="2" />
          <polygon points={`${x - 16},${y - 42} ${x - 6},${y - 42} ${x - 10},${y - 45}`} fill="#FACC15" stroke="#18181B" strokeWidth="1.8" />
          <circle cx={x} cy={y - 52} r="2" fill="#FACC15" />
        </g>
      )
    case 3:
      // Cascos de gamer amarillos y diadema
      return (
        <g>
          {cara}
          {/* Diadema de cascos */}
          <path d={`M ${x - 16} ${y - 34} Q ${x} ${y - 55} ${x + 16} ${y - 34}`} stroke="#3D4A27" strokeWidth="3" fill="none" />
          {/* Almohadillas amarillas */}
          <rect x={x - 19} y={y - 39} width="5" height="10" rx="2" fill="#FACC15" stroke="#18181B" strokeWidth="1.5" />
          <rect x={x + 14} y={y - 39} width="5" height="10" rx="2" fill="#FACC15" stroke="#18181B" strokeWidth="1.5" />
          {/* Flequillo */}
          <polygon points={`${x - 10},${y - 48} ${x},${y - 42} ${x + 10},${y - 48}`} fill="#6B3A1C" />
        </g>
      )
    case 4:
      // Melena bob geométrica granate
      return (
        <g>
          <polygon points={`${x - 18},${y - 46} ${x + 18},${y - 46} ${x + 18},${y - 26} ${x - 18},${y - 26}`} fill="#53272B" stroke="#18181B" strokeWidth="2" />
          {cara}
          <polygon points={`${x - 14},${y - 48} ${x + 6},${y - 44} ${x - 10},${y - 40}`} fill="#53272B" />
        </g>
      )
    default:
      // Pelo rizado / peinado spiky con mechones poligonales
      return (
        <g>
          {cara}
          <polygon points={`${x - 14},${y - 46} ${x - 7},${y - 54} ${x},${y - 47} ${x + 7},${y - 55} ${x + 14},${y - 46}`} fill="#2D1810" stroke="#18181B" strokeWidth="1.8" />
        </g>
      )
  }
}

function renderDeskItem(x, y, tipo) {
  // 3 tipos de objetos sobre el pupitre: Mini portátil, libreta con lápiz, o tablet legal
  const itemVariant = tipo % 3

  if (itemVariant === 0) {
    // Portátil abierto con pantalla verde clara
    return (
      <g>
        <polygon points={`${x - 14},${y + 7} ${x + 14},${y + 7} ${x + 11},${y + 24} ${x - 11},${y + 24}`} fill="#18181B" />
        <polygon points={`${x - 11},${y + 9} ${x + 11},${y + 9} ${x + 9},${y + 21} ${x - 9},${y + 21}`} fill="#86EFAC" />
      </g>
    )
  }

  if (itemVariant === 1) {
    // Libreta blanca y lápiz amarillo
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

  // Tablet con sello legal
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

