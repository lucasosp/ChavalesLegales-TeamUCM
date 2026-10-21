'use client'

import { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import SalaEsperaAlumnos from '../../components/SalaEsperaAlumnos'
import { crearSala } from '../../lib/api'
import { getWsBaseUrl, createGameSocket } from '../../lib/socket'

export default function ApartadoProfesores({ initialPin = null }) {
  const [pin, setPin] = useState(initialPin)
  const [token, setToken] = useState('')
  const [roomState, setRoomState] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const socketRef = useRef(null)

  // Recuperar sesión activa si se pasa initialPin o hay una sala abierta en sesión
  useEffect(() => {
    if (typeof window === 'undefined') return

    // Revisar si viene por query param ?sala= o props
    const searchParams = new URLSearchParams(window.location.search)
    const urlPin = initialPin || searchParams.get('sala')

    if (urlPin) {
      const cleanUrlPin = String(urlPin).replace(/\s+/g, '').trim()
      const storedToken = sessionStorage.getItem(`host_token_${cleanUrlPin}`)
      if (storedToken) {
        setPin(cleanUrlPin)
        setToken(storedToken)
      }
    }
  }, [initialPin])

  // Conexión WebSocket del anfitrión cuando hay PIN y Token
  useEffect(() => {
    if (!token || !pin) return

    const cleanPin = String(pin).replace(/\s+/g, '').trim()
    const wsBase = getWsBaseUrl()
    const wsUrl = `${wsBase}/ws/host/${cleanPin}?token=${token}`

    const socket = createGameSocket({
      url: wsUrl,
      onMessage: (data) => {
        if (data.event === 'ROOM_STATE') {
          setRoomState(data)
        }
      },
      onError: () => {
        setError('Error en la conexión con la sala en tiempo real.')
      },
      onClose: () => {
        // createGameSocket gestiona reconexión
      },
    })

    socketRef.current = socket

    return () => {
      socket.close()
    }
  }, [token, pin])

  // Activar y solicitar código automático desde el portal
  const handleSolicitarCodigo = async () => {
    setCargando(true)
    setError(null)
    try {
      const res = await crearSala('general')
      const cleanPin = String(res.pin).replace(/\s+/g, '').trim()
      if (typeof window !== 'undefined') {
        sessionStorage.setItem(`host_token_${cleanPin}`, res.host_token)
        sessionStorage.setItem('current_teacher_pin', cleanPin)
        window.history.replaceState(null, '', `/profesores?sala=${cleanPin}`)
      }
      setToken(res.host_token)
      setPin(cleanPin)
    } catch (err) {
      setError(err.message || 'No se pudo generar el código de clase.')
    } finally {
      setCargando(false)
    }
  }

  const handleCerrarSala = () => {
    socketRef.current?.close()
    socketRef.current = null
    if (typeof window !== 'undefined' && pin) {
      sessionStorage.removeItem(`host_token_${pin}`)
      sessionStorage.removeItem('current_teacher_pin')
      window.history.replaceState(null, '', '/profesores')
    }
    setPin(null)
    setToken('')
    setRoomState(null)
    setError(null)
  }

  const handleStartGame = (modo = 'juicio') => {
    socketRef.current?.send('START_GAME', { modo })
  }

  const handleReveal = () => {
    socketRef.current?.send('REVEAL')
  }

  const handleLeaderboard = () => {
    socketRef.current?.send('LEADERBOARD')
  }

  const handleNextQuestion = () => {
    socketRef.current?.send('NEXT_QUESTION')
  }

  const handleReturnToLobby = () => {
    socketRef.current?.send('RETURN_TO_LOBBY')
  }

  const cleanPin = pin ? String(pin).replace(/\s+/g, '').trim() : ''
  const formattedPin = cleanPin.length === 6 ? `${cleanPin.slice(0, 3)} ${cleanPin.slice(3)}` : cleanPin
  const roomFullUrl = cleanPin ? `http://localhost:3001/profesores/sala/${cleanPin}` : ''

  // =========================================================================
  // ESTADO 1: SALA ACTIVA EN LOBBY (SALA DE ESPERA CON PUPITRES)
  // =========================================================================
  if (pin && roomState?.state === 'LOBBY') {
    const playersCount = roomState.players?.length || 0

    const launcherActions = (
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <button
          type="button"
          className="btn-sala-iniciar"
          style={{ background: '#22C55E' }}
          onClick={() => handleStartGame('juicio')}
          disabled={playersCount === 0}
          title={playersCount === 0 ? 'Esperando a que se unan alumnos' : 'Lanzar casos reales de juicio'}
        >
          ⚖️ Lanzar Modo Juicio ({playersCount})
        </button>
        <button
          type="button"
          className="btn-sala-iniciar"
          style={{ background: '#FACC15', color: '#18181B' }}
          onClick={() => handleStartGame('historieta')}
          disabled={playersCount === 0}
          title={playersCount === 0 ? 'Esperando a que se unan alumnos' : 'Lanzar historia interactiva con dilemas'}
        >
          📖 Lanzar Modo Historieta ({playersCount})
        </button>
      </div>
    )

    return (
      <SalaEsperaAlumnos
        pin={formattedPin}
        cleanPin={cleanPin}
        students={roomState.players || []}
        isHost={true}
        roomUrl={roomFullUrl}
        customActions={launcherActions}
        onVolver={handleCerrarSala}
      />
    )
  }

  // Si se solicitó código pero está conectando con el WebSocket
  if (pin && !roomState) {
    return (
      <div className="kahoot-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{
          background: '#FFFFFF',
          border: 'none',
          borderRadius: 24,
          padding: '36px 32px',
          maxWidth: 480,
          textAlign: 'center',
          boxShadow: '0 16px 32px rgba(0,0,0,0.3)',
        }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>🏫</div>
          <h2 style={{ fontSize: 22, fontWeight: 900, color: '#4A1A1C', margin: '0 0 8px' }}>
            Iniciando Aula Virtual...
          </h2>
          <p style={{ color: '#475569', fontSize: 14, margin: '0 0 20px', fontFamily: 'monospace', fontWeight: 700 }}>
            {roomFullUrl}
          </p>
          <button
            type="button"
            onClick={handleCerrarSala}
            style={{
              background: '#EF4444',
              color: '#FFFFFF',
              border: '2px solid #18181B',
              borderRadius: 12,
              padding: '8px 18px',
              fontSize: 13,
              fontWeight: 800,
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    )
  }

  // =========================================================================
  // ESTADO 2: JUEGO EN VIVO (PREGUNTA O REVELACIÓN)
  // =========================================================================
  if (pin && (roomState?.state === 'QUESTION' || roomState?.state === 'REVEAL')) {
    const isReveal = roomState.state === 'REVEAL'
    const item = roomState.item
    const stats = roomState.answer_stats || {}
    const totalAnswers = roomState.answered_count || 0
    const totalPlayers = roomState.total_players || 0
    const isHistorieta = roomState.modo === 'historieta' || roomState.modo === 'historia'
    const colores = ['#EF4444', '#3B82F6', '#F59E0B', '#10B981']
    const simbolos = ['▲', '◆', '●', '■']

    return (
      <div className="host-game-container">
        <style>{`
          .host-game-container {
            min-height: 100vh;
            background: radial-gradient(circle at 50% 25%, #461020 0%, #2a0712 65%, #1d040c 100%);
            color: #FFFFFF;
            font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
            padding: 20px 24px 40px;
            box-sizing: border-box;
          }
          .host-topbar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 1200px;
            margin: 0 auto 20px;
            flex-wrap: wrap;
            gap: 14px;
          }
          .host-badge-phase {
            background: rgba(255, 255, 255, 0.15);
            padding: 8px 18px;
            border-radius: 999px;
            font-weight: 800;
            font-size: 14px;
            letter-spacing: 0.05em;
            color: #FACC15;
            border: 1px solid rgba(250, 204, 21, 0.4);
          }
          .host-pin-pill {
            background: #FFFFFF;
            color: #18181B;
            border: 3px solid #18181B;
            border-radius: 14px;
            padding: 6px 16px;
            font-weight: 900;
            font-size: 15px;
          }
          .host-main-board {
            max-width: 1200px;
            margin: 0 auto;
            background: #FFFFFF;
            color: #18181B;
            border-radius: 24px;
            border: none;
            box-shadow: 0 20px 40px rgba(0,0,0,0.4);
            padding: 28px 32px;
            box-sizing: border-box;
          }
          .host-case-header {
            margin-bottom: 16px;
            padding-bottom: 14px;
            border-bottom: 2px solid #E5E7EB;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-wrap: wrap;
            gap: 12px;
          }
          .host-case-title {
            font-size: 22px;
            font-weight: 900;
            color: #4A1A1C;
            margin: 0;
          }
          .host-case-tag {
            background: #FEF08A;
            color: #854D0E;
            padding: 6px 14px;
            border-radius: 999px;
            font-size: 13px;
            font-weight: 800;
          }
          .host-case-facts {
            font-size: 17px;
            line-height: 1.5;
            color: #374151;
            background: #F8FAFC;
            padding: 16px 20px;
            border-radius: 14px;
            border-left: 6px solid #4A1A1C;
            margin-bottom: 20px;
          }
          .host-question-title {
            font-size: 22px;
            font-weight: 900;
            color: #0F172A;
            margin-bottom: 20px;
          }
          .host-options-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 14px;
            margin-bottom: 24px;
          }
          .host-option-card {
            border-radius: 16px;
            padding: 18px 18px;
            color: #FFFFFF;
            font-size: 17px;
            font-weight: 800;
            display: flex;
            align-items: center;
            gap: 14px;
            border: 3px solid #18181B;
            box-shadow: 0 5px 0 #18181B;
            position: relative;
            transition: all 0.2s ease;
          }
          .host-option-symbol {
            font-size: 22px;
            width: 40px;
            height: 40px;
            border-radius: 10px;
            background: rgba(0,0,0,0.2);
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
          }
          .host-option-vote-pill {
            position: absolute;
            top: 10px;
            right: 12px;
            background: #FFFFFF;
            color: #18181B;
            font-size: 12px;
            font-weight: 900;
            padding: 4px 10px;
            border-radius: 999px;
            border: 2px solid #18181B;
          }
          .host-option-card.correct {
            border-color: #16A34A;
            box-shadow: 0 0 0 4px #22C55E, 0 6px 0 #18181B;
          }
          .host-option-card.dimmed {
            opacity: 0.35;
            filter: grayscale(0.5);
          }
          .host-verdict-box {
            background: #FEF3C7;
            border: 3px solid #D97706;
            border-radius: 14px;
            padding: 18px;
            margin-bottom: 20px;
            font-size: 16px;
            line-height: 1.5;
            color: #92400E;
          }
          .host-control-bar {
            display: flex;
            align-items: center;
            justify-content: space-between;
            flex-wrap: wrap;
            gap: 16px;
            border-top: 2px solid #E5E7EB;
            padding-top: 16px;
          }
          .host-status-counter {
            font-size: 16px;
            font-weight: 800;
            color: #18181B;
          }
          .btn-host-action {
            background: #FACC15;
            color: #18181B;
            border: 3px solid #18181B;
            border-radius: 14px;
            padding: 12px 24px;
            font-size: 15px;
            font-weight: 900;
            cursor: pointer;
            box-shadow: 0 4px 0 #18181B;
            transition: transform 0.1s ease;
          }
          .btn-host-action:hover {
            transform: translateY(-2px);
            background: #FDE047;
          }
        `}</style>

        <header className="host-topbar">
          <div className="host-badge-phase">
            {isHistorieta ? '📖 MODO HISTORIETA' : '⚖️ MODO JUICIO'} · CASO {roomState.current_index + 1} DE {roomState.total_items}
          </div>
          <div className="host-pin-pill">
            PIN: {formattedPin}
          </div>
        </header>

        <main className="host-main-board">
          <div className="host-case-header">
            <h1 className="host-case-title">{item?.titulo || `Pregunta ${roomState.current_index + 1}`}</h1>
            {item?.articulo && <span className="host-case-tag">{item.articulo}</span>}
          </div>

          {item?.hechos && (
            <div className="host-case-facts">
              <strong>{isHistorieta ? '📖 Situación planteada:' : '📋 Hechos expuestos:'}</strong> {item.hechos}
            </div>
          )}

          <div className="host-question-title">{item?.pregunta}</div>

          <div className="host-options-grid">
            {item?.opciones?.map((opc, idx) => {
              const bg = colores[idx % colores.length]
              const sym = simbolos[idx % simbolos.length]
              const isCorrect = isReveal && item.correcta === idx
              const isDimmed = isReveal && item.correcta !== idx
              const votes = stats[idx] || 0

              let cardClass = 'host-option-card'
              if (isCorrect) cardClass += ' correct'
              if (isDimmed) cardClass += ' dimmed'

              return (
                <div key={idx} className={cardClass} style={{ background: bg }}>
                  <div className="host-option-symbol">{sym}</div>
                  <div style={{ flex: 1 }}>{opc}</div>
                  {isReveal && (
                    <div className="host-option-vote-pill">
                      {votes} {votes === 1 ? 'voto' : 'votos'}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {isReveal && item?.sentencia && (
            <div className="host-verdict-box">
              <strong style={{ display: 'block', marginBottom: 4, fontSize: 16 }}>
                {isHistorieta ? '📖 Desenlace y Fundamento:' : '⚖️ Sentencia y Fundamento Legal:'}
              </strong>
              {item.sentencia}
            </div>
          )}

          <div className="host-control-bar">
            <div className="host-status-counter">
              👥 Respuestas recibidas: <b>{totalAnswers}</b> / {totalPlayers} alumnos
            </div>

            {!isReveal ? (
              <button type="button" className="btn-host-action" onClick={handleReveal}>
                {isHistorieta ? '📖 Mostrar solución y desenlace' : '⚖️ Mostrar veredicto y soluciones'}
              </button>
            ) : (
              <button type="button" className="btn-host-action" onClick={handleLeaderboard}>
                🏆 Ver clasificación de la clase →
              </button>
            )}
          </div>
        </main>
      </div>
    )
  }

  // =========================================================================
  // ESTADO 3: LEADERBOARD DE CLASE
  // =========================================================================
  if (pin && roomState?.state === 'LEADERBOARD') {
    const leaderboard = roomState.leaderboard || []
    const isLastItem = roomState.current_index + 1 >= roomState.total_items

    return (
      <div className="kahoot-page" style={{ minHeight: '100vh', padding: '30px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          maxWidth: 680,
          width: '100%',
          background: '#FFFFFF',
          borderRadius: 24,
          border: 'none',
          boxShadow: '0 20px 40px rgba(0,0,0,0.35)',
          padding: '32px 28px',
          textAlign: 'center',
        }}>
          <h1 style={{ fontSize: 26, fontWeight: 900, color: '#4A1A1C', margin: '0 0 24px' }}>
            🏆 Marcador de Clase
          </h1>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 28 }}>
            {leaderboard.slice(0, 5).map((player, idx) => (
              <div
                key={player.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  background: '#F8FAFC',
                  border: '2px solid #18181B',
                  borderRadius: 14,
                  padding: '12px 18px',
                  fontWeight: 800,
                  boxShadow: '0 3px 0 #18181B',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: '#FACC15',
                    color: '#18181B',
                    border: '2px solid #18181B',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 900,
                  }}>
                    #{idx + 1}
                  </div>
                  <span style={{ fontSize: 16 }}>{player.nombre}</span>
                  {player.streak > 1 && (
                    <span style={{ fontSize: 13, color: '#EA580C' }}>🔥 x{player.streak}</span>
                  )}
                </div>
                <div style={{ background: '#3D4A27', color: '#86EFAC', padding: '5px 12px', borderRadius: 999, fontSize: 14, fontWeight: 900 }}>
                  {player.score} pts
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleNextQuestion}
            style={{
              background: '#22C55E',
              color: '#0F172A',
              border: '3px solid #18181B',
              borderRadius: 14,
              padding: '12px 28px',
              fontSize: 16,
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: '0 4px 0 #18181B',
            }}
          >
            {isLastItem ? '🏁 Ver Podio Final' : 'Siguiente Caso →'}
          </button>
        </div>
      </div>
    )
  }

  // =========================================================================
  // ESTADO 4: PODIO FINAL
  // =========================================================================
  if (pin && roomState?.state === 'FINISHED') {
    const leaderboard = roomState.leaderboard || []
    const top1 = leaderboard[0]
    const top2 = leaderboard[1]
    const top3 = leaderboard[2]

    return (
      <div className="kahoot-page" style={{ minHeight: '100vh', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{
          maxWidth: 720,
          width: '100%',
          background: '#FFFFFF',
          borderRadius: 28,
          border: 'none',
          boxShadow: '0 24px 48px rgba(0,0,0,0.35)',
          padding: '36px 24px',
          textAlign: 'center',
        }}>
          <h1 style={{ fontSize: 28, fontWeight: 900, color: '#4A1A1C', margin: '0 0 6px' }}>
            🎉 ¡Enhorabuena, Clase Legal!
          </h1>
          <p style={{ fontSize: 15, color: '#64748B', margin: '0 0 32px' }}>
            Completasteis la dinámica con criterio y conocimiento legal.
          </p>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 16, margin: '20px 0 32px', flexWrap: 'wrap' }}>
            {top2 && (
              <div style={{ width: 140, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{top2.nombre}</span>
                <span style={{ fontSize: 13, color: '#64748B', marginBottom: 6 }}>{top2.score} pts</span>
                <div style={{ width: '100%', height: 110, background: '#E2E8F0', border: '3px solid #18181B', borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, fontWeight: 900 }}>
                  🥈
                </div>
              </div>
            )}
            {top1 && (
              <div style={{ width: 160, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontSize: 24, marginBottom: 2 }}>👑</span>
                <span style={{ fontWeight: 900, fontSize: 17, marginBottom: 4 }}>{top1.nombre}</span>
                <span style={{ fontSize: 14, color: '#854D0E', fontWeight: 800, marginBottom: 6 }}>{top1.score} pts</span>
                <div style={{ width: '100%', height: 150, background: '#FDE047', border: '3px solid #18181B', borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32, fontWeight: 900 }}>
                  🥇
                </div>
              </div>
            )}
            {top3 && (
              <div style={{ width: 140, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <span style={{ fontWeight: 800, fontSize: 15, marginBottom: 4 }}>{top3.nombre}</span>
                <span style={{ fontSize: 13, color: '#64748B', marginBottom: 6 }}>{top3.score} pts</span>
                <div style={{ width: '100%', height: 80, background: '#FED7AA', border: '3px solid #18181B', borderRadius: '14px 14px 0 0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 900 }}>
                  🥉
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={handleReturnToLobby}
              style={{
                background: '#22C55E',
                color: '#0F172A',
                border: '3px solid #18181B',
                borderRadius: 14,
                padding: '12px 22px',
                fontSize: 15,
                fontWeight: 900,
                cursor: 'pointer',
                boxShadow: '0 4px 0 #18181B',
              }}
            >
              🏫 Volver al Aula
            </button>
            <button
              type="button"
              onClick={handleCerrarSala}
              style={{
                background: '#4A1A1C',
                color: '#FFFFFF',
                border: '2px solid #18181B',
                borderRadius: 14,
                padding: '12px 22px',
                fontSize: 15,
                fontWeight: 800,
                cursor: 'pointer',
              }}
            >
              Finalizar sesión
            </button>
          </div>
        </div>
      </div>
    )
  }

  // =========================================================================
  // ESTADO INICIAL: PORTAL DE PROFESORES LIMPIO (CENTRADO EN EL MEDIO DE ALTURA)
  // =========================================================================
  return (
    <div className="kahoot-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>
      <div className="kahoot-bg-canvas" aria-hidden="true">
        <div className="bg-wave-left" />
        <div className="bg-arc-right" />
        <div className="bg-sphere-glow" />
      </div>

      <header className="kahoot-topbar" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 20 }}>
        <Link href="/" className="btn-back-home" aria-label="Volver al inicio">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          <span>Inicio</span>
        </Link>
      </header>

      <main
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px 20px 40px',
          position: 'relative',
          zIndex: 10,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <div style={{ maxWidth: 580, width: '100%', textAlign: 'center' }}>
          <div
            style={{
              background: '#FFFFFF',
              border: 'none',
              borderRadius: 28,
              boxShadow: '0 16px 36px rgba(0, 0, 0, 0.35)',
              padding: '36px 32px',
              color: '#18181B',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: 8,
                background: 'linear-gradient(90deg, #FACC15 0%, #22C55E 50%, #4A1A1C 100%)',
              }}
            />

            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                background: '#FEF08A',
                border: '3px solid #18181B',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 32,
                boxShadow: '0 4px 0 #18181B',
                marginBottom: 16,
              }}
            >
              🏫
            </div>

            <h1 style={{ fontSize: 28, fontWeight: 900, color: '#4A1A1C', margin: '0 0 10px' }}>
              Portal de Profesores
            </h1>

            <p style={{ color: '#475569', fontSize: 16, lineHeight: 1.4, margin: '0 0 28px' }}>
              Solicita un código automático para abrir el aula virtual. Los alumnos se conectarán al instante con el PIN.
            </p>

            <button
              type="button"
              onClick={handleSolicitarCodigo}
              disabled={cargando}
              style={{
                background: '#22C55E',
                color: '#0F172A',
                border: '3px solid #18181B',
                borderRadius: 18,
                padding: '16px 36px',
                fontSize: 18,
                fontWeight: 900,
                cursor: cargando ? 'wait' : 'pointer',
                boxShadow: '0 6px 0 #18181B',
                display: 'inline-flex',
                alignItems: 'center',
                gap: 12,
                transition: 'transform 0.1s ease',
              }}
            >
              <span style={{ fontSize: 22 }}>🚀</span>
              <span>{cargando ? 'Generando código...' : 'Solicitar código de clase'}</span>
            </button>

            {error && (
              <div
                style={{
                  marginTop: 18,
                  background: '#FEF2F2',
                  border: '2px solid #EF4444',
                  borderRadius: 12,
                  padding: '10px 14px',
                  color: '#B91C1C',
                  fontWeight: 700,
                  fontSize: 13,
                }}
              >
                ⚠️ {error}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
